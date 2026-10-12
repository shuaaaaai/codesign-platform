"use client";

export default function Error({ error, reset }: { error: Error; reset: () => void }) {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center gap-4 bg-slate-100">
      <h1 className="text-2xl font-bold text-slate-800">出错了</h1>
      <p className="text-slate-600">{error.message}</p>
      <button onClick={reset} className="rounded-xl bg-slate-900 px-4 py-2 text-sm text-white" type="button">
        重试
      </button>
    </div>
  );
}
