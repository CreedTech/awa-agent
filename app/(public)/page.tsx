import Link from "next/link";
import { Icon } from "@/components/ui/icon";
import { HomeHero } from "@/components/site/home-hero";
import { FeaturedProperties } from "@/components/property/featured-properties";
import { AreaIndex } from "@/components/site/area-index";
import { ProcessSteps } from "@/components/site/process-steps";
import { SafetySplit } from "@/components/site/safety-split";
import { CostComparison } from "@/components/site/cost-comparison";
import { PartnerSection } from "@/components/site/partner-section";
import { FaqList } from "@/components/site/faq-list";
import { env } from "@/lib/env";

const FAQ = [
  {
    q: "What does the listed price cover?",
    a: "It is the first-year price: the base rent plus the agent's commission and AwaAgent's 2.5% fee, shown as one amount. There are no agency, agreement or viewing fees on top. From year two you pay the base rent only.",
  },
  {
    q: "Who can request an inspection?",
    a: (
      <>
        A tenant account with a verified identity and active inspection access. <Link href="/pricing">See the current price</Link>.
      </>
    ),
  },
  {
    q: "Can I message the agent or landlord?",
    a: "No. AwaAgent has no direct messages, so prices can't be renegotiated and no one can ask for off-platform payments. Every step, from booking a visit to paying, happens in your account.",
  },
  {
    q: "Why can't I see the street address?",
    a: "To protect landlords, agents and tenants, the address is shared only after the agent assigned to the home confirms your code in person.",
  },
  {
    q: "Can I pay rent through AwaAgent?",
    a: env.rentCheckoutLive
      ? "Yes. Start payment from your AwaAgent account after your inspection. Never transfer rent to an agent or landlord directly."
      : "Not yet. When it opens, your payment is held by AwaAgent and only paid out to the landlord and agent after you confirm you have the keys. Until then, do not transfer rent to anyone you met through a listing.",
  },
];

export default function HomePage() {
  return (
    <>
      <HomeHero />
      <FeaturedProperties />
      <AreaIndex />
      <section className="aw-section aw-wrap" aria-labelledby="price-heading">
        <div className="aw-section-head">
          <h2 id="price-heading" className="aw-h2">One price. No surprise fees.</h2>
          <Link href="/pricing" className="aw-link-arrow">How pricing works <Icon name="arrowR" size={16} /></Link>
        </div>
        <CostComparison />
      </section>
      <section className="aw-process" aria-labelledby="process-heading">
        <div className="aw-wrap">
          <div className="aw-section-head">
            <h2 id="process-heading" className="aw-h2">How a visit works</h2>
            <Link href="/how-it-works" className="aw-link-arrow">The full process <Icon name="arrowR" size={16} /></Link>
          </div>
          <ProcessSteps />
        </div>
      </section>
      <SafetySplit />
      <PartnerSection />
      <section className="aw-section aw-wrap aw-faq-wrap" aria-labelledby="faq-heading">
        <h2 id="faq-heading" className="aw-h2">Questions renters ask</h2>
        <FaqList items={FAQ} />
      </section>
    </>
  );
}
