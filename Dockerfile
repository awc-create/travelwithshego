# ---- Base (placeholder) ----
FROM node:22-alpine AS base
WORKDIR /app

# ---- deps: install with devDependencies ----
FROM node:22-alpine AS deps
WORKDIR /app

RUN corepack enable && apk add --no-cache libc6-compat

COPY package.json ./
COPY yarn.lock* pnpm-lock.yaml* package-lock.json* ./

RUN \
  if [ -f yarn.lock ]; then \
    yarn install --immutable --production=false; \
  elif [ -f pnpm-lock.yaml ]; then \
    corepack pnpm install --frozen-lockfile --prod=false; \
  elif [ -f package-lock.json ]; then \
    npm ci --include=dev; \
  else \
    echo "No lockfile found; aborting for reproducibility." && exit 1; \
  fi

# ---- builder: prisma generate + next build (standalone) ----
FROM node:22-alpine AS builder
WORKDIR /app

# Disable telemetry + provide *dummy* Stripe keys so imports don’t crash at build time
ENV NEXT_TELEMETRY_DISABLED=1 \
    STRIPE_SECRET_KEY="sk_test_dummy" \
    STRIPE_WEBHOOK_SECRET="whsec_dummy"

COPY --from=deps /app/node_modules ./node_modules
COPY . .

# ✅ Fail fast if src/middleware.ts isn't in the build context
RUN ls -la src || true \
 && (test -f src/middleware.ts && echo "✅ Found src/middleware.ts" || (echo "❌ Missing src/middleware.ts"; exit 1))

# Prisma client
RUN \
  if [ -f yarn.lock ]; then \
    yarn prisma:generate; \
  elif [ -f pnpm-lock.yaml ]; then \
    corepack pnpm prisma:generate; \
  else \
    npm run prisma:generate; \
  fi

# Build Next.js (standalone, Turbopack)
RUN \
  if [ -f yarn.lock ]; then \
    yarn build --turbopack; \
  elif [ -f pnpm-lock.yaml ]; then \
    corepack pnpm build; \
  else \
    npm run build; \
  fi

# 🔎 Print middleware manifest to CI logs (debug)
RUN node -e "const fs=require('fs');const p='.next/server/middleware-manifest.json'; console.log('\\n=== middleware-manifest ==='); console.log(fs.existsSync(p)?fs.readFileSync(p,'utf8'):'(missing)'); console.log('===========================\\n')"

# ---- runner: minimal prod image ----
FROM node:22-alpine AS runner
WORKDIR /app

ENV NODE_ENV=production
ENV PORT=3000
ENV HOSTNAME=0.0.0.0

RUN apk add --no-cache libc6-compat \
 && addgroup -g 1001 -S nodejs \
 && adduser -S nextjs -u 1001

# Standalone server and assets
COPY --from=builder /app/.next/standalone ./
COPY --from=builder /app/.next/static ./.next/static
COPY --from=builder /app/public ./public

# Include prisma migrations & scripts so `prisma migrate deploy` can run in container
COPY --from=builder /app/prisma ./prisma
COPY --from=builder /app/scripts ./scripts

# Prisma CLI (match your Prisma major version)
RUN npm i -g prisma@7.0.0

USER 1001
EXPOSE 3000

CMD ["node", "server.js"]
