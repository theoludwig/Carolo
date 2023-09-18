FROM node:20.6.1 AS builder
WORKDIR /usr/src/app
RUN npm install --global turbo@1.10.14
COPY ./ ./
RUN turbo prune --scope=@carolo/api --docker

FROM node:20.6.1 AS installer
WORKDIR /usr/src/app
COPY .gitignore .gitignore
COPY --from=builder /usr/src/app/out/json/ ./
COPY --from=builder /usr/src/app/out/package-lock.json ./package-lock.json
RUN npm clean-install

COPY --from=builder /usr/src/app/out/full/ ./
COPY turbo.json turbo.json
RUN npx turbo run build --filter=@carolo/api...

FROM node:20.6.1 AS runner
WORKDIR /usr/src/app
ENV NODE_ENV=production
ENV NODE_OPTIONS=--enable-source-maps
COPY --from=installer --chown=node /usr/src/app ./
USER node
CMD cd apps/api && npm run prisma:migrate:deploy && node build/index.js
