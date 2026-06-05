"use client";

import { useState } from "react";
import Image from "next/image";
import { initials } from "@/lib/utils";

interface AvatarProps {
  name: string;
  size?: number;
  gold?: boolean;
  photo?: string;
}

/** Round avatar: photo when available, gradient initials otherwise. */
export function Avatar({ name, size = 40, gold = false, photo }: AvatarProps) {
  const [err, setErr] = useState(false);

  if (photo && !err) {
    return (
      <span
        className="relative inline-block shrink-0 overflow-hidden rounded-full bg-[var(--paper-2)]"
        style={{ width: size, height: size, border: gold ? "2px solid var(--gold-400)" : undefined }}
      >
        <Image
          src={photo}
          alt={name}
          width={size}
          height={size}
          onError={() => setErr(true)}
          className="h-full w-full object-cover"
        />
      </span>
    );
  }

  return (
    <span
      className="grid shrink-0 place-items-center rounded-full text-white"
      style={{
        width: size,
        height: size,
        background: gold
          ? "linear-gradient(150deg,var(--gold-400),var(--gold-600))"
          : "linear-gradient(150deg,var(--navy-500),var(--navy-800))",
        fontWeight: 700,
        fontFamily: "var(--font-display)",
        fontSize: size * 0.38,
        letterSpacing: "-.01em",
      }}
    >
      {initials(name)}
    </span>
  );
}
