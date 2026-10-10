import Link from "next/link";

const projects = [
  { id: "p-1", name: "Marketing Site", modified: "2 hours ago", members: 8, artboards: 24 },
  { id: "p-2", name: "Mobile App", modified: "Today", members: 5, artboards: 38 },
  { id: "p-3", name: "Checkout Flow", modified: "Yesterday", members: 6, artboards: 16 },
];

export default function DashboardPage() {
  return (
    <main className="min-h-screen bg-slate-100 p-6">
      <div className="mx-auto max-w-6xl">
        <div className="mb-8 flex items-center justify-between">
          <div>
            <p className="text-sm uppercase tracking-[0.24em] text-slate-500">Workspace</p>
            <h1 className="mt-2 text-3xl font-bold text-slate-900">Projects</h1>
          </div>
          <button className="rounded-xl bg-slate-900 px-4 py-2.5 text-sm font-medium text-white">New project</button>
        </div>

        <div className="grid gap-5 md:grid-cols-3">
          {projects.map((project) => (
            <Link href={`/project/${project.id}`} key={project.id} className="rounded-3xl border border-slate-200 bg-white p-5 shadow-sm transition hover:-translate-y-1 hover:shadow-md">
              <div className="mb-5 h-40 rounded-2xl bg-gradient-to-br from-sky-500 via-violet-500 to-fuchsia-500" />
              <div className="flex items-center justify-between">
                <h2 className="text-xl font-semibold text-slate-900">{project.name}</h2>
                <span className="rounded-full bg-emerald-100 px-2 py-1 text-xs font-medium text-emerald-700">Live</span>
              </div>
              <p className="mt-3 text-sm text-slate-500">Last modified {project.modified}</p>
              <div className="mt-5 flex items-center justify-between text-sm text-slate-600">
                <span>{project.artboards} artboards</span>
                <span>{project.members} members</span>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </main>
  );
}
