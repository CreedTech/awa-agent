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
    icon: "home" as const,
    features: [
      "Escrow-protected payments",
      "Verified inspections",
      "Total price shown upfront",
      "Dispute protection",
    ],
  },
  {
    name: "Premium",
    price: "₦2,500",
    sub: "per month",
    featured: true,
    icon: "star" as const,
    features: [
      "Everything in Basic",
      "Priority inspection slots",
      "Reduced 2% escrow fee",
      "Faster dispute handling",
      "Saved-search alerts",
    ],
  },
  {
    name: "Priority",
    price: "₦6,000",
    sub: "per month",
    featured: false,
    icon: "shieldCheck" as const,
    features: [
      "Everything in Premium",
      "Dedicated support agent",
      "1.5% escrow fee",
      "Early access to new listings",
      "Relocation concierge",
    ],
  },
];

const PRICE_RULES = [
  { icon: "explore" as const,     rule: "Every listing shows one total first-year price before you book or pay." },
  { icon: "lock"    as const,     rule: "No viewing fee is allowed on AwaAgent — ever." },
  { icon: "calendar" as const,    rule: "Renewal pricing is lower after the first year — agent commission is not charged again." },
];

export default function PricingPage() {
  return (
    <>
      {/* ── HEADER ── */}
      <section className="pricing-header">
        <div className="pricing-header-glow pricing-header-glow-1" />
        <div className="pricing-header-glow pricing-header-glow-2" />
        <div className="page" style={{ position: "relative", zIndex: 2, textAlign: "center" }}>
          <span className="tag tag-gold anim-up" style={{ marginBottom: 16, animationDelay: "0.05s" }}>
            <Icon name="shieldCheck" size={13} /> Transparent pricing
          </span>
          <h1 className="pricing-hero-title anim-up" style={{ animationDelay: "0.12s" }}>
            Simple, <span className="text-gradient">honest</span> pricing
          </h1>
          <p className="pricing-hero-sub anim-up" style={{ animationDelay: "0.2s" }}>
            No hidden charges. No illegal viewing fees. Ever.
          </p>
        </div>
      </section>

      {/* ── TIERS ── */}
      <section className="page" style={{ paddingTop: 0 }}>
        <div className="pricing-grid">
          {TIERS.map((t, i) => (
            <div
              key={t.name}
              className={`pricing-card anim-up ${t.featured ? "pricing-card-featured" : ""}`}
              style={{ animationDelay: `${i * 0.12}s` }}
            >
              {t.featured && (
                <div className="pricing-popular-badge">
                  <Icon name="star" size={12} /> Most popular
                </div>
              )}

              <div className="pricing-card-icon">
                <Icon name={t.icon} size={22} />
              </div>

              <div className="pricing-card-name">{t.name}</div>

              <div className="pricing-price-row">
                <span className="pricing-price">{t.price}</span>
                <span className="pricing-price-sub">{t.sub}</span>
              </div>

              <div className="pricing-divider" />

              <div className="pricing-features">
                {t.features.map((f) => (
                  <div key={f} className="pricing-feature">
                    <span className="pricing-feature-check">
                      <Icon name="check" size={13} strokeWidth={2.6} />
                    </span>
                    {f}
                  </div>
                ))}
              </div>

              <Link
                href="/auth/signup"
                className={`btn ${t.featured ? "btn-gold" : "btn-ghost"} btn-block`}
                style={{ marginTop: "auto" }}
              >
                {t.price === "Free" ? "Get started free" : `Choose ${t.name}`}
              </Link>
            </div>
          ))}
        </div>
      </section>

      {/* ── PRICE RULES ── */}
      <section className="page page-narrow" style={{ paddingTop: 0 }}>
        <div className="page-head">
          <h2 className="page-title">What renters see</h2>
          <p className="page-sub">One total upfront price — no line-item surprises while browsing.</p>
        </div>
        <div className="pricing-rules-grid">
          {PRICE_RULES.map((r, i) => (
            <div key={r.rule} className="pricing-rule-card anim-up" style={{ animationDelay: `${i * 0.1}s` }}>
              <div className="pricing-rule-icon">
                <Icon name={r.icon} size={20} />
              </div>
              <p style={{ fontSize: 14.5, color: "var(--ink-2)", lineHeight: 1.65, margin: 0 }}>{r.rule}</p>
            </div>
          ))}
        </div>
      </section>

      {/* ── ESCROW CTA BAND ── */}
      <section className="page page-narrow" style={{ paddingTop: 0 }}>
        <div className="pricing-cta-band">
          <div className="pricing-cta-band-bg" />
          <div
            className="pricing-cta-img"
            style={{
              backgroundImage:
                'url("https://images.unsplash.com/photo-1560518883-ce09059eeffa?w=900&h=500&fit=crop&auto=format&q=70")',
            }}
          />
          <div className="pricing-cta-content">
            <span className="tag tag-gold" style={{ width: "fit-content" }}>
              <Icon name="lock" size={13} /> Escrow-protected
            </span>
            <h2 style={{ color: "#fff", fontSize: 26, lineHeight: 1.2, maxWidth: 360 }}>
              Every plan includes full escrow protection.
            </h2>
            <p style={{ color: "rgba(255,255,255,.75)", fontSize: 15, lineHeight: 1.7 }}>
              Regardless of your tier, your rent is never released until you confirm you've received your keys.
            </p>
            <div className="row gap-3 wrap">
              <Link href="/auth/signup" className="btn btn-gold btn-sm">
                Get started free <Icon name="arrowR" size={15} />
              </Link>
              <Link href="/how-it-works" className="btn btn-sm" style={{ background: "rgba(255,255,255,.12)", color: "#fff", boxShadow: "inset 0 0 0 1.4px rgba(255,255,255,.25)" }}>
                How it works
              </Link>
            </div>
          </div>
        </div>
      </section>

      <Footer />
    </>
  );
}