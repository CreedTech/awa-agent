"use client";

import Link from "next/link";
import { Icon } from "@/components/ui/icon";
import { StatCard } from "@/components/shared/stat-card";
import { PropImage } from "@/components/shared/prop-image";
import { Naira } from "@/components/shared/naira";
import { StatusBadge } from "@/components/shared/status-badge";
import { BarSeriesChart } from "@/components/charts/mini-charts";
import { useAppStore } from "@/store/app-store";
import { useShallow } from "zustand/react/shallow";
import { AGENT_LISTINGS, AGENT_EARNINGS, IMPRESSIONS, SCAN_QUEUE, AGENT_ME, propertyById } from "@/lib/mock-data";
import { formatCurrency } from "@/lib/utils";

const LISTING_STATUS = {
  ACTIVE: { v: "ok", label: "Live" },
  BOOKED: { v: "lock", label: "Booked" },
  PENDING_AUTH: { v: "warn", label: "Awaiting landlord" },
  PENDING_ADMIN: { v: "warn", label: "Awaiting review" },
  OCCUPIED: { v: "lock", label: "Occupied" },
  PAUSED: { v: "navy", label: "Paused" },
} as const;

export default function AgentDashboardPage() {
  const added = useAppStore(useShallow((s) => s.properties.filter((p) => p.agentId === AGENT_ME.id && p.id.startsWith("p-"))));
  const todays = SCAN_QUEUE.filter((q) => q.time.startsWith("Today")).length;
  const pendingAuth = AGENT_LISTINGS.filter((l) => l.status === "PENDING_AUTH").length + added.length;

  return (
    <>
      <div className="stats-grid">
        <StatCard label="Active listings" value={AGENT_LISTINGS.filter((l) => l.status === "ACTIVE").length} icon="building" />
        <StatCard label="Pending approvals" value={pendingAuth} icon="clock" />
        <StatCard label="Today's inspections" value={todays} icon="calendar" />
        <StatCard label="Completed deals" value={AGENT_ME.deals} icon="check" />
        <StatCard label="Pending earnings" value={formatCurrency(AGENT_EARNINGS.pendingSplit)} icon="wallet" hint="In escrow" />
        <StatCard label="Trust score" value={`${AGENT_ME.trust}/100`} icon="shieldCheck" />
      </div>

      <div className="two-col">
        <div className="card card-pad">
          <div className="row between" style={{ marginBottom: 14 }}>
            <h3 style={{ fontSize: 17 }}>Your portfolio</h3>
            <Link href="/agent/properties" style={{ fontSize: 13, color: "var(--navy-700)", fontWeight: 600 }}>Manage</Link>
          </div>
          <div className="col gap-3">
            {AGENT_LISTINGS.map((l) => {
              const prop = propertyById(l.propertyId);
              const st = LISTING_STATUS[l.status];
              return (
                <div key={l.propertyId} className="row gap-3" style={{ padding: 10, borderRadius: 12, border: "1px solid var(--line)" }}>
                  <PropImage src={prop?.images[0]} label={prop?.imageLabels[0]} className="h-14 w-16 rounded-[10px]" sizes="64px" />
                  <div className="col grow" style={{ gap: 3 }}>
                    <strong style={{ fontSize: 14 }}>{prop?.title}</strong>
                    <span style={{ fontSize: 12, color: "var(--muted)" }}>{l.views} views · {l.inspections} inspections</span>
                  </div>
                  <StatusBadge variant={st.v}>{st.label}</StatusBadge>
                </div>
              );
            })}
          </div>
        </div>

        <div className="card card-pad">
          <div className="row between" style={{ marginBottom: 6 }}>
            <h3 style={{ fontSize: 17 }}>Impression earnings</h3>
            <Link href="/agent/earnings" style={{ fontSize: 13, color: "var(--navy-700)", fontWeight: 600 }}>Wallet</Link>
          </div>
          <span style={{ fontSize: 12.5, color: "var(--muted)" }}>Points earned this week · ₦{IMPRESSIONS.rate}/pt</span>
          <BarSeriesChart data={IMPRESSIONS.week.map((w) => ({ label: w.d, value: w.pts }))} height={180} color="#d4af37" />
          <div className="row between" style={{ marginTop: 8 }}>
            <span style={{ fontSize: 13.5, color: "var(--muted)" }}>{IMPRESSIONS.monthPoints} points this month</span>
            <Naira value={IMPRESSIONS.monthPoints * IMPRESSIONS.rate} size={16} color="var(--gold-700)" />
          </div>
        </div>
      </div>

      <div className="row wrap gap-3" style={{ marginTop: 20 }}>
        <Link href="/agent/properties/new" className="btn btn-primary btn-sm"><Icon name="plus" size={16} /> Add property</Link>
        <Link href="/agent/inspections" className="btn btn-ghost btn-sm"><Icon name="calendar" size={16} /> Inspection queue</Link>
        <Link href="/agent/earnings" className="btn btn-ghost btn-sm"><Icon name="wallet" size={16} /> Earnings</Link>
        <Link href="/agent/kyc" className="btn btn-ghost btn-sm"><Icon name="shield" size={16} /> KYC status</Link>
      </div>
    </>
  );
}
