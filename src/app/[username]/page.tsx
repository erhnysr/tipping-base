import { notFound } from 'next/navigation'
import Link from 'next/link'
import { ConnectWallet } from '@coinbase/onchainkit/wallet'
import { Avatar, Name, Identity } from '@coinbase/onchainkit/identity'
import { base } from 'viem/chains'
import { resolveInput, shortAddress, timeAgo } from '@/lib/resolve'
import { supabase } from '@/lib/supabase'
import { TipPanel } from '@/components/TipPanel'
import type { Tip } from '@/lib/supabase'

export const dynamic = 'force-dynamic'

async function getTipStats(address: string) {
  try {
    const { data } = await supabase
      .from('tips')
      .select('amount, tipper_address, created_at')
      .eq('recipient_address', address)
      .order('created_at', { ascending: false })
    const totalReceived = data?.reduce((s, t) => s + Number(t.amount), 0) ?? 0
    return { totalReceived, tipCount: data?.length ?? 0, recent: (data ?? []) as Pick<Tip, 'tipper_address' | 'amount' | 'created_at'>[] }
  } catch {
    return { totalReceived: 0, tipCount: 0, recent: [] }
  }
}

export default async function ProfilePage({ params }: { params: Promise<{ username: string }> }) {
  const { username } = await params
  const decoded = decodeURIComponent(username)
  const address = await resolveInput(decoded)

  if (!address) notFound()

  const { totalReceived, tipCount, recent } = await getTipStats(address)

  return (
    <main className="max-w-app mx-auto px-4">
      {/* Nav */}
      <nav className="flex items-center justify-between py-4">
        <Link href="/" className="flex items-center gap-2 text-base-muted hover:text-white transition-colors">
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <polyline points="15 18 9 12 15 6"/>
          </svg>
          <div className="flex items-center gap-1.5">
            <div className="w-5 h-5 bg-base-blue rounded-md flex items-center justify-center text-[9px] font-bold text-white">⬡</div>
            <span className="font-mono text-xs font-semibold text-white tracking-tight">tipping.base</span>
          </div>
        </Link>
        <ConnectWallet />
      </nav>

      {/* Profile card */}
      <div className="card card-accent p-5 mb-4 animate-fade-in">
        <Identity address={address} chain={base}>
          <div className="flex items-center gap-4 mb-5">
            <Avatar className="w-14 h-14 rounded-2xl" />
            <div className="min-w-0">
              <Name className="font-bold text-base block" />
              <p className="text-xs text-base-muted font-mono mt-0.5">{shortAddress(address)}</p>
            </div>
          </div>
        </Identity>

        <div className="grid grid-cols-2 gap-3">
          <div className="bg-base-dark rounded-xl p-3 text-center">
            <div className="text-xl font-mono font-bold text-base-blue">${totalReceived.toFixed(2)}</div>
            <div className="text-[11px] text-base-muted mt-0.5">received</div>
          </div>
          <div className="bg-base-dark rounded-xl p-3 text-center">
            <div className="text-xl font-mono font-bold">{tipCount}</div>
            <div className="text-[11px] text-base-muted mt-0.5">tips</div>
          </div>
        </div>
      </div>

      {/* Tip panel */}
      <TipPanel recipientAddress={address} recipientName={decoded} />

      {/* Recent tips received */}
      {recent.length > 0 && (
        <section className="mt-6">
          <h2 className="font-mono text-xs text-base-muted uppercase tracking-widest mb-3">Recent tips received</h2>
          <div className="space-y-2">
            {recent.slice(0, 5).map((t, i) => (
              <div key={i} className="card flex items-center gap-3 p-3">
                <div className="w-7 h-7 rounded-lg bg-base-blue/10 flex items-center justify-center flex-shrink-0">
                  <span className="text-base-blue text-xs">↓</span>
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-xs font-mono text-white/70">{shortAddress(t.tipper_address)}</p>
                  <p className="text-[10px] text-base-muted">{timeAgo(t.created_at)}</p>
                </div>
                <span className="text-sm font-mono font-semibold text-base-blue">${Number(t.amount).toFixed(2)}</span>
              </div>
            ))}
          </div>
        </section>
      )}
    </main>
  )
}
