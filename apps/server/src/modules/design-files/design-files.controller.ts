import { Body, Controller, Delete, Get, Param, Patch, Post, Query, UploadedFile, UseInterceptors } from "@nestjs/common";
import { FileInterceptor } from "@nestjs/platform-express";
import { DesignFilesService } from "./design-files.service";
import { UploadDesignFileDto } from "./dto/upload-design-file.dto";

interface UploadedDesignFile {
  originalname: string;
  buffer: Buffer;
}

@Controller("design-files")
export class DesignFilesController {
  constructor(private readonly service: DesignFilesService) {}

  @Get()
  list(@Query("projectId") projectId: string) {
    return this.service.listByProject(projectId);
  }

  @Post("upload")
  @UseInterceptors(FileInterceptor("file"))
  upload(@UploadedFile() file: UploadedDesignFile, @Body() dto: UploadDesignFileDto) {
    return this.service.uploadFile(file, dto.projectId, dto.userId ?? "anonymous-user");
  }

  @Get(":id")
  get(@Param("id") id: string) {
    return this.service.getFile(id);
  }

  @Patch(":id")
  rename(@Param("id") id: string, @Body("name") name: string) {
    return this.service.renameFile(id, name);
  }

  @Delete(":id")
  remove(@Param("id") id: string) {
    return this.service.deleteFile(id);
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
