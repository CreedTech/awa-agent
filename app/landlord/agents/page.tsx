"use client";

import Link from "next/link";
import { Icon } from "@/components/ui/icon";
import { Avatar } from "@/components/shared/avatar";
import { TrustBadge } from "@/components/shared/trust-badge";
import { useAppStore } from "@/store/app-store";
import type { PropertyAgent } from "@/lib/types";

export default function LandlordAgentsPage() {
  const properties = useAppStore((s) => s.landlordProperties);

  // Aggregate unique agents across the portfolio.
  const map = new Map<string, PropertyAgent & { properties: number; primaryFor: number }>();
  for (const p of properties) {
    for (const a of p.agents) {
      const existing = map.get(a.id);
      if (existing) {
        existing.properties += 1;
        existing.primaryFor += a.role === "PRIMARY" ? 1 : 0;
        existing.deals += a.deals;
      } else {
        map.set(a.id, { ...a, properties: 1, primaryFor: a.role === "PRIMARY" ? 1 : 0 });
      }
    }
  }
  const agents = [...map.values()].sort((a, b) => b.trust - a.trust);

  return (
    <>
      <p style={{ color: "var(--muted)", fontSize: 14.5, marginBottom: 18 }}>
        Every agent representing your portfolio. Manage authorizations per property in the
        <Link href="/landlord/agent-matrix" style={{ color: "var(--navy-700)", fontWeight: 600 }}> agent matrix</Link>.
      </p>

      <div className="table-wrap">
        <table className="data-table">
          <thead>
            <tr><th>Agent</th><th>Trust</th><th>Properties</th><th>Primary for</th><th>Deals</th><th>Commission</th><th></th></tr>
          </thead>
          <tbody>
            {agents.map((a) => (
              <tr key={a.id}>
                <td><div className="row gap-2"><Avatar name={a.name} photo={a.photo} size={32} /><div className="col" style={{ gap: 0 }}><strong style={{ fontSize: 13 }}>{a.name}</strong><span className="mono" style={{ fontSize: 11, color: "var(--muted)" }}>{a.id}</span></div></div></td>
                <td><TrustBadge score={a.trust} sm /></td>
                <td>{a.properties}</td>
                <td>{a.primaryFor}</td>
                <td>{a.deals}</td>
                <td>{a.commission}%</td>
                <td><Link href="/landlord/agent-matrix" className="btn btn-ghost btn-sm">Manage <Icon name="arrowR" size={14} /></Link></td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </>
  );
}
