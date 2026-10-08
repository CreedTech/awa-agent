import { apiFetch } from "@/lib/api";

export interface Subscription {
  tier: "GUEST" | "TIER1";
  expiresAt: string | null;
  priceNaira: number;
  checkoutAvailable: boolean;
  pendingCheckout: { id: string; checkoutUrl: string | null } | null;
}

export const subscriptionService = {
  async mine(): Promise<Subscription> {
    const response = await apiFetch<{ data: Subscription }>("/subscriptions/me");
    return response.data;
  },
  async initialize(): Promise<{ transactionId: string; checkoutUrl: string }> {
    const response = await apiFetch<{ data: { transactionId: string; checkoutUrl: string } }>("/subscriptions/initialize", { method: "POST" });
    const url = new URL(response.data.checkoutUrl);
    if (url.protocol !== "https:" || url.hostname !== "checkout.paystack.com") throw new Error("Invalid Paystack checkout address.");
    return response.data;
  },
  async verify(transactionId: string) {
    await apiFetch("/subscriptions/verify", { method: "POST", json: { transactionId } });
  },
};
