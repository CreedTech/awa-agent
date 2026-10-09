"use client";

import Link from "next/link";
import { useQuery } from "@tanstack/react-query";
import { authorizationService } from "@/services/authorization-service";
import { Naira } from "@/components/shared/naira";
import { PageHeader } from "@/components/shared/page-header";

export default function Page() {
  const agents = useQuery({ queryKey: ["my-agents"], queryFn: authorizationService.myAgents });
  return <div className="page page-narrow col gap-4">
    <PageHeader title="Agent matrix" subtitle="Authorized agents and their current property listings." />
    {agents.isPending ? <p>Loading agent relationships...</p> : agents.isError ? <p role="alert">Could not load agent relationships.</p> :
      agents.data.length === 0 ? <p>No agent invitations yet. <Link href="/landlord/agents">Invite an agent</Link></p> :
      agents.data.map((agent) => <article className="card card-pad col gap-2" key={agent.id}>
        <strong>{agent.agentName}</strong><span>{agent.status} · KYC {agent.agentKycStatus} · Trust {agent.agentTrustScore}</span>
        <span>{agent.listingCount} listings · {agent.completedInspections} completed inspections · {agent.settledRentCount} settled rentals</span>
        <span className="row gap-2">Agent payouts: <Naira value={Number(agent.paidCommissionNaira)} size={17} /></span>
      </article>)}
  </div>;
}
