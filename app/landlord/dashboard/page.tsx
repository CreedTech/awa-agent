"use client";

import Link from "next/link";
import { useQuery } from "@tanstack/react-query";
import { propertyService } from "@/services/property-service";
import { inspectionService } from "@/services/inspection-service";
import { authorizationService } from "@/services/authorization-service";
import { PageHeader } from "@/components/shared/page-header";

export default function Page() {
  const listings = useQuery({ queryKey: ["landlord-properties"], queryFn: propertyService.mine });
  const inspections = useQuery({ queryKey: ["landlord-inspections"], queryFn: inspectionService.list });
  const agents = useQuery({ queryKey: ["my-agents"], queryFn: authorizationService.myAgents });
  return <div className="page page-narrow col gap-4">
    <PageHeader title="Landlord dashboard" subtitle="Your properties, visits and agents." />
    {listings.isPending || inspections.isPending || agents.isPending ? <p>Loading your dashboard...</p> :
      listings.isError || inspections.isError || agents.isError ? <p role="alert">Could not load your dashboard.</p> :
      <div className="grid grid-cols-2 gap-3">
        <Link className="card card-pad col gap-2" href="/landlord/properties"><strong>{listings.data.length}</strong><span>Your properties</span></Link>
        <Link className="card card-pad col gap-2" href="/landlord/inspections"><strong>{inspections.data.filter((item) => item.status === "REQUESTED").length}</strong><span>Upcoming inspections</span></Link>
        <Link className="card card-pad col gap-2" href="/landlord/agents"><strong>{agents.data.filter((item) => item.status === "ACTIVE").length}</strong><span>Active agents</span></Link>
      </div>}
    <Link className="btn btn-primary" href="/landlord/agents">Manage agents</Link>
  </div>;
}
