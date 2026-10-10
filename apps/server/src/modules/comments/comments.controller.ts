import { Body, Controller, Get, Param, Patch, Post, Query } from "@nestjs/common";
import { CommentsService } from "./comments.service";

@Controller("comments")
export class CommentsController {
  constructor(private readonly service: CommentsService) {}

  @Get()
  list(@Query("artboardId") artboardId: string) {
    return this.service.getComments(artboardId);
  }

  @Post()
  create(@Body() body: { artboardId: string; content: string; x: number; y: number; authorId?: string }) {
    return this.service.createComment(body);
  }

  @Patch(":id/resolve")
  resolve(@Param("id") id: string) {
    return this.service.resolveComment(id);
  }

  @Post(":id/reply")
  reply(@Param("id") id: string, @Body() body: { content: string }) {
    return this.service.replyComment(id, body.content);
  }
}
