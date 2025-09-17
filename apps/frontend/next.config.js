/** @type {import('next').NextConfig} */
const nextConfig = {
  // Use standalone instead of export to support server actions
  output: 'standalone',
  
  // Remove experimental options that cause warnings
  experimental: {},
  
  // Essential settings
  images: {
    unoptimized: true
  },
  
  // Remove rewrites since they don't work with static export anyway
  // API calls will use full URLs instead
}

module.exports = nextConfig
