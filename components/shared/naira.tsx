import { formatCurrency } from "@/lib/utils";

interface NairaProps {
  value: number;
  size?: number;
  weight?: number;
  color?: string;
  strike?: boolean;
  sub?: string;
  className?: string;
}

/** Display-font Naira amount with tabular numerals. */
export function Naira({ value, size = 18, weight = 700, color, strike, sub, className }: NairaProps) {
  return (
    <span
      className={`num ${className ?? ""}`}
      style={{
        fontFamily: "var(--font-display)",
        fontWeight: weight,
        fontSize: size,
        color: color ?? "var(--ink)",
        letterSpacing: "-.02em",
        textDecoration: strike ? "line-through" : "none",
        opacity: strike ? 0.5 : 1,
      }}
    >
      {formatCurrency(value)}
      {sub && (
        <span style={{ fontSize: size * 0.55, fontWeight: 600, color: "var(--muted)", marginLeft: 3 }}>
          {sub}
        </span>
      )}
    </span>
  );
}
