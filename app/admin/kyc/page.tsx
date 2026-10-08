"use client";

import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { PageHeader } from "@/components/shared/page-header";
import { kycService, type KycRequest } from "@/services/kyc-service";

function ReviewCard({ request, onReviewed }: { request: KycRequest; onReviewed: () => Promise<unknown> }) {
  const [note, setNote] = useState("");
  const [checked, setChecked] = useState(false);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const decide = async (decision: "APPROVED" | "REJECTED") => {
    setBusy(true); setError(null);
    try { await kycService.review(request.id, decision, note, checked); await onReviewed(); }
    catch (cause) { setError(cause instanceof Error ? cause.message : "Could not save review."); }
    finally { setBusy(false); }
  };
  return <div className="card card-pad col gap-3">
    <strong>{request.full_name} · {request.role}</strong>
    <span>{request.email} · {request.phone}</span>
    <span>{request.document_type.replaceAll("_", " ")} ending {request.document_last4}</span>
    <span>Requested {new Date(request.created_at).toLocaleDateString("en-GB")}</span>
    <label className="col gap-2">Review note
      <textarea className="input" value={note} minLength={10} maxLength={1000} required onChange={(event) => setNote(event.target.value)} />
    </label>
    <label className="row gap-2"><input type="checkbox" checked={checked} onChange={(event) => setChecked(event.target.checked)} />I inspected the original document and checked the details.</label>
    <div className="row gap-2">
      <button className="btn btn-primary" disabled={busy || !checked || note.trim().length < 10} onClick={() => decide("APPROVED")}>Approve</button>
      <button className="btn btn-ghost" disabled={busy || note.trim().length < 10} onClick={() => decide("REJECTED")}>Reject</button>
    </div>
    {error && <p role="alert">{error}</p>}
  </div>;
}

export default function Page() {
  const queue = useQuery({ queryKey: ["admin-kyc"], queryFn: kycService.queue });
  return <div className="page page-narrow col gap-5">
    <PageHeader title="Identity reviews" subtitle="Review original documents before approving access." />
    {queue.isPending ? <p>Loading requests...</p> : queue.isError ? <p role="alert">Could not load KYC requests.</p> :
      queue.data?.length ? queue.data.map((request) => <ReviewCard key={request.id} request={request} onReviewed={() => queue.refetch()} />) : <p>No requests await review.</p>}
  </div>;
}
