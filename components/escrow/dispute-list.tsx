"use client";

import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { escrowService } from "@/services/escrow-service";
import { PageHeader } from "@/components/shared/page-header";
import { Naira } from "@/components/shared/naira";

function Review({ id, onReviewed }: { id: string; onReviewed: () => Promise<unknown> }) {
  const [decision, setDecision] = useState<"RESTORE_RELEASE" | "REFUND">("RESTORE_RELEASE");
  const [note, setNote] = useState("");
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const save = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault(); setBusy(true); setError(null);
    try { await escrowService.resolveDispute(id, decision, note); await onReviewed(); }
    catch (cause) { setError(cause instanceof Error ? cause.message : "Could not save decision."); }
    finally { setBusy(false); }
  };
  return <form className="col gap-3" onSubmit={save}>
    <label className="col gap-2">Decision
      <select className="input" value={decision} onChange={(event) => setDecision(event.target.value as "RESTORE_RELEASE" | "REFUND")}>
        <option value="RESTORE_RELEASE">Restore tenant release</option>
        <option value="REFUND">Refund tenant through Paystack</option>
      </select>
    </label>
    <textarea className="input" aria-label="Review note" value={note} minLength={10} maxLength={2000} required onChange={(event) => setNote(event.target.value)} />
    <button className="btn btn-primary" disabled={busy || note.trim().length < 10} type="submit">{busy ? "Saving..." : "Record decision"}</button>
    {error && <p role="alert">{error}</p>}
  </form>;
}

export function DisputeList({ admin = false }: { admin?: boolean }) {
  const disputes = useQuery({ queryKey: ["escrow-disputes"], queryFn: escrowService.disputes });
  return <div className="page page-narrow col gap-5">
    <PageHeader title="Disputes" subtitle={admin ? "Review evidence outside the app before recording a decision." : "Problems raised against rent transactions."} />
    {disputes.isPending ? <p>Loading disputes...</p> : disputes.isError ? <p role="alert">Could not load disputes.</p> :
      disputes.data?.length ? disputes.data.map((dispute) => <div className="card card-pad col gap-3" key={dispute.id}>
        <strong>{dispute.propertyTitle}</strong>
        <div className="row between"><span>{dispute.status.replaceAll("_", " ")}</span><Naira value={dispute.grossAmount} size={18} /></div>
        <p>Reason: {dispute.reason.replaceAll("_", " ")}</p>
        {dispute.description && <p>{dispute.description}</p>}
        {dispute.resolutionNote && <p>Review decision: {dispute.resolutionNote}</p>}
        {admin && dispute.status === "DISPUTED" && <Review id={dispute.id} onReviewed={() => disputes.refetch()} />}
      </div>) : <p>No disputes found.</p>}
  </div>;
}
