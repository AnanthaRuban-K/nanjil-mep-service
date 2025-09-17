/** @type {import('next').NextConfig} */
const nextConfig = {
  // Disable static optimization to avoid Html import issues
  output: 'export',
  trailingSlash: true,
  images: {
    unoptimized: true
  },
  
  // Disable static generation that's causing the issue
  experimental: {
    missingSuspenseWithCSRBailout: false,
  },
  
  // API rewrites
  async rewrites() {
    return [
      {
        source: '/api/:path*',
        destination: process.env.NODE_ENV === 'production' 
          ? `${process.env.NEXT_PUBLIC_API_URL || ''}/api/:path*`
          : 'http://localhost:3101/api/:path*',
      }
    ]
  }
}

module.exports = nextConfig
