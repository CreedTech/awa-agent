"use client";

import { useEffect, useRef } from "react";
import { Icon } from "@/components/ui/icon";
import { useFocusTrap } from "@/hooks/use-focus-trap";

interface PhotoViewerProps {
  images: string[];
  index: number;
  title: string;
  onIndexChange: (index: number) => void;
  onClose: () => void;
}

export function PhotoViewer({ images, index, title, onIndexChange, onClose }: PhotoViewerProps) {
  const closeRef = useRef<HTMLButtonElement>(null);
  const rootRef = useRef<HTMLDivElement>(null);
  useFocusTrap(rootRef);
  const count = images.length;
  const step = (delta: number) => onIndexChange((index + delta + count) % count);
  const stepRef = useRef(step);
  const onCloseRef = useRef(onClose);

  useEffect(() => {
    stepRef.current = step;
    onCloseRef.current = onClose;
  });

  useEffect(() => {
    const onKey = (event: KeyboardEvent) => {
      if (event.key === "Escape") onCloseRef.current();
      if (event.key === "ArrowRight") stepRef.current(1);
      if (event.key === "ArrowLeft") stepRef.current(-1);
    };
    window.addEventListener("keydown", onKey);
    const { overflow } = document.body.style;
    document.body.style.overflow = "hidden";
    closeRef.current?.focus();
    return () => {
      window.removeEventListener("keydown", onKey);
      document.body.style.overflow = overflow;
    };
  }, []);

  return (
    <div ref={rootRef} className="aw-viewer" role="dialog" aria-modal="true" aria-label={`Photos of ${title}`}>
      <div className="aw-viewer-bar">
        <span className="num">{index + 1} of {count}</span>
        <button ref={closeRef} type="button" className="aw-viewer-btn" onClick={onClose}>
          <Icon name="close" size={20} /> Close
        </button>
      </div>
      <div className="aw-viewer-stage">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src={images[index]} alt={`${title}, photo ${index + 1} of ${count}`} />
      </div>
      {count > 1 && (
        <div className="aw-viewer-nav">
          <button type="button" className="aw-viewer-btn" onClick={() => step(-1)} aria-label="Previous photo">
            <Icon name="arrowL" size={22} />
          </button>
          <button type="button" className="aw-viewer-btn" onClick={() => step(1)} aria-label="Next photo">
            <Icon name="arrowR" size={22} />
          </button>
        </div>
      )}
    </div>
  );
}
