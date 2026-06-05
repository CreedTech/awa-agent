import { cn } from "@/lib/utils";

interface LogoProps {
  size?: number;
  light?: boolean;
  className?: string;
  /** Hide the wordmark, show only the shield mark. */
  markOnly?: boolean;
}

/** AwaAgent lettermark: navy shield tile + gold "A", with wordmark. */
export function Logo({ size = 30, light = false, className, markOnly = false }: LogoProps) {
  return (
    <span className={cn("inline-flex items-center gap-[9px]", className)}>
      <span
        className="grid place-items-center"
        style={{
          width: size,
          height: size,
          borderRadius: 9,
          background: "linear-gradient(150deg,var(--navy-700),var(--navy-900))",
          boxShadow: "0 2px 6px rgba(0,31,63,.3)",
        }}
      >
        <svg width={size * 0.62} height={size * 0.62} viewBox="0 0 24 24" fill="none" aria-hidden>
          <path
            d="M12 3 5 6v5c0 4.5 3 7.5 7 9 4-1.5 7-4.5 7-9V6l-7-3Z"
            fill="none"
            stroke="var(--gold-500)"
            strokeWidth="1.8"
            strokeLinejoin="round"
          />
          <path d="M12 8.5 9.8 14h4.4L12 8.5Z" fill="var(--gold-500)" />
        </svg>
      </span>
      {!markOnly && (
        <span
          style={{
            fontFamily: "var(--font-display)",
            fontWeight: 800,
            fontSize: size * 0.62,
            letterSpacing: "-.02em",
            color: light ? "#fff" : "var(--navy-800)",
          }}
        >
          Awa<span style={{ color: "var(--gold-600)" }}>Agent</span>
        </span>
      )}
    </span>
  );
}
