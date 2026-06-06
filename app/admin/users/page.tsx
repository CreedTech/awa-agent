"use client";

import { useState } from "react";
import { Avatar } from "@/components/shared/avatar";
import { StatusBadge } from "@/components/shared/status-badge";
import { Icon } from "@/components/ui/icon";
import { useAppStore } from "@/store/app-store";
import { ROLE_LABELS } from "@/lib/constants";
import { toast } from "sonner";
import type { BadgeVariant } from "@/lib/constants";
import type { AccountStatus } from "@/lib/types";

const ACCOUNT: Record<AccountStatus, BadgeVariant> = { ACTIVE: "ok", SUSPENDED: "warn", BANNED: "danger" };
const KYC: Record<string, BadgeVariant> = { VERIFIED: "ok", PENDING: "warn", UNVERIFIED: "navy", REJECTED: "danger", SUSPENDED: "danger" };

export default function AdminUsersPage() {
  const users = useAppStore((s) => s.users);
  const setStatus = useAppStore((s) => s.setUserAccountStatus);
  const [q, setQ] = useState("");

  const rows = users.filter((u) => u.name.toLowerCase().includes(q.toLowerCase()) || ROLE_LABELS[u.role].toLowerCase().includes(q.toLowerCase()));

  const act = (id: string, name: string, status: AccountStatus) => {
    setStatus(id, status);
    toast.success(`${name} → ${status.toLowerCase()}`);
  };

  return (
    <>
      <div className="search" style={{ maxWidth: 320, marginBottom: 16 }}>
        <Icon name="search" size={17} />
        <input placeholder="Search by name or role..." value={q} onChange={(e) => setQ(e.target.value)} aria-label="Search users" />
      </div>

      <div className="table-wrap">
        <table className="data-table">
          <thead>
            <tr><th>User</th><th>Role</th><th>KYC</th><th>Joined</th><th>Account</th><th>Actions</th></tr>
          </thead>
          <tbody>
            {rows.map((u) => (
              <tr key={u.id}>
                <td><div className="row gap-2"><Avatar name={u.name} photo={u.photo} size={30} /><strong style={{ fontSize: 13 }}>{u.name}</strong></div></td>
                <td><span className="tag tag-navy">{ROLE_LABELS[u.role]}</span></td>
                <td><StatusBadge variant={KYC[u.kycStatus]}>{u.kycStatus}</StatusBadge></td>
                <td style={{ color: "var(--muted)" }}>{u.joined}</td>
                <td><StatusBadge variant={ACCOUNT[u.accountStatus]}>{u.accountStatus}</StatusBadge></td>
                <td>
                  <div className="row gap-2">
                    {u.accountStatus === "ACTIVE" && (
                      <>
                        <button className="btn btn-warn btn-sm" onClick={() => act(u.id, u.name, "SUSPENDED")}>Suspend</button>
                        <button className="btn btn-danger btn-sm" onClick={() => act(u.id, u.name, "BANNED")}>Ban</button>
                      </>
                    )}
                    {u.accountStatus !== "ACTIVE" && (
                      <button className="btn btn-ok btn-sm" onClick={() => act(u.id, u.name, "ACTIVE")}>Restore</button>
                    )}
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </>
  );
}
