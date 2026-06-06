"use client";

import { useState } from "react";
import { Naira } from "@/components/shared/naira";
import { StatCard } from "@/components/shared/stat-card";
import { StatusBadge } from "@/components/shared/status-badge";
import { Icon } from "@/components/ui/icon";
import { RENT_LEDGER } from "@/lib/mock-data";
import { cn } from "@/lib/utils";
import { downloadCsv } from "@/lib/download";
import { toast } from "sonner";
import type { BadgeVariant } from "@/lib/constants";

const STATUS_VARIANT: Record<string, BadgeVariant> = { PAID: "ok", VACANT: "navy", PENDING_ADMIN: "warn", UPCOMING: "lock" };
const FILTERS = ["All", "PAID", "UPCOMING", "VACANT"];

export default function RentLedgerPage() {
  const [filter, setFilter] = useState("All");
  const rows = RENT_LEDGER.filter((r) => filter === "All" || r.status === filter);

  const received = RENT_LEDGER.filter((r) => r.status === "PAID").reduce((n, r) => n + r.amount, 0);
  const upcoming = RENT_LEDGER.filter((r) => r.status === "UPCOMING").reduce((n, r) => n + r.amount, 0);
  const vacant = RENT_LEDGER.filter((r) => ["VACANT", "PENDING_ADMIN"].includes(r.status)).length;

  return (
    <>
      <div className="stats-grid">
        <StatCard label="Total received" value={<Naira value={received} size={22} />} icon="cash" />
        <StatCard label="Upcoming renewals" value={<Naira value={upcoming} size={22} />} icon="refresh" />
        <StatCard label="Vacant / pending" value={vacant} icon="building" />
      </div>

      <div className="row between wrap gap-3" style={{ marginBottom: 14 }}>
        <div className="row wrap gap-2">
          {FILTERS.map((f) => <button key={f} className={cn("chip", filter === f && "is-active")} onClick={() => setFilter(f)}>{f === "All" ? "All" : f.replace("_", " ")}</button>)}
        </div>
        <button
          className="btn btn-ghost btn-sm"
          onClick={() => {
            downloadCsv(
              `awaagent-rent-ledger-${new Date().toISOString().slice(0, 10)}.csv`,
              ["Property", "Tenant", "Type", "Amount", "Due", "Paid", "Status", "Escrow ref"],
              rows.map((r) => [r.prop, r.tenant, r.type, r.amount, r.due, r.paid ?? "", r.status, r.escrow ?? ""]),
            );
            toast.success(`Exported ${rows.length} rows`);
          }}
        >
          <Icon name="upload" size={15} /> Export CSV
        </button>
      </div>

      <div className="table-wrap">
        <table className="data-table">
          <thead>
            <tr><th>Property</th><th>Tenant</th><th>Type</th><th>Amount</th><th>Due</th><th>Paid</th><th>Status</th><th>Escrow ref</th></tr>
          </thead>
          <tbody>
            {rows.map((r) => (
              <tr key={r.id}>
                <td><strong style={{ fontSize: 13 }}>{r.prop}</strong></td>
                <td>{r.tenant}</td>
                <td style={{ color: "var(--muted)" }}>{r.type}</td>
                <td><Naira value={r.amount} size={13.5} /></td>
                <td>{r.due}</td>
                <td>{r.paid ?? "—"}</td>
                <td><StatusBadge variant={STATUS_VARIANT[r.status]}>{r.status.replace("_", " ")}</StatusBadge></td>
                <td className="mono" style={{ fontSize: 12 }}>{r.escrow ?? "—"}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </>
  );
}
