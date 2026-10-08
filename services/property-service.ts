import { apiFetch } from "@/lib/api";
import { toProperty, type BackendListing } from "@/lib/backend-mappers";
import type { Property } from "@/lib/types";

export const propertyService = {
  async list(): Promise<Property[]> {
    const response = await apiFetch<{ data: BackendListing[] }>("/properties");
    return response.data.map(toProperty);
  },

  async get(id: string): Promise<Property> {
    const response = await apiFetch<{ data: BackendListing }>(`/properties/${encodeURIComponent(id)}`);
    return toProperty(response.data);
  },
};
