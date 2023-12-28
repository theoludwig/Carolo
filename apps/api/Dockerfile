FROM node:20.10.0 AS builder
ENV PNPM_HOME="/pnpm"
ENV PATH="$PNPM_HOME:$PATH"
RUN corepack enable
WORKDIR /usr/src/app
RUN pnpm install --global turbo@1.11.2
COPY ./ ./
RUN turbo prune --scope=@carolo/api --docker

FROM node:20.10.0 AS installer
ENV PNPM_HOME="/pnpm"
ENV PATH="$PNPM_HOME:$PATH"
RUN corepack enable
WORKDIR /usr/src/app
COPY .gitignore .gitignore
COPY --from=builder /usr/src/app/out/json/ ./
COPY --from=builder /usr/src/app/out/pnpm-lock.yaml ./pnpm-lock.yaml
RUN pnpm install --frozen-lockfile
COPY --from=builder /usr/src/app/out/full/ ./
COPY turbo.json turbo.json
RUN pnpm exec turbo run build --filter=@carolo/api...

FROM node:20.10.0 AS runner
ENV PNPM_HOME="/pnpm"
ENV PATH="$PNPM_HOME:$PATH"
RUN corepack enable
ENV NODE_ENV=production
ENV NODE_OPTIONS=--enable-source-maps

WORKDIR /usr/src/app
COPY --from=installer --chown=node /usr/src/app ./
USER node
CMD cd apps/api && pnpm run prisma:migrate:deploy && node build/index.js
