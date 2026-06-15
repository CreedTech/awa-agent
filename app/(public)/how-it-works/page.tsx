import type { Metadata } from "next";
import Link from "next/link";
import { Icon } from "@/components/ui/icon";
import { Footer } from "@/components/layout/footer";
import type { IconName } from "@/lib/icons";

export const metadata: Metadata = { title: "How it works" };

const JOURNEY: { icon: IconName; title: string; body: string }[] = [
  { icon: "explore", title: "Find a verified home", body: "Browse listings with the total upfront price clearly shown. Every agent has passed NIN-based KYC." },
  { icon: "calendar", title: "Book a safe inspection", body: "Choose a slot and receive a 6-digit OTP. No DMs, no illegal viewing fees. The exact address stays hidden until your inspection is approved." },
  { icon: "pin", title: "Unlock the address", body: "Once the agent approves, the exact address, map route and safety tips unlock. You meet on-site and read your OTP to verify the meeting." },
  { icon: "lock", title: "Pay into escrow", body: "Pay securely — your rent is held by AwaAgent, never handed to a stranger. Funds stay locked until you confirm handover." },
  { icon: "key", title: "Confirm your keys", body: "When you physically receive your keys, confirm in the app. Escrow releases the split to the landlord, agent and platform automatically." },
  { icon: "shieldCheck", title: "Protected the whole way", body: "Anything goes wrong? Raise a dispute and funds stay frozen while our team reviews the case." },
];

const ROLES: { icon: IconName; title: string; body: string; stat: string; statLabel: string }[] = [
  { icon: "home", title: "Tenants rent safely", body: "Escrow protection, upfront pricing and verified inspections reduce fake-agent risk before you pay.", stat: "₦0", statLabel: "Lost to scams" },
  { icon: "user", title: "Agents earn fairly", body: "Commission follows verified contribution — the agent who brings the tenant and completes the inspection is paid.", stat: "Fair", statLabel: "Commission split" },
  { icon: "building", title: "Landlords stay in control", body: "Authorize the agents who represent you, set a primary agent and per-property limits, and track every payout.", stat: "Full", statLabel: "Ledger visibility" },
];

const IMAGES = [
  "https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?w=800&h=500&fit=crop&auto=format&q=75",
  "https://images.unsplash.com/photo-1484154218962-a197022b5858?w=800&h=500&fit=crop&auto=format&q=75",
  "https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?w=800&h=500&fit=crop&auto=format&q=75",
];

export default function HowItWorksPage() {
  return (
    <>
      {/* ── HERO ── */}
      <section className="hiw-hero">
        <div className="hiw-hero-glow hiw-hero-glow-1" />
        <div className="hiw-hero-glow hiw-hero-glow-2" />

        {/* Floating image strip */}
        <div className="hiw-hero-images" aria-hidden="true">
          {IMAGES.map((src, i) => (
            <div key={i} className="hiw-hero-img-card" style={{ animationDelay: `${i * 0.15}s` }}>
              <img src={src} alt="" />
            </div>
          ))}
        </div>

        <div className="page page-narrow" style={{ position: "relative", zIndex: 2 }}>
          <span className="tag tag-gold anim-up" style={{ marginBottom: 16, animationDelay: "0.1s" }}>
            <Icon name="shieldCheck" size={13} /> Escrow-protected rentals
          </span>
          <h1 className="hiw-hero-title anim-up" style={{ animationDelay: "0.2s" }}>
            How <span className="text-gradient">AwaAgent</span> works
          </h1>
          <p className="hiw-hero-sub anim-up" style={{ animationDelay: "0.3s" }}>
            From your first search to the day you get your keys — protected at every step.
          </p>
        </div>
      </section>

      {/* ── JOURNEY STEPS ── */}
      <section className="page page-narrow">
        <div className="hiw-steps">
          {JOURNEY.map((s, i) => (
            <div key={s.title} className="hiw-step anim-up" style={{ animationDelay: `${i * 0.1}s` }}>
              {/* Rail */}
              <div className="hiw-step-rail">
                <div className="hiw-step-dot">
                  <Icon name={s.icon} size={18} />
                </div>
                {i < JOURNEY.length - 1 && <div className="hiw-step-line" />}
              </div>
              {/* Content */}
              <div className="hiw-step-body">
                <div className="hiw-step-num">0{i + 1}</div>
                <h3 className="hiw-step-title">{s.title}</h3>
                <p className="hiw-step-desc">{s.body}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* ── ROLES ── */}
      <section className="page">
        <div className="page-head">
          <h2 className="page-title">Fair for everyone in the deal</h2>
          <p className="page-sub">Tenants, agents and landlords all win when the process is transparent.</p>
        </div>

        <div className="hiw-roles-grid">
          {ROLES.map((r, i) => (
            <div key={r.title} className="hiw-role-card anim-up" style={{ animationDelay: `${i * 0.15}s` }}>
              <div className="hiw-role-icon">
                <Icon name={r.icon} size={26} />
              </div>
              <div className="hiw-role-stat">
                <span className="hiw-role-stat-val">{r.stat}</span>
                <span className="hiw-role-stat-lbl">{r.statLabel}</span>
              </div>
              <h3 className="hiw-role-title">{r.title}</h3>
              <p className="hiw-role-body">{r.body}</p>
            </div>
          ))}
        </div>

        <div className="row center" style={{ marginTop: 40, gap: 14 }}>
          <Link href="/auth/signup" className="btn btn-gold btn-lg">
            <Icon name="key" size={18} /> Get started free
          </Link>
          <Link href="/explore" className="btn btn-ghost btn-lg">
            <Icon name="explore" size={18} /> Browse homes
          </Link>
        </div>
      </section>

      {/* ── ESCROW CLOSER ── */}
      <section className="page page-narrow" style={{ paddingTop: 0 }}>
        <div className="hiw-escrow-band">
          <div className="hiw-escrow-band-bg" />
          <div className="hiw-escrow-band-inner">
            <span className="tag tag-gold" style={{ width: "fit-content" }}>
              <Icon name="lock" size={13} /> Escrow protection
            </span>
            <h2 style={{ color: "#fff", fontSize: 26, maxWidth: 420, lineHeight: 1.2 }}>
              Your money never touches a stranger's hands.
            </h2>
            <p style={{ color: "rgba(255,255,255,.75)", fontSize: 15, lineHeight: 1.7 }}>
              AwaAgent holds rent in escrow and only releases it once you confirm you have received your keys. Raise a dispute at any time to freeze funds instantly.
            </p>
            <Link href="/trust-safety" className="btn btn-gold btn-sm" style={{ width: "fit-content" }}>
              See our trust & safety page <Icon name="arrowR" size={15} />
            </Link>
          </div>
        </div>
      </section>

      <Footer />
    </>
  );
}