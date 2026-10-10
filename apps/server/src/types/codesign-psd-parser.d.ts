declare module "@codesign/psd-parser" {
  export type LayerType = "group" | "text" | "shape" | "image";

  export interface ParsedLayer {
    id: string;
    parentId?: string;
    name: string;
    type: LayerType;
    x: number;
    y: number;
    width: number;
    height: number;
    rotation: number;
    borderRadius: number;
    opacity: number;
    blendMode: string;
    fills: Array<{ color: string; opacity: number }>;
    borders: Array<{ color: string; width: number; style: string }>;
    shadows: Array<{ x: number; y: number; blur: number; color: string; opacity: number }>;
    textStyle?: {
      fontFamily: string;
      fontSize: number;
      fontWeight: number;
      lineHeight: number;
      letterSpacing: number;
      textAlign: string;
      color: string;
    };
    sourceAssetUrl?: string;
  }

  export interface ParsedArtboard {
    id: string;
    name: string;
    width: number;
    height: number;
    worldX: number;
    worldY: number;
    previewUrl?: string;
    layers: ParsedLayer[];
    children?: ParsedLayer[];
    isFallback?: boolean;
    parseError?: string;
  }

  export function parsePSD(buffer: Buffer): Promise<ParsedArtboard[]>;
}
