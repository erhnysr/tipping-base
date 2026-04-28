'use client'

import Link from 'next/link'
import { getAllProfiles } from '@/lib/profiles'
import { ConnectWallet } from '@coinbase/onchainkit/wallet'

export default function LeaderboardPage() {
  const profiles = getAllProfiles()

  return (
    <main className="relative z-10 min-h-screen">
      <nav className="flex items-center justify-between px-6 py-5 border-b border-base-border">
        <Link href="/" className="flex items-center gap-2">
          <div className="w-7 h-7 bg-base-blue rounded-lg flex items-center justify-center text-xs font-bold">⬡</div>
          <span className="font-mono text-sm font-semibold tracking-tight">tipping.base</span>
        </Link>
        <ConnectWallet />
      </nav>

      <div className="max-w-2xl mx-auto px-6 py-12">
        <div className="mb-8">
          <h1 className="text-3xl font-bold mb-2">Leaderboard</h1>
          <p className="text-base-muted text-sm">Top builders by tips received on Base.</p>
        </div>

        <div className="space-y-2">
          {profiles.map((p, i) => (
            <Link
              key={p.username}
              href={`/${p.username}`}
              className="card flex items-center gap-4 p-4 hover:border-white/10 transition-all duration-200 group"
            >
              {/* Rank */}
              <div className={`
                w-8 h-8 rounded-lg flex items-center justify-center font-mono text-xs font-bold flex-shrink-0
                ${i === 0 ? 'bg-yellow-500/20 text-yellow-400' :
                  i === 1 ? 'bg-white/10 text-white/60' :
                  i === 2 ? 'bg-orange-500/20 text-orange-400' :
                  'bg-base-dark text-base-muted'}
              `}>
                {i + 1}
              </div>

              {/* Avatar */}
              <div className="w-10 h-10 bg-base-blue/20 rounded-xl flex items-center justify-center text-sm font-bold text-base-blue flex-shrink-0">
                {p.username[0].toUpperCase()}
              </div>

              {/* Info */}
              <div className="flex-1 min-w-0">
                <div className="font-semibold text-sm group-hover:text-base-blue transition-colors">
                  {p.basename}
                </div>
                <div className="text-xs text-base-muted truncate">{p.bio.slice(0, 60)}...</div>
              </div>

              {/* Stats */}
              <div className="text-right flex-shrink-0">
                <div className="text-base-blue font-mono font-bold text-sm">${p.totalTips}</div>
                <div className="text-xs text-base-muted">{p.tipCount} tips</div>
              </div>
            </Link>
          ))}
        </div>

        {profiles.length === 0 && (
          <div className="card p-12 text-center">
            <p className="text-base-muted text-sm">No tips yet. Be the first to support a builder.</p>
          </div>
        )}
      </div>
    </main>
  )
}
