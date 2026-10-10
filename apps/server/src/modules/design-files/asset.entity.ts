import { Column, Entity, PrimaryGeneratedColumn } from "typeorm";

@Entity({ name: "assets" })
export class Asset {
  @PrimaryGeneratedColumn("uuid")
  id!: string;

  @Column()
  name!: string;

  @Column()
  url!: string;

  @Column()
  designFileId!: string;
}
