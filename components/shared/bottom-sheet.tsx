"use client";

import { useEffect, useRef } from "react";
import { Icon } from "@/components/ui/icon";

interface BottomSheetProps {
  open: boolean;
  onClose: () => void;
  title?: string;
  maxWidth?: number;
  children: React.ReactNode;
}

/**
 * Brand bottom sheet (the design's `Sheet`): dark backdrop + panel that
 * slides up. Centered & capped on desktop. Closes on backdrop click / Esc,
 * locks body scroll, and traps initial focus for accessibility.
 */
export function BottomSheet({ open, onClose, title, maxWidth = 460, children }: BottomSheetProps) {
  const panelRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && onClose();
    window.addEventListener("keydown", onKey);
    const { overflow } = document.body.style;
    document.body.style.overflow = "hidden";
    panelRef.current?.focus();
    return () => {
      window.removeEventListener("keydown", onKey);
      document.body.style.overflow = overflow;
    };
  }, [open, onClose]);

  if (!open) return null;

  return (
    <div
      onClick={onClose}
      className="sheet-overlay anim-in"
      style={{
        position: "fixed",
        inset: 0,
        zIndex: 80,
        background: "rgba(7,18,35,.5)",
        backdropFilter: "blur(3px)",
        display: "flex",
        alignItems: "flex-end",
        justifyContent: "center",
      }}
    >
      <div
        ref={panelRef}
        tabIndex={-1}
        role="dialog"
        aria-modal="true"
        aria-label={title}
        onClick={(e) => e.stopPropagation()}
        className="sheet-panel anim-up scroll"
        style={{
          background: "var(--surface)",
          width: "100%",
          maxWidth,
          borderRadius: "24px 24px 0 0",
          maxHeight: "92vh",
          overflow: "auto",
          boxShadow: "var(--sh-3)",
          outline: "none",
        }}
      >
        {title !== undefined && (
          <div
            className="row between"
            style={{ padding: "18px 20px 6px", position: "sticky", top: 0, background: "var(--surface)", zIndex: 2 }}
          >
            <h3 style={{ fontSize: 18 }}>{title}</h3>
            <button className="icon-btn" onClick={onClose} aria-label="Close">
              <Icon name="close" size={18} />
            </button>
          </div>
        )}
        {children}
      </div>
    </div>
  );
}
