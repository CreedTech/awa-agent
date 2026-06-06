"use client";

import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Icon } from "@/components/ui/icon";
import { cn } from "@/lib/utils";

const CHECKS = [
  "I have physically received the keys.",
  "The property matches what I inspected.",
  "Nobody pressured me to confirm early.",
];

interface ConfirmKeysModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onConfirm: () => void;
}

/** Key-handover confirmation: a 3-point checklist gating release of escrow. */
export function ConfirmKeysModal({ open, onOpenChange, onConfirm }: ConfirmKeysModalProps) {
  const [checked, setChecked] = useState<boolean[]>([false, false, false]);
  const allChecked = checked.every(Boolean);

  const toggle = (i: number) => setChecked((c) => c.map((v, idx) => (idx === i ? !v : v)));
  const reset = () => setChecked([false, false, false]);

  return (
    <Dialog open={open} onOpenChange={(o) => { onOpenChange(o); if (!o) reset(); }}>
      <DialogContent className="max-w-[440px]">
        <DialogHeader>
          <DialogTitle>Confirm key handover</DialogTitle>
          <DialogDescription>
            This releases your escrow to the landlord and agent. It can&apos;t be undone - only confirm
            once you actually hold the keys.
          </DialogDescription>
        </DialogHeader>
        <div className="col gap-2" style={{ margin: "6px 0" }}>
          {CHECKS.map((c, i) => (
            <button key={c} className={cn("check", checked[i] && "is-on")} onClick={() => toggle(i)}>
              <span className="check-box">{checked[i] && <Icon name="check" size={13} strokeWidth={2.6} />}</span>
              {c}
            </button>
          ))}
        </div>
        <button
          className="btn btn-gold btn-block btn-lg"
          disabled={!allChecked}
          onClick={() => { onConfirm(); onOpenChange(false); reset(); }}
        >
          <Icon name="key" size={18} /> Confirm & release funds
        </button>
      </DialogContent>
    </Dialog>
  );
}
