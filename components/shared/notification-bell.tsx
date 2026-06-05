"use client";

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Icon } from "@/components/ui/icon";
import { useAppStore } from "@/store/app-store";

/** Topbar bell with unread dot + a dropdown notification feed. */
export function NotificationBell() {
  const notifications = useAppStore((s) => s.notifications);
  const markAll = useAppStore((s) => s.markAllNotificationsRead);
  const unread = notifications.filter((n) => !n.read).length;

  return (
    <DropdownMenu>
      <DropdownMenuTrigger
        render={<button className="icon-btn" aria-label={`Notifications (${unread} unread)`} style={{ position: "relative" }} />}
      >
        <Icon name="bell" size={20} />
        {unread > 0 && (
          <span
            style={{
              position: "absolute",
              top: 6,
              right: 7,
              width: 8,
              height: 8,
              borderRadius: "50%",
              background: "var(--gold-500)",
              boxShadow: "0 0 0 2px #fff",
            }}
          />
        )}
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-[330px] p-0">
        <div className="row between" style={{ padding: "12px 14px", borderBottom: "1px solid var(--line)" }}>
          <strong style={{ fontSize: 14 }}>Notifications</strong>
          {unread > 0 && (
            <button className="btn-quiet" style={{ fontSize: 12.5, color: "var(--navy-600)", padding: 0 }} onClick={markAll}>
              Mark all read
            </button>
          )}
        </div>
        <div className="scroll" style={{ maxHeight: 360, overflow: "auto" }}>
          {notifications.length === 0 && (
            <p style={{ padding: 20, textAlign: "center", color: "var(--muted)", fontSize: 13.5 }}>
              You&apos;re all caught up.
            </p>
          )}
          {notifications.slice(0, 12).map((n) => (
            <div
              key={n.id}
              className="row gap-3"
              style={{
                padding: "11px 14px",
                borderBottom: "1px solid var(--line)",
                alignItems: "flex-start",
                background: n.read ? "transparent" : "var(--navy-050)",
              }}
            >
              <span style={{ color: "var(--gold-600)", marginTop: 2 }}>
                <Icon name="bell" size={16} />
              </span>
              <div className="col" style={{ gap: 2 }}>
                <strong style={{ fontSize: 13.5 }}>{n.title}</strong>
                <span style={{ fontSize: 12.5, color: "var(--muted)" }}>{n.body}</span>
                <span style={{ fontSize: 11.5, color: "var(--faint)" }}>{n.time}</span>
              </div>
            </div>
          ))}
        </div>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
