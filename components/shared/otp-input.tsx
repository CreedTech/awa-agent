"use client";

import { useRef } from "react";

interface OtpInputProps {
  value: string;
  onChange: (value: string) => void;
  length?: number;
  /** Read-only display (e.g. the tenant's meeting code). */
  readOnly?: boolean;
}

/**
 * 6-cell OTP input. Auto-advances on entry, backspace steps back,
 * supports paste. Uses inputMode=numeric for mobile keypads.
 */
export function OtpInput({ value, onChange, length = 6, readOnly }: OtpInputProps) {
  const refs = useRef<(HTMLInputElement | null)[]>([]);
  const digits = value.replace(/\s/g, "").padEnd(length, " ").slice(0, length).split("");

  const setDigit = (i: number, d: string) => {
    const next = digits.map((c) => (c === " " ? "" : c));
    next[i] = d;
    onChange(next.join(""));
  };

  const handleChange = (i: number, raw: string) => {
    const d = raw.replace(/\D/g, "").slice(-1);
    if (!d) return;
    setDigit(i, d);
    if (i < length - 1) refs.current[i + 1]?.focus();
  };

  const handleKey = (i: number, e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Backspace") {
      e.preventDefault();
      if (digits[i].trim()) setDigit(i, "");
      else if (i > 0) {
        refs.current[i - 1]?.focus();
        setDigit(i - 1, "");
      }
    }
  };

  const handlePaste = (e: React.ClipboardEvent) => {
    const pasted = e.clipboardData.getData("text").replace(/\D/g, "").slice(0, length);
    if (pasted) {
      e.preventDefault();
      onChange(pasted);
      refs.current[Math.min(pasted.length, length - 1)]?.focus();
    }
  };

  return (
    <div className="otp-grid" role="group" aria-label="One-time passcode">
      {Array.from({ length }).map((_, i) => (
        <input
          key={i}
          ref={(el) => {
            refs.current[i] = el;
          }}
          className="otp-cell otp-edit"
          inputMode="numeric"
          maxLength={1}
          aria-label={`Digit ${i + 1}`}
          readOnly={readOnly}
          value={digits[i].trim()}
          onChange={(e) => handleChange(i, e.target.value)}
          onKeyDown={(e) => handleKey(i, e)}
          onPaste={handlePaste}
        />
      ))}
    </div>
  );
}
