import { InfiniteCanvas } from "@/components/infinite-canvas";
import { MemberPresence } from "@/components/member-presence";

export default function DesignPage() {
  return (
    <main className="min-h-screen bg-slate-100 p-6">
      <div className="mx-auto max-w-7xl">
        <header className="mb-6 flex items-center justify-between rounded-2xl border border-slate-200 bg-white p-4 shadow-sm">
          <div>
            <p className="text-sm text-slate-500">Design file / Homepage.psd</p>
            <h1 className="text-2xl font-bold text-slate-900">Infinite canvas</h1>
          </div>
          <div className="flex items-center gap-3">
            <MemberPresence />
            <button className="rounded-xl bg-slate-900 px-4 py-2.5 text-sm font-medium text-white">Share</button>
          </div>
        </header>

        <InfiniteCanvas />
      </div>
    </main>
  );
}
