"use client";

import { useMemo, useState } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { apiFetch } from "@/lib/api";

interface VersionItem {
  id: string;
  label: string;
  createdAt: string;
}

export function VersionHistory({ fileId, open, onClose }: { fileId: string; open: boolean; onClose: () => void }) {
  const queryClient = useQueryClient();
  const [label, setLabel] = useState("Auto Save");

  const { data = [], isLoading } = useQuery({
    queryKey: ["design-file-versions", fileId],
    queryFn: () => apiFetch<VersionItem[]>(`/design-files/${fileId}/versions`),
    enabled: open && Boolean(fileId),
  });

  const mutation = useMutation({
    mutationFn: () =>
      apiFetch<VersionItem>(`/design-files/${fileId}/versions`, {
        method: "POST",
        body: JSON.stringify({ label: label.trim() || "Auto Save" }),
      }),
    onSuccess: async () => {
      setLabel("Auto Save");
      await queryClient.invalidateQueries({ queryKey: ["design-file-versions", fileId] });
    },
  });

  const sorted = useMemo(() => [...data].sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()), [data]);

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-end justify-end bg-slate-900/20 p-4">
      <div className="h-full w-full max-w-md rounded-2xl border border-slate-200 bg-white shadow-2xl">
        <div className="flex items-center justify-between border-b border-slate-200 px-4 py-3">
          <h3 className="text-base font-semibold text-slate-900">版本历史</h3>
          <button type="button" className="text-sm text-slate-500" onClick={onClose}>关闭</button>
        </div>

        <div className="space-y-3 p-4">
          <div className="flex gap-2">
            <input
              value={label}
              onChange={(event) => setLabel(event.target.value)}
              className="flex-1 rounded-xl border border-slate-200 px-3 py-2 text-sm"
              placeholder="版本标签"
            />
            <button type="button" className="rounded-xl bg-slate-900 px-3 py-2 text-sm text-white" onClick={() => mutation.mutate()}>
              保存
            </button>
          </div>

          <div className="space-y-3">
            {isLoading ? (
              <div className="text-sm text-slate-500">加载中…</div>
            ) : sorted.length === 0 ? (
              <div className="rounded-xl bg-slate-50 p-3 text-sm text-slate-500">暂无版本记录</div>
            ) : (
              sorted.map((item, index) => (
                <div key={item.id} className="relative flex gap-3 rounded-xl border border-slate-200 p-3">
                  <div className="flex w-4 flex-col items-center">
                    <span className="mt-1 h-3 w-3 rounded-full bg-sky-500" />
                    {index < sorted.length - 1 && <span className="mt-1 h-full w-px bg-slate-200" />}
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center justify-between gap-3">
                      <div>
                        <p className="font-medium text-slate-800">{item.label}</p>
                        <p className="text-xs text-slate-500">{new Date(item.createdAt).toLocaleString()}</p>
                      </div>
                      <button type="button" className="rounded-lg border border-slate-200 px-2 py-1 text-xs text-slate-700">
                        查看
                      </button>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
