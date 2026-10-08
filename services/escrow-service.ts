import { apiFetch } from "@/lib/api";

export interface EscrowTransaction {
  id: string;
  propertyId: string;
  grossAmount: number;
  platformFee: number;
  agentShare: number;
  landlordShare: number;
  status: "PENDING_PAYMENT" | "FUNDS_LOCKED" | "RELEASE_PENDING" | "SETTLED" | "DISPUTED" | "REFUND_PENDING" | "REFUND_UNKNOWN" | "REFUND_FAILED" | "REFUNDED";
  checkoutUrl?: string;
  createdAt: string;
  fundsLockedAt?: string;
  settledAt?: string;
  refundedAt?: string;
  refundStatus?: string;
  disputeReason?: string;
  disputeResolutionNote?: string;
  payouts: Array<{ role: string; amount: number; status: string }>;
}

export const escrowService = {
  async mine(): Promise<Array<{ id: string; propertyId: string; propertyTitle: string; grossAmount: number; platformFee: number; agentShare: number; landlordShare: number; status: EscrowTransaction["status"]; createdAt: string; settledAt?: string }>> {
    const response = await apiFetch<{ data: Array<{ id: string; propertyId: string; propertyTitle: string; grossAmount: number; platformFee: number; agentShare: number; landlordShare: number; status: EscrowTransaction["status"]; createdAt: string; settledAt?: string }> }>("/escrow/mine");
    return response.data;
  },
  async disputes(): Promise<Array<{ id: string; propertyTitle: string; grossAmount: number; status: string; reason: string; description: string; raisedAt: string; resolutionNote?: string }>> {
    const response = await apiFetch<{ data: Array<{ id: string; propertyTitle: string; grossAmount: number; status: string; reason: string; description: string; raisedAt: string; resolutionNote?: string }> }>("/escrow/disputes");
    return response.data;
  },
  async dispute(transactionId: string, reason: string, description: string) {
    await apiFetch("/escrow/dispute", { method: "POST", json: { transactionId, reason, description } });
  },
  async resolveDispute(id: string, decision: "RESTORE_RELEASE" | "REFUND", note: string) {
    await apiFetch(`/escrow/admin/disputes/${encodeURIComponent(id)}/resolve`, { method: "POST", json: { decision, note } });
  },
  async capabilities(): Promise<{ checkoutAvailable: boolean; payoutMode: string }> {
    const response = await apiFetch<{ data: { checkoutAvailable: boolean; payoutMode: string } }>("/escrow/capabilities");
    return response.data;
  },
  async initialize(propertyId: string): Promise<{ transactionId: string; checkoutUrl: string }> {
    const response = await apiFetch<{ data: { transactionId: string; checkoutUrl: string } }>("/escrow/initialize", {
      method: "POST", json: { propertyId },
    });
    const url = new URL(response.data.checkoutUrl);
    if (url.protocol !== "https:" || url.hostname !== "checkout.paystack.com") {
      throw new Error("Payment provider returned an invalid checkout address.");
    }
    return response.data;
  },
  async verify(transactionId: string) {
    await apiFetch("/escrow/verify", { method: "POST", json: { transactionId } });
  },
  async get(id: string): Promise<EscrowTransaction> {
    const response = await apiFetch<{ data: EscrowTransaction }>(`/escrow/${encodeURIComponent(id)}`);
    return response.data;
  },
  async release(transactionId: string) {
    await apiFetch("/escrow/release", { method: "POST", json: { transactionId } });
  },
  async setPayoutRecipient(accountNumber: string, bankCode: string) {
    await apiFetch("/escrow/payout-recipient", { method: "POST", json: { accountNumber, bankCode } });
  },
};
