# 代码 Review 报告

**Review 时间：** 2026-10-10 10:08 UTC  
**Review 版本：** `origin/main@1295a96`  
**Review 范围：** 全量代码（前端 + 后端 + packages）

---

## 一、整体架构评分

| 维度 | 评分（满分10） | 说明 |
|------|--------------|------|
| 目录结构 | 9/10 | Monorepo 分层清晰：`apps/web`、`apps/server`、`packages/*`、`docker`。 |
| 技术栈选型 | 8/10 | Next.js + NestJS + TypeORM + Redis/BullMQ + Socket.IO 组合合理。 |
| 前后端分离 | 8/10 | API 和 Web 分离明确，但部分页面仍有前端 mock 数据未接后端。 |
| 类型安全性 | 6/10 | 大量 TS 类型存在，但 `tsc --noEmit`（按题目命令）当前不通过。 |
| 代码可维护性 | 7/10 | 结构可扩展，但部分模块仍偏 MVP（如 collaboration/presence 简化实现）。 |
| 总分 | 38/50 | 具备可持续迭代基础，仍需补齐真实业务闭环。 |

---

## 二、前端（apps/web）Review

### 2.1 页面路由完整性

| 页面 | 状态 | 说明 |
|------|------|------|
| `/` 登录/注册页 | ✅ | 接入 `/auth/login`、`/auth/register`。 |
| `/dashboard` 项目列表 | ✅ | React Query 拉取项目并支持新建。 |
| `/project/[projectId]` | ⚠️ | 文件列表为硬编码数组（`apps/web/app/project/[projectId]/page.tsx`）。 |
| `/design/[fileId]` | ✅ | 画板查询、协作 presence、上传弹窗已接入。 |
| `/design/[fileId]/inspect/[artboardId]` | ✅ | 图层树、属性、代码导出、评论面板联动可用。 |

### 2.2 组件质量

- **InfiniteCanvas**：✅ 已真实接入 tldraw；本次修复为事件总线双击命中（`apps/web/components/infinite-canvas.tsx`）
- **PropertyPanel**：✅ 基本属性展示与复制逻辑完整
- **CodeExportPanel**：✅ 六种导出格式 Tab + Query 拉取 + 复制完整
- **LayerTree**：✅ 树构建、筛选、选中状态完整
- **UploadModal**：✅ 上传+进度订阅逻辑完整
- **CommentSystem**：⚠️ 功能可用，但交互依赖 `prompt`，体验较粗糙

### 2.3 状态管理

Zustand store（`auth/canvas/inspect`）职责拆分清晰；但 `canvas` 中 `zoom/panOffset` 当前未形成完整业务闭环。

### 2.4 API 调用层

TanStack Query 使用整体合理（缓存 key、enabled、invalidate 均有使用）；但部分请求仍直接 `fetch`，未统一走 `apiFetch`，一致性可提升。

### 2.5 已知问题与待优化项

- 🔴 `project/[projectId]` 页面文件列表仍为 mock，未调用后端 design-files 列表 API
- 🟡 多处 `<img>` 触发 Next lint warning（LCP/优化问题）
- 🟢 CommentSystem 使用 `window.prompt` 回复，交互可升级为内联输入

---

## 三、后端（apps/server）Review

### 3.1 模块完整性

| 模块 | 状态 | 说明 |
|------|------|------|
| auth | ✅ | 注册/登录/refresh/me 闭环存在 |
| organizations | ✅ | CRUD + members/invite |
| projects | ✅ | CRUD 完整 |
| design-files | ✅ | 本次已修复真实 PSD 解析与落库 |
| artboards | ✅ | 画板查询、图层查询、预览接口 |
| layers | ✅ | 图层查询 + 多格式代码导出 |
| comments | ✅ | 评论、回复、resolved |
| collaboration | ⚠️ | Gateway 可用，但 REST presence 仅静态返回 |

### 3.2 API 接口完整性

已实现主要端点（证据：`apps/server/src/modules/*/*.controller.ts`）：

- `/auth`: `register/login/refresh/me`
- `/organizations`: `GET/POST/:id/PATCH/DELETE/:id/members/:id/invite`
- `/projects`: `GET/POST/:id/PATCH/DELETE`
- `/design-files`: `upload/get/artboards/tokens`
- `/artboards`: `/:id`、`/:id/layers`、`/:id/preview`
- `/layers`: `/:id`、`/artboard/:artboardId`、`/:id/code`
- `/comments`: `list/create/resolve/reply`

### 3.3 数据库设计

实体设计覆盖设计协作主链路（`design_files`、`artboards`、`layer_nodes`、`design_tokens`、`comments` 等），字段粒度对 UI inspect 足够。后续可加 FK/索引策略提升一致性和查询性能。

### 3.4 安全性

- JWT 实现：中等偏好（`JwtAuthGuard` 已用于 `/auth/me`）
- 输入验证：⚠️ DTO 覆盖不完整，多个控制器直接接收裸对象
- SQL 注入：低风险（TypeORM Repository API，未见原生拼接 SQL）

### 3.5 已知问题与待优化项

- 🔴 `comments.service.ts` 中 `replyComment` 抛通用 `Error`，建议统一 Nest 异常体系
- 🟡 仍存在 `DATABASE_URL`、`APP_URL` localhost fallback（开发友好但生产需严格环境配置）
- 🟢 collaboration REST `presence` 仅占位，建议接 Gateway 在线状态

---

## 四、packages Review

### 4.1 psd-parser

- 功能完整性：✅ 提供 `parsePSD(buffer)` 与图层扁平化
- 边界情况处理：✅ 空 buffer 抛错；`readPsd` 失败有 fallback
- 测试覆盖：⚠️ 有基础测试（6/6 通过），但真实 PSD fixture 场景不足，当前测试大量依赖 fallback

### 4.2 code-generator

- 六种格式实现质量：✅ CSS/Tailwind/React/Vue/iOS/Android 均可生成
- 测试覆盖：✅ 6/6 通过，覆盖核心格式输出断言

---

## 五、部署配置 Review

- `docker/docker-compose.yml`：✅ 基本完整（web/server/postgres/redis/minio）；本次补充了 `REDIS_HOST/REDIS_PORT`
- GitHub Actions：✅ `ci.yml` 包含 install/lint/typecheck/test/build；`deploy.yml` 包含镜像构建推送
- 环境变量：⚠️ 基本完整；建议补充生产环境最小必填清单与默认值约束

---

## 六、下一步迭代建议

- **P0**：补齐 `/project/[projectId]` 文件列表真实 API（移除硬编码 mock）
- **P0**：补齐评论/组织/项目等模块 DTO 校验与统一异常处理
- **P1**：完善 PSD 解析产物（多画板、切图资产、更多 token 规则）
- **P1**：统一前端 API 访问层（减少裸 `fetch`）
- **P2**：替换 `<img>` 为 `next/image`，优化首屏与带宽

---

## 七、自测记录

| 测试项 | 命令 | 结果 |
|--------|------|------|
| TypeScript 类型检查（前端） | `cd apps/web && tsc --noEmit` | ❌ 2 个错误：`globals.css` 与 `@tldraw/tldraw/tldraw.css` 的 side-effect import 声明缺失（TS2882） |
| TypeScript 类型检查（后端） | `cd apps/server && tsc --noEmit` | ❌ 1 个错误：`baseUrl` 配置在当前全局 TypeScript 版本下报错（TS5102） |
| psd-parser 单元测试 | `cd packages/psd-parser && pnpm test` | ✅ 6/6 通过（存在 fallback 相关 stderr 输出） |
| code-generator 单元测试 | `cd packages/code-generator && pnpm test` | ✅ 6/6 通过 |
| 后端构建 | `cd apps/server && pnpm build` | ✅ 通过 |
| 前端构建 | `cd apps/web && pnpm build` | ✅ 通过（2 条 `no-img-element` warning） |

> 备注：本次修复新增链路已通过 `pnpm tsc --noEmit`（apps/server、apps/web）验证；上表严格按题目要求命令记录原始结果。

---

## Review 证据（关键定位）

- PSD 解析与落库修复：`apps/server/src/modules/design-files/design-files.service.ts`
- Redis 配置注入修复：`apps/server/src/modules/design-files/design-files.service.ts`、`docker/docker-compose.yml`、`.env.example`
- Canvas 双击精准修复：`apps/web/components/infinite-canvas.tsx`
- 前端 mock 证据：`apps/web/app/project/[projectId]/page.tsx`
- API 覆盖证据：`apps/server/src/modules/*/*.controller.ts`
