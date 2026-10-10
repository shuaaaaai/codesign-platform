import { Injectable, NotFoundException } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";
import { Project } from "./project.entity";

@Injectable()
export class ProjectsService {
  constructor(@InjectRepository(Project) private readonly projectRepository: Repository<Project>) {}

  list() {
    return this.projectRepository.find({ order: { updatedAt: "DESC" } });
  }

  create(body: { name: string; description?: string }) {
    return this.projectRepository.save(this.projectRepository.create(body));
  }

  async get(id: string) {
    const project = await this.projectRepository.findOne({ where: { id } });
    if (!project) {
      throw new NotFoundException("项目不存在");
    }
    return project;
  }

  async update(id: string, body: { name?: string; description?: string }) {
    await this.projectRepository.update({ id }, body);
    return this.get(id);
  }

  async remove(id: string) {
    await this.projectRepository.delete({ id });
    return { id, deleted: true };
  }
}
