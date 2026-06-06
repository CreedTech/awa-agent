"use client";

import { Avatar } from "@/components/shared/avatar";
import { TrustBadge } from "@/components/shared/trust-badge";
import { Icon } from "@/components/ui/icon";
import { AGENTS } from "@/lib/mock-data";
import { commissionPctForTrust, getTrustBadge } from "@/lib/utils";

export default function AdminTrustScoresPage() {
  const agents = Object.values(AGENTS).sort((a, b) => b.trust - a.trust);

  return (
    <>
      <p style={{ color: "var(--muted)", fontSize: 14.5, marginBottom: 18 }}>
        Trust scores (0–100) are derived from completed deals, dispute rate, KYC tier, GPS accuracy and OTP success — and set each agent&apos;s commission rate.
      </p>

      <div className="table-wrap">
        <table className="data-table">
          <thead><tr><th>Agent</th><th>Trust</th><th>Tier</th><th>Deals</th><th>Commission</th><th>Verified</th></tr></thead>
          <tbody>
            {agents.map((a) => {
              const badge = getTrustBadge(a.trust);
              return (
                <tr key={a.id}>
                  <td><div className="row gap-2"><Avatar name={a.name} photo={a.photo} size={32} /><div className="col" style={{ gap: 0 }}><strong style={{ fontSize: 13 }}>{a.name}</strong><span className="mono" style={{ fontSize: 11, color: "var(--muted)" }}>{a.id}</span></div></div></td>
                  <td><TrustBadge score={a.trust} sm /></td>
                  <td><span className={`tag tag-${badge.variant}`}>{badge.label}</span></td>
                  <td>{a.deals}</td>
                  <td>{commissionPctForTrust(a.trust)}%</td>
                  <td>{a.verified ? <Icon name="check" size={16} strokeWidth={2.4} color="var(--ok)" /> : <Icon name="close" size={16} color="var(--danger)" />}</td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </>
  );
}
