import { Controller, Get, Param, UseGuards } from "@nestjs/common";
import { JwtAuthGuard } from "../auth/jwt-auth.guard";
import { ArtboardsService } from "./artboards.service";

@Controller("artboards")
@UseGuards(JwtAuthGuard)
export class ArtboardsController {
  constructor(private readonly service: ArtboardsService) {}

  @Get(":id")
  get(@Param("id") id: string) {
    return this.service.getArtboard(id);
  }

  @Get(":id/layers")
  layers(@Param("id") id: string) {
    return this.service.getArtboardLayers(id);
  }

  @Get(":id/preview")
  preview(@Param("id") id: string) {
    return this.service.getArtboardPreview(id);
  }
}
