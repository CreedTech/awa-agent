"use client";

import { Suspense } from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { useQuery } from "@tanstack/react-query";
import { escrowService } from "@/services/escrow-service";
import { PageHeader } from "@/components/shared/page-header";
import { TransactionList } from "@/components/escrow/transaction-list";

function PaymentReturn() {
  const reference = useSearchParams().get("reference") ?? "";
  const payment = useQuery({
    queryKey: ["payment-return", reference],
    queryFn: async () => { await escrowService.verify(reference); return escrowService.get(reference); },
    enabled: Boolean(reference), retry: false,
  });

  if (!reference) return <TransactionList title="Payments" subtitle="Your rent transactions and payout status." tenantLinks />;

  return <div className="page page-narrow col gap-5">
    <PageHeader title="Payment status" subtitle="AwaAgent checks the transaction directly with Paystack." />
    {payment.isPending ?
      <p>Confirming payment with Paystack...</p> : payment.isError ?
      <div className="col gap-3"><p role="alert">Payment could not be confirmed yet. If you paid, do not start another checkout.</p>
        <button className="btn btn-primary" onClick={() => payment.refetch()}>Check again</button></div> :
      <div className="card card-pad col gap-3"><strong>Payment confirmed</strong><p>Status: {payment.data.status}</p>
        <Link className="btn btn-primary" href={`/tenant/escrow/${encodeURIComponent(reference)}`}>View transaction</Link></div>}
    <Link href="/tenant/inspections" className="btn btn-quiet">Back to inspections</Link>
  </div>;
}

export default function TenantEscrowPage() {
  return <Suspense fallback={<div className="page">Loading payment...</div>}><PaymentReturn /></Suspense>;
}
