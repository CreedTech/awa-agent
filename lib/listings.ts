import { env } from "./env";
import type { Property, PropertyType } from "./types";

export type ListingSort = "recent" | "price-asc" | "price-desc";

export interface ListingFilters {
  q: string;
  area: string | null;
  type: PropertyType | null;
  max: number | null;
  beds: number;
  amenities: string[];
  sort: ListingSort;
}

export const EMPTY_FILTERS: ListingFilters = {
  q: "",
  area: null,
  type: null,
  max: null,
  beds: 0,
  amenities: [],
  sort: "recent",
};

const TYPES: PropertyType[] = ["Studio", "Mini Flat", "Flat", "Duplex", "Bungalow"];
const SORTS: ListingSort[] = ["recent", "price-asc", "price-desc"];
const BUDGET_STEPS = [250_000, 500_000, 750_000, 1_000_000, 1_500_000, 2_000_000, 3_000_000, 5_000_000, 7_500_000, 10_000_000, 20_000_000, 50_000_000];

export function isPublicListing(property: Property) {
  return property.status === "LIVE";
}

export function parseFilters(params: { get(name: string): string | null }): ListingFilters {
  const max = Number(params.get("max"));
  const beds = Number(params.get("beds"));
  const type = params.get("type");
  const sort = params.get("sort");
  return {
    q: params.get("q")?.trim() ?? "",
    area: params.get("area")?.trim() || null,
    type: TYPES.find((value) => value === type) ?? null,
    max: Number.isFinite(max) && max > 0 ? max : null,
    beds: Number.isInteger(beds) && beds > 0 && beds <= 10 ? beds : 0,
    amenities: params.get("amenities")?.split(",").map((value) => value.trim()).filter(Boolean) ?? [],
    sort: SORTS.find((value) => value === sort) ?? "recent",
  };
}

export function filtersToQuery(filters: ListingFilters): string {
  const params = new URLSearchParams();
  if (filters.q) params.set("q", filters.q);
  if (filters.area) params.set("area", filters.area);
  if (filters.type) params.set("type", filters.type);
  if (filters.max) params.set("max", String(filters.max));
  if (filters.beds) params.set("beds", String(filters.beds));
  if (filters.amenities.length) params.set("amenities", filters.amenities.join(","));
  if (filters.sort !== "recent") params.set("sort", filters.sort);
  const query = params.toString();
  return query ? `?${query}` : "";
}

export function activeFilterCount(filters: ListingFilters) {
  return [filters.area, filters.type, filters.max, filters.beds || null].filter(Boolean).length + filters.amenities.length;
}

export function applyFilters(list: Property[], filters: ListingFilters): Property[] {
  const q = filters.q.toLowerCase();
  const result = list.filter((property) => {
    if (!isPublicListing(property)) return false;
    if (q && ![property.title, property.area, property.landmark, property.type].some((value) => value.toLowerCase().includes(q))) return false;
    if (filters.area && property.area.toLowerCase() !== filters.area.toLowerCase()) return false;
    if (filters.type && property.type !== filters.type) return false;
    if (filters.max && property.baseRent > filters.max) return false;
    if (filters.beds && property.beds < filters.beds) return false;
    if (filters.amenities.length && !filters.amenities.every((amenity) => property.amenities.includes(amenity))) return false;
    return true;
  });
  if (filters.sort === "price-asc") return [...result].sort((a, b) => a.baseRent - b.baseRent);
  if (filters.sort === "price-desc") return [...result].sort((a, b) => b.baseRent - a.baseRent);
  return result;
}

export interface Coverage {
  total: number;
  areas: { name: string; count: number; photo?: string }[];
  types: PropertyType[];
  amenities: string[];
  budgets: number[];
}

/** Everything a search control may offer, derived only from listings that are live right now. */
export function getCoverage(list: Property[]): Coverage {
  const live = list.filter(isPublicListing);
  const areas = new Map<string, { name: string; count: number; photo?: string }>();
  const types = new Set<PropertyType>();
  const amenities = new Set<string>();
  let highest = 0;
  for (const property of live) {
    if (property.area) {
      const key = property.area.toLowerCase();
      const entry = areas.get(key) ?? { name: property.area, count: 0 };
      entry.count += 1;
      entry.photo ??= property.images[0];
      areas.set(key, entry);
    }
    types.add(property.type);
    property.amenities.forEach((amenity) => amenities.add(amenity));
    highest = Math.max(highest, property.baseRent);
  }
  const ceiling = BUDGET_STEPS.findIndex((step) => step >= highest);
  const lowest = live.length ? Math.min(...live.map((property) => property.baseRent)) : 0;
  const budgets = live.length
    ? BUDGET_STEPS.slice(0, ceiling === -1 ? BUDGET_STEPS.length : ceiling).filter((step) => step >= lowest)
    : [];
  return {
    total: live.length,
    areas: [...areas.values()].sort((a, b) => b.count - a.count || a.name.localeCompare(b.name)),
    types: TYPES.filter((type) => types.has(type)),
    amenities: [...amenities].sort(),
    budgets,
  };
}

export function formatBudget(value: number) {
  if (value >= 1_000_000) return `${env.currency}${Number((value / 1_000_000).toFixed(1))}m`;
  return `${env.currency}${Math.round(value / 1_000)}k`;
}

export function bedLabel(beds: number) {
  return beds === 1 ? "1 bedroom" : `${beds} bedrooms`;
}

export function bathLabel(baths: number) {
  return baths === 1 ? "1 bathroom" : `${baths} bathrooms`;
}
