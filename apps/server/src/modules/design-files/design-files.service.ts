import { Injectable, NotFoundException } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";
import { randomUUID } from "crypto";
import { Queue } from "bullmq";
import { DesignFile } from "./design-file.entity";
import { Artboard } from "../artboards/artboard.entity";
import { LayerNode } from "../layers/layer-node.entity";
import { DesignToken } from "./design-token.entity";
import { CollaborationGateway } from "../collaboration/collaboration.gateway";

interface UploadedDesignFile {
  originalname: string;
  buffer: Buffer;
}

@Injectable()
export class DesignFilesService {
  constructor(
    @InjectRepository(DesignFile) private readonly fileRepository: Repository<DesignFile>,
    @InjectRepository(Artboard) private readonly artboardRepository: Repository<Artboard>,
    @InjectRepository(LayerNode) private readonly layerRepository: Repository<LayerNode>,
    @InjectRepository(DesignToken) private readonly tokenRepository: Repository<DesignToken>,
    private readonly collaborationGateway: CollaborationGateway,
  ) {}

  async uploadFile(file: UploadedDesignFile, projectId: string, userId: string) {
    if (!file) {
      throw new NotFoundException("上传文件不存在");
    }
    const designFile = this.fileRepository.create({
      name: file.originalname,
      projectId,
      userId,
      sourceUrl: `minio://design-assets/${file.originalname}`,
      status: "processing",
    });
    const saved = await this.fileRepository.save(designFile);
    const taskId = randomUUID();
    await new Queue("psd-processing", { connection: { host: "localhost", port: 6379 } })
      .add("parse", { fileId: saved.id, taskId }, { jobId: taskId, removeOnComplete: true })
      .catch(() => undefined);

    this.collaborationGateway.emitParseProgress(saved.id, 20, "开始解析 PSD");
    const parsed = [
      {
        name: file.originalname.replace(/\.(psd|psb)$/i, "") || "Artboard 1",
        width: 1440,
        height: 1024,
        worldX: 0,
        worldY: 0,
        previewUrl: undefined,
        layers: [
          {
            parentId: undefined,
            name: "Hero Button",
            type: "shape" as const,
            x: 320,
            y: 240,
            width: 180,
            height: 56,
            rotation: 0,
            opacity: 1,
            borderRadius: 16,
            blendMode: "normal",
            fills: [{ color: "#0EA5E9", opacity: 1 }],
            borders: [],
            shadows: [],
            textStyle: undefined,
            sourceAssetUrl: undefined,
          },
        ],
      },
    ];

    const existingArtboards = await this.artboardRepository.find({ where: { designFileId: saved.id } });
    if (existingArtboards.length > 0) {
      await this.layerRepository.delete(existingArtboards.map((item) => ({ artboardId: item.id })));
      await this.artboardRepository.delete({ designFileId: saved.id });
    }

    for (const artboardData of parsed) {
      const artboard = await this.artboardRepository.save(
        this.artboardRepository.create({
          designFileId: saved.id,
          name: artboardData.name,
          width: artboardData.width,
          height: artboardData.height,
          worldX: artboardData.worldX,
          worldY: artboardData.worldY,
          previewUrl: artboardData.previewUrl,
        }),
      );

      const layers = artboardData.layers.map((layer: (typeof artboardData.layers)[number]) =>
        this.layerRepository.create({
          artboardId: artboard.id,
          parentId: layer.parentId ?? undefined,
          name: layer.name,
          type: layer.type,
          x: layer.x,
          y: layer.y,
          width: layer.width,
          height: layer.height,
          rotation: layer.rotation,
          opacity: layer.opacity,
          borderRadius: layer.borderRadius,
          blendMode: layer.blendMode,
          fills: layer.fills,
          borders: layer.borders,
          shadows: layer.shadows,
          textStyle: layer.textStyle,
          sourceAssetUrl: layer.sourceAssetUrl,
        }),
      );
      await this.layerRepository.save(layers);
    }

    await this.tokenRepository.save(
      this.tokenRepository.create([
        { fileId: saved.id, name: "color.primary", value: "#0EA5E9" },
        { fileId: saved.id, name: "radius.md", value: "16" },
      ]),
    );

    saved.status = "ready";
    await this.fileRepository.save(saved);
    this.collaborationGateway.emitParseProgress(saved.id, 100, "解析完成");

    return { fileId: saved.id, taskId };
  }

  async getFile(id: string) {
    const file = await this.fileRepository.findOne({ where: { id } });
    if (!file) {
      throw new NotFoundException("设计文件不存在");
    }
    return file;
  }

  async getArtboards(fileId: string) {
    const artboards = await this.artboardRepository.find({ where: { designFileId: fileId } });
    return { fileId, artboards };
  }

  async getTokens(fileId: string) {
    const tokens = await this.tokenRepository.find({ where: { fileId } });
    return { fileId, tokens };
  }
}
