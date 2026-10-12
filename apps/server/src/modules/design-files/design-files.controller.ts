import { BadRequestException, Body, Controller, Delete, Get, Param, Patch, Post, Query, Req, UploadedFile, UseGuards, UseInterceptors } from "@nestjs/common";
import { FileInterceptor } from "@nestjs/platform-express";
import type { Request } from "express";
import { DesignFilesService } from "./design-files.service";
import { UploadDesignFileDto } from "./dto/upload-design-file.dto";
import { JwtAuthGuard } from "../auth/jwt-auth.guard";
import type { JwtPayload } from "../auth/jwt.strategy";

interface UploadedDesignFile {
  originalname: string;
  buffer: Buffer;
}

@Controller("design-files")
@UseGuards(JwtAuthGuard)
export class DesignFilesController {
  constructor(private readonly service: DesignFilesService) {}

  @Get()
  list(@Query("projectId") projectId: string) {
    return this.service.listByProject(projectId);
  }

  @Post("upload")
  @UseInterceptors(
    FileInterceptor("file", {
      limits: { fileSize: 100 * 1024 * 1024 },
      fileFilter: (req, file, callback) => {
        if (!file.originalname.match(/\.(psd|psb)$/i)) {
          return callback(new BadRequestException("只允许上传 PSD/PSB 文件"), false);
        }
        callback(null, true);
      },
    }),
  )
  upload(@UploadedFile() file: UploadedDesignFile, @Body() dto: UploadDesignFileDto, @Req() req: Request & { user: JwtPayload }) {
    return this.service.uploadFile(file, dto.projectId, req.user?.sub ?? dto.userId ?? "anonymous-user");
  }

  @Post(":id/share")
  generateShareLink(@Param("id") id: string) {
    return this.service.generateShareToken(id);
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
