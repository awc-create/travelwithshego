/** @type {import('next').NextConfig} */
const nextConfig = {
  output: 'standalone', // ✅ required so .next/standalone exists
  reactStrictMode: true,
  trailingSlash: true,

  images: {
    remotePatterns: [
      { protocol: 'https', hostname: 'utfs.io' }, // UploadThing CDN
      { protocol: 'https', hostname: 'uploadthing.com' },
      { protocol: 'https', hostname: 'cdn.uploadthing.com' },
      { protocol: 'https', hostname: 'travel-with-shego-media.hel1.your-objectstorage.com' },
      // add more if you need them later
    ],
    // You can enable this if you want to fully bypass optimization:
    // unoptimized: true,
  },

  eslint: { ignoreDuringBuilds: true },

  // Ensure bcrypt (if you ever add it) or other native-ish deps get traced
  outputFileTracingIncludes: {
    '/**/*': ['./node_modules/bcryptjs/**'],
  },
};

module.exports = nextConfig;
