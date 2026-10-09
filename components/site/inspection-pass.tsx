import { Icon } from "@/components/ui/icon";
import { cn } from "@/lib/utils";

export function InspectionPass({ className }: { className?: string }) {
  return (
    <figure className={cn("aw-pass", className)}>
      <div className="aw-pass-head">
        <span>Your inspection code</span>
        <span className="aw-pass-example">Six digits</span>
      </div>
      <div className="aw-pass-digits" aria-hidden>
        {Array.from({ length: 6 }, (_, index) => <span key={index} />)}
      </div>
      <figcaption className="aw-pass-foot">
        <Icon name="lock" size={16} />
        <span>Sent to your account when you book. Read it to the agent at the home; the street address opens when it matches.</span>
      </figcaption>
    </figure>
  );
}
