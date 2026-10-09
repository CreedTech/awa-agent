import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Pricing",
  description: "What tenants pay on AwaAgent: inspection access, and how first-year rent is split between the landlord, the agent and AwaAgent.",
};

export default function PricingLayout({ children }: { children: React.ReactNode }) {
  return children;
}
