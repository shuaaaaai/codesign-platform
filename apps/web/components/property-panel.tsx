"use client";

import { useState } from "react";
import type { LayerNode } from "@/types/design";

interface PropertyPanelProps {
  layer: LayerNode | null;
  onCopyCSS: (layerId: string) => Promise<string>;
}

function CopyRow({ label, value }: { label: string; value: string | number }) {
  const [copied, setCopied] = useState(false);

  const handleCopy = async () => {
    await navigator.clipboard.writeText(String(value));
    setCopied(true);
    window.setTimeout(() => setCopied(false), 1000);
  };

  return (
    <div className="flex items-center justify-between gap-2 text-sm text-slate-700">
      <span>{label}</span>
      <div className="flex items-center gap-2">
        <span className="font-medium text-slate-900">{value}</span>
        <button className="rounded bg-slate-100 px-2 py-0.5 text-xs" onClick={handleCopy} type="button">
          {copied ? "✓" : "复制"}
        </button>
      </div>
    </div>
  );
}

export function PropertyPanel({ layer, onCopyCSS }: PropertyPanelProps) {
  const [cssCopied, setCssCopied] = useState(false);

  if (!layer) {
    return <div className="rounded-2xl border border-slate-200 bg-white p-4 text-sm text-slate-500">选择一个图层查看属性</div>;
  }

  const fill = layer.fills[0];
  const border = layer.borders[0];
  const shadow = layer.shadows[0];

  const copyCSS = async () => {
    const css = await onCopyCSS(layer.id);
    await navigator.clipboard.writeText(css);
    setCssCopied(true);
    window.setTimeout(() => setCssCopied(false), 1200);
  };

  return (
    <div className="space-y-4 rounded-2xl border border-slate-200 bg-white p-4 shadow-sm">
      <h3 className="text-sm font-semibold text-slate-800">{layer.name}</h3>

      <div className="space-y-2">
        <CopyRow label="X" value={layer.x} />
        <CopyRow label="Y" value={layer.y} />
        <CopyRow label="W" value={layer.width} />
        <CopyRow label="H" value={layer.height} />
        <CopyRow label="旋转" value={layer.rotation} />
        <CopyRow label="圆角" value={layer.borderRadius ?? 0} />
      </div>

      {fill && (
        <div className="space-y-2">
          <p className="text-xs font-semibold uppercase tracking-wider text-slate-500">填充</p>
          <div className="flex items-center justify-between">
            <span className="text-sm text-slate-700">颜色</span>
            <div className="flex items-center gap-2">
              <button title={fill.color} className="h-5 w-5 rounded border" style={{ backgroundColor: fill.color }} type="button" />
              <span className="text-sm font-medium text-slate-900">{fill.color}</span>
            </div>
          </div>
        </div>
      )}

      {border && (
        <div className="space-y-2">
          <p className="text-xs font-semibold uppercase tracking-wider text-slate-500">描边</p>
          <CopyRow label="颜色" value={border.color} />
          <CopyRow label="粗细" value={border.width} />
          <CopyRow label="类型" value={border.style} />
        </div>
      )}

      {layer.type === "text" && layer.textStyle && (
        <div className="space-y-2">
          <p className="text-xs font-semibold uppercase tracking-wider text-slate-500">文字</p>
          <CopyRow label="字体" value={layer.textStyle.fontFamily} />
          <CopyRow label="字号" value={layer.textStyle.fontSize} />
          <CopyRow label="字重" value={layer.textStyle.fontWeight} />
          <CopyRow label="行高" value={layer.textStyle.lineHeight} />
          <CopyRow label="字间距" value={layer.textStyle.letterSpacing} />
          <CopyRow label="对齐" value={layer.textStyle.textAlign} />
        </div>
      )}

      {shadow && (
        <div className="space-y-2">
          <p className="text-xs font-semibold uppercase tracking-wider text-slate-500">阴影</p>
          <CopyRow label="X偏移" value={shadow.x} />
          <CopyRow label="Y偏移" value={shadow.y} />
          <CopyRow label="模糊" value={shadow.blur} />
          <CopyRow label="颜色" value={shadow.color} />
        </div>
      )}

      <CopyRow label="不透明度" value={layer.opacity} />
      <CopyRow label="混合模式" value={layer.blendMode ?? "normal"} />

      <div className="grid grid-cols-2 gap-2">
        <button className="rounded-xl bg-slate-900 px-3 py-2 text-sm font-medium text-white" onClick={copyCSS} type="button">
          {cssCopied ? "✓" : "Copy CSS"}
        </button>
        <a href={layer.sourceAssetUrl} download className="rounded-xl border border-slate-200 px-3 py-2 text-center text-sm font-medium text-slate-700">
          Export Asset
        </a>
      </div>
    </div>
  );
}
