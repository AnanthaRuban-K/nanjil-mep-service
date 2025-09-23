// apps/frontend/next.config.js - Fixed for Next.js 14.2.25

/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  
  // Image configuration
  images: {
    domains: ['images.clerk.dev'],
  },
  
  // External packages that should not be bundled
  serverExternalPackages: ['@clerk/nextjs'],
  
  // Transpile packages if needed
  transpilePackages: ['lucide-react'],
  
  // ESLint configuration
  eslint: {
    ignoreDuringBuilds: false,
  },
  
  // TypeScript configuration
  typescript: {
    ignoreBuildErrors: false,
  },
  
  // Remove the problematic env and swcMinify options
  // DO NOT include NODE_ENV in env config - Next.js handles this automatically
}

module.exports = nextConfig