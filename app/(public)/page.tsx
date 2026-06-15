import Link from "next/link";
import { Icon } from "@/components/ui/icon";
import { PropertyCard } from "@/components/property/property-card";
import { Footer } from "@/components/layout/footer";
import { PROPERTIES } from "@/lib/mock-data";
import type { IconName } from "@/lib/icons";

const HOW = [
  { icon: "explore", title: "Find a verified home", body: "Browse listings with the total upfront price clearly shown. Every agent passes NIN-based KYC." },
  { icon: "calendar", title: "Book a safe inspection", body: "Pick a slot and get a 6-digit OTP. No DMs, no illegal viewing fees, exact address stays hidden until approved." },
  { icon: "lock", title: "Pay into escrow", body: "Your rent is locked safely - never paid directly to a stranger." },
  { icon: "key", title: "Confirm your keys", body: "Funds are only released to the landlord and agent once you confirm you've received your keys." },
] as const;

const BENEFITS = [
  {
    icon: "home",
    audience: "For tenants",
    points: ["Escrow-protected rent", "Total upfront price", "Verified, safe inspections", "Dispute protection"],
  },
  {
    icon: "user",
    audience: "For agents",
    points: ["Earn from verified contribution", "Fair commission attribution", "Passive impression earnings", "No more no-show viewings"],
  },
  {
    icon: "building",
    audience: "For landlords",
    points: ["Control who represents you", "Full rent ledger & payouts", "Property performance insights", "Authorize or revoke agents"],
  },
] as const;

const STATS = [
  { value: "Verified", label: "Homes and agents" },
  { value: "Escrow", label: "Rent held until keys" },
  { value: "OTP", label: "Safer inspections" },
  { value: "No fees", label: "For viewings" },
];

const FAQ = [
  { q: "How does escrow protect me?", a: "Your rent is held by AwaAgent - not the agent or landlord. We only release it once you confirm you've physically received your keys. If something goes wrong, you can raise a dispute and funds stay frozen until it's resolved." },
  { q: "Why can't I see the exact address?", a: "To protect both you and the property, the exact address and map pin stay hidden until your inspection is approved. You always see the general area and a nearby landmark up front." },
  { q: "What are the fees?", a: "Every listing shows the total first-year price before you pay. From year two, renewals are cheaper because agent commission is not charged again." },
  { q: "What is the OTP for?", a: "Every in-person inspection uses a 6-digit code you read to the agent on-site. It proves the meeting really happened and stops fake viewings and illegal fees." },
];

export default function HomePage() {
  const featured = PROPERTIES.filter((p) => p.available).slice(0, 3);

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
        <Icon name="shieldCheck" size={13} strokeWidth={2} /> Banking-grade protection
      </span>
      
      <h1 className="hero-title anim-up" style={{ animationDelay: "0.2s" }}>
        Rent with absolute <span className="text-gradient">confidence</span>
      </h1>
      
      <p className="hero-subtitle anim-up" style={{ animationDelay: "0.3s" }}>
        Your money is protected in escrow. Verified agents. Transparent pricing. Safe inspections with OTP codes. 
        Experience the future of Nigerian rentals.
      </p>
      
      <div className="hero-cta anim-up" style={{ animationDelay: "0.4s" }}>
        <Link href="/explore" className="btn btn-gold btn-lg" style={{ boxShadow: "0 12px 40px rgba(212, 175, 55, 0.35)" }}>
          <Icon name="explore" size={18} /> Explore verified homes
        </Link>
        <Link href="/auth/signup" className="btn btn-ghost btn-lg" style={{ background: "rgba(255,255,255,.12)", color: "#fff", boxShadow: "inset 0 0 0 1.4px rgba(255,255,255,.3)", backdropFilter: "blur(10px)" }}>
          Get started free
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
          <p className="page-sub">Four steps from search to keys - protected the whole way.</p>
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
                <Icon name="lock" size={13} strokeWidth={2} /> Escrow protection
              </span>
              <h2 className="escrow-title">Your money is safe until you hold the keys.</h2>
              <p className="escrow-description">
                We never release rent to an agent or landlord on a promise. Pay into escrow, complete
                your inspection, confirm key handover - then funds split automatically. Raise a
                dispute any time and we freeze everything.
              </p>
              <Link href="/trust-safety" className="btn btn-gold btn-sm" style={{ width: "fit-content", marginTop: 20 }}>
                See how we protect you
              </Link>
            </div>
            <div className="escrow-right">
              {["Pay securely into escrow", "Funds locked, never lost", "Confirm keys to release", "Disputes freeze the money"].map((t, i) => (
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
          <p className="page-sub">Fair, transparent and safe - for tenants, agents and landlords alike.</p>
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
            <p className="page-sub">Verified listings with the total first-year price shown upfront.</p>
          </div>
          <Link href="/explore" className="btn btn-ghost btn-sm">
            View all <Icon name="arrowR" size={16} />
          </Link>
        </div>
        <div className="prop-grid-premium">
          {featured.map((p, i) => (
            <div key={p.id} className="prop-card-wrapper" style={{ animationDelay: `${i * 0.15}s` }}>
              <PropertyCard property={p} priority={i === 0} />
            </div>
          ))}
        </div>
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