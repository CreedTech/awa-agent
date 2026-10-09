"use client";

import Link from "next/link";
import { useQuery } from "@tanstack/react-query";
import { Icon } from "@/components/ui/icon";
import { PriceBreakdown } from "@/components/property/price-breakdown";
import { useAuthStore } from "@/store/auth-store";
import { subscriptionService } from "@/services/subscription-service";
import { useInspectionPrice } from "@/hooks/use-inspection-price";
import { env } from "@/lib/env";
import { formatCurrency, formatDate } from "@/lib/utils";
import type { Property } from "@/lib/types";

interface InspectionPanelProps {
  property: Property;
  onRequest: () => void;
}

type Step = { label: string; state: "done" | "todo" | "wait" | "info"; note: React.ReactNode };

export function InspectionPanel({ property, onRequest }: InspectionPanelProps) {
  const role = useAuthStore((s) => s.role);
  const isAuthed = useAuthStore((s) => s.isAuthenticated);
  const hydrated = useAuthStore((s) => s.hydrated);
  const kyc = useAuthStore((s) => s.account?.kycStatus);
  const isTenant = hydrated && isAuthed && role === "tenant";
  const isPartner = hydrated && isAuthed && role !== "tenant" && role !== "guest";
  const price = useInspectionPrice();
  const subscription = useQuery({ queryKey: ["subscription"], queryFn: subscriptionService.mine, enabled: isTenant });

  const accessPrice = price.data ? `${formatCurrency(price.data.priceNaira)} for ${price.data.durationDays} days` : "Paid monthly access";
  const accessActive =
    subscription.data && subscription.data.tier !== "GUEST" && (!subscription.data.expiresAt || new Date(subscription.data.expiresAt) > new Date());

  const steps: Step[] = [
    isTenant
      ? { label: "Tenant account", state: "done", note: "Signed in" }
      : { label: "Tenant account", state: "info", note: <><Link href="/auth/login">Sign in</Link> or <Link href="/auth/signup?role=tenant">create one</Link></> },
    !isTenant
      ? { label: "Verified identity", state: "info", note: "Checked by an AwaAgent reviewer" }
      : kyc === "VERIFIED"
        ? { label: "Verified identity", state: "done", note: "Verified" }
        : kyc === "PENDING"
          ? { label: "Verified identity", state: "wait", note: "Under review" }
          : { label: "Verified identity", state: "todo", note: <Link href="/tenant/kyc">Submit your ID</Link> },
    !isTenant
      ? { label: "Inspection access", state: "info", note: <Link href="/pricing">{accessPrice}</Link> }
      : subscription.isPending
        ? { label: "Inspection access", state: "info", note: "Checking..." }
        : accessActive
          ? { label: "Inspection access", state: "done", note: subscription.data?.expiresAt ? `Active until ${formatDate(subscription.data.expiresAt)}` : "Active" }
          : { label: "Inspection access", state: "todo", note: <Link href="/tenant/subscription">Get access · {accessPrice}</Link> },
  ];

  return (
    <div className="aw-panel">
      <PriceBreakdown property={property} />

      <div className="aw-panel-steps">
        <h2>To request a visit</h2>
        <ul>
          {steps.map((step) => (
            <li key={step.label} className={`is-${step.state}`}>
              <span className="aw-step-mark" aria-hidden>
                {step.state === "done" && <Icon name="check" size={14} strokeWidth={2.4} />}
              </span>
              <span className="aw-step-label">{step.label}</span>
              <span className="aw-step-note">{step.note}</span>
            </li>
          ))}
        </ul>
      </div>

      {!property.available ? (
        <button type="button" className="aw-btn aw-btn-clay aw-btn-block" disabled>Not taking inspections</button>
      ) : isPartner ? (
        <>
          <button type="button" className="aw-btn aw-btn-clay aw-btn-block" disabled>Request an inspection</button>
          <p className="aw-panel-note">Inspections are requested from tenant accounts.</p>
        </>
      ) : (
        <button type="button" className="aw-btn aw-btn-clay aw-btn-block" onClick={onRequest}>
          <Icon name="calendar" size={18} /> Request an inspection
        </button>
      )}

      <ul className="aw-panel-facts">
        <li>
          <Icon name="lock" size={17} />
          <span>The street address appears in your account after the agent enters your code at the property.</span>
        </li>
        <li>
          <Icon name="wallet" size={17} />
          <span>
            {env.rentCheckoutLive
              ? "Pay rent only from your AwaAgent account. Never transfer money to an agent or landlord directly."
              : "Online rent payment is not open yet. Do not transfer rent to anyone directly."}
          </span>
        </li>
      </ul>
    </div>
  );
}
