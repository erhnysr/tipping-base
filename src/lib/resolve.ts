import { createPublicClient, http, isAddress } from 'viem'
import { mainnet } from 'viem/chains'
import { normalize } from 'viem/ens'

// L1 client — resolves .eth and .base.eth names via CCIP-Read
const l1 = createPublicClient({
  chain: mainnet,
  transport: http('https://eth.llamarpc.com'),
})

export async function resolveInput(input: string): Promise<`0x${string}` | null> {
  const trimmed = input.trim()
  if (!trimmed) return null

  if (isAddress(trimmed)) return trimmed.toLowerCase() as `0x${string}`

  // Bare name → try .base.eth first
  const name = trimmed.includes('.') ? trimmed : `${trimmed}.base.eth`

  try {
    const addr = await l1.getEnsAddress({ name: normalize(name) })
    return addr
  } catch {
    return null
  }
}

export function shortAddress(addr: string) {
  return `${addr.slice(0, 6)}…${addr.slice(-4)}`
}

export function timeAgo(iso: string) {
  const secs = Math.floor((Date.now() - new Date(iso).getTime()) / 1000)
  if (secs < 60) return `${secs}s ago`
  if (secs < 3600) return `${Math.floor(secs / 60)}m ago`
  if (secs < 86400) return `${Math.floor(secs / 3600)}h ago`
  return `${Math.floor(secs / 86400)}d ago`
}
