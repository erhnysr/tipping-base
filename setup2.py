import os

os.makedirs('src/app/tip/[address]', exist_ok=True)
os.makedirs('src/app/create', exist_ok=True)
os.makedirs('src/app/leaderboard', exist_ok=True)

# tip/[address]/page.tsx
open('src/app/tip/[address]/page.tsx', 'w').write("""'use client'

import { useParams } from 'next/navigation'
import { useState } from 'react'
import Link from 'next/link'
import { ConnectWallet } from '@coinbase/onchainkit/wallet'
import { useAccount } from 'wagmi'
import { Zap, ArrowLeft, Copy, Check } from 'lucide-react'

const TIP_AMOUNTS = [1, 5, 10, 25]

const MOCK_PROFILES: Record<string, { name: string; bio: string; avatar: string; tips: number }> = {
  '0xd8dA6BF26964aF9D7eEd9e03E53415D37aA96045': {
    name: 'vitalik.eth',
    bio: 'Ethereum co-founder. Working on making crypto useful.',
    avatar: '🧙‍♂️',
    tips: 142,
  },
  '0x849151d7D0bF1F34b70d5caD5149D28CC2308bf1': {
    name: 'jesse.base.eth',
    bio: 'Co-founder of Base. Building the onchain economy.',
    avatar: '🔵',
    tips: 89,
  },
}

export default function TipPage() {
  const params = useParams()
  const address = params.address as string
  const { address: walletAddress } = useAccount()
  const [amount, setAmount] = useState(5)
  const [sent, setSent] = useState(false)
  const [copied, setCopied] = useState(false)

  const profile = MOCK_PROFILES[address] || {
    name: address.slice(0, 6) + '...' + address.slice(-4),
    bio: 'Base builder',
    avatar: '⚡',
    tips: 0,
  }

  const handleTip = () => {
    setSent(true)
    setTimeout(() => setSent(false), 3000)
  }

  const copyAddress = () => {
    navigator.clipboard.writeText(address)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  return (
    <div className="min-h-screen bg-[#0A0A0A] p-6">
      <div className="max-w-lg mx-auto mb-8">
        <Link href="/" className="inline-flex items-center gap-2 text-white/40 hover:text-white transition text-sm">
          <ArrowLeft className="w-4 h-4" /> Back
        </Link>
      </div>

      <div className="max-w-lg mx-auto">
        <div className="bg-white/3 border border-white/8 rounded-2xl p-8 mb-6 text-center">
          <div className="w-20 h-20 bg-[#0052FF]/10 rounded-2xl flex items-center justify-center text-4xl mx-auto mb-4">
            {profile.avatar}
          </div>
          <h1 className="text-2xl font-black text-white mb-2">{profile.name}</h1>
          <p className="text-white/40 text-sm mb-4">{profile.bio}</p>
          <div className="flex items-center justify-center gap-1 text-white/30 text-xs mb-4">
            <Zap className="w-3 h-3" />
            {profile.tips} tips received
          </div>
          <button
            onClick={copyAddress}
            className="inline-flex items-center gap-2 text-white/20 hover:text-white/40 text-xs transition"
          >
            {copied ? <Check className="w-3 h-3" /> : <Copy className="w-3 h-3" />}
            {address.slice(0, 8)}...{address.slice(-6)}
          </button>
        </div>

        <div className="bg-white/3 border border-white/8 rounded-2xl p-6">
          <h2 className="text-white font-bold mb-4">Send a tip</h2>

          <div className="grid grid-cols-4 gap-2 mb-4">
            {TIP_AMOUNTS.map((a) => (
              <button
                key={a}
                onClick={() => setAmount(a)}
                className={'py-3 rounded-xl text-sm font-bold transition ' +
                  (amount === a
                    ? 'bg-[#0052FF] text-white'
                    : 'bg-white/5 text-white/60 hover:bg-white/10')}
              >
                ${a}
              </button>
            ))}
          </div>

          <div className="mb-4">
            <input
              type="number"
              value={amount}
              onChange={(e) => setAmount(Number(e.target.value))}
              className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white text-sm focus:outline-none focus:border-[#0052FF]/40"
              placeholder="Custom amount"
            />
          </div>

          {!walletAddress ? (
            <ConnectWallet className="w-full" />
          ) : (
            <button
              onClick={handleTip}
              className="w-full bg-[#0052FF] text-white py-4 rounded-xl font-bold hover:bg-blue-600 transition flex items-center justify-center gap-2"
            >
              {sent ? (
                <><Check className="w-5 h-5" /> Tip sent!</>
              ) : (
                <><Zap className="w-5 h-5" /> Send ${amount} USDC</>
              )}
            </button>
          )}
        </div>
      </div>
    </div>
  )
}
""")
print('OK: tip/[address]/page.tsx')

# create/page.tsx
open('src/app/create/page.tsx', 'w').write("""'use client'

import { useState } from 'react'
import Link from 'next/link'
import { ConnectWallet } from '@coinbase/onchainkit/wallet'
import { useAccount } from 'wagmi'
import { Zap, ArrowLeft, Copy, Check } from 'lucide-react'

export default function CreatePage() {
  const { address } = useAccount()
  const [name, setName] = useState('')
  const [bio, setBio] = useState('')
  const [created, setCreated] = useState(false)
  const [copied, setCopied] = useState(false)

  const tipUrl = 'tipping-base.vercel.app/tip/' + address

  const copyLink = () => {
    navigator.clipboard.writeText(tipUrl)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  if (created) {
    return (
      <div className="min-h-screen bg-[#0A0A0A] flex items-center justify-center p-6">
        <div className="max-w-lg w-full bg-white/3 border border-white/8 rounded-2xl p-8 text-center">
          <div className="text-5xl mb-6">🚀</div>
          <h2 className="text-3xl font-black text-white mb-3">Page created!</h2>
          <p className="text-white/50 mb-8">Share your link and start receiving tips</p>

          <div className="bg-white/5 border border-white/10 rounded-xl p-4 mb-6 text-left">
            <p className="text-white/30 text-xs mb-2">Your tip page</p>
            <p className="text-white text-sm break-all">{tipUrl}</p>
          </div>

          <div className="flex gap-3">
            <button
              onClick={copyLink}
              className="flex-1 flex items-center justify-center gap-2 bg-[#0052FF] text-white py-3 rounded-xl font-semibold hover:bg-blue-600 transition"
            >
              {copied ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
              {copied ? 'Copied!' : 'Copy link'}
            </button>
            <Link
              href={'/tip/' + address}
              className="flex-1 text-center bg-white/5 border border-white/10 text-white py-3 rounded-xl font-semibold hover:bg-white/10 transition"
            >
              Preview
            </Link>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-[#0A0A0A] p-6">
      <div className="max-w-lg mx-auto mb-8">
        <Link href="/" className="inline-flex items-center gap-2 text-white/40 hover:text-white transition text-sm">
          <ArrowLeft className="w-4 h-4" /> Back
        </Link>
      </div>

      <div className="max-w-lg mx-auto">
        <div className="mb-8">
          <h1 className="text-3xl font-black text-white mb-2">Create your page</h1>
          <p className="text-white/40">Set up your tip page in 30 seconds</p>
        </div>

        {!address ? (
          <div className="bg-white/3 border border-white/8 rounded-2xl p-8 text-center">
            <div className="text-4xl mb-4">🔗</div>
            <h2 className="text-xl font-bold text-white mb-3">Connect your wallet</h2>
            <p className="text-white/40 text-sm mb-6">Connect your Base wallet to create your tip page</p>
            <ConnectWallet />
          </div>
        ) : (
          <div className="bg-white/3 border border-white/8 rounded-2xl p-8">
            <div className="flex items-center gap-3 bg-green-500/10 border border-green-500/20 rounded-xl p-3 mb-6">
              <div className="w-2 h-2 bg-green-400 rounded-full" />
              <span className="text-green-400 text-sm">Wallet connected: {address.slice(0, 6)}...{address.slice(-4)}</span>
            </div>

            <div className="mb-4">
              <label className="text-white/40 text-xs uppercase tracking-wider mb-2 block">Display name</label>
              <input
                type="text"
                placeholder="yourname.base.eth"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white placeholder-white/20 text-sm focus:outline-none focus:border-[#0052FF]/40"
              />
            </div>

            <div className="mb-6">
              <label className="text-white/40 text-xs uppercase tracking-wider mb-2 block">Bio (optional)</label>
              <textarea
                placeholder="What are you building?"
                value={bio}
                onChange={(e) => setBio(e.target.value)}
                rows={3}
                className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white placeholder-white/20 text-sm focus:outline-none focus:border-[#0052FF]/40 resize-none"
              />
            </div>

            <button
              onClick={() => setCreated(true)}
              className="w-full bg-[#0052FF] text-white py-4 rounded-xl font-bold hover:bg-blue-600 transition flex items-center justify-center gap-2"
            >
              <Zap className="w-5 h-5" />
              Create my tip page
            </button>
          </div>
        )}
      </div>
    </div>
  )
}
""")
print('OK: create/page.tsx')

# leaderboard/page.tsx
open('src/app/leaderboard/page.tsx', 'w').write("""'use client'

import { Zap, Trophy, ArrowLeft } from 'lucide-react'
import Link from 'next/link'

const LEADERBOARD = [
  { rank: 1, name: 'vitalik.eth', tips: 142, amount: '$4,230', avatar: '🧙‍♂️' },
  { rank: 2, name: 'jesse.base.eth', tips: 89, amount: '$2,670', avatar: '🔵' },
  { rank: 3, name: 'kia.base.eth', tips: 67, amount: '$1,890', avatar: '🎨' },
  { rank: 4, name: 'erhnysr.base.eth', tips: 12, amount: '$340', avatar: '⚡' },
  { rank: 5, name: 'builder.eth', tips: 8, amount: '$220', avatar: '🛠️' },
]

export default function LeaderboardPage() {
  return (
    <div className="min-h-screen bg-[#0A0A0A] p-6">
      <div className="max-w-2xl mx-auto mb-8">
        <Link href="/" className="inline-flex items-center gap-2 text-white/40 hover:text-white transition text-sm">
          <ArrowLeft className="w-4 h-4" /> Back
        </Link>
      </div>

      <div className="max-w-2xl mx-auto">
        <div className="text-center mb-12">
          <Trophy className="w-12 h-12 text-[#0052FF] mx-auto mb-4" />
          <h1 className="text-4xl font-black text-white mb-2">Leaderboard</h1>
          <p className="text-white/40">Most supported builders on Base</p>
        </div>

        <div className="space-y-3">
          {LEADERBOARD.map((builder) => (
            <Link
              key={builder.rank}
              href={'/tip/' + builder.name}
              className="flex items-center gap-4 bg-white/3 border border-white/8 rounded-2xl p-5 hover:border-[#0052FF]/30 hover:bg-white/5 transition group"
            >
              <div className={'text-2xl font-black w-8 ' + (
                builder.rank === 1 ? 'text-yellow-400' :
                builder.rank === 2 ? 'text-white/40' :
                builder.rank === 3 ? 'text-orange-400' : 'text-white/20'
              )}>
                {builder.rank === 1 ? '🥇' : builder.rank === 2 ? '🥈' : builder.rank === 3 ? '🥉' : '#' + builder.rank}
              </div>

              <div className="w-12 h-12 bg-[#0052FF]/10 rounded-xl flex items-center justify-center text-xl">
                {builder.avatar}
              </div>

              <div className="flex-1">
                <p className="text-white font-bold">{builder.name}</p>
                <p className="text-white/40 text-sm flex items-center gap-1">
                  <Zap className="w-3 h-3" /> {builder.tips} tips received
                </p>
              </div>

              <div className="text-right">
                <p className="text-white font-bold">{builder.amount}</p>
                <p className="text-white/30 text-xs">USDC</p>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </div>
  )
}
""")
print('OK: leaderboard/page.tsx')
print('TUMU TAMAM!')
