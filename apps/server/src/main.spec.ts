import { describe, expect, it } from "vitest";
import { normalizePort } from "./main";

describe("server bootstrap", () => {
  it("normalizes valid port values", () => {
    expect(normalizePort("4000")).toBe(4000);
    expect(normalizePort("5000")).toBe(5000);
    expect(normalizePort("not-a-number")).toBe(4000);
  });
});
