# syntax=docker/dockerfile:1

# ============================
# deps: install with devDeps
# ============================
FROM node:22-alpine AS deps
WORKDIR /app

RUN apk add --no-cache libc6-compat && corepack enable

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

# ============================
# builder: prisma generate + next build (standalone + turbopack)
# ============================
FROM node:22-alpine AS builder
WORKDIR /app

ENV NEXT_TELEMETRY_DISABLED=1 \
    STRIPE_SECRET_KEY="sk_test_dummy" \
    STRIPE_WEBHOOK_SECRET="whsec_dummy" \
    DATABASE_URL="postgresql://dummy:dummy@localhost:5432/dummy" \
    DIRECT_DATABASE_URL="postgresql://dummy:dummy@localhost:5432/dummy"

COPY --from=deps /app/node_modules ./node_modules
COPY . .

RUN ls -la src || true

RUN \
  if [ -f prisma/schema.prisma ]; then \
    if [ -f yarn.lock ]; then \
      yarn prisma:generate; \
    elif [ -f pnpm-lock.yaml ]; then \
      corepack pnpm prisma:generate; \
    else \
      npm run prisma:generate; \
    fi; \
  else \
    echo "No prisma/schema.prisma found — skipping prisma generate"; \
  fi

RUN \
  if [ -f yarn.lock ]; then \
    yarn build; \
  elif [ -f pnpm-lock.yaml ]; then \
    corepack pnpm build; \
  else \
    npm run build; \
  fi

RUN node -e "const fs=require('fs'); if(!fs.existsSync('.next/standalone/server.js')){console.error('\\n❌ Missing .next/standalone/server.js. Ensure output:\"standalone\" in next.config.*'); process.exit(1)}"

RUN node -e "const fs=require('fs');const p='.next/server/middleware-manifest.json'; console.log('\\n=== middleware-manifest ==='); console.log(fs.existsSync(p)?fs.readFileSync(p,'utf8'):'(missing)'); console.log('===========================\\n')"

# ============================
# runner: minimal prod image
# ============================
FROM node:22-alpine AS runner
WORKDIR /app

ENV NODE_ENV=production \
    PORT=3000 \
    HOSTNAME=0.0.0.0

RUN apk add --no-cache libc6-compat \
 && addgroup -g 1001 -S nodejs \
 && adduser -S nextjs -u 1001

COPY --from=builder /app/package.json ./package.json
COPY --from=deps    /app/node_modules ./node_modules

COPY --from=builder /app/.next/standalone ./
COPY --from=builder /app/.next/static ./.next/static
COPY --from=builder /app/public ./public

COPY --from=builder /app/prisma ./prisma

RUN npm i -g prisma@6.13.0

# ✅ Fix: create cache dir and give nextjs user (1001) write access
# Must run as root before USER 1001 switch
RUN mkdir -p .next/cache \
 && chown -R 1001:1001 .next

USER 1001
EXPOSE 3000

CMD ["node", "server.js"]