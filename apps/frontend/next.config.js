/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  swcMinify: true,

  env: {
    CUSTOM_KEY: 'my-value',
  },

  webpack: (config) => {
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
}

module.exports = nextConfig
