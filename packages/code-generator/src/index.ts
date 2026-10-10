export type CodeFormat = "css" | "tailwind" | "react" | "vue" | "ios" | "android";

export type CodeLayer = {
  name: string;
  width?: number;
  height?: number;
  fill?: string;
  x?: number;
  y?: number;
};

/**
 * 代码生成器核心：根据设计层属性推导不同平台的代码模板。
 * 这里通过规则引擎返回稳定、可复制的代码片段，便于后续扩展为真实模板引擎。
 */
export function generateCode(layer: CodeLayer, format: CodeFormat): string {
  const fill = layer.fill ?? "#0EA5E9";
  const width = layer.width ?? 320;
  const height = layer.height ?? 72;

  switch (format) {
    case "css":
      return `.${layer.name.toLowerCase().replace(/\s+/g, "-")} {
  width: ${width}px;
  height: ${height}px;
  background: ${fill};
  border-radius: 16px;
}`;
    case "tailwind":
      return `<button className="w-[${width}px] h-[${height}px] rounded-2xl bg-[${fill}] text-white">${layer.name}</button>`;
    case "react":
      return `export function ${layer.name.replace(/\s+/g, "")}() {
  return <button style={{ width: ${width}, height: ${height}, background: "${fill}", borderRadius: 16 }}>${layer.name}</button>;
}`;
    case "vue":
      return `<template>
  <button class="btn">${layer.name}</button>
</template>

<style scoped>
.btn { width: ${width}px; height: ${height}px; background: ${fill}; border-radius: 16px; }
</style>`;
    case "ios":
      return `let button = UIButton(frame: CGRect(x: ${layer.x ?? 0}, y: ${layer.y ?? 0}, width: ${width}, height: ${height}))
button.backgroundColor = UIColor(hex: "${fill.replace("#", "")}")`;
    case "android":
      return `<Button
  android:layout_width="${width}px"
  android:layout_height="${height}px"
  android:background="${fill}"
  android:text="${layer.name}" />`;
    default:
      return "";
  }
}
