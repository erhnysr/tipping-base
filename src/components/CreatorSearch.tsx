'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'

export function CreatorSearch() {
  const [input, setInput] = useState('')
  const [focused, setFocused] = useState(false)
  const router = useRouter()

  const handle = () => {
    const q = input.trim()
    if (!q) return
    router.push(`/${encodeURIComponent(q)}`)
  }

  return (
    <div className={`flex items-center gap-2 bg-base-card rounded-2xl border transition-all duration-200 px-4 py-3 ${focused ? 'border-base-blue/50 shadow-[0_0_0_3px_rgba(0,82,255,0.08)]' : 'border-base-border'}`}>
      <svg className="flex-shrink-0 text-base-muted" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/>
      </svg>
      <input
        value={input}
        onChange={e => setInput(e.target.value)}
        onKeyDown={e => e.key === 'Enter' && handle()}
        onFocus={() => setFocused(true)}
        onBlur={() => setFocused(false)}
        placeholder="0x… or name.base.eth"
        className="flex-1 bg-transparent outline-none text-sm placeholder:text-base-muted font-mono"
        autoComplete="off"
        autoCapitalize="off"
        spellCheck={false}
      />
      <button
        onClick={handle}
        disabled={!input.trim()}
        className="flex-shrink-0 w-8 h-8 rounded-xl bg-base-blue flex items-center justify-center disabled:opacity-40 transition-opacity"
      >
        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
          <line x1="5" y1="12" x2="19" y2="12"/><polyline points="12 5 19 12 12 19"/>
        </svg>
      </button>
    </div>
  )
}
