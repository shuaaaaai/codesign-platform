FROM node:22-alpine
WORKDIR /workspace
COPY package.json pnpm-workspace.yaml .
COPY apps ./apps
COPY packages ./packages
RUN corepack enable && pnpm install --frozen-lockfile && pnpm build
EXPOSE 3000 4000
CMD ["sh", "-lc", "pnpm dev"]
