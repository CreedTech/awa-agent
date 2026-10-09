"use client";

import { Suspense, useState } from "react";
import { useSearchParams } from "next/navigation";
import { useQuery } from "@tanstack/react-query";
import { subscriptionService } from "@/services/subscription-service";
import { PageHeader } from "@/components/shared/page-header";
import { Naira } from "@/components/shared/naira";
import { ApiError } from "@/lib/api";

function SubscriptionContent() {
  const reference = useSearchParams().get("reference") ?? "";
  const subscription = useQuery({ queryKey: ["subscription"], queryFn: subscriptionService.mine });
  const returnedPayment = useQuery({ queryKey: ["subscription-payment", reference],
    queryFn: async () => { await subscriptionService.verify(reference); return subscriptionService.mine(); },
    enabled: Boolean(reference), retry: false });
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const begin = async () => {
    setBusy(true); setError(null);
    try { const session = await subscriptionService.initialize(); window.location.assign(session.checkoutUrl); }
    catch (cause) { setError(cause instanceof ApiError && cause.status >= 500 ? "We couldn't open checkout right now. Please try again later." : cause instanceof Error ? cause.message : "Could not open Paystack checkout."); setBusy(false); }
  };

  const current = returnedPayment.data ?? subscription.data;
  return <div className="page page-narrow col gap-5">
    <PageHeader title="Inspection access" subtitle="Thirty days of inspection booking access, paid through Paystack." />
    {reference && (returnedPayment.isPending ? <p>Confirming payment...</p> : returnedPayment.isError ?
      <div className="col gap-2"><p role="alert">Payment has not been confirmed yet. Do not pay again.</p>
        <button className="btn btn-ghost" onClick={() => returnedPayment.refetch()}>Check again</button></div> : <p role="status">Payment confirmed.</p>)}
    {subscription.isPending ? <p>Loading your access...</p> : subscription.isError ? <p role="alert">Could not load subscription.</p> : current &&
      <div className="card card-pad col gap-4">
        <h2 style={{ fontSize: 20 }}>{current.tier === "TIER1" ? "Access active" : "Guest access"}</h2>
        <div className="row gap-2"><Naira value={current.priceNaira} size={22} /><span>for 30 days</span></div>
        {current.expiresAt && <p>Available until {new Date(current.expiresAt).toLocaleDateString("en-GB")}</p>}
        <p style={{ color: "var(--muted)" }}>Payment gives inspection booking access. Identity verification is also required to book.</p>
        {current.pendingCheckout?.checkoutUrl ? <a className="btn btn-primary" href={current.pendingCheckout.checkoutUrl}>Continue existing Paystack checkout</a> :
          <button className="btn btn-primary" disabled={busy} onClick={begin}>{busy ? "Opening checkout..." : current.tier === "TIER1" ? "Renew access" : "Get access"}</button>}
      </div>}
    {error && <p role="alert" style={{ color: "var(--danger)" }}>{error}</p>}
  </div>;
}

export default function SubscriptionPage() {
  return <Suspense fallback={<div className="page">Loading subscription...</div>}><SubscriptionContent /></Suspense>;
}
