import { describe, expect, it } from "vitest";
import { parsePSD } from "../index.js";

describe("psd parser", () => {
  it("returns a default artboard when a valid PSD buffer is received", async () => {
    const result = await parsePSD(Buffer.from("PSD"));
    expect(result).toHaveLength(1);
    expect(result[0]?.name).toBe("Default Artboard");
  });

  it("exposes parsed layers with coordinates", async () => {
    const result = await parsePSD(Buffer.from("PSD"));
    const layer = result[0]?.children?.[1];
    expect(layer?.name).toBe("Hero Button");
    expect(layer?.x).toBe(320);
    expect(layer?.width).toBeGreaterThan(0);
  });

  it("throws when the PSD buffer is empty", async () => {
    await expect(parsePSD(Buffer.alloc(0))).rejects.toThrow("Invalid PSD buffer");
  });
});
