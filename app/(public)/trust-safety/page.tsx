import type { Metadata } from "next";
import Link from "next/link";
import { Icon } from "@/components/ui/icon";
import { Footer } from "@/components/layout/footer";

export const metadata: Metadata = { title: "Trust & Safety" };

const guidance = [
  "Inspect properties during daylight and tell someone where you are going.",
  "Read your inspection code to the assigned agent only when you meet in person.",
  "The public listing hides the street address. It is returned to the tenant after the code is verified.",
  "Online checkout is not available. Do not transfer rent to an agent or landlord on the promise of escrow protection.",
];

export default function TrustSafetyPage() {
  return <>
    <section className="ts-hero"><div className="page page-narrow" style={{ paddingTop: 72, paddingBottom: 72 }}>
      <span className="tag tag-gold"><Icon name="shieldCheck" size={13} /> Trust &amp; Safety</span>
      <h1 className="ts-hero-title" style={{ marginTop: 16 }}>Inspect safely</h1>
      <p className="ts-hero-sub">What the connected inspection flow does today, and what to watch for while payment is unavailable.</p>
    </div></section>
    <section className="page page-narrow"><div className="col gap-4">
      {guidance.map((item) => <div key={item} className="card card-pad row gap-3"><Icon name="shieldCheck" size={20} /><p>{item}</p></div>)}
    </div><Link href="/explore" className="btn btn-primary" style={{ marginTop: 24 }}>Explore properties</Link></section>
    <Footer />
  </>;
}
