# ── PixelVault — production image ────────────────────────────────
# Build:  docker build -t pixelvault .
# Run:    docker run -p 3000:3000 -v pixelvault-data:/app/data \
#           -e AUTH_SECRET=$(openssl rand -base64 32) pixelvault

FROM node:22-alpine AS deps
WORKDIR /app
COPY package.json package-lock.json ./
COPY prisma ./prisma
RUN npm ci

FROM node:22-alpine AS builder
WORKDIR /app
COPY --from=deps /app/node_modules ./node_modules
COPY . .
ENV DATABASE_URL="file:/app/data/prod.db"
RUN npx prisma generate && npm run build

FROM node:22-alpine AS runner
WORKDIR /app
ENV NODE_ENV=production
ENV DATABASE_URL="file:/app/data/prod.db"
ENV PORT=3000
ENV HOSTNAME=0.0.0.0

RUN addgroup -S app && adduser -S app -G app && mkdir -p /app/data && chown app:app /app/data

# Standalone server + static assets
COPY --from=builder --chown=app:app /app/.next/standalone ./
COPY --from=builder --chown=app:app /app/.next/static ./.next/static
COPY --from=builder --chown=app:app /app/public ./public
# Real product code packages served by the download endpoint
COPY --from=builder --chown=app:app /app/product-templates ./product-templates
# Prisma schema + seed for first-boot setup
COPY --from=builder --chown=app:app /app/prisma ./prisma
COPY --from=builder --chown=app:app /app/node_modules/prisma ./node_modules/prisma
COPY --from=builder --chown=app:app /app/node_modules/@prisma ./node_modules/@prisma
COPY --from=builder --chown=app:app /app/node_modules/.bin ./node_modules/.bin
COPY --from=builder --chown=app:app /app/node_modules/tsx ./node_modules/tsx
COPY --from=builder --chown=app:app /app/node_modules/bcryptjs ./node_modules/bcryptjs
COPY --from=builder --chown=app:app /app/docker-entrypoint.sh ./docker-entrypoint.sh
RUN chmod +x ./docker-entrypoint.sh

USER app
EXPOSE 3000
VOLUME ["/app/data"]

ENTRYPOINT ["./docker-entrypoint.sh"]
