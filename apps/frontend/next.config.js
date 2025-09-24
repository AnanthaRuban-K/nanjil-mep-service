/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  swcMinify: true,
  
  // Remove this line:
  // serverExternalPackages: [...]
  
  // Other configurations
  env: {
    CUSTOM_KEY: 'my-value',
  },

  webpack: (config, { buildId, dev, isServer, defaultLoaders, webpack }) => {
    return config
  },

  async redirects() {
    return []
  },

  async headers() {
    return []
  },

  images: {
    domains: [],
  },

  output: 'standalone',
  telemetry: false,
}

module.exports = nextConfig