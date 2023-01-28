/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  experimental: {
    appDir: true
  },
  transpilePackages: ['@carolo/game']
}

module.exports = nextConfig
