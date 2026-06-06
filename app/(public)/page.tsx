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
  { value: "₦86.5M", label: "Protected in escrow" },
  { value: "38", label: "KYC-verified agents" },
  { value: "100%", label: "Refund on proven fraud" },
  { value: "2.5%", label: "Flat escrow fee" },
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
      {/* Hero */}
      <section style={{ background: "linear-gradient(165deg, var(--navy-800), var(--navy-900))", color: "#fff" }}>
        <div className="page" style={{ paddingTop: 64, paddingBottom: 72 }}>
          <span className="tag tag-gold" style={{ marginBottom: 18 }}>
            <Icon name="shieldCheck" size={13} strokeWidth={2} /> Escrow-protected rentals
          </span>
          <h1 style={{ fontSize: "clamp(34px, 6vw, 60px)", color: "#fff", maxWidth: 760, lineHeight: 1.05 }}>
            Rent without fear of fake agents or lost deposits.
          </h1>
          <p style={{ maxWidth: 560, marginTop: 18, fontSize: 18, color: "rgba(255,255,255,.8)" }}>
            AwaAgent holds your rent in escrow and only releases it once you receive your keys.
            Verified agents, transparent pricing, safe inspections.
          </p>
          <div className="row wrap gap-3" style={{ marginTop: 28 }}>
            <Link href="/explore" className="btn btn-gold btn-lg">
              <Icon name="explore" size={18} /> Explore properties
            </Link>
            <Link href="/auth/signup" className="btn btn-ghost btn-lg" style={{ background: "rgba(255,255,255,.08)", color: "#fff", boxShadow: "inset 0 0 0 1.4px rgba(255,255,255,.25)" }}>
              Get started
            </Link>
          </div>
          <div className="row wrap gap-6" style={{ marginTop: 48 }}>
            {STATS.map((s) => (
              <div key={s.label} className="col" style={{ gap: 2 }}>
                <span style={{ fontFamily: "var(--font-display)", fontSize: 30, fontWeight: 800 }}>{s.value}</span>
                <span style={{ fontSize: 13, color: "rgba(255,255,255,.65)" }}>{s.label}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* How it works */}
      <section className="page">
        <div className="page-head">
          <h2 className="page-title">How AwaAgent works</h2>
          <p className="page-sub">Four steps from search to keys - protected the whole way.</p>
        </div>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(230px, 1fr))", gap: 18 }}>
          {HOW.map((step, i) => (
            <div key={step.title} className="card card-pad col gap-3">
              <span className="row between">
                <span className="grid place-items-center" style={{ width: 42, height: 42, borderRadius: 12, background: "var(--navy-050)", color: "var(--navy-700)" }}>
                  <Icon name={step.icon as IconName} size={22} />
                </span>
                <span style={{ fontFamily: "var(--font-display)", fontSize: 26, fontWeight: 800, color: "var(--line-2)" }}>
                  {i + 1}
                </span>
              </span>
              <h3 style={{ fontSize: 17 }}>{step.title}</h3>
              <p style={{ color: "var(--muted)", fontSize: 14 }}>{step.body}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Escrow protection band */}
      <section className="page">
        <div className="card" style={{ overflow: "hidden", background: "linear-gradient(120deg, var(--navy-800), var(--navy-700))", color: "#fff", border: "none" }}>
          <div className="card-pad" style={{ padding: "40px 32px", display: "grid", gridTemplateColumns: "1.2fr 1fr", gap: 32, alignItems: "center" }}>
            <div className="col gap-4">
              <span className="tag tag-gold" style={{ width: "fit-content" }}>
                <Icon name="lock" size={13} strokeWidth={2} /> Escrow protection
              </span>
              <h2 style={{ color: "#fff", fontSize: 30, maxWidth: 460 }}>Your money is safe until you hold the keys.</h2>
              <p style={{ color: "rgba(255,255,255,.8)", fontSize: 15, maxWidth: 480 }}>
                We never release rent to an agent or landlord on a promise. Pay into escrow, complete
                your inspection, confirm key handover - then funds split automatically. Raise a
                dispute any time and we freeze everything.
              </p>
              <Link href="/trust-safety" className="btn btn-gold btn-sm" style={{ width: "fit-content" }}>
                See how we protect you
              </Link>
            </div>
            <div className="col gap-3">
              {["Pay securely into escrow", "Funds locked, never lost", "Confirm keys to release", "Disputes freeze the money"].map((t, i) => (
                <div key={t} className="row gap-3" style={{ background: "rgba(255,255,255,.08)", borderRadius: 12, padding: "12px 14px" }}>
                  <span className="grid place-items-center" style={{ width: 26, height: 26, borderRadius: "50%", background: "var(--gold-500)", color: "var(--navy-900)", fontWeight: 800, fontSize: 13 }}>
                    {i + 1}
                  </span>
                  <span style={{ fontWeight: 600, fontSize: 14.5 }}>{t}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Benefits by role */}
      <section className="page">
        <div className="page-head">
          <h2 className="page-title">Built for everyone in the deal</h2>
          <p className="page-sub">Fair, transparent and safe - for tenants, agents and landlords alike.</p>
        </div>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(260px, 1fr))", gap: 18 }}>
          {BENEFITS.map((b) => (
            <div key={b.audience} className="card card-pad col gap-4">
              <span className="grid place-items-center" style={{ width: 44, height: 44, borderRadius: 12, background: "var(--gold-050)", color: "var(--gold-700)" }}>
                <Icon name={b.icon as IconName} size={22} />
              </span>
              <h3 style={{ fontSize: 18 }}>{b.audience}</h3>
              <div className="col gap-3">
                {b.points.map((p) => (
                  <span key={p} className="row gap-2" style={{ fontSize: 14.5 }}>
                    <Icon name="check" size={16} strokeWidth={2.2} color="var(--ok)" /> {p}
                  </span>
                ))}
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Featured */}
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
        <div className="prop-grid">
          {featured.map((p) => (
            <PropertyCard key={p.id} property={p} />
          ))}
        </div>
      </section>

      {/* FAQ */}
      <section className="page page-narrow">
        <div className="page-head">
          <h2 className="page-title">Frequently asked</h2>
        </div>
        <div className="col gap-3">
          {FAQ.map((f) => (
            <details key={f.q} className="card card-pad">
              <summary style={{ cursor: "pointer", fontWeight: 700, fontFamily: "var(--font-display)", fontSize: 16, listStyle: "none" }}>
                {f.q}
              </summary>
              <p style={{ color: "var(--muted)", fontSize: 14.5, marginTop: 10, lineHeight: 1.6 }}>{f.a}</p>
            </details>
          ))}
        </div>
      </section>

      <Footer />
    </>
  );
}
