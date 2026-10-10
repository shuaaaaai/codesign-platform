import { Body, Controller, Get, Param, Patch, Post } from "@nestjs/common";
import { CommentsService } from "./comments.service";

@Controller("comments")
export class CommentsController {
  constructor(private readonly service: CommentsService) {}

  @Get()
  list() {
    return this.service.list();
  }

  @Post()
  create(@Body() body: { artboardId: string; content: string }) {
    return this.service.create(body);
  }

  @Patch(":id/resolve")
  resolve(@Param("id") id: string) {
    return this.service.resolve(id);
  }
}
