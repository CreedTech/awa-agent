"use client";

import { Suspense, useState } from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { AuthShell } from "@/components/auth/auth-shell";
import { authService } from "@/services/auth-service";

function ResetForm() {
  const token = useSearchParams().get("token") ?? "";
  const [password, setPassword] = useState("");
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [done, setDone] = useState(false);

  const submit = async (event: React.FormEvent) => {
    event.preventDefault(); setBusy(true); setError(null);
    try { await authService.resetPassword(token, password); setDone(true); }
    catch (cause) { setError(cause instanceof Error ? cause.message : "Could not reset password."); }
    finally { setBusy(false); }
  };

  return <AuthShell title="Choose a new password" footer={<Link href="/auth/login" className="btn btn-quiet btn-block">Log in</Link>}>
    {!/^[a-f0-9]{64}$/.test(token) ? <p role="alert">This reset link is invalid.</p> : done ?
      <p role="status">Your password has been changed. You can log in now.</p> :
      <form className="col gap-4" onSubmit={submit}>
        {error && <p role="alert" style={{ color: "var(--danger)" }}>{error}</p>}
        <label className="field"><span className="label">New password</span><input className="input" type="password" autoComplete="new-password" required minLength={10} value={password} onChange={(event) => setPassword(event.target.value)} /></label>
        <button className="btn btn-primary btn-block btn-lg" type="submit" disabled={busy}>{busy ? "Saving..." : "Change password"}</button>
      </form>}
  </AuthShell>;
}

export default function ResetPasswordPage() {
  return <Suspense fallback={<p>Loading password reset...</p>}><ResetForm /></Suspense>;
}
