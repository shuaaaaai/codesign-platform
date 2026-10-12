FROM node:22-alpine AS base
RUN corepack enable

FROM base AS deps
WORKDIR /app
COPY package.json pnpm-workspace.yaml pnpm-lock.yaml ./
COPY apps/server/package.json ./apps/server/
COPY packages/ ./packages/
RUN pnpm install --frozen-lockfile

FROM base AS builder
WORKDIR /app
COPY --from=deps /app/node_modules ./node_modules
COPY . .
RUN pnpm --filter @codesign/psd-parser build 2>/dev/null || true
RUN pnpm --filter @codesign/code-generator build 2>/dev/null || true
WORKDIR /app/apps/server
RUN pnpm build

FROM base AS runner
WORKDIR /app
ENV NODE_ENV=production
COPY --from=builder /app/apps/server/dist ./dist
COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app/apps/server/package.json ./package.json
EXPOSE 4000
CMD ["node", "dist/main.js"]
