import { Controller, Get, Param, Query } from "@nestjs/common";
import { LayersService } from "./layers.service";
import type { CodeFormat } from "@codesign/code-generator";

@Controller("layers")
export class LayersController {
  constructor(private readonly service: LayersService) {}

  @Get(":id")
  get(@Param("id") id: string) {
    return this.service.getLayer(id);
  }

  @Get("artboard/:artboardId")
  artboardLayers(@Param("artboardId") artboardId: string) {
    return this.service.getArtboardLayers(artboardId);
  }

  @Get(":id/code")
  code(@Param("id") id: string, @Query("format") format: CodeFormat = "css") {
    return this.service.getLayerCode(id, format);
  }
}
