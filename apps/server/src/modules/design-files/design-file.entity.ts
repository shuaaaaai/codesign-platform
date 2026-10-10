import { Column, CreateDateColumn, Entity, PrimaryGeneratedColumn } from "typeorm";

@Entity({ name: "design_files" })
export class DesignFile {
  @PrimaryGeneratedColumn("uuid")
  id!: string;

  @Column()
  name!: string;

  @Column()
  projectId!: string;

  @Column({ nullable: true })
  previewUrl?: string;

  @CreateDateColumn()
  createdAt!: Date;
}
