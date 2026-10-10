import { Column, CreateDateColumn, Entity, PrimaryGeneratedColumn } from "typeorm";

@Entity({ name: "comments" })
export class Comment {
  @PrimaryGeneratedColumn("uuid")
  id!: string;

  @Column({ type: "uuid" })
  artboardId!: string;

  @Column({ type: "uuid" })
  authorId!: string;

  @Column({ type: "text" })
  content!: string;

  @Column({ type: "float", default: 0 })
  x!: number;

  @Column({ type: "float", default: 0 })
  y!: number;

  @Column({ type: "uuid", nullable: true })
  parentId?: string | null;

  @Column({ type: "boolean", default: false })
  resolved!: boolean;

  @CreateDateColumn()
  createdAt!: Date;
}
