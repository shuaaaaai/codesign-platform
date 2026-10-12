import { Body, Controller, Delete, Get, Param, Patch, Post, UseGuards } from "@nestjs/common";
import { JwtAuthGuard } from "../auth/jwt-auth.guard";
import { CreateOrganizationDto } from "./dto/create-organization.dto";
import { InviteMemberDto } from "./dto/invite-member.dto";
import { UpdateOrganizationDto } from "./dto/update-organization.dto";
import { OrganizationsService } from "./organizations.service";

@Controller("organizations")
@UseGuards(JwtAuthGuard)
export class OrganizationsController {
  constructor(private readonly service: OrganizationsService) {}

  @Get()
  list() {
    return this.service.list();
  }

  @Post()
  create(@Body() body: CreateOrganizationDto) {
    return this.service.create(body);
  }

  @Get(":id")
  get(@Param("id") id: string) {
    return this.service.get(id);
  }

  @Patch(":id")
  update(@Param("id") id: string, @Body() body: UpdateOrganizationDto) {
    return this.service.update(id, body);
  }

  @Delete(":id")
  remove(@Param("id") id: string) {
    return this.service.remove(id);
  }

  @Get(":id/members")
  members(@Param("id") id: string) {
    return this.service.members(id);
  }

  @Post(":id/invite")
  invite(@Param("id") id: string, @Body() body: InviteMemberDto) {
    return this.service.invite(id, body);
  }
}
