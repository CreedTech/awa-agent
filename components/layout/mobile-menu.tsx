"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { Icon } from "@/components/ui/icon";
import { PUBLIC_NAV } from "@/lib/constants";
import { env } from "@/lib/env";
import { useFocusTrap } from "@/hooks/use-focus-trap";

export function MobileMenu() {
  const [open, setOpen] = useState(false);
  const wrapRef = useRef<HTMLDivElement>(null);
  useFocusTrap(wrapRef, open);

  useEffect(() => {
    if (!open) return;
    const onKey = (event: KeyboardEvent) => {
      if (event.key === "Escape") setOpen(false);
    };
    window.addEventListener("keydown", onKey);
    const { overflow } = document.body.style;
    document.body.style.overflow = "hidden";
    return () => {
      window.removeEventListener("keydown", onKey);
      document.body.style.overflow = overflow;
    };
  }, [open]);

  const close = () => setOpen(false);

  return (
    <div ref={wrapRef} className="aw-menu-wrap">
      <button
        type="button"
        className="aw-menu-btn"
        aria-expanded={open}
        aria-controls="aw-mobile-menu"
        onClick={() => setOpen((value) => !value)}
      >
        <Icon name={open ? "close" : "menu"} size={20} />
        <span>{open ? "Close" : "Menu"}</span>
      </button>
      {open && (
        <div id="aw-mobile-menu" className="aw-mobile-menu" role="dialog" aria-modal="true" aria-label="Menu">
          <nav aria-label="Main" className="aw-mobile-menu-links">
            {PUBLIC_NAV.map((item) => (
              <Link key={item.href} href={item.href} onClick={close}>
                {item.label}
                <Icon name="arrowR" size={20} />
              </Link>
            ))}
            <Link href="/pricing" onClick={close}>
              Pricing
              <Icon name="arrowR" size={20} />
            </Link>
          </nav>
          <div className="aw-mobile-menu-foot">
            <Link href="/auth/login" className="aw-btn aw-btn-ink aw-btn-block" onClick={close}>Sign in</Link>
            <Link href="/auth/signup" className="aw-btn aw-btn-line aw-btn-block" onClick={close}>Create a tenant account</Link>
            <Link href="/#partners" className="aw-mobile-menu-partner" onClick={close}>
              Landlord or agent? List a property
            </Link>
            <a href={`mailto:${env.supportEmail}`} className="aw-mobile-menu-partner">{env.supportEmail}</a>
          </div>
        </div>
      )}
    </div>
  );
}
