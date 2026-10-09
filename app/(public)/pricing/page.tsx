"use client";

import Link from "next/link";
import { Icon } from "@/components/ui/icon";
import { LoadError } from "@/components/property/load-error";
import { CostComparison } from "@/components/site/cost-comparison";
import { useInspectionPrice } from "@/hooks/use-inspection-price";
import { env } from "@/lib/env";
import { formatCurrency } from "@/lib/utils";

export default function PricingPage() {
  const pricing = useInspectionPrice();

  return (
    <>
      <section className="aw-wrap aw-page-head">
        <h1 className="aw-h1">Pricing</h1>
        <p className="aw-lede">Tenants pay two things on AwaAgent: inspection access, and the first-year price on the listing. No agency, agreement or viewing fees.</p>
      </section>

      <section className="aw-wrap aw-pricing">
        {pricing.isPending ? (
          <div className="aw-price-card" aria-busy="true">
            <span className="aw-shimmer aw-line-md" />
            <span className="aw-shimmer aw-line-lg" />
          </div>
        ) : pricing.isError ? (
          <LoadError title="We couldn't load the current price" message="The price comes from live settings. Try again in a moment." onRetry={() => pricing.refetch()} retrying={pricing.isFetching} />
        ) : (
          <div className="aw-price-card">
            <span className="aw-price-label">1 · Inspection access</span>
            <strong className="aw-price-amount num">{formatCurrency(pricing.data.priceNaira)}</strong>
            <span className="aw-price-period">for {pricing.data.durationDays} days, starting when Paystack confirms your payment</span>
            <ul>
              <li><Icon name="check" size={18} /> Request inspections on any open listing during those days</li>
              <li><Icon name="check" size={18} /> Get a six-digit code for each visit</li>
              <li><Icon name="check" size={18} /> See the street address after the agent confirms your code</li>
            </ul>
            <Link href="/tenant/subscription" className="aw-btn aw-btn-ink aw-btn-block">Get inspection access</Link>
            <p className="aw-panel-note">You also need a tenant account and a verified identity to request a visit.</p>
          </div>
        )}

        <div className="aw-price-card aw-price-card-wide">
          <span className="aw-price-label">2 · First-year price</span>
          <p className="aw-price-period">
            Every listing shows one first-year price. It is the base rent plus the agent&apos;s commission and AwaAgent&apos;s 2.5% fee, so there are no agency, agreement or viewing fees on top. From year two you pay the base rent only.
          </p>
          <CostComparison />
        </div>
      </section>

      <section className="aw-wrap aw-section" aria-labelledby="rules-heading">
        <h2 id="rules-heading" className="aw-h2">Rules behind every price</h2>
        <dl className="aw-ledger aw-pricing-rules">
          <div>
            <dt>Pay after your visit</dt>
            <dd>Checkout only opens once your in-person inspection for that home is complete.</dd>
          </div>
          <div>
            <dt>Rent payment</dt>
            <dd>
              {env.rentCheckoutLive
                ? "Pay from your AwaAgent account through Paystack. Your money is held and only paid to the landlord and agent after you confirm you have the keys."
                : "When online payment opens, your rent is held and only paid out after you confirm you have the keys. It isn't open yet, so do not transfer rent to anyone directly."}
            </dd>
          </div>
          <div>
            <dt>Year two</dt>
            <dd>Rent drops to the base rent, with no commission or fee. Each listing shows its year-two rent.</dd>
          </div>
          <div>
            <dt>Deposits</dt>
            <dd>If the landlord asks for a security deposit or service charge, the listing shows it. Neither is part of AwaAgent checkout.</dd>
          </div>
          <div>
            <dt>Viewing fees</dt>
            <dd>Do not pay a viewing fee or any money at the property. Inspection access is the only fee before you rent.</dd>
          </div>
          <div>
            <dt>Questions</dt>
            <dd><a href={`mailto:${env.supportEmail}`}>{env.supportEmail}</a></dd>
          </div>
        </dl>
      </section>
    </>
  );
}
