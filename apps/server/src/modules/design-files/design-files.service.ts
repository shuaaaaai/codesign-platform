import { Injectable, NotFoundException, OnModuleDestroy } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";
import { randomUUID } from "crypto";
import { Queue } from "bullmq";
import { parsePSD, type ParsedArtboard } from "@codesign/psd-parser";
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
export class DesignFilesService implements OnModuleDestroy {
  private readonly queue: Queue;

  constructor(
    @InjectRepository(DesignFile) private readonly fileRepository: Repository<DesignFile>,
    @InjectRepository(Artboard) private readonly artboardRepository: Repository<Artboard>,
    @InjectRepository(LayerNode) private readonly layerRepository: Repository<LayerNode>,
    @InjectRepository(DesignToken) private readonly tokenRepository: Repository<DesignToken>,
    private readonly collaborationGateway: CollaborationGateway,
    private readonly configService: ConfigService,
  ) {
    this.queue = new Queue("psd-processing", {
      connection: {
        host: this.configService.get<string>("REDIS_HOST") ?? "localhost",
        port: Number(this.configService.get<string>("REDIS_PORT") ?? "6379"),
      },
    });
  }

  async onModuleDestroy() {
    await this.queue.close();
  }

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

    this.collaborationGateway.emitParseProgress(saved.id, 10, "文件上传完成");
    try {
      this.collaborationGateway.emitParseProgress(saved.id, 30, "开始解析 PSD");
      const parsedArtboards: ParsedArtboard[] = await parsePSD(file.buffer);
      this.collaborationGateway.emitParseProgress(saved.id, 60, "图层解析完成");

      const existingArtboards = await this.artboardRepository.find({ where: { designFileId: saved.id } });
      if (existingArtboards.length > 0) {
        await this.layerRepository.delete(existingArtboards.map((item) => ({ artboardId: item.id })));
        await this.artboardRepository.delete({ designFileId: saved.id });
      }
      await this.tokenRepository.delete({ fileId: saved.id });
      this.collaborationGateway.emitParseProgress(saved.id, 85, "写入数据库");

      for (const artboardData of parsedArtboards) {
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

        const layerIdMap = new Map<string, string>();
        artboardData.layers.forEach((layer) => {
          layerIdMap.set(layer.id, randomUUID());
        });

        const layers = artboardData.layers.map((layer) =>
          this.layerRepository.create({
            id: layerIdMap.get(layer.id),
            artboardId: artboard.id,
            parentId: layer.parentId ? layerIdMap.get(layer.parentId) : undefined,
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

      const colorSet = new Set<string>();
      const radiusSet = new Set<number>();
      for (const artboard of parsedArtboards) {
        for (const layer of artboard.layers) {
          for (const fill of layer.fills) {
            if (fill.color && fill.color !== "transparent") {
              colorSet.add(fill.color);
            }
          }
          if (layer.borderRadius > 0) {
            radiusSet.add(layer.borderRadius);
          }
        }
      }
      const tokens = [
        ...Array.from(colorSet).map((color) => ({
          fileId: saved.id,
          name: `color.${color.toLowerCase().replace(/[^a-z0-9]/g, "") || "value"}`,
          value: color,
        })),
        ...Array.from(radiusSet).map((radius) => ({
          fileId: saved.id,
          name: `radius.${String(radius).replace(/[^0-9.]/g, "") || "value"}`,
          value: String(radius),
        })),
      ];
      if (tokens.length > 0) {
        await this.tokenRepository.save(this.tokenRepository.create(tokens));
      }
      saved.status = "ready";
      await this.fileRepository.save(saved);
      this.collaborationGateway.emitParseProgress(saved.id, 100, "解析完成");
    } catch (error) {
      saved.status = "error";
      await this.fileRepository.save(saved);
      this.collaborationGateway.emitParseProgress(saved.id, 100, "解析失败");
      throw error;
    }

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
