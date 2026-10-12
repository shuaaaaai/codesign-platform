"use client";

import Image from "next/image";
import { useEffect, useMemo, useRef } from "react";
import { Tldraw, createShapeId, type Editor } from "@tldraw/tldraw";
import "@tldraw/tldraw/tldraw.css";
import type { Artboard, Collaborator } from "@/types/design";

interface InfiniteCanvasProps {
  artboards: Artboard[];
  collaborators: Collaborator[];
  onArtboardDoubleClick: (artboardId: string) => void;
  onUpload?: (file: File) => void;
}

export function InfiniteCanvas({ artboards, collaborators, onArtboardDoubleClick, onUpload }: InfiniteCanvasProps) {
  const editorRef = useRef<Editor | null>(null);
  const doubleClickUnsubscribeRef = useRef<(() => void) | null>(null);
  const onArtboardDoubleClickRef = useRef(onArtboardDoubleClick);

  useEffect(() => {
    const editor = editorRef.current;
    if (!editor) {
      return;
    }

    const frameIds = editor
      .getCurrentPageShapes()
      .filter((shape) => shape.type === "frame")
      .map((shape) => shape.id);
    if (frameIds.length > 0) {
      editor.deleteShapes(frameIds);
    }

    if (artboards.length > 0) {
      editor.createShapes(
        artboards.map((board) => ({
          id: createShapeId(board.id),
          type: "frame",
          x: board.worldX,
          y: board.worldY,
          props: {
            w: board.width,
            h: board.height,
            name: `${board.name} (${board.width}×${board.height})`,
          },
          meta: {
            artboardId: board.id,
          },
        })),
      );
    }
  }, [artboards]);

  useEffect(() => {
    onArtboardDoubleClickRef.current = onArtboardDoubleClick;
  }, [onArtboardDoubleClick]);

  useEffect(() => {
    return () => {
      doubleClickUnsubscribeRef.current?.();
      doubleClickUnsubscribeRef.current = null;
    };
  }, []);

  const handleDrop = (event: React.DragEvent<HTMLDivElement>) => {
    event.preventDefault();
    const file = event.dataTransfer.files?.[0];
    if (file && onUpload) {
      onUpload(file);
    }
  };

  const collaboratorNodes = useMemo(
    () =>
      collaborators.map((member) => (
        <div key={member.id} className="flex items-center gap-2 rounded-full border border-slate-200 bg-white px-2 py-1">
          <div className="flex h-7 w-7 items-center justify-center overflow-hidden rounded-full text-xs font-semibold text-white" style={{ backgroundColor: member.color }}>
            {member.avatar ? <Image src={member.avatar} alt={member.name} width={28} height={28} className="h-7 w-7 rounded-full object-cover" /> : member.name.slice(0, 1).toUpperCase()}
          </div>
          <span className="text-xs text-slate-600">{member.name}</span>
        </div>
      )),
    [collaborators],
  );

  return (
    <div className="relative h-[720px] overflow-hidden rounded-2xl border border-slate-200 bg-white" onDrop={handleDrop} onDragOver={(event) => event.preventDefault()}>
      <div className="absolute left-4 top-4 z-10 flex flex-wrap gap-2">{collaboratorNodes}</div>
      {artboards.length === 0 && (
        <div className="absolute inset-0 z-20 flex items-center justify-center bg-white/90 text-lg font-medium text-slate-500">
          拖拽 PSD 文件到此处上传
        </div>
      )}
      <div className="h-full w-full">
        <Tldraw
          onMount={(editor) => {
            editorRef.current = editor;
            editor.updateInstanceState({ isDebugMode: false });
            doubleClickUnsubscribeRef.current?.();
            const unsubscribe = editor.on("event", (event) => {
              if (event.name === "double_click" && "phase" in event && event.phase === "up") {
                const target = editor.getShapeAtPoint(editor.inputs.currentPagePoint);
                const artboardId = String(target?.meta?.artboardId ?? "");
                if (artboardId) {
                  onArtboardDoubleClickRef.current(artboardId);
                }
              }
            });
            if (typeof unsubscribe === "function") {
              doubleClickUnsubscribeRef.current = unsubscribe;
            } else {
              doubleClickUnsubscribeRef.current = null;
            }
          }}
        />
      </div>
    </div>
  );
}
