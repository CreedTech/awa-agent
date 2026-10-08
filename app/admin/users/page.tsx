"use client";

import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { adminService } from "@/services/admin-service";
import { PageHeader } from "@/components/shared/page-header";

export default function Page() {
  const users = useQuery({ queryKey: ["admin-users"], queryFn: adminService.users });
  const [notes, setNotes] = useState<Record<string, string>>({});
  const [busy, setBusy] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const change = async (id: string, status: "ACTIVE" | "SUSPENDED") => {
    setBusy(id); setError(null);
    try { await adminService.setUserStatus(id, status, notes[id] ?? ""); await users.refetch(); }
    catch (cause) { setError(cause instanceof Error ? cause.message : "Could not update account."); }
    finally { setBusy(null); }
  };
  return <div className="page page-narrow col gap-4">
    <PageHeader title="Accounts" subtitle="Review and manage registered users." />
    {error && <p role="alert">{error}</p>}
    {users.isPending ? <p>Loading users...</p> : users.isError ? <p role="alert">Could not load users.</p> :
      users.data.length === 0 ? <p>No registered accounts yet.</p> : users.data.map((user) =>
        <div className="card card-pad col gap-2" key={user.id}>
          <strong>{user.name} · {user.role}</strong><span>{user.email} · {user.phone}</span>
          <span>{user.accountStatus} · KYC {user.kycStatus}</span>
          {user.role !== "admin" && <><label className="field"><span className="label">Review note</span>
            <input className="input" value={notes[user.id] ?? ""} onChange={(event) => setNotes((current) => ({ ...current, [user.id]: event.target.value }))} minLength={10} maxLength={1000} /></label>
            <button className="btn btn-ghost" disabled={busy !== null || (notes[user.id] ?? "").trim().length < 10}
              onClick={() => void change(user.id, user.accountStatus === "ACTIVE" ? "SUSPENDED" : "ACTIVE")}>{user.accountStatus === "ACTIVE" ? "Suspend account" : "Reactivate account"}</button></>}
        </div>)}
  </div>;
}
