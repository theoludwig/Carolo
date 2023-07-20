FROM node:18.17.0 AS builder
WORKDIR /usr/src/app
RUN npm install --global turbo@1.10.9
COPY ./ ./
RUN turbo prune --scope=@carolo/website --docker

FROM node:18.17.0 AS installer
WORKDIR /usr/src/app
COPY .gitignore .gitignore
COPY --from=builder /usr/src/app/out/json/ ./
COPY --from=builder /usr/src/app/out/package-lock.json ./package-lock.json
RUN npm install

COPY --from=builder /usr/src/app/out/full/ ./
COPY .prettierrc.json .prettierrc.json
COPY turbo.json turbo.json
RUN npx turbo run build --filter=@carolo/website...

FROM node:18.17.0 AS runner
WORKDIR /usr/src/app

RUN addgroup --system --gid 1001 nodejs && adduser --system --uid 1001 nextjs
USER nextjs

ENV NODE_ENV=production
COPY --from=installer /usr/src/app/apps/website/next.config.js ./
COPY --from=installer /usr/src/app/apps/website/package.json ./
COPY --from=installer --chown=nextjs:nodejs /usr/src/app/apps/website/.next/standalone ./
COPY --from=installer --chown=nextjs:nodejs /usr/src/app/apps/website/.next/static ./apps/website/.next/static
COPY --from=installer --chown=nextjs:nodejs /usr/src/app/apps/website/public ./apps/website/public
CMD ["node", "apps/website/server.js"]
