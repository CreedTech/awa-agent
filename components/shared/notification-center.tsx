"use client";

import Link from "next/link";
import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { notificationService } from "@/services/notification-service";
import { PageHeader } from "@/components/shared/page-header";

export function NotificationCenter() {
  const notifications = useQuery({ queryKey: ["notifications"], queryFn: notificationService.list });
  const [busy, setBusy] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const read = async (id: string) => {
    setBusy(id); setError(null);
    try { await notificationService.markRead(id); await notifications.refetch(); }
    catch (cause) { setError(cause instanceof Error ? cause.message : "Could not mark notification as read."); }
    finally { setBusy(null); }
  };
  return <div className="page page-narrow col gap-4">
    <PageHeader title="Notifications" subtitle="Updates recorded for your account." />
    {error && <p role="alert">{error}</p>}
    {notifications.isPending ? <p>Loading notifications...</p> : notifications.isError ? <p role="alert">Could not load notifications.</p> :
      notifications.data.length === 0 ? <p>No notifications yet.</p> : notifications.data.map((item) =>
        <article className="card card-pad col gap-2" key={item.id}>
          <strong>{item.title}</strong><p>{item.body}</p>
          <time dateTime={item.createdAt}>{new Date(item.createdAt).toLocaleString()}</time>
          <div className="row gap-2 wrap">
            {item.href?.startsWith("/") && !item.href.startsWith("//") && <Link className="btn btn-ghost" href={item.href}>View details</Link>}
            {!item.readAt && <button className="btn btn-ghost" type="button" disabled={busy !== null} onClick={() => void read(item.id)}>Mark as read</button>}
          </div>
        </article>)}
  </div>;
}
