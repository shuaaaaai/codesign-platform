# CodeSign Platform

CodeSign Platform 是一个面向设计协作与代码导出的开源平台，目标是对标腾讯 CoDesign / 蓝湖，支持 PSD 上传、无限画布浏览、图层属性检查、代码导出和多人实时协作。

## 架构概览

- apps/web: Next.js 14 前端
- apps/server: NestJS 后端
- packages/psd-parser: PSD 解析库
- packages/code-generator: 代码生成器
- packages/ps-plugin: Photoshop UXP 插件
- docker: Docker Compose 部署配置

## 功能概览

- PSD / PSB 文件上传与解析
- 项目管理与设计文件列表
- 无限画布浏览和缩略图导航
- 图层树与属性检查面板
- CSS / Tailwind / React / Vue / iOS / Android 代码导出
- 用户、组织、成员和权限管理
- WebSocket / Yjs 协作基础结构

## 快速开始

1. 安装依赖

   ```bash
   corepack enable
   pnpm install
   ```

2. 复制环境变量

   ```bash
   cp .env.example .env
   ```

3. 启动本地开发环境

   ```bash
   pnpm dev
   ```

4. 访问应用

   - Web: http://localhost:3000
   - API: http://localhost:4000
   - MinIO: http://localhost:9001

## Docker 部署

```bash
docker compose -f docker/docker-compose.yml up --build
```

## 环境变量说明

见 `.env.example`，包含：

- `DATABASE_URL`: PostgreSQL 连接串
- `REDIS_URL`: Redis 地址（兼容保留）
- `REDIS_HOST` / `REDIS_PORT`: Redis 主机与端口
- `MINIO_*`: 对象存储配置
- `JWT_SECRET`: 登录签名密钥
- `NEXT_PUBLIC_API_URL`: Web 端 API 地址

## 关键技术栈

- Next.js 14
- NestJS 12
- TypeORM
- PostgreSQL
- Redis + BullMQ
- MinIO
- Tailwind CSS
- Yjs / Socket.IO
- ag-psd

## 说明

本仓库为可扩展的 MVP 结构，核心目标是提供完整工程骨架和关键工作流实现，便于继续扩展协作、解析、代码导出等能力。
