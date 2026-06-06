import type { Metadata } from "next";
import Link from "next/link";
import { Icon } from "@/components/ui/icon";
import { Footer } from "@/components/layout/footer";

export const metadata: Metadata = { title: "Pricing" };

const TIERS = [
  {
    name: "Basic",
    price: "Free",
    sub: "For every renter",
    featured: false,
    features: ["Escrow-protected payments", "Verified inspections", "Total price shown upfront", "Dispute protection"],
  },
  {
    name: "Premium",
    price: "₦2,500",
    sub: "per month",
    featured: true,
    features: ["Everything in Basic", "Priority inspection slots", "Reduced 2% escrow fee", "Faster dispute handling", "Saved-search alerts"],
  },
  {
    name: "Priority",
    price: "₦6,000",
    sub: "per month",
    featured: false,
    features: ["Everything in Premium", "Dedicated support agent", "1.5% escrow fee", "Early access to new listings", "Relocation concierge"],
  },
];

const PRICE_RULES = [
  "Every listing shows one total first-year price before you book or pay.",
  "No viewing fee is allowed on AwaAgent.",
  "Renewal pricing is lower after the first year.",
];

export default function PricingPage() {
  return (
    <>
      <section className="page">
        <div className="page-head" style={{ textAlign: "center" }}>
          <h1 className="page-title" style={{ fontSize: 38 }}>Simple, honest pricing</h1>
          <p className="page-sub" style={{ fontSize: 16 }}>No hidden charges. No illegal viewing fees. Ever.</p>
        </div>

        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(260px, 1fr))", gap: 18, maxWidth: 980, margin: "0 auto" }}>
          {TIERS.map((t) => (
            <div
              key={t.name}
              className="card card-pad col gap-4"
              style={t.featured ? { border: "2px solid var(--gold-500)", boxShadow: "var(--sh-3)" } : undefined}
            >
              <div className="row between">
                <h3 style={{ fontSize: 19 }}>{t.name}</h3>
                {t.featured && <span className="tag tag-gold">Popular</span>}
              </div>
              <div className="col" style={{ gap: 0 }}>
                <span style={{ fontFamily: "var(--font-display)", fontSize: 34, fontWeight: 800 }}>{t.price}</span>
                <span style={{ fontSize: 13, color: "var(--muted)" }}>{t.sub}</span>
              </div>
              <div className="col gap-3" style={{ flex: 1 }}>
                {t.features.map((f) => (
                  <span key={f} className="row gap-2" style={{ fontSize: 14 }}>
                    <Icon name="check" size={16} strokeWidth={2.2} color="var(--ok)" /> {f}
                  </span>
                ))}
              </div>
              <Link href="/auth/signup" className={`btn ${t.featured ? "btn-gold" : "btn-ghost"} btn-block`}>
                {t.price === "Free" ? "Get started" : "Choose plan"}
              </Link>
            </div>
          ))}
        </div>
      </section>

      <section className="page page-narrow">
        <div className="page-head"><h2 className="page-title">What renters see</h2>
          <p className="page-sub">One total upfront price - no line-item surprises while browsing.</p>
        </div>
        <div className="card card-pad col gap-3">
          {PRICE_RULES.map((rule) => (
            <div key={rule} className="row gap-3">
              <span className="grid place-items-center" style={{ width: 26, height: 26, borderRadius: "50%", background: "var(--ok-bg)", color: "var(--ok)", flex: "0 0 auto" }}>
                <Icon name="check" size={15} strokeWidth={2.4} />
              </span>
              <span style={{ fontSize: 14.5, color: "var(--ink-2)" }}>{rule}</span>
            </div>
          ))}
        </div>
      </section>
      <Footer />
    </>
  );
}
