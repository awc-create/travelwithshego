// prisma.config.ts
import { config as loadEnv } from 'dotenv';
import { defineConfig } from 'prisma/config';

// 1) Load .env (used by CI, Vercel, Hetzner, etc.)
loadEnv();

// 2) Load .env.local to override (used only for local development)
loadEnv({ path: '.env.local', override: true });

export default defineConfig({
  schema: 'prisma/schema.prisma',
  migrations: {
    path: 'prisma/migrations',
  },
  datasource: {
    // Prisma always uses the DATABASE_URL that the environment provided
    url: process.env.DATABASE_URL ?? '',
  },
});
