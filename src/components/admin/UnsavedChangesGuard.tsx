"use client";

import { useEffect } from "react";

/**
 * Viser nettleserens "Vil du forlate siden?"-dialog hvis brukeren prøver å
 * navigere bort fra siden mens dirty=true. Fanger opp tab-lukk og refresh.
 *
 * Klient-side navigering håndteres ikke (Next.js router har ingen offisielt
 * støttet hook for dette i App Router) — link-klikk vil derfor IKKE gi varsel,
 * men page reload, tab-lukk og lukk av nettleser vil.
 */
export default function UnsavedChangesGuard({ dirty }: { dirty: boolean }) {
  useEffect(() => {
    if (!dirty) return;
    const handler = (e: BeforeUnloadEvent) => {
      e.preventDefault();
      // For eldre nettlesere
      e.returnValue = "";
    };
    window.addEventListener("beforeunload", handler);
    return () => window.removeEventListener("beforeunload", handler);
  }, [dirty]);

  return null;
}
