import { Icon } from "@/components/ui/icon";

interface LocationPanelProps {
  unlocked?: boolean;
  landmark?: string;
  address?: string;
  area?: string;
}

export function LocationPanel({ unlocked, landmark, address, area }: LocationPanelProps) {
  const open = Boolean(unlocked && address);
  return (
    <div className="aw-location">
      <div className="aw-location-public">
        {area && <span className="aw-location-area">{area}</span>}
        <span>{landmark ? `Near ${landmark}` : "Landmark not listed"}</span>
      </div>
      <div className={open ? "aw-location-street is-open" : "aw-location-street"}>
        <Icon name={open ? "pin" : "lock"} size={18} />
        <div>
          <strong>{open ? address : "Street address"}</strong>
          <span>
            {open
              ? "Shared with you after the agent confirmed your inspection code."
              : "Shared in your account once the agent enters your inspection code at the property."}
          </span>
        </div>
      </div>
    </div>
  );
}
