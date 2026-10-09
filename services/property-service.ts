import { apiFetch } from "@/lib/api";
import { toProperty, type BackendListing } from "@/lib/backend-mappers";
import type { Property } from "@/lib/types";

export interface ManagedListing extends BackendListing {
  bathrooms: number; year_2_rent_naira: number; security_deposit: number;
  address_street: string; inspection_slots_per_day: number;
}

export const propertyService = {
  async mine(): Promise<Property[]> {
    const response = await apiFetch<{ data: BackendListing[] }>("/properties/mine");
    return response.data.map(toProperty);
  },

  async create(values: {
    landlordId?: string; agentId?: string; title: string; description: string; propertyType: string;
    bedrooms: number; bathrooms: number; year1RentNaira: number; year2RentNaira: number;
    address: { street: string; lga: string; landmark: string };
    amenities: string[]; photos: string[]; inspectionSlotsPerDay: number;
  }): Promise<Property> {
    const response = await apiFetch<{ data: BackendListing }>("/properties", { method: "POST", json: values });
    return toProperty(response.data);
  },

  async setStatus(id: string, status: "AVAILABLE" | "PAUSED"): Promise<void> {
    await apiFetch(`/properties/${encodeURIComponent(id)}/status`, { method: "PATCH", json: { status } });
  },
  async setModerationStatus(id: string, status: "AVAILABLE" | "PAUSED" | "REJECTED" | "REMOVED"): Promise<void> {
    await apiFetch(`/properties/${encodeURIComponent(id)}/status`, { method: "PATCH", json: { status } });
  },
  async manage(id: string): Promise<ManagedListing> {
    const response = await apiFetch<{ data: ManagedListing }>(`/properties/${encodeURIComponent(id)}/manage`);
    return response.data;
  },
  async update(id: string, values: Record<string, unknown>): Promise<void> {
    await apiFetch(`/properties/${encodeURIComponent(id)}`, { method: "PATCH", json: values });
  },
  async saved(): Promise<Property[]> {
    const response = await apiFetch<{ data: BackendListing[] }>("/properties/saved/mine");
    return response.data.map(toProperty);
  },

  async save(id: string): Promise<void> {
    await apiFetch(`/properties/${encodeURIComponent(id)}/save`, { method: "POST" });
  },

  async unsave(id: string): Promise<void> {
    await apiFetch(`/properties/${encodeURIComponent(id)}/save`, { method: "DELETE" });
  },
  async list(): Promise<Property[]> {
    return (await this.browse()).properties;
  },
  /** Guests and tenants without inspection access only receive the newest few listings. */
  async browse(): Promise<{ properties: Property[]; isGuestView: boolean }> {
    const response = await apiFetch<{ data: BackendListing[]; isGuestView?: boolean }>("/properties");
    return { properties: response.data.map(toProperty), isGuestView: response.isGuestView === true };
  },

  async get(id: string): Promise<Property> {
    const response = await apiFetch<{ data: BackendListing }>(`/properties/${encodeURIComponent(id)}`);
    return toProperty(response.data);
  },
};
