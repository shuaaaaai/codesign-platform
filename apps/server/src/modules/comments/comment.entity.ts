import { Column, CreateDateColumn, Entity, PrimaryGeneratedColumn } from "typeorm";

@Entity({ name: "comments" })
export class Comment {
  @PrimaryGeneratedColumn("uuid")
  id!: string;

  @Column()
  artboardId!: string;

  @Column()
  authorId!: string;

  @Column()
  content!: string;

  @Column({ default: false })
  resolved!: boolean;

  @CreateDateColumn()
  createdAt!: Date;
}
