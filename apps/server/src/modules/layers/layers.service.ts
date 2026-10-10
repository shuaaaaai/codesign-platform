import { Injectable, NotFoundException } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";
import { LayerNode } from "./layer-node.entity";

type CodeFormat = "css" | "tailwind" | "react" | "vue" | "ios" | "android";

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
    const fill = layer.fills[0]?.color ?? "#0EA5E9";
    const codeByFormat: Record<CodeFormat, string> = {
      css: `.${layer.name.toLowerCase().replace(/\\s+/g, "-")} { width: ${layer.width}px; height: ${layer.height}px; background: ${fill}; border-radius: ${layer.borderRadius}px; }`,
      tailwind: `<div className=\"w-[${layer.width}px] h-[${layer.height}px] bg-[${fill}] rounded-[${layer.borderRadius}px]\" />`,
      react: `export function ${layer.name.replace(/\\s+/g, "")}() { return <div style={{ width: ${layer.width}, height: ${layer.height}, background: \"${fill}\" }} /> }`,
      vue: `<template><div class=\"layer\" /></template><style scoped>.layer { width: ${layer.width}px; height: ${layer.height}px; background: ${fill}; }</style>`,
      ios: `let view = UIView(frame: CGRect(x: ${layer.x}, y: ${layer.y}, width: ${layer.width}, height: ${layer.height}))`,
      android: `<View android:layout_width=\"${layer.width}dp\" android:layout_height=\"${layer.height}dp\" android:background=\"${fill}\" />`,
    };
    const code = codeByFormat[format];
    return { layerId: id, format, code };
  }
}
