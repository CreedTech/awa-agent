/* ============================================================
   AwaAgent - Domain types
   The single source of truth for every entity in the product.
   Mock services in `services/*` return these shapes so they can be
   swapped for a real API (see `lib/api.ts`) with no UI changes.
   ============================================================ */

export type Role = "guest" | "tenant" | "agent" | "landlord" | "admin";

export type KycStatus = "UNVERIFIED" | "PENDING" | "VERIFIED" | "REJECTED" | "SUSPENDED";

export type PropertyType = "Studio" | "Mini Flat" | "Flat" | "Duplex" | "Bungalow";

/** Lifecycle of a listing from draft to occupied. */
export type PropertyStatus =
  | "DRAFT"
  | "SUBMITTED"
  | "AWAITING_LANDLORD_AUTHORIZATION"
  | "AWAITING_ADMIN_REVIEW"
  | "APPROVED"
  | "REJECTED"
  | "LIVE"
  | "PAUSED"
  | "OCCUPIED"
  | "REMOVED";

export type InspectionStatus =
  | "REQUESTED"
  | "AWAITING_AGENT_CONFIRMATION"
  | "CONFIRMED"
  | "SCHEDULED"
  | "APPROVED" // address unlocked
  | "COMPLETED"
  | "TENANT_CANCELLED"
  | "AGENT_CANCELLED"
  | "RESCHEDULED"
  | "MISSED_BY_TENANT"
  | "MISSED_BY_AGENT"
  | "FAILED_GPS_CHECK"
  | "EXPIRED";

export type EscrowStatus =
  | "PENDING_PAYMENT"
  | "PAYMENT_FAILED"
  | "FUNDS_LOCKED"
  | "INSPECTION_SCHEDULED"
  | "INSPECTION_COMPLETED"
  | "AWAITING_KEY_HANDOVER"
  | "AWAITING_TENANT_CONFIRMATION"
  | "SETTLED"
  | "DISPUTED"
  | "FROZEN"
  | "REFUNDED"
  | "CANCELLED";

export type DisputeStatus = "OPEN" | "REVIEWING" | "RESOLVED";
export type DisputePriority = "HIGH" | "MEDIUM" | "LOW";
export type DisputeResolution = "tenant" | "agent" | "split";

export type AccountStatus = "ACTIVE" | "SUSPENDED" | "BANNED";

export type SubscriptionTier = "BASIC" | "PREMIUM" | "PRIORITY";

export type AgentRole = "PRIMARY" | "AUTHORIZED" | "PENDING";

/* ---------------- Geo ---------------- */
export interface GeoPoint {
  lat: number;
  lng: number;
}

/* ---------------- Users ---------------- */
export interface User {
  id: string;
  name: string;
  role: Role;
  email?: string;
  phone?: string;
  photo?: string;
  kycStatus: KycStatus;
  accountStatus: AccountStatus;
  trustScore?: number;
  joined: string;
  city?: string;
}

/** A login-able account (demo auth). Passwords are plaintext for the
 *  prototype only - a real backend hashes them and never returns them. */
export interface Account {
  id: string;
  name: string;
  email: string;
  phone: string;
  password: string;
  role: Exclude<Role, "guest">;
  kycStatus: KycStatus;
  photo?: string;
}

export interface AgentProfile {
  id: string; // AGT-xxxx
  name: string;
  photo?: string;
  trust: number;
  deals: number;
  since: string;
  commissionPct: number;
  verified: boolean;
  area: string;
  tier?: string;
  ninStatus?: KycStatus;
}

/* ---------------- Rent breakdown ---------------- */
export interface RentBreakdown {
  baseRent: number;
  commission: number;
  commissionPct: number;
  escrowFee: number;
  escrowFeePct: number;
  total: number;
}

/* ---------------- Property ---------------- */
export interface Property {
  id: string;
  title: string;
  type: PropertyType;
  area: string;
  /** Public landmark - always visible. */
  landmark: string;
  /** Hidden until an inspection is APPROVED (address-privacy rule). */
  exactAddress?: string;
  location?: GeoPoint;
  beds: number;
  baths: number;
  baseRent: number;
  agentId: string;
  amenities: string[];
  /** Gallery labels (placeholder fallbacks). */
  imageLabels: string[];
  images: string[];
  description: string;
  views: number;
  bookmarks: number;
  available: boolean;
  nextFree?: string;
  badge: "Verified" | "Premium";
  status: PropertyStatus;
}

/* ---------------- Inspection ---------------- */
export interface Inspection {
  id: string;
  propertyId: string;
  tenantName: string;
  date: string;
  time: string;
  otp: string;
  status: InspectionStatus;
  queuePosition: number;
  gpsOk?: boolean | null;
  otpVerified?: boolean;
  addressUnlocked: boolean;
}

/* ---------------- Escrow ---------------- */
export interface EscrowTransaction {
  id: string; // AWA-TX-xxxxx
  propertyId: string;
  tenantName: string;
  agentName: string;
  landlordName?: string;
  amount: number;
  status: EscrowStatus;
  lockedOn?: string;
  settledOn?: string;
  refundedOn?: string;
  /** Paystack transaction reference (mock). */
  paystackRef: string;
  /** Idempotency guard for escrow initiation. */
  idempotencyKey?: string;
  breakdown?: RentBreakdown;
}

/* ---------------- Dispute ---------------- */
export interface Dispute {
  id: string;
  txnRef: string;
  propertyName: string;
  tenant: string;
  agent: string;
  landlord: string;
  amount: number;
  reason: string;
  evidenceCount: number;
  priority: DisputePriority;
  status: DisputeStatus;
  raised: string;
  resolvedOn?: string;
  resolution?: DisputeResolution;
}

/* ---------------- Commission attribution ---------------- */
export interface AgentCommission {
  txnRef: string;
  propertyName: string;
  listingAgent: { id: string; name: string; sharePct: number };
  inspectionAgent: { id: string; name: string; sharePct: number };
  closingAgent: { id: string; name: string; sharePct: number };
  finalRecipient: { id: string; name: string };
  bonusSplit?: boolean;
  adminOverride?: boolean;
  reason: string;
}

/* ---------------- Landlord ↔ Agent authorization ---------------- */
export interface LandlordAuthorization {
  id: string;
  propertyId: string;
  agentId: string;
  agentName: string;
  trust: number;
  note: string;
  date: string;
  status: "PENDING" | "AUTHORIZED" | "REJECTED";
}

export interface PropertyAgent {
  id: string;
  name: string;
  photo?: string;
  trust: number;
  role: AgentRole;
  status: "AUTHORIZED" | "PENDING" | "REVOKED";
  commission: number;
  since: string;
  deals: number;
}

/* ---------------- KYC ---------------- */
export interface KycRecord {
  id: string;
  name: string;
  role: Exclude<Role, "guest" | "admin">;
  phone: string;
  nin: string;
  submitted: string;
  trust: number;
  risk: string[];
  status: "PENDING" | "APPROVED" | "REJECTED";
  approvedOn?: string;
  rejectedOn?: string;
}

/* ---------------- Notifications ---------------- */
export type NotificationKind =
  | "otp"
  | "inspection_approved"
  | "inspection_reminder"
  | "inspection_rescheduled"
  | "payment_success"
  | "funds_locked"
  | "dispute_opened"
  | "dispute_resolved"
  | "funds_released"
  | "agent_payout"
  | "landlord_payout"
  | "property_approved"
  | "authorization_request"
  | "loyalty_earned"
  | "kyc_update";

export interface AppNotification {
  id: string;
  kind: NotificationKind;
  title: string;
  body: string;
  time: string;
  read: boolean;
}

/* ---------------- Revenue ---------------- */
export interface RevenueMetric {
  months: string[];
  gmv: number[];
  fees: number[];
  commissions: number[];
  subs: number[];
  disputes: number[];
}

/* ---------------- Trust score ---------------- */
export interface TrustScoreEvent {
  id: string;
  label: string;
  points: number;
  date: string;
}

/* ---------------- Loyalty ---------------- */
export interface LoyaltyTransaction {
  id: string;
  label: string;
  points: number;
  date: string;
  kind: "earn" | "redeem";
}
