"use client";

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useRouter, useParams } from "next/navigation";
import { useEffect, useState } from "react";
import { io, type Socket } from "socket.io-client";
import { InfiniteCanvas } from "@/components/infinite-canvas";
import { UploadModal } from "@/components/upload-modal";
import { apiFetch, API_BASE_URL } from "@/lib/api";
import { useCanvasStore } from "@/store/canvas";
import type { Artboard, Collaborator } from "@/types/design";

export default function DesignPage() {
  const params = useParams<{ fileId: string }>();
  const router = useRouter();
  const queryClient = useQueryClient();
  const wsUrl = process.env.NEXT_PUBLIC_WS_URL ?? "http://localhost:4000";
  const [openUpload, setOpenUpload] = useState(false);

  const setArtboards = useCanvasStore((state) => state.setArtboards);
  const setCollaborators = useCanvasStore((state) => state.setCollaborators);
  const collaborators = useCanvasStore((state) => state.collaborators);

  const fileId = params.fileId;

  const { data, isLoading, isError } = useQuery({
    queryKey: ["artboards", fileId],
    queryFn: () => apiFetch<{ artboards: Artboard[] }>(`/design-files/${fileId}/artboards`),
  });

  useEffect(() => {
    if (data?.artboards) {
      setArtboards(data.artboards);
    }
  }, [data, setArtboards]);

  useEffect(() => {
    const socket: Socket = io(`${wsUrl}/collaboration`, { transports: ["websocket"] });
    socket.emit("join-room", fileId);
    socket.on("presence", (payload: { collaborators: Collaborator[] }) => {
      setCollaborators(payload.collaborators);
    });
    return () => {
      socket.emit("leave-room", fileId);
      socket.disconnect();
    };
  }, [fileId, setCollaborators, wsUrl]);

  const uploadMutation = useMutation({
    mutationFn: async (file: File) => {
      const formData = new FormData();
      formData.append("file", file);
      formData.append("projectId", "default-project");
      const response = await fetch(`${API_BASE_URL}/design-files/upload`, { method: "POST", body: formData });
      if (!response.ok) {
        throw new Error("上传失败");
      }
      return (await response.json()) as { fileId: string };
    },
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: ["artboards", fileId] });
    },
  });

  return (
    <main className="min-h-screen bg-slate-100 p-6">
      <div className="mx-auto max-w-7xl">
        <header className="mb-6 flex flex-wrap items-center justify-between gap-3 rounded-2xl border border-slate-200 bg-white p-4 shadow-sm">
          <div>
            <p className="text-sm text-slate-500">项目 / 文件 {fileId}</p>
            <h1 className="text-2xl font-bold text-slate-900">无限画布工作区</h1>
          </div>
          <div className="flex items-center gap-2">
            {collaborators.map((member) => (
              <div key={member.id} className="flex items-center gap-2 rounded-full border border-slate-200 px-2 py-1 text-xs">
                <span className="inline-block h-2.5 w-2.5 rounded-full" style={{ backgroundColor: member.color }} />
                {member.name}
              </div>
            ))}
            <button className="rounded-xl border border-slate-200 px-4 py-2 text-sm" type="button" onClick={() => setOpenUpload(true)}>
              上传
            </button>
            <button className="rounded-xl bg-slate-900 px-4 py-2 text-sm text-white" type="button">
              分享
            </button>
          </div>
        </header>

        {isLoading && <div className="h-[720px] animate-pulse rounded-2xl bg-slate-200" />}
        {isError && <div className="rounded-xl bg-rose-50 p-4 text-rose-600">画板加载失败，请重试。</div>}
        {!isLoading && !isError && (
          <InfiniteCanvas
            artboards={data?.artboards ?? []}
            collaborators={collaborators}
            onUpload={(file) => uploadMutation.mutate(file)}
            onArtboardDoubleClick={(artboardId) => router.push(`/design/${fileId}/inspect/${artboardId}`)}
          />
        )}

        <button
          className="fixed bottom-8 right-8 rounded-full bg-sky-500 px-5 py-3 text-sm font-medium text-white shadow-lg"
          type="button"
          onClick={() => setOpenUpload(true)}
        >
          上传 PSD
        </button>
      </div>

      <UploadModal
        projectId="default-project"
        apiBaseUrl={API_BASE_URL}
        wsUrl={wsUrl}
        open={openUpload}
        onClose={() => setOpenUpload(false)}
        onCompleted={() => queryClient.invalidateQueries({ queryKey: ["artboards", fileId] })}
      />
    </main>
  );
}
