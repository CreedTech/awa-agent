/* Escrow operations. Mock now; Paystack + webhook markers included. */
import { mockResolve } from "@/lib/api";
import { useAppStore } from "@/store/app-store";
import type { EscrowTransaction } from "@/lib/types";

export const escrowService = {
  async listForTenant(tenantName: string): Promise<EscrowTransaction[]> {
    const txns = useAppStore
      .getState()
      .escrow.filter((e) => e.tenantName === tenantName);
    return mockResolve(txns);
  },

  async listAll(): Promise<EscrowTransaction[]> {
    return mockResolve(useAppStore.getState().escrow);
  },

  /**
   * POST /escrow/initiate
   * In production this calls Paystack `transaction.initialize` with an
   * idempotencyKey, returns an authorization_url, and the FUNDS_LOCKED
   * transition happens on the `charge.success` webhook - not here.
   */
  async initiate(propertyId: string, commissionPct?: number) {
    const txn = useAppStore.getState().payEscrow(propertyId, commissionPct);
    // TODO(paystack): const { authorization_url } = await paystack.initialize({ ... })
    return mockResolve(txn);
  },

  /** POST /escrow/:id/confirm-keys - tenant releases the split. */
  async confirmKeys(txnId: string) {
    useAppStore.getState().confirmKeys(txnId);
    return mockResolve({ ok: true });
  },

  /** POST /escrow/:id/dispute */
  async dispute(txnId: string, reason: string) {
    useAppStore.getState().raiseDispute(txnId, reason);
    return mockResolve({ ok: true });
  },
};
