"use client";

import { PageHeader } from "@/components/shared/page-header";
import { EmptyState } from "@/components/shared/empty-state";
import { Naira } from "@/components/shared/naira";
import { Icon } from "@/components/ui/icon";
import { useAppStore } from "@/store/app-store";
import { useShallow } from "zustand/react/shallow";
import { propertyById } from "@/lib/mock-data";
import { toast } from "sonner";

const TENANT = "Bisi Akande";

export default function ReceiptsPage() {
  const receipts = useAppStore(
    useShallow((s) =>
      s.escrow.filter((e) => e.tenantName === TENANT && ["SETTLED", "REFUNDED"].includes(e.status)),
    ),
  );

  return (
    <div className="page page-narrow">
      <PageHeader title="Receipts" subtitle="Download proof of your completed payments." />
      {receipts.length === 0 ? (
        <EmptyState icon="receipt" title="No receipts yet" description="Once a payment settles, your receipt will be available here." />
      ) : (
        <div className="col gap-3">
          {receipts.map((r) => {
            const prop = propertyById(r.propertyId);
            return (
              <div key={r.id} className="card card-pad row between" style={{ alignItems: "center" }}>
                <div className="row gap-3">
                  <span className="grid place-items-center" style={{ width: 42, height: 42, borderRadius: 12, background: "var(--ok-bg)", color: "var(--ok)" }}>
                    <Icon name="receipt" size={20} />
                  </span>
                  <div className="col" style={{ gap: 2 }}>
                    <strong style={{ fontSize: 14.5 }}>{prop?.title ?? r.id}</strong>
                    <span className="mono" style={{ fontSize: 12, color: "var(--muted)" }}>{r.id} · {r.settledOn ?? r.refundedOn}</span>
                  </div>
                </div>
                <div className="row gap-3">
                  <Naira value={r.amount} size={16} />
                  <button className="btn btn-ghost btn-sm" onClick={() => toast("Receipt downloaded (demo)")}>
                    <Icon name="receipt" size={15} /> PDF
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
