"use client";

import { useState } from "react";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { Icon } from "@/components/ui/icon";
import { propertyService } from "@/services/property-service";
import { useAuthStore } from "@/store/auth-store";
import { cn } from "@/lib/utils";

interface SaveButtonProps {
  propertyId: string;
  variant?: "overlay" | "line";
  /** Called instead of saving when the visitor is not signed in as a tenant. */
  onGuest?: () => void;
}

export function SaveButton({ propertyId, variant = "line", onGuest }: SaveButtonProps) {
  const role = useAuthStore((s) => s.role);
  const isAuthed = useAuthStore((s) => s.isAuthenticated);
  const hydrated = useAuthStore((s) => s.hydrated);
  const isTenant = hydrated && isAuthed && role === "tenant";
  const queryClient = useQueryClient();
  const saved = useQuery({ queryKey: ["saved-properties"], queryFn: propertyService.saved, enabled: isTenant });
  const [busy, setBusy] = useState(false);
  const isSaved = saved.data?.some((item) => item.id === propertyId) ?? false;

  if (!isTenant && !onGuest) return null;

  const toggle = async () => {
    if (!isTenant) {
      onGuest?.();
      return;
    }
    setBusy(true);
    try {
      if (isSaved) await propertyService.unsave(propertyId);
      else await propertyService.save(propertyId);
      await queryClient.invalidateQueries({ queryKey: ["saved-properties"] });
    } catch (cause) {
      toast.error(cause instanceof Error ? cause.message : "Could not update your saved homes.");
    } finally {
      setBusy(false);
    }
  };

  const label = isSaved ? "Saved" : "Save";
  return (
    <button
      type="button"
      className={cn("aw-save", variant === "overlay" ? "aw-save-overlay" : "aw-btn aw-btn-line aw-btn-sm", isSaved && "is-saved")}
      onClick={toggle}
      disabled={busy || (isTenant && saved.isPending)}
      aria-pressed={isTenant ? isSaved : undefined}
      aria-label={variant === "overlay" ? (isSaved ? "Remove from saved homes" : "Save this home") : undefined}
    >
      <Icon name={isSaved ? "bookmarked" : "bookmark"} size={17} />
      {variant === "line" && <span>{label}</span>}
    </button>
  );
}
