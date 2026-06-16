'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'

const NAV = [
  {
    href: '/',
    label: 'Home',
    icon: (active: boolean) => (
      <svg width="20" height="20" viewBox="0 0 24 24" fill={active ? '#0052ff' : 'none'} stroke={active ? '#0052ff' : '#5a6070'} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M3 9l9-7 9 7v11a2 2 0 01-2 2H5a2 2 0 01-2-2z"/>
        <polyline points="9 22 9 12 15 12 15 22"/>
      </svg>
    ),
  },
  {
    href: '/leaderboard',
    label: 'Board',
    icon: (active: boolean) => (
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke={active ? '#0052ff' : '#5a6070'} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <line x1="18" y1="20" x2="18" y2="10"/>
        <line x1="12" y1="20" x2="12" y2="4"/>
        <line x1="6" y1="20" x2="6" y2="14"/>
      </svg>
    ),
  },
  {
    href: '/',
    label: 'Tip',
    isPrimary: true,
    icon: (_active: boolean) => (
      <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
        <line x1="12" y1="5" x2="12" y2="19"/>
        <line x1="5" y1="12" x2="19" y2="12"/>
      </svg>
    ),
  },
  {
    href: '/history',
    label: 'History',
    icon: (active: boolean) => (
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke={active ? '#0052ff' : '#5a6070'} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <circle cx="12" cy="12" r="10"/>
        <polyline points="12 6 12 12 16 14"/>
      </svg>
    ),
  },
]

export function BottomNav() {
  const pathname = usePathname()

  return (
    <nav className="fixed bottom-0 left-0 right-0 z-40 bg-base-dark/90 backdrop-blur-xl border-t border-base-border">
      <div className="max-w-app mx-auto flex items-center justify-around h-16 px-2" style={{ paddingBottom: 'env(safe-area-inset-bottom)' }}>
        {NAV.map((item) => {
          const active = pathname === item.href && !item.isPrimary
          return (
            <Link
              key={item.label}
              href={item.href}
              className={`flex flex-col items-center gap-1 ${item.isPrimary ? '' : 'min-w-[56px]'}`}
            >
              {item.isPrimary ? (
                <div className="w-12 h-12 rounded-2xl bg-base-blue flex items-center justify-center btn-glow">
                  {item.icon(false)}
                </div>
              ) : (
                <>
                  {item.icon(active)}
                  <span className={`text-[10px] font-mono ${active ? 'text-base-blue' : 'text-base-muted'}`}>
                    {item.label}
                  </span>
                </>
              )}
            </Link>
          )
        })}
      </div>
    </nav>
  )
}
