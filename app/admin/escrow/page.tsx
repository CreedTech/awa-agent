"use client";

import { useState } from "react";
import { Naira } from "@/components/shared/naira";
import { EscrowBadge } from "@/components/shared/status-badge";
import { ConfirmDialog } from "@/components/shared/confirm-dialog";
import { Icon } from "@/components/ui/icon";
import { useAppStore } from "@/store/app-store";
import { propertyById } from "@/lib/mock-data";
import { cn } from "@/lib/utils";
import { toast } from "sonner";

type Action = "freeze" | "release" | "refund";
const FILTERS = ["All", "FUNDS_LOCKED", "DISPUTED", "FROZEN", "SETTLED", "REFUNDED"];

const COPY: Record<Action, { title: string; desc: string; tone: "danger" | "ok" | "warn"; label: string }> = {
  freeze: { title: "Freeze this escrow?", desc: "Funds will be held and neither party can be paid until you release or refund.", tone: "danger", label: "Freeze" },
  release: { title: "Release funds to landlord & agent?", desc: "This settles the transaction and pays out immediately. It can't be undone.", tone: "ok", label: "Release" },
  refund: { title: "Refund the tenant?", desc: "The full amount is returned to the tenant. This closes the transaction.", tone: "warn", label: "Refund" },
};

export default function AdminEscrowPage() {
  const escrow = useAppStore((s) => s.escrow);
  const freeze = useAppStore((s) => s.freezeEscrow);
  const release = useAppStore((s) => s.releaseEscrow);
  const refund = useAppStore((s) => s.refundEscrow);

  const [filter, setFilter] = useState("All");
  const [confirm, setConfirm] = useState<{ id: string; action: Action } | null>(null);

  const rows = escrow.filter((e) => filter === "All" || e.status === filter);

  const run = () => {
    if (!confirm) return;
    const { id, action } = confirm;
    if (action === "freeze") freeze(id);
    if (action === "release") release(id);
    if (action === "refund") refund(id);
    toast.success(`${COPY[action].label} done · ${id}`);
  };

  return (
    <>
      <div className="row wrap gap-2" style={{ marginBottom: 16 }}>
        {FILTERS.map((f) => <button key={f} className={cn("chip", filter === f && "is-active")} onClick={() => setFilter(f)}>{f.replace("_", " ")}</button>)}
      </div>

      <div className="table-wrap">
        <table className="data-table">
          <thead>
            <tr><th>Transaction</th><th>Tenant</th><th>Property</th><th>Agent</th><th>Amount</th><th>Status</th><th>Paystack ref</th><th>Actions</th></tr>
          </thead>
          <tbody>
            {rows.map((e) => (
              <tr key={e.id}>
                <td className="mono" style={{ fontSize: 12, color: "var(--navy-700)", fontWeight: 700 }}>{e.id}</td>
                <td>{e.tenantName}</td>
                <td style={{ color: "var(--muted)" }}>{propertyById(e.propertyId)?.title ?? e.propertyId}</td>
                <td>{e.agentName}</td>
                <td><Naira value={e.amount} size={13.5} /></td>
                <td><EscrowBadge status={e.status} /></td>
                <td className="mono" style={{ fontSize: 11.5, color: "var(--muted)" }}>{e.paystackRef}</td>
                <td>
                  <div className="row gap-2">
                    {e.status === "FUNDS_LOCKED" && <button className="btn btn-danger btn-sm" onClick={() => setConfirm({ id: e.id, action: "freeze" })}>Freeze</button>}
                    {["FROZEN", "DISPUTED"].includes(e.status) && (
                      <>
                        <button className="btn btn-ok btn-sm" onClick={() => setConfirm({ id: e.id, action: "release" })}>Release</button>
                        <button className="btn btn-warn btn-sm" onClick={() => setConfirm({ id: e.id, action: "refund" })}>Refund</button>
                      </>
                    )}
                    {["SETTLED", "REFUNDED"].includes(e.status) && <span style={{ fontSize: 12.5, color: "var(--muted)" }}>Closed</span>}
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <ConfirmDialog
        open={confirm !== null}
        onOpenChange={(o) => !o && setConfirm(null)}
        title={confirm ? COPY[confirm.action].title : ""}
        description={confirm ? COPY[confirm.action].desc : ""}
        confirmLabel={confirm ? COPY[confirm.action].label : "Confirm"}
        tone={confirm ? COPY[confirm.action].tone : "primary"}
        onConfirm={run}
      >
        {confirm && (
          <div className="card card-pad row between" style={{ background: "var(--paper)", border: "none" }}>
            <span className="mono" style={{ fontSize: 13 }}>{confirm.id}</span>
            <Naira value={escrow.find((e) => e.id === confirm.id)?.amount ?? 0} size={15} />
          </div>
        )}
      </ConfirmDialog>
    </>
  );
}
