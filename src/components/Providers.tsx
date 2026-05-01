'use client'

import { createAppKit } from '@reown/appkit/react'
import { WagmiAdapter } from '@reown/appkit-adapter-wagmi'
import { baseSepolia } from '@reown/appkit/networks'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { WagmiProvider } from 'wagmi'
import { OnchainKitProvider } from '@coinbase/onchainkit'
import { baseSepolia as viemBaseSepolia } from 'viem/chains'

const queryClient = new QueryClient()
const projectId = '3c2bd01daf1ed4a51aa9764c4c4b763d'

const wagmiAdapter = new WagmiAdapter({
  networks: [baseSepolia],
  projectId,
})

createAppKit({
  adapters: [wagmiAdapter],
  networks: [baseSepolia],
  projectId,
  metadata: {
    name: 'tipping.base',
    description: 'Onchain USDC tipping for Base builders',
    url: 'https://tipping-base.vercel.app',
    icons: ['https://tipping-base.vercel.app/favicon.ico'],
  },
})

export function Providers({ children }: { children: React.ReactNode }) {
  return (
    <WagmiProvider config={wagmiAdapter.wagmiConfig}>
      <QueryClientProvider client={queryClient}>
        <OnchainKitProvider
          apiKey={process.env.NEXT_PUBLIC_ONCHAINKIT_API_KEY}
          chain={viemBaseSepolia}
        >
          {children}
        </OnchainKitProvider>
      </QueryClientProvider>
    </WagmiProvider>
  )
}
