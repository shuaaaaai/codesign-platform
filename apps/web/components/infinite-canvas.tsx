"use client";

const boards = [
  { id: "b1", name: "Landing", x: 80, y: 60, width: 440, height: 280, accent: "from-rose-500 to-orange-400" },
  { id: "b2", name: "Dashboard", x: 620, y: 120, width: 420, height: 300, accent: "from-sky-500 to-cyan-400" },
  { id: "b3", name: "Pricing", x: 180, y: 500, width: 500, height: 260, accent: "from-violet-500 to-purple-400" },
  { id: "b4", name: "Checkout", x: 760, y: 560, width: 430, height: 260, accent: "from-emerald-500 to-teal-400" },
];

export function InfiniteCanvas() {
  return (
    <div className="relative h-[720px] overflow-hidden rounded-3xl border border-slate-200 bg-slate-50 shadow-soft">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,_rgba(148,163,184,0.18),_transparent_55%)]" />
      <div className="absolute left-6 top-6 z-10 flex items-center gap-2 rounded-full border border-slate-200 bg-white/90 px-3 py-1.5 text-xs font-medium text-slate-600 backdrop-blur-sm">
        <span className="h-2.5 w-2.5 rounded-full bg-emerald-500" />
        4 online collaborators
      </div>
      <div className="absolute inset-0" style={{ transform: "scale(1)" }}>
        {boards.map((board) => (
          <div
            key={board.id}
            className="absolute cursor-pointer rounded-2xl border border-slate-200 bg-white p-3 shadow-lg transition hover:-translate-y-0.5"
            style={{ left: board.x, top: board.y, width: board.width, height: board.height }}
          >
            <div className={`mb-3 h-28 rounded-xl bg-gradient-to-br ${board.accent}`} />
            <div className="space-y-2">
              <div className="h-3 w-24 rounded-full bg-slate-200" />
              <div className="h-2.5 w-36 rounded-full bg-slate-100" />
              <div className="h-2.5 w-28 rounded-full bg-slate-100" />
            </div>
            <div className="mt-4 flex items-center justify-between text-xs text-slate-500">
              <span>{board.name}</span>
              <span>1440 × 1024</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
