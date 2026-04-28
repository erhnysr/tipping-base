'use client'

import { useState } from 'react'
import { useAccount, useWriteContract, useWaitForTransactionReceipt } from 'wagmi'
import { parseUnits, encodeFunctionData } from 'viem'
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
  const { isConnected } = useAccount()
  const { writeContract, data: hash, isPending } = useWriteContract()
  const { isLoading: isConfirming, isSuccess } = useWaitForTransactionReceipt({ hash })
  const [status, setStatus] = useState<Status>('idle')
  const [showConnect, setShowConnect] = useState(false)

  const handleTip = async () => {
    if (!isConnected) {
      setShowConnect(true)
      return
    }

    try {
      setStatus('pending')
      writeContract({
        address: USDC_ADDRESS,
        abi: USDC_ABI,
        functionName: 'transfer',
        args: [
          recipientAddress,
          parseUnits(amount.toString(), USDC_DECIMALS),
        ],
        // Builder Code attribution via data suffix
        dataSuffix: `0x${Buffer.from(BUILDER_CODE).toString('hex')}` as `0x${string}`,
      })
    } catch {
      setStatus('error')
      setTimeout(() => setStatus('idle'), 3000)
    }
  }

  // Update status based on transaction state
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

  if (showConnect && !isConnected) {
    return <ConnectWallet />
  }

  return (
    <button
      onClick={handleTip}
      disabled={displayStatus === 'pending'}
      className={`
        border rounded-xl py-3 font-mono text-sm font-semibold
        transition-all duration-200 ${getStyle()}
      `}
    >
      {getLabel()}
    </button>
  )
}
