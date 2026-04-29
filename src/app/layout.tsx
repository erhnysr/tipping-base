import type { Metadata } from 'next'
import { Providers } from '@/components/Providers'
import '@coinbase/onchainkit/styles.css'
import './globals.css'

export const metadata: Metadata = {
  title: 'tipping.base — Support builders onchain',
  description: 'Send instant USDC tips to Base builders. Zero fees, no middleman, fully onchain.',
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <head>
        <meta name="base:app_id" content="69f27aee05020c0316bbc000" />
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link href="https://fonts.googleapis.com/css2?family=Syne:wght@400;600;700;800&family=DM+Sans:wght@300;400;500&display=swap" rel="stylesheet" />
      </head>
      <body>
        <Providers>{children}</Providers>
      </body>
    </html>
  )
}
