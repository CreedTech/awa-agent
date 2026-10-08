"use client";

import Link from "next/link";
import { useQuery } from "@tanstack/react-query";
import { propertyService } from "@/services/property-service";
import { inspectionService } from "@/services/inspection-service";
import { authorizationService } from "@/services/authorization-service";
import { PageHeader } from "@/components/shared/page-header";

export default function Page() {
  const listings = useQuery({ queryKey: ["agent-properties"], queryFn: propertyService.mine });
  const inspections = useQuery({ queryKey: ["agent-inspections"], queryFn: inspectionService.list });
  const landlords = useQuery({ queryKey: ["my-landlords"], queryFn: authorizationService.myLandlords });
  return <div className="page page-narrow col gap-4">
    <PageHeader title="Agent dashboard" subtitle="Your listings, inspections and landlord authorizations." />
    {listings.isPending || inspections.isPending || landlords.isPending ? <p>Loading your dashboard...</p> :
      listings.isError || inspections.isError || landlords.isError ? <p role="alert">Could not load your dashboard.</p> :
      <div className="grid grid-cols-2 gap-3">
        <Link className="card card-pad col gap-2" href="/agent/properties"><strong>{listings.data.length}</strong><span>Your listings</span></Link>
        <Link className="card card-pad col gap-2" href="/agent/inspections"><strong>{inspections.data.filter((item) => item.status === "REQUESTED").length}</strong><span>Pending inspections</span></Link>
        <Link className="card card-pad col gap-2" href="/agent/landlord-authorizations"><strong>{landlords.data.filter((item) => item.status === "ACTIVE").length}</strong><span>Active authorizations</span></Link>
      </div>}
    <Link className="btn btn-primary" href="/agent/properties/new">Submit a listing</Link>
  </div>;
}
