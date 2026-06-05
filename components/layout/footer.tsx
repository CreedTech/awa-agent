import Link from "next/link";
import { Logo } from "@/components/shared/logo";
import { Icon } from "@/components/ui/icon";
import { env } from "@/lib/env";

const COLUMNS = [
  {
    title: "Product",
    links: [
      { label: "Explore", href: "/explore" },
      { label: "How it works", href: "/how-it-works" },
      { label: "Pricing", href: "/pricing" },
      { label: "Trust & Safety", href: "/trust-safety" },
    ],
  },
  {
    title: "For partners",
    links: [
      { label: "Become an agent", href: "/auth/signup" },
      { label: "List as a landlord", href: "/auth/signup" },
      { label: "Agent earnings", href: "/how-it-works" },
    ],
  },
  {
    title: "Company",
    links: [
      { label: "About", href: "/how-it-works" },
      { label: "Trust & Safety", href: "/trust-safety" },
      { label: "Contact", href: "/trust-safety" },
    ],
  },
];

export function Footer() {
  return (
    <footer style={{ background: "var(--navy-900)", color: "rgba(255,255,255,.7)", marginTop: 48 }}>
      <div className="page" style={{ paddingTop: 48, paddingBottom: 36 }}>
        <div className="row between wrap gap-6" style={{ alignItems: "flex-start" }}>
          <div className="col gap-4" style={{ maxWidth: 320 }}>
            <Logo light />
            <p style={{ fontSize: 14, lineHeight: 1.6 }}>
              Escrow-protected rentals for Nigeria. We hold your rent safely until you receive your
              keys - no fake agents, no illegal viewing fees, no unsafe cash payments.
            </p>
            <div className="row gap-2" style={{ fontSize: 13 }}>
              <Icon name="shieldCheck" size={16} color="var(--gold-400)" /> Funds held in escrow ·
              Licensed partners
            </div>
          </div>
          <div className="row wrap gap-6">
            {COLUMNS.map((col) => (
              <div key={col.title} className="col gap-3" style={{ minWidth: 150 }}>
                <strong style={{ color: "#fff", fontSize: 14 }}>{col.title}</strong>
                {col.links.map((l) => (
                  <Link key={l.label} href={l.href} style={{ fontSize: 13.5, color: "rgba(255,255,255,.65)" }}>
                    {l.label}
                  </Link>
                ))}
              </div>
            ))}
          </div>
        </div>
        <div
          className="row between wrap gap-3"
          style={{ marginTop: 36, paddingTop: 20, borderTop: "1px solid rgba(255,255,255,.1)", fontSize: 13 }}
        >
          <span>© {new Date().getFullYear()} {env.appName}. All rights reserved.</span>
          <span className="row gap-3">
            <a href={`mailto:${env.supportEmail}`} className="row gap-2">
              <Icon name="mail" size={15} /> {env.supportEmail}
            </a>
          </span>
        </div>
      </div>
    </footer>
  );
}
