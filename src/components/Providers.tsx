'use client'

import { OnchainKitProvider } from '@coinbase/onchainkit'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { baseSepolia } from 'viem/chains'
import { WagmiProvider, createConfig, http } from 'wagmi'
import { coinbaseWallet, metaMask, injected } from 'wagmi/connectors'

const queryClient = new QueryClient()

const config = createConfig({
  chains: [baseSepolia],
  connectors: [
    injected(),
    metaMask(),
    coinbaseWallet({
      appName: 'Tipping.base',
      preference: 'all',
    }),
  ],
  transports: {
    [baseSepolia.id]: http(),
  },
})

export function Providers({ children }: { children: React.ReactNode }) {
  return (
    <WagmiProvider config={config}>
      <QueryClientProvider client={queryClient}>
        <OnchainKitProvider
          apiKey={process.env.NEXT_PUBLIC_ONCHAINKIT_API_KEY}
          chain={baseSepolia}
          config={{
            appearance: {
              mode: 'dark',
            },
            wallet: {
              display: 'modal',
            },
          }}
        >
          {children}
        </OnchainKitProvider>
      </QueryClientProvider>
    </WagmiProvider>
  )
}
