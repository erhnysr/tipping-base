export interface Profile {
  username: string
  basename: string
  address: `0x${string}`
  bio: string
  avatar: string
  github?: string
  twitter?: string
  totalTips: number
  tipCount: number
}

// Mock profiles — replace with on-chain data / database in production
export const PROFILES: Record<string, Profile> = {
  erhnysr: {
    username: 'erhnysr',
    basename: 'erhnysr.base.eth',
    address: '0xD3467E00F6d7275C74e60fc7A1E5eD526893B29F',
    bio: 'Web3 infrastructure engineer. Validators, nodes, OSS contributor. Building on Base.',
    avatar: 'https://avatars.githubusercontent.com/u/erhnysr',
    github: 'erhnysr',
    twitter: 'Erhnyasar',
    totalTips: 0,
    tipCount: 0,
  },
}

export function getProfile(username: string): Profile | null {
  return PROFILES[username.toLowerCase()] ?? null
}

export function getAllProfiles(): Profile[] {
  return Object.values(PROFILES).sort((a, b) => b.totalTips - a.totalTips)
}
