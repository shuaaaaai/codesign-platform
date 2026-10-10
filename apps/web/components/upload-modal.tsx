"use client";

import { useMutation } from "@tanstack/react-query";
import { useEffect, useRef, useState } from "react";
import { io, type Socket } from "socket.io-client";
import { apiFetch } from "@/lib/api";

interface UploadModalProps {
  projectId: string;
  apiBaseUrl: string;
  wsUrl: string;
  open: boolean;
  onClose: () => void;
  onCompleted: () => void;
}

export function UploadModal({ projectId, apiBaseUrl, wsUrl, open, onClose, onCompleted }: UploadModalProps) {
  const inputRef = useRef<HTMLInputElement | null>(null);
  const [progress, setProgress] = useState(0);
  const [step, setStep] = useState("等待上传");
  const [fileId, setFileId] = useState<string | null>(null);

  useEffect(() => {
    if (!open || !fileId) {
      return;
    }

    const socket: Socket = io(`${wsUrl}/collaboration`, { transports: ["websocket"] });
    socket.emit("join-room", fileId);
    socket.on("parse-progress", (payload: { fileId: string; progress: number; step: string }) => {
      if (payload.fileId !== fileId) {
        return;
      }
      setProgress(payload.progress);
      setStep(payload.step);
      if (payload.progress >= 100) {
        window.setTimeout(() => {
          onCompleted();
          onClose();
          setProgress(0);
          setStep("等待上传");
          setFileId(null);
        }, 500);
      }
    });

    return () => {
      socket.emit("leave-room", fileId);
      socket.disconnect();
    };
  }, [fileId, onClose, onCompleted, open, wsUrl]);

  const uploadMutation = useMutation({
    mutationFn: async (file: File) => {
      const formData = new FormData();
      formData.append("file", file);
      formData.append("projectId", projectId);

      return apiFetch<{ fileId: string }>("/design-files/upload", {
        method: "POST",
        body: formData,
      });
    },
    onSuccess: (data) => {
      setFileId(data.fileId);
      setProgress(10);
      setStep("文件已上传，等待解析");
    },
  });

  if (!open) {
    return null;
  }

  const chooseFile = () => inputRef.current?.click();

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/40 p-4">
      <div className="w-full max-w-lg rounded-2xl bg-white p-6 shadow-xl">
        <h3 className="text-lg font-semibold text-slate-900">上传 PSD / PSB</h3>
        <div
          className="mt-4 rounded-xl border-2 border-dashed border-slate-300 p-8 text-center text-sm text-slate-500"
          onClick={chooseFile}
          onDrop={(event) => {
            event.preventDefault();
            const file = event.dataTransfer.files?.[0];
            if (file) {
              uploadMutation.mutate(file);
            }
          }}
          onDragOver={(event) => event.preventDefault()}
        >
          拖拽文件到此处，或点击上传
        </div>
        <input
          ref={inputRef}
          type="file"
          accept=".psd,.psb"
          className="hidden"
          onChange={(event) => {
            const file = event.target.files?.[0];
            if (file) {
              uploadMutation.mutate(file);
            }
          }}
        />

        <div className="mt-4 space-y-2">
          <div className="h-2 w-full rounded bg-slate-100">
            <div className="h-2 rounded bg-sky-500 transition-all" style={{ width: `${progress}%` }} />
          </div>
          <p className="text-xs text-slate-500">{step}（{progress}%）</p>
          {uploadMutation.isError && <p className="text-xs text-rose-500">上传失败，请重试。</p>}
        </div>

        <div className="mt-5 flex justify-end">
          <button className="rounded-lg border border-slate-200 px-3 py-2 text-sm" type="button" onClick={onClose}>
            关闭
          </button>
        </div>
      </div>
    </div>
  );
}
