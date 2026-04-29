'use client'

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
