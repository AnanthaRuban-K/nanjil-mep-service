const nextConfig = {
  experimental: {
    
  },
  env: {
    NEXT_PUBLIC_API_URL: process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3101',
    NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY: process.env.NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY,
  },
  images: {
    domains: ['images.clerk.dev'],
  },
  async rewrites() {
    return [
      {
        source: '/api/:path*',
        destination: process.env.NODE_ENV === 'production' 
          ? `${process.env.NEXT_PUBLIC_API_URL || 'https://api.nanjilmepservice.com'}/api/:path*`
          : 'http://localhost:3101/api/:path*',
      }
    ]
  },
  // Optimize for production deployment
  output: 'standalone',
  
  // Handle images properly
  images: {
    unoptimized: true,
    domains: [],
  },
  
  // Ensure proper trailing slash handling
  trailingSlash: false,
  
  // Optimize bundle
  swcMinify: true,
  
  // Handle static exports properly
  distDir: '.next',
}

module.exports = nextConfig