import { Icon } from "@/components/ui/icon";
import type { IconName } from "@/lib/icons";

interface FieldProps {
  label: string;
  error?: string;
  icon?: IconName;
  hint?: string;
  children: React.ReactNode;
}

/** Labelled form field with optional leading icon + error text. */
export function Field({ label, error, icon, hint, children }: FieldProps) {
  return (
    <div className="field">
      <label className="label">{label}</label>
      {icon ? (
        <div className="input-icon">
          <Icon name={icon} size={17} />
          {children}
        </div>
      ) : (
        children
      )}
      {hint && !error && <span style={{ fontSize: 12, color: "var(--muted)" }}>{hint}</span>}
      {error && (
        <span className="row gap-2" style={{ fontSize: 12.5, color: "var(--danger)", fontWeight: 600 }}>
          <Icon name="alert" size={13} /> {error}
        </span>
      )}
    </div>
  );
}
