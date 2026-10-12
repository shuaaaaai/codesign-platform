"use client";

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import Link from "next/link";
import { useParams } from "next/navigation";
import { useRef, useState } from "react";
import { apiFetch } from "@/lib/api";

interface DesignFileItem {
  id: string;
  name: string;
  status: "processing" | "ready" | "error";
  createdAt: string;
  updatedAt?: string;
}

const statusClasses: Record<DesignFileItem["status"], string> = {
  processing: "bg-amber-100 text-amber-700",
  ready: "bg-emerald-100 text-emerald-700",
  error: "bg-rose-100 text-rose-700",
};

export default function ProjectDetailPage() {
  const params = useParams<{ projectId: string }>();
  const projectId = params.projectId;
  const queryClient = useQueryClient();
  const inputRef = useRef<HTMLInputElement | null>(null);
  const [isUploading, setIsUploading] = useState(false);

  const { data: files = [], isLoading } = useQuery({
    queryKey: ["design-files", projectId],
    queryFn: () => apiFetch<DesignFileItem[]>(`/design-files?projectId=${projectId}`),
    enabled: Boolean(projectId),
  });

  const uploadMutation = useMutation({
    mutationFn: async (file: File) => {
      const formData = new FormData();
      formData.append("file", file);
      formData.append("projectId", projectId);
      await apiFetch<{ fileId: string }>("/design-files/upload", {
        method: "POST",
        body: formData,
      });
    },
    onSuccess: async () => {
      setIsUploading(false);
      await queryClient.invalidateQueries({ queryKey: ["design-files", projectId] });
    },
    onError: () => setIsUploading(false),
  });

  const handleFiles = (fileList?: FileList | null) => {
    const file = fileList?.[0];
    if (!file) {
      return;
    }
    setIsUploading(true);
    uploadMutation.mutate(file);
  };

  return (
    <main className="min-h-screen bg-slate-100 p-6">
      <div className="mx-auto max-w-6xl">
        <div className="mb-6 flex items-center justify-between">
          <div>
            <p className="text-sm text-slate-500">Project / {projectId}</p>
            <h1 className="mt-2 text-3xl font-bold text-slate-900">Design files</h1>
          </div>
          <button
            type="button"
            className="rounded-xl bg-slate-900 px-4 py-2.5 text-sm font-medium text-white"
            onClick={() => inputRef.current?.click()}
            disabled={isUploading}
          >
            {isUploading ? "上传中..." : "Upload PSD"}
          </button>
        </div>

        <input
          ref={inputRef}
          type="file"
          accept=".psd,.psb"
          className="hidden"
          onChange={(event) => handleFiles(event.target.files)}
        />

        {isLoading ? (
          <div className="space-y-4">
            {Array.from({ length: 3 }).map((_, idx) => (
              <div key={idx} className="h-20 animate-pulse rounded-2xl bg-slate-200" />
            ))}
          </div>
        ) : files.length === 0 ? (
          <div className="rounded-3xl border border-dashed border-slate-300 bg-white p-12 text-center shadow-sm">
            <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-2xl bg-slate-100 text-3xl">🖼️</div>
            <p className="text-lg font-semibold text-slate-800">暂无设计文件，上传 PSD 开始</p>
            <button
              type="button"
              className="mt-5 rounded-xl bg-slate-900 px-4 py-2.5 text-sm font-medium text-white"
              onClick={() => inputRef.current?.click()}
            >
              上传 PSD
            </button>
          </div>
        ) : (
          <div className="space-y-4">
            {files.map((file) => (
              <Link
                key={file.id}
                href={`/design/${file.id}`}
                className="flex items-center justify-between rounded-2xl border border-slate-200 bg-white p-4 shadow-sm transition hover:-translate-y-0.5 hover:shadow-md"
              >
                <div className="flex items-center gap-4">
                  <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-slate-100 text-lg">🖼️</div>
                  <div>
                    <p className="font-semibold text-slate-900">{file.name}</p>
                    <p className="text-sm text-slate-500">创建时间 {new Date(file.createdAt).toLocaleString()}</p>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <span className={`rounded-full px-2.5 py-1 text-xs font-medium ${statusClasses[file.status]}`}>{file.status}</span>
                  <button
                    type="button"
                    className="rounded-lg border border-slate-200 px-2 py-1 text-xs text-slate-600"
                    onClick={(event) => event.preventDefault()}
                  >
                    更多
                  </button>
                </div>
              </Link>
            ))}
          </div>
        )}
      </div>
    </main>
  );
}
