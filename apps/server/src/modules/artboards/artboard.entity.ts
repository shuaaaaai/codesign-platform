import { Column, Entity, PrimaryGeneratedColumn } from "typeorm";

@Entity({ name: "artboards" })
export class Artboard {
  @PrimaryGeneratedColumn("uuid")
  id!: string;

  @Column({ type: "uuid" })
  designFileId!: string;

  @Column({ type: "varchar" })
  name!: string;

  @Column({ type: "float", default: 0 })
  worldX!: number;

  @Column({ type: "float", default: 0 })
  worldY!: number;

  @Column({ type: "float", default: 0 })
  width!: number;

  @Column({ type: "float", default: 0 })
  height!: number;

  @Column({ type: "varchar", nullable: true })
  previewUrl?: string;
}
