import { apiFetch } from "@/lib/api";

interface PayoutAccount {
  configured: boolean;
  bankName?: string;
  accountName?: string;
  accountLast4?: string;
}

export const payoutService = {
  async adminList(): Promise<Array<{ id: string; transactionId: string; role: string; amount: number; status: string; createdAt: string }>> {
    const response = await apiFetch<{ data: Array<{ id: string; transactionId: string; role: string; amount: number; status: string; createdAt: string }> }>("/escrow/admin/payouts");
    return response.data;
  },
  async reconcile(id: string) {
    await apiFetch(`/escrow/admin/payouts/${encodeURIComponent(id)}/reconcile`, { method: "POST" });
  },
  async finalize(id: string, otp: string) {
    await apiFetch(`/escrow/admin/payouts/${encodeURIComponent(id)}/finalize`, { method: "POST", json: { otp } });
  },
  async resendOtp(id: string) {
    await apiFetch(`/escrow/admin/payouts/${encodeURIComponent(id)}/resend-otp`, { method: "POST" });
  },
  async account(): Promise<PayoutAccount> {
    const response = await apiFetch<{ data: PayoutAccount }>("/escrow/payout-recipient");
    return response.data;
  },
  async banks(): Promise<Array<{ name: string; code: string }>> {
    const response = await apiFetch<{ data: Array<{ name: string; code: string }> }>("/escrow/banks");
    return response.data;
  },
  async configure(accountNumber: string, bankCode: string): Promise<PayoutAccount> {
    const response = await apiFetch<{ data: PayoutAccount }>("/escrow/payout-recipient", {
      method: "POST", json: { accountNumber, bankCode },
    });
    return response.data;
  },
};
