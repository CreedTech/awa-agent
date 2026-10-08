import { Icon } from "@/components/ui/icon";

interface LocationPanelProps {
  unlocked?: boolean;
  landmark?: string;
  address?: string;
}

export function LocationPanel({ unlocked, landmark, address }: LocationPanelProps) {
  return (
    <div className="card card-pad col gap-2" style={{ background: "var(--surface-2)" }}>
      <strong className="row gap-2" style={{ fontSize: 14 }}>
        <Icon name={unlocked ? "pin" : "lock"} size={16} />
        {unlocked && address ? address : landmark ? `Near ${landmark}` : "Exact address hidden"}
      </strong>
      <span style={{ fontSize: 13, color: "var(--muted)" }}>
        {unlocked && address ? "Address released after inspection verification." : "The exact address is released after the agent verifies your inspection code."}
      </span>
    </div>
  );
}
