"use client";

import { useEffect, useState } from "react";

/**
 * Beregner om vi er åpne nå basert på lokal tid (Norge).
 * Hardkodet til man-fre 08:00-16:00. Hvis åpningstidene endres,
 * må dette holdes synkronisert med site_settings.opening_hours.
 */
function isOpenNow(): boolean {
  const now = new Date();
  const day = now.getDay(); // 0=Sun, 1=Mon, ..., 6=Sat
  const hour = now.getHours();
  if (day < 1 || day > 5) return false;
  if (hour < 8) return false;
  if (hour >= 16) return false;
  return true;
}

export default function OpenStatusBadge({ className = "" }: { className?: string }) {
  const [open, setOpen] = useState<boolean | null>(null);

  useEffect(() => {
    setOpen(isOpenNow());
    const t = setInterval(() => setOpen(isOpenNow()), 60_000);
    return () => clearInterval(t);
  }, []);

  // Skjul ved første server-render for å unngå hydration-mismatch
  if (open === null) return null;

  return (
    <span
      className={`inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-[11px] font-medium ${
        open ? "bg-emerald-50 text-emerald-700" : "bg-stone-100 text-stone-600"
      } ${className}`}
    >
      <span className="relative flex h-2 w-2">
        {open && (
          <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-emerald-400 opacity-60" />
        )}
        <span
          className={`relative inline-flex h-2 w-2 rounded-full ${
            open ? "bg-emerald-500" : "bg-stone-400"
          }`}
        />
      </span>
      {open ? "Åpent nå" : "Stengt nå"}
    </span>
  );
}
