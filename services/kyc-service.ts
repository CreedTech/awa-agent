/* KYC queue. Mock now; Smile Identity integration marker included. */
import { mockResolve } from "@/lib/api";
import { useAppStore } from "@/store/app-store";
import type { KycRecord } from "@/lib/types";

export const kycService = {
  /** GET /kyc/queue - admin only. */
  async queue(): Promise<KycRecord[]> {
    return mockResolve(useAppStore.getState().kycQueue);
  },

  /**
   * PATCH /kyc/:id - approve.
   * In production the NIN is verified via Smile Identity before this.
   * TODO(smile-identity): await smileId.verifyNin({ nin, dob, ... })
   */
  async approve(id: string) {
    useAppStore.getState().approveKyc(id);
    return mockResolve({ ok: true });
  },

  async reject(id: string) {
    useAppStore.getState().rejectKyc(id);
    return mockResolve({ ok: true });
  },
};
