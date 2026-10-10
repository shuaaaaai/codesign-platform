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
  type!: "group" | "text" | "shape" | "image";

  @Column({ type: "float", default: 0 })
  x!: number;

  @Column({ type: "float", default: 0 })
  y!: number;

  @Column({ type: "float", default: 0 })
  width!: number;

  @Column({ type: "float", default: 0 })
  height!: number;

  @Column({ type: "float", default: 0 })
  rotation!: number;

  @Column({ type: "float", default: 1 })
  opacity!: number;

  @Column({ type: "float", default: 0 })
  borderRadius!: number;

  @Column({ type: "varchar", default: "normal" })
  blendMode!: string;

  @Column({ type: "jsonb", default: () => "'[]'" })
  fills!: Array<{ color: string; opacity: number }>;

  @Column({ type: "jsonb", default: () => "'[]'" })
  borders!: Array<{ color: string; width: number; style: string }>;

  @Column({ type: "jsonb", default: () => "'[]'" })
  shadows!: Array<{ x: number; y: number; blur: number; color: string; opacity: number }>;

  @Column({ type: "jsonb", nullable: true })
  textStyle?: {
    fontFamily: string;
    fontSize: number;
    fontWeight: number;
    lineHeight: number;
    letterSpacing: number;
    textAlign: string;
    color: string;
  };

  @Column({ type: "varchar", nullable: true })
  sourceAssetUrl?: string;
}
