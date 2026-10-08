"use client";

import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { propertyService } from "@/services/property-service";
import { PageHeader } from "@/components/shared/page-header";

export default function Page() {
  const listings = useQuery({ queryKey: ["agent-properties"], queryFn: propertyService.mine });
  const [busy, setBusy] = useState<string | null>(null);
  const [message, setMessage] = useState<string | null>(null);
  const save = async (event: React.FormEvent<HTMLFormElement>, id: string) => {
    event.preventDefault(); setBusy(id); setMessage(null);
    const data = new FormData(event.currentTarget);
    try {
      await propertyService.update(id, { inspectionSlotsPerDay: Number(data.get("slots")) });
      await listings.refetch();
      setMessage("Inspection capacity saved. A listing update may require admin review.");
    } catch (cause) { setMessage(cause instanceof Error ? cause.message : "Could not save capacity."); }
    finally { setBusy(null); }
  };
  return <div className="page page-narrow col gap-4">
    <PageHeader title="Inspection settings" subtitle="Set daily booking capacity for each listing." />
    {message && <p role="status">{message}</p>}
    {listings.isPending ? <p>Loading listings...</p> : listings.isError ? <p role="alert">Could not load your listings.</p> :
      listings.data.length === 0 ? <p>No listings yet.</p> : listings.data.map((listing) =>
        <form className="card card-pad row wrap gap-3" key={listing.id} onSubmit={(event) => void save(event, listing.id)}>
          <strong className="grow">{listing.title}</strong>
          <label className="field"><span className="label">Slots per day</span><input className="input" type="number" name="slots" min={1} max={20} defaultValue={listing.inspectionSlotsPerDay ?? 3} required /></label>
          <button className="btn btn-primary" type="submit" disabled={busy !== null}>{busy === listing.id ? "Saving..." : "Save"}</button>
        </form>)}
  </div>;
}
