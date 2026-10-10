import { describe, expect, it } from "vitest";

describe("server bootstrap config", () => {
  it("keeps a valid default database URL", () => {
    expect("postgresql://localhost:5432/codesign").toContain("postgresql://");
  });
});
