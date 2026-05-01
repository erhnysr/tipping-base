'use client'

import { useParams } from 'next/navigation'
import { useState } from 'react'
import Link from 'next/link'
import { useConnect } from 'wagmi'
import { useAccount, useSendTransaction } from 'wagmi'
import { parseUnits, encodeFunctionData, toHex, concat } from 'viem'
import { Zap, ArrowLeft, Copy, Check, Loader2 } from 'lucide-react'

const TIP_AMOUNTS = [1, 5, 10, 25]

// USDC on Base Sepolia
const USDC_ADDRESS = '0x036CbD53842c5426634e7929541eC2318f3dCF7e'
const BUILDER_CODE = 'bc_dn3rl547'

const USDC_ABI = [{
  name: 'transfer',
  type: 'function',
  inputs: [
    { name: 'to', type: 'address' },
    { name: 'amount', type: 'uint256' },
  ],
  outputs: [{ type: 'bool' }],
}] as const

const MOCK_PROFILES: Record<string, { name: string; bio: string; avatar: string; tips: number }> = {
  '0xd8dA6BF26964aF9D7eEd9e03E53415D37aA96045': {
    name: 'vitalik.eth',
    bio: 'Ethereum co-founder. Working on making crypto useful.',
    avatar: '🧙‍♂️',
    tips: 142,
  },
  '0x849151d7D0bF1F34b70d5caD5149D28CC2308bf1': {
    name: 'jesse.base.eth',
    bio: 'Co-founder of Base. Building the onchain economy.',
    avatar: '🔵',
    tips: 89,
  },
}

export default function TipPage() {
  const params = useParams()
  const address = params.address as string
  const { address: walletAddress } = useAccount()
  const [amount, setAmount] = useState(5)
  const [sent, setSent] = useState(false)
  const [copied, setCopied] = useState(false)
  const [loading, setLoading] = useState(false)
  const [txHash, setTxHash] = useState<string | null>(null)
  const [error, setError] = useState<string | null>(null)

  const { sendTransactionAsync } = useSendTransaction()
  const { connect, connectors } = useConnect()

  const profile = MOCK_PROFILES[address] || {
    name: address.slice(0, 6) + '...' + address.slice(-4),
    bio: 'Base builder',
    avatar: '⚡',
    tips: 0,
  }

  // Builder Code suffix (ERC-7702 attribution)
  const builderSuffix = toHex(BUILDER_CODE, { size: 32 })

  const handleTip = async () => {
    if (!walletAddress) return
    setLoading(true)
    setError(null)
    try {
      const transferData = encodeFunctionData({
        abi: USDC_ABI,
        functionName: 'transfer',
        args: [address as `0x${string}`, parseUnits(amount.toString(), 6)],
      })

      // Append builder code suffix for attribution
      const dataWithSuffix = concat([transferData, builderSuffix])

      const hash = await sendTransactionAsync({
        to: USDC_ADDRESS,
        data: dataWithSuffix,
      })

      setTxHash(hash)
      setSent(true)
      setTimeout(() => setSent(false), 5000)
    } catch (e: any) {
      setError(e?.message?.slice(0, 80) || 'Transaction failed')
    } finally {
      setLoading(false)
    }
  }

  const copyAddress = () => {
    navigator.clipboard.writeText(address)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  return (
    <div className="grid-bg" style={{minHeight: '100vh', padding: 24}}>
      <div style={{maxWidth: 480, margin: '0 auto 24px'}}>
        <Link href="/" style={{display: 'inline-flex', alignItems: 'center', gap: 8, color: 'rgba(255,255,255,0.35)', fontSize: 14, textDecoration: 'none'}}>
          <ArrowLeft size={16} /> Back
        </Link>
      </div>

      <div style={{maxWidth: 480, margin: '0 auto'}}>
        {/* Profile card */}
        <div className="glass" style={{borderRadius: 24, padding: 32, marginBottom: 16, textAlign: 'center'}}>
          <div style={{width: 80, height: 80, background: 'rgba(0,82,255,0.1)', borderRadius: 20, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 40, margin: '0 auto 16px'}}>
            {profile.avatar}
          </div>
          <h1 className="font-display" style={{fontSize: 24, fontWeight: 800, letterSpacing: '-0.03em', marginBottom: 8}}>{profile.name}</h1>
          <p style={{color: 'rgba(255,255,255,0.35)', fontSize: 14, marginBottom: 16}}>{profile.bio}</p>
          <div style={{display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 6, marginBottom: 16}}>
            <Zap size={12} color="#0052FF" fill="#0052FF" />
            <span style={{fontSize: 12, color: 'rgba(255,255,255,0.25)'}}>{profile.tips} tips received</span>
          </div>
          <button onClick={copyAddress} style={{display: 'inline-flex', alignItems: 'center', gap: 6, color: 'rgba(255,255,255,0.2)', fontSize: 12, background: 'none', border: 'none', cursor: 'pointer'}}>
            {copied ? <Check size={12} /> : <Copy size={12} />}
            {address.slice(0, 8)}...{address.slice(-6)}
          </button>
        </div>

        {/* Tip card */}
        <div className="glass" style={{borderRadius: 24, padding: 24}}>
          <h2 className="font-display" style={{fontSize: 18, fontWeight: 700, letterSpacing: '-0.02em', marginBottom: 16}}>Send a tip</h2>

          <div style={{display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 8, marginBottom: 16}}>
            {TIP_AMOUNTS.map((a) => (
              <button key={a} onClick={() => setAmount(a)}
                style={{padding: '12px 0', borderRadius: 12, fontSize: 14, fontWeight: 700, border: 'none', cursor: 'pointer', transition: 'all 0.2s',
                  background: amount === a ? '#0052FF' : 'rgba(255,255,255,0.06)',
                  color: amount === a ? 'white' : 'rgba(255,255,255,0.5)',
                  boxShadow: amount === a ? '0 0 20px rgba(0,82,255,0.4)' : 'none'}}>
                ${a}
              </button>
            ))}
          </div>

          <input type="number" value={amount} onChange={(e) => setAmount(Number(e.target.value))}
            style={{width: '100%', background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: 12, padding: '12px 16px', color: 'white', fontSize: 14, marginBottom: 16, boxSizing: 'border-box', outline: 'none'}}
            placeholder="Custom amount (USDC)" />

          {error && (
            <div style={{background: 'rgba(239,68,68,0.1)', border: '1px solid rgba(239,68,68,0.3)', borderRadius: 12, padding: '10px 14px', fontSize: 12, color: '#f87171', marginBottom: 12}}>
              {error}
            </div>
          )}

          {txHash && (
            <a href={`https://sepolia.basescan.org/tx/${txHash}`} target="_blank" rel="noreferrer"
              style={{display: 'block', background: 'rgba(16,185,129,0.1)', border: '1px solid rgba(16,185,129,0.3)', borderRadius: 12, padding: '10px 14px', fontSize: 12, color: '#34d399', marginBottom: 12, textDecoration: 'none', textAlign: 'center'}}>
              ✅ View on Basescan →
            </a>
          )}

          {!walletAddress ? (
            <div style={{display:'flex',flexDirection:'column',gap:8}}>
            {connectors.map((connector) => (
              <button key={connector.id} onClick={() => connect({ connector })}
                style={{width:'100%',background:'#0052FF',color:'white',padding:'14px',borderRadius:12,fontWeight:600,fontSize:15,border:'none',cursor:'pointer'}}>
                Connect with {connector.name}
              </button>
            ))}
          </div>
          ) : (
            <button onClick={handleTip} disabled={loading || sent} className="btn-primary"
              style={{width: '100%', padding: '16px', borderRadius: 14, fontWeight: 700, fontSize: 16, border: 'none', cursor: loading ? 'wait' : 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8}}>
              {loading ? (
                <><Loader2 size={20} className="animate-spin" /> Sending...</>
              ) : sent ? (
                <><Check size={20} /> Tip sent! 🎉</>
              ) : (
                <><Zap size={20} /> Send ${amount} USDC</>
              )}
            </button>
          )}

          <p style={{fontSize: 11, color: 'rgba(255,255,255,0.2)', textAlign: 'center', marginTop: 12}}>
            Powered by Base · USDC on Sepolia testnet
          </p>
        </div>
      </div>
    </div>
  )
}
