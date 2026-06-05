import Link from "next/link";
import { Logo } from "@/components/shared/logo";
import { Icon } from "@/components/ui/icon";

const TRUST_POINTS = [
  { icon: "lock", title: "Escrow-protected", body: "Your rent is held safely until you get your keys." },
  { icon: "shieldCheck", title: "Verified agents only", body: "Every agent passes NIN-based KYC." },
  { icon: "calendar", title: "Safe inspections", body: "OTP-verified meetings, no illegal fees." },
] as const;

interface AuthShellProps {
  title: string;
  subtitle?: string;
  children: React.ReactNode;
  footer?: React.ReactNode;
}

/** Split auth layout: navy brand panel + form panel. */
export function AuthShell({ title, subtitle, children, footer }: AuthShellProps) {
  return (
    <div className="auth-overlay">
      {/* Brand panel */}
      <div className="auth-brand" style={{ background: "linear-gradient(165deg, var(--navy-800), var(--navy-900))", color: "#fff", padding: "40px 36px", display: "flex", flexDirection: "column" }}>
        <Link href="/" aria-label="AwaAgent home">
          <Logo light />
        </Link>
        <div style={{ flex: 1, display: "flex", flexDirection: "column", justifyContent: "center", gap: 28, paddingTop: 40 }}>
          <h2 style={{ color: "#fff", fontSize: 30, maxWidth: 320 }}>Rent without fear.</h2>
          <div className="col gap-5">
            {TRUST_POINTS.map((t) => (
              <div key={t.title} className="row gap-3" style={{ alignItems: "flex-start" }}>
                <span className="grid place-items-center" style={{ width: 38, height: 38, borderRadius: 10, background: "rgba(255,255,255,.1)", color: "var(--gold-400)", flexShrink: 0 }}>
                  <Icon name={t.icon} size={19} />
                </span>
                <div className="col" style={{ gap: 2 }}>
                  <strong style={{ fontSize: 14.5 }}>{t.title}</strong>
                  <span style={{ fontSize: 13, color: "rgba(255,255,255,.7)" }}>{t.body}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Form panel */}
      <div className="auth-form-wrap">
        <div className="auth-form col gap-5">
          <div className="col gap-2">
            <h1 style={{ fontSize: 26 }}>{title}</h1>
            {subtitle && <p style={{ color: "var(--muted)", fontSize: 14.5 }}>{subtitle}</p>}
          </div>
          {children}
          {footer && <div style={{ marginTop: 4 }}>{footer}</div>}
        </div>
      </div>
    </div>
  );
}
