import { Column, CreateDateColumn, Entity, PrimaryGeneratedColumn } from "typeorm";

@Entity({ name: "team_members" })
export class TeamMember {
  @PrimaryGeneratedColumn("uuid")
  id!: string;

  @Column({ type: "uuid" })
  organizationId!: string;

  @Column({ type: "uuid" })
  userId!: string;

  @Column({ type: "varchar", default: "member" })
  role!: "owner" | "admin" | "member";

  @CreateDateColumn()
  createdAt!: Date;
}
