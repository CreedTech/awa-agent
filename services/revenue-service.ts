/* Revenue + admin dashboard metrics (read-only mock aggregates). */
import { mockResolve } from "@/lib/api";
import { REVENUE, ADMIN_STATS } from "@/lib/mock-data";
import type { RevenueMetric } from "@/lib/types";

export const revenueService = {
  async metrics(): Promise<RevenueMetric> {
    return mockResolve(REVENUE);
  },
  async adminStats() {
    return mockResolve(ADMIN_STATS);
  },
};
