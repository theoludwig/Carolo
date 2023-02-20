FROM node:18.14.1 AS builder
WORKDIR /usr/src/app
RUN npm install --global turbo@1.7.4
COPY ./ ./
RUN turbo prune --scope=@carolo/api --docker

FROM node:18.14.1 AS installer
WORKDIR /usr/src/app
COPY .gitignore .gitignore
COPY --from=builder /usr/src/app/out/json/ ./
COPY --from=builder /usr/src/app/out/package-lock.json ./package-lock.json
RUN npm install

COPY --from=builder /usr/src/app/out/full/ ./
COPY turbo.json turbo.json
RUN npx turbo run build --filter=@carolo/api...

FROM node:18.14.1 AS runner
WORKDIR /usr/src/app
ENV NODE_ENV=production
COPY --from=installer /usr/src/app ./
USER node
CMD ["node", "apps/api/build/index.js"]
