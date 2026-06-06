"use client";

import { useState } from "react";
import { Naira } from "@/components/shared/naira";
import { StatusBadge } from "@/components/shared/status-badge";
import { TrustBadge } from "@/components/shared/trust-badge";
import { ConfirmDialog } from "@/components/shared/confirm-dialog";
import { Icon } from "@/components/ui/icon";
import { useAppStore } from "@/store/app-store";
import { cn } from "@/lib/utils";
import { toast } from "sonner";

const FILTERS = ["PENDING", "APPROVED", "REJECTED"];

export default function AdminPropertiesPage() {
  const queue = useAppStore((s) => s.propQueue);
  const approve = useAppStore((s) => s.approveProperty);
  const reject = useAppStore((s) => s.rejectProperty);
  const [filter, setFilter] = useState("PENDING");
  const [confirm, setConfirm] = useState<{ id: string; title: string; action: "approve" | "reject" } | null>(null);

  const rows = queue.filter((p) => p.status === filter);

  return (
    <>
      <div className="row wrap gap-2" style={{ marginBottom: 16 }}>
        {FILTERS.map((f) => <button key={f} className={cn("chip", filter === f && "is-active")} onClick={() => setFilter(f)}>{f} · {queue.filter((p) => p.status === f).length}</button>)}
      </div>

      <div className="table-wrap">
        <table className="data-table">
          <thead>
            <tr><th>Property</th><th>Agent</th><th>Landlord</th><th>Rent</th><th>GPS</th><th>Risk</th><th></th></tr>
          </thead>
          <tbody>
            {rows.map((p) => (
              <tr key={p.id}>
                <td><strong style={{ fontSize: 13 }}>{p.title}</strong><div style={{ fontSize: 11.5, color: "var(--muted)" }}>{p.area} · {p.submitted}</div></td>
                <td><div className="row gap-2" style={{ fontSize: 12.5 }}>{p.agentName} <TrustBadge score={p.agentTrust} sm /></div></td>
                <td style={{ color: "var(--muted)", fontSize: 12.5 }}>{p.landlord}</td>
                <td><Naira value={p.baseRent} size={13.5} /></td>
                <td className="mono" style={{ fontSize: 11.5, color: "var(--muted)" }}>{p.gps}</td>
                <td>{p.risk.length === 0 ? <span className="tag tag-ok">Clean</span> : p.risk.map((r) => <span key={r} className="tag tag-danger" style={{ marginRight: 4 }}>{r}</span>)}</td>
                <td>
                  {p.status === "PENDING" ? (
                    <div className="row gap-2">
                      <button className="btn btn-ok btn-sm" onClick={() => setConfirm({ id: p.id, title: p.title, action: "approve" })}><Icon name="check" size={14} strokeWidth={2.2} /></button>
                      <button className="btn btn-danger btn-sm" onClick={() => setConfirm({ id: p.id, title: p.title, action: "reject" })}><Icon name="close" size={14} /></button>
                    </div>
                  ) : (
                    <StatusBadge variant={p.status === "APPROVED" ? "ok" : "danger"}>{p.status}</StatusBadge>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <ConfirmDialog
        open={confirm !== null}
        onOpenChange={(o) => !o && setConfirm(null)}
        title={confirm?.action === "approve" ? "Approve this listing?" : "Reject this listing?"}
        description={confirm?.action === "approve" ? `"${confirm?.title}" will go live on the marketplace.` : `"${confirm?.title}" will be rejected and the agent notified.`}
        confirmLabel={confirm?.action === "approve" ? "Approve & publish" : "Reject"}
        tone={confirm?.action === "approve" ? "ok" : "danger"}
        onConfirm={() => {
          if (!confirm) return;
          if (confirm.action === "approve") { approve(confirm.id); toast.success(`Approved "${confirm.title}"`); }
          else { reject(confirm.id); toast(`Rejected "${confirm.title}"`); }
        }}
      />
    </>
  );
}
