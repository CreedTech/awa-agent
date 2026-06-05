import type { Metadata } from "next";
import Link from "next/link";
import { Icon } from "@/components/ui/icon";
import { Footer } from "@/components/layout/footer";
import type { IconName } from "@/lib/icons";

export const metadata: Metadata = { title: "Trust & Safety" };

const PILLARS: { icon: IconName; title: string; body: string }[] = [
  { icon: "lock", title: "Escrow protection", body: "Your rent is held by AwaAgent and only released when you confirm you've received your keys. Disputes freeze the funds instantly." },
  { icon: "shieldCheck", title: "Verified agents", body: "Every agent passes NIN-based KYC before they can list or inspect. The verified badge means we've confirmed their identity." },
  { icon: "star", title: "Trust scores", body: "Agents earn a 0–100 trust score from completed deals, dispute rate, GPS accuracy and OTP success - so you can choose with confidence." },
  { icon: "calendar", title: "OTP inspections", body: "Every in-person inspection uses a 6-digit code, GPS-checked on-site. It proves the meeting happened and stops fake viewings." },
];

const WARNINGS = [
  { title: "Never pay an offline / cash rent", body: "All payments go through escrow. If anyone asks you to pay rent in cash or to a personal account, report them immediately." },
  { title: "Viewing fees are illegal here", body: "No agent on AwaAgent may charge you to inspect a property. If you're asked for a 'viewing fee', refuse and report it." },
  { title: "Only share your OTP on-site", body: "Read your 6-digit code to the verified agent in person - never over the phone or chat before you meet." },
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
      <section className="page page-narrow">
        <div className="page-head">
          <span className="tag tag-navy" style={{ marginBottom: 12 }}><Icon name="shield" size={13} /> Trust &amp; Safety</span>
          <h1 className="page-title" style={{ fontSize: 38 }}>Built to keep you safe</h1>
          <p className="page-sub" style={{ fontSize: 16 }}>
            AwaAgent exists to remove fraud, fake agents and unsafe payments from renting in Nigeria.
          </p>
        </div>

        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(240px, 1fr))", gap: 16 }}>
          {PILLARS.map((p) => (
            <div key={p.title} className="card card-pad col gap-3">
              <span className="grid place-items-center" style={{ width: 44, height: 44, borderRadius: 12, background: "var(--navy-050)", color: "var(--navy-700)" }}>
                <Icon name={p.icon} size={22} />
              </span>
              <h3 style={{ fontSize: 16.5 }}>{p.title}</h3>
              <p style={{ color: "var(--muted)", fontSize: 14 }}>{p.body}</p>
            </div>
          ))}
        </div>
      </section>

      <section className="page page-narrow">
        <h2 className="page-title" style={{ marginBottom: 16 }}>Watch out for these</h2>
        <div className="col gap-3">
          {WARNINGS.map((w) => (
            <div key={w.title} className="card card-pad row gap-3" style={{ alignItems: "flex-start", borderLeft: "4px solid var(--danger)" }}>
              <Icon name="alert" size={20} color="var(--danger)" />
              <div className="col gap-2">
                <strong style={{ fontSize: 15 }}>{w.title}</strong>
                <p style={{ color: "var(--muted)", fontSize: 14 }}>{w.body}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      <section className="page page-narrow">
        <div className="card card-pad" style={{ background: "var(--ok-bg)", border: "none" }}>
          <strong className="row gap-2" style={{ color: "var(--ok)", fontSize: 16 }}><Icon name="shieldCheck" size={18} strokeWidth={2} /> Inspection safety tips</strong>
          <ul style={{ margin: "12px 0 0 18px", color: "var(--ink-2)", fontSize: 14.5, lineHeight: 1.9 }}>
            {SAFETY_TIPS.map((t) => <li key={t}>{t}</li>)}
          </ul>
        </div>
        <div className="card card-pad row between wrap gap-3" style={{ marginTop: 16 }}>
          <div className="col gap-2">
            <strong style={{ fontSize: 16 }}>Spotted something suspicious?</strong>
            <span style={{ color: "var(--muted)", fontSize: 14 }}>Report a listing or agent and our team will investigate.</span>
          </div>
          <Link href="/explore" className="btn btn-primary btn-sm"><Icon name="alert" size={16} /> Report an issue</Link>
        </div>
      </section>
      <Footer />
    </>
  );
}
