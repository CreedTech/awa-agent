import { Naira } from "@/components/shared/naira";
import { Icon } from "@/components/ui/icon";
import type { RentBreakdown } from "@/lib/types";

interface RentBreakdownProps {
  breakdown: RentBreakdown;
  /** Show the year-2 renewal note. */
  showRenewalNote?: boolean;
}

/** Transparent first-year premium breakdown (base + commission + escrow fee). */
export function RentBreakdownView({ breakdown: b, showRenewalNote = true }: RentBreakdownProps) {
  const rows = [
    { label: "Base rent (annual)", value: b.baseRent, hint: "Paid to the landlord" },
    { label: `Agent commission (${b.commissionPct}%)`, value: b.commission, hint: "Verified-contribution payout" },
    { label: `AwaAgent escrow fee (${b.escrowFeePct}%)`, value: b.escrowFee, hint: "Protects your money" },
  ];

  return (
    <div>
      {rows.map((r) => (
        <div key={r.label} className="brk-row">
          <div className="col" style={{ gap: 1 }}>
            <span style={{ fontSize: 14, fontWeight: 600 }}>{r.label}</span>
            <span style={{ fontSize: 12, color: "var(--muted)" }}>{r.hint}</span>
          </div>
          <Naira value={r.value} size={15} weight={700} />
        </div>
      ))}
      <div className="brk-row" style={{ borderTop: "2px solid var(--line-2)" }}>
        <span style={{ fontSize: 15, fontWeight: 800, fontFamily: "var(--font-display)" }}>1st-year total</span>
        <Naira value={b.total} size={20} />
      </div>
      {showRenewalNote && (
        <div className="row gap-2" style={{ marginTop: 10, padding: "10px 12px", background: "var(--navy-050)", borderRadius: 10, fontSize: 12.5, color: "var(--navy-700)" }}>
          <Icon name="info" size={15} />
          <span>From year 2 you pay the base rent only - no commission, reduced {b.escrowFeePct === 2.5 ? "1%" : `${b.escrowFeePct}%`} escrow fee.</span>
        </div>
      )}
    </div>
  );
}
