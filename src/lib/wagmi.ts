import { createConfig, http } from 'wagmi'
import { base } from 'wagmi/chains'
import { coinbaseWallet } from 'wagmi/connectors'
import { farcasterMiniApp } from '@farcaster/miniapp-wagmi-connector'

export function getConfig() {
  return createConfig({
    chains: [base],
    connectors: [
      farcasterMiniApp(),
      coinbaseWallet({ appName: 'Tipping.base' }),
    ],
    transports: {
      [base.id]: http(),
    },
    ssr: true,
  })
}