"use client";

import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { PageHeader } from "@/components/shared/page-header";
import { kycService } from "@/services/kyc-service";

export function KycRequestPage() {
  const current = useQuery({ queryKey: ["kyc-me"], queryFn: kycService.mine });
  const [documentType, setDocumentType] = useState("NIN");
  const [last4, setLast4] = useState("");
  const [busy, setBusy] = useState(false);
  const [message, setMessage] = useState<string | null>(null);
  const pending = current.data?.requests.some((request) => request.status === "PENDING");

  const submit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault(); setBusy(true); setMessage(null);
    try {
      await kycService.submit(documentType, last4);
      await current.refetch();
      setMessage("Request submitted for admin review.");
    } catch (error) { setMessage(error instanceof Error ? error.message : "Could not submit request."); }
    finally { setBusy(false); }
  };

  return <div className="page page-narrow col gap-5">
    <PageHeader title="Identity verification" subtitle="AwaAgent reviews your original identity document manually." />
    {current.isPending ? <p>Loading verification status...</p> : current.isError ? <p role="alert">Could not load verification status.</p> : <>
      <div className="card card-pad col gap-3">
        <strong>Status: {current.data?.kycStatus}</strong>
        <p>Submit the type and last four characters of your document. An administrator will arrange to inspect the original before approving you. Do not upload or send your full identity number through this form.</p>
      </div>
      {current.data?.kycStatus !== "VERIFIED" && !pending &&
        <form className="card card-pad col gap-4" onSubmit={submit}>
          <label className="col gap-2">Document type
            <select className="input" value={documentType} onChange={(event) => setDocumentType(event.target.value)}>
              <option value="NIN">National Identification Number</option>
              <option value="DRIVERS_LICENCE">Driver’s licence</option>
              <option value="INTERNATIONAL_PASSPORT">International passport</option>
              <option value="VOTERS_CARD">Voter’s card</option>
            </select>
          </label>
          <label className="col gap-2">Last four characters
            <input className="input" value={last4} maxLength={4} minLength={4} required onChange={(event) => setLast4(event.target.value)} />
          </label>
          <button className="btn btn-primary" disabled={busy} type="submit">{busy ? "Submitting..." : "Request review"}</button>
        </form>}
      {current.data?.requests.map((request) => <div className="card card-pad col gap-2" key={request.id}>
        <strong>{request.document_type.replaceAll("_", " ")} · {request.status}</strong>
        <span>Submitted {new Date(request.created_at).toLocaleDateString("en-GB")}</span>
        {request.review_note && <p>Review note: {request.review_note}</p>}
      </div>)}
    </>}
    {message && <p role="status">{message}</p>}
  </div>;
}
