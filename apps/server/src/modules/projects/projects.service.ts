import { Injectable } from "@nestjs/common";

@Injectable()
export class ProjectsService {
  list() {
    return [{ id: "proj_1", name: "Marketing Site", description: "Landing page design system" }];
  }

  create(body: { name: string; description?: string }) {
    return { id: "proj_2", ...body };
  }

  remove(id: string) {
    return { id, deleted: true };
  }
}
