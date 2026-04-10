/** @type {import('next').NextConfig} */
const nextConfig = {
  transpilePackages: ['react-icons'],
  images: {
    remotePatterns: [{ protocol: 'https', hostname: 'images.unsplash.com' }],
  },
  // PWA security + caching headers
  async headers() {
    return [
      {
        source: '/manifest.json',
        headers: [
          { key: 'Cache-Control', value: 'public, max-age=86400' },
          { key: 'Content-Type', value: 'application/manifest+json' },
        ],
      },
      {
        source: '/(.*)',
        headers: [
          // Allow iOS/Android to run as standalone PWA
          { key: 'X-Content-Type-Options', value: 'nosniff' },
        ],
      },
    ]
  },
}
module.exports = nextConfig
