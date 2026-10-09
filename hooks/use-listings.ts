"use client";

import { useMemo } from "react";
import { useQuery } from "@tanstack/react-query";
import { propertyService } from "@/services/property-service";
import { getCoverage } from "@/lib/listings";
import { useAuthStore } from "@/store/auth-store";

export function useListings() {
  const token = useAuthStore((s) => s.token);
  const query = useQuery({ queryKey: ["properties", token ?? "guest"], queryFn: () => propertyService.browse() });
  const properties = query.data?.properties;
  const coverage = useMemo(() => getCoverage(properties ?? []), [properties]);
  return { listings: query, properties, isGuestView: query.data?.isGuestView ?? false, coverage };
}
