"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Icon } from "@/components/ui/icon";
import { Avatar } from "@/components/shared/avatar";
import { TrustBadge } from "@/components/shared/trust-badge";
import { StatusBadge } from "@/components/shared/status-badge";
import { BottomSheet } from "@/components/shared/bottom-sheet";
import { Field } from "@/components/shared/field";
import { useAppStore } from "@/store/app-store";
import { authorizeAgentSchema, type AuthorizeAgentValues } from "@/lib/validations";
import { cn } from "@/lib/utils";
import { toast } from "sonner";

export default function AgentMatrixPage() {
  const properties = useAppStore((s) => s.landlordProperties);
  const requests = useAppStore((s) => s.agentRequests);
  const setPrimary = useAppStore((s) => s.setPrimaryAgent);
  const revoke = useAppStore((s) => s.revokeAgent);
  const reauthorize = useAppStore((s) => s.reauthorizeAgent);
  const setMaxAgents = useAppStore((s) => s.setMaxAgents);
  const resolve = useAppStore((s) => s.resolveAgentRequest);

  const [activeId, setActiveId] = useState(properties[0]?.id);
  const [authorizing, setAuthorizing] = useState(false);
  const prop = properties.find((p) => p.id === activeId) ?? properties[0];
  const pending = requests.filter((r) => r.propertyId === prop?.id && r.status === "PENDING");

  const { register, handleSubmit, reset, formState: { errors } } =
    useForm<AuthorizeAgentValues>({ resolver: zodResolver(authorizeAgentSchema) });

  if (!prop) return null;

  return (
    <>
      {/* Property selector */}
      <div className="row wrap gap-2" style={{ marginBottom: 18 }}>
        {properties.map((p) => (
          <button key={p.id} className={cn("chip", activeId === p.id && "is-active")} onClick={() => setActiveId(p.id)}>
            {p.title}
          </button>
        ))}
      </div>

      {/* Pending request banner */}
      {pending.map((r) => (
        <div key={r.id} className="card card-pad row between wrap gap-3" style={{ background: "var(--warn-bg)", border: "none", marginBottom: 14 }}>
          <div className="row gap-3">
            <Icon name="clock" size={20} color="var(--warn)" />
            <span style={{ fontSize: 13.5 }}><strong>{r.agentName}</strong> ({r.agentId}) requests to co-list this property.</span>
          </div>
          <div className="row gap-2">
            <button className="btn btn-ok btn-sm" onClick={() => { resolve(r.id, true); toast.success(`Authorized ${r.agentName}`); }}>Authorize</button>
            <button className="btn btn-danger btn-sm" onClick={() => { resolve(r.id, false); toast(`Rejected ${r.agentName}`); }}>Reject</button>
          </div>
        </div>
      ))}

      {/* Max agents stepper */}
      <div className="card card-pad row between wrap gap-3" style={{ marginBottom: 16 }}>
        <div className="col" style={{ gap: 2 }}>
          <strong style={{ fontSize: 15 }}>Max agents for this property</strong>
          <span style={{ fontSize: 13, color: "var(--muted)" }}>Limit how many agents can represent it</span>
        </div>
        <div className="row gap-3" style={{ alignItems: "center" }}>
          <button className="icon-btn" style={{ border: "1px solid var(--line-2)" }} onClick={() => setMaxAgents(prop.id, prop.maxAgents - 1)} aria-label="Decrease"><Icon name="minus" size={16} /></button>
          <strong style={{ fontFamily: "var(--font-display)", fontSize: 20, minWidth: 24, textAlign: "center" }}>{prop.maxAgents}</strong>
          <button className="icon-btn" style={{ border: "1px solid var(--line-2)" }} onClick={() => setMaxAgents(prop.id, prop.maxAgents + 1)} aria-label="Increase"><Icon name="plus" size={16} /></button>
        </div>
      </div>

      {/* Agents table */}
      <div className="table-wrap" style={{ marginBottom: 16 }}>
        <table className="data-table">
          <thead>
            <tr><th>Agent</th><th>Role</th><th>Trust</th><th>Commission</th><th>Deals</th><th>Since</th><th>Status</th><th></th></tr>
          </thead>
          <tbody>
            {prop.agents.map((a) => (
              <tr key={a.id}>
                <td>
                  <div className="row gap-2"><Avatar name={a.name} photo={a.photo} size={32} /> <div className="col" style={{ gap: 0 }}><strong style={{ fontSize: 13 }}>{a.name}</strong><span className="mono" style={{ fontSize: 11, color: "var(--muted)" }}>{a.id}</span></div></div>
                </td>
                <td>{a.role === "PRIMARY" ? <span className="tag tag-gold">Primary</span> : <span className="tag tag-navy">Authorized</span>}</td>
                <td><TrustBadge score={a.trust} sm /></td>
                <td>{a.commission}%</td>
                <td>{a.deals}</td>
                <td style={{ color: "var(--muted)" }}>{a.since}</td>
                <td><StatusBadge variant={a.status === "REVOKED" ? "danger" : "ok"}>{a.status}</StatusBadge></td>
                <td>
                  <div className="row gap-2">
                    {a.status === "REVOKED" ? (
                      <button className="btn btn-ok btn-sm" onClick={() => { reauthorize(prop.id, a.id); toast.success("Re-authorized"); }}>Re-authorize</button>
                    ) : (
                      <>
                        {a.role !== "PRIMARY" && <button className="btn btn-ghost btn-sm" onClick={() => { setPrimary(prop.id, a.id); toast.success(`${a.name} is now primary`); }}>Set primary</button>}
                        <button className="btn btn-danger btn-sm" onClick={() => { revoke(prop.id, a.id); toast(`Revoked ${a.name}`); }}>Revoke</button>
                      </>
                    )}
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <button className="btn btn-primary btn-sm" onClick={() => setAuthorizing(true)}><Icon name="plus" size={16} /> Authorize a new agent</button>

      <BottomSheet open={authorizing} onClose={() => setAuthorizing(false)} title="Authorize an agent" maxWidth={420}>
        <form
          className="col gap-4"
          style={{ padding: "8px 20px 24px" }}
          onSubmit={handleSubmit((v) => { toast.success(`Authorization sent to ${v.agentId}`); reset(); setAuthorizing(false); })}
          noValidate
        >
          <p style={{ fontSize: 13.5, color: "var(--muted)" }}>Enter the agent&apos;s ID to authorize them for <strong style={{ color: "var(--ink)" }}>{prop.title}</strong>.</p>
          <Field label="Agent ID" icon="user" error={errors.agentId?.message}>
            <input className="input" placeholder="AGT-1234" {...register("agentId")} />
          </Field>
          <button className="btn btn-primary btn-block btn-lg" type="submit">Authorize agent</button>
        </form>
      </BottomSheet>
    </>
  );
}
