import type { Metadata } from "next";
import { LiveFeatureUnavailable } from "@/components/shared/live-feature-unavailable";

export const metadata: Metadata = { title: "Pricing" };

export default function PricingPage() {
  return <LiveFeatureUnavailable feature="Subscription pricing" />;
}
