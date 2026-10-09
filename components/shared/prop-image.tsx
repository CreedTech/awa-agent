"use client";

import { useState } from "react";
import Image from "next/image";
import { Icon } from "@/components/ui/icon";
import { cn } from "@/lib/utils";

interface PropImageProps {
  src?: string;
  label?: string;
  className?: string;
  sizes?: string;
  priority?: boolean;
}

const OPTIMIZED_HOSTS = ["images.unsplash.com", "plus.unsplash.com", "i.pravatar.cc"];

export function PropImage({ src, label, className, sizes = "100vw", priority }: PropImageProps) {
  const [failed, setFailed] = useState(false);

  if (src && !failed) {
    // R2 serves from an operator-configured domain unknown at build time, so load it directly.
    const knownHost = URL.canParse(src) && OPTIMIZED_HOSTS.includes(new URL(src).hostname);
    const direct = src.startsWith("data:") || src.startsWith("blob:") || (src.startsWith("https://") && !knownHost);
    return (
      <div className={cn("aw-photo", className)}>
        {direct ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={src}
            alt={label ?? "Property photo"}
            loading={priority ? "eager" : "lazy"}
            fetchPriority={priority ? "high" : undefined}
            decoding="async"
            onError={() => setFailed(true)}
          />
        ) : (
          <Image
            src={src}
            alt={label ?? "Property photo"}
            fill
            sizes={sizes}
            preload={priority}
            onError={() => setFailed(true)}
          />
        )}
      </div>
    );
  }

  return (
    <div className={cn("aw-photo aw-photo-empty", className)} role="img" aria-label={label ? `${label}: no photo yet` : "No photo yet"}>
      <Icon name="image" size={22} />
      <span>No photo yet</span>
    </div>
  );
}
