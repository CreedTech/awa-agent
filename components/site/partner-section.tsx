import Link from "next/link";
import { Icon } from "@/components/ui/icon";

const PARTNERS = [
  {
    role: "landlord",
    title: "Landlords",
    points: [
      "Authorise the agents who may represent your property",
      "Submit listings for review before they go live",
      "See inspection requests and payment records for your homes",
    ],
    cta: "List as a landlord",
  },
  {
    role: "agent",
    title: "Agents",
    points: [
      "List homes a landlord has authorised you to represent",
      "Confirm each visit by entering the tenant's code at the property",
      "Mark the dates you can't take inspections",
    ],
    cta: "Join as an agent",
  },
];

export function PartnerSection() {
  return (
    <section id="partners" className="aw-partners" aria-labelledby="partners-heading">
      <div className="aw-wrap">
      <h2 id="partners-heading" className="aw-h2">Own or manage homes for rent?</h2>
      <div className="aw-partner-grid">
        {PARTNERS.map((partner) => (
          <div key={partner.role} className="aw-partner">
            <h3>{partner.title}</h3>
            <ul>
              {partner.points.map((point) => (
                <li key={point}>
                  <Icon name="check" size={18} /> {point}
                </li>
              ))}
            </ul>
            <Link href={`/auth/signup?role=${partner.role}`} className="aw-btn aw-btn-citron">
              {partner.cta}
            </Link>
          </div>
        ))}
      </div>
      <p className="aw-partner-foot">
        Already a partner? <Link href="/auth/login">Sign in to your dashboard</Link>.
      </p>
      </div>
    </section>
  );
}
