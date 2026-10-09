"use client";

import { useEffect, useState } from "react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { TooltipProvider } from "@/components/ui/tooltip";
import { Toaster } from "@/components/ui/sonner";
import { useAuthStore } from "@/store/auth-store";
import { useAppStore } from "@/store/app-store";
import { inspectionService } from "@/services/inspection-service";

function BackendSync() {
  const role = useAuthStore((state) => state.role);
  const token = useAuthStore((state) => state.token);

  useEffect(() => {
    if (!token || !["tenant", "agent"].includes(role)) {
      useAppStore.setState({ inspections: [] });
      return;
    }
    let cancelled = false;
    inspectionService.list().then((inspections) => {
      if (!cancelled) useAppStore.setState({ inspections });
    }).catch((error) => console.error("Could not load inspections", error));
    return () => { cancelled = true; };
  }, [role, token]);

  return null;
}

/**
 * Global client providers.
 *
 * TanStack Query provides client caching for backend reads.
 */
export function Providers({ children }: { children: React.ReactNode }) {
  const [queryClient] = useState(
    () =>
      new QueryClient({
        defaultOptions: {
          queries: {
            staleTime: 60_000,
            refetchOnWindowFocus: false,
            retry: 1,
          },
        },
      }),
  );

  return (
    <QueryClientProvider client={queryClient}>
      <BackendSync />
      <TooltipProvider>{children}</TooltipProvider>
      <Toaster position="bottom-center" richColors closeButton />
    </QueryClientProvider>
  );
}
