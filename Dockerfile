# syntax=docker/dockerfile:1

# ---------- Base ----------
# Pin the exact Node patch version (not just the major) for reproducible builds,
# and use Alpine for a small, low-attack-surface image.
FROM node:24.16-alpine AS base
# Enable pnpm through Corepack (bundled with Node) and set its store location.
ENV PNPM_HOME="/pnpm"
ENV PATH="$PNPM_HOME:$PATH"
RUN corepack enable
WORKDIR /app

# ---------- Dependencies ----------
# Install ALL deps (incl. dev) needed to compile the TypeScript sources.
# Copying only the manifest + lockfile first maximizes layer caching:
# deps are re-installed only when these files change, not on every code edit.
# --ignore-scripts skips dependency postinstall/build scripts (e.g. the native
# unrs-resolver used only by ESLint). They aren't needed to compile the app, and
# pnpm v10+ otherwise fails the install on any build script it blocks by policy.
FROM base AS deps
COPY package.json pnpm-lock.yaml ./
RUN --mount=type=cache,id=pnpm,target=/pnpm/store \
    pnpm install --frozen-lockfile --ignore-scripts

# ---------- Build ----------
# Compile the app (nest build -> dist/).
FROM base AS build
COPY --from=deps /app/node_modules ./node_modules
COPY . .
RUN pnpm run build

# ---------- Production dependencies ----------
# A clean install of only production deps for a lean runtime node_modules.
FROM base AS prod-deps
COPY package.json pnpm-lock.yaml ./
RUN --mount=type=cache,id=pnpm,target=/pnpm/store \
    pnpm install --prod --frozen-lockfile --ignore-scripts

# ---------- Runtime ----------
FROM node:24.16-alpine AS runner
ENV NODE_ENV=production
# Port is configurable per environment (build arg) and exposed as an env var
# so the app and the HEALTHCHECK agree on the same value.
ARG PORT=3001
ENV PORT=$PORT
# tini gives us a proper PID 1 for signal handling / zombie reaping.
RUN apk add --no-cache tini
WORKDIR /app

# Copy only what the app needs to run, owned by the unprivileged "node" user.
COPY --chown=node:node --from=prod-deps /app/node_modules ./node_modules
COPY --chown=node:node --from=build     /app/dist         ./dist
# Served by ServeStaticModule at runtime (join(__dirname, '..', 'public')).
COPY --chown=node:node --from=build     /app/public       ./public
COPY --chown=node:node package.json ./

# Run as the built-in unprivileged "node" user instead of root.
USER node

# Documents the port the app listens on.
EXPOSE $PORT

# Verify the HTTP server responds (static root, no DB dependency).
# Uses BusyBox wget, already present in the Alpine base image.
HEALTHCHECK --interval=30s --timeout=5s --start-period=20s --retries=3 \
    CMD wget --no-verbose --tries=1 --spider "http://localhost:${PORT}/" || exit 1

ENTRYPOINT ["/sbin/tini", "--"]
CMD ["node", "dist/main"]
