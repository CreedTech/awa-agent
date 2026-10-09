"use client";

import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { propertyService } from "@/services/property-service";
import { inspectionService } from "@/services/inspection-service";
import { PageHeader } from "@/components/shared/page-header";

export default function Page() {
  const listings = useQuery({ queryKey: ["agent-properties"], queryFn: propertyService.mine });
  const unavailable = useQuery({ queryKey: ["agent-unavailable-dates"], queryFn: inspectionService.unavailableDates });
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
  const block = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault(); setBusy("date"); setMessage(null);
    const date = String(new FormData(event.currentTarget).get("date") ?? "");
    try { await inspectionService.blockDate(date); await unavailable.refetch(); setMessage("Date marked unavailable."); }
    catch (cause) { setMessage(cause instanceof Error ? cause.message : "Could not block date."); }
    finally { setBusy(null); }
  };
  const unblock = async (date: string) => {
    setBusy(date); setMessage(null);
    try { await inspectionService.unblockDate(date); await unavailable.refetch(); setMessage("Date is available again."); }
    catch (cause) { setMessage(cause instanceof Error ? cause.message : "Could not unblock date."); }
    finally { setBusy(null); }
  };
  return <div className="page page-narrow col gap-4">
    <PageHeader title="Inspection settings" subtitle="Set daily booking capacity for each listing." />
    {message && <p role="status">{message}</p>}
    <section className="card card-pad col gap-3">
      <h2>Unavailable dates</h2>
      <p>Tenants cannot book new inspections on blocked dates. Existing bookings must be handled first.</p>
      <form className="row wrap gap-2" onSubmit={block}>
        <input className="input" type="date" name="date" required />
        <button className="btn btn-primary" type="submit" disabled={busy !== null}>Block date</button>
      </form>
      {unavailable.isPending ? <p>Loading dates...</p> : unavailable.isError ? <p role="alert">Could not load unavailable dates.</p> : unavailable.data.length === 0 ? <p>No dates blocked.</p> :
        unavailable.data.map((date) => <div className="row between wrap gap-2" key={date}><time dateTime={date}>{new Date(`${date}T12:00:00Z`).toLocaleDateString("en-GB")}</time>
          <button className="btn btn-ghost" type="button" disabled={busy !== null} onClick={() => void unblock(date)}>Make available</button></div>)}
    </section>
    {listings.isPending ? <p>Loading listings...</p> : listings.isError ? <p role="alert">Could not load your listings.</p> :
      listings.data.length === 0 ? <p>No listings yet.</p> : listings.data.map((listing) =>
        <form className="card card-pad row wrap gap-3" key={listing.id} onSubmit={(event) => void save(event, listing.id)}>
          <strong className="grow">{listing.title}</strong>
          <label className="field"><span className="label">Slots per day</span><input className="input" type="number" name="slots" min={1} max={20} defaultValue={listing.inspectionSlotsPerDay ?? 3} required /></label>
          <button className="btn btn-primary" type="submit" disabled={busy !== null}>{busy === listing.id ? "Saving..." : "Save"}</button>
        </form>)}
  </div>;
}
