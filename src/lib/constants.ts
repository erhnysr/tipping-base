import { base } from 'viem/chains'

// USDC contract on Base mainnet
export const USDC_ADDRESS = '0x833589fCD6eDb6E08f4c7C32D4f71b54bdA02913' as const
export const USDC_DECIMALS = 6

// Tip amounts in USDC
export const TIP_AMOUNTS = [1, 3, 5, 10] as const

export const CHAIN = base

// Builder Code for transaction attribution
export const BUILDER_CODE = 'bc_s2m9sgxh'
