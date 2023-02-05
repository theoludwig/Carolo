/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  experimental: {
    appDir: true
  },
  transpilePackages: ['@carolo/game'],
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
