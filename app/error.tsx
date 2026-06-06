"use client";

import { useEffect } from "react";
import { Icon } from "@/components/ui/icon";

type ErrorReporterWindow = Window & {
  Sentry?: {
    captureException?: (error: unknown, context?: { extra?: Record<string, unknown> }) => void;
  };
  LogRocket?: {
    captureException?: (error: unknown) => void;
  };
};

export default function Error({ error, reset }: { error: Error & { digest?: string }; reset: () => void }) {
  useEffect(() => {
    if (process.env.NODE_ENV === "production") {
      const reporters = window as ErrorReporterWindow;

      reporters.Sentry?.captureException?.(error, {
        extra: { digest: error.digest },
      });
      reporters.LogRocket?.captureException?.(error);

      return;
    }

    console.error(error);
  }, [error]);

  return (
    <div className="col center" style={{ minHeight: "100vh", textAlign: "center", gap: 18, padding: 24 }}>
      <span className="grid place-items-center" style={{ width: 72, height: 72, borderRadius: 20, background: "var(--danger-bg)", color: "var(--danger)" }}>
        <Icon name="alert" size={32} />
      </span>
      <h1 style={{ fontSize: 26 }}>Something went wrong</h1>
      <p style={{ color: "var(--muted)", fontSize: 15, maxWidth: 380 }}>
        An unexpected error occurred. You can try again — your data is safe.
      </p>
      <button className="btn btn-primary" onClick={reset}>
        <Icon name="refresh" size={17} /> Try again
      </button>
    </div>
  );
}
