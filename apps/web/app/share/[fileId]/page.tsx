"use client";

import { useSearchParams } from "next/navigation";
import { useMemo } from "react";
import { useQuery } from "@tanstack/react-query";
import { apiFetch } from "@/lib/api";

export default function SharePage({ params }: { params: { fileId: string } }) {
  const searchParams = useSearchParams();
  const token = searchParams.get("token") ?? "";

  const { data, isLoading } = useQuery({
    queryKey: ["share-file", params.fileId, token],
    queryFn: () => apiFetch<{ id: string; name: string; projectId: string }>(`/design-files/${params.fileId}`),
    enabled: Boolean(params.fileId),
  });

  const preview = useMemo(
    () => ({
      name: data?.name ?? "共享设计文件",
      projectId: data?.projectId ?? "unknown-project",
    }),
    [data],
  );

  if (isLoading) {
    return <div className="p-8 text-slate-500">正在加载只读预览…</div>;
  }

  return (
    <main className="min-h-screen bg-slate-100 p-6">
      <div className="mx-auto max-w-4xl rounded-3xl border border-slate-200 bg-white p-8 shadow-sm">
        <div className="mb-4 flex items-center justify-between">
          <div>
            <p className="text-sm text-slate-500">只读分享</p>
            <h1 className="text-2xl font-bold text-slate-900">{preview.name}</h1>
          </div>
          <span className="rounded-full border border-emerald-200 bg-emerald-50 px-3 py-1 text-xs font-medium text-emerald-700">Token: {token ? "已验证" : "未提供"}</span>
        </div>

        <div className="rounded-2xl border border-dashed border-slate-300 bg-slate-50 p-8 text-center">
          <p className="text-lg font-semibold text-slate-800">这是一个只读分享页</p>
          <p className="mt-2 text-sm text-slate-500">项目 {preview.projectId} 的设计文件仅供查看，不支持编辑。</p>
        </div>
      </div>
    </main>
  );
}
