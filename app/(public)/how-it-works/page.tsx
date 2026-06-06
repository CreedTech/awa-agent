import type { Metadata } from "next";
import Link from "next/link";
import { Icon } from "@/components/ui/icon";
import { Footer } from "@/components/layout/footer";
import type { IconName } from "@/lib/icons";

export const metadata: Metadata = { title: "How it works" };

const JOURNEY: { icon: IconName; title: string; body: string }[] = [
  { icon: "explore", title: "1. Find a verified home", body: "Browse listings with the total upfront price clearly shown. Every agent has passed NIN-based KYC." },
  { icon: "calendar", title: "2. Book a safe inspection", body: "Choose a slot and receive a 6-digit OTP. No DMs, no illegal viewing fees. The exact address stays hidden until your inspection is approved." },
  { icon: "pin", title: "3. Unlock the address", body: "Once the agent approves, the exact address, map route and safety tips unlock. You meet on-site and read your OTP to verify the meeting." },
  { icon: "lock", title: "4. Pay into escrow", body: "Pay securely - your rent is held by AwaAgent, never handed to a stranger. Funds stay locked until you confirm handover." },
  { icon: "key", title: "5. Confirm your keys", body: "When you physically receive your keys, confirm in the app. Escrow releases the split to the landlord, agent and platform automatically." },
  { icon: "shieldCheck", title: "Protected the whole way", body: "Anything goes wrong? Raise a dispute and funds stay frozen while our team reviews the case." },
];

const ROLES: { icon: IconName; title: string; body: string }[] = [
  { icon: "home", title: "Tenants rent safely", body: "Escrow protection, upfront pricing and verified inspections reduce fake-agent risk before you pay." },
  { icon: "user", title: "Agents earn fairly", body: "Commission follows verified contribution - the agent who brings the tenant and completes the inspection is paid. Plus passive impression earnings." },
  { icon: "building", title: "Landlords stay in control", body: "Authorize the agents who represent you, set a primary agent and per-property limits, and track every payout in your rent ledger." },
];

export default function HowItWorksPage() {
  return (
    <>
      <section className="page page-narrow">
        <div className="page-head">
          <span className="tag tag-gold" style={{ marginBottom: 12 }}>Escrow-protected rentals</span>
          <h1 className="page-title" style={{ fontSize: 38 }}>How AwaAgent works</h1>
          <p className="page-sub" style={{ fontSize: 16 }}>
            From your first search to the day you get your keys - protected at every step.
          </p>
        </div>

        <div className="col gap-3">
          {JOURNEY.map((s) => (
            <div key={s.title} className="card card-pad row gap-4" style={{ alignItems: "flex-start" }}>
              <span className="grid place-items-center" style={{ width: 46, height: 46, borderRadius: 12, background: "var(--navy-050)", color: "var(--navy-700)", flexShrink: 0 }}>
                <Icon name={s.icon} size={22} />
              </span>
              <div className="col gap-2">
                <h3 style={{ fontSize: 17 }}>{s.title}</h3>
                <p style={{ color: "var(--muted)", fontSize: 14.5, lineHeight: 1.6 }}>{s.body}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      <section className="page">
        <div className="page-head"><h2 className="page-title">Fair for everyone</h2></div>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(260px, 1fr))", gap: 18 }}>
          {ROLES.map((r) => (
            <div key={r.title} className="card card-pad col gap-3">
              <span className="grid place-items-center" style={{ width: 44, height: 44, borderRadius: 12, background: "var(--gold-050)", color: "var(--gold-700)" }}>
                <Icon name={r.icon} size={22} />
              </span>
              <h3 style={{ fontSize: 17 }}>{r.title}</h3>
              <p style={{ color: "var(--muted)", fontSize: 14.5 }}>{r.body}</p>
            </div>
          ))}
        </div>
        <div className="row center" style={{ marginTop: 28 }}>
          <Link href="/auth/signup" className="btn btn-primary btn-lg">Get started free</Link>
        </div>
      </section>
      <Footer />
    </>
  );
}
