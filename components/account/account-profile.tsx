"use client";

import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { authService } from "@/services/auth-service";
import { PageHeader } from "@/components/shared/page-header";
import { PayoutAccount } from "@/components/account/payout-account";

export function AccountProfile() {
  const profile = useQuery({ queryKey: ["account-profile"], queryFn: authService.me });
  const [draft, setDraft] = useState<{ name: string; phone: string } | null>(null);
  const [busy, setBusy] = useState(false);
  const [message, setMessage] = useState<string | null>(null);
  const values = draft ?? { name: profile.data?.name ?? "", phone: profile.data?.phone ?? "" };

  const save = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setBusy(true);
    setMessage(null);
    try {
      const account = await authService.updateProfile(values);
      await profile.refetch();
      setDraft(null);
      setMessage(`Profile saved for ${account.name}.`);
    } catch (error) {
      setMessage(error instanceof Error ? error.message : "Could not update your profile.");
    } finally {
      setBusy(false);
    }
  };

  return <div className="page page-narrow col gap-5">
    <PageHeader title="Profile" subtitle="Your account and contact details." />
    {profile.isPending ? <p>Loading profile...</p> : profile.isError ? <p role="alert">Could not load your profile.</p> : profile.data &&
      <form onSubmit={save} className="card card-pad col gap-4">
        <label className="col gap-2">Full name
          <input className="input" value={values.name} minLength={2} maxLength={100} required onChange={(event) => setDraft({ ...values, name: event.target.value })} />
        </label>
        <label className="col gap-2">Phone number
          <input className="input" type="tel" value={values.phone} required onChange={(event) => setDraft({ ...values, phone: event.target.value })} />
        </label>
        <div className="col gap-2"><span>Email</span><strong>{profile.data.email || "No email address"}</strong></div>
        <div className="col gap-2"><span>Identity verification</span><strong>{profile.data.kycStatus}</strong></div>
        <button className="btn btn-primary" type="submit" disabled={busy || !draft}>{busy ? "Saving..." : "Save changes"}</button>
        {message && <p role="status">{message}</p>}
      </form>}
    {profile.data && (profile.data.role === "agent" || profile.data.role === "landlord") && <PayoutAccount />}
  </div>;
}
