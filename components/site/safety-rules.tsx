import { Icon } from "@/components/ui/icon";
import type { IconName } from "@/lib/icons";
import { env } from "@/lib/env";

const RULES: { id: string; icon: IconName; title: string; body: string }[] = [
  {
    id: "address",
    icon: "lock",
    title: "The street address stays private",
    body: "Listings show the area and a nearby landmark. The street address appears in your account only after the agent enters your code at the property.",
  },
  {
    id: "code",
    icon: "key",
    title: "Your code is for the agent at the door",
    body: "Read your six-digit code aloud to the agent named on the listing when you meet. Never send it by phone, text or chat.",
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

export function SafetyRules({ tone = "dark" }: { tone?: "dark" | "light" }) {
  return (
    <ul className={tone === "dark" ? "aw-rules" : "aw-rules aw-rules-light"}>
      {RULES.map((rule) => (
        <li key={rule.id} id={rule.id}>
          <Icon name={rule.icon} size={22} />
          <h3>{rule.title}</h3>
          <p>{rule.body}</p>
        </li>
      ))}
    </ul>
  );
}
