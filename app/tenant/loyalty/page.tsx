"use client";

import { useQuery } from "@tanstack/react-query";
import { escrowService } from "@/services/escrow-service";
import { PageHeader } from "@/components/shared/page-header";
import { Naira } from "@/components/shared/naira";

export default function Page() {
  const payments = useQuery({ queryKey: ["tenant-payments"], queryFn: escrowService.mine });
  const completed = payments.data?.filter((item) => item.status === "SETTLED") ?? [];
  return <div className="page page-narrow col gap-4">
    <PageHeader title="Rental history" subtitle="Your confirmed settled rentals, recorded from actual payment transactions." />
    {payments.isPending ? <p>Loading rental history...</p> : payments.isError ? <p role="alert">Could not load your rental history.</p> :
      <><div className="card card-pad row between wrap gap-3"><div className="col"><strong>{completed.length}</strong><span>Completed rentals</span></div><div className="col"><Naira value={completed.reduce((sum, item) => sum + item.grossAmount, 0)} size={22} /><span>Total settled rent</span></div></div>
        {completed.length === 0 ? <p>No completed rentals yet.</p> : completed.map((item) =>
          <article className="card card-pad row between wrap gap-3" key={item.id}>
            <div className="col gap-1"><strong>{item.propertyTitle}</strong><span>{item.settledAt ? new Date(item.settledAt).toLocaleDateString("en-GB") : item.id}</span></div>
            <Naira value={item.grossAmount} size={18} />
          </article>)}
      </>}
  </div>;
}
