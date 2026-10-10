import { Column, Entity, PrimaryGeneratedColumn } from "typeorm";

@Entity({ name: "layer_nodes" })
export class LayerNode {
  @PrimaryGeneratedColumn("uuid")
  id!: string;

  @Column()
  artboardId!: string;

  @Column({ nullable: true })
  parentId?: string;

  @Column()
  name!: string;

  @Column({ default: "group" })
  type!: string;

  @Column({ default: 0 })
  x!: number;

  @Column({ default: 0 })
  y!: number;

  @Column({ default: 0 })
  width!: number;

  @Column({ default: 0 })
  height!: number;
}
