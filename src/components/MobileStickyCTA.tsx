"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useSite } from "@/components/SiteProvider";
import { formatPhoneLink } from "@/lib/site";

/**
 * Sticky CTA-bar på mobil — nederst på skjermen.
 * Skjules på admin-ruter og på kontakt-siden (hvor brukeren allerede er).
 * Plasserer seg slik at den ikke krasjer med chatbot-knappen (som er bottom-right).
 */
export default function MobileStickyCTA() {
  const pathname = usePathname();
  const { settings } = useSite();

  // Skjul på admin-ruter og kontakt
  if (pathname.startsWith("/admin")) return null;
  if (pathname === "/kontakt") return null;

  const phone = settings.phone ?? "33 36 55 80";

  return (
    <div
      className="fixed bottom-0 left-0 right-0 z-30 border-t border-border bg-surface-warm/95 backdrop-blur md:hidden"
      style={{ paddingBottom: "max(0px, env(safe-area-inset-bottom))" }}
    >
      <div className="flex gap-2 px-4 py-3 pr-20">
        <a
          href={formatPhoneLink(phone)}
          className="flex flex-1 items-center justify-center gap-2 rounded-full border border-primary/20 bg-surface py-3 text-sm font-semibold text-primary transition duration-200 hover:border-primary/40 hover:bg-primary/5 active:scale-[0.98]"
          aria-label={`Ring ${phone}`}
        >
          <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M2.25 6.75c0 8.284 6.716 15 15 15h2.25a2.25 2.25 0 0 0 2.25-2.25v-1.372c0-.516-.351-.966-.852-1.091l-4.423-1.106c-.44-.11-.902.055-1.173.417l-.97 1.293c-.282.376-.769.542-1.21.38a12.035 12.035 0 0 1-7.143-7.143c-.162-.441.004-.928.38-1.21l1.293-.97c.363-.271.527-.734.417-1.173L6.963 3.102a1.125 1.125 0 0 0-1.091-.852H4.5A2.25 2.25 0 0 0 2.25 4.5v2.25Z"
            />
          </svg>
          Ring oss
        </a>
        <Link
          href="/kontakt"
          className="flex flex-1 items-center justify-center gap-2 rounded-full bg-accent py-3 text-sm font-semibold text-white shadow-[0_4px_12px_rgba(220,38,38,0.25)] transition duration-200 hover:bg-accent-hover active:scale-[0.98]"
        >
          Kontakt
        </Link>
      </div>
    </div>
  );
}
