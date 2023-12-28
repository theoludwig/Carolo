const IS_STANDALONE = process.env.IS_STANDALONE === "true"

/** @type {import('next').NextConfig} */
const nextConfig = {
  output: IS_STANDALONE ? "standalone" : undefined,
  reactStrictMode: false,
  eslint: {
    ignoreDuringBuilds: true,
  },
  webpack: (config) => {
    config.externals.push({
      "utf-8-validate": "commonjs utf-8-validate",
      bufferutil: "commonjs bufferutil",
    })
    return config
  },
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "www.gravatar.com",
        port: "",
        pathname: "/avatar/**",
      },
    ],
  },
}

module.exports = nextConfig
