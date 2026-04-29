'use client'

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
