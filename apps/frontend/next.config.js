/** @type {import('next').NextConfig} */
const nextConfig = {
  // FORCE ALL PAGES TO BE DYNAMIC - NO STATIC GENERATION
  experimental: {},
  
  // Completely disable static optimization
  output: 'standalone',
  
  // Force dynamic for everything
  generateStaticParams: false,
  
  // Disable prerendering entirely
  trailingSlash: false,
  
  // Skip build-time optimizations that cause context issues
  swcMinify: true,
  
  // Custom webpack config
  webpack: (config, { isServer, dev }) => {
    // Disable static optimization
    if (!isServer && !dev) {
      config.optimization.splitChunks = false;
    }
    
    return config;
  },
  
  // Force everything to render at runtime
  experimental: {
    appDir: true,
    serverComponentsExternalPackages: ['@clerk/nextjs']
  },
  
  // Disable all forms of static generation
  generateBuildId: () => 'build-' + Math.random().toString(36).substring(7),
}

module.exports = nextConfig