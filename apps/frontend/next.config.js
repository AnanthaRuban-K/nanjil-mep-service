// apps/frontend/next.config.js - ADD THIS TO DISABLE DEVTOOLS
/** @type {import('next').NextConfig} */
const nextConfig = {
  experimental: {
    // Disable Next.js DevTools to avoid the bundler error
    nextDevTools: false,
  },
  // Suppress hydration warnings in development
  reactStrictMode: true,
  // Optimize images
  images: {
    domains: ['localhost'],
  },
  // Reduce bundle analysis noise
  webpack: (config, { dev, isServer }) => {
    if (dev && !isServer) {
      // Reduce webpack noise in development
      config.optimization.splitChunks = {
        chunks: 'all',
        cacheGroups: {
          default: false,
          vendors: false,
        },
      };
    }
    return config;
  },
};

module.exports = nextConfig;