import { describe, expect, it } from "vitest";
import { generateCode } from "./index";

const layer = {
  id: "1",
  name: "Primary Button",
  type: "shape" as const,
  x: 10,
  y: 20,
  width: 120,
  height: 48,
  rotation: 0,
  borderRadius: 12,
  opacity: 1,
  blendMode: "normal",
  fills: [{ color: "#0EA5E9", opacity: 1 }],
  borders: [],
  shadows: [],
};

describe("generateCode", () => {
  it("generates css", () => {
    const code = generateCode(layer, "css");
    expect(code).toContain("position: absolute");
    expect(code).toContain("background: #0EA5E9");
  });

  it("generates react snippet", () => {
    const code = generateCode(layer, "react");
    expect(code).toContain("export function PrimaryButton");
    expect(code).toContain("CSS Module");
  });

  it("generates android xml", () => {
    const code = generateCode(layer, "android");
    expect(code).toContain("android:layout_width");
    expect(code).toContain("#0EA5E9");
  });
});
