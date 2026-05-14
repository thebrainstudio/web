"use client";

import { useEffect } from "react";

/**
 * Root-level global error boundary. Required by Next.js to override the
 * built-in "This page couldn't load" fallback when an error escapes the
 * locale layout. Currently used as a diagnostic surface — renders the
 * error message and stack so we can see what crashed.
 */
export default function GlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    // Mirror to console so it shows in any browser dev tools.
    console.error("[brain-studio:global-error]", error);
  }, [error]);

  return (
    <html lang="en">
      <body
        style={{
          fontFamily: "system-ui, sans-serif",
          background: "#0a1018",
          color: "#e8e1d2",
          padding: "48px 24px",
          minHeight: "100vh",
        }}
      >
        <div style={{ maxWidth: 880, margin: "0 auto" }}>
          <p style={{ color: "#c4a35a", textTransform: "uppercase", letterSpacing: 2, fontSize: 12 }}>
            global-error
          </p>
          <h1 style={{ fontSize: 28, fontWeight: 300, marginTop: 16 }}>
            Something hit the root layout.
          </h1>
          <p style={{ marginTop: 16, color: "#a39d8b" }}>
            <strong>name:</strong> {error.name}
          </p>
          <p style={{ marginTop: 4, color: "#a39d8b" }}>
            <strong>message:</strong> {error.message}
          </p>
          {error.digest && (
            <p style={{ marginTop: 4, color: "#a39d8b" }}>
              <strong>digest:</strong> {error.digest}
            </p>
          )}
          <pre
            style={{
              marginTop: 24,
              padding: 16,
              background: "#000",
              border: "1px solid #2a3140",
              borderRadius: 6,
              fontSize: 12,
              lineHeight: 1.5,
              overflow: "auto",
              maxHeight: "60vh",
            }}
          >
            {error.stack ?? "(no stack)"}
          </pre>
          <button
            type="button"
            onClick={reset}
            style={{
              marginTop: 24,
              padding: "10px 16px",
              background: "#c4a35a",
              color: "#0a1018",
              border: "none",
              borderRadius: 6,
              cursor: "pointer",
              fontWeight: 600,
            }}
          >
            Try again
          </button>
        </div>
      </body>
    </html>
  );
}
