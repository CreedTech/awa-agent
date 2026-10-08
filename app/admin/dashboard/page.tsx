"use client";

import { useQuery } from "@tanstack/react-query";
import { adminService } from "@/services/admin-service";
import { PageHeader } from "@/components/shared/page-header";

export default function Page() {
  const summary = useQuery({ queryKey: ["admin-dashboard"], queryFn: adminService.dashboard });
  return <div className="page page-narrow col gap-4">
    <PageHeader title="Operations dashboard" subtitle="Counts from the live platform database." />
    {summary.isPending ? <p>Loading operations...</p> : summary.isError ? <p role="alert">Could not load the dashboard.</p> :
      <div className="grid grid-cols-2 gap-3">{[
        ["Active accounts", summary.data.activeUsers], ["Live properties", summary.data.liveProperties],
        ["Listings to review", summary.data.pendingProperties], ["Identity reviews", summary.data.pendingKyc],
        ["Pending inspections", summary.data.pendingInspections], ["Open payment cases", summary.data.openPayments],
      ].map(([label, count]) => <div className="card card-pad col gap-2" key={label}><strong>{count}</strong><span>{label}</span></div>)}</div>}
  </div>;
}
