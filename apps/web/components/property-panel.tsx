export function PropertyPanel() {
  return (
    <div className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm">
      <h3 className="mb-4 text-sm font-semibold text-slate-800">Properties</h3>
      <div className="space-y-4 text-sm text-slate-600">
        <div className="flex items-center justify-between"><span>Width</span><span className="font-medium text-slate-800">320px</span></div>
        <div className="flex items-center justify-between"><span>Height</span><span className="font-medium text-slate-800">72px</span></div>
        <div className="flex items-center justify-between"><span>Radius</span><span className="font-medium text-slate-800">16px</span></div>
        <div className="flex items-center justify-between"><span>Text</span><span className="font-medium text-slate-800">Inter / 16 / 600</span></div>
        <div className="flex items-center justify-between"><span>Color</span><span className="flex items-center gap-2 font-medium text-slate-800"><span className="h-3 w-3 rounded-full bg-sky-500" />#0EA5E9</span></div>
      </div>
      <button className="mt-5 w-full rounded-xl bg-slate-900 px-3 py-2 text-sm font-medium text-white">Copy CSS</button>
    </div>
  );
}
