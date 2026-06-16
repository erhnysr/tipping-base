import { supabase } from '@/lib/supabase'
import { shortAddress, timeAgo } from '@/lib/resolve'
import { CreatorSearch } from '@/components/CreatorSearch'
import type { Tip } from '@/lib/supabase'

export const revalidate = 30

async function getRecentTips(): Promise<Tip[]> {
  try {
    const { data } = await supabase
      .from('tips')
      .select('*')
      .order('created_at', { ascending: false })
      .limit(5)
    return data ?? []
  } catch {
    return []
  }
}

export default async function Home() {
  const tips = await getRecentTips()

  return (
    <main className="max-w-app mx-auto px-4">
      {/* Nav */}
      <nav className="flex items-center justify-between py-4">
        <div className="flex items-center gap-2">
          <div className="w-7 h-7 bg-base-blue rounded-lg flex items-center justify-center text-xs font-bold">⬡</div>
          <span className="font-mono text-sm font-semibold tracking-tight">tipping.base</span>
        </div>
        <div className="flex items-center gap-1.5 bg-base-card border border-base-border rounded-full px-3 py-1">
          <span className="w-1.5 h-1.5 rounded-full bg-base-success animate-pulse-slow" />
          <span className="text-xs font-mono text-base-muted">Base Mainnet</span>
        </div>
      </nav>

      {/* Hero */}
      <section className="pt-8 pb-10 text-center">
        <div className="inline-flex items-center gap-2 bg-base-card border border-base-border rounded-full px-4 py-1.5 text-xs font-mono text-base-blue mb-6">
          <span className="w-1.5 h-1.5 bg-base-blue rounded-full animate-pulse-slow" />
          Built on Base · Zero fees
        </div>

        <h1 className="text-4xl font-bold leading-tight mb-3 tracking-tight">
          Tip builders<br />
          <span className="text-base-blue">onchain.</span>
        </h1>

        <p className="text-base-muted text-sm mb-8 max-w-xs mx-auto leading-relaxed">
          Send USDC directly to any wallet or basename. Instant. Free. Permanent.
        </p>

        <CreatorSearch />
      </section>

      {/* Features */}
      <section className="grid grid-cols-3 gap-2 mb-8">
        {[
          { icon: '⚡', label: '2s finality', sub: 'Base speed' },
          { icon: '🔵', label: '0% fees', sub: 'Direct transfer' },
          { icon: '⛓', label: 'Onchain', sub: 'Forever verifiable' },
        ].map(f => (
          <div key={f.label} className="card p-3 text-center">
            <div className="text-xl mb-1">{f.icon}</div>
            <div className="text-xs font-semibold">{f.label}</div>
            <div className="text-[10px] text-base-muted mt-0.5">{f.sub}</div>
          </div>
        ))}
      </section>

      {/* Recent tips */}
      <section>
        <h2 className="font-mono text-xs text-base-muted uppercase tracking-widest mb-3">
          Recent tips
        </h2>

        {tips.length === 0 ? (
          <div className="card p-8 text-center">
            <p className="text-base-muted text-sm">No tips yet — be the first.</p>
          </div>
        ) : (
          <div className="space-y-2">
            {tips.map(tip => (
              <div key={tip.id} className="card flex items-center gap-3 p-3.5">
                <div className="w-8 h-8 rounded-xl bg-base-blue/10 flex items-center justify-center flex-shrink-0">
                  <span className="text-base-blue text-xs font-bold">$</span>
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-xs font-mono">
                    <span className="text-white/70">{shortAddress(tip.tipper_address)}</span>
                    <span className="text-base-muted mx-1.5">→</span>
                    <span className="text-white/70">{shortAddress(tip.recipient_address)}</span>
                  </p>
                  <p className="text-[10px] text-base-muted mt-0.5">{timeAgo(tip.created_at)}</p>
                </div>
                <div className="text-sm font-mono font-bold text-base-blue flex-shrink-0">
                  ${Number(tip.amount).toFixed(2)}
                </div>
              </div>
            ))}
          </div>
        )}
      </section>
    </main>
  )
}
