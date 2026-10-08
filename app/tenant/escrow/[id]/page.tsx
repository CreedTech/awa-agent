"use client";

import { useState } from "react";
import Link from "next/link";
import { useParams } from "next/navigation";
import { useQuery } from "@tanstack/react-query";
import { escrowService } from "@/services/escrow-service";
import { Naira } from "@/components/shared/naira";
import { PageHeader } from "@/components/shared/page-header";

export default function TransactionPage() {
  const { id } = useParams<{ id: string }>();
  const transaction = useQuery({ queryKey: ["escrow-transaction", id], queryFn: () => escrowService.get(id), enabled: Boolean(id) });
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [notice, setNotice] = useState<string | null>(null);
  const [reason, setReason] = useState("keys_not_received");
  const [description, setDescription] = useState("");

  const release = async () => {
    setBusy(true); setError(null); setNotice(null);
    try {
      await escrowService.release(id);
      setNotice("Release requested. Payouts are pending Paystack confirmation.");
      await transaction.refetch();
    } catch (cause) { setError(cause instanceof Error ? cause.message : "Could not request release."); }
    finally { setBusy(false); }
  };

  const dispute = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault(); setBusy(true); setError(null); setNotice(null);
    try {
      await escrowService.dispute(id, reason, description);
      setNotice("Dispute opened. Release is paused while an administrator reviews it.");
      await transaction.refetch();
    } catch (cause) { setError(cause instanceof Error ? cause.message : "Could not open dispute."); }
    finally { setBusy(false); }
  };

  return <div className="page page-narrow col gap-5">
    <PageHeader title="Transaction" subtitle="Payment and payout status from the backend." />
    {transaction.isPending ? <p>Loading transaction...</p> : transaction.isError ? <p role="alert">Could not load transaction.</p> :
      <div className="card card-pad col gap-3">
        <div className="row between"><span>Total paid</span><Naira value={transaction.data.grossAmount} size={22} /></div>
        <p>Status: <strong>{transaction.data.status}</strong></p>
        {transaction.data.payouts.map((payout) => <p key={payout.role}>{payout.role}: {payout.status}</p>)}
        {transaction.data.status === "FUNDS_LOCKED" && <button className="btn btn-primary" disabled={busy} onClick={release}>{busy ? "Requesting..." : "Confirm keys received and request release"}</button>}
        {transaction.data.status === "FUNDS_LOCKED" && <form className="col gap-3" onSubmit={dispute}>
          <label className="col gap-2">Report a problem
            <select className="input" value={reason} onChange={(event) => setReason(event.target.value)}>
              <option value="keys_not_received">Keys not received</option>
              <option value="property_condition_mismatch">Property condition differs</option>
              <option value="agent_fraud">Agent misconduct</option>
              <option value="landlord_fraud">Landlord misconduct</option>
              <option value="other">Other</option>
            </select>
          </label>
          <textarea className="input" aria-label="Describe the problem" value={description} maxLength={2000} onChange={(event) => setDescription(event.target.value)} />
          <button className="btn btn-ghost" disabled={busy} type="submit">Open dispute</button>
        </form>}
        {transaction.data.refundStatus && <p>Refund: {transaction.data.refundStatus}</p>}
        {transaction.data.disputeResolutionNote && <p>Review decision: {transaction.data.disputeResolutionNote}</p>}
        {transaction.data.status === "PENDING_PAYMENT" && transaction.data.checkoutUrl && <a className="btn btn-primary" href={transaction.data.checkoutUrl}>Continue Paystack checkout</a>}
      </div>}
    {error && <p role="alert" style={{ color: "var(--danger)" }}>{error}</p>}
    {notice && <p role="status">{notice}</p>}
    <Link href="/tenant/inspections" className="btn btn-quiet">Back to inspections</Link>
  </div>;
}
