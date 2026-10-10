import { Injectable, NotFoundException } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";
import { Organization } from "./organization.entity";
import { TeamMember } from "./team-member.entity";

@Injectable()
export class OrganizationsService {
  constructor(
    @InjectRepository(Organization) private readonly orgRepository: Repository<Organization>,
    @InjectRepository(TeamMember) private readonly memberRepository: Repository<TeamMember>,
  ) {}

  list() {
    return this.orgRepository.find({ order: { createdAt: "DESC" } });
  }

  create(body: { name: string }) {
    const slug = body.name.trim().toLowerCase().replace(/\s+/g, "-");
    return this.orgRepository.save(this.orgRepository.create({ name: body.name, slug }));
  }

  async get(id: string) {
    const organization = await this.orgRepository.findOne({ where: { id } });
    if (!organization) {
      throw new NotFoundException("组织不存在");
    }
    return organization;
  }

  async update(id: string, body: { name: string }) {
    await this.orgRepository.update({ id }, { name: body.name });
    return this.get(id);
  }

  async remove(id: string) {
    await this.orgRepository.delete({ id });
    return { id, deleted: true };
  }

  members(id: string) {
    return this.memberRepository.find({ where: { organizationId: id } });
  }

  async invite(id: string, body: { email: string; role: string }) {
    const member = this.memberRepository.create({
      organizationId: id,
      userId: body.email,
      role: body.role as TeamMember["role"],
    });
    return this.memberRepository.save(member);
  }
}
