import { Injectable, NotFoundException } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";
import { generateCode, type CodeFormat } from "@codesign/code-generator";
import { LayerNode } from "./layer-node.entity";

@Injectable()
export class LayersService {
  constructor(@InjectRepository(LayerNode) private readonly layerRepository: Repository<LayerNode>) {}

  async getLayer(id: string) {
    const layer = await this.layerRepository.findOne({ where: { id } });
    if (!layer) {
      throw new NotFoundException("图层不存在");
    }
    return layer;
  }

  async getArtboardLayers(artboardId: string) {
    const layers = await this.layerRepository.find({ where: { artboardId } });
    return { artboardId, layers };
  }

  async getLayerCode(id: string, format: CodeFormat) {
    const layer = await this.getLayer(id);
    const code = generateCode(layer, format);
    return { layerId: id, format, code };
  }
}
