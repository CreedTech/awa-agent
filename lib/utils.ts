import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";
import {
  CURRENCY,
  ESCROW_FEE_PCT,
  RENEWAL_ESCROW_FEE_PCT,
  HIGH_TRUST_COMMISSION_PCT,
  DEFAULT_COMMISSION_PCT,
  LOW_TRUST_COMMISSION_PCT,
  DEFAULT_MAX_INSPECTIONS_PER_DAY,
} from "./constants";
import type { RentBreakdown } from "./types";

/** Tailwind-aware className merge (shadcn convention). */
export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

/* ---------------- Money ---------------- */

/** Format a Naira amount, e.g. 1117500 → "₦1,117,500". */
export function formatCurrency(value: number): string {
  return CURRENCY + Math.round(value).toLocaleString("en-NG");
}

/** Compact format for charts/stats, e.g. 22100000 → "₦22.1M". */
export function formatCompactCurrency(value: number): string {
  if (value >= 1_000_000) return `${CURRENCY}${(value / 1_000_000).toFixed(1)}M`;
  if (value >= 1_000) return `${CURRENCY}${(value / 1_000).toFixed(0)}k`;
  return formatCurrency(value);
}

/**
 * First-year premium breakdown.
 * Year 1: baseRent + commission(%) + escrow fee (2.5%).
 * Year 2+: baseRent only, no commission, reduced escrow fee (1%).
 */
export function calculateRentBreakdown(
  baseRent: number,
  commissionPct = DEFAULT_COMMISSION_PCT,
  renewal = false,
): RentBreakdown {
  if (renewal) {
    const escrowFeePct = RENEWAL_ESCROW_FEE_PCT;
    const escrowFee = Math.round(baseRent * (escrowFeePct / 100));
    return {
      baseRent,
      commission: 0,
      commissionPct: 0,
      escrowFee,
      escrowFeePct,
      total: baseRent + escrowFee,
    };
  }
  const commission = Math.round(baseRent * (commissionPct / 100));
  const escrowFee = Math.round(baseRent * (ESCROW_FEE_PCT / 100));
  return {
    baseRent,
    commission,
    commissionPct,
    escrowFee,
    escrowFeePct: ESCROW_FEE_PCT,
    total: baseRent + commission + escrowFee,
  };
}

/** Commission a tenant-bringing agent earns on a base rent. */
export function calculateAgentCommission(baseRent: number, trustScore: number): number {
  const pct = commissionPctForTrust(trustScore);
  return Math.round(baseRent * (pct / 100));
}

/** Trust score → commission rate (higher trust earns more). */
export function commissionPctForTrust(trustScore: number): number {
  if (trustScore >= 90) return HIGH_TRUST_COMMISSION_PCT;
  if (trustScore >= 75) return DEFAULT_COMMISSION_PCT;
  return LOW_TRUST_COMMISSION_PCT;
}

/* ---------------- Trust ---------------- */
export interface TrustBadge {
  label: string;
  variant: "ok" | "warn" | "danger" | "gold";
}

export function getTrustBadge(score: number): TrustBadge {
  if (score >= 90) return { label: "Top rated", variant: "gold" };
  if (score >= 75) return { label: "Trusted", variant: "ok" };
  if (score >= 50) return { label: "Building", variant: "warn" };
  return { label: "New", variant: "danger" };
}

/* ---------------- Dates ---------------- */
export function formatDate(date: Date | string): string {
  const d = typeof date === "string" ? new Date(date) : date;
  if (Number.isNaN(d.getTime())) return typeof date === "string" ? date : "";
  return d.toLocaleDateString("en-NG", {
    day: "numeric",
    month: "short",
    year: "numeric",
  });
}

/* ---------------- Inspections ---------------- */

/** 6-digit inspection OTP, grouped "408 152". */
export function generateInspectionOtp(): string {
  const n = Math.floor(100000 + Math.random() * 900000).toString();
  return `${n.slice(0, 3)} ${n.slice(3)}`;
}

/** Queue position when a slot already has bookings. */
export function calculateQueuePosition(
  existingBookings: number,
  maxPerSlot = DEFAULT_MAX_INSPECTIONS_PER_DAY,
): number {
  return existingBookings >= maxPerSlot ? existingBookings - maxPerSlot + 1 : 0;
}

/* ---------------- Misc ---------------- */
export function initials(name: string): string {
  return name
    .split(" ")
    .map((w) => w[0])
    .slice(0, 2)
    .join("")
    .toUpperCase();
}

/** Idempotency key for escrow initiation (prevents double-charge). */
export function makeIdempotencyKey(prefix = "esc"): string {
  return `${prefix}_${Date.now().toString(36)}_${Math.random().toString(36).slice(2, 8)}`;
}

/** Mock Paystack reference. */
export function makePaystackRef(): string {
  return `ps_${Math.random().toString(36).slice(2, 11)}`;
}

/** Mock transaction id, e.g. AWA-TX-90412. */
export function makeTxnId(): string {
  return `AWA-TX-${Math.floor(80000 + Math.random() * 19999)}`;
}

/** Simulate async network latency for the mock service layer. */
export function delay<T>(value: T, ms = 450): Promise<T> {
  return new Promise((resolve) => setTimeout(() => resolve(value), ms));
}
