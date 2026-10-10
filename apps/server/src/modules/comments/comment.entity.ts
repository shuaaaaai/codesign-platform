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

  @Column({ type: "boolean", default: false })
  resolved!: boolean;

  @CreateDateColumn()
  createdAt!: Date;
}
