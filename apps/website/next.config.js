const path = require('node:path')

/** @type {import('next').NextConfig} */
const nextConfig = {
  output: 'standalone',
  reactStrictMode: false,
  experimental: {
    appDir: true,
    outputFileTracingRoot: path.join(__dirname, '../../')
  },
  transpilePackages: ['@carolo/game', '@carolo/models'],
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'www.gravatar.com',
        port: '',
        pathname: '/avatar/**'
      }
    ]
  },
  async rewrites() {
    return [
      {
        source: '/rules',
        destination: '/rules/index.html'
      }
    ]
  }
}

module.exports = nextConfig
