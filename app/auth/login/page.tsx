"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { AuthShell } from "@/components/auth/auth-shell";
import { Field } from "@/components/shared/field";
import { Icon } from "@/components/ui/icon";
import { loginSchema, type LoginValues } from "@/lib/validations";
import { authService } from "@/services/auth-service";
import { ROLE_HOME } from "@/lib/constants";
import type { Role } from "@/lib/types";
import { toast } from "sonner";

export default function LoginPage() {
  const router = useRouter();
  const [error, setError] = useState<string | null>(null);
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<LoginValues>({ resolver: zodResolver(loginSchema) });

  const enter = (role: Exclude<Role, "guest">) => router.replace(ROLE_HOME[role]);

  const onSubmit = async (values: LoginValues) => {
    setError(null);
    try {
      const account = await authService.login(values.identifier, values.password);
      if (!account) {
        setError("Those details don't match any account. Check and try again.");
        return;
      }
      toast.success(`Welcome back, ${account.name.split(" ")[0]}`);
      enter(account.role);
    } catch (error) {
      setError(error instanceof Error ? error.message : "Could not log in. Please try again.");
    }
  };

  return (
    <AuthShell
      title="Welcome back"
      subtitle="Log in to your account to manage your rentals."
      footer={<p style={{ fontSize: 14, color: "var(--muted)" }}>New account registration is currently unavailable.</p>}
    >
      <form className="col gap-4" onSubmit={handleSubmit(onSubmit)} noValidate>
        {error && (
          <div className="row gap-2" style={{ background: "var(--danger-bg)", color: "var(--danger)", padding: "10px 13px", borderRadius: 10, fontSize: 13, fontWeight: 600 }}>
            <Icon name="alert" size={16} /> {error}
          </div>
        )}
        <Field label="Phone or email" icon="user" error={errors.identifier?.message}>
          <input className="input" placeholder="agent@awaagent.ng" autoComplete="username" {...register("identifier")} />
        </Field>
        <Field label="Password" icon="lock" error={errors.password?.message}>
          <input className="input" type="password" placeholder="Your password" autoComplete="current-password" {...register("password")} />
        </Field>
        <div className="row between">
          <span />
          <Link href="/auth/forgot-password" style={{ fontSize: 13, color: "var(--navy-700)", fontWeight: 600 }}>
            Forgot password?
          </Link>
        </div>
        <button className="btn btn-primary btn-block btn-lg" type="submit" disabled={isSubmitting}>
          {isSubmitting ? "Logging in..." : "Log in"}
        </button>
      </form>

    </AuthShell>
  );
}
