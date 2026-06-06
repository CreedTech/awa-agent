"use client";

import { StatusBadge } from "@/components/shared/status-badge";
import { Naira } from "@/components/shared/naira";
import { Icon } from "@/components/ui/icon";
import { EmptyState } from "@/components/shared/empty-state";
import { useAppStore } from "@/store/app-store";
import { useShallow } from "zustand/react/shallow";
import type { BadgeVariant } from "@/lib/constants";

const PRIORITY: Record<string, BadgeVariant> = { HIGH: "danger", MEDIUM: "warn", LOW: "navy" };
const STATUS: Record<string, BadgeVariant> = { OPEN: "warn", REVIEWING: "navy", RESOLVED: "ok" };

export default function LandlordDisputesPage() {
  // Disputes touching this landlord's portfolio.
  const disputes = useAppStore(useShallow((s) => s.disputes.filter((d) => d.landlord.includes("Adeleke") || d.landlord.includes("Adeyinka"))));

  return (
    <>
      <p style={{ color: "var(--muted)", fontSize: 14.5, marginBottom: 18 }}>
        Disputes raised on your properties. Our team mediates and you&apos;ll be notified of any resolution.
      </p>
      {disputes.length === 0 ? (
        <EmptyState icon="shieldCheck" title="No disputes" description="None of your properties have an open dispute. Nice and clean." />
      ) : (
        <div className="col gap-3" style={{ maxWidth: 720 }}>
          {disputes.map((d) => (
            <div key={d.id} className="card card-pad col gap-3">
              <div className="row between wrap gap-2">
                <strong style={{ fontSize: 15 }}>{d.propertyName}</strong>
                <div className="row gap-2"><StatusBadge variant={PRIORITY[d.priority]}>{d.priority}</StatusBadge><StatusBadge variant={STATUS[d.status]}>{d.status}</StatusBadge></div>
              </div>
              <p style={{ fontSize: 14, color: "var(--ink-2)" }}>{d.reason}</p>
              <div className="row between" style={{ fontSize: 13, color: "var(--muted)" }}>
                <span>Tenant: {d.tenant} · Agent: {d.agent}</span>
                <span className="row gap-2"><Icon name="lock" size={14} /> <Naira value={d.amount} size={13.5} /></span>
              </div>
            </div>
          ))}
        </div>
      )}
    </>
  );
}
