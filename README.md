# Tipping.base

Onchain tip & support app built on Base. Send USDC tips to builders in 2 seconds, zero fees.

## Features

- 🔵 **USDC tips** — $1, $3, $5, $10 presets
- ⚡ **Instant** — Base processes in 2 seconds
- 🆓 **Zero commission** — 100% goes to the builder
- ⛓️ **Fully onchain** — every tip is a real transaction
- 🏆 **Leaderboard** — top builders by tips received
- 🔑 **Builder Codes** — every tip tagged for attribution

## Stack

- Next.js 14 + TypeScript
- OnchainKit (Coinbase)
- Wagmi v2 + Viem
- Tailwind CSS
- Vercel

## Getting started

```bash
cp .env.example .env.local
# Fill in your API keys

npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

## Environment variables

| Variable | Description |
|---|---|
| `NEXT_PUBLIC_ONCHAINKIT_API_KEY` | Get from [OnchainKit](https://onchainkit.xyz) |
| `NEXT_PUBLIC_WALLETCONNECT_PROJECT_ID` | Get from [WalletConnect Cloud](https://cloud.walletconnect.com) |
| `NEXT_PUBLIC_BASE_APP_ID` | Your Base Builder dashboard app ID |

## Adding a profile

Edit `src/lib/profiles.ts` and add your entry to the `PROFILES` object.

## Deploy

```bash
vercel deploy
```

## License

MIT
