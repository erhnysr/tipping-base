import { NextResponse } from "next/server";

const AGENT_CARD = {
  name: "Tipping.base",
  description: "USDC tipping platform for Base builders — send tips to any wallet, ENS, or basename",
  url: "https://tipping-base.vercel.app",
  version: "1.0.0",
  capabilities: {
    mcp: {
      endpoint: "https://tipping-base.vercel.app/api/mcp",
      protocol: "MCP/2024-11-05",
      transport: "http",
    },
    x402: {
      supported: true,
      paymentEndpoint: "https://tipping-base.vercel.app/api/x402",
    },
  },
  tools: [
    {
      name: "list_tips",
      description: "List recent USDC tips with optional tipper/recipient filter",
    },
    {
      name: "get_leaderboard",
      description: "Top tippers and recipients by USDC volume",
    },
    {
      name: "get_stats",
      description: "Platform-wide tip count and total USDC tipped",
    },
  ],
};

export async function GET() {
  return NextResponse.json(AGENT_CARD, {
    headers: {
      "Access-Control-Allow-Origin": "*",
      "Cache-Control": "public, max-age=3600",
    },
  });
}
