"use client";

import { StatCard } from "@/components/shared/stat-card";
import { BarSeriesChart, LineSeriesChart } from "@/components/charts/mini-charts";
import { REVENUE, ADMIN_STATS } from "@/lib/mock-data";
import { formatCompactCurrency } from "@/lib/utils";

export default function AdminRevenuePage() {
  const totalCommission = REVENUE.commissions.reduce((n, c) => n + c, 0);
  const totalSubs = REVENUE.subs.reduce((n, s) => n + s, 0);

  return (
    <>
      <div className="stats-grid">
        <StatCard label="GMV (all-time)" value={formatCompactCurrency(ADMIN_STATS.totalGMV)} icon="trend" trend={{ value: "+18%", up: true }} />
        <StatCard label="Escrow fee revenue" value={formatCompactCurrency(ADMIN_STATS.escrowFeeRev)} icon="coins" />
        <StatCard label="Agent commissions" value={formatCompactCurrency(totalCommission)} icon="users" />
        <StatCard label="Subscription MRR" value={formatCompactCurrency(REVENUE.subs[REVENUE.subs.length - 1])} icon="crown" />
      </div>

      <div className="card card-pad" style={{ marginBottom: 20 }}>
        <h3 style={{ fontSize: 16, marginBottom: 6 }}>GMV by month</h3>
        <BarSeriesChart data={REVENUE.months.map((m, i) => ({ label: m, value: REVENUE.gmv[i] }))} money height={260} />
      </div>

      <div className="two-col even">
        <div className="card card-pad">
          <h3 style={{ fontSize: 16, marginBottom: 6 }}>Escrow fee revenue</h3>
          <LineSeriesChart data={REVENUE.months.map((m, i) => ({ label: m, value: REVENUE.fees[i] }))} money height={140} color="#d4af37" />
        </div>
        <div className="card card-pad">
          <h3 style={{ fontSize: 16, marginBottom: 6 }}>Disputes / month</h3>
          <LineSeriesChart data={REVENUE.months.map((m, i) => ({ label: m, value: REVENUE.disputes[i] }))} height={140} color="#bb3326" />
        </div>
      </div>

      <div className="card card-pad row between wrap gap-3" style={{ marginTop: 16 }}>
        <div className="col" style={{ gap: 2 }}><span style={{ fontSize: 13, color: "var(--muted)" }}>Subscription revenue (6mo)</span><strong style={{ fontFamily: "var(--font-display)", fontSize: 22 }}>{formatCompactCurrency(totalSubs)}</strong></div>
        <div className="col" style={{ gap: 2 }}><span style={{ fontSize: 13, color: "var(--muted)" }}>Verified agents</span><strong style={{ fontFamily: "var(--font-display)", fontSize: 22 }}>{ADMIN_STATS.verifiedAgents}</strong></div>
        <div className="col" style={{ gap: 2 }}><span style={{ fontSize: 13, color: "var(--muted)" }}>Daily active users</span><strong style={{ fontFamily: "var(--font-display)", fontSize: 22 }}>{ADMIN_STATS.dau.toLocaleString()}</strong></div>
      </div>
    </>
  );
}
