"use client";

import { useState, useEffect } from "react";
import Link from "next/link";

export default function CookieBanner() {
  const [visible, setVisible] = useState(false);
  const [leaving, setLeaving] = useState(false);

  useEffect(() => {
    const consent = localStorage.getItem("cookie-consent");
    if (!consent) {
      const timer = setTimeout(() => setVisible(true), 500);
      return () => clearTimeout(timer);
    }
  }, []);

  const accept = (value: string) => {
    setLeaving(true);
    setTimeout(() => {
      localStorage.setItem("cookie-consent", value);
      setVisible(false);
    }, 300);
  };

  if (!visible) return null;

  return (
    <div
      className={`fixed bottom-0 left-0 right-0 z-40 flex justify-center px-4 pb-4 transition-all duration-300 ${
        leaving ? "opacity-0 translate-y-4" : "animate-slide-up"
      }`}
    >
      <div className="w-full max-w-[500px] rounded-2xl bg-white p-6 shadow-[0_-4px_20px_rgba(0,0,0,0.1)]">
        <p className="text-sm leading-relaxed text-text-dark/80">
          Vi bruker informasjonskapsler til statistikk og funksjon. Du velger selv nivå.
        </p>
        <div className="mt-4 flex gap-3">
          <button
            onClick={() => accept("all")}
            className="flex-1 rounded-full bg-[#dc2626] px-5 py-3 text-sm font-semibold text-white transition-all duration-200 hover:bg-[#b91c1c] active:translate-y-[1px]"
          >
            Godta alle
          </button>
          <button
            onClick={() => accept("necessary")}
            className="flex-1 rounded-full border border-border px-5 py-3 text-sm font-semibold text-text-dark transition-all duration-200 hover:bg-black/5 active:translate-y-[1px]"
          >
            Kun nødvendige
          </button>
        </div>
        <div className="mt-3 text-center">
          <Link
            href="/personvern"
            className="text-xs text-text-muted underline decoration-text-muted/30 underline-offset-4 transition-colors hover:text-accent"
          >
            Les vår personvernerklæring
          </Link>
        </div>
      </div>
    </div>
  );
}
