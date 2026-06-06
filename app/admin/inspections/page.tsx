"use client";

import { useState } from "react";
import { StatusBadge } from "@/components/shared/status-badge";
import { StatCard } from "@/components/shared/stat-card";
import { Icon } from "@/components/ui/icon";
import { INSP_MONITOR } from "@/lib/mock-data";
import { cn } from "@/lib/utils";
import type { BadgeVariant } from "@/lib/constants";

const STATUS: Record<string, BadgeVariant> = { COMPLETED: "ok", SCHEDULED: "navy", GPS_FAIL: "danger" };
const FILTERS = ["All", "COMPLETED", "SCHEDULED", "GPS_FAIL"];

export default function AdminInspectionsPage() {
  const [filter, setFilter] = useState("All");
  const rows = INSP_MONITOR.filter((i) => filter === "All" || i.status === filter);

  const completed = INSP_MONITOR.filter((i) => i.status === "COMPLETED").length;
  const failed = INSP_MONITOR.filter((i) => i.status === "GPS_FAIL").length;
  const rate = Math.round((completed / INSP_MONITOR.length) * 100);

  return (
    <>
      <div className="stats-grid">
        <StatCard label="Completed" value={completed} icon="check" />
        <StatCard label="GPS failures" value={failed} icon="gps" />
        <StatCard label="Completion rate" value={`${rate}%`} icon="trend" />
      </div>

      <div className="row wrap gap-2" style={{ marginBottom: 14 }}>
        {FILTERS.map((f) => <button key={f} className={cn("chip", filter === f && "is-active")} onClick={() => setFilter(f)}>{f.replace("_", " ")}</button>)}
      </div>

      <div className="table-wrap">
        <table className="data-table">
          <thead><tr><th>Property</th><th>Agent</th><th>Tenant</th><th>Date</th><th>OTP</th><th>GPS</th><th>Status</th></tr></thead>
          <tbody>
            {rows.map((i) => (
              <tr key={i.id}>
                <td><strong style={{ fontSize: 13 }}>{i.prop}</strong></td>
                <td>{i.agent}</td>
                <td>{i.tenant}</td>
                <td style={{ color: "var(--muted)" }}>{i.date} · {i.time}</td>
                <td>{i.otpVerified ? <Icon name="check" size={16} strokeWidth={2.4} color="var(--ok)" /> : <span style={{ color: "var(--muted)", fontSize: 12.5 }}>pending</span>}</td>
                <td>{i.gpsOk === null ? <span style={{ color: "var(--muted)", fontSize: 12.5 }}>—</span> : i.gpsOk ? <span className="tag tag-ok">OK</span> : <span className="tag tag-danger">Failed</span>}</td>
                <td><StatusBadge variant={STATUS[i.status]}>{i.status.replace("_", " ")}</StatusBadge></td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </>
  );
}
