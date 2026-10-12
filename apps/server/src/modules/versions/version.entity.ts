import { Column, CreateDateColumn, Entity, PrimaryGeneratedColumn } from "typeorm";

@Entity({ name: "versions" })
export class Version {
  @PrimaryGeneratedColumn("uuid")
  id!: string;

  @Column({ type: "uuid" })
  fileId!: string;

  @Column({ type: "varchar", default: "Auto Save" })
  label!: string;

  @Column({ type: "jsonb", default: {} })
  snapshotData!: Record<string, unknown>;

  @CreateDateColumn({ type: "timestamp" })
  createdAt!: Date;
}
