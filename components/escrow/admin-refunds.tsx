"use client";

import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { escrowService } from "@/services/escrow-service";
import { Naira } from "@/components/shared/naira";

export function AdminRefunds() {
  const payments = useQuery({ queryKey: ["escrow-mine"], queryFn: escrowService.mine });
  const [busy, setBusy] = useState<string | null>(null);
  const [message, setMessage] = useState<string | null>(null);
  const cases = payments.data?.filter((item) => ["REFUND_PENDING", "REFUND_UNKNOWN", "REFUND_FAILED"].includes(item.status)) ?? [];
  const reconcile = async (id: string) => {
    setBusy(id); setMessage(null);
    try { await escrowService.reconcileRefund(id); await payments.refetch(); setMessage("Refund status checked with Paystack."); }
    catch (cause) { setMessage(cause instanceof Error ? cause.message : "Could not reconcile refund."); }
    finally { setBusy(null); }
  };
  return <section className="col gap-3">
    <h2 style={{ fontSize: 20 }}>Refund exceptions</h2>
    {message && <p role="status">{message}</p>}
    {payments.isPending ? <p>Loading refund cases...</p> : payments.isError ? <p role="alert">Could not load refund cases.</p> :
      cases.length === 0 ? <p>No refunds need review.</p> : cases.map((item) =>
        <article className="card card-pad col gap-2" key={item.id}>
          <strong>{item.propertyTitle} · {item.status.replaceAll("_", " ")}</strong>
          <span>{item.id}</span><Naira value={item.grossAmount} size={18} />
          <button className="btn btn-ghost" type="button" disabled={busy !== null} onClick={() => void reconcile(item.id)}>{busy === item.id ? "Checking..." : "Check refund with Paystack"}</button>
        </article>)}
  </section>;
}
