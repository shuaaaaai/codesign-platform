import { Injectable, NotFoundException } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";
import { Artboard } from "./artboard.entity";
import { LayerNode } from "../layers/layer-node.entity";

@Injectable()
export class ArtboardsService {
  constructor(
    @InjectRepository(Artboard) private readonly artboardRepository: Repository<Artboard>,
    @InjectRepository(LayerNode) private readonly layerRepository: Repository<LayerNode>,
  ) {}

  async getArtboard(id: string) {
    const artboard = await this.artboardRepository.findOne({ where: { id } });
    if (!artboard) {
      throw new NotFoundException("画板不存在");
    }
    return artboard;
  }

  async getArtboardLayers(id: string) {
    const layers = await this.layerRepository.find({ where: { artboardId: id } });
    const layerMap = new Map(layers.map((layer) => [layer.id, { ...layer, children: [] as LayerNode[] }]));
    const roots: Array<LayerNode & { children: LayerNode[] }> = [];
    for (const layer of layerMap.values()) {
      if (layer.parentId && layerMap.has(layer.parentId)) {
        layerMap.get(layer.parentId)!.children.push(layer);
      } else {
        roots.push(layer);
      }
    }
    return { artboardId: id, layers: roots };
  }

  async getArtboardPreview(id: string) {
    const artboard = await this.getArtboard(id);
    return { artboardId: id, previewUrl: artboard.previewUrl };
  }
}
