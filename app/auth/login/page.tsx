"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { AuthShell } from "@/components/auth/auth-shell";
import { Field } from "@/components/shared/field";
import { loginSchema, type LoginValues } from "@/lib/validations";
import { toast } from "sonner";

export default function LoginPage() {
  const router = useRouter();
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<LoginValues>({ resolver: zodResolver(loginSchema) });

  const onSubmit = async (_values: LoginValues) => {
    // Mock: any credentials succeed. Pick the dashboard on the next screen.
    toast.success("Welcome back");
    router.push("/auth/role-selection");
  };

  return (
    <AuthShell
      title="Welcome back"
      subtitle="Log in to manage your inspections, escrow and dashboard."
      footer={
        <p style={{ fontSize: 14, color: "var(--muted)" }}>
          New to AwaAgent?{" "}
          <Link href="/auth/signup" style={{ color: "var(--navy-700)", fontWeight: 600 }}>
            Create an account
          </Link>
        </p>
      }
    >
      <form className="col gap-4" onSubmit={handleSubmit(onSubmit)} noValidate>
        <Field label="Phone or email" icon="user" error={errors.identifier?.message}>
          <input className="input" placeholder="0803 552 1190" autoComplete="username" {...register("identifier")} />
        </Field>
        <Field label="Password" icon="lock" error={errors.password?.message}>
          <input className="input" type="password" placeholder="••••••••" autoComplete="current-password" {...register("password")} />
        </Field>
        <div className="row between">
          <span />
          <Link href="/auth/forgot-password" style={{ fontSize: 13, color: "var(--navy-700)", fontWeight: 600 }}>
            Forgot password?
          </Link>
        </div>
        <button className="btn btn-primary btn-block btn-lg" type="submit" disabled={isSubmitting}>
          {isSubmitting ? "Logging in…" : "Log in"}
        </button>
      </form>
    </AuthShell>
  );
}
