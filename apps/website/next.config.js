/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: false,
  experimental: {
    appDir: true
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
