'use client'

import { notFound } from 'next/navigation'
import { getProfile } from '@/lib/profiles'
import { TipButton } from '@/components/TipButton'
import { TIP_AMOUNTS } from '@/lib/constants'
import Link from 'next/link'
import { ConnectWallet } from '@coinbase/onchainkit/wallet'

export default async function ProfilePage({ params }: { params: Promise<{ username: string }> }) {
  const { username } = await params
  const profile = getProfile(username)

  if (!profile) notFound()

  return (
    <main className="relative z-10 min-h-screen">
      {/* Nav */}
      <nav className="flex items-center justify-between px-6 py-5 border-b border-base-border">
        <Link href="/" className="flex items-center gap-2">
          <div className="w-7 h-7 bg-base-blue rounded-lg flex items-center justify-center text-xs font-bold">⬡</div>
          <span className="font-mono text-sm font-semibold tracking-tight">tipping.base</span>
        </Link>
        <ConnectWallet />
      </nav>

      <div className="max-w-xl mx-auto px-6 py-12">
        {/* Profile card */}
        <div className="card p-8 mb-6 animate-fade-in">
          {/* Avatar */}
          <div className="flex items-start gap-4 mb-6">
            <div className="w-16 h-16 bg-base-blue/20 rounded-2xl flex items-center justify-center text-2xl font-bold text-base-blue flex-shrink-0">
              {profile.username[0].toUpperCase()}
            </div>
            <div className="flex-1 min-w-0">
              <h1 className="text-xl font-bold mb-0.5">{profile.basename}</h1>
              <p className="font-mono text-xs text-base-muted truncate">{profile.address}</p>
            </div>
          </div>

          <p className="text-sm text-white/70 leading-relaxed mb-6">{profile.bio}</p>

          {/* Stats */}
          <div className="flex gap-4 mb-6">
            <div className="flex-1 bg-base-dark rounded-xl p-4 text-center">
              <div className="text-xl font-mono font-bold text-base-blue">${profile.totalTips}</div>
              <div className="text-xs text-base-muted mt-0.5">received</div>
            </div>
            <div className="flex-1 bg-base-dark rounded-xl p-4 text-center">
              <div className="text-xl font-mono font-bold">{profile.tipCount}</div>
              <div className="text-xs text-base-muted mt-0.5">tips</div>
            </div>
          </div>

          {/* Social links */}
          <div className="flex gap-2">
            {profile.github && (
              <a
                href={`https://github.com/${profile.github}`}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-1.5 bg-base-dark border border-base-border rounded-lg px-3 py-1.5 text-xs text-base-muted hover:text-white transition-colors"
              >
                <span>GitHub</span>
              </a>
            )}
            {profile.twitter && (
              <a
                href={`https://x.com/${profile.twitter}`}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-1.5 bg-base-dark border border-base-border rounded-lg px-3 py-1.5 text-xs text-base-muted hover:text-white transition-colors"
              >
                <span>Twitter</span>
              </a>
            )}
          </div>
        </div>

        {/* Tip section */}
        <div className="card p-6 animate-slide-up">
          <h2 className="font-mono text-xs text-base-muted uppercase tracking-widest mb-4">
            Send a tip in USDC
          </h2>

          <div className="grid grid-cols-4 gap-2 mb-4">
            {TIP_AMOUNTS.map((amount) => (
              <TipButton
                key={amount}
                amount={amount}
                recipientAddress={profile.address}
                recipientName={profile.basename}
              />
            ))}
          </div>

          <p className="text-xs text-base-muted text-center">
            Tips go directly to{' '}
            <span className="font-mono text-white/50">
              {profile.address.slice(0, 6)}...{profile.address.slice(-4)}
            </span>
            . Zero fees.
          </p>
        </div>
      </div>
    </main>
  )
}
