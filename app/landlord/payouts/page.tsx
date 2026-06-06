"use client";

import { Naira } from "@/components/shared/naira";
import { StatCard } from "@/components/shared/stat-card";
import { StatusBadge } from "@/components/shared/status-badge";
import { Icon } from "@/components/ui/icon";
import { PAYOUT_HISTORY } from "@/lib/mock-data";

export default function PayoutsPage() {
  const gross = PAYOUT_HISTORY.reduce((n, p) => n + p.gross, 0);
  const fees = PAYOUT_HISTORY.reduce((n, p) => n + p.fee, 0);
  const net = PAYOUT_HISTORY.reduce((n, p) => n + p.net, 0);

  return (
    <>
      <div className="stats-grid">
        <StatCard label="Gross collected" value={<Naira value={gross} size={22} />} icon="cash" />
        <StatCard label="Escrow fees" value={<Naira value={fees} size={22} />} icon="lock" />
        <StatCard label="Net to you" value={<Naira value={net} size={22} />} icon="wallet" />
      </div>

      <div className="table-wrap">
        <table className="data-table">
          <thead>
            <tr><th>Property</th><th>Tenant</th><th>Gross</th><th>− Commission</th><th>− Escrow fee</th><th>Net payout</th><th>Date</th><th>Status</th></tr>
          </thead>
          <tbody>
            {PAYOUT_HISTORY.map((p) => (
              <tr key={p.id}>
                <td><strong style={{ fontSize: 13 }}>{p.prop}</strong></td>
                <td>{p.tenant}</td>
                <td><Naira value={p.gross} size={13.5} /></td>
                <td style={{ color: "var(--danger)" }}>−<Naira value={p.commission} size={13} color="var(--danger)" /></td>
                <td style={{ color: "var(--danger)" }}>−<Naira value={p.fee} size={13} color="var(--danger)" /></td>
                <td><Naira value={p.net} size={14} color="var(--ok)" /></td>
                <td style={{ color: "var(--muted)" }}>{p.date}</td>
                <td><StatusBadge variant="ok">{p.status}</StatusBadge></td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="card card-pad row gap-2" style={{ marginTop: 14, background: "var(--navy-050)", border: "none", fontSize: 13, color: "var(--navy-700)" }}>
        <Icon name="info" size={16} /> Year-2 renewals pay base rent only — no agent commission is deducted.
      </div>
    </>
  );
}
