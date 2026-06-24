import { paymentProxy, x402ResourceServer } from "@x402/next";
import { HTTPFacilitatorClient } from "@x402/core/server";
import { ExactEvmScheme } from "@x402/evm/exact/server";

const PAY_TO = "0xD3467E00F6d7275C74e60fc7A1E5eD526893B29F";
// x402.org public facilitator supports Base Sepolia (eip155:84532).
// Base Mainnet (eip155:8453) requires a self-hosted facilitator.
const NETWORK = "eip155:84532";

const facilitatorClient = new HTTPFacilitatorClient({
  url: "https://x402.org/facilitator",
});

const resourceServer = new x402ResourceServer(facilitatorClient).register(
  NETWORK,
  new ExactEvmScheme()
);

// Note: /api/tips GET is also used by the history page (no payment header),
// which will receive 402 there. /api/leaderboard is agent-only safe.
export const proxy = paymentProxy(
  {
    "/api/leaderboard": {
      accepts: {
        scheme: "exact",
        price: "$0.002",
        network: NETWORK,
        payTo: PAY_TO,
      },
      description: "Access to tipping.base leaderboard",
    },
    "/api/tips": {
      accepts: {
        scheme: "exact",
        price: "$0.001",
        network: NETWORK,
        payTo: PAY_TO,
      },
      description: "Access to tipping.base tips feed",
    },
  },
  resourceServer
);

export const config = {
  matcher: ["/api/leaderboard", "/api/tips"],
};
