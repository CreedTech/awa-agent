"use client";

import { useRouter } from "next/navigation";
import { Logo } from "@/components/shared/logo";
import { Icon } from "@/components/ui/icon";
import { useAuthStore } from "@/store/auth-store";
import { ROLE_CARDS, ROLE_HOME, ROLE_LABELS } from "@/lib/constants";
import type { IconName } from "@/lib/icons";
import type { Role } from "@/lib/types";

export default function RoleSelectionPage() {
  const router = useRouter();
  const switchRole = useAuthStore((s) => s.switchRole);

  const choose = (role: Exclude<Role, "guest">) => {
    switchRole(role);
    router.push(ROLE_HOME[role]);
  };

  return (
    <div
      style={{
        minHeight: "100vh",
        background: "radial-gradient(1200px 600px at 50% -10%, var(--navy-700), var(--navy-900))",
        color: "#fff",
        padding: "48px 24px 64px",
      }}
    >
      <div style={{ maxWidth: 920, margin: "0 auto" }}>
        <div className="col center" style={{ textAlign: "center", gap: 14, marginBottom: 40 }}>
          <Logo light size={34} />
          <h1 style={{ color: "#fff", fontSize: 34, marginTop: 14 }}>How will you use AwaAgent?</h1>
          <p style={{ color: "rgba(255,255,255,.7)", fontSize: 16, maxWidth: 460 }}>
            Choose a role to enter your dashboard. You can switch any time with the control in the
            corner.
          </p>
        </div>

        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(260px, 1fr))", gap: 18 }}>
          {ROLE_CARDS.map((card) => (
            <button
              key={card.role}
              className="entry-card col gap-4"
              onClick={() => choose(card.role)}
              style={{
                textAlign: "left",
                background: "#fff",
                color: "var(--ink)",
                borderRadius: 20,
                padding: 24,
                boxShadow: "var(--sh-3)",
              }}
            >
              <div className="row between">
                <span className="grid place-items-center" style={{ width: 46, height: 46, borderRadius: 12, background: "var(--navy-050)", color: "var(--navy-700)" }}>
                  <Icon name={card.icon as IconName} size={24} />
                </span>
                <Icon name="arrowR" size={20} color="var(--muted)" />
              </div>
              <div className="col" style={{ gap: 2 }}>
                <h3 style={{ fontSize: 22 }}>{ROLE_LABELS[card.role]}</h3>
                <span style={{ color: "var(--muted)", fontSize: 13.5, fontWeight: 600 }}>{card.tagline}</span>
              </div>
              <div className="col gap-2">
                {card.bullets.map((b) => (
                  <span key={b} className="row gap-2" style={{ fontSize: 13.5, color: "var(--ink-2)" }}>
                    <Icon name="check" size={15} strokeWidth={2.2} color="var(--ok)" /> {b}
                  </span>
                ))}
              </div>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}
