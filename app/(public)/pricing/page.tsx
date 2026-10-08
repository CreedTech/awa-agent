"use client";

import Link from "next/link";
import { useQuery } from "@tanstack/react-query";
import { subscriptionService } from "@/services/subscription-service";
import { PageHeader } from "@/components/shared/page-header";

export default function PricingPage() {
  const pricing = useQuery({ queryKey: ["subscription-pricing"], queryFn: subscriptionService.pricing });
  return <div className="page page-narrow col gap-4">
    <PageHeader title="Inspection access" subtitle="The current price comes from the platform's live settings." />
    {pricing.isPending ? <p>Loading price...</p> : pricing.isError ? <p role="alert">Pricing is temporarily unavailable.</p> :
      <div className="card card-pad col gap-3"><strong style={{ fontSize: 30 }}>₦{pricing.data.priceNaira.toLocaleString("en-NG")}</strong>
        <p>{pricing.data.durationDays} days of inspection booking access after Paystack confirms your payment.</p>
        <Link className="btn btn-primary" href="/tenant/subscription">View subscription</Link></div>}
  </div>;
}
