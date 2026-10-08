import type { KycStatus, Property } from "@/lib/types";

export interface BackendListing {
  id: string;
  title: string;
  description: string;
  property_type: string | null;
  address_lga: string | null;
  location_label?: string | null;
  nearest_landmark: string | null;
  bedrooms: number | null;
  bathrooms: number | null;
  year_1_rent_naira: number;
  agent_id: string;
  agent_trust_score?: number | null;
  agent?: { name: string; trustScore: number; kycStatus: KycStatus } | null;
  amenities: string[] | null;
  photos: string[] | null;
  impression_count: number | null;
  save_count: number | null;
  inspection_slots_per_day?: number | null;
  status: string;
  badge: string | null;
}

const propertyTypes = ["Studio", "Mini Flat", "Flat", "Duplex", "Bungalow"] as const;
const amenityLabels: Record<string, string> = {
  borehole: "Borehole",
  prepaid_meter: "Pre-paid meter",
  security: "Security",
  parking: "Parking",
  pop_ceiling: "POP Ceiling",
  solar: "Solar",
};

export function toProperty(listing: BackendListing): Property {
  const type = propertyTypes.find((value) => value.toLowerCase() === listing.property_type?.toLowerCase()) ?? "Flat";
  const images = Array.isArray(listing.photos) ? listing.photos : [];
  return {
    id: listing.id,
    title: listing.title,
    description: listing.description,
    type,
    area: listing.location_label ?? listing.address_lga ?? "",
    landmark: listing.nearest_landmark ?? "",
    beds: listing.bedrooms ?? 0,
    baths: listing.bathrooms ?? 0,
    baseRent: Number(listing.year_1_rent_naira),
    agentId: listing.agent_id,
    agentTrustScore: listing.agent_trust_score ?? undefined,
    agentName: listing.agent?.name,
    agentKycStatus: listing.agent?.kycStatus,
    amenities: Array.isArray(listing.amenities) ? listing.amenities.map((item) => amenityLabels[item] ?? item) : [],
    images,
    imageLabels: images.map(() => listing.title),
    views: listing.impression_count ?? 0,
    bookmarks: listing.save_count ?? 0,
    inspectionSlotsPerDay: listing.inspection_slots_per_day ?? 3,
    available: listing.status === "AVAILABLE",
    badge: listing.badge === "Premium" ? "Premium" : "Verified",
    status: listing.status === "AVAILABLE" ? "LIVE" : listing.status === "OCCUPIED" ? "OCCUPIED" : listing.status === "PENDING_REVIEW" ? "AWAITING_ADMIN_REVIEW" : listing.status === "REJECTED" ? "REJECTED" : listing.status === "REMOVED" ? "REMOVED" : "PAUSED",
  };
}
