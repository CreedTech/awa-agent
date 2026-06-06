"use client";

import { PageHeader } from "@/components/shared/page-header";
import { Icon } from "@/components/ui/icon";
import { LOYALTY } from "@/lib/mock-data";
import type { IconName } from "@/lib/icons";
import { toast } from "sonner";

const EARN: { icon: IconName; label: string; pts: string }[] = [
  { icon: "calendar", label: "Complete an inspection", pts: "+50" },
  { icon: "shieldCheck", label: "Verify your NIN", pts: "+100" },
  { icon: "user", label: "Refer a friend", pts: "+120" },
  { icon: "key", label: "On-time rent renewal", pts: "+130" },
];

const REDEEM: { icon: IconName; label: string; cost: number; hint: string }[] = [
  { icon: "bolt", label: "Priority inspection slot", cost: 80, hint: "Skip the queue on your next booking" },
  { icon: "cash", label: "₦2,500 off service fee", cost: 150, hint: "Discount on your next escrow fee" },
  { icon: "crown", label: "1 month Premium", cost: 300, hint: "Unlock Premium perks free" },
];

export default function LoyaltyPage() {
  return (
    <div className="page page-narrow">
      <PageHeader title="Loyalty" subtitle="Earn points for renting safely — redeem them for perks." />

      <div className="card" style={{ background: "linear-gradient(120deg, var(--gold-600), var(--gold-500))", color: "var(--navy-900)", border: "none", padding: "22px 24px", marginBottom: 18 }}>
        <span style={{ fontSize: 13, fontWeight: 600, opacity: 0.8 }}>Your balance</span>
        <div className="row gap-2" style={{ alignItems: "baseline", marginTop: 2 }}>
          <span style={{ fontFamily: "var(--font-display)", fontWeight: 800, fontSize: 40 }}>{LOYALTY.balance}</span>
          <span style={{ fontWeight: 700 }}>points</span>
        </div>
      </div>

      <div className="two-col even">
        <div className="card card-pad">
          <h3 style={{ fontSize: 16, marginBottom: 12 }}>Ways to earn</h3>
          <div className="col gap-2">
            {EARN.map((e) => (
              <div key={e.label} className="row between" style={{ padding: "8px 0" }}>
                <span className="row gap-3"><Icon name={e.icon} size={18} color="var(--navy-600)" /> {e.label}</span>
                <strong style={{ color: "var(--ok)" }}>{e.pts}</strong>
              </div>
            ))}
          </div>
        </div>

        <div className="card card-pad">
          <h3 style={{ fontSize: 16, marginBottom: 12 }}>Recent activity</h3>
          <div className="col gap-2">
            {LOYALTY.history.map((h) => (
              <div key={h.id} className="row between" style={{ padding: "8px 0", fontSize: 13.5 }}>
                <span className="col" style={{ gap: 1 }}>
                  <span>{h.label}</span>
                  <span style={{ fontSize: 12, color: "var(--muted)" }}>{h.date}</span>
                </span>
                <strong style={{ color: h.kind === "earn" ? "var(--ok)" : "var(--danger)" }}>
                  {h.kind === "earn" ? "+" : ""}{h.points}
                </strong>
              </div>
            ))}
          </div>
        </div>
      </div>

      <h3 style={{ fontSize: 17, margin: "22px 0 12px" }}>Redeem</h3>
      <div className="card-grid">
        {REDEEM.map((r) => (
          <div key={r.label} className="card card-pad col gap-3">
            <span className="grid place-items-center" style={{ width: 42, height: 42, borderRadius: 12, background: "var(--gold-050)", color: "var(--gold-700)" }}>
              <Icon name={r.icon} size={20} />
            </span>
            <strong style={{ fontSize: 15 }}>{r.label}</strong>
            <p style={{ fontSize: 13, color: "var(--muted)", flex: 1 }}>{r.hint}</p>
            <button
              className="btn btn-ghost btn-sm"
              disabled={LOYALTY.balance < r.cost}
              onClick={() => toast.success(`Redeemed: ${r.label}`)}
            >
              {r.cost} points
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}
