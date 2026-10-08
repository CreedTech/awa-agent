"use client";

import { useState } from "react";
import Link from "next/link";
import { useQuery } from "@tanstack/react-query";
import { propertyService } from "@/services/property-service";
import { PageHeader } from "@/components/shared/page-header";

export default function Page() {
  const listings = useQuery({ queryKey: ["admin-properties"], queryFn: propertyService.mine });
  const [busy, setBusy] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const decide = async (id: string, status: "AVAILABLE" | "PAUSED" | "REJECTED" | "REMOVED") => {
    setBusy(id); setError(null);
    try { await propertyService.setModerationStatus(id, status); await listings.refetch(); }
    catch (cause) { setError(cause instanceof Error ? cause.message : "Could not update property."); }
    finally { setBusy(null); }
  };
  return <div className="page page-narrow col gap-4">
    <PageHeader title="Property review" subtitle="Review submitted listings before they become public." />
    {error && <p role="alert">{error}</p>}
    {listings.isPending ? <p>Loading properties...</p> : listings.isError ? <p role="alert">Could not load properties.</p> :
      listings.data.length === 0 ? <p>No properties have been submitted.</p> : listings.data.map((property) =>
        <div className="card card-pad col gap-3" key={property.id}>
          <strong>{property.title}</strong><span>{property.area} · {property.status.replaceAll("_", " ")}</span>
          <Link href={`/admin/properties/${property.id}`}>Review details</Link>
          <div className="row gap-2 wrap">
            {property.status !== "LIVE" && property.status !== "REMOVED" && <button className="btn btn-primary" disabled={busy !== null} onClick={() => void decide(property.id, "AVAILABLE")}>Approve and publish</button>}
            {property.status !== "REJECTED" && property.status !== "REMOVED" && <button className="btn btn-ghost" disabled={busy !== null} onClick={() => void decide(property.id, "REJECTED")}>Reject</button>}
            {property.status === "LIVE" && <button className="btn btn-ghost" disabled={busy !== null} onClick={() => void decide(property.id, "PAUSED")}>Pause</button>}
            {property.status !== "REMOVED" && <button className="btn btn-ghost" disabled={busy !== null} onClick={() => void decide(property.id, "REMOVED")}>Remove</button>}
          </div>
        </div>)}
  </div>;
}
