import type { ParsedLayer } from "@codesign/psd-parser";

export type CodeFormat = "css" | "tailwind" | "react" | "vue" | "ios" | "android";

function className(name: string) {
  return name.toLowerCase().replace(/\s+/g, "-");
}

export function generateCode(layer: ParsedLayer, format: CodeFormat): string {
  const fillColor = layer.fills[0]?.color ?? "#0EA5E9";
  const radius = layer.borderRadius ?? 0;
  const shadow = layer.shadows[0];
  const shadowText = shadow ? `${shadow.x}px ${shadow.y}px ${shadow.blur}px ${shadow.color}` : "none";

  switch (format) {
    case "css":
      return `.${className(layer.name)} {\n  position: absolute;\n  left: ${layer.x}px;\n  top: ${layer.y}px;\n  width: ${layer.width}px;\n  height: ${layer.height}px;\n  background: ${fillColor};\n  border-radius: ${radius}px;\n  opacity: ${layer.opacity};\n  box-shadow: ${shadowText};\n}`;
    case "tailwind":
      return `<div className="absolute left-[${layer.x}px] top-[${layer.y}px] w-[${layer.width}px] h-[${layer.height}px] rounded-[${radius}px] bg-[${fillColor}] opacity-[${layer.opacity}]" />`;
    case "react":
      return `export function ${layer.name.replace(/\s+/g, "")}() {\n  return <div className={styles.${className(layer.name)}} />;\n}\n\n/* CSS Module */\n.${className(layer.name)} {\n  width: ${layer.width}px;\n  height: ${layer.height}px;\n  background: ${fillColor};\n}`;
    case "vue":
      return `<template>\n  <div class="${className(layer.name)}"></div>\n</template>\n\n<style scoped>\n.${className(layer.name)} {\n  width: ${layer.width}px;\n  height: ${layer.height}px;\n  background: ${fillColor};\n}\n</style>`;
    case "ios":
      return `let view = UIView(frame: CGRect(x: ${layer.x}, y: ${layer.y}, width: ${layer.width}, height: ${layer.height}))\nview.backgroundColor = UIColor(hex: "${fillColor.replace("#", "")}")\nview.layer.cornerRadius = ${radius}`;
    case "android":
      return `<View\n  android:layout_width="${layer.width}dp"\n  android:layout_height="${layer.height}dp"\n  android:layout_marginLeft="${layer.x}dp"\n  android:layout_marginTop="${layer.y}dp"\n  android:background="${fillColor}" />`;
    default:
      return "";
  }
}
