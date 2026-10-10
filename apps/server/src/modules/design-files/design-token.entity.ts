import { Column, Entity, PrimaryGeneratedColumn } from "typeorm";

@Entity({ name: "design_tokens" })
export class DesignToken {
  @PrimaryGeneratedColumn("uuid")
  id!: string;

  @Column({ type: "varchar" })
  name!: string;

  @Column({ type: "varchar" })
  value!: string;

  @Column({ type: "uuid" })
  fileId!: string;
}
