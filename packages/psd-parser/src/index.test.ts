import { describe, expect, it, vi } from "vitest";
import { parsePSD } from "./index";

vi.mock("ag-psd", () => ({
  readPsd: vi.fn(() => ({
    width: 100,
    height: 80,
    children: [
      { name: "Text", left: 10, top: 20, right: 90, bottom: 60, text: { style: { fontSize: 16, fillColor: { r: 255, g: 0, b: 0 } } } },
    ],
  })),
}));

describe("parsePSD", () => {
  it("throws for invalid buffers", async () => {
    await expect(parsePSD(Buffer.from([]))).rejects.toThrow("Invalid PSD buffer");
  });

  it("parses artboard dimensions", async () => {
    const result = await parsePSD(Buffer.from([1, 2, 3]));
    expect(result[0].width).toBe(100);
    expect(result[0].height).toBe(80);
  });

  it("extracts text style and color", async () => {
    const result = await parsePSD(Buffer.from([1]));
    expect(result[0].layers[0].type).toBe("text");
    expect(result[0].layers[0].textStyle?.fontSize).toBe(16);
    expect(result[0].layers[0].fills[0].color).toBe("#FF0000");
  });
});
