"use client";

import { useQuery } from "@tanstack/react-query";
import { inspectionService } from "@/services/inspection-service";
import { PageHeader } from "@/components/shared/page-header";
import { InspectionBadge } from "@/components/shared/status-badge";

export function InspectionOverview({ title }: { title: string }) {
  const inspections = useQuery({ queryKey: ["managed-inspections", title], queryFn: inspectionService.list });
  return <div className="page page-narrow col gap-4">
    <PageHeader title={title} subtitle="Live inspection requests and verification status." />
    {inspections.isPending ? <p>Loading inspections...</p> : inspections.isError ? <p role="alert">Could not load inspections.</p> :
      inspections.data.length === 0 ? <p>No inspections have been booked yet.</p> : inspections.data.map((inspection) =>
        <div className="card card-pad row between gap-3 wrap" key={inspection.id}>
          <div className="col gap-2"><strong>{inspection.propertyTitle}</strong><span>{inspection.tenantName} · {inspection.date}</span></div>
          <InspectionBadge status={inspection.status} />
        </div>)}
  </div>;
}
