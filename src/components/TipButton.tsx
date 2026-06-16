'use client'

import { useEffect, useRef, useState } from 'react'
import { useAccount, useWriteContract, useWaitForTransactionReceipt } from 'wagmi'
import { parseUnits } from 'viem'
import { USDC_ADDRESS, USDC_DECIMALS, BUILDER_CODE } from '@/lib/constants'
import { ConnectWallet } from '@coinbase/onchainkit/wallet'

const USDC_ABI = [
  {
    name: 'transfer',
    type: 'function',
    stateMutability: 'nonpayable',
    inputs: [
      { name: 'to', type: 'address' },
      { name: 'amount', type: 'uint256' },
    ],
    outputs: [{ name: '', type: 'bool' }],
  },
] as const

interface TipButtonProps {
  amount: number
  recipientAddress: `0x${string}`
  recipientName: string
}

type Status = 'idle' | 'pending' | 'success' | 'error'

export function TipButton({ amount, recipientAddress, recipientName }: TipButtonProps) {
  const { address, isConnected } = useAccount()
  const { writeContract, data: hash, isPending } = useWriteContract()
  const { isLoading: isConfirming, isSuccess } = useWaitForTransactionReceipt({ hash })
  const [status, setStatus] = useState<Status>('idle')
  const [showConnect, setShowConnect] = useState(false)
  const savedRef = useRef(false)

  // POST to /api/tips once tx is confirmed, exactly once per hash
  useEffect(() => {
    if (!isSuccess || !hash || !address || savedRef.current) return
    savedRef.current = true

    fetch('/api/tips', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        tipper_address: address,
        recipient_address: recipientAddress,
        amount,
        tx_hash: hash,
      }),
    }).catch(() => {
      // non-blocking — tip already happened onchain
    })
  }, [isSuccess, hash, address, amount, recipientAddress])

  const handleTip = async () => {
    if (!isConnected) {
      setShowConnect(true)
      return
    }

    try {
      savedRef.current = false
      setStatus('pending')
      writeContract({
        address: USDC_ADDRESS,
        abi: USDC_ABI,
        functionName: 'transfer',
        args: [recipientAddress, parseUnits(amount.toString(), USDC_DECIMALS)],
        dataSuffix: `0x${Buffer.from(BUILDER_CODE).toString('hex')}` as `0x${string}`,
      })
    } catch {
      setStatus('error')
      setTimeout(() => setStatus('idle'), 3000)
    }
  }

  const handleShareOnWarpcast = async () => {
    const text = `Just tipped ${recipientName} $${amount} USDC on tipping.base ⬡\n\nSupport builders onchain 👇`
    const warpcastUrl = `https://warpcast.com/~/compose?text=${encodeURIComponent(text)}&embeds[]=${encodeURIComponent('https://tipping-base.vercel.app')}`

    try {
      const { sdk } = await import('@farcaster/miniapp-sdk')
      const context = await sdk.context
      if (context) {
        sdk.actions.openUrl(warpcastUrl)
        return
      }
    } catch {
      // not in frame
    }
    window.open(warpcastUrl, '_blank')
  }

  const displayStatus = isSuccess ? 'success' : isPending || isConfirming ? 'pending' : status

  const getLabel = () => {
    switch (displayStatus) {
      case 'pending': return '...'
      case 'success': return '✓'
      case 'error': return '!'
      default: return `$${amount}`
    }
  }

  const getStyle = () => {
    switch (displayStatus) {
      case 'success': return 'bg-green-500/10 border-green-500/30 text-green-400'
      case 'error': return 'bg-red-500/10 border-red-500/30 text-red-400'
      case 'pending': return 'bg-base-blue/10 border-base-blue/30 text-base-blue opacity-70 cursor-wait'
      default: return 'bg-base-dark border-base-border text-white hover:border-base-blue hover:text-base-blue'
    }
  }

  if (showConnect && !isConnected) return <ConnectWallet />

  return (
    <div className="flex flex-col gap-2">
      <button
        onClick={handleTip}
        disabled={displayStatus === 'pending'}
        className={`border rounded-xl py-3 font-mono text-sm font-semibold transition-all duration-200 ${getStyle()}`}
      >
        {getLabel()}
      </button>

      {displayStatus === 'success' && (
        <button
          onClick={handleShareOnWarpcast}
          className="w-full border border-violet-500/30 bg-violet-500/10 text-violet-400 rounded-xl py-2 text-xs font-semibold hover:bg-violet-500/20 transition-colors"
        >
          Share on Warpcast
        </button>
      )}
    </div>
  )
}
