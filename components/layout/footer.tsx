import Link from "next/link";
import { Logo } from "@/components/shared/logo";
import { env } from "@/lib/env";

const COLUMNS = [
  {
    title: "Renting",
    links: [
      { label: "Find a home", href: "/explore" },
      { label: "How it works", href: "/how-it-works" },
      { label: "Pricing", href: "/pricing" },
      { label: "Safety rules", href: "/trust-safety" },
    ],
  },
  {
    title: "Landlords and agents",
    links: [
      { label: "List as a landlord", href: "/auth/signup?role=landlord" },
      { label: "Join as an agent", href: "/auth/signup?role=agent" },
      { label: "Partner sign in", href: "/auth/login" },
    ],
  },
];

export function Footer() {
  const phone = env.supportPhone.replace(/\s+/g, "");
  return (
    <footer className="aw-footer">
      <div className="aw-wrap aw-footer-grid">
        <div className="aw-footer-brand">
          <Logo light size={30} />
          <p>Rentals you inspect in person before you commit. The exact address is shared only after your visit is verified.</p>
        </div>
        {COLUMNS.map((column) => (
          <nav key={column.title} className="aw-footer-col" aria-label={column.title}>
            <h2>{column.title}</h2>
            {column.links.map((link) => (
              <Link key={link.href} href={link.href}>{link.label}</Link>
            ))}
          </nav>
        ))}
        <div className="aw-footer-col">
          <h2>Contact</h2>
          <a href={`mailto:${env.supportEmail}`}>{env.supportEmail}</a>
          <a href={`tel:${phone}`}>{env.supportPhone}</a>
        </div>
      </div>
      <div className="aw-wrap aw-footer-base">
        <span>© {new Date().getFullYear()} {env.appName}</span>
        <span>Pay only through your AwaAgent account. Never transfer rent to an agent or landlord directly.</span>
      </div>
    </footer>
  );
}
