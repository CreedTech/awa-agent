"use client";

import { Suspense, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { AuthShell } from "@/components/auth/auth-shell";
import { OtpInput } from "@/components/shared/otp-input";
import { authService } from "@/services/auth-service";
import { ROLE_HOME } from "@/lib/constants";

function VerifyForm() {
  const router = useRouter();
  const email = useSearchParams().get("email") ?? "";
  const [code, setCode] = useState("");
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [notice, setNotice] = useState<string | null>(null);

  const verify = async () => {
    if (!email || code.length !== 6) return;
    setBusy(true); setError(null);
    try {
      const account = await authService.verifyEmail(email, code);
      router.replace(ROLE_HOME[account.role]);
    } catch (cause) {
      setError(cause instanceof Error ? cause.message : "Could not verify your email.");
    } finally { setBusy(false); }
  };

  const resend = async () => {
    setBusy(true); setError(null); setNotice(null);
    try {
      await authService.resendVerification(email);
      setNotice("If verification is pending, a new code has been sent.");
    } catch (cause) {
      setError(cause instanceof Error ? cause.message : "Could not send another code.");
    } finally { setBusy(false); }
  };

  return <AuthShell title="Verify your email" subtitle={`Enter the six-digit code sent to ${email || "your email"}.`}>
    {!email ? <p role="alert">No email was provided. Please return to signup.</p> : <div className="col gap-4">
      <OtpInput value={code} onChange={setCode} />
      {error && <p role="alert" style={{ color: "var(--danger)" }}>{error}</p>}
      {notice && <p role="status">{notice}</p>}
      <button className="btn btn-primary btn-block btn-lg" disabled={busy || code.length !== 6} onClick={verify}>{busy ? "Checking..." : "Verify email"}</button>
      <button className="btn btn-quiet btn-block" disabled={busy} onClick={resend}>Send a new code</button>
    </div>}
  </AuthShell>;
}

export default function VerifyOtpPage() {
  return <Suspense fallback={<p>Loading verification...</p>}><VerifyForm /></Suspense>;
}
