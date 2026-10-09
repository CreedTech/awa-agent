import type { Metadata } from "next";
import Link from "next/link";
import { SafetyRules } from "@/components/site/safety-rules";
import { env } from "@/lib/env";

export const metadata: Metadata = {
  title: "Safety",
  description: "What AwaAgent checks, how the address gate works, and how to stay safe at an inspection.",
};

const CHECKS = [
  {
    name: "Identity review",
    what: "Tenants, agents and landlords submit ID documents. An AwaAgent reviewer approves or rejects them by hand.",
    limit: "It confirms who holds the account. It does not check someone's history or guarantee their conduct.",
  },
  {
    name: "Listing review",
    what: "An AwaAgent reviewer looks at each listing before it goes live, and agents can only list homes a landlord has authorised them to represent.",
    limit: "We do not visit every property. Your inspection is where you confirm the home matches the listing.",
  },
  {
    name: "Agent assignment",
    what: "Each listing names the agent who handles its inspections. That agent enters your code at the property to confirm the visit.",
    limit: "If someone else meets you and asks for your code, do not give it.",
  },
  {
    name: "Payment",
    what: env.rentCheckoutLive
      ? "Rent checkout runs through Paystack from your AwaAgent account, and each payment has a record in your account."
      : "Inspection access is bought from your AwaAgent account through Paystack. Online rent payment is not open yet.",
    limit: "Money sent outside your AwaAgent account has no record with us and we cannot trace it.",
  },
];

export default function TrustSafetyPage() {
  return (
    <>
      <section className="aw-wrap aw-page-head">
        <h1 className="aw-h1">Safety on AwaAgent</h1>
        <p className="aw-lede">What we check, what we don&apos;t, and the rules that protect every visit.</p>
      </section>
      <section className="aw-band" aria-label="Rules for every inspection">
        <div className="aw-wrap">
          <SafetyRules />
        </div>
      </section>
      <section className="aw-wrap aw-section" aria-labelledby="checks-heading">
        <h2 id="checks-heading" className="aw-h2">What each check means</h2>
        <div className="aw-checks-table" role="table" aria-label="Checks">
          <div role="row" className="aw-checks-row aw-checks-headrow">
            <span role="columnheader">Check</span>
            <span role="columnheader">What happens</span>
            <span role="columnheader">What it doesn&apos;t cover</span>
          </div>
          {CHECKS.map((check) => (
            <div role="row" key={check.name} className="aw-checks-row">
              <strong role="rowheader">{check.name}</strong>
              <span role="cell">{check.what}</span>
              <span role="cell" className="aw-muted">{check.limit}</span>
            </div>
          ))}
        </div>
      </section>
      <section className="aw-wrap aw-section aw-tips" aria-labelledby="visit-heading">
        <h2 id="visit-heading" className="aw-h2">On the day of your visit</h2>
        <ol className="aw-numbered">
          <li>Go in daylight and tell someone where you are going.</li>
          <li>Check the agent&apos;s name matches the one on the listing before you share your code.</li>
          <li>Do not pay a viewing fee or any money at the property.</li>
          <li>Ask about deposits and fees, and get the full amount before you decide.</li>
        </ol>
        <p className="aw-help">
          Something felt wrong? Email <a href={`mailto:${env.supportEmail}`}>{env.supportEmail}</a> with the listing link. If you already paid through your account, open a dispute from <Link href="/tenant/disputes">your disputes page</Link>.
        </p>
      </section>
    </>
  );
}
