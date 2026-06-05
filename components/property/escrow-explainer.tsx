import { BottomSheet } from "@/components/shared/bottom-sheet";
import { Icon } from "@/components/ui/icon";
import type { IconName } from "@/lib/icons";

const STEPS: { icon: IconName; title: string; body: string }[] = [
  { icon: "cash", title: "Pay securely", body: "Your rent goes into AwaAgent escrow - not to the agent or landlord." },
  { icon: "lock", title: "Funds locked", body: "The money is held safely. Nobody can touch it while it's locked." },
  { icon: "key", title: "Confirm your keys", body: "Once you physically receive your keys, you confirm in the app." },
  { icon: "check", title: "Funds released", body: "We split the payment to the landlord, agent and platform - instantly." },
];

const FEES = [
  { label: "Refund on proven fraud", value: "100%" },
  { label: "Escrow service fee", value: "2.5%" },
  { label: "Dispute window", value: "24 hours" },
];

export function EscrowExplainer({ open, onClose }: { open: boolean; onClose: () => void }) {
  return (
    <BottomSheet open={open} onClose={onClose} title="How escrow protects you" maxWidth={480}>
      <div style={{ padding: "8px 20px 24px" }}>
        <div className="steps">
          {STEPS.map((s, i) => (
            <div key={s.title} className={`step ${i < STEPS.length ? "done" : ""}`}>
              <div className="step-rail">
                <span className="step-dot" style={{ background: "var(--navy-800)", borderColor: "var(--navy-800)", color: "#fff" }}>
                  <Icon name={s.icon} size={15} />
                </span>
                {i < STEPS.length - 1 && <span className="step-line" style={{ background: "var(--navy-800)" }} />}
              </div>
              <div className="step-body">
                <strong style={{ fontSize: 15 }}>{s.title}</strong>
                <p style={{ color: "var(--muted)", fontSize: 13.5, marginTop: 2 }}>{s.body}</p>
              </div>
            </div>
          ))}
        </div>
        <div className="card" style={{ marginTop: 8 }}>
          {FEES.map((f) => (
            <div key={f.label} className="brk-row" style={{ padding: "12px 16px" }}>
              <span style={{ fontSize: 14, color: "var(--ink-2)" }}>{f.label}</span>
              <strong style={{ fontFamily: "var(--font-display)" }}>{f.value}</strong>
            </div>
          ))}
        </div>
      </div>
    </BottomSheet>
  );
}
