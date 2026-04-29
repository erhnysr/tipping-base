# tipping.base

Onchain USDC tipping for Base builders. Zero fees, no middleman.

🔗 **Live:** https://tipping-base.vercel.app

## What is this?

A tip/support app built on Base blockchain. Builders create a profile, supporters send USDC tips directly onchain.

## Tech Stack

- Next.js 14 (App Router)
- Tailwind CSS v4
- OnchainKit (Coinbase)
- Wagmi + Viem
- Base Sepolia testnet
- Vercel

## Features

- Create your builder profile
- Send USDC tips to any Base address
- Leaderboard of top builders
- Zero commission, fully onchain

## Getting Started

```bash
npm install
cp .env.example .env.local
# Add your OnchainKit API key from https://portal.cdp.coinbase.com
npm run dev
```

## Roadmap

- [ ] Real USDC transfers (blockchain integration)
- [ ] On-chain user profiles
- [ ] ENS/Basename resolution
- [ ] Mainnet deployment
- [ ] Transaction history
- [ ] Notifications

## Built on Base 🔵
