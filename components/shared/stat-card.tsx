import { Icon } from "@/components/ui/icon";
import type { IconName } from "@/lib/icons";
import { cn } from "@/lib/utils";

interface StatCardProps {
  label: string;
  value: React.ReactNode;
  icon?: IconName;
  hint?: string;
  trend?: { value: string; up?: boolean };
  className?: string;
}

/** Dashboard stat tile (GMV, properties, payouts, ...). */
export function StatCard({ label, value, icon, hint, trend, className }: StatCardProps) {
  return (
    <div className={cn("stat-card", className)}>
      <div className="row between" style={{ marginBottom: 10 }}>
        <span className="stat-lbl">{label}</span>
        {icon && (
          <span style={{ color: "var(--gold-600)" }}>
            <Icon name={icon} size={18} />
          </span>
        )}
      </div>
      <div className="stat-val num">{value}</div>
      <div className="row gap-2" style={{ marginTop: 4 }}>
        {hint && <span style={{ fontSize: 12.5, color: "var(--muted)" }}>{hint}</span>}
        {trend && (
          <span
            className="row gap-2"
            style={{ fontSize: 12.5, fontWeight: 700, color: trend.up ? "var(--ok)" : "var(--danger)" }}
          >
            <Icon name="trend" size={13} strokeWidth={2.2} />
            {trend.value}
          </span>
        )}
      </div>
    </div>
  );
}
