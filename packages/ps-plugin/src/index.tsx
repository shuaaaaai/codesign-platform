import React, { useState, useEffect } from "react";

const SETTINGS_KEY = "codesign_settings";

export default function App() {
  const [apiUrl, setApiUrl] = useState("http://localhost:4000");
  const [token, setToken] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [projects, setProjects] = useState<Array<{ id: string; name: string }>>([]);
  const [selectedProjectId, setSelectedProjectId] = useState("");
  const [status, setStatus] = useState("");
  const [progress, setProgress] = useState(0);
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  useEffect(() => {
    try {
      const raw = localStorage.getItem(SETTINGS_KEY);
      if (!raw) {
        return;
      }
      const settings = JSON.parse(raw) as { apiUrl?: string; token?: string; email?: string };
      if (settings.apiUrl) {
        setApiUrl(settings.apiUrl);
      }
      if (settings.token) {
        setToken(settings.token);
        setIsLoggedIn(true);
      }
      if (settings.email) {
        setEmail(settings.email);
      }
    } catch {
      // ignore
    }
  }, []);

  const saveSettings = (next: Partial<{ apiUrl: string; token: string; email: string }>) => {
    const current = JSON.parse(localStorage.getItem(SETTINGS_KEY) ?? "{}") as Record<string, unknown>;
    localStorage.setItem(SETTINGS_KEY, JSON.stringify({ ...current, ...next }));
  };

  const loadProjects = async (t: string) => {
    try {
      const res = await fetch(`${apiUrl}/projects`, {
        headers: { Authorization: `******
      });
      const data = await res.json();
      setProjects(Array.isArray(data) ? data : []);
    } catch (error) {
      setStatus(`加载项目失败: ${String(error)}`);
    }
  };

  const login = async () => {
    try {
      setStatus("正在登录...");
      const res = await fetch(`${apiUrl}/auth/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });
      const data = await res.json();
      if (data.tokens?.accessToken) {
        const nextToken = data.tokens.accessToken as string;
        setToken(nextToken);
        setIsLoggedIn(true);
        setStatus("登录成功");
        saveSettings({ apiUrl, token: nextToken, email });
        await loadProjects(nextToken);
      } else {
        setStatus("登录失败");
      }
    } catch (error) {
      setStatus(`登录失败: ${String(error)}`);
    }
  };

  const uploadDocument = async () => {
    try {
      if (!selectedProjectId) {
        setStatus("请选择项目");
        return;
      }

      setStatus("正在读取文档...");
      // @ts-ignore UXP API
      const app = window.require("photoshop").app;
      const doc = app.activeDocument;
      if (!doc) {
        setStatus("没有打开的文档");
        return;
      }

      // @ts-ignore
      const fs = window.require("uxp").storage.localFileSystem;
      const tempFolder = await fs.getTemporaryFolder();
      const tempFile = await tempFolder.createFile("upload.psd", { overwrite: true });
      // @ts-ignore
      await doc.save(tempFile);
      const buffer = await tempFile.read({ format: "binary" });

      const formData = new FormData();
      const blob = new Blob([buffer], { type: "application/octet-stream" });
      formData.append("file", blob, doc.name.endsWith(".psd") ? doc.name : `${doc.name}.psd`);
      formData.append("projectId", selectedProjectId);

      setStatus("上传中...");
      setProgress(20);
      const res = await fetch(`${apiUrl}/design-files/upload`, {
        method: "POST",
        headers: { Authorization: `******
        body: formData,
      });
      const data = await res.json();
      if (data.fileId) {
        setStatus(`上传成功！文件 ID: ${data.fileId}`);
        setProgress(100);
      } else {
        setStatus(`上传失败: ${JSON.stringify(data)}`);
      }
    } catch (error) {
      setStatus(`上传失败: ${String(error)}`);
    }
  };

  if (!isLoggedIn) {
    return (
      <div style={{ padding: 16 }}>
        <h3>CoDesign 登录</h3>
        <input value={apiUrl} onChange={(e) => { setApiUrl(e.target.value); saveSettings({ apiUrl: e.target.value }); }} placeholder="服务器地址" style={{ width: "100%", marginBottom: 8 }} />
        <input value={email} onChange={(e) => setEmail(e.target.value)} placeholder="邮箱" style={{ width: "100%", marginBottom: 8 }} />
        <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} placeholder="密码" style={{ width: "100%", marginBottom: 8 }} />
        <button onClick={login} style={{ width: "100%" }}>登录</button>
        {status && <p>{status}</p>}
      </div>
    );
  }

  return (
    <div style={{ padding: 16 }}>
      <h3>CoDesign 上传</h3>
      <select value={selectedProjectId} onChange={(e) => setSelectedProjectId(e.target.value)} style={{ width: "100%", marginBottom: 8 }}>
        <option value="">选择项目</option>
        {projects.map((project) => (
          <option key={project.id} value={project.id}>{project.name}</option>
        ))}
      </select>
      <button onClick={uploadDocument} disabled={!selectedProjectId} style={{ width: "100%", marginBottom: 8 }}>
        上传当前文档
      </button>
      {progress > 0 && <progress value={progress} max={100} style={{ width: "100%" }} />}
      {status && <p style={{ fontSize: 12 }}>{status}</p>}
      <button
        onClick={() => {
          setIsLoggedIn(false);
          setToken("");
          localStorage.removeItem(SETTINGS_KEY);
        }}
        style={{ width: "100%", marginTop: 8, opacity: 0.6 }}
      >
        退出登录
      </button>
    </div>
  );
}
