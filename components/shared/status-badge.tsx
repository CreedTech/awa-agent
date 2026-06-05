import { cn } from "@/lib/utils";
import {
  ESCROW_BADGE,
  INSPECTION_BADGE,
  PROPERTY_BADGE,
  STATUS_LABELS,
  type BadgeVariant,
} from "@/lib/constants";
import type { EscrowStatus, InspectionStatus, PropertyStatus } from "@/lib/types";

const VARIANT_CLASS: Record<BadgeVariant, string> = {
  ok: "tag-ok",
  lock: "tag-lock",
  warn: "tag-warn",
  danger: "tag-danger",
  gold: "tag-gold",
  navy: "tag-navy",
};

/** Turn an ENUM_STATUS into a readable label. */
export function humanizeStatus(status: string): string {
  return STATUS_LABELS[status] ?? status.replace(/_/g, " ").toLowerCase().replace(/^\w/, (c) => c.toUpperCase());
}

interface StatusBadgeProps {
  variant: BadgeVariant;
  children: React.ReactNode;
  className?: string;
}

export function StatusBadge({ variant, children, className }: StatusBadgeProps) {
  return <span className={cn("tag", VARIANT_CLASS[variant], className)}>{children}</span>;
}

export function EscrowBadge({ status }: { status: EscrowStatus }) {
  return <StatusBadge variant={ESCROW_BADGE[status]}>{humanizeStatus(status)}</StatusBadge>;
}

export function InspectionBadge({ status }: { status: InspectionStatus }) {
  return <StatusBadge variant={INSPECTION_BADGE[status]}>{humanizeStatus(status)}</StatusBadge>;
}

export function PropertyStatusBadge({ status }: { status: PropertyStatus }) {
  return <StatusBadge variant={PROPERTY_BADGE[status]}>{humanizeStatus(status)}</StatusBadge>;
}
