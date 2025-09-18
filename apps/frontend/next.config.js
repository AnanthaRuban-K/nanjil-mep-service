/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  swcMinify: true,
  
  // Enable experimental features if needed
  experimental: {
    // Add any experimental features here
  },

  // Environment variables
  env: {
    CUSTOM_KEY: 'my-value',
  },

  // Webpack configuration
  webpack: (config, { buildId, dev, isServer, defaultLoaders, webpack }) => {
    // Add custom webpack config here if needed
    return config
  },

  // Redirects
  async redirects() {
    return []
  },

  // Headers
  async headers() {
    return []
  },

  // Image optimization
  images: {
    domains: [],
  },

  // Output configuration
  output: 'standalone',
  
  // Disable telemetry
  telemetry: false,
}

export default nextConfig