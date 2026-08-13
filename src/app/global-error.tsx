"use client";

export default function GlobalError({
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return (
    <html lang="no">
      <body>
        <div style={{ minHeight: "100vh", display: "flex", alignItems: "center", justifyContent: "center", padding: "1rem", fontFamily: "system-ui, sans-serif", textAlign: "center", background: "#fdfbf7" }}>
          <div>
            <h1 style={{ fontSize: "1.75rem", fontWeight: 600, letterSpacing: "-0.02em", color: "#1c1917" }}>Noe gikk galt</h1>
            <p style={{ marginTop: "1rem", color: "#737373" }}>
              Vi beklager — siden klarte ikke å lastes. Prøv igjen, eller ring oss på 33 36 55 80.
            </p>
            <button
              onClick={reset}
              style={{
                marginTop: "1.5rem",
                padding: "0.75rem 1.5rem",
                borderRadius: "9999px",
                background: "#dc2626",
                color: "white",
                fontWeight: 600,
                border: "none",
                cursor: "pointer",
                boxShadow: "0 8px 24px rgba(220,38,38,0.25)",
              }}
            >
              Prøv igjen
            </button>
          </div>
        </div>
      </body>
    </html>
  );
}
