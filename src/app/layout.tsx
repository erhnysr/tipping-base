import type { Metadata } from 'next'
import { DM_Sans, JetBrains_Mono } from 'next/font/google'
import './globals.css'
import { Providers } from './providers'

const dmSans = DM_Sans({ subsets: ['latin'], variable: '--font-sans' })
const jetbrainsMono = JetBrains_Mono({ subsets: ['latin'], variable: '--font-mono' })

export const metadata: Metadata = {
  title: 'Tipping.base — Onchain Tips for Builders',
  description: 'Send USDC tips to your favorite Base builders. Instant, free, onchain.',
  metadataBase: new URL('https://tipping-base.vercel.app'),
  openGraph: {
    title: 'Tipping.base',
    description: 'Support builders onchain. Send USDC tips in 2 seconds.',
    images: ['/og.png'],
  },
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={`${dmSans.variable} ${jetbrainsMono.variable}`}>
      <head>
        <meta name="base:app_id" content={process.env.NEXT_PUBLIC_BASE_APP_ID} />
        <link rel="preconnect" href="https://fonts.googleapis.com" />
      </head>
      <body className="bg-base-dark text-white antialiased">
        <Providers>{children}</Providers>
      </body>
    </html>
  )
}
