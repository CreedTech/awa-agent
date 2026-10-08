"use client";

import { useState } from "react";
import Image from "next/image";
import { cn } from "@/lib/utils";

interface PropImageProps {
  src?: string;
  label?: string;
  className?: string;
  /** Use next/image fill; parent must be positioned + sized. */
  sizes?: string;
  priority?: boolean;
}

/**
 * Property photo with a striped placeholder fallback (the design's `.ph`).
 * Falls back to the labelled placeholder if the image is missing or errors.
 */
export function PropImage({ src, label, className, sizes = "100vw", priority }: PropImageProps) {
  const [err, setErr] = useState(false);

  if (src && !err) {
    // R2 uses an operator-configured custom domain that is not known at build time.
    // Serve it directly; Next's optimizer only accepts configured remote hosts.
    const knownHost = URL.canParse(src) && ["images.unsplash.com", "plus.unsplash.com", "i.pravatar.cc"].includes(new URL(src).hostname);
    const useDirectImage = src.startsWith("data:") || src.startsWith("blob:") || (src.startsWith("https://") && !knownHost);
    return (
      <div className={cn("relative overflow-hidden bg-[var(--paper-2)]", className)}>
        {useDirectImage ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={src}
            alt={label ?? "Property photo"}
            onError={() => setErr(true)}
            className="absolute inset-0 h-full w-full object-cover"
          />
        ) : (
          <Image
            src={src}
            alt={label ?? "Property photo"}
            fill
            sizes={sizes}
            loading={priority ? "eager" : "lazy"}
            fetchPriority={priority ? "high" : undefined}
            onError={() => setErr(true)}
            className="object-cover"
          />
        )}
      </div>
    );
  }

  return (
    <div className={cn("ph", className)}>
      {label && <span className="ph-label">{label}</span>}
    </div>
  );
}
