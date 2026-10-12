import { Injectable, NotFoundException } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";
import { Artboard } from "../artboards/artboard.entity";
import { LayerNode } from "../layers/layer-node.entity";
import { Version } from "./version.entity";

@Injectable()
export class VersionsService {
  constructor(
    @InjectRepository(Version) private readonly versionRepository: Repository<Version>,
    @InjectRepository(Artboard) private readonly artboardRepository: Repository<Artboard>,
    @InjectRepository(LayerNode) private readonly layerRepository: Repository<LayerNode>,
  ) {}

  async createVersion(fileId: string, label = "Auto Save") {
    const artboards = await this.artboardRepository.find({ where: { designFileId: fileId } });
    const snapshotData = {} as Record<string, unknown>;
    for (const artboard of artboards) {
      const layers = await this.layerRepository.find({ where: { artboardId: artboard.id } });
      snapshotData[artboard.id] = {
        artboard: { ...artboard },
        layers,
      };
    }

    const version = this.versionRepository.create({
      fileId,
      label: label?.trim() || "Auto Save",
      snapshotData,
    });
    return this.versionRepository.save(version);
  }

  async listVersions(fileId: string) {
    const versions = await this.versionRepository.find({
      where: { fileId },
      order: { createdAt: "DESC" },
      select: ["id", "label", "createdAt"],
    });
    return versions;
  }

  async getVersion(versionId: string) {
    const version = await this.versionRepository.findOne({ where: { id: versionId } });
    if (!version) {
      throw new NotFoundException("版本不存在");
    }
    return version;
  }
}
