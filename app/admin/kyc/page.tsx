"use client";

import { useState } from "react";
import { Avatar } from "@/components/shared/avatar";
import { StatusBadge } from "@/components/shared/status-badge";
import { BottomSheet } from "@/components/shared/bottom-sheet";
import { ConfirmDialog } from "@/components/shared/confirm-dialog";
import { Icon } from "@/components/ui/icon";
import { useAppStore } from "@/store/app-store";
import { cn } from "@/lib/utils";
import { toast } from "sonner";
import type { KycRecord } from "@/lib/types";

const FILTERS = ["PENDING", "APPROVED", "REJECTED"];
const RISK_DANGER = ["NIN mismatch", "Multiple accounts", "Flagged number"];

export default function AdminKycPage() {
  const queue = useAppStore((s) => s.kycQueue);
  const approve = useAppStore((s) => s.approveKyc);
  const reject = useAppStore((s) => s.rejectKyc);

  const [filter, setFilter] = useState("PENDING");
  const [review, setReview] = useState<KycRecord | null>(null);
  const [confirm, setConfirm] = useState<{ id: string; name: string; action: "approve" | "reject" } | null>(null);

  const rows = queue.filter((k) => k.status === filter);

  return (
    <>
      <div className="row wrap gap-2" style={{ marginBottom: 16 }}>
        {FILTERS.map((f) => (
          <button key={f} className={cn("chip", filter === f && "is-active")} onClick={() => setFilter(f)}>
            {f} <span style={{ opacity: 0.6 }}>· {queue.filter((k) => k.status === f).length}</span>
          </button>
        ))}
      </div>

      <div className="table-wrap">
        <table className="data-table">
          <thead>
            <tr><th>User</th><th>Role</th><th>NIN</th><th>Phone</th><th>Submitted</th><th>Risk flags</th><th></th></tr>
          </thead>
          <tbody>
            {rows.map((k) => (
              <tr key={k.id}>
                <td><div className="row gap-2"><Avatar name={k.name} size={30} /><strong style={{ fontSize: 13 }}>{k.name}</strong></div></td>
                <td><span className="tag tag-navy">{k.role}</span></td>
                <td className="mono" style={{ fontSize: 12 }}>{k.nin}</td>
                <td style={{ color: "var(--muted)" }}>{k.phone}</td>
                <td style={{ color: "var(--muted)" }}>{k.submitted}</td>
                <td>
                  <div className="row wrap gap-2">
                    {k.risk.length === 0 ? <span className="tag tag-ok">Clean</span> : k.risk.map((r) => (
                      <span key={r} className={`tag ${RISK_DANGER.includes(r) ? "tag-danger" : "tag-warn"}`}>{r}</span>
                    ))}
                  </div>
                </td>
                <td>
                  <div className="row gap-2">
                    <button className="btn btn-ghost btn-sm" onClick={() => setReview(k)}>Review</button>
                    {k.status === "PENDING" && (
                      <>
                        <button className="btn btn-ok btn-sm" onClick={() => setConfirm({ id: k.id, name: k.name, action: "approve" })}><Icon name="check" size={14} strokeWidth={2.2} /></button>
                        <button className="btn btn-danger btn-sm" onClick={() => setConfirm({ id: k.id, name: k.name, action: "reject" })}><Icon name="close" size={14} /></button>
                      </>
                    )}
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Review drawer */}
      <BottomSheet open={review !== null} onClose={() => setReview(null)} title="KYC review" maxWidth={460}>
        {review && (
          <div className="col gap-4" style={{ padding: "8px 20px 24px" }}>
            <div className="row gap-3"><Avatar name={review.name} size={48} /><div className="col" style={{ gap: 2 }}><strong style={{ fontSize: 16 }}>{review.name}</strong><span style={{ fontSize: 13, color: "var(--muted)" }}>{review.role} · submitted {review.submitted}</span></div></div>
            <div className="card" style={{ background: "var(--paper)", border: "none" }}>
              {[["NIN", review.nin], ["Phone", review.phone], ["Status", review.status]].map(([k, v]) => (
                <div key={k} className="brk-row" style={{ padding: "10px 14px" }}><span style={{ fontSize: 13, color: "var(--muted)" }}>{k}</span><span className={k === "NIN" ? "mono" : ""} style={{ fontSize: 13, fontWeight: 600 }}>{v}</span></div>
              ))}
            </div>
            {review.risk.length > 0 && (
              <div className="card card-pad" style={{ background: "var(--danger-bg)", border: "none" }}>
                <strong className="row gap-2" style={{ color: "var(--danger)", fontSize: 13.5 }}><Icon name="alert" size={15} /> Risk flags</strong>
                <div className="row wrap gap-2" style={{ marginTop: 8 }}>{review.risk.map((r) => <span key={r} className="tag tag-danger">{r}</span>)}</div>
              </div>
            )}
            {review.status === "PENDING" && (
              <div className="row gap-2">
                <button className="btn btn-ok grow" onClick={() => { setConfirm({ id: review.id, name: review.name, action: "approve" }); setReview(null); }}>Approve</button>
                <button className="btn btn-danger grow" onClick={() => { setConfirm({ id: review.id, name: review.name, action: "reject" }); setReview(null); }}>Reject</button>
              </div>
            )}
          </div>
        )}
      </BottomSheet>

      <ConfirmDialog
        open={confirm !== null}
        onOpenChange={(o) => !o && setConfirm(null)}
        title={confirm?.action === "approve" ? "Approve this KYC?" : "Reject this KYC?"}
        description={confirm?.action === "approve"
          ? `${confirm?.name} will be verified and able to transact on AwaAgent.`
          : `${confirm?.name}'s submission will be rejected. They'll need to re-submit.`}
        confirmLabel={confirm?.action === "approve" ? "Approve" : "Reject"}
        tone={confirm?.action === "approve" ? "ok" : "danger"}
        onConfirm={() => {
          if (!confirm) return;
          if (confirm.action === "approve") { approve(confirm.id); toast.success(`Approved ${confirm.name}`); }
          else { reject(confirm.id); toast(`Rejected ${confirm.name}`); }
        }}
      />
    </>
  );
}
