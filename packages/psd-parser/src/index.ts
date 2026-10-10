import { readPsd } from "ag-psd";

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

type PsdNode = {
  name?: string;
  left?: number;
  top?: number;
  right?: number;
  bottom?: number;
  hidden?: boolean;
  children?: PsdNode[];
  text?: {
    text?: string;
    style?: {
      font?: { name?: string };
      fontSize?: number;
      fillColor?: { r?: number; g?: number; b?: number };
      tracking?: number;
      leading?: number;
    };
  };
};

const toHex = (value: number) => value.toString(16).padStart(2, "0");

function rgbToHex(color?: { r?: number; g?: number; b?: number }) {
  if (!color) {
    return "#000000";
  }
  return `#${toHex(color.r ?? 0)}${toHex(color.g ?? 0)}${toHex(color.b ?? 0)}`.toUpperCase();
}

function detectType(node: PsdNode): LayerType {
  if (node.children?.length) {
    return "group";
  }
  if (node.text) {
    return "text";
  }
  return "shape";
}

function toLayer(node: PsdNode, parentId: string | undefined, id: string): ParsedLayer | null {
  if (node.hidden) {
    return null;
  }

  const left = node.left ?? 0;
  const top = node.top ?? 0;
  const right = node.right ?? left;
  const bottom = node.bottom ?? top;
  return {
    id,
    parentId,
    name: node.name ?? id,
    type: detectType(node),
    x: left,
    y: top,
    width: Math.max(0, right - left),
    height: Math.max(0, bottom - top),
    rotation: 0,
    borderRadius: 0,
    opacity: 1,
    blendMode: "normal",
    fills: [{ color: rgbToHex(node.text?.style?.fillColor), opacity: 1 }],
    borders: [],
    shadows: [],
    textStyle: node.text
      ? {
          fontFamily: node.text.style?.font?.name ?? "Inter",
          fontSize: node.text.style?.fontSize ?? 14,
          fontWeight: 400,
          lineHeight: node.text.style?.leading ?? 20,
          letterSpacing: node.text.style?.tracking ?? 0,
          textAlign: "left",
          color: rgbToHex(node.text.style?.fillColor),
        }
      : undefined,
  };
}

function flattenLayers(nodes: PsdNode[] | undefined, parentId?: string, counter: { value: number } = { value: 0 }): ParsedLayer[] {
  if (!nodes?.length) {
    return [];
  }

  const layers: ParsedLayer[] = [];
  nodes.forEach((node) => {
    counter.value += 1;
    const layer = toLayer(node, parentId, `layer-${counter.value}`);
    if (!layer) {
      return;
    }
    layers.push(layer);
    if (node.children?.length) {
      layers.push(...flattenLayers(node.children, layer.id, counter));
    }
  });
  return layers;
}

export async function parsePSD(buffer: Buffer): Promise<ParsedArtboard[]> {
  if (!Buffer.isBuffer(buffer) || buffer.length === 0) {
    throw new Error("Invalid PSD buffer");
  }

  let psd: (PsdNode & { children?: PsdNode[]; width?: number; height?: number }) | null = null;
  try {
    psd = readPsd(buffer) as PsdNode & { children?: PsdNode[]; width?: number; height?: number };
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : "unknown parse error";
    console.warn(`[psd-parser] readPsd failed, using fallback output: ${errorMessage}`);
    const fallbackLayers: ParsedLayer[] = [
      {
        id: "layer-1",
        name: "Header",
        type: "group",
        x: 0,
        y: 0,
        width: 1440,
        height: 120,
        rotation: 0,
        borderRadius: 0,
        opacity: 1,
        blendMode: "normal",
        fills: [{ color: "#FFFFFF", opacity: 1 }],
        borders: [],
        shadows: [],
      },
      {
        id: "layer-2",
        name: "Hero Button",
        type: "shape",
        x: 320,
        y: 240,
        width: 180,
        height: 56,
        rotation: 0,
        borderRadius: 16,
        opacity: 1,
        blendMode: "normal",
        fills: [{ color: "#0EA5E9", opacity: 1 }],
        borders: [],
        shadows: [],
      },
    ];
    return [
      {
        id: "artboard-1",
        name: "Default Artboard",
        width: 1440,
        height: 1024,
        worldX: 0,
        worldY: 0,
        previewUrl: undefined,
        layers: fallbackLayers,
        children: fallbackLayers,
        isFallback: true,
        parseError: errorMessage,
      },
    ];
  }
  const layers = flattenLayers(psd.children);

  return [
    {
      id: "artboard-1",
      name: psd.name ?? "Artboard 1",
      width: psd.width ?? 1440,
      height: psd.height ?? 1024,
      worldX: 0,
      worldY: 0,
      previewUrl: undefined,
      layers,
      children: layers,
    },
  ];
}
