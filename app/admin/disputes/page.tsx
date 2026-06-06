"use client";

import { useState } from "react";
import { Naira } from "@/components/shared/naira";
import { StatusBadge } from "@/components/shared/status-badge";
import { BottomSheet } from "@/components/shared/bottom-sheet";
import { Icon } from "@/components/ui/icon";
import { useAppStore } from "@/store/app-store";
import { cn } from "@/lib/utils";
import { toast } from "sonner";
import type { Dispute, DisputeResolution } from "@/lib/types";
import type { BadgeVariant } from "@/lib/constants";

const PRIORITY: Record<string, BadgeVariant> = { HIGH: "danger", MEDIUM: "warn", LOW: "navy" };
const STATUS: Record<string, BadgeVariant> = { OPEN: "warn", REVIEWING: "navy", RESOLVED: "ok" };
const FILTERS = ["Active", "OPEN", "REVIEWING", "RESOLVED"];

const OPTIONS: { key: DisputeResolution; label: string; desc: string; icon: "user" | "coins" | "scale" }[] = [
  { key: "tenant", label: "Refund the tenant", desc: "Full amount returned to the tenant.", icon: "user" },
  { key: "agent", label: "Release to landlord & agent", desc: "Settle the transaction as normal.", icon: "coins" },
  { key: "split", label: "50 / 50 split", desc: "Split the escrow between both parties.", icon: "scale" },
];

export default function AdminDisputesPage() {
  const disputes = useAppStore((s) => s.disputes);
  const resolveDispute = useAppStore((s) => s.resolveDispute);
  const [filter, setFilter] = useState("Active");
  const [resolving, setResolving] = useState<Dispute | null>(null);

  const rows = disputes.filter((d) => (filter === "Active" ? d.status !== "RESOLVED" : d.status === filter));

  return (
    <>
      <div className="row wrap gap-2" style={{ marginBottom: 16 }}>
        {FILTERS.map((f) => <button key={f} className={cn("chip", filter === f && "is-active")} onClick={() => setFilter(f)}>{f}</button>)}
      </div>

      <div className="table-wrap">
        <table className="data-table">
          <thead>
            <tr><th>Reason</th><th>Property</th><th>Parties</th><th>Amount</th><th>Evidence</th><th>Priority</th><th>Status</th><th></th></tr>
          </thead>
          <tbody>
            {rows.map((d) => (
              <tr key={d.id}>
                <td><strong style={{ fontSize: 13 }}>{d.reason}</strong></td>
                <td style={{ color: "var(--muted)" }}>{d.propertyName}</td>
                <td style={{ fontSize: 12.5 }}>{d.tenant} <span style={{ color: "var(--faint)" }}>vs</span> {d.agent}</td>
                <td><Naira value={d.amount} size={13.5} /></td>
                <td><span className="row gap-2"><Icon name="upload" size={13} /> {d.evidenceCount}</span></td>
                <td><StatusBadge variant={PRIORITY[d.priority]}>{d.priority}</StatusBadge></td>
                <td><StatusBadge variant={STATUS[d.status]}>{d.status}</StatusBadge></td>
                <td>
                  {d.status === "RESOLVED" ? (
                    <span style={{ fontSize: 12.5, color: "var(--ok)" }}>{d.resolution} ✓</span>
                  ) : (
                    <button className="btn btn-primary btn-sm" onClick={() => setResolving(d)}>Resolve</button>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <BottomSheet open={resolving !== null} onClose={() => setResolving(null)} title="Resolve dispute" maxWidth={460}>
        {resolving && (
          <div className="col gap-4" style={{ padding: "8px 20px 24px" }}>
            <div className="card card-pad" style={{ background: "var(--paper)", border: "none" }}>
              <strong style={{ fontSize: 14.5 }}>{resolving.reason}</strong>
              <p style={{ fontSize: 13, color: "var(--muted)", marginTop: 4 }}>{resolving.propertyName} · <Naira value={resolving.amount} size={13} /> in escrow</p>
            </div>
            {OPTIONS.map((o) => (
              <button
                key={o.key}
                className="card card-pad row gap-3"
                style={{ textAlign: "left", alignItems: "center" }}
                onClick={() => { resolveDispute(resolving.id, o.key); toast.success(`Dispute resolved — ${o.label}`); setResolving(null); }}
              >
                <span className="grid place-items-center" style={{ width: 40, height: 40, borderRadius: 11, background: "var(--navy-050)", color: "var(--navy-700)", flexShrink: 0 }}><Icon name={o.icon} size={19} /></span>
                <div className="col grow" style={{ gap: 1 }}><strong style={{ fontSize: 14.5 }}>{o.label}</strong><span style={{ fontSize: 12.5, color: "var(--muted)" }}>{o.desc}</span></div>
                <Icon name="arrowR" size={18} color="var(--faint)" />
              </button>
            ))}
          </div>
        )}
      </BottomSheet>
    </>
  );
}
