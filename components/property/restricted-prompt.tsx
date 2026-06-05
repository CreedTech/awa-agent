"use client";

import Link from "next/link";
import { BottomSheet } from "@/components/shared/bottom-sheet";
import { Icon } from "@/components/ui/icon";

interface RestrictedPromptProps {
  open: boolean;
  onClose: () => void;
  action?: string;
}

/** Shown when a guest tries a protected action (pay / inspect / save). */
export function RestrictedPrompt({ open, onClose, action = "continue" }: RestrictedPromptProps) {
  return (
    <BottomSheet open={open} onClose={onClose} maxWidth={420}>
      <div className="col center" style={{ padding: "12px 24px 28px", textAlign: "center", gap: 14 }}>
        <span className="grid place-items-center" style={{ width: 64, height: 64, borderRadius: 18, background: "var(--gold-050)", color: "var(--gold-600)" }}>
          <Icon name="shieldCheck" size={30} strokeWidth={1.8} />
        </span>
        <h3 style={{ fontSize: 20 }}>Create a free account to {action}</h3>
        <p style={{ color: "var(--muted)", fontSize: 14.5, maxWidth: 320 }}>
          AwaAgent keeps every renter protected. Sign up in under a minute to book inspections, pay
          securely and track your escrow.
        </p>
        <Link href="/auth/signup" className="btn btn-primary btn-block btn-lg">
          Create account
        </Link>
        <Link href="/auth/login" className="btn btn-quiet btn-block">
          I already have an account
        </Link>
      </div>
    </BottomSheet>
  );
}
