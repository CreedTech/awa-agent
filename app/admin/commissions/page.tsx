"use client";

import { CommissionAttribution } from "@/components/agent/commission-attribution";
import { Naira } from "@/components/shared/naira";
import { Icon } from "@/components/ui/icon";
import { COMMISSIONS } from "@/lib/mock-data";

export default function AdminCommissionsPage() {
  return (
    <>
      <p style={{ color: "var(--muted)", fontSize: 14.5, marginBottom: 18 }}>
        Review commission attribution for closed deals. Use overrides only to resolve disputes.
      </p>
      <div className="col gap-4" style={{ maxWidth: 680 }}>
        {COMMISSIONS.map((c) => (
          <div key={c.txnRef} className="card card-pad col gap-3">
            <div className="row between wrap gap-2">
              <strong style={{ fontSize: 15 }}>{c.propertyName}</strong>
              <span className="mono" style={{ fontSize: 12, color: "var(--muted)" }}>{c.txnRef}</span>
            </div>
            <CommissionAttribution commission={c} />
            <div className="row gap-2">
              <button className="btn btn-warn btn-sm"><Icon name="swap" size={15} /> Admin override</button>
            </div>
          </div>
        ))}
      </div>
    </>
  );
}
