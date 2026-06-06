"use client";

import { useState } from "react";
import { CommissionAttribution } from "@/components/agent/commission-attribution";
import { ConfirmDialog } from "@/components/shared/confirm-dialog";
import { Icon } from "@/components/ui/icon";
import { COMMISSIONS } from "@/lib/mock-data";
import { toast } from "sonner";

export default function AdminCommissionsPage() {
  const [overridden, setOverridden] = useState<Record<string, boolean>>({});
  const [confirmRef, setConfirmRef] = useState<string | null>(null);

  return (
    <>
      <p style={{ color: "var(--muted)", fontSize: 14.5, marginBottom: 18 }}>
        Review commission attribution for closed deals. Use overrides only to resolve disputes.
      </p>
      <div className="col gap-4" style={{ maxWidth: 680 }}>
        {COMMISSIONS.map((c) => {
          const isOverridden = overridden[c.txnRef] || c.adminOverride;
          return (
            <div key={c.txnRef} className="card card-pad col gap-3">
              <div className="row between wrap gap-2">
                <strong style={{ fontSize: 15 }}>{c.propertyName}</strong>
                <span className="mono" style={{ fontSize: 12, color: "var(--muted)" }}>{c.txnRef}</span>
              </div>
              <CommissionAttribution commission={{ ...c, adminOverride: isOverridden }} />
              <div className="row gap-2">
                {isOverridden ? (
                  <button className="btn btn-ghost btn-sm" onClick={() => { setOverridden((o) => ({ ...o, [c.txnRef]: false })); toast("Override removed"); }}>
                    <Icon name="refresh" size={15} /> Remove override
                  </button>
                ) : (
                  <button className="btn btn-warn btn-sm" onClick={() => setConfirmRef(c.txnRef)}>
                    <Icon name="swap" size={15} /> Admin override
                  </button>
                )}
              </div>
            </div>
          );
        })}
      </div>

      <ConfirmDialog
        open={confirmRef !== null}
        onOpenChange={(o) => !o && setConfirmRef(null)}
        title="Override this commission?"
        description="The standard attribution will be flagged as admin-overridden. Use this only to settle a commission dispute — it's recorded in the audit log."
        confirmLabel="Apply override"
        tone="warn"
        onConfirm={() => {
          if (!confirmRef) return;
          setOverridden((o) => ({ ...o, [confirmRef]: true }));
          toast.success("Commission override applied");
        }}
      />
    </>
  );
}
