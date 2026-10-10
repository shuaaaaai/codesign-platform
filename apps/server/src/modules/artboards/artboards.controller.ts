import { Controller, Get, Param } from "@nestjs/common";
import { ArtboardsService } from "./artboards.service";

@Controller("artboards")
export class ArtboardsController {
  constructor(private readonly service: ArtboardsService) {}

  @Get(":id")
  get(@Param("id") id: string) {
    return this.service.get(id);
  }

  @Get(":id/layers")
  layers(@Param("id") id: string) {
    return this.service.layers(id);
  }

  @Get(":id/preview")
  preview(@Param("id") id: string) {
    return this.service.preview(id);
  }
}
