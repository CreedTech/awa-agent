import Link from "next/link";
import { Logo } from "@/components/shared/logo";
import { Icon } from "@/components/ui/icon";

const TRUST_POINTS = [
  { icon: "lock", title: "Escrow-protected", body: "Your rent is held safely until you get your keys." },
  { icon: "shieldCheck", title: "Verified agents only", body: "Every agent passes NIN-based KYC." },
  { icon: "calendar", title: "Safe inspections", body: "OTP-verified meetings, no illegal fees." },
] as const;

const BRAND_IMAGES = [
  "https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?w=600&h=400&fit=crop&auto=format&q=80",
  "https://images.unsplash.com/photo-1484154218962-a197022b5858?w=600&h=400&fit=crop&auto=format&q=80",
  "https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?w=600&h=400&fit=crop&auto=format&q=80",
  "https://images.unsplash.com/photo-1493809842364-78817add7ffb?w=600&h=400&fit=crop&auto=format&q=80",
];

interface AuthShellProps {
  title: string;
  subtitle?: string;
  children: React.ReactNode;
  footer?: React.ReactNode;
}

export function AuthShell({ title, subtitle, children, footer }: AuthShellProps) {
  return (
    <div className="auth-overlay">
      {/* Brand panel */}
      <div className="auth-brand auth-brand-collage">
        {/* Image collage grid */}
        <div className="auth-collage-grid">
          {BRAND_IMAGES.map((src, i) => (
            <div key={i} className="auth-collage-cell">
              <img src={src} alt="" aria-hidden="true" />
            </div>
          ))}
        </div>

        {/* Dark overlay */}
        <div className="auth-brand-overlay" />

        {/* Content on top */}
        <div className="auth-brand-content">
          <Link href="/" aria-label="AwaAgent home">
            <Logo light />
          </Link>

          <div style={{ flex: 1, display: "flex", flexDirection: "column", justifyContent: "center", gap: 28, paddingTop: 40 }}>
            <h2 style={{ color: "#fff", fontSize: 30, maxWidth: 320, textShadow: "0 2px 12px rgba(0,0,0,0.4)" }}>
              Rent without fear.
            </h2>
            <div className="col gap-5">
              {TRUST_POINTS.map((t) => (
                <div key={t.title} className="row gap-3" style={{ alignItems: "flex-start" }}>
                  <span
                    className="grid place-items-center"
                    style={{
                      width: 38, height: 38, borderRadius: 10,
                      background: "rgba(255,255,255,.15)",
                      backdropFilter: "blur(6px)",
                      color: "var(--gold-400)", flexShrink: 0,
                    }}
                  >
                    <Icon name={t.icon} size={19} />
                  </span>
                  <div className="col" style={{ gap: 2 }}>
                    <strong style={{ fontSize: 14.5, color: "#fff", textShadow: "0 1px 6px rgba(0,0,0,0.3)" }}>
                      {t.title}
                    </strong>
                    <span style={{ fontSize: 13, color: "rgba(255,255,255,.75)" }}>{t.body}</span>
                  </div>
                </div>
              ))}
            </div>

            {/* Small image preview strip */}
            <div className="auth-preview-strip">
              {BRAND_IMAGES.slice(0, 3).map((src, i) => (
                <div key={i} className="auth-preview-thumb">
                  <img src={src} alt="" aria-hidden="true" />
                </div>
              ))}
              <div className="auth-preview-more">+2k<span>homes</span></div>
            </div>
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