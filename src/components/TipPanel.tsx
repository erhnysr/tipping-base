'use client'

import { useEffect, useRef, useState } from 'react'
import { useAccount, useWriteContract, useWaitForTransactionReceipt } from 'wagmi'
import { parseUnits } from 'viem'
import { ConnectWallet } from '@coinbase/onchainkit/wallet'
import { USDC_ADDRESS, USDC_DECIMALS, BUILDER_CODE, TIP_AMOUNTS } from '@/lib/constants'
import { Confetti } from './Confetti'

const USDC_ABI = [
  {
    name: 'transfer', type: 'function', stateMutability: 'nonpayable',
    inputs: [{ name: 'to', type: 'address' }, { name: 'amount', type: 'uint256' }],
    outputs: [{ name: '', type: 'bool' }],
  },
] as const

type Status = 'idle' | 'signing' | 'confirming' | 'success' | 'error'

interface Props {
  recipientAddress: `0x${string}`
  recipientName: string
}

export function TipPanel({ recipientAddress, recipientName }: Props) {
  const { address, isConnected } = useAccount()
  const { writeContract, data: hash, isPending, error: writeError } = useWriteContract()
  const { isLoading: isConfirming, isSuccess, error: receiptError } = useWaitForTransactionReceipt({ hash })

  const [preset, setPreset] = useState<number>(1)
  const [custom, setCustom] = useState('')
  const [status, setStatus] = useState<Status>('idle')
  const [confetti, setConfetti] = useState(false)
  const savedRef = useRef(false)
  const amountRef = useRef(preset)

  const effectiveAmount = custom ? parseFloat(custom) : preset

  useEffect(() => { amountRef.current = effectiveAmount }, [effectiveAmount])

  useEffect(() => {
    if (isPending) setStatus('signing')
    else if (isConfirming) setStatus('confirming')
  }, [isPending, isConfirming])

  useEffect(() => {
    if (writeError || receiptError) {
      setStatus('error')
      setTimeout(() => setStatus('idle'), 4000)
    }
  }, [writeError, receiptError])

  useEffect(() => {
    if (!isSuccess || !hash || !address || savedRef.current) return
    savedRef.current = true
    setStatus('success')
    setConfetti(true)
    setTimeout(() => setConfetti(false), 4000)

    fetch('/api/tips', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        tipper_address: address,
        recipient_address: recipientAddress,
        amount: amountRef.current,
        tx_hash: hash,
      }),
    }).catch(() => {})
  }, [isSuccess, hash, address, recipientAddress])

  const handleTip = () => {
    const amt = effectiveAmount
    if (!isConnected || !amt || amt <= 0 || isNaN(amt)) return
    savedRef.current = false
    setStatus('signing')
    writeContract({
      address: USDC_ADDRESS,
      abi: USDC_ABI,
      functionName: 'transfer',
      args: [recipientAddress, parseUnits(amt.toFixed(6), USDC_DECIMALS)],
      dataSuffix: `0x${Buffer.from(BUILDER_CODE).toString('hex')}` as `0x${string}`,
    })
  }

  const handleShare = async () => {
    const text = `Just tipped ${recipientName} $${amountRef.current} USDC on tipping.base ⬡\n\nSupport builders onchain 👇`
    const url = `https://warpcast.com/~/compose?text=${encodeURIComponent(text)}&embeds[]=${encodeURIComponent('https://tipping-base.vercel.app')}`
    try {
      const { sdk } = await import('@farcaster/miniapp-sdk')
      const ctx = await sdk.context
      if (ctx) { sdk.actions.openUrl(url); return }
    } catch { /* not in frame */ }
    window.open(url, '_blank')
  }

  const handleReset = () => {
    setStatus('idle')
    setCustom('')
    setPreset(1)
    savedRef.current = false
  }

  const isLoading = status === 'signing' || status === 'confirming'

  if (status === 'success') {
    return (
      <>
        <Confetti active={confetti} />
        <div className="card card-accent p-6 animate-bounce-in text-center">
          <div className="w-16 h-16 rounded-full bg-base-success/10 border border-base-success/30 flex items-center justify-center mx-auto mb-4">
            <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="#00d97e" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              <polyline points="20 6 9 17 4 12"/>
            </svg>
          </div>
          <p className="font-bold text-lg mb-1">Tip sent!</p>
          <p className="text-base-muted text-sm mb-1">
            ${amountRef.current} USDC → <span className="text-white font-mono">{recipientName}</span>
          </p>
          {hash && (
            <a
              href={`https://basescan.org/tx/${hash}`}
              target="_blank"
              rel="noopener noreferrer"
              className="text-xs text-base-blue font-mono hover:underline"
            >
              {hash.slice(0, 10)}…{hash.slice(-8)} ↗
            </a>
          )}
          <div className="flex flex-col gap-2 mt-5">
            <button
              onClick={handleShare}
              className="w-full py-3 rounded-xl border border-violet-500/30 bg-violet-500/10 text-violet-400 text-sm font-semibold hover:bg-violet-500/20 transition-colors"
            >
              Share on Warpcast
            </button>
            <button
              onClick={handleReset}
              className="w-full py-3 rounded-xl border border-base-border text-base-muted text-sm font-semibold hover:text-white hover:border-white/20 transition-colors"
            >
              Tip again
            </button>
          </div>
        </div>
      </>
    )
  }

  return (
    <div className="card card-accent p-5 animate-slide-up">
      <p className="font-mono text-xs text-base-muted uppercase tracking-widest mb-4">Send a tip in USDC</p>

      {/* Preset amounts */}
      <div className="grid grid-cols-4 gap-2 mb-3">
        {TIP_AMOUNTS.map(amt => {
          const selected = !custom && preset === amt
          return (
            <button
              key={amt}
              onClick={() => { setPreset(amt); setCustom('') }}
              className={`py-3 rounded-xl border font-mono text-sm font-semibold transition-all duration-150 ${
                selected
                  ? 'bg-base-blue/15 border-base-blue text-base-blue'
                  : 'bg-base-dark border-base-border text-white hover:border-white/20'
              }`}
            >
              ${amt}
            </button>
          )
        })}
      </div>

      {/* Custom amount */}
      <div className={`flex items-center gap-2 rounded-xl border px-3 py-2.5 mb-4 transition-all ${custom ? 'border-base-blue/60 bg-base-blue/5' : 'border-base-border bg-base-dark'}`}>
        <span className="text-base-muted text-sm font-mono">$</span>
        <input
          type="number"
          min="0.01"
          step="0.01"
          placeholder="Custom amount"
          value={custom}
          onChange={e => setCustom(e.target.value)}
          className="flex-1 bg-transparent outline-none text-sm font-mono placeholder:text-base-muted"
        />
        <span className="text-base-muted text-xs">USDC</span>
      </div>

      {/* Action */}
      {isConnected ? (
        <button
          onClick={handleTip}
          disabled={isLoading || !effectiveAmount || effectiveAmount <= 0}
          className={`w-full py-3.5 rounded-xl font-semibold text-sm transition-all ${
            isLoading
              ? 'bg-base-blue/20 text-base-blue cursor-wait border border-base-blue/20'
              : 'bg-base-blue text-white btn-glow hover:opacity-90'
          } ${status === 'error' ? 'bg-red-500/20 border border-red-500/30 text-red-400' : ''}`}
        >
          {status === 'error' ? 'Transaction failed — try again'
            : status === 'confirming' ? '⏳ Confirming on Base…'
            : status === 'signing' ? '✍️ Confirm in wallet…'
            : `Send $${effectiveAmount || '?'} USDC →`}
        </button>
      ) : (
        <ConnectWallet className="w-full" />
      )}

      <p className="text-center text-xs text-base-muted mt-3">
        100% goes to{' '}
        <span className="font-mono text-white/40">
          {recipientAddress.slice(0, 6)}…{recipientAddress.slice(-4)}
        </span>
      </p>
    </div>
  )
}
