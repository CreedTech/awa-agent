"use client";

import Link from "next/link";
import { useQuery } from "@tanstack/react-query";
import { subscriptionService } from "@/services/subscription-service";
import { inspectionService } from "@/services/inspection-service";
import { escrowService } from "@/services/escrow-service";
import { PageHeader } from "@/components/shared/page-header";

export default function Page() {
  const subscription = useQuery({ queryKey: ["tenant-subscription"], queryFn: subscriptionService.mine });
  const inspections = useQuery({ queryKey: ["tenant-inspections"], queryFn: inspectionService.list });
  const payments = useQuery({ queryKey: ["tenant-payments"], queryFn: escrowService.mine });
  return <div className="page page-narrow col gap-4">
    <PageHeader title="Your dashboard" subtitle="Your live inspection access, visits and rent payments." />
    {subscription.isPending || inspections.isPending || payments.isPending ? <p>Loading your account...</p> :
      subscription.isError || inspections.isError || payments.isError ? <p role="alert">Could not load your account summary.</p> :
      <div className="grid grid-cols-2 gap-3">
        <Link className="card card-pad col gap-2" href="/tenant/subscription"><strong>{subscription.data.tier === "TIER1" ? "Active" : "Inactive"}</strong><span>Inspection access</span></Link>
        <Link className="card card-pad col gap-2" href="/tenant/inspections"><strong>{inspections.data.filter((item) => item.status === "REQUESTED").length}</strong><span>Upcoming inspections</span></Link>
        <Link className="card card-pad col gap-2" href="/tenant/escrow"><strong>{payments.data.filter((item) => ["FUNDS_LOCKED", "RELEASE_PENDING", "DISPUTED"].includes(item.status)).length}</strong><span>Active payments</span></Link>
        <Link className="card card-pad col gap-2" href="/tenant/receipts"><strong>{payments.data.filter((item) => Boolean(item.fundsLockedAt)).length}</strong><span>Verified receipts</span></Link>
      </div>}
    <Link className="btn btn-primary" href="/explore">Explore properties</Link>
    <Link className="btn btn-ghost" href="/tenant/loyalty">View rental history</Link>
  </div>;
}
