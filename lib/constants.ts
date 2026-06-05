/* ============================================================
   AwaAgent - Constants & configuration
   Business rules, brand, nav maps, status → badge variants.
   ============================================================ */

import type {
  Role,
  EscrowStatus,
  InspectionStatus,
  PropertyStatus,
  PropertyType,
} from "./types";
import { env } from "./env";

/* ---------------- Money / fees (env-tunable) ---------------- */
export const ESCROW_FEE_PCT = env.escrowFeePct; // first-year service fee
export const RENEWAL_ESCROW_FEE_PCT = env.renewalEscrowFeePct; // year 2+
export const DEFAULT_COMMISSION_PCT = env.defaultCommissionPct;
export const HIGH_TRUST_COMMISSION_PCT = 10;
export const LOW_TRUST_COMMISSION_PCT = 8;
export const CURRENCY = env.currency;

/* ---------------- Inspection rules (env-tunable) ---------------- */
export const DEFAULT_MAX_INSPECTIONS_PER_DAY = env.maxInspectionsPerDay;
export const OTP_RESEND_SECONDS = env.otpResendSeconds;

/* ---------------- Agent upload limits (by trust tier) ---------------- */
export const AGENT_UPLOAD_LIMITS = {
  new: 3,
  verified: 10,
  highTrust: 30,
  suspended: 0,
} as const;

/* ---------------- Geographies ---------------- */
export const NIGERIAN_CITIES = ["Ibadan", "Lagos", "Abuja"] as const;

export const AREAS = [
  "Bodija",
  "Akobo",
  "Jericho",
  "Ring Rd",
  "Mokola",
  "Dugbe",
  "Lekki",
  "Yaba",
  "Wuse",
] as const;

export const PROPERTY_TYPES: PropertyType[] = [
  "Studio",
  "Mini Flat",
  "Flat",
  "Duplex",
  "Bungalow",
];

export const AMENITIES = [
  "Borehole",
  "Pre-paid meter",
  "Security",
  "24/7 Security",
  "Parking",
  "POP Ceiling",
  "Fitted Kitchen",
  "Water Tank",
  "Garden",
  "BQ",
  "Air Conditioning",
] as const;

/* Approx. centre of Ibadan for mock GPS capture. */
export const IBADAN_CENTER = { lat: 7.3775, lng: 3.947 };

/* ---------------- Roles ---------------- */
export const ROLE_LABELS: Record<Role, string> = {
  guest: "Guest",
  tenant: "Tenant",
  agent: "Agent",
  landlord: "Landlord",
  admin: "Admin",
};

export const ROLE_HOME: Record<Exclude<Role, "guest">, string> = {
  tenant: "/tenant/dashboard",
  agent: "/agent/dashboard",
  landlord: "/landlord/dashboard",
  admin: "/admin/dashboard",
};

export interface RoleCard {
  role: Exclude<Role, "guest">;
  icon: string;
  tagline: string;
  bullets: string[];
}

export const ROLE_CARDS: RoleCard[] = [
  {
    role: "tenant",
    icon: "home",
    tagline: "Find & rent safely",
    bullets: [
      "Escrow-protected payments",
      "Book verified inspections",
      "No illegal viewing fees",
    ],
  },
  {
    role: "agent",
    icon: "user",
    tagline: "List & earn fairly",
    bullets: [
      "Verified-contribution payouts",
      "In-person OTP inspections",
      "Impression earnings",
    ],
  },
  {
    role: "landlord",
    icon: "building",
    tagline: "Control your portfolio",
    bullets: ["Authorize your agents", "Rent ledger & payouts", "Property performance"],
  },
  {
    role: "admin",
    icon: "shield",
    tagline: "Secure operations console",
    bullets: ["KYC & fraud control", "Escrow & dispute ops", "Revenue oversight"],
  },
];

/* ---------------- Status → badge variant ---------------- */
export type BadgeVariant = "ok" | "lock" | "warn" | "danger" | "gold" | "navy";

export const ESCROW_BADGE: Record<EscrowStatus, BadgeVariant> = {
  PENDING_PAYMENT: "warn",
  PAYMENT_FAILED: "danger",
  FUNDS_LOCKED: "gold",
  INSPECTION_SCHEDULED: "navy",
  INSPECTION_COMPLETED: "navy",
  AWAITING_KEY_HANDOVER: "warn",
  AWAITING_TENANT_CONFIRMATION: "warn",
  SETTLED: "ok",
  DISPUTED: "danger",
  FROZEN: "danger",
  REFUNDED: "navy",
  CANCELLED: "navy",
};

export const INSPECTION_BADGE: Record<InspectionStatus, BadgeVariant> = {
  REQUESTED: "navy",
  AWAITING_AGENT_CONFIRMATION: "warn",
  CONFIRMED: "navy",
  SCHEDULED: "navy",
  APPROVED: "lock",
  COMPLETED: "ok",
  TENANT_CANCELLED: "danger",
  AGENT_CANCELLED: "danger",
  RESCHEDULED: "warn",
  MISSED_BY_TENANT: "danger",
  MISSED_BY_AGENT: "danger",
  FAILED_GPS_CHECK: "danger",
  EXPIRED: "warn",
};

export const PROPERTY_BADGE: Record<PropertyStatus, BadgeVariant> = {
  DRAFT: "navy",
  SUBMITTED: "navy",
  AWAITING_LANDLORD_AUTHORIZATION: "warn",
  AWAITING_ADMIN_REVIEW: "warn",
  APPROVED: "ok",
  REJECTED: "danger",
  LIVE: "ok",
  PAUSED: "warn",
  OCCUPIED: "lock",
  REMOVED: "danger",
};

/** Human-friendly labels for the longer enum statuses. */
export const STATUS_LABELS: Record<string, string> = {
  AWAITING_LANDLORD_AUTHORIZATION: "Awaiting landlord",
  AWAITING_ADMIN_REVIEW: "Awaiting review",
  FUNDS_LOCKED: "Funds locked",
  PENDING_PAYMENT: "Pending payment",
  PAYMENT_FAILED: "Payment failed",
  AWAITING_TENANT_CONFIRMATION: "Awaiting confirmation",
  AWAITING_KEY_HANDOVER: "Awaiting keys",
  INSPECTION_COMPLETED: "Inspection done",
};

/* ---------------- Navigation maps ---------------- */
export interface NavItem {
  label: string;
  href: string;
  icon: string;
  /** Optional badge count key for dashboards. */
  badgeKey?: string;
}

export const PUBLIC_NAV: NavItem[] = [
  { label: "Explore", href: "/explore", icon: "explore" },
  { label: "How it works", href: "/how-it-works", icon: "info" },
  { label: "Pricing", href: "/pricing", icon: "cash" },
  { label: "Trust & Safety", href: "/trust-safety", icon: "shield" },
];

export const TENANT_NAV: NavItem[] = [
  { label: "Explore", href: "/explore", icon: "explore" },
  { label: "Inspections", href: "/tenant/inspections", icon: "calendar" },
  { label: "Wallet", href: "/tenant/escrow", icon: "wallet" },
  { label: "Saved", href: "/tenant/saved", icon: "bookmark" },
  { label: "Account", href: "/tenant/profile", icon: "user" },
];

export const TENANT_MENU: NavItem[] = [
  { label: "Dashboard", href: "/tenant/dashboard", icon: "grid" },
  { label: "Loyalty", href: "/tenant/loyalty", icon: "gift" },
  { label: "Subscription", href: "/tenant/subscription", icon: "crown" },
  { label: "Receipts", href: "/tenant/receipts", icon: "receipt" },
  { label: "Disputes", href: "/tenant/disputes", icon: "alert" },
];

export const AGENT_NAV: NavItem[] = [
  { label: "Dashboard", href: "/agent/dashboard", icon: "grid" },
  { label: "Properties", href: "/agent/properties", icon: "building" },
  { label: "Inspections", href: "/agent/inspections", icon: "calendar" },
  { label: "Earnings", href: "/agent/earnings", icon: "wallet" },
  { label: "Commissions", href: "/agent/commissions", icon: "coins" },
  { label: "Authorizations", href: "/agent/landlord-authorizations", icon: "shieldCheck" },
  { label: "Settings", href: "/agent/inspection-settings", icon: "settings" },
  { label: "KYC", href: "/agent/kyc", icon: "shield" },
  { label: "Profile", href: "/agent/profile", icon: "user" },
];

export const LANDLORD_NAV: NavItem[] = [
  { label: "Overview", href: "/landlord/dashboard", icon: "grid" },
  { label: "Properties", href: "/landlord/properties", icon: "building" },
  { label: "Agent Matrix", href: "/landlord/agent-matrix", icon: "users", badgeKey: "requests" },
  { label: "Agents", href: "/landlord/agents", icon: "user" },
  { label: "Rent Ledger", href: "/landlord/rent-ledger", icon: "receipt" },
  { label: "Payouts", href: "/landlord/payouts", icon: "wallet" },
  { label: "Inspections", href: "/landlord/inspections", icon: "calendar" },
  { label: "Disputes", href: "/landlord/disputes", icon: "alert" },
  { label: "KYC", href: "/landlord/kyc", icon: "shield" },
  { label: "Profile", href: "/landlord/profile", icon: "settings" },
];

export const ADMIN_NAV: NavItem[] = [
  { label: "Overview", href: "/admin/dashboard", icon: "grid" },
  { label: "Users", href: "/admin/users", icon: "users" },
  { label: "KYC Queue", href: "/admin/kyc", icon: "shieldCheck", badgeKey: "kyc" },
  { label: "Properties", href: "/admin/properties", icon: "building", badgeKey: "props" },
  { label: "Inspections", href: "/admin/inspections", icon: "calendar" },
  { label: "Escrow", href: "/admin/escrow", icon: "lock" },
  { label: "Disputes", href: "/admin/disputes", icon: "alert", badgeKey: "disputes" },
  { label: "Revenue", href: "/admin/revenue", icon: "analytics" },
  { label: "Commissions", href: "/admin/commissions", icon: "coins" },
  { label: "Trust Scores", href: "/admin/trust-scores", icon: "star" },
  { label: "Audit Logs", href: "/admin/audit-logs", icon: "logs" },
  { label: "Settings", href: "/admin/settings", icon: "settings" },
];
