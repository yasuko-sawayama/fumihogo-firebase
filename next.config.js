/** @type {import('next').NextConfig} */
module.exports = {
  reactStrictMode: true,
  images: {
    domains: [
      'pbs.twimg.com',
      'tailwindui.com',
      'images.unsplash.com',
      'via.placeholder.com',
    ],
  },
  webpack5: true,
  webpack: (config, { isServer }) => {
    if (!isServer) {
      config.resolve.fallback = {
        fs: false,
      }
    }
    return config
  },
}
