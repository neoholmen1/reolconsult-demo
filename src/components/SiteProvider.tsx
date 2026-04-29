"use client";

import { createContext, useContext, type ReactNode } from "react";
import type { Site, SiteSettings } from "@/lib/site";

type SiteContextValue = {
  site: Site | null;
  settings: SiteSettings;
};

const SiteContext = createContext<SiteContextValue | null>(null);

export function SiteProvider({
  value,
  children,
}: {
  value: SiteContextValue;
  children: ReactNode;
}) {
  return <SiteContext.Provider value={value}>{children}</SiteContext.Provider>;
}

/**
 * Henter site og settings i en klientkomponent. Krever at en SiteProvider
 * er montert lenger opp i treet (vanligvis i root layout).
 */
export function useSite(): SiteContextValue {
  const ctx = useContext(SiteContext);
  if (!ctx) {
    throw new Error(
      "useSite() må kalles inne i en SiteProvider. Sjekk at root layout har <SiteProvider>.",
    );
  }
  return ctx;
}
