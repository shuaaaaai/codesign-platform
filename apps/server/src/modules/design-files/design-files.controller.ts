import { Body, Controller, Get, Param, Post, UploadedFile, UseInterceptors } from "@nestjs/common";
import { FileInterceptor } from "@nestjs/platform-express";
import { DesignFilesService } from "./design-files.service";

@Controller("design-files")
export class DesignFilesController {
  constructor(private readonly service: DesignFilesService) {}

  @Post("upload")
  @UseInterceptors(FileInterceptor("file"))
  upload(@UploadedFile() file: Express.Multer.File, @Body("projectId") projectId: string, @Body("userId") userId?: string) {
    return this.service.uploadFile(file, projectId, userId ?? "anonymous-user");
  }

  @Get(":id")
  get(@Param("id") id: string) {
    return this.service.getFile(id);
  }

  @Get(":id/artboards")
  artboards(@Param("id") id: string) {
    return this.service.getArtboards(id);
  }

  @Get(":id/tokens")
  tokens(@Param("id") id: string) {
    return this.service.getTokens(id);
  }
}
