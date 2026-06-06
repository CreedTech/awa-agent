/* ============================================================
   AwaAgent - Mock data (Ibadan rental market)
   Realistic seed data for the prototype. Everything here is a
   plain object matching `lib/types.ts`; the `services/*` layer
   reads from this and is the swap point for a real backend.
   ============================================================ */

import type {
  AgentProfile,
  Property,
  User,
  Inspection,
  EscrowTransaction,
  Dispute,
  KycRecord,
  RevenueMetric,
  AppNotification,
  LoyaltyTransaction,
  TrustScoreEvent,
  AgentCommission,
  LandlordAuthorization,
  PropertyAgent,
} from "./types";
import { calculateRentBreakdown } from "./utils";

/** Unsplash CDN helper. */
const UNS = (id: string, w = 800, h = 600) =>
  `https://images.unsplash.com/photo-${id}?w=${w}&h=${h}&fit=crop&auto=format&q=80`;

/** Nigerian portrait helper for demo avatars. */
const NAIJA = (id: string, size = 160) => UNS(id, size, size);

/* ---------------- Agents ---------------- */
export const AGENTS: Record<string, AgentProfile> = {
  a1: { id: "AGT-4471", name: "Tunde Adeyemi", trust: 94, deals: 38, since: "2024", commissionPct: 10, verified: true, area: "Bodija · Ibadan", tier: "High Trust", ninStatus: "VERIFIED", photo: NAIJA("1654155427842-a4a249bf693e") },
  a2: { id: "AGT-2210", name: "Aisha Bello", trust: 88, deals: 21, since: "2025", commissionPct: 9, verified: true, area: "Akobo · Ibadan", tier: "Verified", ninStatus: "VERIFIED", photo: NAIJA("1753334480128-99cb4f8b28e2") },
  a3: { id: "AGT-7793", name: "Chidi Okonkwo", trust: 76, deals: 12, since: "2025", commissionPct: 9, verified: true, area: "Ring Rd · Ibadan", tier: "Verified", ninStatus: "VERIFIED", photo: NAIJA("1723221906960-1c5a5febc9c3") },
  a4: { id: "AGT-9920", name: "Funke Ogunleye", trust: 97, deals: 54, since: "2023", commissionPct: 10, verified: true, area: "Jericho · Ibadan", tier: "High Trust", ninStatus: "VERIFIED", photo: NAIJA("1742473717014-ca04e722e0b7") },
};

export const agentById = (id: string): AgentProfile | undefined =>
  Object.values(AGENTS).find((a) => a.id === id) ??
  AGENTS[id as keyof typeof AGENTS];

/* ---------------- Properties (10) ---------------- */
export const PROPERTIES: Property[] = [
  {
    id: "p1", title: "2 Bedroom Flat - Bodija", type: "Flat", area: "Bodija", landmark: "UI Main Gate",
    exactAddress: "14 Awolowo Avenue, Old Bodija, Ibadan", location: { lat: 7.4281, lng: 3.9234 },
    beds: 2, baths: 2, baseRent: 500000, agentId: "AGT-4471",
    amenities: ["Borehole", "Pre-paid meter", "Security", "Parking", "POP Ceiling"],
    imageLabels: ["Living room", "Kitchen", "Bedroom", "Exterior"],
    images: [UNS("1564013799919-ab600027ffc6"), UNS("1555041469-a586c61ea9bc"), UNS("1522708323590-d24dbb6b0267"), UNS("1556912173-3bb406ef7e77")],
    description: "Newly renovated 2-bedroom flat in a gated compound off Awolowo Avenue. Tiled throughout, ample parking, 5 minutes from UI Main Gate.",
    views: 842, bookmarks: 61, available: true, badge: "Verified", status: "LIVE",
  },
  {
    id: "p2", title: "Self-Contained Studio - Akobo", type: "Studio", area: "Akobo", landmark: "Akobo Roundabout",
    exactAddress: "7 Olaogun Street, Akobo, Ibadan", location: { lat: 7.4404, lng: 3.9412 },
    beds: 1, baths: 1, baseRent: 280000, agentId: "AGT-2210",
    amenities: ["Pre-paid meter", "Security", "Water Tank"],
    imageLabels: ["Studio room", "Bathroom", "Compound"],
    images: [UNS("1502005229762-cf1b2da7c5d6"), UNS("1484154218993-3c9aca53ff7d"), UNS("1522708323590-d24dbb6b0267")],
    description: "Compact self-contained studio ideal for young professionals. Prepaid meter, secure compound, walking distance to Akobo market.",
    views: 514, bookmarks: 33, available: true, badge: "Verified", status: "LIVE",
  },
  {
    id: "p3", title: "3 Bedroom Duplex - Jericho", type: "Duplex", area: "Jericho", landmark: "Jericho Mall",
    exactAddress: "2 Oba Adebimpe Road, Jericho GRA, Ibadan", location: { lat: 7.4122, lng: 3.931 },
    beds: 3, baths: 3, baseRent: 1450000, agentId: "AGT-9920",
    amenities: ["Borehole", "Pre-paid meter", "24/7 Security", "Parking", "POP Ceiling", "Fitted Kitchen", "BQ"],
    imageLabels: ["Facade", "Living area", "Master bedroom", "Kitchen", "Garden"],
    images: [UNS("1600596542815-ffad4c1539a9"), UNS("1555041469-a586c61ea9bc"), UNS("1522708323590-d24dbb6b0267"), UNS("1556912173-3bb406ef7e77"), UNS("1484154218993-3c9aca53ff7d")],
    description: "Premium 3-bedroom duplex with boys-quarters in a serviced estate. Fitted kitchen, en-suite rooms, landscaped garden. 2 minutes from Jericho Mall.",
    views: 1203, bookmarks: 118, available: true, badge: "Premium", status: "LIVE",
  },
  {
    id: "p4", title: "Mini Flat - Ring Road", type: "Mini Flat", area: "Ring Rd", landmark: "Ring Road Roundabout",
    exactAddress: "Block C, Adeoyo Estate, Ring Road, Ibadan", location: { lat: 7.3912, lng: 3.9044 },
    beds: 1, baths: 1, baseRent: 360000, agentId: "AGT-7793",
    amenities: ["Pre-paid meter", "Security", "Parking"],
    imageLabels: ["Sitting room", "Bedroom", "Kitchenette"],
    images: [UNS("1493809842364-78817add7ffb"), UNS("1522708323590-d24dbb6b0267"), UNS("1484154218993-3c9aca53ff7d")],
    description: "Affordable mini-flat with separate kitchen and bath. Tarred road access, secured estate, close to Ring Road shopping district.",
    views: 389, bookmarks: 19, available: true, badge: "Verified", status: "LIVE",
  },
  {
    id: "p5", title: "2 Bedroom Flat - Akobo", type: "Flat", area: "Akobo", landmark: "Total Filling Station",
    exactAddress: "21 General Gas Road, Akobo, Ibadan", location: { lat: 7.4361, lng: 3.9377 },
    beds: 2, baths: 2, baseRent: 620000, agentId: "AGT-2210",
    amenities: ["Borehole", "Pre-paid meter", "Security", "Parking", "POP Ceiling"],
    imageLabels: ["Living room", "Bedroom", "Balcony"],
    images: [UNS("1580587771525-78b9dba3b914"), UNS("1484154218993-3c9aca53ff7d"), UNS("1522708323590-d24dbb6b0267")],
    description: "Bright 2-bedroom flat on the first floor with a private balcony. Constant water, prepaid meter, gated estate with security.",
    views: 677, bookmarks: 44, available: false, nextFree: "Mar 2027", badge: "Verified", status: "OCCUPIED",
  },
  {
    id: "p6", title: "3 Bedroom Bungalow - Bodija", type: "Bungalow", area: "Bodija", landmark: "Bodija Market",
    exactAddress: "9 Aare Avenue, New Bodija, Ibadan", location: { lat: 7.4267, lng: 3.9123 },
    beds: 3, baths: 2, baseRent: 980000, agentId: "AGT-4471",
    amenities: ["Borehole", "Pre-paid meter", "Security", "Parking", "Garden", "BQ"],
    imageLabels: ["Frontage", "Living room", "Bedroom", "Backyard"],
    images: [UNS("1583847268964-b28dc8f51f92"), UNS("1555041469-a586c61ea9bc"), UNS("1522708323590-d24dbb6b0267"), UNS("1484154218993-3c9aca53ff7d")],
    description: "Standalone 3-bedroom bungalow on a quiet street with mature trees. Large compound, borehole, perfect for a family.",
    views: 902, bookmarks: 73, available: true, badge: "Verified", status: "LIVE",
  },
  {
    id: "p7", title: "1 Bedroom Flat - Mokola", type: "Mini Flat", area: "Mokola", landmark: "Mokola Roundabout",
    exactAddress: "5 Ijokodo Road, Mokola, Ibadan", location: { lat: 7.3988, lng: 3.912 },
    beds: 1, baths: 1, baseRent: 320000, agentId: "AGT-7793",
    amenities: ["Pre-paid meter", "Security"],
    imageLabels: ["Sitting room", "Bedroom"],
    images: [UNS("1554995207-c18c203602cb"), UNS("1484154218993-3c9aca53ff7d")],
    description: "Tidy one-bedroom flat close to the university second gate. Ideal for students and young workers.",
    views: 271, bookmarks: 14, available: true, badge: "Verified", status: "LIVE",
  },
  {
    id: "p8", title: "2 Bedroom Flat - Dugbe", type: "Flat", area: "Dugbe", landmark: "Cocoa House",
    exactAddress: "12 Lebanon Street, Dugbe, Ibadan", location: { lat: 7.3801, lng: 3.8954 },
    beds: 2, baths: 2, baseRent: 420000, agentId: "AGT-9920",
    amenities: ["Pre-paid meter", "Security", "Parking", "Water Tank"],
    imageLabels: ["Living room", "Kitchen", "Bedroom"],
    images: [UNS("1560448204-e02f11c3d0e2"), UNS("1522708323590-d24dbb6b0267"), UNS("1484154218993-3c9aca53ff7d")],
    description: "Centrally located flat in the heart of Dugbe business district. Walking distance to banks and markets.",
    views: 458, bookmarks: 27, available: true, badge: "Verified", status: "LIVE",
  },
  {
    id: "p9", title: "4 Bedroom Duplex - Jericho", type: "Duplex", area: "Jericho", landmark: "Jericho Barracks",
    exactAddress: "18 Tsamico Estate, Jericho, Ibadan", location: { lat: 7.4145, lng: 3.9298 },
    beds: 4, baths: 4, baseRent: 1800000, agentId: "AGT-9920",
    amenities: ["Borehole", "Pre-paid meter", "24/7 Security", "Parking", "Fitted Kitchen", "BQ", "Garden", "Air Conditioning"],
    imageLabels: ["Facade", "Living area", "Master bedroom", "Kitchen"],
    images: [UNS("1512917774080-9991f1c4c750"), UNS("1600596542815-ffad4c1539a9"), UNS("1555041469-a586c61ea9bc"), UNS("1556912173-3bb406ef7e77")],
    description: "Luxury 4-bedroom duplex in a gated estate. En-suite rooms, air-conditioning, large compound with boys-quarters.",
    views: 1456, bookmarks: 142, available: true, badge: "Premium", status: "LIVE",
  },
  {
    id: "p10", title: "Studio - Ring Road", type: "Studio", area: "Ring Rd", landmark: "Adeoyo Hospital",
    exactAddress: "Flat 4, Greenfield Court, Ring Road, Ibadan", location: { lat: 7.3897, lng: 3.9011 },
    beds: 1, baths: 1, baseRent: 240000, agentId: "AGT-2210",
    amenities: ["Pre-paid meter", "Security"],
    imageLabels: ["Studio room", "Bathroom"],
    images: [UNS("1502005229762-cf1b2da7c5d6"), UNS("1484154218993-3c9aca53ff7d")],
    description: "Budget-friendly studio near Adeoyo Hospital. Secure compound, prepaid meter, ready to move in.",
    views: 198, bookmarks: 9, available: true, badge: "Verified", status: "LIVE",
  },
];

export const propertyById = (id: string) => PROPERTIES.find((p) => p.id === id);

/* ---------------- Tenants ---------------- */
export const TENANT_ME: User = {
  id: "usr-tenant-1", name: "Bisi Akande", role: "tenant",
  email: "bisi.akande@example.com", phone: "0803 552 1190",
  photo: NAIJA("1531300185372-b7cbe2eddf0b"),
  kycStatus: "VERIFIED", accountStatus: "ACTIVE", trustScore: 72, joined: "Feb 2026", city: "Ibadan",
};

export const TENANTS: User[] = [
  TENANT_ME,
  { id: "usr-tenant-2", name: "Kola Davies", role: "tenant", phone: "0811 226 4430", kycStatus: "PENDING", accountStatus: "ACTIVE", trustScore: 40, joined: "May 2026", city: "Ibadan" },
  { id: "usr-tenant-3", name: "Ngozi Eze", role: "tenant", phone: "0803 221 0091", kycStatus: "VERIFIED", accountStatus: "ACTIVE", trustScore: 65, joined: "Mar 2026", city: "Lagos" },
  { id: "usr-tenant-4", name: "Amara Obi", role: "tenant", phone: "0901 443 2210", kycStatus: "UNVERIFIED", accountStatus: "ACTIVE", trustScore: 28, joined: "Jun 2026", city: "Ibadan" },
  { id: "usr-tenant-5", name: "Musa Aliyu", role: "tenant", phone: "0706 554 1122", kycStatus: "VERIFIED", accountStatus: "SUSPENDED", trustScore: 55, joined: "Jan 2026", city: "Abuja" },
];

/* ---------------- Inspections (tenant view) ---------------- */
export const INSPECTIONS: Inspection[] = [
  { id: "insp1", propertyId: "p3", tenantName: "Bisi Akande", date: "Tue 9 Jun", time: "11:30 AM", otp: "408 152", status: "CONFIRMED", queuePosition: 2, addressUnlocked: false },
  { id: "insp2", propertyId: "p1", tenantName: "Bisi Akande", date: "Thu 11 Jun", time: "4:00 PM", otp: "770 934", status: "APPROVED", queuePosition: 1, addressUnlocked: true },
];

/* ---------------- Escrow (tenant view) ---------------- */
export const TENANT_ESCROW: EscrowTransaction[] = [
  { id: "AWA-TX-90412", propertyId: "p6", tenantName: "Bisi Akande", agentName: "Tunde Adeyemi", landlordName: "Mr. B. Adeyinka", amount: calculateRentBreakdown(980000, 10).total, status: "FUNDS_LOCKED", lockedOn: "28 May 2026", paystackRef: "ps_3f9a2c71b", breakdown: calculateRentBreakdown(980000, 10) },
  { id: "AWA-TX-88120", propertyId: "p4", tenantName: "Bisi Akande", agentName: "Chidi Okonkwo", landlordName: "Mr. D. Salami", amount: calculateRentBreakdown(360000, 9).total, status: "SETTLED", lockedOn: "02 Apr 2026", settledOn: "09 Apr 2026", paystackRef: "ps_2a71c0e4d", breakdown: calculateRentBreakdown(360000, 9) },
];

export const SAVED_IDS = ["p3", "p5", "p9"];

/* ---------------- Agent (signed-in: Tunde Adeyemi) ---------------- */
export const AGENT_ME = AGENTS.a1;

export interface AgentListing {
  propertyId: string;
  status: "ACTIVE" | "PENDING_AUTH" | "BOOKED" | "OCCUPIED" | "PENDING_ADMIN" | "PAUSED";
  views: number;
  bookmarks: number;
  inspections: number;
  tenant?: string;
  landlord?: string;
}

export const AGENT_LISTINGS: AgentListing[] = [
  { propertyId: "p1", status: "ACTIVE", views: 842, bookmarks: 61, inspections: 7 },
  { propertyId: "p6", status: "BOOKED", views: 902, bookmarks: 73, inspections: 11, tenant: "Bisi Akande" },
  { propertyId: "p3", status: "PENDING_AUTH", views: 0, bookmarks: 0, inspections: 0, landlord: "Chief R. Adeleke" },
];

export const IMPRESSIONS = {
  rate: 14,
  monthPoints: 2685,
  today: { views: 54, bookmarks: 9, inspections: 2 },
  week: [
    { d: "Mon", pts: 312 }, { d: "Tue", pts: 268 }, { d: "Wed", pts: 401 },
    { d: "Thu", pts: 355 }, { d: "Fri", pts: 489 }, { d: "Sat", pts: 560 }, { d: "Sun", pts: 300 },
  ],
  rates: [
    { label: "Verified listing view", pts: 1, icon: "eye", count: 1840 },
    { label: "Listing bookmarked / pinned", pts: 5, icon: "bookmark", count: 121 },
    { label: "Inspection booked", pts: 20, icon: "calendar", count: 12 },
  ],
};

export interface AgentPayout {
  id: string;
  type: "Commission split" | "Impression payout";
  prop: string;
  amount: number;
  date: string;
  status: "Paid" | "Pending";
}

export const AGENT_EARNINGS = {
  available: 318400,
  impressionMonth: 37590,
  pendingSplit: 145000,
  history: [
    { id: "PO-5521", type: "Commission split", prop: "Mini Flat - Ring Road", amount: 28800, date: "09 Apr 2026", status: "Paid" },
    { id: "PO-5489", type: "Impression payout", prop: "March pool", amount: 41250, date: "31 Mar 2026", status: "Paid" },
    { id: "PO-5360", type: "Commission split", prop: "2 Bedroom - Akobo", amount: 49600, date: "18 Mar 2026", status: "Paid" },
  ] as AgentPayout[],
};

export interface ScanQueueItem {
  id: string;
  propertyId: string;
  tenant: string;
  time: string;
  otp: string;
  status: "PENDING" | "VERIFIED";
}

export const SCAN_QUEUE: ScanQueueItem[] = [
  { id: "sq1", propertyId: "p6", tenant: "Bisi Akande", time: "Today · 4:00 PM", otp: "770934", status: "PENDING" },
  { id: "sq2", propertyId: "p1", tenant: "Kola Davies", time: "Tue · 11:30 AM", otp: "408152", status: "PENDING" },
  { id: "sq3", propertyId: "p1", tenant: "Ngozi Eze", time: "Yesterday · 2:00 PM", otp: "315200", status: "VERIFIED" },
];

/* ---------------- Commission attribution ---------------- */
export const COMMISSIONS: AgentCommission[] = [
  {
    txnRef: "AWA-TX-88120", propertyName: "Mini Flat - Ring Road",
    listingAgent: { id: "AGT-7793", name: "Chidi Okonkwo", sharePct: 20 },
    inspectionAgent: { id: "AGT-4471", name: "Tunde Adeyemi", sharePct: 0 },
    closingAgent: { id: "AGT-4471", name: "Tunde Adeyemi", sharePct: 80 },
    finalRecipient: { id: "AGT-4471", name: "Tunde Adeyemi" },
    bonusSplit: true,
    reason: "You brought the tenant and completed the verified inspection - you receive the main commission. The listing agent earns a 20% listing-contribution bonus.",
  },
  {
    txnRef: "AWA-TX-82900", propertyName: "2 Bedroom Flat - Bodija",
    listingAgent: { id: "AGT-4471", name: "Tunde Adeyemi", sharePct: 100 },
    inspectionAgent: { id: "AGT-4471", name: "Tunde Adeyemi", sharePct: 100 },
    closingAgent: { id: "AGT-4471", name: "Tunde Adeyemi", sharePct: 100 },
    finalRecipient: { id: "AGT-4471", name: "Tunde Adeyemi" },
    reason: "You handled every stage of this deal, so you receive the full commission.",
  },
];

/* ---------------- Landlord (Chief R. Adeleke) ---------------- */
export const LANDLORD_ME: User & { bank: string; ninStatus: string; properties: number; tenants: number } = {
  id: "LND-3092", name: "Chief R. Adeleke", role: "landlord",
  phone: "0803 441 0092", photo: NAIJA("1654155427842-a4a249bf693e"),
  kycStatus: "VERIFIED", accountStatus: "ACTIVE", joined: "Jan 2025", city: "Ibadan",
  bank: "GTBank · 056·····92", ninStatus: "VERIFIED", properties: 4, tenants: 2,
};

export interface LandlordProperty {
  id: string;
  title: string;
  type: string;
  beds: number;
  baths: number;
  baseRent: number;
  area: string;
  landmark: string;
  status: "LIVE" | "PENDING_ADMIN" | "PAUSED" | "OCCUPIED";
  available: boolean;
  tenant: string | null;
  tenantSince: string | null;
  escrowRef: string | null;
  nextDue: string | null;
  views: number;
  inspections: number;
  daysToLet: number | null;
  maxAgents: number;
  img: string;
  agents: PropertyAgent[];
}

export const LANDLORD_PROPERTIES: LandlordProperty[] = [
  {
    id: "lp1", title: "2 Bedroom Flat - Bodija", type: "Flat", beds: 2, baths: 2, baseRent: 580000, area: "Bodija", landmark: "UI Main Gate",
    status: "LIVE", available: false, tenant: "Mrs. K. Ojo", tenantSince: "Mar 2026", escrowRef: "AWA-TX-7821", nextDue: "Mar 2027", views: 148, inspections: 7, daysToLet: 12, maxAgents: 3,
    img: UNS("1560448204-e02f11c3d0e2", 800, 400),
    agents: [
      { id: "AGT-4471", name: "Tunde Adeyemi", trust: 94, role: "PRIMARY", status: "AUTHORIZED", commission: 10, since: "Jan 2025", deals: 3, photo: NAIJA("1654155427842-a4a249bf693e") },
      { id: "AGT-2210", name: "Aisha Bello", trust: 88, role: "AUTHORIZED", status: "AUTHORIZED", commission: 9, since: "Mar 2025", deals: 1, photo: NAIJA("1753334480128-99cb4f8b28e2") },
    ],
  },
  {
    id: "lp2", title: "3 Bedroom Flat - Jericho", type: "Flat", beds: 3, baths: 3, baseRent: 980000, area: "Jericho", landmark: "Jericho Barracks",
    status: "LIVE", available: true, tenant: null, tenantSince: null, escrowRef: null, nextDue: null, views: 87, inspections: 4, daysToLet: null, maxAgents: 2,
    img: UNS("1580587771525-78b9dba3b914", 800, 400),
    agents: [
      { id: "AGT-4471", name: "Tunde Adeyemi", trust: 94, role: "PRIMARY", status: "AUTHORIZED", commission: 10, since: "Feb 2025", deals: 0, photo: NAIJA("1654155427842-a4a249bf693e") },
    ],
  },
  {
    id: "lp3", title: "Mini Flat - Akobo", type: "Mini Flat", beds: 1, baths: 1, baseRent: 350000, area: "Akobo", landmark: "Akobo Estate",
    status: "PENDING_ADMIN", available: true, tenant: null, tenantSince: null, escrowRef: null, nextDue: null, views: 0, inspections: 0, daysToLet: null, maxAgents: 2,
    img: UNS("1522771739844-6a9f6a868527", 800, 400),
    agents: [
      { id: "AGT-7793", name: "Emeka Okafor", trust: 76, role: "AUTHORIZED", status: "AUTHORIZED", commission: 9, since: "May 2026", deals: 0, photo: NAIJA("1723221906960-1c5a5febc9c3") },
    ],
  },
  {
    id: "lp4", title: "4 Bedroom Duplex - Ring Road", type: "Duplex", beds: 4, baths: 4, baseRent: 1200000, area: "Ring Road", landmark: "Ring Road Service Lane",
    status: "OCCUPIED", available: false, tenant: "Mr. A. Bello", tenantSince: "Nov 2025", escrowRef: "AWA-TX-5502", nextDue: "Nov 2026", views: 201, inspections: 11, daysToLet: 8, maxAgents: 4,
    img: UNS("1512917774080-9991f1c4c750", 800, 400),
    agents: [
      { id: "AGT-4471", name: "Tunde Adeyemi", trust: 94, role: "PRIMARY", status: "AUTHORIZED", commission: 10, since: "Oct 2024", deals: 2, photo: NAIJA("1654155427842-a4a249bf693e") },
      { id: "AGT-2210", name: "Aisha Bello", trust: 88, role: "AUTHORIZED", status: "AUTHORIZED", commission: 9, since: "Oct 2024", deals: 1, photo: NAIJA("1753334480128-99cb4f8b28e2") },
      { id: "AGT-7793", name: "Emeka Okafor", trust: 76, role: "AUTHORIZED", status: "AUTHORIZED", commission: 9, since: "Jan 2025", deals: 1, photo: NAIJA("1723221906960-1c5a5febc9c3") },
    ],
  },
];

export const AGENT_REQUESTS: LandlordAuthorization[] = [
  { id: "req1", propertyId: "lp2", agentId: "AGT-2210", agentName: "Aisha Bello", trust: 88, note: "Requests to co-list your 3-bed Jericho property.", date: "2 Jun 2026", status: "PENDING" },
  { id: "req2", propertyId: "lp3", agentId: "AGT-9910", agentName: "Dele Afolabi", trust: 61, note: "Requests to list your Akobo mini flat.", date: "1 Jun 2026", status: "PENDING" },
];

export interface RentLedgerRow {
  id: string;
  propertyId: string;
  prop: string;
  tenant: string;
  amount: number;
  due: string;
  paid: string | null;
  status: "PAID" | "VACANT" | "PENDING_ADMIN" | "UPCOMING";
  escrow: string | null;
  type: string;
}

export const RENT_LEDGER: RentLedgerRow[] = [
  { id: "rl1", propertyId: "lp4", prop: "4 Bed Duplex - Ring Rd", tenant: "Mr. A. Bello", amount: 1200000, due: "Nov 2025", paid: "31 Oct 2025", status: "PAID", escrow: "AWA-TX-5502", type: "First year" },
  { id: "rl2", propertyId: "lp1", prop: "2 Bed Flat - Bodija", tenant: "Mrs. K. Ojo", amount: 580000, due: "Mar 2026", paid: "28 Feb 2026", status: "PAID", escrow: "AWA-TX-7821", type: "First year" },
  { id: "rl3", propertyId: "lp2", prop: "3 Bed Flat - Jericho", tenant: "-", amount: 980000, due: "Awaiting", paid: null, status: "VACANT", escrow: null, type: "-" },
  { id: "rl4", propertyId: "lp3", prop: "Mini Flat - Akobo", tenant: "-", amount: 350000, due: "Pending", paid: null, status: "PENDING_ADMIN", escrow: null, type: "-" },
  { id: "rl5", propertyId: "lp4", prop: "4 Bed Duplex - Ring Rd", tenant: "Mr. A. Bello", amount: 1080000, due: "Nov 2026", paid: null, status: "UPCOMING", escrow: null, type: "Year 2 (base)" },
  { id: "rl6", propertyId: "lp1", prop: "2 Bed Flat - Bodija", tenant: "Mrs. K. Ojo", amount: 522000, due: "Mar 2027", paid: null, status: "UPCOMING", escrow: null, type: "Year 2 (base)" },
];

export interface PayoutRow {
  id: string;
  propertyId: string;
  prop: string;
  tenant: string;
  gross: number;
  commission: number;
  fee: number;
  net: number;
  date: string;
  status: string;
  escrow: string;
}

export const PAYOUT_HISTORY: PayoutRow[] = [
  { id: "po1", propertyId: "lp4", prop: "4 Bed Duplex - Ring Rd", tenant: "Mr. A. Bello", gross: 1200000, commission: 120000, fee: 30000, net: 1050000, date: "31 Oct 2025", status: "SETTLED", escrow: "AWA-TX-5502" },
  { id: "po2", propertyId: "lp1", prop: "2 Bed Flat - Bodija", tenant: "Mrs. K. Ojo", gross: 580000, commission: 58000, fee: 14500, net: 507500, date: "28 Feb 2026", status: "SETTLED", escrow: "AWA-TX-7821" },
];

export const LANDLORD_STATS = {
  totalRentPaid: 1557500,
  pendingPayout: 0,
  activeProperties: 3,
  occupiedCount: 2,
  pendingRequests: 2,
  avgDaysToLet: 10,
  totalInspections: 22,
  upcomingRenewals: 2,
};

/* ---------------- Admin ---------------- */
export const ADMIN_ME: User & { adminRole: string } = {
  id: "ADM-001", name: "Admin Obi", role: "admin", kycStatus: "VERIFIED", accountStatus: "ACTIVE", joined: "Jan 2025", adminRole: "Super Admin",
};

export const KYC_QUEUE: KycRecord[] = [
  { id: "kyc1", name: "Emeka Okafor", role: "agent", phone: "0812 334 5521", nin: "7823 4421 012", submitted: "3 Jun 2026", trust: 0, risk: ["Multiple accounts"], status: "PENDING" },
  { id: "kyc2", name: "Ngozi Adeyemi", role: "tenant", phone: "0803 221 0091", nin: "6614 0023 887", submitted: "3 Jun 2026", trust: 0, risk: [], status: "PENDING" },
  { id: "kyc3", name: "Seun Falola", role: "agent", phone: "0901 443 2210", nin: "5529 1134 444", submitted: "2 Jun 2026", trust: 0, risk: ["NIN mismatch", "Photo quality"], status: "PENDING" },
  { id: "kyc4", name: "Dele Afolabi", role: "agent", phone: "0706 554 1122", nin: "8812 3301 556", submitted: "2 Jun 2026", trust: 0, risk: ["Flagged number"], status: "PENDING" },
  { id: "kyc5", name: "Amina Garba", role: "landlord", phone: "0805 112 3304", nin: "3310 5512 009", submitted: "1 Jun 2026", trust: 0, risk: [], status: "PENDING" },
  { id: "kyc6", name: "Kola Martins", role: "tenant", phone: "0811 226 4430", nin: "9901 2234 771", submitted: "1 Jun 2026", trust: 0, risk: [], status: "PENDING" },
  { id: "kyc7", name: "Bayo Ogunleye", role: "agent", phone: "0703 887 1120", nin: "4423 6610 338", submitted: "31 May 2026", trust: 0, risk: ["Address mismatch"], status: "PENDING" },
  { id: "kyc8", name: "Chioma Eze", role: "landlord", phone: "0814 093 4421", nin: "1102 8834 556", submitted: "30 May 2026", trust: 0, risk: [], status: "APPROVED", approvedOn: "1 Jun 2026" },
  { id: "kyc9", name: "Hassan Musa", role: "agent", phone: "0907 321 5540", nin: "7731 4490 112", submitted: "29 May 2026", trust: 0, risk: ["NIN mismatch"], status: "REJECTED", rejectedOn: "30 May 2026" },
];

export interface PropQueueRow {
  id: string;
  title: string;
  agentName: string;
  agentId: string;
  agentTrust: number;
  landlord: string;
  area: string;
  baseRent: number;
  gps: string;
  submitted: string;
  status: "PENDING" | "APPROVED" | "REJECTED";
  risk: string[];
  approvedOn?: string;
}

export const PROP_QUEUE: PropQueueRow[] = [
  { id: "pq1", title: "2 Bed Flat - Bodija", agentName: "Emeka Okafor", agentId: "AGT-8831", agentTrust: 76, landlord: "Chief R. Adeleke · LND-3092", area: "Bodija", baseRent: 500000, gps: "7.42811° N, 3.92340° E", submitted: "3 Jun 2026", status: "PENDING", risk: [] },
  { id: "pq2", title: "3 Bed Duplex - Jericho", agentName: "Seun Falola", agentId: "AGT-5521", agentTrust: 58, landlord: "Mrs. F. Bankole · LND-2210", area: "Jericho", baseRent: 1100000, gps: "7.41223° N, 3.93101° E", submitted: "3 Jun 2026", status: "PENDING", risk: ["Low trust agent"] },
  { id: "pq3", title: "Studio - Akobo", agentName: "Aisha Bello", agentId: "AGT-2210", agentTrust: 88, landlord: "Mr. D. Salami · LND-4401", area: "Akobo", baseRent: 260000, gps: "7.37842° N, 3.89901° E", submitted: "2 Jun 2026", status: "PENDING", risk: [] },
  { id: "pq4", title: "Mini Flat - Ring Road", agentName: "Dele Afolabi", agentId: "AGT-9910", agentTrust: 61, landlord: "Unverified landlord", area: "Ring Rd", baseRent: 340000, gps: "7.39120° N, 3.90441° E", submitted: "2 Jun 2026", status: "PENDING", risk: ["Unverified landlord", "Flagged agent"] },
  { id: "pq5", title: "4 Bed Duplex - Mokola", agentName: "Tunde Adeyemi", agentId: "AGT-4471", agentTrust: 94, landlord: "Chief R. Adeleke · LND-3092", area: "Mokola", baseRent: 1400000, gps: "7.39881° N, 3.91200° E", submitted: "1 Jun 2026", status: "PENDING", risk: [] },
  { id: "pq6", title: "2 Bed Flat - Dugbe", agentName: "Funke Ogunleye", agentId: "AGT-9920", agentTrust: 97, landlord: "Mr. B. Adeyinka · LND-3310", area: "Dugbe", baseRent: 420000, gps: "7.38011° N, 3.89540° E", submitted: "31 May 2026", status: "APPROVED", approvedOn: "1 Jun 2026", risk: [] },
];

export interface InspMonitorRow {
  id: string;
  prop: string;
  agent: string;
  tenant: string;
  date: string;
  time: string;
  status: "COMPLETED" | "SCHEDULED" | "GPS_FAIL";
  gpsOk: boolean | null;
  otpVerified: boolean;
}

export const INSP_MONITOR: InspMonitorRow[] = [
  { id: "im1", prop: "2 Bed Flat - Bodija", agent: "Tunde Adeyemi", tenant: "Bisi Akande", date: "4 Jun 2026", time: "11:30 AM", status: "COMPLETED", gpsOk: true, otpVerified: true },
  { id: "im2", prop: "3 Bed Duplex - Jericho", agent: "Funke Ogunleye", tenant: "Kola Martins", date: "4 Jun 2026", time: "2:00 PM", status: "SCHEDULED", gpsOk: null, otpVerified: false },
  { id: "im3", prop: "Studio - Akobo", agent: "Aisha Bello", tenant: "Ngozi Adeyemi", date: "4 Jun 2026", time: "4:30 PM", status: "SCHEDULED", gpsOk: null, otpVerified: false },
  { id: "im4", prop: "Mini Flat - Ring Road", agent: "Chidi Okonkwo", tenant: "Amara Obi", date: "3 Jun 2026", time: "10:00 AM", status: "COMPLETED", gpsOk: true, otpVerified: true },
  { id: "im5", prop: "3 Bed Flat - Jericho", agent: "Seun Falola", tenant: "Musa Aliyu", date: "3 Jun 2026", time: "1:00 PM", status: "GPS_FAIL", gpsOk: false, otpVerified: false },
  { id: "im6", prop: "Bungalow - Bodija", agent: "Tunde Adeyemi", tenant: "Chidi Nwosu", date: "2 Jun 2026", time: "3:00 PM", status: "COMPLETED", gpsOk: true, otpVerified: true },
];

export const ADMIN_ESCROW: EscrowTransaction[] = [
  { id: "AWA-TX-90412", tenantName: "Bisi Akande", propertyId: "p6", agentName: "Tunde Adeyemi", amount: 1117500, status: "FUNDS_LOCKED", lockedOn: "28 May 2026", paystackRef: "ps_3f9a2c71b" },
  { id: "AWA-TX-88120", tenantName: "Bisi Akande", propertyId: "p4", agentName: "Chidi Okonkwo", landlordName: "Mr. D. Salami", amount: 400200, status: "SETTLED", lockedOn: "02 Apr 2026", settledOn: "09 Apr 2026", paystackRef: "ps_2a71c0e4d", breakdown: calculateRentBreakdown(360000, 9) },
  { id: "AWA-TX-87331", tenantName: "Kola Martins", propertyId: "p3", agentName: "Funke Ogunleye", amount: 1671250, status: "FUNDS_LOCKED", lockedOn: "30 May 2026", paystackRef: "ps_7c3b1f09a" },
  { id: "AWA-TX-86200", tenantName: "Chidi Nwosu", propertyId: "p5", agentName: "Aisha Bello", amount: 720150, status: "DISPUTED", lockedOn: "20 May 2026", paystackRef: "ps_4e8d2a11c" },
  { id: "AWA-TX-85100", tenantName: "Musa Aliyu", propertyId: "p3", agentName: "Seun Falola", amount: 1133000, status: "FROZEN", lockedOn: "10 May 2026", paystackRef: "ps_9a1b3c40d" },
  { id: "AWA-TX-84002", tenantName: "Ngozi Adeyemi", propertyId: "p2", agentName: "Aisha Bello", amount: 301000, status: "REFUNDED", lockedOn: "01 May 2026", refundedOn: "05 May 2026", paystackRef: "ps_6f2e0c87b" },
  { id: "AWA-TX-82900", tenantName: "Dupe Olawale", propertyId: "p1", agentName: "Tunde Adeyemi", amount: 587500, status: "SETTLED", lockedOn: "10 Apr 2026", settledOn: "17 Apr 2026", paystackRef: "ps_1d7a9f22e" },
];

export const DISPUTES: Dispute[] = [
  { id: "dsp1", txnRef: "AWA-TX-86200", propertyName: "2 Bed Flat - Akobo", tenant: "Chidi Nwosu", agent: "Aisha Bello", landlord: "Mr. D. Salami", amount: 720150, reason: "Keys not received after payment", evidenceCount: 2, priority: "HIGH", status: "OPEN", raised: "25 May 2026" },
  { id: "dsp2", txnRef: "AWA-TX-85100", propertyName: "3 Bed Flat - Jericho", tenant: "Musa Aliyu", agent: "Seun Falola", landlord: "Mrs. F. Bankole", amount: 1133000, reason: "Property condition misrepresented", evidenceCount: 4, priority: "HIGH", status: "REVIEWING", raised: "18 May 2026" },
  { id: "dsp3", txnRef: "AWA-TX-83110", propertyName: "Mini Flat - Mokola", tenant: "Dayo Ojo", agent: "Dele Afolabi", landlord: "Unknown", amount: 380500, reason: "Agent demanded cash viewing fee", evidenceCount: 1, priority: "MEDIUM", status: "OPEN", raised: "29 May 2026" },
  { id: "dsp4", txnRef: "AWA-TX-81020", propertyName: "Studio - Dugbe", tenant: "Amina Garba", agent: "Funke Ogunleye", landlord: "Chief Adeleke", amount: 291500, reason: "OTP used twice - possible fraud", evidenceCount: 3, priority: "MEDIUM", status: "REVIEWING", raised: "20 May 2026" },
  { id: "dsp5", txnRef: "AWA-TX-79800", propertyName: "3 Bed Bungalow - Bodija", tenant: "Kemi Adebayo", agent: "Tunde Adeyemi", landlord: "Mr. B. Adeyinka", amount: 1117500, reason: "Landlord refused key handover", evidenceCount: 2, priority: "LOW", status: "RESOLVED", raised: "10 May 2026", resolvedOn: "15 May 2026", resolution: "tenant" },
];

export const REVENUE: RevenueMetric = {
  months: ["Jan", "Feb", "Mar", "Apr", "May", "Jun"],
  gmv: [8400000, 12300000, 9800000, 15200000, 18700000, 22100000],
  fees: [210000, 307500, 245000, 380000, 467500, 552500],
  commissions: [840000, 1230000, 980000, 1520000, 1870000, 2210000],
  subs: [45000, 60000, 75000, 90000, 105000, 120000],
  disputes: [2, 5, 3, 4, 5, 3],
};

export const ADMIN_STATS = {
  totalGMV: 86500000,
  escrowFeeRev: 2162500,
  activeEscrow: 4,
  pendingKYC: 7,
  pendingProps: 5,
  openDisputes: 4,
  dau: 1840,
  verifiedAgents: 38,
};

/* ---------------- Cross-cutting ---------------- */
export const NOTIFICATIONS: AppNotification[] = [
  { id: "n1", kind: "inspection_approved", title: "Inspection approved", body: "Tunde approved your inspection for 2 Bedroom Flat - Bodija. Address unlocked.", time: "2h ago", read: false },
  { id: "n2", kind: "funds_locked", title: "Funds locked in escrow", body: "₦1,102,500 is safely held for 3 Bedroom Bungalow - Bodija.", time: "1d ago", read: false },
  { id: "n3", kind: "inspection_reminder", title: "Inspection reminder", body: "Your inspection for 3 Bedroom Duplex - Jericho is tomorrow at 11:30 AM.", time: "1d ago", read: false },
  { id: "n4", kind: "loyalty_earned", title: "You earned 50 loyalty points", body: "Completed inspection bonus added to your balance.", time: "2d ago", read: true },
  { id: "n5", kind: "payment_success", title: "Payment successful", body: "Your escrow payment was received. Reference ps_3f9a2c71b.", time: "1w ago", read: true },
];

export const LOYALTY: { balance: number; history: LoyaltyTransaction[] } = {
  balance: 320,
  history: [
    { id: "ly1", label: "Completed inspection", points: 50, date: "28 May 2026", kind: "earn" },
    { id: "ly2", label: "Verified NIN", points: 100, date: "12 Feb 2026", kind: "earn" },
    { id: "ly3", label: "Referred a friend", points: 120, date: "20 Mar 2026", kind: "earn" },
    { id: "ly4", label: "Redeemed: priority inspection", points: -80, date: "2 Apr 2026", kind: "redeem" },
    { id: "ly5", label: "On-time rent renewal", points: 130, date: "1 May 2026", kind: "earn" },
  ],
};

export const TRUST_EVENTS: TrustScoreEvent[] = [
  { id: "ts1", label: "Verified NIN", points: 25, date: "12 Feb 2026" },
  { id: "ts2", label: "Completed first inspection", points: 15, date: "20 Feb 2026" },
  { id: "ts3", label: "On-time escrow payment", points: 20, date: "28 May 2026" },
  { id: "ts4", label: "Profile completion", points: 12, date: "13 Feb 2026" },
];

export interface AuditLog {
  id: string;
  actor: string;
  action: string;
  target: string;
  time: string;
  ip: string;
}

export const AUDIT_LOGS: AuditLog[] = [
  { id: "al1", actor: "Admin Obi", action: "Approved KYC", target: "Chioma Eze · LND", time: "1 Jun 2026 · 09:12", ip: "102.89.x.x" },
  { id: "al2", actor: "Admin Obi", action: "Froze escrow", target: "AWA-TX-85100", time: "10 May 2026 · 14:02", ip: "102.89.x.x" },
  { id: "al3", actor: "System", action: "Auto-released funds", target: "AWA-TX-82900", time: "17 Apr 2026 · 00:00", ip: "system" },
  { id: "al4", actor: "Admin Obi", action: "Rejected KYC", target: "Hassan Musa · AGT", time: "30 May 2026 · 16:45", ip: "102.89.x.x" },
  { id: "al5", actor: "Admin Obi", action: "Resolved dispute (tenant refund)", target: "AWA-TX-79800", time: "15 May 2026 · 11:30", ip: "102.89.x.x" },
];

/* Inspection availability defaults (agent settings). */
export const INSPECTION_SETTINGS = {
  enabled: true,
  maxPerDay: 4,
  workingDays: ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat"],
  blockedDates: ["12 Jun 2026"],
};
