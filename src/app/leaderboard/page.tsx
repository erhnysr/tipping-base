'use client'

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
