import { Column, Entity, PrimaryGeneratedColumn } from "typeorm";

@Entity({ name: "design_tokens" })
export class DesignToken {
  @PrimaryGeneratedColumn("uuid")
  id!: string;

  @Column()
  name!: string;

  @Column()
  value!: string;

  @Column()
  fileId!: string;
}
