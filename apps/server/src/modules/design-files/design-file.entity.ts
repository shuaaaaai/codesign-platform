import { Column, CreateDateColumn, Entity, PrimaryGeneratedColumn, UpdateDateColumn } from "typeorm";

export type DesignFileStatus = "uploading" | "processing" | "ready" | "error";

@Entity({ name: "design_files" })
export class DesignFile {
  @PrimaryGeneratedColumn("uuid")
  id!: string;

  @Column({ type: "varchar" })
  name!: string;

  @Column({ type: "uuid" })
  projectId!: string;

  @Column({ type: "uuid", nullable: true })
  userId?: string;

  @Column({ type: "varchar", nullable: true })
  sourceUrl?: string;

  @Column({ type: "varchar", nullable: true })
  previewUrl?: string;

  @Column({ type: "varchar", default: "uploading" })
  status!: DesignFileStatus;

  @CreateDateColumn()
  createdAt!: Date;

  @UpdateDateColumn()
  updatedAt!: Date;
}
