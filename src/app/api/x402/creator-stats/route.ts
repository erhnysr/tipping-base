import { NextRequest, NextResponse } from "next/server";
import { supabase } from "@/lib/supabase";

export async function GET(req: NextRequest) {
  const address = req.nextUrl.searchParams.get("address");
  if (!address) {
    return NextResponse.json({ error: "address query param required" }, { status: 400 });
  }

  const { data: tips } = await supabase
    .from("tips")
    .select("amount")
    .eq("recipient_address", address.toLowerCase());

  const total = (tips || []).reduce((sum, t) => sum + Number(t.amount), 0);
  const count = (tips || []).length;

  return NextResponse.json({
    address,
    total_tipped_usdc: total,
    tip_count: count,
    average_tip: count > 0 ? total / count : 0,
  });
}
