"use client";

import Link from "next/link";
import { PageHeader } from "@/components/shared/page-header";
import { EmptyState } from "@/components/shared/empty-state";
import { StatusBadge } from "@/components/shared/status-badge";
import { Naira } from "@/components/shared/naira";
import { Icon } from "@/components/ui/icon";
import { useAppStore } from "@/store/app-store";
import { useShallow } from "zustand/react/shallow";

const TENANT = "Bisi Akande";
const PRIORITY_VARIANT = { HIGH: "danger", MEDIUM: "warn", LOW: "navy" } as const;
const STATUS_VARIANT = { OPEN: "warn", REVIEWING: "navy", RESOLVED: "ok" } as const;

export default function TenantDisputesPage() {
  const disputes = useAppStore(useShallow((s) => s.disputes.filter((d) => d.tenant === TENANT)));

  return (
    <div className="page page-narrow">
      <PageHeader title="Disputes" subtitle="Track issues you've raised on your escrow payments." />
      {disputes.length === 0 ? (
        <EmptyState icon="shieldCheck" title="No disputes" description="You haven't raised any disputes. If a rental goes wrong, you can open one from your escrow wallet." action={{ label: "Open wallet", href: "/tenant/escrow" }} />
      ) : (
        <div className="col gap-3">
          {disputes.map((d) => (
            <div key={d.id} className="card card-pad col gap-3">
              <div className="row between wrap gap-2">
                <strong style={{ fontSize: 15 }}>{d.propertyName}</strong>
                <div className="row gap-2">
                  <StatusBadge variant={PRIORITY_VARIANT[d.priority]}>{d.priority}</StatusBadge>
                  <StatusBadge variant={STATUS_VARIANT[d.status]}>{d.status}</StatusBadge>
                </div>
              </div>
              <p style={{ fontSize: 14, color: "var(--ink-2)" }}>{d.reason}</p>
              <div className="row between" style={{ fontSize: 13, color: "var(--muted)" }}>
                <span className="row gap-2"><Icon name="lock" size={14} /> <Naira value={d.amount} size={14} /> frozen</span>
                <span>Raised {d.raised}</span>
              </div>
              <Link href={`/tenant/escrow/${d.txnRef}`} className="row gap-2" style={{ fontSize: 13, color: "var(--navy-700)", fontWeight: 600 }}>
                View transaction <Icon name="arrowR" size={14} />
              </Link>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
