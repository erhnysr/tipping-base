'use client'

import { useEffect, useState } from 'react'

const COLORS = ['#0052FF', '#7B61FF', '#00D97E', '#FFD700', '#FF6B6B', '#FF9500', '#FF69B4', '#00BFFF']

interface Piece {
  id: number
  left: number
  delay: number
  color: string
  w: number
  h: number
  dur: number
  anim: string
}

export function Confetti({ active }: { active: boolean }) {
  const [pieces, setPieces] = useState<Piece[]>([])

  useEffect(() => {
    if (!active) { setPieces([]); return }

    setPieces(
      Array.from({ length: 60 }, (_, i) => ({
        id: i,
        left: Math.random() * 100,
        delay: Math.random() * 0.9,
        color: COLORS[Math.floor(Math.random() * COLORS.length)],
        w: 5 + Math.random() * 7,
        h: 5 + Math.random() * 7,
        dur: 2.2 + Math.random() * 1.4,
        anim: Math.random() > 0.5 ? 'confetti-fall' : 'confetti-drift',
      }))
    )
  }, [active])

  if (!pieces.length) return null

  return (
    <div className="fixed inset-0 overflow-hidden pointer-events-none z-50">
      {pieces.map(p => (
        <div
          key={p.id}
          className="confetti-piece"
          style={{
            left: `${p.left}%`,
            width: p.w,
            height: p.h,
            backgroundColor: p.color,
            animation: `${p.anim} ${p.dur}s ease-in ${p.delay}s forwards`,
          }}
        />
      ))}
    </div>
  )
}
