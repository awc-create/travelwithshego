/** @type {import('next').NextConfig} */
const nextConfig = {
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
  experimental: {
    serverActions: {
      bodySizeLimit: '256mb',
    },
  },
};

module.exports = nextConfig;
