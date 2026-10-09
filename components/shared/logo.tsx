import { cn } from "@/lib/utils";

interface LogoProps {
  size?: number;
  light?: boolean;
  className?: string;
  markOnly?: boolean;
}

export function Logo({ size = 30, light = false, className, markOnly = false }: LogoProps) {
  const ink = light ? "#fffdf8" : "var(--navy-800)";
  return (
    <span className={cn("inline-flex items-center", className)} style={{ gap: size * 0.3 }}>
      <svg width={size * 0.8} height={size} viewBox="0 0 24 30" fill="none" aria-hidden>
        <path d="M2 29V12C2 6.5 6.5 2 12 2s10 4.5 10 10v17H2Z" fill={ink} />
        <circle cx="12" cy="16" r="2.6" fill="var(--gold-500)" />
        <path d="M10.9 17.6h2.2l.7 5.4h-3.6l.7-5.4Z" fill="var(--gold-500)" />
      </svg>
      {!markOnly && (
        <span
          style={{
            fontFamily: "var(--font-display)",
            fontWeight: 600,
            fontSize: size * 0.7,
            letterSpacing: "-.02em",
            fontVariationSettings: "'SOFT' 100, 'opsz' 48",
            color: light ? "#fffdf8" : "var(--ink)",
            lineHeight: 1,
          }}
        >
          AwaAgent
        </span>
      )}
    </span>
  );
}
