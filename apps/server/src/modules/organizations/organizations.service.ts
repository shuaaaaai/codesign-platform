import { Injectable } from "@nestjs/common";

@Injectable()
export class OrganizationsService {
  list() {
    return [{ id: "org_1", name: "Design Team", slug: "design-team" }];
  }

  create(body: { name: string }) {
    return { id: "org_2", name: body.name, createdAt: new Date().toISOString() };
  }

  members(id: string) {
    return { organizationId: id, members: [{ id: "u_1", email: "alice@example.com", role: "owner" }] };
  }

  invite(id: string, body: { email: string; role: string }) {
    return { organizationId: id, invited: body.email, role: body.role };
  }
}
