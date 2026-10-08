"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useQuery } from "@tanstack/react-query";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { AuthShell } from "@/components/auth/auth-shell";
import { Field } from "@/components/shared/field";
import { signupSchema, type SignupValues } from "@/lib/validations";
import { authService } from "@/services/auth-service";

export default function SignupPage() {
  const router = useRouter();
  const capability = useQuery({ queryKey: ["auth-capabilities"], queryFn: authService.capabilities });
  const [error, setError] = useState<string | null>(null);
  const { register, handleSubmit, formState: { errors, isSubmitting } } = useForm<SignupValues>({
    resolver: zodResolver(signupSchema), defaultValues: { role: "tenant" },
  });

  const submit = async (values: SignupValues) => {
    setError(null);
    try {
      await authService.signup(values);
      router.push(`/auth/verify-otp?email=${encodeURIComponent(values.email)}`);
    } catch (cause) {
      setError(cause instanceof Error ? cause.message : "Could not create account.");
    }
  };

  return <AuthShell title="Create your account" subtitle="Verification codes are sent to your email through Resend."
    footer={<Link href="/auth/login" className="btn btn-quiet btn-block">Already have an account? Log in</Link>}>
    {capability.isPending ? <p>Checking registration availability...</p> : !capability.data?.signupAvailable ? (
      <p role="status">Registration is temporarily unavailable while email delivery is being configured.</p>
    ) : <form className="col gap-4" onSubmit={handleSubmit(submit)} noValidate>
      {error && <p role="alert" style={{ color: "var(--danger)" }}>{error}</p>}
      <Field label="Full name" error={errors.name?.message}><input className="input" autoComplete="name" {...register("name")} /></Field>
      <Field label="Phone number" error={errors.phone?.message}><input className="input" type="tel" autoComplete="tel" {...register("phone")} /></Field>
      <Field label="Email" error={errors.email?.message}><input className="input" type="email" autoComplete="email" {...register("email")} /></Field>
      <Field label="I am joining as" error={errors.role?.message}>
        <select className="input" {...register("role")}>
          <option value="tenant">Tenant</option><option value="agent">Agent</option><option value="landlord">Landlord</option>
        </select>
      </Field>
      <Field label="Password" error={errors.password?.message}><input className="input" type="password" autoComplete="new-password" {...register("password")} /></Field>
      <button className="btn btn-primary btn-block btn-lg" type="submit" disabled={isSubmitting}>{isSubmitting ? "Creating account..." : "Create account"}</button>
    </form>}
  </AuthShell>;
}
