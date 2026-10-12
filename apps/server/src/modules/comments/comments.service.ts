import { Injectable, NotFoundException } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";
import { Comment } from "./comment.entity";

interface CreateCommentDto {
  artboardId: string;
  authorId?: string;
  content: string;
  x: number;
  y: number;
}

@Injectable()
export class CommentsService {
  constructor(@InjectRepository(Comment) private readonly commentRepository: Repository<Comment>) {}

  async createComment(dto: CreateCommentDto) {
    const comment = this.commentRepository.create({
      artboardId: dto.artboardId,
      authorId: dto.authorId ?? "anonymous-user",
      content: dto.content,
      x: dto.x,
      y: dto.y,
      resolved: false,
      parentId: null,
    });
    return this.commentRepository.save(comment);
  }

  async getComments(artboardId: string) {
    const comments = await this.commentRepository.find({ where: { artboardId } });
    const rootComments = comments.filter((item) => !item.parentId);
    return rootComments.map((comment) => ({
      ...comment,
      replies: comments.filter((item) => item.parentId === comment.id),
    }));
  }

  async resolveComment(id: string) {
    await this.commentRepository.update({ id }, { resolved: true });
    return this.commentRepository.findOne({ where: { id } });
  }

  async replyComment(id: string, content: string) {
    const parent = await this.commentRepository.findOne({ where: { id } });
    if (!parent) {
      throw new NotFoundException("评论不存在");
    }

    const reply = this.commentRepository.create({
      artboardId: parent.artboardId,
      authorId: parent.authorId,
      content,
      x: parent.x,
      y: parent.y,
      parentId: parent.id,
      resolved: false,
    });

    return this.commentRepository.save(reply);
  }
}
