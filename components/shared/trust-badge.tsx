import { Icon } from "@/components/ui/icon";

interface TrustBadgeProps {
  score: number;
  sm?: boolean;
}

/** Gold trust meter - agent/tenant score out of 100. */
export function TrustBadge({ score, sm }: TrustBadgeProps) {
  return (
    <span className="trust" style={sm ? { fontSize: 12, padding: "3px 9px 3px 5px" } : undefined}>
      <span className="trust-coin" style={sm ? { width: 16, height: 16, fontSize: 9 } : undefined}>
        <Icon name="shieldCheck" size={sm ? 10 : 12} strokeWidth={2} />
      </span>
      {score}
      <span style={{ opacity: 0.55, fontWeight: 600 }}>/100</span>
    </span>
  );
}
