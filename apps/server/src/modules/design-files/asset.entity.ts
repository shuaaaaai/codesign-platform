import { Column, Entity, PrimaryGeneratedColumn } from "typeorm";

@Entity({ name: "assets" })
export class Asset {
  @PrimaryGeneratedColumn("uuid")
  id!: string;

  @Column({ type: "varchar" })
  name!: string;

  @Column({ type: "varchar" })
  url!: string;

  @Column({ type: "uuid" })
  designFileId!: string;
}
