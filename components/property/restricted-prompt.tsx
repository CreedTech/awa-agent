"use client";

import Link from "next/link";
import { BottomSheet } from "@/components/shared/bottom-sheet";

interface RestrictedPromptProps {
  open: boolean;
  onClose: () => void;
  action?: string;
}

export function RestrictedPrompt({ open, onClose, action = "continue" }: RestrictedPromptProps) {
  return (
    <BottomSheet open={open} onClose={onClose} title={`Sign in to ${action}`} maxWidth={440}>
      <div className="aw-prompt">
        <p>You need a tenant account. To request a visit you will also need a verified identity and active inspection access. We show your next step after you sign in.</p>
        <Link href="/auth/login" className="aw-btn aw-btn-ink aw-btn-block">Sign in</Link>
        <Link href="/auth/signup?role=tenant" className="aw-btn aw-btn-line aw-btn-block">Create a tenant account</Link>
      </div>
    </BottomSheet>
  );
}
