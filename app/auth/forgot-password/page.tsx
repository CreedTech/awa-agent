"use client";

import { useState } from "react";
import Link from "next/link";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { AuthShell } from "@/components/auth/auth-shell";
import { Field } from "@/components/shared/field";
import { Icon } from "@/components/ui/icon";
import { forgotPasswordSchema, type ForgotPasswordValues } from "@/lib/validations";

export default function ForgotPasswordPage() {
  const [sent, setSent] = useState<string | null>(null);
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<ForgotPasswordValues>({ resolver: zodResolver(forgotPasswordSchema) });

  const onSubmit = async (values: ForgotPasswordValues) => {
    await new Promise((r) => setTimeout(r, 600));
    setSent(values.identifier);
  };

  if (sent) {
    return (
      <AuthShell title="Check your messages">
        <div className="col gap-4">
          <span className="grid place-items-center" style={{ width: 60, height: 60, borderRadius: 16, background: "var(--ok-bg)", color: "var(--ok)" }}>
            <Icon name="check" size={28} strokeWidth={2.2} />
          </span>
          <p style={{ color: "var(--muted)", fontSize: 14.5 }}>
            We&apos;ve sent a reset code to <strong style={{ color: "var(--ink)" }}>{sent}</strong>. Follow
            the instructions to set a new password.
          </p>
          <Link href="/auth/login" className="btn btn-primary btn-block">
            Back to log in
          </Link>
        </div>
      </AuthShell>
    );
  }

  return (
    <AuthShell
      title="Reset your password"
      subtitle="Enter your phone or email and we'll send you a reset code."
      footer={
        <Link href="/auth/login" style={{ fontSize: 14, color: "var(--navy-700)", fontWeight: 600 }}>
          ← Back to log in
        </Link>
      }
    >
      <form className="col gap-4" onSubmit={handleSubmit(onSubmit)} noValidate>
        <Field label="Phone or email" icon="user" error={errors.identifier?.message}>
          <input className="input" placeholder="0803 552 1190" {...register("identifier")} />
        </Field>
        <button className="btn btn-primary btn-block btn-lg" type="submit" disabled={isSubmitting}>
          {isSubmitting ? "Sending…" : "Send reset code"}
        </button>
      </form>
    </AuthShell>
  );
}
