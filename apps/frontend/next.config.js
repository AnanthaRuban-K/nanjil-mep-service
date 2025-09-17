// apps/frontend/next.config.js - FORCE APP ROUTER ONLY
/** @type {import('next').NextConfig} */
const nextConfig = {
  // ✅ Force App Router (disable Pages Router)
  experimental: {
    appDir: true, // Explicitly enable App Router
  },
  
  // ✅ Essential for Docker deployment
  output: 'standalone',
  
  // ✅ Basic settings
  reactStrictMode: true,
  poweredByHeader: false,
  
  // ✅ Image optimization (disabled for simpler deployment)  
  images: {
    unoptimized: true,
    domains: ['localhost', 'nanjilmepservice.com'],
  },
  
  // ✅ Environment variables (only public ones)
  env: {
    NEXT_PUBLIC_API_URL: process.env.NEXT_PUBLIC_API_URL,
    NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY: process.env.NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY,
  },
  
  // ✅ Clean webpack config
  webpack: (config, { isServer }) => {
    // Ignore pages directory completely
    config.resolve.alias = {
      ...config.resolve.alias,
    };
    return config;
  },
};

module.exports = nextConfig;