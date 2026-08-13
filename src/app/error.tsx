"use client";

import Link from "next/link";
import { useEffect } from "react";

export default function GlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error("App error:", error);
  }, [error]);

  return (
    <div className="flex min-h-[60vh] flex-col items-center justify-center px-4 py-16 text-center">
      <p className="inline-flex items-center gap-2.5 text-xs font-semibold uppercase tracking-[0.22em] text-accent">
        <span className="h-px w-7 bg-accent/50" />
        Feil
      </p>
      <h1 className="mt-4 font-display text-4xl font-semibold tracking-[-0.02em] text-primary sm:text-5xl">
        Noe gikk galt
      </h1>
      <p className="mt-4 max-w-md text-base leading-relaxed text-text-muted sm:text-lg">
        Vi beklager — siden klarte ikke å lastes. Prøv igjen, eller gå tilbake til forsiden.
        Tar det fortsatt tid? Ring oss på 33 36 55 80.
      </p>

      <div className="mt-8 flex flex-wrap justify-center gap-3">
        <button
          onClick={reset}
          className="inline-flex items-center gap-2 rounded-full bg-accent px-7 py-3.5 text-base font-semibold text-white transition hover:bg-accent-hover hover:shadow-[0_8px_24px_rgba(220,38,38,0.25)] active:scale-[0.98]"
        >
          Prøv igjen
        </button>
        <Link
          href="/"
          className="inline-flex items-center gap-2 rounded-full border border-primary/20 px-7 py-3.5 text-base font-semibold text-primary transition duration-300 hover:border-primary/40 hover:bg-primary/5 active:scale-[0.98]"
        >
          Til forsiden
        </Link>
      </div>

      {error.digest && (
        <p className="mt-8 text-[11px] font-mono text-text-muted/70">
          Feilkode: {error.digest}
        </p>
      )}
    </div>
  );
}
