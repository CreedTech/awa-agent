import { Icon } from "@/components/ui/icon";
import type { AgentCommission } from "@/lib/types";

const ROLES = [
  { key: "listingAgent", label: "Listing agent", icon: "building" },
  { key: "inspectionAgent", label: "Inspection agent", icon: "calendar" },
  { key: "closingAgent", label: "Closing agent", icon: "key" },
] as const;

/** Who-gets-paid-and-why panel for a closed transaction. */
export function CommissionAttribution({ commission }: { commission: AgentCommission }) {
  return (
    <div className="col gap-3">
      <div className="card" style={{ background: "var(--paper)", border: "none" }}>
        {ROLES.map((r) => {
          const agent = commission[r.key];
          return (
            <div key={r.key} className="brk-row" style={{ padding: "11px 14px" }}>
              <span className="row gap-2" style={{ fontSize: 13.5 }}>
                <Icon name={r.icon} size={15} color="var(--navy-600)" /> {r.label}
              </span>
              <span className="row gap-2" style={{ fontSize: 13 }}>
                <span style={{ color: "var(--muted)" }}>{agent.name}</span>
                <strong>{agent.sharePct}%</strong>
              </span>
            </div>
          );
        })}
        <div className="brk-row" style={{ padding: "11px 14px", borderTop: "2px solid var(--line-2)" }}>
          <span className="row gap-2" style={{ fontSize: 13.5, fontWeight: 700 }}>
            <Icon name="coins" size={15} color="var(--gold-600)" /> Final recipient
          </span>
          <strong style={{ fontSize: 13.5 }}>{commission.finalRecipient.name}</strong>
        </div>
      </div>

      {commission.bonusSplit && (
        <span className="tag tag-gold" style={{ width: "fit-content" }}>Listing bonus split applied</span>
      )}
      {commission.adminOverride && (
        <span className="tag tag-warn" style={{ width: "fit-content" }}>Admin override</span>
      )}

      <p style={{ fontSize: 13, color: "var(--ink-2)", lineHeight: 1.6, background: "var(--navy-050)", padding: "10px 12px", borderRadius: 10 }}>
        <Icon name="info" size={14} /> {commission.reason}
      </p>
    </div>
  );
}
