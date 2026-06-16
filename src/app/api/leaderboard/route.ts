import { NextRequest, NextResponse } from 'next/server'
import { supabase } from '@/lib/supabase'

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url)
  const limit = Math.min(Number(searchParams.get('limit') ?? 10), 50)

  const [tippers, recipients] = await Promise.all([
    supabase
      .from('leaderboard_tippers')
      .select('tipper_address, total_tipped, tip_count')
      .limit(limit),
    supabase
      .from('leaderboard_recipients')
      .select('recipient_address, total_received, tip_count')
      .limit(limit),
  ])

  if (tippers.error) return NextResponse.json({ error: tippers.error.message }, { status: 500 })
  if (recipients.error) return NextResponse.json({ error: recipients.error.message }, { status: 500 })

  return NextResponse.json({
    tippers: tippers.data,
    recipients: recipients.data,
  })
}
