import { Injectable } from "@nestjs/common";

@Injectable()
export class CommentsService {
  list() {
    return [{ id: "comment_1", artboardId: "ab_1", content: "Need a stronger CTA", resolved: false }];
  }

  create(body: { artboardId: string; content: string }) {
    return { id: "comment_2", ...body, resolved: false };
  }

  resolve(id: string) {
    return { id, resolved: true };
  }
}
