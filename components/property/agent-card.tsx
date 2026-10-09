import { Icon } from "@/components/ui/icon";
import { Avatar } from "@/components/shared/avatar";
import type { KycStatus } from "@/lib/types";

interface AgentCardProps {
  name: string;
  kycStatus?: KycStatus;
  trustScore?: number;
}

export function AgentCard({ name, kycStatus, trustScore }: AgentCardProps) {
  const verified = kycStatus === "VERIFIED";
  return (
    <div className="aw-agent">
      <Avatar name={name} size={56} />
      <div className="aw-agent-body">
        <strong>{name}</strong>
        <span>Agent assigned to this home. The landlord approved them to represent it. They meet you at the property and enter your inspection code.</span>
        <span className={verified ? "aw-agent-check is-ok" : "aw-agent-check"}>
          <Icon name={verified ? "userCheck" : "info"} size={16} />
          {verified
            ? "Identity verified: an AwaAgent reviewer checked this agent's ID documents."
            : "Identity check not complete yet."}
        </span>
        {trustScore !== undefined && (
          <div className="aw-trust">
            <div className="aw-trust-head">
              <span>Trust score</span>
              <strong className="num">{trustScore}<small>/100</small></strong>
            </div>
            <span className="aw-trust-bar" aria-hidden><i style={{ width: `${Math.min(100, Math.max(0, trustScore))}%` }} /></span>
            <p>Every verified account starts at 50. It moves with ratings from tenants and landlords after completed rentals.</p>
          </div>
        )}
      </div>
    </div>
  );
}
