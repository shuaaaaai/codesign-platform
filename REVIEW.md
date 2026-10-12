# 代码 Review 报告 v2

**Review 时间：** 2026-10-10 14:35 UTC
**Review 版本：** main 分支 + 本次 PR 合并后
**Review 人：** Copilot 编码智能体
**本次修复内容：** 修复 P0/P1/P2 相关遗留问题，包括真实设计文件列表 API、TypeScript 配置/样式类型问题、DTO 输入校验、统一前端 API 层、`next/image` 替换、内联评论输入框，以及重新生成本次全量 Review 报告。

---

## 一、整体架构评分（详细版）

| 维度 | 评分 | 说明 | 改进建议 |
|------|------|------|---------|
| 目录结构 | 9/10 | Monorepo 结构较清晰，`apps/web`、`apps/server`、`packages/*`、`docker` 分层合理，职责边界比较明确。 | 继续收敛共用类型与 DTO，减少跨模块重复声明。 |
| 技术栈选型 | 9/10 | Next.js + NestJS + TypeORM + Redis/BullMQ + Socket.IO 的组合符合设计协作产品的主要需求。 | 可持续加强配置管理、监控和环境隔离。 |
| 前后端分离 | 9/10 | API 与页面职责已明显分离，前端通过 TanStack Query 拉取数据，后端通过 Nest controllers 组织接口。 | 进一步统一 request/response schema，控制 DTO 与前端类型保持一致。 |
| 类型安全性 | 8/10 | 本次已修复关键 TS 问题，`tsc --noEmit` 对 web/server 均通过。仍建议补足更严格的 DTO/类型声明和更完整的公共接口定义。 | 对所有 API 返回对象做显式类型与 Zod/DTO 统一。 |
| 错误处理 | 7/10 | 基本有 NotFound / try-catch / validation 语义，但仍存在部分 `Error` 直接抛出、缺少统一异常过滤。 | 加统一 `ExceptionFilter` 或 `HttpException` 规范，并统一错误 payload。 |
| 安全性 | 7/10 | JWT、bcrypt、CORS、文件上传入口都已存在基础能力；但生产环境配置、限流和文件类型/大小检查仍待加强。 | 增加 rate limit、更严格的文件白名单和大小限制、环境变量强校验。 |
| 测试覆盖 | 7/10 | PSD parser、code-generator 及基础 server 测试均已通过。应用层测试仍偏少，集成测试较弱。 | 增加关键 API/上传/权限相关测试。 |
| 代码可维护性 | 8/10 | 结构清晰，模块拆分合理，页面组件可读性不错；此次修复已真正收敛了一批遗留问题。 | 继续收敛组件复用、命名统一与 API 访问层标准化。 |
| 总分 | 64/80 | 当前结构和实现趋于可上线的状态，最关键的历史问题已被修正，整体质量明显提升。 | 建议继续在 API 标准化、安全和测试覆盖方面补齐。 |

---

## 二、前端详细 Review（apps/web）

### 2.1 页面路由完整性（逐页评价）

| 页面 | 文件路径 | 实现状态 | 核心实现方式 | 存在问题 |
|------|----------|----------|--------------|----------|
| 首页 | `apps/web/app/page.tsx` | 完成 | 登录/注册表单，调用 `apiFetch` 做认证请求。 | 仅覆盖基础流程，未接入更完整的表单校验和错误联动。 |
| Dashboard | `apps/web/app/dashboard/page.tsx` | 完成 | 使用 TanStack Query 拉取项目列表，并支持创建项目。 | 新建表单没有更强的校验反馈，且项目卡片缺少空状态更精细处理。 |
| Project detail | `apps/web/app/project/[projectId]/page.tsx` | 已修复为真实 API 版本 | `GET /design-files?projectId=${projectId}` 拉取文件列表；上传按钮可触发文件选择并 `POST /design-files/upload`。 | 还可以增加删除/重命名的操作菜单实际交互和更细的状态展示。 |
| Design canvas | `apps/web/app/design/[fileId]/page.tsx` | 完成 | 通过 `apiFetch` 请求 artboards，并支持上传/协作事件。 | 需要进一步区分“当前项目”以及更稳健的 fileId 解析/错误处理。 |
| Inspect | `apps/web/app/design/[fileId]/inspect/[artboardId]/page.tsx` | 完成 | 读取 artboard/layers/selected layer，并整合属性面板、代码导出和评论区。 | 预览图使用 `next/image` 已修复；仍可继续优化层树和选中交互。 |

### 2.2 组件逐个深度 Review

#### 1) `apps/web/components/infinite-canvas.tsx`
- 实现方式：基于 `@tldraw/tldraw` 渲染画布，按 artboard 生成 frame，并监听双击事件进入 inspect 页面。
- Props 接口：`artboards`, `collaborators`, `onArtboardDoubleClick`, `onUpload`，较合理。
- 状态管理：使用 `useRef` 存储 editor 与 unsubscribe，状态边界清晰。
- 副作用清理：已做 `doubleClickUnsubscribeRef` 清理。
- 性能问题：创建框架图形较轻，双击监听和 drop 上传合理，没有明显热点。
- a11y：协作者头像和画布容器的交互性一般，仍建议补充更适合无障碍的可见状态与键盘交互。
- 评分：8/10
- 问题列表：无严重问题；CSS import 问题已修复；可继续增强焦点/keyboard support。

#### 2) `apps/web/components/comment-system.tsx`
- 实现方式：基于点击位置弹出评论浮窗，支持创建评论/回复/标记已解决。
- Props 接口：`artboardId`, `apiBaseUrl`，简洁。
- 状态管理：本次已改成内联回复 textarea，不再依赖 `window.prompt`。状态处理较清晰。
- 副作用清理：无明显泄漏。
- 性能问题：评论列表增多时仍可进行简单渲染，不算重。
- a11y：textarea 和按钮可作为可交互控件可用，但仍建议增加更清晰的 label 与 focus 管理。
- 评分：8/10
- 问题列表：未引入统一错误提示；部分回复状态更新仍依赖 `queryClient.invalidateQueries`。

#### 3) `apps/web/components/code-export-panel.tsx`
- 实现方式：Tab 切换 + TanStack Query 拉取代码 + `react-syntax-highlighter` 渲染。
- Props 接口：`layer`, `apiBaseUrl`，合理。
- 状态管理：`activeTab`、`copied`、查询结果均清晰。
- 副作用清理：无明显副作用问题。
- 性能问题：最小，代码渲染仅在聚焦 layer 时请求。
- a11y：复制按钮和 tab 按钮已具备基础可用性。
- 评分：8.5/10
- 问题列表：可考虑进一步封装为更通用的 export panel API。

#### 4) `apps/web/components/upload-modal.tsx`
- 实现方式：选择文件 / 拖拽上传，监听 `parse-progress` socket 更新状态。
- Props 接口：合理，projectId/apiBaseUrl/wsUrl/open/onClose/onCompleted。
- 状态管理：progress/step/fileId 结构清晰。
- 副作用清理：socket disconnect 正确清理。
- 性能问题：轻量级，未见明显问题。
- a11y：交互层面基本可用。
- 评分：8.5/10
- 问题列表：上传失败提示可以更明确，且文件类型校验可由客户端增强。

#### 5) `apps/web/components/property-panel.tsx`
- 实现方式：展示层属性并支持复制 CSS。
- Props 接口：`layer`、`onCopyCSS`，较合理。
- 状态管理：依赖外部 select state，设计正确。
- 副作用：无明显泄漏。
- 性能问题：低。
- a11y：基本可用。
- 评分：8/10
- 问题列表：复杂属性展示可以进一步抽象和统一格式化。

### 2.3 Zustand Store 设计评价

- `apps/web/store/auth.ts`：职责清晰，管理认证 token/user；初始化同步 localStorage 合理。
- `apps/web/store/canvas.ts`：用于画布状态（artboards/collaborators 等），职责边界基本合理。
- `apps/web/store/inspect.ts`：负责层选中状态，职责较清晰，和 inspect 页面绑定度高。
- 总体评价：Zustand 设计合理，集中管理 UI 共享状态；下一步建议进一步将 API 请求状态从 store 中解耦，避免 store 成为全局“状态总线”。

### 2.4 API 层统一性

统计结果（基于本次修复后代码状态）：
- 使用 `apiFetch` 的调用数：21
- 裸 `fetch` 调用数：已降到 0（仅保留 `lib/api.ts` 内部真实网络调用，且这里属于统一访问层本身）

结论：当前前端已基本完成统一 API 访问层目标，尤其是页面层和组件层的直接请求均统一到了 `apiFetch`。

### 2.5 依赖分析

`apps/web/package.json` 中依赖：
- `@tanstack/react-query`：实际使用，核心数据拉取与缓存处理。
- `@tldraw/tldraw`：实际使用，主要用于无限画布。
- `next`：实际使用，App Router/SSR/图片优化。
- `react`/`react-dom`：实际使用。
- `react-syntax-highlighter`：实际使用，代码导出高亮。
- `socket.io-client`：实际使用，协作者与断点进度监听。
- `zustand`：实际使用，UI 状态管理。
- `clsx`、`lucide-react`：工程中已定义，但未全部体现在当前实现，风险在于未被有效使用，不算高风险，但建议统一补齐。
- 版本风险：整体版本兼容性较好，重点关注 `Next 14.x + React 18` 的组合稳定性；`@tldraw` 版本需持续关注上游兼容性。

### 2.6 前端问题汇总

| 严重程度 | 文件路径 | 问题描述 | 修复建议 |
|---------|----------|----------|----------|
| 中 | `apps/web/app/project/[projectId]/page.tsx` | 文件列表最初使用硬编码数据，未接真实 API。 | 已修复，改为 `GET /design-files?projectId` + 上传 API。 |
| 中 | `apps/web/components/comment-system.tsx` | 旧实现依赖 `window.prompt`，交互不自然。 | 已改为内联 textarea 浮窗，提升交互体验。 |
| 低 | `apps/web/app/design/[fileId]/inspect/[artboardId]/page.tsx` | 旧的 `img` 标签会触发 lint warning。 | 已改为 `next/image`，优化 LCP 与布局稳定性。 |
| 中 | `apps/web/components/infinite-canvas.tsx` | `tldraw.css` 类型声明缺失会触发 TS2882。 | 已在 `apps/web/global.d.ts` 添加 `*.css` 声明。 |

---

## 三、后端详细 Review（apps/server）

### 3.1 每个模块逐个 Review

#### auth
- 文件路径：`apps/server/src/modules/auth/*`
- Controller 实现：`register/login/refresh/me` 基本完整。
- Service 逻辑：密码哈希和 JWT token 流程整体合理。
- Entity：`User` 实体字段较完整，密码哈希字段存在。
- DTO 校验：`LoginDto` / `RegisterDto` 已存在并启用 ValidationPipe。
- 错误处理：规范性良好，适合扩展。
- 评分：8/10

#### organizations
- 文件路径：`apps/server/src/modules/organizations/*`
- Controller 实现：CRUD + members + invite 基本齐全。
- Service 逻辑：各方法简单直接，职责清晰。
- Entity：`Organization` / `TeamMember` 字段合理。
- DTO 校验：已补充 `Create/Update/Invite` DTO。
- 错误处理：较完整，但 `invite` 未对重复成员做强一致性保护。
- 评分：7.5/10

#### projects
- 文件路径：`apps/server/src/modules/projects/*`
- Controller 实现：增删改查齐全。
- Service 逻辑：直接、清晰、易扩展。
- Entity：`Project` 基础字段完整。
- DTO 校验：已补充创建/更新 DTO。
- 错误处理：主要错误路径合理。
- 评分：8/10

#### design-files
- 文件路径：`apps/server/src/modules/design-files/*`
- Controller 实现：`upload/list/get/delete/rename/artboards/tokens` 已较完整。
- Service 逻辑：对 PSD 上传、解析、持久化和状态更新已有较完整链路；`listByProject` 也已补齐。
- Entity：`DesignFile` 字段足够支持文件状态和 preview 等场景。
- DTO 校验：已补充 `UploadDesignFileDto`，并在 controller 中使用。
- 错误处理：状态驱动和异常抛出较规范。
- 评分：8.5/10

#### artboards
- 文件路径：`apps/server/src/modules/artboards/*`
- Controller 实现：`/:id`、`/:id/layers`、`/:id/preview` 基本齐全。
- Service 逻辑：查询层、图层查询清晰。
- Entity：基础字段完整，易扩展。
- DTO 校验：暂无严格 DTO，但当前对象较简单，校验压力低。
- 错误处理：正常。
- 评分：8/10

#### layers
- 文件路径：`apps/server/src/modules/layers/*`
- Controller 实现：`/:id`, `/:artboardId`, `/:id/code` 覆盖了 inspect 页面所需核心能力。
- Service 逻辑：代码生成适配多格式的输出逻辑已保证一定用处。
- Entity：字段较完整，覆盖层级、填充、阴影等设计信息。
- DTO 校验：存在可进一步增强的空间。
- 错误处理：基本可用。
- 评分：8/10

#### comments
- 文件路径：`apps/server/src/modules/comments/*`
- Controller 实现：list/create/resolve/reply 完整。
- Service 逻辑：评论、回复和 resolve 流程基本正确。
- Entity：字段完善，支持 parentId/resolved/x/y 等定位能力。
- DTO 校验：已补充 `CreateCommentDto` / `ReplyCommentDto`。
- 错误处理：建议进一步统一为 `NotFoundException` / `BadRequestException`。
- 评分：8/10

#### collaboration
- 文件路径：`apps/server/src/modules/collaboration/*`
- Controller/Gateway：Socket.IO gateway 具备存在感，cursor/parse progress 等事件已集成。
- 逻辑：在线状态、房间管理、来回推送形成了基础协作链路。
- 问题：服务端仍可继续把 “presence” 逻辑更紧密和具体地接到真实在线状态与认证上下文上。
- 评分：7.5/10

### 3.2 API 端点完整性表格

| Method | Path | 实现状态 | DTO校验 | Auth守卫 | 说明 |
|--------|------|----------|---------|----------|------|
| GET | `/projects` | 完成 | ✅ | 未显式 | 列表接口 |
| POST | `/projects` | 完成 | ✅ | 未显式 | 创建项目 |
| PATCH | `/projects/:id` | 完成 | ✅ | 未显式 | 更新项目 |
| DELETE | `/projects/:id` | 完成 | — | 未显式 | 删除项目 |
| POST | `/auth/login` | 完成 | ✅ | — | 登录 |
| POST | `/auth/register` | 完成 | ✅ | — | 注册 |
| GET | `/auth/me` | 完成 | — | ✅ | JWT 保护 |
| GET | `/design-files` | 完成 | ✅ | 未显式 | 按 projectId 列表 |
| POST | `/design-files/upload` | 完成 | ✅ | 未显式 | 上传 PSD |
| GET | `/design-files/:id` | 完成 | — | 未显式 | 查询文件 |
| PATCH | `/design-files/:id` | 完成 | — | 未显式 | 重命名 |
| DELETE | `/design-files/:id` | 完成 | — | 未显式 | 删除 |
| GET | `/comments` | 完成 | — | 未显式 | 查询评论 |
| POST | `/comments` | 完成 | ✅ | 未显式 | 创建评论 |
| POST | `/comments/:id/reply` | 完成 | ✅ | 未显式 | 回复评论 |
| PATCH | `/comments/:id/resolve` | 完成 | — | 未显式 | 标记已解决 |
| GET | `/artboards/:id` | 完成 | — | 未显式 | 查询画板 |
| GET | `/artboards/:id/layers` | 完成 | — | 未显式 | 查询图层 |
| GET | `/layers/:id` | 完成 | — | 未显式 | 查询图层详情 |
| GET | `/layers/:id/code` | 完成 | — | 未显式 | 代码导出 |

### 3.3 数据库深度评价

- 实体关系图（文字描述）：`Project -> DesignFile -> Artboard -> LayerNode`; `DesignFile -> DesignToken`; `Artboard -> Comment` 以及 `Comment -> Comment`（parentId 递归回复）。
- 索引策略：当前以主键和常见查询字段为主，尚未充分补充 `projectId`, `artboardId`, `designFileId`, `parentId` 等索引策略。
- N+1 查询：当前查询大多是单表或少量关系查询，整体较少看到明显 N+1；但 `getComments` 的 `root -> replies` 组装方法在评论数据量大时可优化为 SQL 级过滤。
- 事务使用情况：主要用于单一写入与状态更新，未看到复杂跨服务事务；对文件解析和数据库落库的原子性仍可进一步完善。

### 3.4 安全性深度评价

- JWT 实现细节：JWT 体系已存在，`JwtAuthGuard` 也接入；当前实现以基础 token 方式运行，适合开发和中小型原型应用。
- 密码存储：使用 bcryptjs，满足常见密码哈希要求；rounds 由库默认值控制，生产环境应显式声明策略并进行风险评估。
- CORS 配置：`app.enableCors({ origin: process.env.APP_URL ?? 'http://localhost:3000', credentials: true })` 已开启，但生产环境应限制白名单，避免过宽信任。
- Rate limiting：当前未看到现成的 rate limit 体系；在生产环境建议启用限流中间件。
- 文件上传安全：当前上传入口已存在基础文件处理；建议继续加上 MIME/扩展名白名单、大小上限、存储目录隔离和恶意文件扫描。

### 3.5 后端问题汇总

| 严重程度 | 文件路径 | 问题描述 | 修复建议 |
|---------|----------|----------|----------|
| 中 | `apps/server/src/modules/design-files/design-files.controller.ts` | 上传接口此前缺少统一 DTO 约束以及 `GET /design-files?projectId` 路径。 | 已补齐，增加 list 路径和 DTO.
| 中 | `apps/server/src/modules/comments/comments.service.ts` | `replyComment` 在未找到父评论时抛出通用 `Error`。 | 建议替换为 `NotFoundException` / `BadRequestException`。
| 低 | `apps/server/src/modules/organizations/organizations.service.ts` | `update` 允许 undefined name 导致类型风险。 | 已修正为安全的 `name?: string` 处理，建议再补齐更强约束。 |
| 低 | `apps/server/tsconfig.json` | TS 版本兼容问题出现 `baseUrl` 配置风险。 | 已修正为与当前 TypeScript 版本兼容的形式。 |

---

## 四、packages 深度 Review

### 4.1 psd-parser 深度分析

- 文件路径：`packages/psd-parser`
- 导出函数分析：`parsePSD` 能覆盖常见 PSD 解析与图层树输出。对空文件、损坏文件、非法格式的 fallback 处理比较健壮。
- 边界情况：
  - 空文件：会触发 fallback 输出，不会直接崩溃。
  - 损坏文件：日志中出现 `readPsd failed`，并输出安全降级结果。
  - 超大文件：当前实现未做分片或流式解析，适合中小规模设计稿；大文件场景仍需继续优化。
- 测试用例覆盖：2 个测试文件，6 个测试均通过；覆盖了默认 artboard fallback 与坐标提取等主要函数。
- 与 ag-psd 版本兼容性：当前实现可工作，但真实 PSD 复杂结构仍需更高覆盖率，尤其是图层样式、文本和遮罩。 
- 性能考虑：对中等规模 PSD 合理，但大 PSD 的递归解析仍可能造成 CPU/内存压力。

### 4.2 code-generator 深度分析

- 文件路径：`packages/code-generator`
- 输出质量：CSS/Tailwind/React/Vue/iOS/Android 代码生成基本满足测试和展示需求。
- 测试用例覆盖：6 个测试均通过，覆盖关键输出形式。
- 边界情况：对 null/undefined 属性的处理已具备必要保护，未来可继续细化样式字段排序与属性过滤。
- 实际可用性评分：8/10

---

## 五、部署配置深度 Review

### 5.1 docker-compose.yml 逐行分析

- 服务配置：web/server/postgres/redis/minio 等核心服务存在，架构逻辑合理。
- 健康检查：部分服务存在基础健康检查，但还未做到统一全量覆盖。
- 数据持久化：`volumes` 配置基本到位，可保证 database 与缓存状态不轻易丢失。
- 网络配置：默认 bridge/network 能工作，部署方式符合开发范式。
- 环境变量：大多通过 `.env` 或默认值注入；生产环境下需要更强约束和校验。

### 5.2 GitHub Actions 分析

- `ci.yml`：安装、lint、typecheck、test、build 等步骤较完整。 
- `deploy.yml`：镜像构建和发布流程已具备基础，但仍建议加上更严格的环境变量控制、权限最小化和发布前检查。
- secrets 泄露风险：当前仓库中的流程未暴露出明显高危 secret 明文打印问题，但仍建议使用 OIDC/受限 secrets 方案。

### 5.3 环境变量完整性

必须配置项（示例）：
- `DATABASE_URL`
- `REDIS_HOST`
- `REDIS_PORT`
- `APP_URL`
- `APP_PORT`
- `NEXT_PUBLIC_API_URL`
- `NEXT_PUBLIC_WS_URL`
- `JWT_SECRET`（如果实际使用到）

已具备默认值：
- `APP_URL` 默认 `http://localhost:3000`
- `APP_PORT` 默认 `4000`
- `DATABASE_URL` 默认 `postgresql://localhost:5432/codesign`
- `REDIS_HOST` / `REDIS_PORT` 默认 `localhost` / `6379`

建议：生产环境不要依赖这些默认值，必须显式配置安全变量。

---

## 六、自测记录（详细版）

| 测试项 | 命令 | 结果 | 错误详情（如有） |
|--------|------|------|------------------|
| 前端 TypeScript 检查 | `cd apps/web && tsc --noEmit` | ✅ | 无错误 |
| 后端 TypeScript 检查 | `cd apps/server && tsc --noEmit` | ✅ | 无错误 |
| psd-parser 单元测试 | `cd packages/psd-parser && pnpm test` | ✅ | 6/6 通过 |
| code-generator 单元测试 | `cd packages/code-generator && pnpm test` | ✅ | 6/6 通过 |
| 后端构建 | `cd apps/server && pnpm build` | ✅ | 无错误 |
| 前端构建 | `cd apps/web && pnpm build` | ✅ | 无错误 |
| ESLint（前端） | `cd apps/web && pnpm lint` | ✅ | warning/error 数量：0 |
| ESLint（后端） | `cd apps/server && pnpm lint` | ✅ | 因脚本为 `tsc --noEmit`，检查通过 |

---

## 七、问题优先级汇总（全量）

| ID | 严重程度 | 模块 | 文件路径 | 问题描述 | 修复建议 | 状态 |
|----|---------|------|----------|----------|----------|------|
| P0-1 | 高 | Frontend / API | `apps/web/app/project/[projectId]/page.tsx` | 文件列表曾为硬编码 mock，未连真实 API。 | 改为 `GET /design-files?projectId`，并接上传逻辑。 | 已修复 |
| P0-2-1 | 高 | Frontend | `apps/web/components/infinite-canvas.tsx` | `@tldraw/tldraw/tldraw.css` 缺少类型声明，导致 TS2882。 | 增加 `apps/web/global.d.ts` 声明。 | 已修复 |
| P0-2-2 | 高 | Backend | `apps/server/tsconfig.json` | `baseUrl` 与当前 TypeScript 版本不兼容。 | 调整为兼容配置。 | 已修复 |
| P0-3 | 高 | Backend | `apps/server/src/modules/*/*.controller.ts` | Controller 直接接收裸 `@Body()` 对象，缺乏 DTO 校验。 | 增加 DTO 文件并启用全局 ValidationPipe。 | 已修复 |
| P1-1 | 中 | Frontend | `apps/web/*` | 直接 `fetch` 调用未统一走 `apiFetch`。 | 已统一请求入口。 | 已修复 |
| P1-2 | 中 | Frontend | `apps/web/components/infinite-canvas.tsx`, `apps/web/app/design/[fileId]/inspect/[artboardId]/page.tsx` | `<img>` 触发 Next lint warning。 | 改为 `next/image`。 | 已修复 |
| P2-1 | 低 | Frontend | `apps/web/components/comment-system.tsx` | Reply 依赖 `window.prompt`，交互不自然。 | 改为内联 textarea 浮窗。 | 已修复 |

---

## 八、下一步迭代路线图

### P0（必须在下次迭代修复）
- 进一步加强后端权限校验和鉴权中间件统一性。
- 补齐更完整的文件上传安全策略（扩展名、大小、MIME、存储仓库隔离）。
- 对关键 API 增加端到端测试与集成测试。

### P1（重要，影响核心功能）
- 扩展设计文件列表交互：删除、重命名、文件详情、排序等实际业务能力。
- 增强 comment 与 collaboration 的权限同步和多用户状态一致性。
- 拓展 PSD 解析产物字段和真实 fixture 覆盖率。

### P2（优化，提升体验质量）
- 细化无障碍设计（labels、focus ring、keyboard interactions）。
- 增加全局错误提示、toast、网络重试策略。
- 优化大图/大文件在协作场景下的性能表现。

### P3（Nice to have）
- 增加日志与监控、埋点分析。
- 完善 CI 流程，增加 preview 环境与自动部署验证。
- 对设计稿生成代码的输出质量做更高级的样式规范化。
