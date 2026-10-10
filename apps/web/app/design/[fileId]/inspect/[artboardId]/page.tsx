import { CodeExportPanel } from "@/components/code-export-panel";
import { LayerTree } from "@/components/layer-tree";
import { PropertyPanel } from "@/components/property-panel";

export default function InspectPage() {
  return (
    <main className="min-h-screen bg-slate-100 p-6">
      <div className="mx-auto max-w-7xl">
        <div className="mb-6 flex items-center justify-between">
          <div>
            <p className="text-sm text-slate-500">Inspect / Artboard 02</p>
            <h1 className="text-3xl font-bold text-slate-900">Landing page</h1>
          </div>
          <button className="rounded-xl bg-slate-900 px-4 py-2.5 text-sm font-medium text-white">Export code</button>
        </div>

        <div className="grid gap-6 xl:grid-cols-[300px_minmax(0,1fr)_320px]">
          <LayerTree />
          <div className="rounded-3xl border border-slate-200 bg-white p-5 shadow-sm">
            <div className="mb-4 flex items-center justify-between">
              <div>
                <p className="text-xs uppercase tracking-[0.2em] text-slate-500">Preview</p>
                <h2 className="mt-1 text-xl font-semibold text-slate-900">Hero section</h2>
              </div>
              <span className="rounded-full bg-violet-100 px-2.5 py-1 text-xs font-medium text-violet-700">Selected</span>
            </div>
            <div className="rounded-2xl bg-gradient-to-br from-slate-900 via-slate-800 to-slate-700 p-6">
              <div className="rounded-2xl bg-white/10 p-6 text-white backdrop-blur-sm">
                <p className="text-sm text-slate-300">Design system</p>
                <h3 className="mt-3 text-4xl font-bold">Shipping faster with clarity.</h3>
                <p className="mt-4 max-w-md text-slate-300">Create product experiences from design to code with faster collaboration and cleaner handoff workflows.</p>
                <div className="mt-6 flex gap-3">
                  <button className="rounded-xl bg-sky-500 px-4 py-3 font-medium text-white">Get started</button>
                  <button className="rounded-xl border border-white/20 px-4 py-3 font-medium text-white">See docs</button>
                </div>
              </div>
            </div>
          </div>
          <div className="space-y-6">
            <PropertyPanel />
            <CodeExportPanel />
          </div>
        </div>
      </div>
    </main>
  );
}
