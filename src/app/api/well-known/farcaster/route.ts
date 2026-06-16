import { NextResponse } from 'next/server'

export async function GET() {
  return NextResponse.json({
    accountAssociation: {
      header: '',
      payload: '',
      signature: '',
    },
    frame: {
      version: '1',
      name: 'Tipping.base',
      iconUrl: 'https://tipping-base.vercel.app/icon.png',
      splashImageUrl: 'https://tipping-base.vercel.app/og.png',
      splashBackgroundColor: '#0a0a0f',
      homeUrl: 'https://tipping-base.vercel.app',
      webhookUrl: 'https://tipping-base.vercel.app/api/webhook',
    },
  })
}
