"use client";

import { useQuery } from "@tanstack/react-query";
import { adminService } from "@/services/admin-service";
import { PageHeader } from "@/components/shared/page-header";

export default function Page() {
  const audit = useQuery({ queryKey: ["admin-audit"], queryFn: adminService.audit });
  return <div className="page page-narrow col gap-4">
    <PageHeader title="Audit log" subtitle="Recent administrative decisions and changes." />
    {audit.isPending ? <p>Loading audit log...</p> : audit.isError ? <p role="alert">Could not load the audit log.</p> :
      audit.data.length === 0 ? <p>No administrative actions yet.</p> : audit.data.map((event) =>
        <article className="card card-pad col gap-2" key={event.id}>
          <strong>{event.action.replaceAll("_", " ")}</strong>
          <span>{event.actorName} · {event.targetType} {event.targetId}</span>
          <time dateTime={event.createdAt}>{new Date(event.createdAt).toLocaleString()}</time>
          {Object.keys(event.detail).length > 0 && <pre style={{ whiteSpace: "pre-wrap", overflowWrap: "anywhere" }}>{JSON.stringify(event.detail, null, 2)}</pre>}
        </article>)}
  </div>;
}
