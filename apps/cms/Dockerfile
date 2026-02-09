FROM node:20-alpine AS base
RUN corepack enable && corepack prepare pnpm@9.15.0 --activate
RUN apk add --no-cache build-base gcc autoconf automake zlib-dev libpng-dev vips-dev

# --- Dependencies ---
FROM base AS deps
WORKDIR /app
COPY package.json pnpm-workspace.yaml pnpm-lock.yaml .npmrc ./
COPY apps/cms/package.json ./apps/cms/
COPY packages/typescript-config/package.json ./packages/typescript-config/
COPY packages/shared-types/package.json ./packages/shared-types/
RUN pnpm install --frozen-lockfile

# --- Builder ---
FROM base AS builder
WORKDIR /app
COPY --from=deps /app/node_modules ./node_modules
COPY . .
WORKDIR /app/apps/cms
RUN pnpm build

# --- Runner ---
FROM node:20-alpine AS runner
RUN apk add --no-cache vips-dev
WORKDIR /opt/app
ENV NODE_ENV=production

COPY --from=builder /app/apps/cms/dist ./dist
COPY --from=builder /app/apps/cms/package.json ./
COPY --from=builder /app/apps/cms/public ./public
COPY --from=builder /app/apps/cms/config ./config
COPY --from=builder /app/apps/cms/src ./src
COPY --from=builder /app/apps/cms/database ./database
COPY --from=builder /app/node_modules ./node_modules

EXPOSE 1337
CMD ["node", "dist/server.js"]
