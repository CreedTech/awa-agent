import type { Metadata } from "next";

export const metadata: Metadata = { title: "Sign in" };

export default function AuthLayout({ children }: { children: React.ReactNode }) {
  return <div style={{ minHeight: "100vh", background: "var(--surface)" }}>{children}</div>;
}
