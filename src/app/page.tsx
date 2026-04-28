'use client'

import Link from 'next/link'
import { getAllProfiles } from '@/lib/profiles'
import { ConnectWallet } from '@coinbase/onchainkit/wallet'

export default function Home() {
  const profiles = getAllProfiles()

  return (
    <main className="relative z-10 min-h-screen">
      {/* Nav */}
      <nav className="flex items-center justify-between px-6 py-5 border-b border-base-border">
        <div className="flex items-center gap-2">
          <div className="w-7 h-7 bg-base-blue rounded-lg flex items-center justify-center text-xs font-bold">⬡</div>
          <span className="font-mono text-sm font-semibold tracking-tight">tipping.base</span>
        </div>
        <ConnectWallet />
      </nav>

      {/* Hero */}
      <section className="max-w-2xl mx-auto px-6 pt-20 pb-16 text-center">
        <div className="inline-flex items-center gap-2 bg-base-card border border-base-border rounded-full px-4 py-1.5 text-xs font-mono text-base-blue mb-8">
          <span className="w-1.5 h-1.5 bg-base-blue rounded-full animate-pulse-slow" />
          Built on Base · Zero fees
        </div>

        <h1 className="text-5xl font-sans font-bold leading-tight mb-4">
          Support builders<br />
          <span className="text-base-blue">onchain.</span>
        </h1>

        <p className="text-base-muted text-lg mb-10 max-w-md mx-auto">
          Send USDC tips to your favorite Base developers.
          Instant. Free. Every tip is a transaction onchain.
        </p>

        <div className="flex items-center justify-center gap-3">
          <Link
            href="/erhnysr"
            className="bg-base-blue text-white px-6 py-3 rounded-xl font-semibold text-sm btn-glow hover:opacity-90 transition-opacity"
          >
            See an example →
          </Link>
          <Link
            href="/leaderboard"
            className="border border-base-border text-white px-6 py-3 rounded-xl font-semibold text-sm hover:border-white/30 transition-colors"
          >
            Leaderboard
          </Link>
        </div>
      </section>

      {/* Features */}
      <section className="max-w-3xl mx-auto px-6 pb-20">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {[
            { icon: '⚡', title: '2-second tips', desc: 'Base processes in 2 seconds. Faster than any payment app.' },
            { icon: '🔵', title: 'Zero commission', desc: 'No platform cut. 100% goes to the builder you support.' },
            { icon: '⛓️', title: 'Fully onchain', desc: 'Every tip is a real transaction. Verifiable forever on Base.' },
          ].map((f) => (
            <div key={f.title} className="card p-5">
              <div className="text-2xl mb-3">{f.icon}</div>
              <h3 className="font-semibold text-sm mb-1">{f.title}</h3>
              <p className="text-base-muted text-xs leading-relaxed">{f.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Top builders preview */}
      {profiles.length > 0 && (
        <section className="max-w-2xl mx-auto px-6 pb-24">
          <h2 className="font-mono text-xs text-base-muted uppercase tracking-widest mb-4">Top builders</h2>
          <div className="space-y-2">
            {profiles.slice(0, 5).map((p, i) => (
              <Link
                key={p.username}
                href={`/${p.username}`}
                className="card flex items-center gap-4 p-4 hover:border-white/10 transition-colors"
              >
                <span className="font-mono text-xs text-base-muted w-4">{i + 1}</span>
                <div className="w-8 h-8 bg-base-blue/20 rounded-full flex items-center justify-center text-xs font-bold text-base-blue">
                  {p.username[0].toUpperCase()}
                </div>
                <div className="flex-1">
                  <div className="text-sm font-semibold">{p.basename}</div>
                  <div className="text-xs text-base-muted">{p.bio.slice(0, 50)}...</div>
                </div>
                <div className="text-right">
                  <div className="text-sm font-mono font-semibold text-base-blue">${p.totalTips}</div>
                  <div className="text-xs text-base-muted">{p.tipCount} tips</div>
                </div>
              </Link>
            ))}
          </div>
        </section>
      )}

      {/* Footer */}
      <footer className="border-t border-base-border px-6 py-6 text-center">
        <p className="text-xs text-base-muted font-mono">
          tipping.base · built on{' '}
          <a href="https://base.org" className="text-base-blue hover:underline">Base</a>
          {' '}· open source
        </p>
      </footer>
    </main>
  )
}
