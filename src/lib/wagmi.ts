import { createConfig, http } from 'wagmi'
import { base } from 'wagmi/chains'
import { coinbaseWallet } from 'wagmi/connectors'

export function getConfig() {
  return createConfig({
    chains: [base],
    connectors: [
      coinbaseWallet({ appName: 'Tipping.base' }),
    ],
    transports: {
      [base.id]: http(),
    },
    ssr: true,
  })
}