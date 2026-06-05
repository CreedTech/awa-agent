/* Property reads. Mutations (add) go through the app store. */
import { mockResolve } from "@/lib/api";
import { useAppStore } from "@/store/app-store";
import { propertyById } from "@/lib/mock-data";
import type { Property } from "@/lib/types";

export const propertyService = {
  /** GET /properties - landmark only, never the exact address. */
  async list(): Promise<Property[]> {
    const all = useAppStore.getState().properties.filter((p) => p.status === "LIVE");
    // Strip the privacy-protected address before it leaves the "server".
    return mockResolve(all.map(({ exactAddress, ...rest }) => ({ ...rest })));
  },

  /**
   * GET /properties/:id - exact address only included once an inspection
   * for this property has been APPROVED for the current tenant.
   */
  async get(id: string): Promise<Property | undefined> {
    const prop = propertyById(id);
    if (!prop) return mockResolve(undefined);
    const unlocked = useAppStore
      .getState()
      .inspections.some((i) => i.propertyId === id && i.addressUnlocked);
    return mockResolve(unlocked ? prop : { ...prop, exactAddress: undefined });
  },
};
