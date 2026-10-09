import Link from "next/link";
import { Icon } from "@/components/ui/icon";
import { PropImage } from "@/components/shared/prop-image";
import { SITE_IMAGES } from "@/lib/site-images";
import { env } from "@/lib/env";
import type { IconName } from "@/lib/icons";

const RULES: { id: string; icon: IconName; title: string; body: string }[] = [
  {
    id: "address",
    icon: "lock",
    title: "Exact address after verification",
    body: "Listings show the area and a landmark. The street address appears in your account once the agent enters your code at the property.",
  },
  {
    id: "code",
    icon: "key",
    title: "A six-digit code for every visit",
    body: "Read it aloud to the agent named on the listing when you meet. They enter it to confirm the visit. Never send it by phone or chat.",
  },
  {
    id: "payment",
    icon: "wallet",
    title: "Rent is held until you have the keys",
    body: env.rentCheckoutLive
      ? "Pay from your AwaAgent account. The money is held and only paid to the landlord and agent after you confirm you have the keys."
      : "When online payment opens, your rent is held and only paid out after you confirm you have the keys. It isn't open yet, so don't transfer rent to anyone directly.",
  },
  {
    id: "messages",
    icon: "chat",
    title: "No direct messages",
    body: "Tenants and agents can't message each other, so no one can renegotiate the price or ask for payment outside the app.",
  },
];

export function SafetySplit() {
  return (
    <section className="aw-section aw-wrap aw-safety" aria-labelledby="safety-heading">
      <figure className="aw-safety-visual">
        <PropImage src={SITE_IMAGES.kitchen.src} label={SITE_IMAGES.kitchen.alt} className="aw-fill" sizes="(max-width: 900px) 100vw, 45vw" />
        <div className="aw-chip-float aw-chip-float-a">
          <Icon name="checkCircle" size={18} /> Code matched
        </div>
        <div className="aw-chip-float aw-chip-float-b">
          <Icon name="pin" size={18} /> Address now in your account
        </div>
      </figure>
      <div className="aw-safety-copy">
        <h2 id="safety-heading" className="aw-h2">Safety built into every visit</h2>
        <ul className="aw-safety-rules">
          {RULES.map((rule) => (
            <li key={rule.id}>
              <span className="aw-safety-icon"><Icon name={rule.icon} size={20} /></span>
              <div>
                <h3>{rule.title}</h3>
                <p>{rule.body}</p>
                <Link href={`/trust-safety#${rule.id}`}>Read more</Link>
              </div>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
