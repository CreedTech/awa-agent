"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { AuthShell } from "@/components/auth/auth-shell";
import { Field } from "@/components/shared/field";
import { signupSchema, type SignupValues } from "@/lib/validations";
import { authService } from "@/services/auth-service";

export default function SignupPage() {
  const router = useRouter();
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<SignupValues>({ resolver: zodResolver(signupSchema) });

  const onSubmit = async (values: SignupValues) => {
    await authService.register(values);
    router.push("/auth/verify-otp");
  };

  return (
    <AuthShell
      title="Create your account"
      subtitle="Join AwaAgent and rent with full escrow protection."
      footer={
        <p style={{ fontSize: 14, color: "var(--muted)" }}>
          Already have an account?{" "}
          <Link href="/auth/login" style={{ color: "var(--navy-700)", fontWeight: 600 }}>
            Log in
          </Link>
        </p>
      }
    >
      <form className="col gap-4" onSubmit={handleSubmit(onSubmit)} noValidate>
        <Field label="Full name" icon="user" error={errors.name?.message}>
          <input className="input" placeholder="Bisi Akande" autoComplete="name" {...register("name")} />
        </Field>
        <Field label="Phone number" icon="phone" error={errors.phone?.message}>
          <input className="input" placeholder="0803 552 1190" inputMode="tel" autoComplete="tel" {...register("phone")} />
        </Field>
        <Field label="Email (optional)" icon="mail" error={errors.email?.message}>
          <input className="input" placeholder="you@email.com" inputMode="email" autoComplete="email" {...register("email")} />
        </Field>
        <Field label="Password" icon="lock" error={errors.password?.message} hint="At least 8 characters">
          <input className="input" type="password" placeholder="••••••••" autoComplete="new-password" {...register("password")} />
        </Field>
        <button className="btn btn-primary btn-block btn-lg" type="submit" disabled={isSubmitting}>
          {isSubmitting ? "Sending code…" : "Send verification code"}
        </button>
        <p style={{ fontSize: 12, color: "var(--faint)", textAlign: "center" }}>
          By continuing you agree to our Terms and Trust &amp; Safety policy.
        </p>
      </form>
    </AuthShell>
  );
}
