import Link from "next/link";
import { Icon } from "@/components/ui/icon";
import { FeaturedProperties } from "@/components/property/featured-properties";
import { Footer } from "@/components/layout/footer";
import type { IconName } from "@/lib/icons";

const HOW = [
  { icon: "explore", title: "Browse live listings", body: "See available homes and their first-year prices from the AwaAgent property API." },
  { icon: "calendar", title: "Request an inspection", body: "Eligible tenant accounts can choose a preferred day and receive an inspection code." },
  { icon: "key", title: "Verify in person", body: "The assigned agent verifies the tenant's code at the property." },
  { icon: "lock", title: "Payment launch is pending", body: "Paystack checkout opens after live credentials and payment checks are complete." },
] as const;

const BENEFITS = [
  {
    icon: "home",
    audience: "For tenants",
    points: ["Live property listings", "First-year price shown", "Inspection requests", "Meeting code"],
  },
  {
    icon: "user",
    audience: "For agents",
    points: ["Assigned inspection queue", "In-person code verification", "Property details", "Backend-linked account"],
  },
  {
    icon: "building",
    audience: "For landlords",
    points: ["Backend-linked account", "Agent authorization", "Property oversight", "Payout records"],
  },
] as const;

const STATS = [
  { value: "Live", label: "Property listings" },
  { value: "Price", label: "First-year total" },
  { value: "OTP", label: "In-person checks" },
  { value: "Ibadan", label: "Current market" },
];

const FAQ = [
  { q: "How do I pay?", a: "After a verified inspection, start checkout from your AwaAgent account. Never transfer rent directly to an agent or landlord." },
  { q: "Why can't I see the exact address?", a: "The street address is shared with you after your in-person inspection code is verified." },
  { q: "What price is shown?", a: "Listings show the first-year rent amount supplied by the property owner." },
  { q: "What is the inspection code for?", a: "Read the code to your assigned agent in person so they can confirm your visit." },
];

export default function HomePage() {

  return (
    <>
   {/* ========== CINEMATIC HERO SECTION WITH IMAGE ========== */}
<section className="hero-premium-image">
  {/* Background Image */}
  <div 
    className="hero-image-bg"
    style={{
      backgroundImage: 'url("https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?w=1600&h=900&fit=crop&auto=format&q=80" )',
    }}
  ></div>
  
  {/* Overlay Gradient */}
  <div className="hero-image-overlay"></div>
  
  {/* Glow Effects */}
  <div className="hero-glow hero-glow-1"></div>
  <div className="hero-glow hero-glow-2"></div>
  
  {/* Content */}
  <div className="page" style={{ paddingTop: 80, paddingBottom: 88, position: "relative", zIndex: 2 }}>
    <div className="hero-content">
      <span className="tag tag-gold anim-up" style={{ marginBottom: 24, animationDelay: "0.1s" }}>
        <Icon name="shieldCheck" size={13} strokeWidth={2} /> Live property listings
      </span>
      
      <h1 className="hero-title anim-up" style={{ animationDelay: "0.2s" }}>
        Find your next <span className="text-gradient">home</span>
      </h1>
      
      <p className="hero-subtitle anim-up" style={{ animationDelay: "0.3s" }}>
        Explore current listings in Ibadan, see the first-year price, and request an in-person inspection with an eligible account.
      </p>
      
      <div className="hero-cta anim-up" style={{ animationDelay: "0.4s" }}>
        <Link href="/explore" className="btn btn-gold btn-lg" style={{ boxShadow: "0 12px 40px rgba(212, 175, 55, 0.35)" }}>
          <Icon name="explore" size={18} /> Explore homes
        </Link>
        <Link href="/auth/login" className="btn btn-ghost btn-lg" style={{ background: "rgba(255,255,255,.12)", color: "#fff", boxShadow: "inset 0 0 0 1.4px rgba(255,255,255,.3)", backdropFilter: "blur(10px)" }}>
          Log in
        </Link>
      </div>
      
      <div className="hero-stats anim-up" style={{ animationDelay: "0.5s" }}>
        {STATS.map((s) => (
          <div key={s.label} className="stat-card-hero">
            <span className="stat-value-hero">{s.value}</span>
            <span className="stat-label-hero">{s.label}</span>
          </div>
        ))}
      </div>
    </div>
  </div>
</section>
      {/* ========== HOW IT WORKS - PREMIUM CARDS ========== */}
      <section className="page">
        <div className="page-head">
          <h2 className="page-title">How AwaAgent works</h2>
          <p className="page-sub">What you can do with the connected backend today.</p>
        </div>
        <div className="how-grid">
          {HOW.map((step, i) => (
            <div key={step.title} className="how-card" style={{ animationDelay: `${i * 0.1}s` }}>
              <div className="how-card-header">
                <span className="how-icon-badge">
                  <Icon name={step.icon as IconName} size={24} />
                </span>
                <span className="how-step-number">{i + 1}</span>
              </div>
              <h3 className="how-title">{step.title}</h3>
              <p className="how-body">{step.body}</p>
              <div className="how-accent"></div>
            </div>
          ))}
        </div>
      </section>

      {/* ========== ESCROW PROTECTION - PREMIUM BAND ========== */}
      <section className="page">
        <div className="escrow-card">
          <div className="escrow-backdrop"></div>
          <div className="escrow-content">
            <div className="escrow-left">
              <span className="tag tag-gold" style={{ width: "fit-content", marginBottom: 16 }}>
                <Icon name="lock" size={13} strokeWidth={2} /> Pay securely
              </span>
              <h2 className="escrow-title">Keep your rent payment in the app.</h2>
              <p className="escrow-description">
                After an in-person inspection, use AwaAgent&apos;s Paystack checkout. Never transfer rent directly to an agent or landlord.
              </p>
              <Link href="/trust-safety" className="btn btn-gold btn-sm" style={{ width: "fit-content", marginTop: 20 }}>
                See safety guidance
              </Link>
            </div>
            <div className="escrow-right">
              {["Browse current listings", "Request an inspection", "Verify the meeting code", "Pay through the app"].map((t, i) => (
                <div key={t} className="escrow-step" style={{ animationDelay: `${i * 0.1}s` }}>
                  <span className="escrow-step-number">{i + 1}</span>
                  <span className="escrow-step-text">{t}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ========== BENEFITS BY ROLE ========== */}
      <section className="page">
        <div className="page-head">
          <h2 className="page-title">Built for everyone in the deal</h2>
          <p className="page-sub">Available features and upcoming account tools.</p>
        </div>
        <div className="benefits-grid">
          {BENEFITS.map((b, idx) => (
            <div key={b.audience} className="benefit-card" style={{ animationDelay: `${idx * 0.15}s` }}>
              <div className="benefit-icon-wrapper">
                <Icon name={b.icon as IconName} size={28} />
              </div>
              <h3 className="benefit-title">{b.audience}</h3>
              <div className="benefit-points">
                {b.points.map((p) => (
                  <span key={p} className="benefit-point">
                    <Icon name="check" size={16} strokeWidth={2.2} color="var(--ok)" /> {p}
                  </span>
                ))}
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* ========== FEATURED HOMES ========== */}
      <section className="page">
        <div className="page-head row between">
          <div className="col">
            <h2 className="page-title">Featured homes in Ibadan</h2>
            <p className="page-sub">Live listings with the backend's first-year price shown upfront.</p>
          </div>
          <Link href="/explore" className="btn btn-ghost btn-sm">
            View all <Icon name="arrowR" size={16} />
          </Link>
        </div>
        <FeaturedProperties />
      </section>

      {/* ========== FAQ ========== */}
      <section className="page page-narrow">
        <div className="page-head">
          <h2 className="page-title">Frequently asked</h2>
        </div>
        <div className="faq-container">
          {FAQ.map((f, idx) => (
            <details key={f.q} className="faq-item" style={{ animationDelay: `${idx * 0.08}s` }}>
              <summary className="faq-question">
                <span>{f.q}</span>
                {/* <Icon name="chevronDown" size={20} strokeWidth={1.8} /> */}
              </summary>
              <p className="faq-answer">{f.a}</p>
            </details>
          ))}
        </div>
      </section>

      <Footer />
    </>
  );
}
