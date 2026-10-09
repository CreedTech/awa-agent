"use client";

import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { NotificationCenter } from "@/components/shared/notification-center";
import { adminService } from "@/services/admin-service";

export default function Page() {
  const failures = useQuery({ queryKey: ["failed-notification-emails"], queryFn: adminService.failedNotificationEmails });
  const [busy, setBusy] = useState<number | null>(null);
  const [message, setMessage] = useState<string | null>(null);
  const retry = async (id: number) => {
    setBusy(id); setMessage(null);
    try {
      await adminService.retryNotificationEmail(id);
      await failures.refetch();
      setMessage("Email queued for another delivery attempt.");
    } catch (error) { setMessage(error instanceof Error ? error.message : "Could not retry this email."); }
    finally { setBusy(null); }
  };
  return <>
    <NotificationCenter />
    <section className="page page-narrow col gap-4" aria-labelledby="email-delivery-heading">
      <h2 id="email-delivery-heading">Email delivery issues</h2>
      <p>Account updates remain visible in the app. Retry a failed Resend delivery after checking its recipient and provider status.</p>
      {message && <p role="status">{message}</p>}
      {failures.isPending ? <p>Loading delivery issues...</p> : failures.isError ? <p role="alert">Could not load email delivery issues.</p> :
        failures.data.length === 0 ? <p>No email delivery issues.</p> : failures.data.map((item) =>
          <article className="card card-pad col gap-2" key={item.id}>
            <strong>{item.title}</strong>
            <span>{item.recipientName} · {item.recipientEmail}</span>
            <span>{item.emailStatus.toLowerCase()} · {item.emailAttempts} attempts · {new Date(item.createdAt).toLocaleString()}</span>
            {item.emailLastError && <span>{item.emailLastError}</span>}
            {item.retryable
              ? <button className="btn btn-ghost" type="button" disabled={busy !== null} onClick={() => void retry(item.id)}>{busy === item.id ? "Queuing..." : "Retry delivery"}</button>
              : <span>{item.emailStatus === "FAILED" ? "Email retry window expired." : "Review the recipient in Resend before sending again."} The in-app notification remains available.</span>}
          </article>)}
    </section>
  </>;
}
