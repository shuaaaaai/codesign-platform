export type CodeFormat = "css" | "tailwind" | "react" | "vue" | "ios" | "android";

type CodeLayerInput = {
  name: string;
  x?: number;
  y?: number;
  width?: number;
  height?: number;
  rotation?: number;
  borderRadius?: number;
  opacity?: number;
  blendMode?: string;
  fills?: Array<{ color?: string; opacity?: number }>;
  borders?: Array<{ color?: string; width?: number; style?: string }>;
  shadows?: Array<{ x?: number; y?: number; blur?: number; color?: string; opacity?: number }>;
  fill?: string;
  textStyle?: {
    fontFamily?: string;
    fontSize?: number;
    fontWeight?: number;
    lineHeight?: number;
    letterSpacing?: number;
    textAlign?: string;
    color?: string;
  };
};

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
    case "css": {
      const lines = [
        `.${className(layer.name)} {`,
        `  position: absolute;`,
        `  left: ${x}px;`,
        `  top: ${y}px;`,
        `  width: ${width}px;`,
        `  height: ${height}px;`,
      ];
      if (radius > 0) lines.push(`  border-radius: ${radius}px;`);
      if (fillColor && fillColor !== "transparent") lines.push(`  background: ${fillColor};`);
      if (opacity < 1) lines.push(`  opacity: ${opacity};`);
      if (shadowText !== "none") lines.push(`  box-shadow: ${shadowText};`);
      lines.push("}");
      return lines.join("\n");
    }
    case "tailwind":
      return `<div className="absolute left-[${x}px] top-[${y}px] w-[${width}px] h-[${height}px] rounded-[${radius}px] bg-[${fillColor}] opacity-[${opacity}]">${layer.name}</div>`;
    case "react": {
      const compName = layer.name.replace(/\s+/g, "").replace(/[^a-zA-Z0-9]/g, "") || "Layer";
      return [
        `// ${layer.name}`,
        `export function ${compName}() {`,
        `  return (`,
        `    <div`,
        `      style={{`,
        `        position: 'absolute',`,
        `        left: ${x},`,
        `        top: ${y},`,
        `        width: ${width},`,
        `        height: ${height},`,
        `        background: '${fillColor}',`,
        radius > 0 ? `        borderRadius: ${radius},` : "",
        opacity < 1 ? `        opacity: ${opacity},` : "",
        `      }}`,
        `    />`,
        `  );`,
        `}`,
        "",
        `/* CSS Module */`,
        `.${className(layer.name)} {`,
        `  width: ${width}px;`,
        `  height: ${height}px;`,
        `  background: ${fillColor};`,
        `}`,
      ].filter(Boolean).join("\n");
    }
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
