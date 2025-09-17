/** @type {import('next').NextConfig} */
const nextConfig = {
  // Remove deprecated experimental options
  experimental: {
    // Remove appDir and generateStaticParams
  },
  
  // Add output configuration for static hosting
  output: 'standalone',
  
  // Enable SWC minification
  swcMinify: true,
  
  // Disable static generation for problematic routes
  generateBuildId: async () => {
    return 'build-' + Date.now()
  },

  // Add webpack configuration to handle client-side only modules
  webpack: (config, { isServer }) => {
    if (!isServer) {
      config.resolve.fallback = {
        ...config.resolve.fallback,
        fs: false,
      }
    }
    return config
  },

  // Disable static optimization for all pages to avoid SSR issues
  experimental: {
    appDir: true,
  },

  // Add trailing slash for better hosting compatibility
  trailingSlash: true,

  // Environment variables
  env: {
    CUSTOM_KEY: process.env.CUSTOM_KEY,
  },
}

module.exports = nextConfig