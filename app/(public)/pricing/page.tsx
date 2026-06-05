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
    features: ["Escrow-protected payments", "Verified inspections", "Transparent rent breakdown", "Dispute protection"],
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

const FEES = [
  { label: "Base rent", value: "Set by landlord", note: "Paid to the landlord" },
  { label: "Agent commission", value: "8–10%", note: "Based on agent trust score" },
  { label: "Escrow service fee", value: "2.5%", note: "Year 1 - protects your money" },
  { label: "Year 2 renewal", value: "Base rent only", note: "No commission, 1% escrow fee" },
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
        <div className="page-head"><h2 className="page-title">How rent is calculated</h2>
          <p className="page-sub">Every figure is shown to you up front - no surprises at the door.</p>
        </div>
        <div className="card">
          {FEES.map((f) => (
            <div key={f.label} className="brk-row" style={{ padding: "16px 20px" }}>
              <div className="col" style={{ gap: 2 }}>
                <strong style={{ fontSize: 14.5 }}>{f.label}</strong>
                <span style={{ fontSize: 12.5, color: "var(--muted)" }}>{f.note}</span>
              </div>
              <strong style={{ fontFamily: "var(--font-display)", fontSize: 16 }}>{f.value}</strong>
            </div>
          ))}
        </div>
      </section>
      <Footer />
    </>
  );
}
