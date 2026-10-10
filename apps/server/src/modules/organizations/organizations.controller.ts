import { Body, Controller, Get, Param, Post } from "@nestjs/common";
import { OrganizationsService } from "./organizations.service";

@Controller("organizations")
export class OrganizationsController {
  constructor(private readonly service: OrganizationsService) {}

  @Get()
  list() {
    return this.service.list();
  }

  @Post()
  create(@Body() body: { name: string }) {
    return this.service.create(body);
  }

  @Get(":id/members")
  members(@Param("id") id: string) {
    return this.service.members(id);
  }

  @Post(":id/invite")
  invite(@Param("id") id: string, @Body() body: { email: string; role: string }) {
    return this.service.invite(id, body);
  }
}
