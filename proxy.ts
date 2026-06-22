import { paymentMiddleware } from "x402-next";
import { facilitator } from "@coinbase/x402";

export default paymentMiddleware(
  "0xD3467E00F6d7275C74e60fc7A1E5eD526893B29F",
  {
    "/api/x402/creator-stats": {
      price: "$0.01",
      network: "base",
      config: {
        description: "Premium creator tipping stats (agent-accessible via x402)",
      },
    },
  },
  facilitator as any
);

export const config = {
  matcher: ["/api/x402/creator-stats"],
};
