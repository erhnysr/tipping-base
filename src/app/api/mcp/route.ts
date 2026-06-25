import { NextRequest, NextResponse } from "next/server";
import { supabase } from "@/lib/supabase";

// ─── Tool definitions ────────────────────────────────────────────────────────

const TOOLS = [
  {
    name: "list_tips",
    description:
      "List recent USDC tips sent on tipping.base (Base Mainnet). Returns up to 20 most recent tips with tipper, recipient, amount, and timestamp.",
    inputSchema: {
      type: "object",
      properties: {
        limit: {
          type: "number",
          description: "Max number of tips to return (default 20, max 50)",
        },
        tipper: {
          type: "string",
          description: "Filter by tipper address (optional)",
        },
        recipient: {
          type: "string",
          description: "Filter by recipient address (optional)",
        },
      },
    },
  },
  {
    name: "get_leaderboard",
    description:
      "Get top tippers (by USDC sent) and top recipients (by USDC received). Returns top 10 for each category.",
    inputSchema: { type: "object", properties: {} },
  },
  {
    name: "get_stats",
    description:
      "Get platform-wide statistics: total tip count and total USDC tipped across all transactions.",
    inputSchema: { type: "object", properties: {} },
  },
];

// ─── Tool handlers ───────────────────────────────────────────────────────────

async function listTips(limit = 20, tipper?: string, recipient?: string) {
  let query = supabase
    .from("tips")
    .select("*")
    .order("created_at", { ascending: false })
    .limit(Math.min(limit, 50));

  if (tipper) query = query.eq("tipper_address", tipper.toLowerCase());
  if (recipient) query = query.eq("recipient_address", recipient.toLowerCase());

  const { data, error } = await query;
  if (error) throw new Error(error.message);
  return data;
}

async function getLeaderboard() {
  const [tippersRes, recipientsRes] = await Promise.all([
    supabase
      .from("leaderboard_tippers")
      .select("tipper_address, total_tipped, tip_count")
      .order("total_tipped", { ascending: false })
      .limit(10),
    supabase
      .from("leaderboard_recipients")
      .select("recipient_address, total_received, tip_count")
      .order("total_received", { ascending: false })
      .limit(10),
  ]);

  if (tippersRes.error) throw new Error(tippersRes.error.message);
  if (recipientsRes.error) throw new Error(recipientsRes.error.message);

  return {
    top_tippers: tippersRes.data,
    top_recipients: recipientsRes.data,
  };
}

async function getStats() {
  const [countRes, amountRes] = await Promise.all([
    supabase.from("tips").select("*", { count: "exact", head: true }),
    supabase.from("tips").select("amount"),
  ]);

  if (countRes.error) throw new Error(countRes.error.message);
  if (amountRes.error) throw new Error(amountRes.error.message);

  const totalUsdc = (amountRes.data ?? []).reduce(
    (sum, row) => sum + Number(row.amount),
    0,
  );

  return {
    total_tips: countRes.count ?? 0,
    total_usdc_tipped: Number(totalUsdc.toFixed(6)),
  };
}

// ─── JSON-RPC 2.0 handler ────────────────────────────────────────────────────

function ok(id: unknown, result: unknown) {
  return NextResponse.json({ jsonrpc: "2.0", id, result });
}

function err(id: unknown, code: number, message: string) {
  return NextResponse.json({ jsonrpc: "2.0", id, error: { code, message } });
}

export async function POST(req: NextRequest) {
  let body: { jsonrpc?: string; id?: unknown; method?: string; params?: unknown };
  try {
    body = await req.json();
  } catch {
    return err(null, -32700, "Parse error");
  }

  const { id, method, params } = body;

  if (body.jsonrpc !== "2.0" || typeof method !== "string") {
    return err(id ?? null, -32600, "Invalid Request");
  }

  try {
    switch (method) {
      case "initialize":
        return ok(id, {
          protocolVersion: "2024-11-05",
          capabilities: { tools: {} },
          serverInfo: { name: "tipping-base-mcp", version: "1.0.0" },
        });

      case "notifications/initialized":
        return new NextResponse(null, { status: 204 });

      case "tools/list":
        return ok(id, { tools: TOOLS });

      case "tools/call": {
        const p = params as { name?: string; arguments?: Record<string, unknown> };
        const args = p?.arguments ?? {};

        switch (p?.name) {
          case "list_tips": {
            const tips = await listTips(
              Number(args.limit) || 20,
              args.tipper as string | undefined,
              args.recipient as string | undefined,
            );
            return ok(id, {
              content: [{ type: "text", text: JSON.stringify(tips, null, 2) }],
            });
          }
          case "get_leaderboard": {
            const leaderboard = await getLeaderboard();
            return ok(id, {
              content: [{ type: "text", text: JSON.stringify(leaderboard, null, 2) }],
            });
          }
          case "get_stats": {
            const stats = await getStats();
            return ok(id, {
              content: [{ type: "text", text: JSON.stringify(stats, null, 2) }],
            });
          }
          default:
            return err(id, -32601, `Unknown tool: ${p?.name}`);
        }
      }

      default:
        return err(id, -32601, `Method not found: ${method}`);
    }
  } catch (e) {
    const message = e instanceof Error ? e.message : "Internal error";
    return err(id, -32603, message);
  }
}

export async function GET() {
  return NextResponse.json({
    name: "tipping-base-mcp",
    version: "1.0.0",
    protocol: "MCP/2024-11-05",
    transport: "http",
    tools: TOOLS.map((t) => t.name),
    endpoint: "https://tipping-base.vercel.app/api/mcp",
  });
}
