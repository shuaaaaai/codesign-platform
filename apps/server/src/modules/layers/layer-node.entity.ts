import { Column, Entity, PrimaryGeneratedColumn } from "typeorm";

@Entity({ name: "layer_nodes" })
export class LayerNode {
  @PrimaryGeneratedColumn("uuid")
  id!: string;

  @Column({ type: "uuid" })
  artboardId!: string;

  @Column({ type: "uuid", nullable: true })
  parentId?: string;

  @Column({ type: "varchar" })
  name!: string;

  @Column({ type: "varchar", default: "group" })
  type!: string;

  @Column({ type: "float", default: 0 })
  x!: number;

  @Column({ type: "float", default: 0 })
  y!: number;

  @Column({ type: "float", default: 0 })
  width!: number;

  @Column({ type: "float", default: 0 })
  height!: number;
}
