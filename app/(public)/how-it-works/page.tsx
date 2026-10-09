import type { Metadata } from "next";
import Link from "next/link";
import { Icon } from "@/components/ui/icon";
import { Footer } from "@/components/layout/footer";

export const metadata: Metadata = { title: "How it works" };

const steps = [
  { icon: "explore" as const, title: "Browse listings", body: "View available properties, their first-year price and a nearby landmark." },
  { icon: "calendar" as const, title: "Request an inspection", body: "Choose a date and get a six-digit meeting code in your account." },
  { icon: "key" as const, title: "Verify in person", body: "At the property, the assigned agent enters that code. A successful check completes the inspection and unlocks the address for the tenant." },
];

export default function HowItWorksPage() {
  return <>
    <section className="hiw-hero"><div className="page page-narrow" style={{ paddingTop: 72, paddingBottom: 72 }}>
      <h1 className="hiw-hero-title">How AwaAgent works</h1>
      <p className="hiw-hero-sub">Browse properties, inspect in person and keep every payment in the app.</p>
    </div></section>
    <section className="page page-narrow"><div className="hiw-steps">
      {steps.map((step, index) => <div key={step.title} className="hiw-step">
        <div className="hiw-step-rail"><div className="hiw-step-dot"><Icon name={step.icon} size={18} /></div>{index < steps.length - 1 && <div className="hiw-step-line" />}</div>
        <div className="hiw-step-body"><div className="hiw-step-num">0{index + 1}</div><h2 className="hiw-step-title">{step.title}</h2><p className="hiw-step-desc">{step.body}</p></div>
      </div>)}
    </div>
    <div className="card card-pad" style={{ marginTop: 36 }}><strong>Payment safety</strong><p style={{ color: "var(--muted)", marginTop: 8 }}>Start payment only from your AwaAgent account after the inspection. If checkout does not open, do not transfer rent directly to anyone.</p></div>
    <Link href="/explore" className="btn btn-primary" style={{ marginTop: 22 }}>Browse properties</Link>
    </section>
    <Footer />
  </>;
}
