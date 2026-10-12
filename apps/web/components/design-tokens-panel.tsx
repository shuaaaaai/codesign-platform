"use client";

import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { apiFetch } from "@/lib/api";

interface DesignToken {
  id: string;
  name: string;
  value: string;
}

export function DesignTokensPanel({ fileId }: { fileId: string }) {
  const { data, isLoading } = useQuery({
    queryKey: ["design-file-tokens", fileId],
    queryFn: () => apiFetch<{ tokens: DesignToken[] }>(`/design-files/${fileId}/tokens`),
    enabled: Boolean(fileId),
  });

  const tokens = data?.tokens ?? [];
  const colors = tokens.filter((token) => token.value.startsWith("#"));
  const radii = tokens.filter((token) => token.name.startsWith("radius") || /\d+px$/.test(token.value));

  const copyValue = async (value: string) => {
    await navigator.clipboard.writeText(value);
  };

  const exportCss = () => {
    const css = [":root {"]
      .concat(colors.map((token) => `  --${token.name}: ${token.value};`))
      .concat(radii.map((token) => `  --${token.name}: ${token.value}px;`))
      .concat(["}"])
      .join("\n");

    const blob = new Blob([css], { type: "text/css" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = "design-tokens.css";
    link.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="space-y-4 p-4">
      <div className="flex items-center justify-between">
        <h3 className="text-sm font-semibold text-slate-800">Design Tokens</h3>
        <button type="button" className="rounded-lg border border-slate-200 px-2 py-1 text-xs" onClick={exportCss}>
          导出 CSS Variables
        </button>
      </div>

      {isLoading ? (
        <div className="text-sm text-slate-500">加载中…</div>
      ) : (
        <div className="space-y-4">
          <div>
            <p className="mb-2 text-xs font-medium uppercase tracking-wide text-slate-500">Colors</p>
            <div className="space-y-2">
              {colors.map((token) => (
                <div key={token.id} className="flex items-center justify-between rounded-xl border border-slate-200 p-2">
                  <div className="flex items-center gap-2">
                    <span className="h-5 w-5 rounded-md border border-slate-200" style={{ background: token.value }} />
                    <span className="text-sm text-slate-700">{token.name}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-xs text-slate-500">{token.value}</span>
                    <button type="button" className="text-xs text-sky-600" onClick={() => copyValue(token.value)}>复制</button>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div>
            <p className="mb-2 text-xs font-medium uppercase tracking-wide text-slate-500">Radius</p>
            <div className="space-y-2">
              {radii.map((token) => (
                <div key={token.id} className="flex items-center justify-between rounded-xl border border-slate-200 p-2">
                  <span className="text-sm text-slate-700">{token.name}</span>
                  <div className="flex items-center gap-2">
                    <span className="text-xs text-slate-500">{token.value}</span>
                    <button type="button" className="text-xs text-sky-600" onClick={() => copyValue(token.value)}>复制</button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
