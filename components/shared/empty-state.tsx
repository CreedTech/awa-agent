import Link from "next/link";
import { Icon } from "@/components/ui/icon";
import type { IconName } from "@/lib/icons";

interface EmptyStateProps {
  icon?: IconName;
  title: string;
  description?: string;
  action?: { label: string; href?: string; onClick?: () => void };
}

/** Consistent empty-state block used across feeds, lists and tables. */
export function EmptyState({ icon = "info", title, description, action }: EmptyStateProps) {
  return (
    <div
      className="col center anim-in"
      style={{ textAlign: "center", padding: "48px 24px", gap: 14 }}
    >
      <span
        className="grid place-items-center"
        style={{ width: 64, height: 64, borderRadius: 18, background: "var(--navy-050)", color: "var(--navy-600)" }}
      >
        <Icon name={icon} size={28} />
      </span>
      <div className="col gap-2" style={{ maxWidth: 360 }}>
        <h3 style={{ fontSize: 18 }}>{title}</h3>
        {description && <p style={{ color: "var(--muted)", fontSize: 14.5 }}>{description}</p>}
      </div>
      {action &&
        (action.href ? (
          <Link href={action.href} className="btn btn-primary btn-sm">
            {action.label}
          </Link>
        ) : (
          <button className="btn btn-primary btn-sm" onClick={action.onClick}>
            {action.label}
          </button>
        ))}
    </div>
  );
}
