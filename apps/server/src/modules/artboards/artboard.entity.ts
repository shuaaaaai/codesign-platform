import { Column, Entity, PrimaryGeneratedColumn } from "typeorm";

@Entity({ name: "artboards" })
export class Artboard {
  @PrimaryGeneratedColumn("uuid")
  id!: string;

  @Column()
  designFileId!: string;

  @Column()
  name!: string;

  @Column({ default: 0 })
  worldX!: number;

  @Column({ default: 0 })
  worldY!: number;

  @Column({ nullable: true })
  previewUrl?: string;
}
