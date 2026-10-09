"use client";

import { useState } from "react";
import Link from "next/link";
import { useQuery } from "@tanstack/react-query";
import { adminService } from "@/services/admin-service";
import { PageHeader } from "@/components/shared/page-header";
import { Naira } from "@/components/shared/naira";

export default function Page() {
  const cases = useQuery({ queryKey: ["reconciliation-cases"], queryFn: adminService.reconciliation });
  const [notes, setNotes] = useState<Record<string, string>>({});
  const [busy, setBusy] = useState<string | null>(null);
  const [message, setMessage] = useState<string | null>(null);
  const save = async (id: string) => {
    setBusy(id); setMessage(null);
    try {
      await adminService.addReconciliationNote(id, notes[id] ?? "");
      setNotes((current) => ({ ...current, [id]: "" }));
      await cases.refetch();
      setMessage("Review note recorded in the audit log.");
    } catch (cause) { setMessage(cause instanceof Error ? cause.message : "Could not record note."); }
    finally { setBusy(null); }
  };
  return <div className="page page-narrow col gap-4">
    <PageHeader title="Reconciliation queue" subtitle="Historical and uncertain payment outcomes that need provider and bank review." />
    <p>Use the Paystack checks in <Link href="/admin/escrow">Payments</Link> where available. Record evidence here before any separate financial action.</p>
    {message && <p role="status">{message}</p>}
    {cases.isPending ? <p>Loading cases...</p> : cases.isError ? <p role="alert">Could not load reconciliation cases.</p> :
      cases.data.length === 0 ? <p>No cases need reconciliation.</p> : cases.data.map((item) =>
        <article className="card card-pad col gap-3" key={item.id}>
          <strong>{item.propertyTitle} · {item.status.replaceAll("_", " ")}</strong>
          <span>{item.id} · {item.paystackReference ?? "No verified Paystack reference"}</span>
          <Naira value={item.grossAmount} size={19} />
          {item.legacyStatus && <span>Historical state: {item.legacyStatus}</span>}
          {item.payouts.map((payout) => <span key={payout.id}>{payout.role}: {payout.status} · {payout.reference}</span>)}
          {item.notes.map((entry, index) => <p key={`${entry.at}-${index}`}><strong>{entry.actor} · {new Date(entry.at).toLocaleString()}</strong><br />{entry.note}</p>)}
          <label className="field"><span className="label">Evidence or review note</span><textarea className="input" value={notes[item.id] ?? ""} onChange={(event) => setNotes((current) => ({ ...current, [item.id]: event.target.value }))} minLength={10} maxLength={2000} /></label>
          <button className="btn btn-primary" disabled={busy !== null || (notes[item.id] ?? "").trim().length < 10} onClick={() => void save(item.id)}>{busy === item.id ? "Saving..." : "Record note"}</button>
        </article>)}
  </div>;
}
