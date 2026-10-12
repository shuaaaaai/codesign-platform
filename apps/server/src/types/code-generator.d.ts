declare module "@codesign/code-generator" {
  export type CodeFormat = "css" | "tailwind" | "react" | "vue" | "ios" | "android";

  export function generateCode(layer: {
    name: string;
    x?: number;
    y?: number;
    width?: number;
    height?: number;
    borderRadius?: number;
    opacity?: number;
    fill?: string;
    fills?: Array<{ color: string; opacity: number }>;
    shadows?: Array<{ x: number; y: number; blur: number; color: string; opacity: number }>;
  }, format: CodeFormat): string;
}
