import type { ParsedLayer } from "@codesign/psd-parser";

export type CodeFormat = "css" | "tailwind" | "react" | "vue" | "ios" | "android";
type CodeLayerInput = Partial<ParsedLayer> & { name: string; fill?: string };

function className(name: string) {
  return name.toLowerCase().replace(/\s+/g, "-");
}

export function generateCode(layer: CodeLayerInput, format: CodeFormat): string {
  const fillColor = layer.fill ?? layer.fills?.[0]?.color ?? "#0EA5E9";
  const radius = layer.borderRadius ?? 0;
  const shadow = layer.shadows?.[0];
  const x = layer.x ?? 0;
  const y = layer.y ?? 0;
  const width = layer.width ?? 0;
  const height = layer.height ?? 0;
  const opacity = layer.opacity ?? 1;
  const shadowText = shadow ? `${shadow.x}px ${shadow.y}px ${shadow.blur}px ${shadow.color}` : "none";

  switch (format) {
    case "css":
      return `.${className(layer.name)} {\n  position: absolute;\n  left: ${x}px;\n  top: ${y}px;\n  width: ${width}px;\n  height: ${height}px;\n  background: ${fillColor};\n  border-radius: ${radius}px;\n  opacity: ${opacity};\n  box-shadow: ${shadowText};\n}`;
    case "tailwind":
      return `<div className="absolute left-[${x}px] top-[${y}px] w-[${width}px] h-[${height}px] rounded-[${radius}px] bg-[${fillColor}] opacity-[${opacity}]">${layer.name}</div>`;
    case "react":
      return `export function ${layer.name.replace(/\s+/g, "")}() {\n  return <div className={styles.${className(layer.name)}} />;\n}\n\n/* CSS Module */\n.${className(layer.name)} {\n  width: ${width}px;\n  height: ${height}px;\n  background: ${fillColor};\n}`;
    case "vue":
      return `<template>\n  <div class="${className(layer.name)}"></div>\n</template>\n\n<style scoped>\n.${className(layer.name)} {\n  width: ${width}px;\n  height: ${height}px;\n  background: ${fillColor};\n}\n</style>`;
    case "ios":
      return `let button = UIButton(frame: CGRect(x: ${x}, y: ${y}, width: ${width}, height: ${height}))\nbutton.backgroundColor = UIColor(hex: "${fillColor.replace("#", "")}")\nbutton.layer.cornerRadius = ${radius}`;
    case "android":
      return `<View\n  android:layout_width="${width}dp"\n  android:layout_height="${height}dp"\n  android:layout_marginLeft="${x}dp"\n  android:layout_marginTop="${y}dp"\n  android:background="${fillColor}" />`;
    default:
      return "";
  }
}
