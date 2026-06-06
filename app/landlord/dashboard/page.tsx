"use client";

import Link from "next/link";
import { Icon } from "@/components/ui/icon";
import { StatCard } from "@/components/shared/stat-card";
import { Avatar } from "@/components/shared/avatar";
import { TrustBadge } from "@/components/shared/trust-badge";
import { Naira } from "@/components/shared/naira";
import { StatusBadge } from "@/components/shared/status-badge";
import { useAppStore } from "@/store/app-store";
import { useShallow } from "zustand/react/shallow";
import { LANDLORD_STATS, PAYOUT_HISTORY } from "@/lib/mock-data";
import { formatCurrency } from "@/lib/utils";
import { toast } from "sonner";

const PROP_STATUS = { LIVE: "ok", PENDING_ADMIN: "warn", OCCUPIED: "lock", PAUSED: "navy" } as const;

export default function LandlordDashboardPage() {
  const requests = useAppStore(useShallow((s) => s.agentRequests.filter((r) => r.status === "PENDING")));
  const properties = useAppStore((s) => s.landlordProperties);
  const resolve = useAppStore((s) => s.resolveAgentRequest);

  return (
    <>
      <div className="stats-grid">
        <StatCard label="Rent collected" value={formatCurrency(LANDLORD_STATS.totalRentPaid)} icon="cash" />
        <StatCard label="Active properties" value={LANDLORD_STATS.activeProperties} icon="building" />
        <StatCard label="Occupied" value={LANDLORD_STATS.occupiedCount} icon="key" />
        <StatCard label="Agent requests" value={requests.length} icon="users" />
        <StatCard label="Avg days to let" value={LANDLORD_STATS.avgDaysToLet} icon="clock" />
        <StatCard label="Upcoming renewals" value={LANDLORD_STATS.upcomingRenewals} icon="refresh" />
      </div>

      <div className="two-col">
        {/* Agent requests */}
        <div className="card card-pad">
          <div className="row between" style={{ marginBottom: 14 }}>
            <h3 style={{ fontSize: 17 }}>Agent authorization requests</h3>
            <Link href="/landlord/agent-matrix" style={{ fontSize: 13, color: "var(--navy-700)", fontWeight: 600 }}>Matrix</Link>
          </div>
          {requests.length === 0 ? (
            <p style={{ color: "var(--muted)", fontSize: 14 }}>No pending requests.</p>
          ) : (
            <div className="col gap-3">
              {requests.map((r) => (
                <div key={r.id} className="card card-pad col gap-3" style={{ background: "var(--paper)", border: "none" }}>
                  <div className="row between">
                    <div className="row gap-3">
                      <Avatar name={r.agentName} size={40} />
                      <div className="col" style={{ gap: 2 }}>
                        <strong style={{ fontSize: 14 }}>{r.agentName}</strong>
                        <span style={{ fontSize: 12, color: "var(--muted)" }}>{r.agentId} · {r.date}</span>
                      </div>
                    </div>
                    <TrustBadge score={r.trust} sm />
                  </div>
                  <p style={{ fontSize: 13, color: "var(--ink-2)" }}>{r.note}</p>
                  <div className="row gap-2">
                    <button className="btn btn-ok btn-sm grow" onClick={() => { resolve(r.id, true); toast.success(`Authorized ${r.agentName}`); }}><Icon name="check" size={15} strokeWidth={2.2} /> Authorize</button>
                    <button className="btn btn-danger btn-sm grow" onClick={() => { resolve(r.id, false); toast(`Rejected ${r.agentName}`); }}>Reject</button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Recent payouts + portfolio */}
        <div className="col gap-4">
          <div className="card card-pad">
            <h3 style={{ fontSize: 17, marginBottom: 12 }}>Recent payouts</h3>
            <div className="col gap-3">
              {PAYOUT_HISTORY.map((p) => (
                <div key={p.id} className="row between">
                  <div className="col" style={{ gap: 2 }}>
                    <strong style={{ fontSize: 13.5 }}>{p.prop}</strong>
                    <span style={{ fontSize: 12, color: "var(--muted)" }}>{p.date}</span>
                  </div>
                  <Naira value={p.net} size={14} color="var(--ok)" />
                </div>
              ))}
            </div>
          </div>

          <div className="card card-pad">
            <h3 style={{ fontSize: 17, marginBottom: 12 }}>Portfolio status</h3>
            <div className="col gap-2">
              {properties.map((p) => (
                <div key={p.id} className="row between" style={{ fontSize: 13.5 }}>
                  <span>{p.title}</span>
                  <StatusBadge variant={PROP_STATUS[p.status]}>{p.status.replace("_", " ")}</StatusBadge>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
