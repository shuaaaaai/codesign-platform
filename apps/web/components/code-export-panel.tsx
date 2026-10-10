"use client";

import { useQuery } from "@tanstack/react-query";
import { useMemo, useState } from "react";
import { Prism as SyntaxHighlighter } from "react-syntax-highlighter";
import { oneDark } from "react-syntax-highlighter/dist/esm/styles/prism";
import type { LayerNode } from "@/types/design";

interface CodeExportPanelProps {
  layer: LayerNode | null;
  apiBaseUrl: string;
}

type Tab = "css" | "tailwind" | "react" | "vue" | "ios" | "android";

const tabs: Array<{ key: Tab; label: string; language: string }> = [
  { key: "css", label: "CSS", language: "css" },
  { key: "tailwind", label: "Tailwind", language: "jsx" },
  { key: "react", label: "React", language: "tsx" },
  { key: "vue", label: "Vue", language: "vue" },
  { key: "ios", label: "iOS Swift", language: "swift" },
  { key: "android", label: "Android XML", language: "xml" },
];

export function CodeExportPanel({ layer, apiBaseUrl }: CodeExportPanelProps) {
  const [activeTab, setActiveTab] = useState<Tab>("css");
  const [copied, setCopied] = useState(false);

  const tabMeta = useMemo(() => tabs.find((tab) => tab.key === activeTab) ?? tabs[0], [activeTab]);

  const { data, isLoading, isError } = useQuery({
    queryKey: ["layer-code", layer?.id, activeTab],
    queryFn: async () => {
      if (!layer) {
        return "";
      }
      const response = await fetch(`${apiBaseUrl}/layers/${layer.id}/code?format=${activeTab}`, { cache: "no-store" });
      if (!response.ok) {
        throw new Error("代码获取失败");
      }
      const payload = (await response.json()) as { code: string };
      return payload.code;
    },
    enabled: Boolean(layer),
  });

  if (!layer) {
    return <div className="rounded-2xl border border-slate-200 bg-white p-4 text-sm text-slate-500">选择一个图层查看代码导出</div>;
  }

  const copyCode = async () => {
    if (!data) {
      return;
    }
    await navigator.clipboard.writeText(data);
    setCopied(true);
    window.setTimeout(() => setCopied(false), 1000);
  };

  return (
    <div className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm">
      <div className="mb-4 flex flex-wrap gap-2">
        {tabs.map((tab) => (
          <button
            key={tab.key}
            className={`rounded-lg px-3 py-1.5 text-xs font-medium ${tab.key === activeTab ? "bg-slate-900 text-white" : "bg-slate-100 text-slate-600"}`}
            onClick={() => setActiveTab(tab.key)}
            type="button"
          >
            {tab.label}
          </button>
        ))}
        <button onClick={copyCode} className="ml-auto rounded-lg border border-slate-200 px-3 py-1.5 text-xs" type="button">
          {copied ? "✓" : "复制"}
        </button>
      </div>

      {isLoading && <div className="h-32 animate-pulse rounded-xl bg-slate-100" />}
      {isError && <div className="rounded-xl bg-rose-50 p-3 text-sm text-rose-600">代码加载失败，请稍后重试。</div>}
      {!isLoading && !isError && (
        <SyntaxHighlighter language={tabMeta.language} style={oneDark} customStyle={{ borderRadius: 12, fontSize: 12 }}>
          {data ?? ""}
        </SyntaxHighlighter>
      )}
    </div>
  );
}
