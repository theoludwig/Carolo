FROM node:20.10.0 AS builder
ENV PNPM_HOME="/pnpm"
ENV PATH="$PNPM_HOME:$PATH"
RUN corepack enable
WORKDIR /usr/src/app
RUN pnpm install --global turbo@1.11.2
COPY ./ ./
RUN turbo prune --scope=@carolo/website --docker

FROM node:20.10.0 AS installer
ENV PNPM_HOME="/pnpm"
ENV PATH="$PNPM_HOME:$PATH"
RUN corepack enable
ENV IS_STANDALONE=true

WORKDIR /usr/src/app
COPY .gitignore .gitignore
COPY --from=builder /usr/src/app/out/json/ ./
COPY --from=builder /usr/src/app/out/pnpm-lock.yaml ./pnpm-lock.yaml
RUN pnpm install --frozen-lockfile
COPY --from=builder /usr/src/app/out/full/ ./
COPY turbo.json turbo.json
RUN pnpm exec turbo run build --filter=@carolo/website...

FROM node:20.10.0-slim AS runner
ENV PNPM_HOME="/pnpm"
ENV PATH="$PNPM_HOME:$PATH"
RUN corepack enable
ENV NODE_ENV=production
ENV HOSTNAME=0.0.0.0
ENV NEXT_TELEMETRY_DISABLED=1

WORKDIR /usr/src/app
RUN addgroup --system --gid 1001 nodejs && adduser --system --uid 1001 applicationrunner
USER applicationrunner
COPY --from=installer /usr/src/app/apps/website/next.config.js ./
COPY --from=installer /usr/src/app/apps/website/package.json ./
COPY --from=installer --chown=applicationrunner:nodejs /usr/src/app/apps/website/.next/standalone ./
COPY --from=installer --chown=applicationrunner:nodejs /usr/src/app/apps/website/.next/static ./apps/website/.next/static
COPY --from=installer --chown=applicationrunner:nodejs /usr/src/app/apps/website/public ./apps/website/public
CMD ["node", "apps/website/server.js"]
