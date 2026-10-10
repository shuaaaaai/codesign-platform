import { describe, expect, it } from "vitest";
import { generateCode } from "../index.js";

describe("code generator", () => {
  it("generates CSS output for a layer", () => {
    const code = generateCode({ name: "Hero Button", width: 180, height: 56, fill: "#0EA5E9" }, "css");
    expect(code).toContain("width: 180px");
    expect(code).toContain("background: #0EA5E9");
  });

  it("generates Tailwind output for the design layer", () => {
    const code = generateCode({ name: "Hero Button", width: 180, height: 56 }, "tailwind");
    expect(code).toContain("className");
    expect(code).toContain("Hero Button");
  });

  it("supports iOS and Android formats", () => {
    expect(generateCode({ name: "CTA", width: 220, height: 48, fill: "#111827" }, "ios")).toContain("UIButton");
    expect(generateCode({ name: "CTA", width: 220, height: 48, fill: "#111827" }, "android")).toContain("android:layout_width");
  });
});
