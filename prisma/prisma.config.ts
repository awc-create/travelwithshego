// prisma/prisma.config.ts

// We define our own clean, minimal type to satisfy TypeScript:
interface PrismaRuntimeConfig {
  datasources: {
    db: {
      url: string;
      directUrl?: string;
    };
  };
}

const dbUrl =
  process.env.DATABASE_URL_HETZNER ||
  process.env.DATABASE_URL_VERCEL ||
  process.env.DATABASE_URL ||
  '';

const directUrl =
  process.env.DIRECT_DATABASE_URL_HETZNER ||
  process.env.DIRECT_DATABASE_URL_VERCEL ||
  process.env.DIRECT_DATABASE_URL ||
  '';

// Optional: warn if missing in real environments
if (!dbUrl && process.env.NODE_ENV !== 'test') {
  console.warn(
    '[prisma.config] Warning: No database URL found. Set DATABASE_URL or *_HETZNER / *_VERCEL.'
  );
}

const config: PrismaRuntimeConfig = {
  datasources: {
    db: {
      url: dbUrl,
      directUrl,
    },
  },
};

export default config;
