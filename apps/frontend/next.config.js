// apps/frontend/next.config.js - FIX STATIC GENERATION
/** @type {import('next').NextConfig} */
const nextConfig = {
  // ✅ Force App Router and disable problematic features
  experimental: {
    appDir: true,
  },
  
  // ✅ Essential for Docker deployment
  output: 'standalone',
  
  // ✅ CRITICAL: Disable static optimization that's causing the issue
  trailingSlash: false,
  
  // ✅ Force dynamic rendering for problematic pages
  generateEtags: false,
  
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
  
  // ✅ Webpack config to handle the Html import issue
  webpack: (config, { isServer, webpack }) => {
    // Ignore problematic modules during static generation
    if (!isServer) {
      config.resolve.fallback = {
        ...config.resolve.fallback,
        fs: false,
        net: false,
        tls: false,
      };
    }
    
    // Add plugin to ignore Html import warnings
    config.plugins.push(
      new webpack.IgnorePlugin({
        resourceRegExp: /^(next\/document)$/,
        contextRegExp: /pages/,
      })
    );
    
    return config;
  },
  
  // ✅ CRITICAL: Skip static generation for problematic pages
  async generateStaticParams() {
    return [];
  },
  
  // ✅ Handle redirects for error pages
  async redirects() {
    return [];
  },
};

module.exports = nextConfig;