"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { AuthShell } from "@/components/auth/auth-shell";
import { Field } from "@/components/shared/field";
import { Icon } from "@/components/ui/icon";
import { signupSchema, type SignupValues } from "@/lib/validations";
import { authService } from "@/services/auth-service";
import { cn } from "@/lib/utils";
import type { IconName } from "@/lib/icons";
import type { Role } from "@/lib/types";

const ROLES: { role: Exclude<Role, "guest">; label: string; icon: IconName; blurb: string }[] = [
  { role: "tenant", label: "Tenant", icon: "home", blurb: "Find and rent a home safely" },
  { role: "agent", label: "Agent", icon: "user", blurb: "List properties and earn" },
  { role: "landlord", label: "Landlord", icon: "building", blurb: "Manage your portfolio" },
];

export default function SignupPage() {
  const router = useRouter();
  const [role, setRole] = useState<Exclude<Role, "guest">>("tenant");
  const [error, setError] = useState<string | null>(null);
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<SignupValues>({ resolver: zodResolver(signupSchema) });

  const onSubmit = async (values: SignupValues) => {
    setError(null);
    const account = await authService.register(values, role);
    if (!account) {
      setError("An account with that phone or email already exists. Try logging in.");
      return;
    }
    router.push("/auth/verify-otp");
  };

  return (
    <AuthShell
      title="Create your account"
      subtitle="Join AwaAgent and rent, list, or manage with full escrow protection."
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
        <div className="field">
          <span className="label">I want to join as</span>
          <div className="row gap-2">
            {ROLES.map((r) => (
              <button
                key={r.role}
                type="button"
                onClick={() => setRole(r.role)}
                className="col center"
                style={{
                  flex: 1,
                  gap: 4,
                  padding: "12px 8px",
                  borderRadius: 12,
                  border: `1.5px solid ${role === r.role ? "var(--navy-800)" : "var(--line-2)"}`,
                  background: role === r.role ? "var(--navy-050)" : "#fff",
                }}
              >
                <Icon name={r.icon} size={20} color={role === r.role ? "var(--navy-700)" : "var(--muted)"} />
                <strong style={{ fontSize: 13 }}>{r.label}</strong>
              </button>
            ))}
          </div>
          <span style={{ fontSize: 12, color: "var(--muted)" }}>{ROLES.find((r) => r.role === role)?.blurb}</span>
        </div>

        {error && (
          <div className="row gap-2" style={{ background: "var(--danger-bg)", color: "var(--danger)", padding: "10px 13px", borderRadius: 10, fontSize: 13, fontWeight: 600 }}>
            <Icon name="alert" size={16} /> {error}
          </div>
        )}

        <Field label="Full name" icon="user" error={errors.name?.message}>
          <input className="input" placeholder="Your full name" autoComplete="name" {...register("name")} />
        </Field>
        <Field label="Phone number" icon="phone" error={errors.phone?.message}>
          <input className="input" placeholder="0803 552 1190" inputMode="tel" autoComplete="tel" {...register("phone")} />
        </Field>
        <Field label="Email (optional)" icon="mail" error={errors.email?.message}>
          <input className="input" placeholder="you@email.com" inputMode="email" autoComplete="email" {...register("email")} />
        </Field>
        <Field label="Password" icon="lock" error={errors.password?.message} hint="At least 8 characters">
          <input className="input" type="password" placeholder="Create a password" autoComplete="new-password" {...register("password")} />
        </Field>
        <button className={cn("btn btn-primary btn-block btn-lg")} type="submit" disabled={isSubmitting}>
          {isSubmitting ? "Creating account..." : "Create account"}
        </button>
        <p style={{ fontSize: 12, color: "var(--faint)", textAlign: "center" }}>
          By continuing you agree to our Terms and Trust &amp; Safety policy.
        </p>
      </form>
    </AuthShell>
  );
}
