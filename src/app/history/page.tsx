'use client'

import { useEffect, useState } from 'react'
import { shortAddress, timeAgo } from '@/lib/resolve'
import Link from 'next/link'
import type { Tip } from '@/lib/supabase'

export default function HistoryPage() {
  const [tips, setTips] = useState<Tip[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(false)

  useEffect(() => {
    fetch('/api/tips?limit=30')
      .then(r => r.json())
      .then(d => setTips(d.tips ?? []))
      .catch(() => setError(true))
      .finally(() => setLoading(false))
  }, [])

  return (
    <main className="max-w-app mx-auto px-4">
      <div className="py-4">
        <h1 className="text-xl font-bold">Tip History</h1>
        <p className="text-base-muted text-xs mt-1">Latest onchain tips on Base.</p>
      </div>

      {loading && (
        <div className="space-y-2 mt-2">
          {[1,2,3,4,5].map(i => (
            <div key={i} className="card flex items-center gap-3 p-4">
              <div className="w-8 h-8 rounded-xl bg-base-border animate-pulse flex-shrink-0" />
              <div className="flex-1 space-y-1.5">
                <div className="h-3 w-40 bg-base-border rounded animate-pulse" />
                <div className="h-2.5 w-20 bg-base-border/60 rounded animate-pulse" />
              </div>
              <div className="h-4 w-12 bg-base-border rounded animate-pulse" />
            </div>
          ))}
        </div>
      )}

      {!loading && error && (
        <div className="card p-8 text-center mt-4">
          <p className="text-base-muted text-sm">Could not load tips. Try again later.</p>
        </div>
      )}

      {!loading && !error && tips.length === 0 && (
        <div className="card p-10 text-center mt-4">
          <p className="text-base-muted text-sm mb-4">No tips yet. Send the first one!</p>
          <Link href="/" className="inline-block bg-base-blue text-white px-5 py-2.5 rounded-xl text-sm font-semibold btn-glow">
            Send a tip →
          </Link>
        </div>
      )}

      {!loading && !error && tips.length > 0 && (
        <div className="space-y-2">
          {tips.map(tip => (
            <div key={tip.id} className="card flex items-center gap-3 p-3.5">
              <div className="w-9 h-9 rounded-xl bg-base-blue/10 border border-base-blue/20 flex items-center justify-center flex-shrink-0">
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#0052ff" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                  <line x1="5" y1="12" x2="19" y2="12"/><polyline points="12 5 19 12 12 19"/>
                </svg>
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-1.5 text-xs font-mono">
                  <Link href={`/${tip.tipper_address}`} className="text-white/60 hover:text-white transition-colors">
                    {shortAddress(tip.tipper_address)}
                  </Link>
                  <span className="text-base-muted">→</span>
                  <Link href={`/${tip.recipient_address}`} className="text-white/60 hover:text-white transition-colors">
                    {shortAddress(tip.recipient_address)}
                  </Link>
                </div>
                <div className="flex items-center gap-2 mt-0.5">
                  <span className="text-[10px] text-base-muted">{timeAgo(tip.created_at)}</span>
                  <a
                    href={`https://basescan.org/tx/${tip.tx_hash}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-[10px] text-base-blue hover:underline"
                  >
                    ↗ Basescan
                  </a>
                </div>
              </div>
              <div className="text-sm font-mono font-bold text-base-blue flex-shrink-0">
                ${Number(tip.amount).toFixed(2)}
              </div>
            </div>
          ))}
        </div>
      )}
    </main>
  )
}
