import { Body, Controller, Get, Param, Post } from "@nestjs/common";
import { DesignFilesService } from "./design-files.service";

@Controller("design-files")
export class DesignFilesController {
  constructor(private readonly service: DesignFilesService) {}

  @Post("upload")
  upload(@Body() body: { projectId: string; name: string; source: string }) {
    return this.service.upload(body);
  }

  @Get(":id")
  get(@Param("id") id: string) {
    return this.service.get(id);
  }

  @Get(":id/artboards")
  artboards(@Param("id") id: string) {
    return this.service.artboards(id);
  }

  @Get(":id/tokens")
  tokens(@Param("id") id: string) {
    return this.service.tokens(id);
  }
}
