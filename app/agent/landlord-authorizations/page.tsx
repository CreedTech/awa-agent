"use client";

import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { authorizationService } from "@/services/authorization-service";
import { PageHeader } from "@/components/shared/page-header";

export default function AgentLandlordAuthorizationsPage() {
  const landlords = useQuery({ queryKey: ["my-landlords"], queryFn: authorizationService.myLandlords });
  const [busy, setBusy] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [notice, setNotice] = useState<string | null>(null);

  const decide = async (id: string, action: "accept" | "reject") => {
    setBusy(id); setError(null); setNotice(null);
    try {
      await authorizationService[action](id);
      setNotice(action === "accept" ? "Landlord authorization accepted." : "Invitation declined.");
      await landlords.refetch();
    } catch (cause) { setError(cause instanceof Error ? cause.message : "Could not update invitation."); }
    finally { setBusy(null); }
  };

  return <div className="page page-narrow col gap-5">
    <PageHeader title="Landlord authorizations" subtitle="Accept an invitation before listing a landlord's property." />
    {error && <p role="alert" style={{ color: "var(--danger)" }}>{error}</p>}
    {notice && <p role="status">{notice}</p>}
    {landlords.isPending ? <p>Loading invitations...</p> : landlords.isError ? <p role="alert">Could not load invitations.</p> : landlords.data.length === 0 ?
      <p>No landlord invitations yet.</p> : <div className="col gap-3">{landlords.data.map((item) =>
        <div key={item.id} className="card card-pad row between wrap gap-3">
          <div className="col gap-1"><strong>{item.landlordName}</strong><span>{item.status}</span></div>
          {item.status === "PENDING" && <div className="row gap-2">
            <button className="btn btn-primary btn-sm" disabled={busy !== null} onClick={() => decide(item.id, "accept")}>Accept</button>
            <button className="btn btn-ghost btn-sm" disabled={busy !== null} onClick={() => decide(item.id, "reject")}>Decline</button>
          </div>}
        </div>)}</div>}
  </div>;
}
