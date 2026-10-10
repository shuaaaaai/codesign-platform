import Link from "next/link";

const stats = [
  { label: "Projects", value: "24" },
  { label: "Artboards", value: "146" },
  { label: "Members", value: "18" },
  { label: "Deploys", value: "7" },
];

export default function HomePage() {
  return (
    <main className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-slate-800 px-6 py-10 text-white">
      <div className="mx-auto max-w-6xl">
        <header className="mb-10 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-sky-400 to-violet-500 text-lg font-bold">C</div>
            <div>
              <p className="text-xl font-semibold">CodeSign</p>
              <p className="text-xs text-slate-300">Design collaboration platform</p>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <Link href="/dashboard" className="rounded-full border border-white/20 bg-white/5 px-4 py-2 text-sm hover:bg-white/10">Open dashboard</Link>
            <button className="rounded-full bg-sky-500 px-4 py-2 text-sm font-medium text-white shadow-lg shadow-sky-500/30">Sign in</button>
          </div>
        </header>

        <section className="grid gap-8 lg:grid-cols-[1.2fr_0.8fr]">
          <div>
            <p className="mb-4 inline-flex rounded-full border border-sky-400/30 bg-sky-500/10 px-3 py-1 text-xs font-medium text-sky-200">For design-to-code teams</p>
            <h1 className="max-w-xl text-5xl font-bold tracking-tight">Build better product design handoff.</h1>
            <p className="mt-5 max-w-xl text-lg text-slate-300">
              Upload PSD files, review artboards in an infinite canvas, collaborate with teammates, and export clean code in CSS, Tailwind, React, Vue, iOS, and Android.
            </p>
            <div className="mt-8 flex flex-wrap gap-4">
              <Link href="/dashboard" className="rounded-xl bg-sky-500 px-5 py-3 font-medium text-white shadow-lg shadow-sky-500/30">Launch workspace</Link>
              <Link href="/dashboard" className="rounded-xl border border-white/20 bg-white/5 px-5 py-3 font-medium text-white">Try demo</Link>
            </div>
          </div>

          <div className="rounded-3xl border border-white/10 bg-white/5 p-5 shadow-2xl backdrop-blur-sm">
            <div className="rounded-2xl bg-slate-950 p-4">
              <div className="mb-4 flex items-center justify-between text-xs text-slate-300">
                <span>Project overview</span>
                <span>Live</span>
              </div>
              <div className="space-y-3">
                <div className="h-32 rounded-2xl bg-gradient-to-br from-sky-500 via-violet-500 to-fuchsia-500" />
                <div className="grid grid-cols-2 gap-3">
                  <div className="rounded-xl bg-slate-900 p-3">
                    <p className="text-xs text-slate-400">Design files</p>
                    <p className="mt-1 text-xl font-semibold">36</p>
                  </div>
                  <div className="rounded-xl bg-slate-900 p-3">
                    <p className="text-xs text-slate-400">Reviews</p>
                    <p className="mt-1 text-xl font-semibold">18</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        <section className="mt-12 grid gap-4 md:grid-cols-4">
          {stats.map((stat) => (
            <div key={stat.label} className="rounded-2xl border border-white/10 bg-white/5 p-5">
              <p className="text-slate-300">{stat.label}</p>
              <p className="mt-3 text-3xl font-bold">{stat.value}</p>
            </div>
          ))}
        </section>
      </div>
    </main>
  );
}
