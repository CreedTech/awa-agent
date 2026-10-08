"use client";

import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { adminService } from "@/services/admin-service";
import { PageHeader } from "@/components/shared/page-header";

export default function Page() {
  const settings = useQuery({ queryKey: ["platform-settings"], queryFn: adminService.settings });
  const [busy, setBusy] = useState(false);
  const [message, setMessage] = useState<string | null>(null);
  const save = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault(); setBusy(true); setMessage(null);
    const form = new FormData(event.currentTarget);
    try {
      await adminService.saveSettings({ subscriptionPriceNaira: Number(form.get("subscriptionPriceNaira")), platformFeeBps: Number(form.get("platformFeeBps")), agentShareBps: Number(form.get("agentShareBps")) });
      await settings.refetch(); setMessage("Settings saved and audited. New checkouts use these values.");
    } catch (error) { setMessage(error instanceof Error ? error.message : "Could not save settings."); }
    finally { setBusy(false); }
  };
  return <div className="page page-narrow col gap-4">
    <PageHeader title="Platform settings" subtitle="Business values for new checkouts only." />
    {settings.isPending ? <p>Loading settings...</p> : settings.isError ? <p role="alert">Could not load settings.</p> :
      <form className="card card-pad col gap-3" onSubmit={save}>
        <label className="field"><span className="label">30-day inspection access (₦)</span><input className="input" name="subscriptionPriceNaira" type="number" min={100} max={100000} defaultValue={settings.data.subscriptionPriceNaira} required /></label>
        <label className="field"><span className="label">Platform fee (basis points; 250 = 2.5%)</span><input className="input" name="platformFeeBps" type="number" min={0} max={2000} defaultValue={settings.data.platformFeeBps} required /></label>
        <label className="field"><span className="label">Agent share (basis points; 900 = 9%)</span><input className="input" name="agentShareBps" type="number" min={0} max={3000} defaultValue={settings.data.agentShareBps} required /></label>
        <button className="btn btn-primary" type="submit" disabled={busy}>{busy ? "Saving..." : "Save settings"}</button>
      </form>}
    {message && <p role="status">{message}</p>}
  </div>;
}
