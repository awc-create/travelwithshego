import type { NextConfig } from 'next';

const nextConfig: NextConfig = {
  output: 'standalone',
  reactStrictMode: true,

  images: {
    remotePatterns: [
      { protocol: 'https', hostname: 'utfs.io' },
      { protocol: 'https', hostname: 'uploadthing.com' },
      { protocol: 'https', hostname: 'cdn.uploadthing.com' },
      { protocol: 'https', hostname: 'travel-with-shego-media.hel1.your-objectstorage.com' },
    ],
  },

  eslint: { ignoreDuringBuilds: true },

  outputFileTracingIncludes: {
    '/**/*': ['./node_modules/bcryptjs/**'],
  },

  experimental: {
    serverActions: {
      bodySizeLimit: '256mb',
    },
  },

  // ✅ Fixes "Request body exceeded 10MB" for App Router API routes
  middlewareClientMaxBodySize: 268435456, // 256MB in bytes
};

export default nextConfig;
