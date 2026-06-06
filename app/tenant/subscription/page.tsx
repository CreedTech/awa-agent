"use client";

import { useState } from "react";
import { PageHeader } from "@/components/shared/page-header";
import { Icon } from "@/components/ui/icon";
import { cn } from "@/lib/utils";
import { toast } from "sonner";

const TIERS = [
  { id: "BASIC", name: "Basic", price: "Free", features: ["Escrow protection", "Verified inspections", "Dispute protection"] },
  { id: "PREMIUM", name: "Premium", price: "₦2,500/mo", features: ["Everything in Basic", "Priority inspection slots", "Reduced 2% escrow fee", "Saved-search alerts"] },
  { id: "PRIORITY", name: "Priority", price: "₦6,000/mo", features: ["Everything in Premium", "Dedicated support", "1.5% escrow fee", "Early listing access"] },
];

export default function SubscriptionPage() {
  const [current, setCurrent] = useState("BASIC");

  return (
    <div className="page">
      <PageHeader title="Subscription" subtitle="Upgrade for priority inspections and lower fees." />
      <div className="card-grid">
        {TIERS.map((t) => {
          const active = current === t.id;
          return (
            <div key={t.id} className="card card-pad col gap-4" style={active ? { border: "2px solid var(--navy-800)" } : undefined}>
              <div className="row between">
                <h3 style={{ fontSize: 19 }}>{t.name}</h3>
                {active && <span className="tag tag-navy">Current</span>}
              </div>
              <span style={{ fontFamily: "var(--font-display)", fontSize: 28, fontWeight: 800 }}>{t.price}</span>
              <div className="col gap-2" style={{ flex: 1 }}>
                {t.features.map((f) => (
                  <span key={f} className="row gap-2" style={{ fontSize: 14 }}>
                    <Icon name="check" size={15} strokeWidth={2.2} color="var(--ok)" /> {f}
                  </span>
                ))}
              </div>
              <button
                className={cn("btn btn-block", active ? "btn-ghost" : "btn-primary")}
                disabled={active}
                onClick={() => { setCurrent(t.id); toast.success(`Switched to ${t.name}`); }}
              >
                {active ? "Current plan" : `Switch to ${t.name}`}
              </button>
            </div>
          );
        })}
      </div>
    </div>
  );
}
