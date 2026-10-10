import { Column, CreateDateColumn, Entity, PrimaryGeneratedColumn } from "typeorm";

@Entity({ name: "design_files" })
export class DesignFile {
  @PrimaryGeneratedColumn("uuid")
  id!: string;

  @Column({ type: "varchar" })
  name!: string;

  @Column({ type: "uuid" })
  projectId!: string;

  @Column({ type: "varchar", nullable: true })
  previewUrl?: string;

  @CreateDateColumn()
  createdAt!: Date;
}
