# ---------- Estagio 1: build ----------
FROM node:22-alpine AS builder
RUN npm install -g pnpm@11.28.0
WORKDIR /app

COPY package.json pnpm-lock.yaml pnpm-workspace.yaml ./
COPY backend/package.json ./backend/
RUN pnpm install --frozen-lockfile --ignore-scripts --filter ./backend...

COPY backend ./backend
RUN pnpm --filter ./backend build

# ---------- Estagio 2: producao ----------
FROM node:22-alpine
RUN npm install -g pnpm@11.28.0
WORKDIR /app
ENV NODE_ENV=production

COPY package.json pnpm-lock.yaml pnpm-workspace.yaml ./
COPY backend/package.json ./backend/
RUN pnpm install --frozen-lockfile --ignore-scripts --prod --filter ./backend...

COPY --from=builder /app/backend/dist ./backend/dist

EXPOSE 3000
CMD ["node", "backend/dist/server.js"]