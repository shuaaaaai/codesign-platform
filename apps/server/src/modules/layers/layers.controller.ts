import { Controller, Get, Param, Query, UseGuards } from "@nestjs/common";
import { LayersService } from "./layers.service";
import { JwtAuthGuard } from "../auth/jwt-auth.guard";

type CodeFormat = "css" | "tailwind" | "react" | "vue" | "ios" | "android";

@Controller("layers")
@UseGuards(JwtAuthGuard)
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
