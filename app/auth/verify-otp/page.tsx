"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { AuthShell } from "@/components/auth/auth-shell";
import { OtpInput } from "@/components/shared/otp-input";
import { Icon } from "@/components/ui/icon";
import { useAuthStore } from "@/store/auth-store";
import { authService } from "@/services/auth-service";
import { OTP_RESEND_SECONDS } from "@/lib/constants";
import { toast } from "sonner";

export default function VerifyOtpPage() {
  const router = useRouter();
  const pendingPhone = useAuthStore((s) => s.pendingPhone);
  const [code, setCode] = useState("");
  const [seconds, setSeconds] = useState(OTP_RESEND_SECONDS);
  const [error, setError] = useState(false);
  const [verifying, setVerifying] = useState(false);

  useEffect(() => {
    if (seconds <= 0) return;
    const t = setTimeout(() => setSeconds((s) => s - 1), 1000);
    return () => clearTimeout(t);
  }, [seconds]);

  const verify = async () => {
    setVerifying(true);
    const { verified } = await authService.verifyOtp(code);
    setVerifying(false);
    if (verified) {
      router.push("/auth/role-selection");
    } else {
      setError(true);
    }
  };

  return (
    <AuthShell
      title="Verify your number"
      subtitle={`We sent a 6-digit code to ${pendingPhone ?? "your phone"}.`}
    >
      <div className="col gap-5">
        <OtpInput value={code} onChange={(v) => { setCode(v); setError(false); }} />
        {error && (
          <span className="row gap-2" style={{ color: "var(--danger)", fontSize: 13, fontWeight: 600, justifyContent: "center" }}>
            <Icon name="alert" size={14} /> That code didn&apos;t match. Try again.
          </span>
        )}
        <button className="btn btn-primary btn-block btn-lg" disabled={code.length < 6 || verifying} onClick={verify}>
          {verifying ? "Verifying…" : "Verify & continue"}
        </button>
        <div className="row center" style={{ fontSize: 13.5, color: "var(--muted)" }}>
          {seconds > 0 ? (
            <span>Resend code in {seconds}s</span>
          ) : (
            <button
              style={{ color: "var(--navy-700)", fontWeight: 600 }}
              onClick={() => { setSeconds(OTP_RESEND_SECONDS); toast("A new code has been sent."); }}
            >
              Resend code
            </button>
          )}
        </div>
        <p style={{ fontSize: 12, color: "var(--faint)", textAlign: "center" }}>
          Demo: enter any 6 digits to continue.
        </p>
      </div>
    </AuthShell>
  );
}
