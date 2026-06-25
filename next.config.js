/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  async rewrites() {
    return [
      {
        source: '/.well-known/farcaster.json',
        destination: '/api/well-known/farcaster',
      },
      {
        source: '/.well-known/agent-card.json',
        destination: '/api/well-known/agent-card',
      },
    ]
  },
}

module.exports = nextConfig
