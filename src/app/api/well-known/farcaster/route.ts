import { NextResponse } from 'next/server'

export async function GET() {
  return NextResponse.json({
    accountAssociation: {
      header: 'eyJmaWQiOjMzMzM2NjAsInR5cGUiOiJjdXN0b2R5Iiwia2V5IjoiMHhkNzZEMDlhOTYxRmVmZEE1MkNlMTc3RTFDNDU1MTU4MGJEQjkzQTVFIn0',
      payload: 'eyJkb21haW4iOiJ0aXBwaW5nLWJhc2UudmVyY2VsLmFwcCJ9',
      signature: 'T60CEbgkJln8LhA6bwYQaj5HAsM1+hfEDEITSpZ2fVhuHDMgr/YGUvOUB58DFO2uVZJ2gB4INsFUIGV1hK6/ahw=',
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
