"use client";

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import Link from "next/link";
import { useState } from "react";
import { apiFetch } from "@/lib/api";

interface Project {
  id: string;
  name: string;
  description?: string;
  coverUrl?: string;
  memberCount?: number;
  updatedAt?: string;
}

export default function DashboardPage() {
  const queryClient = useQueryClient();
  const [open, setOpen] = useState(false);
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");

  const { data, isLoading, isError } = useQuery({
    queryKey: ["projects"],
    queryFn: () => apiFetch<Project[]>("/projects"),
  });

  const createMutation = useMutation({
    mutationFn: () =>
      apiFetch<Project>("/projects", {
        method: "POST",
        body: JSON.stringify({ name, description }),
      }),
    onSuccess: async () => {
      setOpen(false);
      setName("");
      setDescription("");
      await queryClient.invalidateQueries({ queryKey: ["projects"] });
    },
  });

  return (
    <main className="min-h-screen bg-slate-100 p-6">
      <div className="mx-auto max-w-6xl">
        <div className="mb-8 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-slate-900 text-lg font-bold text-white">C</div>
            <h1 className="text-3xl font-bold text-slate-900">项目列表</h1>
          </div>
          <div className="flex items-center gap-3">
            <div className="h-9 w-9 rounded-full bg-slate-300" />
            <button className="rounded-xl bg-slate-900 px-4 py-2.5 text-sm font-medium text-white" type="button" onClick={() => setOpen(true)}>
              新建项目
            </button>
          </div>
        </div>

        {isLoading && <div className="grid gap-5 md:grid-cols-3">{Array.from({ length: 3 }).map((_, idx) => <div key={idx} className="h-64 animate-pulse rounded-3xl bg-slate-200" />)}</div>}
        {isError && <div className="rounded-xl bg-rose-50 p-4 text-rose-600">项目加载失败</div>}
        {!isLoading && !isError && (
          <div className="grid gap-5 md:grid-cols-3">
            {(data ?? []).map((project) => (
              <Link href={`/project/${project.id}`} key={project.id} className="rounded-3xl border border-slate-200 bg-white p-5 shadow-sm transition hover:-translate-y-1 hover:shadow-md">
                <div className="mb-5 h-40 rounded-2xl bg-gradient-to-br from-sky-500 via-violet-500 to-fuchsia-500" style={{ backgroundImage: project.coverUrl ? `url(${project.coverUrl})` : undefined, backgroundSize: "cover" }} />
                <h2 className="text-xl font-semibold text-slate-900">{project.name}</h2>
                <p className="mt-2 text-sm text-slate-500">{project.description || "暂无描述"}</p>
                <div className="mt-5 flex items-center justify-between text-sm text-slate-600">
                  <span>{project.memberCount ?? 1} members</span>
                  <span>{project.updatedAt ? new Date(project.updatedAt).toLocaleString() : "刚刚更新"}</span>
                </div>
              </Link>
            ))}
          </div>
        )}
      </div>

      {open && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/40 p-4">
          <div className="w-full max-w-md rounded-2xl bg-white p-6">
            <h3 className="text-lg font-semibold">新建项目</h3>
            <div className="mt-4 space-y-3">
              <input value={name} onChange={(event) => setName(event.target.value)} placeholder="项目名" className="w-full rounded-lg border border-slate-200 px-3 py-2" />
              <textarea value={description} onChange={(event) => setDescription(event.target.value)} placeholder="描述" className="h-24 w-full rounded-lg border border-slate-200 px-3 py-2" />
            </div>
            <div className="mt-4 flex justify-end gap-2">
              <button className="rounded-lg border px-3 py-2 text-sm" type="button" onClick={() => setOpen(false)}>
                取消
              </button>
              <button className="rounded-lg bg-slate-900 px-3 py-2 text-sm text-white" type="button" onClick={() => createMutation.mutate()}>
                创建
              </button>
            </div>
          </div>
        </div>
      )}
    </main>
  );
}
