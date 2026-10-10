"use client";

import { useMutation } from "@tanstack/react-query";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { API_BASE_URL } from "@/lib/api";
import { useAuthStore } from "@/store/auth";

interface AuthResponse {
  user: { id: string; email: string; name: string };
  tokens: { accessToken: string; refreshToken: string };
}

export default function HomePage() {
  const [mode, setMode] = useState<"login" | "register">("login");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [name, setName] = useState("");
  const login = useAuthStore((state) => state.login);
  const router = useRouter();

  const authMutation = useMutation({
    mutationFn: async () => {
      const endpoint = mode === "login" ? "/auth/login" : "/auth/register";
      const response = await fetch(`${API_BASE_URL}${endpoint}`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(mode === "login" ? { email, password } : { email, password, name }),
      });
      if (!response.ok) {
        throw new Error("认证失败");
      }
      return (await response.json()) as AuthResponse;
    },
    onSuccess: (data) => {
      login(data.tokens.accessToken, data.user);
      localStorage.setItem("codesign_refresh_token", data.tokens.refreshToken);
      router.push("/dashboard");
    },
  });

  return (
    <main className="flex min-h-screen items-center justify-center bg-gradient-to-br from-slate-950 via-slate-900 to-slate-800 px-4">
      <div className="w-full max-w-md rounded-2xl border border-white/10 bg-white/10 p-6 text-white backdrop-blur">
        <h1 className="text-2xl font-bold">{mode === "login" ? "登录" : "注册"}</h1>
        <p className="mt-1 text-sm text-slate-300">CodeSign 平台</p>

        <div className="mt-5 space-y-3">
          {mode === "register" && (
            <input value={name} onChange={(event) => setName(event.target.value)} placeholder="姓名" className="w-full rounded-lg border border-white/20 bg-white/5 px-3 py-2 text-sm outline-none" />
          )}
          <input value={email} onChange={(event) => setEmail(event.target.value)} placeholder="邮箱" className="w-full rounded-lg border border-white/20 bg-white/5 px-3 py-2 text-sm outline-none" />
          <input type="password" value={password} onChange={(event) => setPassword(event.target.value)} placeholder="密码" className="w-full rounded-lg border border-white/20 bg-white/5 px-3 py-2 text-sm outline-none" />
        </div>

        {authMutation.isError && <p className="mt-3 text-sm text-rose-300">登录失败，请检查输入。</p>}

        <button className="mt-5 w-full rounded-lg bg-sky-500 px-4 py-2 text-sm font-medium" type="button" onClick={() => authMutation.mutate()}>
          {authMutation.isPending ? "提交中..." : mode === "login" ? "登录" : "注册"}
        </button>

        <button className="mt-3 text-sm text-sky-200" type="button" onClick={() => setMode((prev) => (prev === "login" ? "register" : "login"))}>
          {mode === "login" ? "没有账号？去注册" : "已有账号？去登录"}
        </button>
      </div>
    </main>
  );
}
