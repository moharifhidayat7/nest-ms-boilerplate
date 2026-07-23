FROM node:22-alpine AS builder
RUN corepack enable && corepack prepare pnpm@latest --activate
WORKDIR /app

COPY pnpm-lock.yaml package.json ./
RUN pnpm fetch --frozen-lockfile

COPY . .
RUN pnpm install --frozen-lockfile --offline
RUN pnpm prisma generate --schema=prisma/schema.prisma
RUN pnpm build
RUN pnpm prune --prod && rm -rf \
  /app/node_modules/.pnpm/prisma@*/ \
  /app/node_modules/.pnpm/typescript@*/ \
  /app/node_modules/.pnpm/@prisma+studio-core@*/ \
  /app/node_modules/.pnpm/effect@*/ \
  /app/node_modules/.pnpm/@electric-sql+*/

FROM gcr.io/distroless/nodejs22-debian12 AS runner
WORKDIR /app

ENV NODE_ENV=production

COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app/dist ./dist
COPY --from=builder /app/generated ./dist/generated

EXPOSE 3000

CMD ["dist/src/main.js"]
