import Link from "next/link";

const files = [
  { id: "f-1", name: "Homepage.psd", updated: "Today", status: "Ready" },
  { id: "f-2", name: "Checkout.psd", updated: "Yesterday", status: "Processing" },
  { id: "f-3", name: "Dashboard.psd", updated: "2 days ago", status: "Ready" },
];

export default function ProjectDetailPage() {
  return (
    <main className="min-h-screen bg-slate-100 p-6">
      <div className="mx-auto max-w-6xl">
        <div className="mb-6 flex items-center justify-between">
          <div>
            <p className="text-sm text-slate-500">Project / Marketing Site</p>
            <h1 className="mt-2 text-3xl font-bold text-slate-900">Design files</h1>
          </div>
          <button className="rounded-xl bg-slate-900 px-4 py-2.5 text-sm font-medium text-white">Upload PSD</button>
        </div>

        <div className="space-y-4">
          {files.map((file) => (
            <Link key={file.id} href={`/design/${file.id}`} className="flex items-center justify-between rounded-2xl border border-slate-200 bg-white p-4 shadow-sm">
              <div className="flex items-center gap-4">
                <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-slate-100 text-lg">🖼️</div>
                <div>
                  <p className="font-semibold text-slate-900">{file.name}</p>
                  <p className="text-sm text-slate-500">Updated {file.updated}</p>
                </div>
              </div>
              <span className={`rounded-full px-2.5 py-1 text-xs font-medium ${file.status === "Ready" ? "bg-emerald-100 text-emerald-700" : "bg-amber-100 text-amber-700"}`}>
                {file.status}
              </span>
            </Link>
          ))}
        </div>
      </div>
    </main>
  );
}
