"use client";

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useState } from "react";
import type { CommentItem } from "@/types/design";

interface CommentSystemProps {
  artboardId: string;
  apiBaseUrl: string;
}

export function CommentSystem({ artboardId, apiBaseUrl }: CommentSystemProps) {
  const [newContent, setNewContent] = useState("");
  const [anchor, setAnchor] = useState<{ x: number; y: number } | null>(null);
  const [openedCommentId, setOpenedCommentId] = useState<string | null>(null);
  const queryClient = useQueryClient();

  const { data: comments = [] } = useQuery({
    queryKey: ["comments", artboardId],
    queryFn: async () => {
      const response = await fetch(`${apiBaseUrl}/comments?artboardId=${artboardId}`, { cache: "no-store" });
      if (!response.ok) {
        throw new Error("评论加载失败");
      }
      return (await response.json()) as CommentItem[];
    },
  });

  const createMutation = useMutation({
    mutationFn: async () => {
      if (!anchor || !newContent.trim()) {
        return;
      }
      const response = await fetch(`${apiBaseUrl}/comments`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ artboardId, content: newContent, x: anchor.x, y: anchor.y }),
      });
      if (!response.ok) {
        throw new Error("评论创建失败");
      }
    },
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: ["comments", artboardId] });
      setAnchor(null);
      setNewContent("");
    },
  });

  const resolveMutation = useMutation({
    mutationFn: async (commentId: string) => {
      const response = await fetch(`${apiBaseUrl}/comments/${commentId}/resolve`, { method: "PATCH" });
      if (!response.ok) {
        throw new Error("评论更新失败");
      }
    },
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: ["comments", artboardId] });
    },
  });

  const replyMutation = useMutation({
    mutationFn: async ({ commentId, content }: { commentId: string; content: string }) => {
      const response = await fetch(`${apiBaseUrl}/comments/${commentId}/reply`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ content }),
      });
      if (!response.ok) {
        throw new Error("回复失败");
      }
    },
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: ["comments", artboardId] });
    },
  });

  return (
    <div className="relative h-full w-full" onClick={(event) => setAnchor({ x: event.nativeEvent.offsetX, y: event.nativeEvent.offsetY })}>
      {comments.map((comment) => (
        <div key={comment.id} className="absolute" style={{ left: comment.x, top: comment.y }}>
          <button className="text-xl" type="button" onClick={(event) => {
            event.stopPropagation();
            setOpenedCommentId((prev) => (prev === comment.id ? null : comment.id));
          }}>
            💬
          </button>
          {openedCommentId === comment.id && (
            <div className="mt-2 w-64 rounded-xl border border-slate-200 bg-white p-3 text-sm shadow-lg">
              <p className="text-slate-700">{comment.content}</p>
              <div className="mt-2 space-y-1">
                {comment.replies?.map((reply) => (
                  <p key={reply.id} className="rounded bg-slate-50 p-1 text-xs text-slate-600">{reply.content}</p>
                ))}
              </div>
              <div className="mt-2 flex gap-2">
                <button className="rounded bg-slate-900 px-2 py-1 text-xs text-white" type="button" onClick={() => {
                  const content = window.prompt("输入回复内容");
                  if (content) {
                    replyMutation.mutate({ commentId: comment.id, content });
                  }
                }}>
                  回复
                </button>
                <button className="rounded border px-2 py-1 text-xs" type="button" onClick={() => resolveMutation.mutate(comment.id)}>
                  标记已解决
                </button>
              </div>
            </div>
          )}
        </div>
      ))}

      {anchor && (
        <div className="absolute z-20 w-72 rounded-xl border border-slate-200 bg-white p-3 shadow-lg" style={{ left: anchor.x, top: anchor.y }} onClick={(event) => event.stopPropagation()}>
          <textarea
            value={newContent}
            onChange={(event) => setNewContent(event.target.value)}
            className="h-20 w-full rounded border border-slate-200 p-2 text-sm"
            placeholder="输入评论内容"
          />
          <div className="mt-2 flex justify-end gap-2">
            <button type="button" className="rounded border px-2 py-1 text-xs" onClick={() => setAnchor(null)}>
              取消
            </button>
            <button type="button" className="rounded bg-slate-900 px-2 py-1 text-xs text-white" onClick={() => createMutation.mutate()}>
              发布
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
