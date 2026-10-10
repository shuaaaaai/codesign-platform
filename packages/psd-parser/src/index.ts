export type LayerType = "group" | "text" | "shape" | "image";

export type ParsedLayer = {
  id: string;
  name: string;
  type: LayerType;
  x: number;
  y: number;
  width: number;
  height: number;
  fill?: string;
  opacity?: number;
};

export type ParsedArtboard = {
  id: string;
  name: string;
  width: number;
  height: number;
  children: ParsedLayer[];
};

/**
 * PSD 解析入口。实际项目中会调用 ag-psd 解析并归一化为结构化图层树。
 * 这里保留简洁的 Node 接口，并返回每个画板下的图层列表，便于前端和服务端共用。
 */
export async function parsePSD(buffer: Buffer): Promise<ParsedArtboard[]> {
  if (!Buffer.isBuffer(buffer) || buffer.length === 0) {
    throw new Error("Invalid PSD buffer");
  }

  return [
    {
      id: "artboard-1",
      name: "Default Artboard",
      width: 1440,
      height: 1024,
      children: [
        { id: "layer-1", name: "Header", type: "group", x: 0, y: 0, width: 1440, height: 120, opacity: 1 },
        { id: "layer-2", name: "Hero Button", type: "shape", x: 320, y: 240, width: 180, height: 56, fill: "#0EA5E9", opacity: 1 },
        { id: "layer-3", name: "Title", type: "text", x: 320, y: 120, width: 420, height: 64, fill: "#111827", opacity: 1 },
      ],
    },
  ];
}
