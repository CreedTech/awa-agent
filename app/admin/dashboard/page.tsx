"use client";

import Link from "next/link";
import { StatCard } from "@/components/shared/stat-card";
import { Naira } from "@/components/shared/naira";
import { StatusBadge } from "@/components/shared/status-badge";
import { BarSeriesChart, LineSeriesChart } from "@/components/charts/mini-charts";
import { Icon } from "@/components/ui/icon";
import { useAppStore } from "@/store/app-store";
import { useShallow } from "zustand/react/shallow";
import { ADMIN_STATS, REVENUE } from "@/lib/mock-data";
import { formatCompactCurrency } from "@/lib/utils";

export default function AdminDashboardPage() {
  const pendingKyc = useAppStore(useShallow((s) => s.kycQueue.filter((k) => k.status === "PENDING")));
  const openDisputes = useAppStore(useShallow((s) => s.disputes.filter((d) => d.status !== "RESOLVED")));
  const pendingProps = useAppStore((s) => s.propQueue.filter((p) => p.status === "PENDING").length);
  const activeEscrow = useAppStore((s) => s.escrow.filter((e) => ["FUNDS_LOCKED", "FROZEN", "DISPUTED"].includes(e.status)).length);

  return (
    <>
      <div className="stats-grid">
        <StatCard label="GMV (all-time)" value={formatCompactCurrency(ADMIN_STATS.totalGMV)} icon="trend" trend={{ value: "+18%", up: true }} />
        <StatCard label="Escrow fee revenue" value={formatCompactCurrency(ADMIN_STATS.escrowFeeRev)} icon="coins" />
        <StatCard label="Active escrow" value={activeEscrow} icon="lock" />
        <StatCard label="Pending KYC" value={pendingKyc.length} icon="shieldCheck" />
        <StatCard label="Pending properties" value={pendingProps} icon="building" />
        <StatCard label="Open disputes" value={openDisputes.length} icon="alert" />
      </div>

      <div className="two-col">
        <div className="card card-pad">
          <h3 style={{ fontSize: 16, marginBottom: 6 }}>GMV by month</h3>
          <BarSeriesChart data={REVENUE.months.map((m, i) => ({ label: m, value: REVENUE.gmv[i] }))} money height={240} />
        </div>
        <div className="card card-pad">
          <h3 style={{ fontSize: 16, marginBottom: 6 }}>Escrow fee revenue</h3>
          <LineSeriesChart data={REVENUE.months.map((m, i) => ({ label: m, value: REVENUE.fees[i] }))} money height={120} />
          <div className="row between" style={{ marginTop: 10 }}>
            <span style={{ fontSize: 13, color: "var(--muted)" }}>Daily active users</span>
            <strong>{ADMIN_STATS.dau.toLocaleString()}</strong>
          </div>
        </div>
      </div>

      <div className="two-col">
        <div className="card card-pad">
          <div className="row between" style={{ marginBottom: 12 }}>
            <h3 style={{ fontSize: 16 }}>KYC queue</h3>
            <Link href="/admin/kyc" style={{ fontSize: 13, color: "var(--navy-700)", fontWeight: 600 }}>Review all</Link>
          </div>
          <div className="col gap-2">
            {pendingKyc.slice(0, 4).map((k) => (
              <div key={k.id} className="row between" style={{ fontSize: 13.5 }}>
                <span>{k.name} · <span style={{ color: "var(--muted)" }}>{k.role}</span></span>
                {k.risk.length > 0 ? <StatusBadge variant="danger">{k.risk[0]}</StatusBadge> : <StatusBadge variant="navy">Clean</StatusBadge>}
              </div>
            ))}
          </div>
        </div>

        <div className="card card-pad">
          <div className="row between" style={{ marginBottom: 12 }}>
            <h3 style={{ fontSize: 16 }}>Open disputes</h3>
            <Link href="/admin/disputes" style={{ fontSize: 13, color: "var(--navy-700)", fontWeight: 600 }}>Resolve</Link>
          </div>
          <div className="col gap-2">
            {openDisputes.slice(0, 4).map((d) => (
              <div key={d.id} className="row between" style={{ fontSize: 13.5 }}>
                <span className="row gap-2"><Icon name="alert" size={14} color="var(--danger)" /> {d.propertyName}</span>
                <Naira value={d.amount} size={13} />
              </div>
            ))}
          </div>
        </div>
      </div>
    </>
  );
}
