"use client";

import { useState } from "react";
import Link from "next/link";
import { useQuery } from "@tanstack/react-query";
import { propertyService } from "@/services/property-service";
import { PageHeader } from "@/components/shared/page-header";
import { Naira } from "@/components/shared/naira";

export function ManagedProperties({ role }: { role: "agent" | "landlord" }) {
  const listings = useQuery({ queryKey: ["managed-properties", role], queryFn: propertyService.mine });
  const [busy, setBusy] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  const toggle = async (id: string, available: boolean) => {
    setBusy(id); setError(null);
    try { await propertyService.setStatus(id, available ? "PAUSED" : "AVAILABLE"); await listings.refetch(); }
    catch (cause) { setError(cause instanceof Error ? cause.message : "Could not update listing."); }
    finally { setBusy(null); }
  };

  return <div className="page col gap-5">
    <PageHeader title="Properties" subtitle="Listings connected to your account." />
    {role === "agent" && <Link className="btn btn-primary" href="/agent/properties/new">Add property</Link>}
    {role === "landlord" && <p>Invite and authorize an agent before they can create a listing for you.</p>}
    {error && <p role="alert" style={{ color: "var(--danger)" }}>{error}</p>}
    {listings.isPending ? <p>Loading properties...</p> : listings.isError ? <p role="alert">Could not load properties.</p> :
      listings.data.length === 0 ? <p>No properties linked to this account yet.</p> :
      <div className="col gap-3">{listings.data.map((property) => <div key={property.id} className="card card-pad row between wrap gap-3">
        <div className="col gap-1"><Link href={`/properties/${property.id}`}><strong>{property.title}</strong></Link>
          <span>{property.area} · {property.status.replaceAll("_", " ")}</span><Naira value={property.baseRent} size={17} />
          <Link href={`/${role}/properties/${property.id}`}>Edit details</Link></div>
        {(property.status === "LIVE" || property.status === "PAUSED") && <button className="btn btn-ghost btn-sm" disabled={busy !== null}
          onClick={() => toggle(property.id, property.status === "LIVE")}>{property.status === "LIVE" ? "Pause" : "Publish"}</button>}
      </div>)}</div>}
  </div>;
}
