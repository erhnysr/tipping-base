'use client'

import { useState } from 'react'
import Link from 'next/link'
import { useAccount, useConnect, useDisconnect } from 'wagmi'
import { Zap, ArrowRight, TrendingUp, Users, Activity } from 'lucide-react'

const BUILDERS = [
  {
    name: 'vitalik.eth', role: 'Ethereum Creator',
    address: '0xd8dA6BF26964aF9D7eEd9e03E53415D37aA96045',
    tips: 142, avatar: '🧙‍♂️', tag: 'Protocol',
    tagBg: 'rgba(139,92,246,0.15)', tagColor: '#a78bfa',
  },
  {
    name: 'jesse.base.eth', role: 'Base Co-founder',
    address: '0x849151d7D0bF1F34b70d5caD5149D28CC2308bf1',
    tips: 89, avatar: '🔵', tag: 'Base',
    tagBg: 'rgba(0,82,255,0.15)', tagColor: '#6098ff',
  },
  {
    name: 'erhnysr.base.eth', role: 'Base Contributor',
    address: '0x0000000000000000000000000000000000000001',
    tips: 12, avatar: '⚡', tag: 'Builder',
    tagBg: 'rgba(16,185,129,0.15)', tagColor: '#34d399',
  },
]

const STATS = [
  { value: '243', label: 'Builders supported', Icon: Users },
  { value: '$12.4K', label: 'USDC tipped', Icon: TrendingUp },
  { value: '1,891', label: 'Tips sent', Icon: Activity },
]

export default function HomePage() {
  const { address, isConnected } = useAccount()
  const { connect, connectors } = useConnect()
  const { disconnect } = useDisconnect()

  return (
    <div className="grid-bg" style={{minHeight: '100vh'}}>

      {/* NAV */}
      <nav style={{position:'sticky',top:0,zIndex:50,borderBottom:'1px solid rgba(255,255,255,0.06)',backdropFilter:'blur(20px)',background:'rgba(4,4,10,0.85)'}}>
        <div style={{maxWidth:1100,margin:'0 auto',padding:'0 24px',height:64,display:'flex',alignItems:'center',justifyContent:'space-between'}}>
          <div style={{display:'flex',alignItems:'center',gap:10}}>
            <div style={{width:32,height:32,background:'#0052FF',borderRadius:10,display:'flex',alignItems:'center',justifyContent:'center',boxShadow:'0 0 20px rgba(0,82,255,0.5)'}}>
              <Zap size={16} color="white" fill="white" />
            </div>
            <span className="font-display" style={{fontWeight:800,fontSize:18,letterSpacing:'-0.03em'}}>tipping.base</span>
          </div>
          <div style={{display:'flex',alignItems:'center',gap:20}}>
            <Link href="/leaderboard" style={{color:'rgba(255,255,255,0.45)',fontSize:14,textDecoration:'none'}}>Leaderboard</Link>
            <div style={{display:'flex',alignItems:'center',gap:8}}>
              {isConnected ? (
                <button onClick={() => disconnect()} style={{background:'rgba(255,255,255,0.08)',border:'1px solid rgba(255,255,255,0.1)',color:'white',padding:'8px 16px',borderRadius:10,fontSize:13,cursor:'pointer'}}>
                  {address?.slice(0,6)}...{address?.slice(-4)} · Disconnect
                </button>
              ) : (
                <button onClick={() => connect({ connector: connectors[0] })} style={{background:'#0052FF',color:'white',padding:'10px 20px',borderRadius:10,fontSize:14,fontWeight:600,border:'none',cursor:'pointer',boxShadow:'0 0 20px rgba(0,82,255,0.4)'}}>
                  Connect Wallet
                </button>
              )}
            </div>
          </div>
        </div>
      </nav>

      {/* HERO */}
      <section style={{padding:'96px 24px 72px',textAlign:'center'}}>
        <div style={{maxWidth:760,margin:'0 auto'}}>
          <div className="fade-in" style={{display:'inline-flex',alignItems:'center',gap:8,background:'rgba(0,82,255,0.08)',border:'1px solid rgba(0,82,255,0.2)',borderRadius:100,padding:'7px 16px',marginBottom:28}}>
            <span className="pulse-dot" style={{width:6,height:6,background:'#0052FF',borderRadius:'50%',display:'inline-block'}} />
            <span style={{color:'#6098ff',fontSize:13,fontWeight:500}}>Built on Base · Zero fees · Fully onchain</span>
          </div>

          <h1 className="font-display fade-in-1" style={{fontSize:'clamp(52px,8vw,92px)',fontWeight:800,lineHeight:1.0,letterSpacing:'-0.04em',marginBottom:24}}>
            Support builders<br />
            <span style={{color:'#0052FF',textShadow:'0 0 80px rgba(0,82,255,0.5)'}}>onchain.</span>
          </h1>

          <p className="fade-in-2" style={{fontSize:18,color:'rgba(255,255,255,0.4)',lineHeight:1.8,marginBottom:44}}>
            Send instant USDC tips to your favorite Base builders.<br />
            No middleman. No fees. Just pure support.
          </p>

          <div className="fade-in-3" style={{display:'flex',gap:12,justifyContent:'center',flexWrap:'wrap'}}>
            <Link href="/create" className="btn-primary" style={{display:'inline-flex',alignItems:'center',gap:8,padding:'14px 28px',borderRadius:14,fontWeight:600,fontSize:15,textDecoration:'none'}}>
              Create your page <ArrowRight size={16} />
            </Link>
            <Link href="/leaderboard" style={{display:'inline-flex',alignItems:'center',gap:8,padding:'14px 28px',borderRadius:14,fontWeight:600,fontSize:15,textDecoration:'none',background:'rgba(255,255,255,0.05)',border:'1px solid rgba(255,255,255,0.08)',color:'white'}}>
              Explore builders
            </Link>
          </div>
        </div>
      </section>

      {/* STATS */}
      <section style={{padding:'0 24px 72px'}}>
        <div style={{maxWidth:800,margin:'0 auto',display:'grid',gridTemplateColumns:'repeat(3,1fr)',gap:16}}>
          {STATS.map(({value,label,Icon},i) => (
            <div key={label} className={`glass shimmer fade-in-${i+3}`} style={{borderRadius:20,padding:'28px 20px',textAlign:'center'}}>
              <div style={{width:36,height:36,background:'rgba(0,82,255,0.1)',borderRadius:10,display:'flex',alignItems:'center',justifyContent:'center',margin:'0 auto 12px'}}>
                <Icon size={16} color="#6098ff" />
              </div>
              <div className="font-display" style={{fontSize:34,fontWeight:800,letterSpacing:'-0.03em',marginBottom:4}}>{value}</div>
              <div style={{fontSize:13,color:'rgba(255,255,255,0.3)'}}>{label}</div>
            </div>
          ))}
        </div>
      </section>

      {/* FEATURED */}
      <section style={{padding:'0 24px 100px'}}>
        <div style={{maxWidth:920,margin:'0 auto'}}>
          <div className="fade-in-4" style={{display:'flex',alignItems:'center',justifyContent:'space-between',marginBottom:28}}>
            <h2 className="font-display" style={{fontSize:28,fontWeight:800,letterSpacing:'-0.03em'}}>Featured builders</h2>
            <Link href="/leaderboard" style={{display:'inline-flex',alignItems:'center',gap:4,color:'#6098ff',fontSize:13,textDecoration:'none',fontWeight:500}}>
              View all <ArrowRight size={12} />
            </Link>
          </div>
          <div className="fade-in-5" style={{display:'grid',gridTemplateColumns:'repeat(auto-fit,minmax(260px,1fr))',gap:16}}>
            {BUILDERS.map((b,i) => (
              <Link key={i} href={'/tip/'+b.address} style={{textDecoration:'none'}}>
                <div className="glass float" style={{borderRadius:20,padding:'24px',animationDelay:`${i*0.6}s`}}>
                  <div style={{display:'flex',justifyContent:'space-between',marginBottom:20}}>
                    <div style={{width:52,height:52,background:'rgba(0,82,255,0.08)',borderRadius:16,display:'flex',alignItems:'center',justifyContent:'center',fontSize:26}}>{b.avatar}</div>
                    <span style={{fontSize:11,fontWeight:600,color:b.tagColor,background:b.tagBg,padding:'4px 10px',borderRadius:100,letterSpacing:'0.05em',textTransform:'uppercase',alignSelf:'flex-start'}}>{b.tag}</span>
                  </div>
                  <div className="font-display" style={{fontSize:17,fontWeight:700,letterSpacing:'-0.02em',marginBottom:4}}>{b.name}</div>
                  <div style={{fontSize:13,color:'rgba(255,255,255,0.35)',marginBottom:20}}>{b.role}</div>
                  <div style={{display:'flex',alignItems:'center',gap:6,paddingTop:16,borderTop:'1px solid rgba(255,255,255,0.06)'}}>
                    <Zap size={12} color="#0052FF" fill="#0052FF" />
                    <span style={{fontSize:12,color:'rgba(255,255,255,0.25)'}}>{b.tips} tips received</span>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* FOOTER */}
      <footer style={{borderTop:'1px solid rgba(255,255,255,0.05)',padding:'24px'}}>
        <div style={{maxWidth:1100,margin:'0 auto',display:'flex',alignItems:'center',justifyContent:'space-between'}}>
          <div style={{display:'flex',alignItems:'center',gap:8}}>
            <div style={{width:24,height:24,background:'#0052FF',borderRadius:7,display:'flex',alignItems:'center',justifyContent:'center'}}>
              <Zap size={12} color="white" fill="white" />
            </div>
            <span style={{color:'rgba(255,255,255,0.25)',fontSize:13}}>tipping.base</span>
          </div>
          <span style={{color:'rgba(255,255,255,0.15)',fontSize:12}}>Built on Base 🔵</span>
        </div>
      </footer>
    </div>
  )
}
