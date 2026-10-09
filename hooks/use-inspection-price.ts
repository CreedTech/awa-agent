"use client";

import { useQuery } from "@tanstack/react-query";
import { subscriptionService } from "@/services/subscription-service";

export function useInspectionPrice() {
  return useQuery({ queryKey: ["subscription-pricing"], queryFn: subscriptionService.pricing, staleTime: 5 * 60_000 });
}
