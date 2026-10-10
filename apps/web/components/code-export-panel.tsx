export function CodeExportPanel() {
  const tabs = ["CSS", "Tailwind", "React", "Vue", "iOS", "Android"];
  const active = "Tailwind";
  return (
    <div className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm">
      <div className="mb-4 flex flex-wrap gap-2">
        {tabs.map((tab) => (
          <button key={tab} className={`rounded-lg px-3 py-1.5 text-xs font-medium ${tab === active ? "bg-slate-900 text-white" : "bg-slate-100 text-slate-600"}`}>
            {tab}
          </button>
        ))}
      </div>
      <pre className="overflow-x-auto rounded-xl bg-slate-950 p-4 text-xs text-slate-200">
{`<button className="rounded-xl bg-sky-500 px-4 py-3 text-white shadow-sm">
  Get started
</button>`}
      </pre>
    </div>
  );
}
