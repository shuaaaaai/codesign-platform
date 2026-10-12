import { Body, Controller, Get, Param, Post, UseGuards } from "@nestjs/common";
import { JwtAuthGuard } from "../auth/jwt-auth.guard";
import { VersionsService } from "./versions.service";

@Controller("design-files")
@UseGuards(JwtAuthGuard)
export class VersionsController {
  constructor(private readonly versionsService: VersionsService) {}

  @Get(":id/versions")
  listVersions(@Param("id") id: string) {
    return this.versionsService.listVersions(id);
  }

  @Post(":id/versions")
  createVersion(@Param("id") id: string, @Body("label") label?: string) {
    return this.versionsService.createVersion(id, label);
  }

  @Get(":id/versions/:vid")
  getVersion(@Param("id") id: string, @Param("vid") vid: string) {
    void id;
    return this.versionsService.getVersion(vid);
  }
}
