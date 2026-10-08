"use client";

import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { authorizationService } from "@/services/authorization-service";
import { PageHeader } from "@/components/shared/page-header";

export default function LandlordAgentsPage() {
  const agents = useQuery({ queryKey: ["my-agents"], queryFn: authorizationService.myAgents });
  const [phone, setPhone] = useState("");
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [notice, setNotice] = useState<string | null>(null);

  const invite = async (event: React.FormEvent) => {
    event.preventDefault(); setBusy(true); setError(null); setNotice(null);
    try {
      await authorizationService.invite(phone);
      setPhone(""); setNotice("Invitation sent to the agent's account.");
      await agents.refetch();
    } catch (cause) { setError(cause instanceof Error ? cause.message : "Could not invite agent."); }
    finally { setBusy(false); }
  };

  const revoke = async (id: string) => {
    setBusy(true); setError(null); setNotice(null);
    try { await authorizationService.revoke(id); setNotice("Authorization revoked."); await agents.refetch(); }
    catch (cause) { setError(cause instanceof Error ? cause.message : "Could not revoke authorization."); }
    finally { setBusy(false); }
  };

  return <div className="page page-narrow col gap-5">
    <PageHeader title="Your agents" subtitle="Invite an existing agent to represent your properties." />
    <form className="card card-pad col gap-3" onSubmit={invite}>
      <label className="field"><span className="label">Agent phone number</span><input className="input" type="tel" value={phone} onChange={(event) => setPhone(event.target.value)} required /></label>
      <button className="btn btn-primary" type="submit" disabled={busy}>{busy ? "Working..." : "Send invitation"}</button>
    </form>
    {error && <p role="alert" style={{ color: "var(--danger)" }}>{error}</p>}
    {notice && <p role="status">{notice}</p>}
    {agents.isPending ? <p>Loading agents...</p> : agents.isError ? <p role="alert">Could not load agents.</p> : agents.data.length === 0 ?
      <p>No agent authorizations yet.</p> : <div className="col gap-3">{agents.data.map((item) =>
        <div key={item.id} className="card card-pad row between wrap gap-3">
          <div className="col gap-1"><strong>{item.agentName}</strong><span>{item.status}</span></div>
          {item.status === "ACTIVE" || item.status === "PENDING" ? <button className="btn btn-ghost btn-sm" disabled={busy} onClick={() => revoke(item.id)}>Revoke</button> : null}
        </div>)}</div>}
  </div>;
}
