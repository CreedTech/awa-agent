import type { Metadata } from "next";
import Link from "next/link";
import { ProcessSteps } from "@/components/site/process-steps";
import { InspectionPass } from "@/components/site/inspection-pass";
import { PartnerSection } from "@/components/site/partner-section";

export const metadata: Metadata = {
  title: "How it works",
  description: "How to find a rental on AwaAgent, request an inspection and meet the agent assigned to the home.",
};

export default function HowItWorksPage() {
  return (
    <>
      <section className="aw-wrap aw-page-head aw-page-head-split">
        <div>
          <h1 className="aw-h1">How renting through AwaAgent works</h1>
          <p className="aw-lede">One price with no agency or viewing fees, a verified agent at the door, and the street address only when your code matches.</p>
          <Link href="/explore" className="aw-btn aw-btn-clay">Find a home</Link>
        </div>
        <InspectionPass />
      </section>
      <section className="aw-section aw-wrap" aria-label="Steps for renters">
        <ProcessSteps />
      </section>
      <section className="aw-wrap aw-section aw-compare" aria-labelledby="what-you-pay">
        <h2 id="what-you-pay" className="aw-h2">Two different amounts</h2>
        <dl className="aw-ledger">
          <div>
            <dt>Inspection access</dt>
            <dd>Paid to AwaAgent from your tenant account. It lets you request inspections for a set number of days. <Link href="/pricing">Current price</Link></dd>
          </div>
          <div>
            <dt>First-year price</dt>
            <dd>The amount on each listing: base rent plus the agent&apos;s commission and AwaAgent&apos;s 2.5% fee, shown as one price with no agency, agreement or viewing fees. From year two you pay the base rent only. <Link href="/pricing">See an example</Link></dd>
          </div>
        </dl>
      </section>
      <PartnerSection />
    </>
  );
}
