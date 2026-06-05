"use client";

import { useState } from "react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { TooltipProvider } from "@/components/ui/tooltip";
import { Toaster } from "@/components/ui/sonner";

/**
 * Global client providers.
 *
 * TanStack Query is wired now so the mock `services/*` layer can later be
 * swapped for real API calls (see `lib/api.ts`) with zero component changes.
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
      <TooltipProvider>{children}</TooltipProvider>
      <Toaster position="bottom-center" richColors closeButton />
    </QueryClientProvider>
  );
}
