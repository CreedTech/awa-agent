"use client";

import Link from "next/link";
import { PageHeader } from "@/components/shared/page-header";
import { EmptyState } from "@/components/shared/empty-state";
import { Naira } from "@/components/shared/naira";
import { EscrowBadge } from "@/components/shared/status-badge";
import { Icon } from "@/components/ui/icon";
import { useAppStore } from "@/store/app-store";
import { useShallow } from "zustand/react/shallow";
import { propertyById } from "@/lib/mock-data";
import { formatCurrency } from "@/lib/utils";

const TENANT = "Bisi Akande";

export default function EscrowWalletPage() {
  const escrow = useAppStore(useShallow((s) => s.escrow.filter((e) => e.tenantName === TENANT)));

  const locked = escrow.filter((e) => ["FUNDS_LOCKED", "FROZEN", "DISPUTED"].includes(e.status)).reduce((n, e) => n + e.amount, 0);
  const settled = escrow.filter((e) => e.status === "SETTLED").reduce((n, e) => n + e.amount, 0);
  const refunded = escrow.filter((e) => e.status === "REFUNDED").reduce((n, e) => n + e.amount, 0);

  return (
    <div className="page page-narrow">
      <PageHeader title="Escrow wallet" subtitle="Your rent is protected here until you confirm your keys." />

      {/* Summary */}
      <div className="card" style={{ background: "linear-gradient(120deg, var(--navy-800), var(--navy-700))", color: "#fff", border: "none", padding: "22px 24px", marginBottom: 18 }}>
        <span style={{ fontSize: 13, color: "rgba(255,255,255,.7)" }}>Currently protected in escrow</span>
        <div style={{ fontFamily: "var(--font-display)", fontWeight: 800, fontSize: 36, marginTop: 4 }}>{formatCurrency(locked)}</div>
        <div className="row gap-6" style={{ marginTop: 16 }}>
          <div className="col" style={{ gap: 0 }}>
            <span style={{ fontSize: 12, color: "rgba(255,255,255,.6)" }}>Settled</span>
            <strong style={{ fontFamily: "var(--font-display)", fontSize: 18 }}>{formatCurrency(settled)}</strong>
          </div>
          <div className="col" style={{ gap: 0 }}>
            <span style={{ fontSize: 12, color: "rgba(255,255,255,.6)" }}>Refunded</span>
            <strong style={{ fontFamily: "var(--font-display)", fontSize: 18 }}>{formatCurrency(refunded)}</strong>
          </div>
        </div>
      </div>

      {escrow.length === 0 ? (
        <EmptyState icon="wallet" title="No escrow transactions yet" description="When you pay for a rental, your funds appear here - locked safely until handover." action={{ label: "Explore homes", href: "/explore" }} />
      ) : (
        <div className="col gap-3">
          {escrow.map((e) => {
            const prop = propertyById(e.propertyId);
            return (
              <Link key={e.id} href={`/tenant/escrow/${e.id}`} className="card card-pad row between" style={{ alignItems: "center" }}>
                <div className="col" style={{ gap: 4 }}>
                  <strong style={{ fontSize: 15 }}>{prop?.title ?? e.id}</strong>
                  <span className="mono" style={{ fontSize: 12, color: "var(--muted)" }}>{e.id}</span>
                  <Naira value={e.amount} size={17} />
                </div>
                <div className="col" style={{ alignItems: "flex-end", gap: 8 }}>
                  <EscrowBadge status={e.status} />
                  <Icon name="chevR" size={18} color="var(--faint)" />
                </div>
              </Link>
            );
          })}
        </div>
      )}
    </div>
  );
}
