"use client";

import { useState } from "react";
import Link from "next/link";
import { AuthShell } from "@/components/auth/auth-shell";
import { authService } from "@/services/auth-service";
import { ApiError } from "@/lib/api";

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState("");
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [sent, setSent] = useState(false);

  const submit = async (event: React.FormEvent) => {
    event.preventDefault(); setBusy(true); setError(null);
    try { await authService.forgotPassword(email); setSent(true); }
    catch (cause) { setError(cause instanceof ApiError && cause.status >= 500 ? "We couldn't send a reset link right now. Please try again later." : cause instanceof Error ? cause.message : "Could not send a reset link."); }
    finally { setBusy(false); }
  };

  return <AuthShell title="Reset your password" subtitle="We will email a one-time reset link if your account exists."
    footer={<Link href="/auth/login" className="btn btn-quiet btn-block">Back to login</Link>}>
    {sent ? <p role="status">If that email has an account, a reset link has been sent.</p> :
      <form className="col gap-4" onSubmit={submit}>
        {error && <p role="alert" style={{ color: "var(--danger)" }}>{error}</p>}
        <label className="field"><span className="label">Email</span><input className="input" type="email" autoComplete="email" required value={email} onChange={(event) => setEmail(event.target.value)} /></label>
        <button className="btn btn-primary btn-block btn-lg" type="submit" disabled={busy}>{busy ? "Sending..." : "Send reset link"}</button>
      </form>}
  </AuthShell>;
}
