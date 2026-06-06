"use client";

import { useState } from "react";
import Link from "next/link";
import { useParams, notFound } from "next/navigation";
import { Icon } from "@/components/ui/icon";
import { Naira } from "@/components/shared/naira";
import { EscrowBadge } from "@/components/shared/status-badge";
import { ConfirmKeysModal } from "@/components/escrow/confirm-keys-modal";
import { DisputeSheet } from "@/components/escrow/dispute-sheet";
import { useAppStore } from "@/store/app-store";
import { propertyById, agentById } from "@/lib/mock-data";
import { calculateRentBreakdown } from "@/lib/utils";
import { toast } from "sonner";

export default function EscrowDetailPage() {
  const { id } = useParams<{ id: string }>();
  const txn = useAppStore((s) => s.escrow.find((e) => e.id === id));
  const confirmKeys = useAppStore((s) => s.confirmKeys);
  const raiseDispute = useAppStore((s) => s.raiseDispute);
  const [confirming, setConfirming] = useState(false);
  const [disputing, setDisputing] = useState(false);

  if (!txn) return notFound();
  const prop = propertyById(txn.propertyId);
  const agent = prop ? agentById(prop.agentId) : undefined;
  const breakdown = txn.breakdown ?? (prop ? calculateRentBreakdown(prop.baseRent, agent?.commissionPct) : undefined);

  const canAct = txn.status === "FUNDS_LOCKED";
  const isDisputed = txn.status === "DISPUTED";

  const TIMELINE = [
    { label: "Payment received", done: true, date: txn.lockedOn },
    { label: "Funds locked in escrow", done: true, date: txn.lockedOn },
    { label: "Keys confirmed", done: txn.status === "SETTLED", date: txn.settledOn },
    { label: "Funds released / refunded", done: ["SETTLED", "REFUNDED"].includes(txn.status), date: txn.settledOn ?? txn.refundedOn },
  ];

  return (
    <div className="page page-narrow">
      <Link href="/tenant/escrow" className="row gap-2" style={{ color: "var(--muted)", fontSize: 14, marginBottom: 14 }}>
        <Icon name="arrowL" size={16} /> Escrow wallet
      </Link>

      {/* Status hero */}
      <div className="card card-pad" style={{ textAlign: "center", marginBottom: 18 }}>
        <div className={txn.status === "SETTLED" ? "key-burst" : "lock-burst"} style={{ margin: "0 auto 14px" }}>
          <Icon name={txn.status === "SETTLED" ? "key" : isDisputed ? "alert" : "lock"} size={32} />
        </div>
        <Naira value={txn.amount} size={30} />
        <div style={{ marginTop: 8 }}><EscrowBadge status={txn.status} /></div>
        <p style={{ color: "var(--muted)", fontSize: 13.5, marginTop: 10 }}>
          {txn.status === "FUNDS_LOCKED" && "Your money is safe. Confirm your keys to release it, or raise a dispute if something's wrong."}
          {txn.status === "SETTLED" && "Completed — funds were released to the landlord and agent."}
          {isDisputed && "Frozen while our team reviews your dispute. We'll update you within 24 hours."}
          {txn.status === "FROZEN" && "Frozen by our team pending review."}
          {txn.status === "REFUNDED" && "Refunded to your account."}
        </p>
      </div>

      <div className="two-col">
        {/* Details */}
        <div className="col gap-4">
          <div className="card card-pad">
            <h3 style={{ fontSize: 16, marginBottom: 12 }}>Transaction</h3>
            {[
              ["Property", prop?.title ?? "—"],
              ["Agent", txn.agentName],
              ["Landlord", txn.landlordName ?? "—"],
              ["Escrow reference", txn.id],
              ["Paystack reference", txn.paystackRef],
              ["Locked on", txn.lockedOn ?? "—"],
            ].map(([k, v]) => (
              <div key={k} className="brk-row" style={{ padding: "10px 0" }}>
                <span style={{ fontSize: 13.5, color: "var(--muted)" }}>{k}</span>
                <span className={k.includes("reference") ? "mono" : ""} style={{ fontSize: 13.5, fontWeight: 600, textAlign: "right" }}>{v}</span>
              </div>
            ))}
          </div>

          {breakdown && (
            <div className="card card-pad">
              <h3 style={{ fontSize: 16, marginBottom: 8 }}>Amount breakdown</h3>
              {[["Base rent", breakdown.baseRent], ["Agent commission", breakdown.commission], ["Escrow fee", breakdown.escrowFee]].map(([k, v]) => (
                <div key={k as string} className="brk-row" style={{ padding: "9px 0" }}>
                  <span style={{ fontSize: 13.5, color: "var(--muted)" }}>{k}</span>
                  <Naira value={v as number} size={14} />
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Timeline + actions */}
        <div className="col gap-4">
          <div className="card card-pad">
            <h3 style={{ fontSize: 16, marginBottom: 16 }}>Timeline</h3>
            <div className="steps">
              {TIMELINE.map((t, i) => (
                <div key={t.label} className={`step ${t.done ? "done" : ""}`}>
                  <div className="step-rail">
                    <span className="step-dot">{t.done ? <Icon name="check" size={14} strokeWidth={2.4} /> : i + 1}</span>
                    {i < TIMELINE.length - 1 && <span className="step-line" />}
                  </div>
                  <div className="step-body">
                    <strong style={{ fontSize: 14 }}>{t.label}</strong>
                    {t.date && <p style={{ color: "var(--muted)", fontSize: 12.5 }}>{t.date}</p>}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {canAct && (
            <div className="card card-pad col gap-2">
              <button className="btn btn-gold btn-block btn-lg" onClick={() => setConfirming(true)}>
                <Icon name="key" size={18} /> Confirm key received
              </button>
              <button className="btn btn-danger btn-block" onClick={() => setDisputing(true)}>
                <Icon name="alert" size={17} /> Raise a dispute
              </button>
            </div>
          )}
          {isDisputed && (
            <div className="card card-pad row gap-2" style={{ background: "var(--danger-bg)", color: "var(--danger)", fontSize: 13.5 }}>
              <Icon name="clock" size={16} /> Dispute under review — funds are frozen.
            </div>
          )}
        </div>
      </div>

      <ConfirmKeysModal
        open={confirming}
        onOpenChange={setConfirming}
        onConfirm={() => { confirmKeys(txn.id); toast.success("Keys confirmed — escrow released"); }}
      />
      <DisputeSheet
        open={disputing}
        onClose={() => setDisputing(false)}
        onSubmit={(reason) => { raiseDispute(txn.id, reason); toast("Dispute opened — funds frozen"); }}
      />
    </div>
  );
}
