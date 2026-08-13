"use client";

import { usePathname } from "next/navigation";
import LivingBackdrop from "@/components/LivingBackdrop";
import { useTheme } from "@/components/ThemeProvider";

/**
 * Fast, levende fotorealistisk bakteppe bak HELE forsiden — gir et
 * sammenhengende mørkt uttrykk der dark-glass-seksjonene flyter oppå.
 * Kun på forsiden.
 */
export default function GlobalBackground() {
  const pathname = usePathname();
  const { theme } = useTheme();
  // Det mørke foto-bakteppet hører til mørk modus; i lys modus vises lys base.
  if (pathname !== "/" || theme !== "dark") return null;

  return (
    <div className="pointer-events-none fixed inset-0 -z-10" aria-hidden>
      <LivingBackdrop />
    </div>
  );
}
