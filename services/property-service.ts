import { apiFetch } from "@/lib/api";
import { toProperty, type BackendListing } from "@/lib/backend-mappers";
import type { Property } from "@/lib/types";

export const propertyService = {
  async mine(): Promise<Property[]> {
    const response = await apiFetch<{ data: BackendListing[] }>("/properties/mine");
    return response.data.map(toProperty);
  },

  async create(values: {
    landlordId: string; title: string; description: string; propertyType: string;
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
    const response = await apiFetch<{ data: BackendListing[] }>("/properties");
    return response.data.map(toProperty);
  },

  async get(id: string): Promise<Property> {
    const response = await apiFetch<{ data: BackendListing }>(`/properties/${encodeURIComponent(id)}`);
    return toProperty(response.data);
  },
};
