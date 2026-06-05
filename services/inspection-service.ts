/* Inspection booking + OTP verification. */
import { mockResolve } from "@/lib/api";
import { useAppStore } from "@/store/app-store";
import type { Inspection } from "@/lib/types";

export const inspectionService = {
  async list(): Promise<Inspection[]> {
    return mockResolve(useAppStore.getState().inspections);
  },

  async get(id: string): Promise<Inspection | undefined> {
    return mockResolve(useAppStore.getState().inspections.find((i) => i.id === id));
  },

  /** POST /inspections - returns the booking + a fresh 6-digit OTP. */
  async book(propertyId: string, date: string, time: string) {
    const inspection = useAppStore.getState().bookInspection(propertyId, date, time);
    return mockResolve(inspection);
  },

  /** PATCH /inspections/:id/approve - agent unlocks the address. */
  async approve(id: string) {
    useAppStore.getState().approveInspection(id);
    return mockResolve({ ok: true });
  },

  /**
   * POST /inspections/:id/verify-otp - agent submits the tenant's code
   * on-site. In production a GPS check accompanies this call.
   */
  async verifyOtp(id: string, code: string) {
    const ok = useAppStore.getState().verifyInspectionOtp(id, code);
    return mockResolve({ ok });
  },
};
