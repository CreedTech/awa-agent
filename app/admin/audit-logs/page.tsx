"use client";

import { useState } from "react";
import { Icon } from "@/components/ui/icon";
import { AUDIT_LOGS } from "@/lib/mock-data";

export default function AdminAuditLogsPage() {
  const [q, setQ] = useState("");
  const rows = AUDIT_LOGS.filter((l) => `${l.actor} ${l.action} ${l.target}`.toLowerCase().includes(q.toLowerCase()));

  return (
    <>
      <div className="search" style={{ maxWidth: 320, marginBottom: 16 }}>
        <Icon name="search" size={17} />
        <input placeholder="Search audit logs..." value={q} onChange={(e) => setQ(e.target.value)} aria-label="Search audit logs" />
      </div>

      <div className="table-wrap">
        <table className="data-table">
          <thead><tr><th>Actor</th><th>Action</th><th>Target</th><th>Time</th><th>IP</th></tr></thead>
          <tbody>
            {rows.map((l) => (
              <tr key={l.id}>
                <td><strong style={{ fontSize: 13 }}>{l.actor}</strong></td>
                <td>{l.action}</td>
                <td className="mono" style={{ fontSize: 12 }}>{l.target}</td>
                <td style={{ color: "var(--muted)" }}>{l.time}</td>
                <td className="mono" style={{ fontSize: 12, color: "var(--muted)" }}>{l.ip}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </>
  );
}
