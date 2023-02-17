const path = require('node:path')

/** @type {import('next').NextConfig} */
const nextConfig = {
  output: 'standalone',
  reactStrictMode: true,
  experimental: {
    appDir: true,
    outputFileTracingRoot: path.join(__dirname, '../../')
  },
  transpilePackages: ['@carolo/game', '@carolo/models'],
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
