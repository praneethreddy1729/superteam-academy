"use client";

export default function GlobalError({ error, reset }: { error: Error & { digest?: string }; reset: () => void }) {
  // Sentry integration removed to prevent Turbopack HMR module instantiation errors
  return (
    <html lang="pt-BR">
      <body style={{ margin: 0, fontFamily: "system-ui, sans-serif", backgroundColor: "#08080C", color: "#EDE9E1", minHeight: "100vh", display: "flex", alignItems: "center", justifyContent: "center" }}>
        <div style={{ textAlign: "center", padding: "2rem", maxWidth: "480px" }}>
          <div style={{ fontSize: "3rem", marginBottom: "1rem" }}>⚠</div>
          <h2 style={{ fontSize: "1.5rem", fontWeight: 700, marginBottom: "0.75rem", color: "#EDE9E1" }}>
            Something went wrong
          </h2>
          <p style={{ fontSize: "0.875rem", color: "#9CA3AF", marginBottom: "2rem" }}>
            An unexpected error occurred. Our team has been notified.
          </p>
          <button
            onClick={() => reset()}
            style={{
              display: "inline-flex",
              alignItems: "center",
              gap: "0.5rem",
              padding: "0.5rem 1.25rem",
              borderRadius: "0.5rem",
              border: "1px solid #14F195",
              backgroundColor: "transparent",
              color: "#14F195",
              fontSize: "0.875rem",
              fontWeight: 600,
              cursor: "pointer",
            }}
          >
            Try again
          </button>
        </div>
      </body>
    </html>
  );
}
