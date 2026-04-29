import os

# globals.css
open('src/app/globals.css', 'w').write("""@tailwind base;
@tailwind components;
@tailwind utilities;

:root {
  --base-blue: #0052FF;
  --base-dark: #0A0A0A;
  --base-gray: #1A1A2E;
}

* {
  box-sizing: border-box;
}

body {
  background: var(--base-dark);
  color: white;
  font-family: 'Inter', sans-serif;
}

@keyframes pulse-blue {
  0%, 100% { box-shadow: 0 0 0 0 rgba(0, 82, 255, 0.4); }
  50% { box-shadow: 0 0 0 10px rgba(0, 82, 255, 0); }
}

.pulse-btn {
  animation: pulse-blue 2s infinite;
}

@keyframes float {
  0%, 100% { transform: translateY(0); }
  50% { transform: translateY(-8px); }
}

.float { animation: float 3s ease-in-out infinite; }
""")
print('OK: globals.css')

# page.tsx
open('src/app/page.tsx', 'w').write("""'use client'

import { useState } from 'react'
import Link from 'next/link'
import { ConnectWallet } from '@coinbase/onchainkit/wallet'
import { Zap, Users, TrendingUp, ArrowRight } from 'lucide-react'

const FEATURED_BUILDERS = [
  {
    name: 'vitalik.eth',
    role: 'Ethereum Creator',
    address: '0xd8dA6BF26964aF9D7eEd9e03E53415D37aA96045',
    tips: 142,
    avatar: '🧙‍♂️',
    tag: 'Protocol'
  },
  {
    name: 'jesse.base.eth',
    role: 'Base Co-founder',
    address: '0x849151d7D0bF1F34b70d5caD5149D28CC2308bf1',
    tips: 89,
    avatar: '🔵',
    tag: 'Base'
  },
  {
    name: 'erhnysr.base.eth',
    role: 'Base Contributor',
    address: '0x0000000000000000000000000000000000000001',
    tips: 12,
    avatar: '⚡',
    tag: 'Builder'
  },
]

export default function HomePage() {
  const [hoveredBuilder, setHoveredBuilder] = useState<number | null>(null)

  return (
    <div className="min-h-screen bg-[#0A0A0A]">
      <nav className="border-b border-white/5 px-6 py-4">
        <div className="max-w-6xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 bg-[#0052FF] rounded-lg flex items-center justify-center">
              <Zap className="w-4 h-4 text-white" />
            </div>
            <span className="font-bold text-white text-lg">tipping.base</span>
          </div>
          <div className="flex items-center gap-4">
            <Link href="/leaderboard" className="text-white/60 hover:text-white text-sm transition">
              Leaderboard
            </Link>
            <ConnectWallet />
          </div>
        </div>
      </nav>

      <section className="px-6 py-24 text-center">
        <div className="max-w-4xl mx-auto">
          <div className="inline-flex items-center gap-2 bg-[#0052FF]/10 border border-[#0052FF]/20 rounded-full px-4 py-2 mb-8">
            <div className="w-2 h-2 bg-[#0052FF] rounded-full animate-pulse" />
            <span className="text-[#0052FF] text-sm font-medium">Built on Base · Zero fees</span>
          </div>

          <h1 className="text-6xl md:text-7xl font-black text-white mb-6 leading-tight">
            Support builders
            <br />
            <span className="text-[#0052FF]">onchain.</span>
          </h1>

          <p className="text-xl text-white/50 mb-12 max-w-2xl mx-auto">
            Send instant USDC tips to your favorite Base builders.
            No middleman. No fees. Just pure support, onchain.
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              href="/create"
              className="inline-flex items-center gap-2 bg-[#0052FF] text-white px-8 py-4 rounded-xl font-semibold hover:bg-blue-600 transition pulse-btn"
            >
              Create your page <ArrowRight className="w-4 h-4" />
            </Link>
            <Link
              href="/explore"
              className="inline-flex items-center gap-2 bg-white/5 text-white px-8 py-4 rounded-xl font-semibold hover:bg-white/10 transition border border-white/10"
            >
              Explore builders
            </Link>
          </div>
        </div>
      </section>

      <section className="px-6 py-12 border-y border-white/5">
        <div className="max-w-4xl mx-auto grid grid-cols-3 gap-8 text-center">
          {[
            { value: '243', label: 'Builders supported' },
            { value: '$12.4K', label: 'USDC tipped' },
            { value: '1,891', label: 'Tips sent' },
          ].map((stat) => (
            <div key={stat.label}>
              <div className="text-3xl font-black text-white mb-1">{stat.value}</div>
              <div className="text-white/40 text-sm">{stat.label}</div>
            </div>
          ))}
        </div>
      </section>

      <section className="px-6 py-24">
        <div className="max-w-4xl mx-auto">
          <div className="flex items-center justify-between mb-12">
            <h2 className="text-3xl font-black text-white">Featured builders</h2>
            <Link href="/explore" className="text-[#0052FF] text-sm hover:underline flex items-center gap-1">
              View all <ArrowRight className="w-3 h-3" />
            </Link>
          </div>

          <div className="grid md:grid-cols-3 gap-6">
            {FEATURED_BUILDERS.map((builder, i) => (
              <Link
                key={i}
                href={'/tip/' + builder.address}
                onMouseEnter={() => setHoveredBuilder(i)}
                onMouseLeave={() => setHoveredBuilder(null)}
                className="bg-white/3 border border-white/8 rounded-2xl p-6 hover:border-[#0052FF]/40 hover:bg-white/5 transition group"
              >
                <div className="flex items-start justify-between mb-4">
                  <div className="w-12 h-12 bg-[#0052FF]/10 rounded-xl flex items-center justify-center text-2xl">
                    {builder.avatar}
                  </div>
                  <span className="text-xs text-[#0052FF] bg-[#0052FF]/10 px-2 py-1 rounded-full">
                    {builder.tag}
                  </span>
                </div>
                <h3 className="text-white font-bold mb-1">{builder.name}</h3>
                <p className="text-white/40 text-sm mb-4">{builder.role}</p>
                <div className="flex items-center gap-1 text-white/30 text-xs">
                  <Zap className="w-3 h-3" />
                  {builder.tips} tips received
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      <footer className="border-t border-white/5 px-6 py-8">
        <div className="max-w-6xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-6 h-6 bg-[#0052FF] rounded-md flex items-center justify-center">
              <Zap className="w-3 h-3 text-white" />
            </div>
            <span className="text-white/40 text-sm">tipping.base</span>
          </div>
          <p className="text-white/20 text-xs">Built on Base</p>
        </div>
      </footer>
    </div>
  )
}
""")
print('OK: page.tsx')
