"use client";

import Link from "next/link";
import { Icon } from "@/components/ui/icon";
import { StatCard } from "@/components/shared/stat-card";
import { TrustBadge } from "@/components/shared/trust-badge";
import { Naira } from "@/components/shared/naira";
import { InspectionBadge, EscrowBadge } from "@/components/shared/status-badge";
import { PropImage } from "@/components/shared/prop-image";
import { useAppStore } from "@/store/app-store";
import { useShallow } from "zustand/react/shallow";
import { TENANT_ME, LOYALTY, propertyById } from "@/lib/mock-data";
import { formatCurrency } from "@/lib/utils";

const TENANT = "Bisi Akande";

export default function TenantDashboardPage() {
  const inspections = useAppStore(useShallow((s) => s.inspections.filter((i) => i.tenantName === TENANT)));
  const escrow = useAppStore(useShallow((s) => s.escrow.filter((e) => e.tenantName === TENANT)));
  const savedCount = useAppStore((s) => s.savedIds.length);

  const upcoming = inspections.filter((i) => !["COMPLETED", "EXPIRED", "TENANT_CANCELLED"].includes(i.status));
  const locked = escrow.filter((e) => e.status === "FUNDS_LOCKED").reduce((n, e) => n + e.amount, 0);

  return (
    <div className="page">
      <div className="page-head row between wrap gap-3">
        <div className="col gap-2">
          <h1 className="page-title">Welcome back, {TENANT_ME.name.split(" ")[0]}</h1>
          <p className="page-sub">Here&apos;s what&apos;s happening with your rentals.</p>
        </div>
        <div className="row gap-3">
          <TrustBadge score={TENANT_ME.trustScore ?? 0} />
          <Link href="/explore" className="btn btn-primary btn-sm"><Icon name="explore" size={16} /> Explore</Link>
        </div>
      </div>

      <div className="stats-grid">
        <StatCard label="Upcoming inspections" value={upcoming.length} icon="calendar" hint="View schedule" />
        <StatCard label="Locked in escrow" value={formatCurrency(locked)} icon="lock" hint="Protected funds" />
        <StatCard label="Saved homes" value={savedCount} icon="bookmark" />
        <StatCard label="Loyalty points" value={LOYALTY.balance} icon="gift" hint="Redeem for perks" />
      </div>

      <div className="two-col">
        {/* Upcoming inspections */}
        <div className="card card-pad">
          <div className="row between" style={{ marginBottom: 14 }}>
            <h3 style={{ fontSize: 17 }}>Upcoming inspections</h3>
            <Link href="/tenant/inspections" style={{ fontSize: 13, color: "var(--navy-700)", fontWeight: 600 }}>View all</Link>
          </div>
          {upcoming.length === 0 ? (
            <p style={{ color: "var(--muted)", fontSize: 14 }}>No inspections booked yet. <Link href="/explore" style={{ color: "var(--navy-700)", fontWeight: 600 }}>Find a home →</Link></p>
          ) : (
            <div className="col gap-3">
              {upcoming.map((i) => {
                const prop = propertyById(i.propertyId);
                return (
                  <Link key={i.id} href={`/tenant/inspections/${i.id}`} className="row gap-3" style={{ padding: 10, borderRadius: 12, border: "1px solid var(--line)" }}>
                    <PropImage src={prop?.images[0]} label={prop?.imageLabels[0]} className="h-14 w-16 rounded-[10px]" sizes="64px" />
                    <div className="col grow" style={{ gap: 3 }}>
                      <strong style={{ fontSize: 14 }}>{prop?.title}</strong>
                      <span style={{ fontSize: 12.5, color: "var(--muted)" }}>{i.date} · {i.time}</span>
                    </div>
                    <InspectionBadge status={i.status} />
                  </Link>
                );
              })}
            </div>
          )}
        </div>

        {/* Escrow wallet preview */}
        <div className="card card-pad">
          <div className="row between" style={{ marginBottom: 14 }}>
            <h3 style={{ fontSize: 17 }}>Escrow wallet</h3>
            <Link href="/tenant/escrow" style={{ fontSize: 13, color: "var(--navy-700)", fontWeight: 600 }}>Open</Link>
          </div>
          <div className="col gap-3">
            {escrow.slice(0, 3).map((e) => {
              const prop = propertyById(e.propertyId);
              return (
                <Link key={e.id} href={`/tenant/escrow/${e.id}`} className="row between" style={{ padding: 12, borderRadius: 12, background: "var(--paper)" }}>
                  <div className="col" style={{ gap: 2 }}>
                    <strong style={{ fontSize: 13.5 }}>{prop?.title ?? e.id}</strong>
                    <Naira value={e.amount} size={15} />
                  </div>
                  <EscrowBadge status={e.status} />
                </Link>
              );
            })}
          </div>
        </div>
      </div>

      <div className="row wrap gap-3" style={{ marginTop: 20 }}>
        <Link href="/tenant/saved" className="btn btn-ghost btn-sm"><Icon name="bookmark" size={16} /> Saved homes</Link>
        <Link href="/tenant/loyalty" className="btn btn-ghost btn-sm"><Icon name="gift" size={16} /> Loyalty</Link>
        <Link href="/tenant/subscription" className="btn btn-ghost btn-sm"><Icon name="crown" size={16} /> Subscription</Link>
        <Link href="/tenant/receipts" className="btn btn-ghost btn-sm"><Icon name="receipt" size={16} /> Receipts</Link>
        <Link href="/tenant/disputes" className="btn btn-ghost btn-sm"><Icon name="alert" size={16} /> Disputes</Link>
      </div>
    </div>
  );
}
