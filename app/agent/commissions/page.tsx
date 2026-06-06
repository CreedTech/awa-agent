"use client";

import { CommissionAttribution } from "@/components/agent/commission-attribution";
import { EmptyState } from "@/components/shared/empty-state";
import { COMMISSIONS } from "@/lib/mock-data";

export default function AgentCommissionsPage() {
  return (
    <>
      <p style={{ color: "var(--muted)", fontSize: 14.5, marginBottom: 18 }}>
        Every closed deal shows exactly who contributed and who gets paid — so commission is always fair and transparent.
      </p>
      {COMMISSIONS.length === 0 ? (
        <EmptyState icon="coins" title="No commissions yet" description="Close your first verified deal to see the attribution breakdown here." />
      ) : (
        <div className="col gap-4" style={{ maxWidth: 620 }}>
          {COMMISSIONS.map((c) => (
            <div key={c.txnRef} className="card card-pad col gap-3">
              <div className="row between wrap gap-2">
                <strong style={{ fontSize: 15 }}>{c.propertyName}</strong>
                <span className="mono" style={{ fontSize: 12, color: "var(--muted)" }}>{c.txnRef}</span>
              </div>
              <CommissionAttribution commission={c} />
            </div>
          ))}
        </div>
      )}
    </>
  );
}
