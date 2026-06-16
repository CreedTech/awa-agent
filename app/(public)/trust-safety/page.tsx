import type { Metadata } from "next";
import Link from "next/link";
import { Icon } from "@/components/ui/icon";
import { Footer } from "@/components/layout/footer";
import type { IconName } from "@/lib/icons";

export const metadata: Metadata = { title: "Trust & Safety" };

const PILLARS: { icon: IconName; title: string; body: string }[] = [
  { icon: "lock",        title: "Escrow protection",  body: "Your rent is held by AwaAgent and only released when you confirm you've received your keys. Disputes freeze the funds instantly." },
  { icon: "shieldCheck", title: "Verified agents",    body: "Every agent passes NIN-based KYC before they can list or inspect. The verified badge means we've confirmed their identity." },
  { icon: "star",        title: "Trust scores",       body: "Agents earn a 0–100 trust score from completed deals, dispute rate, GPS accuracy and OTP success — so you can choose with confidence." },
  { icon: "calendar",    title: "OTP inspections",    body: "Every in-person inspection uses a 6-digit code, GPS-checked on-site. It proves the meeting happened and stops fake viewings." },
];

const WARNINGS = [
  { title: "Never pay an offline / cash rent",  body: "All payments go through escrow. If anyone asks you to pay rent in cash or to a personal account, report them immediately." },
  { title: "Viewing fees are illegal here",      body: "No agent on AwaAgent may charge you to inspect a property. If you're asked for a 'viewing fee', refuse and report it." },
  { title: "Only share your OTP on-site",        body: "Read your 6-digit code to the verified agent in person — never over the phone or chat before you meet." },
];

const SAFETY_TIPS = [
  "Inspect during daylight hours.",
  "Tell a friend or family member where you're going.",
  "Confirm the agent's verified badge and trust score first.",
  "Don't transfer any money outside the AwaAgent app.",
];

export default function TrustSafetyPage() {
  return (
    <>
      {/* ── HERO with real image ── */}
      <section className="ts-hero">
        {/* Background image */}
        <div
          className="ts-hero-img"
          style={{
            backgroundImage:
              'url("https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=1600&h=700&fit=crop&auto=format&q=75")',
          }}
        />
        {/* Overlay */}
        <div className="ts-hero-overlay" />
        {/* Glows */}
        <div className="ts-hero-glow ts-hero-glow-1" />
        <div className="ts-hero-glow ts-hero-glow-2" />

        <div className="page page-narrow" style={{ position: "relative", zIndex: 2 }}>
          <span className="tag tag-gold anim-up" style={{ marginBottom: 16, animationDelay: "0.1s" }}>
            <Icon name="shieldCheck" size={13} /> Trust &amp; Safety
          </span>
          <h1 className="ts-hero-title anim-up" style={{ animationDelay: "0.2s" }}>
            Built to keep you <span className="text-gradient">safe</span>
          </h1>
          <p className="ts-hero-sub anim-up" style={{ animationDelay: "0.3s" }}>
            AwaAgent exists to remove fraud, fake agents and unsafe payments from renting in Nigeria.
          </p>

          {/* Quick-stat row */}
          <div className="ts-hero-stats anim-up" style={{ animationDelay: "0.4s" }}>
            {[
              { val: "NIN", label: "KYC for every agent" },
              { val: "OTP", label: "Verified inspections" },
              { val: "Escrow", label: "Every payment" },
              { val: "₦0", label: "Viewing fees" },
            ].map((s) => (
              <div key={s.label} className="ts-stat-card">
                <span className="ts-stat-val">{s.val}</span>
                <span className="ts-stat-lbl">{s.label}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── PILLARS ── */}
      <section className="page page-narrow">
        <div className="page-head">
          <h2 className="page-title">How we protect you</h2>
          <p className="page-sub">Four layers of protection built into every transaction.</p>
        </div>
        <div className="ts-pillars-grid">
          {PILLARS.map((p, i) => (
            <div key={p.title} className="ts-pillar-card anim-up" style={{ animationDelay: `${i * 0.1}s` }}>
              <div className="ts-pillar-icon">
                <Icon name={p.icon} size={24} />
              </div>
              <h3 className="ts-pillar-title">{p.title}</h3>
              <p className="ts-pillar-body">{p.body}</p>
              <div className="ts-pillar-accent" />
            </div>
          ))}
        </div>
      </section>

      {/* ── WARNINGS ── */}
      <section className="page page-narrow" style={{ paddingTop: 0 }}>
        <div className="page-head">
          <h2 className="page-title">Watch out for these</h2>
          <p className="page-sub">Common scam patterns and how to avoid them.</p>
        </div>
        <div className="col gap-4">
          {WARNINGS.map((w, i) => (
            <div key={w.title} className="ts-warning-card anim-up" style={{ animationDelay: `${i * 0.08}s` }}>
              <div className="ts-warning-icon">
                <Icon name="alert" size={20} />
              </div>
              <div className="col gap-2">
                <strong style={{ fontSize: 15.5, color: "var(--ink)" }}>{w.title}</strong>
                <p style={{ color: "var(--muted)", fontSize: 14, lineHeight: 1.65 }}>{w.body}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* ── SAFETY TIPS + REPORT ── */}
      <section className="page page-narrow" style={{ paddingTop: 0 }}>
        {/* Tips card with image accent */}
        <div className="ts-tips-card">
          <div
            className="ts-tips-img"
            style={{
              backgroundImage:
                'url("https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=800&h=600&fit=crop&auto=format&q=70")',
            }}
          />
          <div className="ts-tips-content">
            <div className="row gap-2" style={{ marginBottom: 14 }}>
              <Icon name="shieldCheck" size={20} color="var(--ok)" strokeWidth={2} />
              <strong style={{ fontSize: 16, color: "var(--ok)" }}>Inspection safety tips</strong>
            </div>
            <ul className="ts-tips-list">
              {SAFETY_TIPS.map((t) => (
                <li key={t} className="ts-tip-item">
                  <Icon name="check" size={15} color="var(--ok)" strokeWidth={2.4} />
                  <span>{t}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Report card */}
        <div className="ts-report-card">
          <div className="ts-report-left">
            <div className="ts-report-icon">
              <Icon name="alert" size={22} />
            </div>
            <div className="col gap-1">
              <strong style={{ fontSize: 16 }}>Spotted something suspicious?</strong>
              <span style={{ color: "var(--muted)", fontSize: 14 }}>
                Report a listing or agent and our team will investigate within 24 hours.
              </span>
            </div>
          </div>
          <Link href="/explore" className="btn btn-danger btn-sm" style={{ whiteSpace: "nowrap" }}>
            <Icon name="alert" size={16} /> Report an issue
          </Link>
        </div>
      </section>

      <Footer />
    </>
  );
}