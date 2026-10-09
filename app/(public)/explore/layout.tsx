import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Find a home",
  description: "Rental homes open for in-person inspection, with the first-year rent shown on every listing.",
};

export default function ExploreLayout({ children }: { children: React.ReactNode }) {
  return children;
}
