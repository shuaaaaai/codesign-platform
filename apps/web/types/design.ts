export interface Artboard {
  id: string;
  name: string;
  width: number;
  height: number;
  worldX: number;
  worldY: number;
  previewUrl?: string;
}

export interface Collaborator {
  id: string;
  name: string;
  avatar?: string;
  color: string;
}

export interface LayerTextStyle {
  fontFamily: string;
  fontSize: number;
  fontWeight: number;
  lineHeight: number;
  letterSpacing: number;
  textAlign: string;
  color: string;
}

export interface LayerFill {
  color: string;
  opacity: number;
}

export interface LayerBorder {
  color: string;
  width: number;
  style: string;
}

export interface LayerShadow {
  x: number;
  y: number;
  blur: number;
  color: string;
  opacity: number;
}

export interface LayerNode {
  id: string;
  name: string;
  type: "group" | "text" | "shape" | "image";
  x: number;
  y: number;
  width: number;
  height: number;
  rotation: number;
  borderRadius?: number;
  opacity: number;
  blendMode?: string;
  parentId?: string | null;
  fills: LayerFill[];
  borders: LayerBorder[];
  shadows: LayerShadow[];
  textStyle?: LayerTextStyle;
  sourceAssetUrl?: string;
}

export interface CommentItem {
  id: string;
  artboardId: string;
  authorId: string;
  content: string;
  x: number;
  y: number;
  resolved: boolean;
  parentId?: string | null;
  replies?: CommentItem[];
}
