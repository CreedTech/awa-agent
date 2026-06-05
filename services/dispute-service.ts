/* Dispute board reads + admin resolution. */
import { mockResolve } from "@/lib/api";
import { useAppStore } from "@/store/app-store";
import type { Dispute, DisputeResolution } from "@/lib/types";

export const disputeService = {
  async list(): Promise<Dispute[]> {
    return mockResolve(useAppStore.getState().disputes);
  },

  /** PATCH /admin/disputes/:id - resolve in tenant/agent/split favour. */
  async resolve(id: string, resolution: DisputeResolution) {
    useAppStore.getState().resolveDispute(id, resolution);
    return mockResolve({ ok: true });
  },
};
