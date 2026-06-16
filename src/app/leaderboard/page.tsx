import { supabase } from '@/lib/supabase'
import { shortAddress } from '@/lib/resolve'
import Link from 'next/link'

export const revalidate = 60

async function getLeaderboard() {
  try {
    const [{ data: tippers }, { data: recipients }] = await Promise.all([
      supabase.from('leaderboard_tippers').select('tipper_address, total_tipped, tip_count').limit(10),
      supabase.from('leaderboard_recipients').select('recipient_address, total_received, tip_count').limit(10),
    ])
    return { tippers: tippers ?? [], recipients: recipients ?? [] }
  } catch {
    return { tippers: [], recipients: [] }
  }
}

const RANK_STYLE = [
  'bg-yellow-500/15 text-yellow-400 border border-yellow-500/20',
  'bg-white/8 text-white/50 border border-white/10',
  'bg-orange-500/15 text-orange-400 border border-orange-500/20',
]

export default async function LeaderboardPage() {
  const { tippers, recipients } = await getLeaderboard()
  const empty = tippers.length === 0 && recipients.length === 0

  return (
    <main className="max-w-app mx-auto px-4">
      <div className="py-4">
        <h1 className="text-xl font-bold">Leaderboard</h1>
        <p className="text-base-muted text-xs mt-1">Top tippers and recipients on Base.</p>
      </div>

      {empty ? (
        <div className="card p-12 text-center mt-4">
          <p className="text-base-muted text-sm">No tips recorded yet. Be the first!</p>
          <Link href="/" className="inline-block mt-4 bg-base-blue text-white px-5 py-2.5 rounded-xl text-sm font-semibold btn-glow">
            Send a tip →
          </Link>
        </div>
      ) : (
        <div className="space-y-6">
          {/* Top Tippers */}
          <section>
            <h2 className="font-mono text-xs text-base-muted uppercase tracking-widest mb-3">Top Tippers</h2>
            <div className="space-y-2">
              {tippers.map((row, i) => (
                <Link
                  key={row.tipper_address}
                  href={`/${row.tipper_address}`}
                  className="card flex items-center gap-3 p-3.5 hover:border-white/10 transition-colors group"
                >
                  <div className={`w-7 h-7 rounded-lg flex items-center justify-center text-xs font-mono font-bold flex-shrink-0 ${RANK_STYLE[i] ?? 'bg-base-dark text-base-muted'}`}>
                    {i + 1}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-mono text-white/80 group-hover:text-white transition-colors truncate">
                      {shortAddress(row.tipper_address)}
                    </p>
                    <p className="text-[10px] text-base-muted">{row.tip_count} tips sent</p>
                  </div>
                  <div className="text-right flex-shrink-0">
                    <div className="text-sm font-mono font-bold text-base-blue">${Number(row.total_tipped).toFixed(2)}</div>
                  </div>
                </Link>
              ))}
            </div>
          </section>

          {/* Top Recipients */}
          <section>
            <h2 className="font-mono text-xs text-base-muted uppercase tracking-widest mb-3">Top Recipients</h2>
            <div className="space-y-2">
              {recipients.map((row, i) => (
                <Link
                  key={row.recipient_address}
                  href={`/${row.recipient_address}`}
                  className="card flex items-center gap-3 p-3.5 hover:border-white/10 transition-colors group"
                >
                  <div className={`w-7 h-7 rounded-lg flex items-center justify-center text-xs font-mono font-bold flex-shrink-0 ${RANK_STYLE[i] ?? 'bg-base-dark text-base-muted'}`}>
                    {i + 1}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-mono text-white/80 group-hover:text-white transition-colors truncate">
                      {shortAddress(row.recipient_address)}
                    </p>
                    <p className="text-[10px] text-base-muted">{row.tip_count} tips received</p>
                  </div>
                  <div className="text-right flex-shrink-0">
                    <div className="text-sm font-mono font-bold text-base-blue">${Number(row.total_received).toFixed(2)}</div>
                  </div>
                </Link>
              ))}
            </div>
          </section>
        </div>
      )}
    </main>
  )
}
