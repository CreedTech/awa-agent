"use client";

import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { adminService } from "@/services/admin-service";
import { PageHeader } from "@/components/shared/page-header";

export default function Page() {
  const users = useQuery({ queryKey: ["admin-trust"], queryFn: adminService.trust });
  const flags = useQuery({ queryKey: ["admin-flags"], queryFn: adminService.flags });
  const [notes, setNotes] = useState<Record<string, string>>({});
  const [busy, setBusy] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const review = async (id: string, decision: "UPHELD" | "DISMISSED") => {
    setBusy(id); setError(null);
    try { await adminService.reviewFlag(id, decision, notes[id] ?? ""); await Promise.all([flags.refetch(), users.refetch()]); }
    catch (cause) { setError(cause instanceof Error ? cause.message : "Could not review flag."); }
    finally { setBusy(null); }
  };
  const pending = flags.data?.filter((flag) => flag.status === "PENDING") ?? [];
  return <div className="page page-narrow col gap-4">
    <PageHeader title="Trust and safety" subtitle="Review reported accounts and trust history." />
    {error && <p role="alert">{error}</p>}
    <h2>Pending reports</h2>
    {flags.isPending ? <p>Loading reports...</p> : flags.isError ? <p role="alert">Could not load reports.</p> : pending.length === 0 ? <p>No reports awaiting review.</p> : pending.map((flag) =>
      <article className="card card-pad col gap-2" key={flag.id}>
        <strong>{flag.reportedName} · {flag.reason}</strong><p>{flag.description}</p>
        <time dateTime={flag.createdAt}>{new Date(flag.createdAt).toLocaleString()}</time>
        <label className="field"><span className="label">Decision note</span><textarea className="input" value={notes[flag.id] ?? ""} onChange={(event) => setNotes((current) => ({ ...current, [flag.id]: event.target.value }))} minLength={10} maxLength={1000} /></label>
        <div className="flex gap-2"><button className="btn btn-primary" disabled={busy !== null || (notes[flag.id] ?? "").trim().length < 10} onClick={() => void review(flag.id, "UPHELD")}>Uphold report</button>
          <button className="btn btn-ghost" disabled={busy !== null || (notes[flag.id] ?? "").trim().length < 10} onClick={() => void review(flag.id, "DISMISSED")}>Dismiss report</button></div>
      </article>)}
    <h2>Accounts</h2>
    {users.isPending ? <p>Loading trust history...</p> : users.isError ? <p role="alert">Could not load trust history.</p> : users.data.length === 0 ? <p>No accounts yet.</p> : users.data.map((user) =>
      <article className="card card-pad col gap-2" key={user.id}>
        <strong>{user.name} · {user.role}</strong><span>Trust score {user.trustScore} · KYC {user.kycStatus}</span>
        <span>{user.pendingFlags} pending reports · {user.upheldFlags} upheld reports</span>
      </article>)}
  </div>;
}
