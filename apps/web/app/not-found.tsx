import Link from "next/link";

export default function NotFound() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center gap-4 bg-slate-100">
      <h1 className="text-6xl font-bold text-slate-300">404</h1>
      <p className="text-slate-600">页面不存在</p>
      <Link href="/dashboard" className="rounded-xl bg-slate-900 px-4 py-2 text-sm text-white">
        返回首页
      </Link>
    </div>
  );
}
