import Link from "next/link";
import Image from "next/image";
import OpenStatusBadge from "@/components/OpenStatusBadge";
import {
  getCurrentSite,
  getSiteSettingsOrFallback,
  formatPhoneLink,
} from "@/lib/site";

export default async function Footer() {
  const site = await getCurrentSite();
  const settings = await getSiteSettingsOrFallback(site?.id ?? null);
  const siteName = site?.name ?? "Reol-Consult AS";
  const orgNumber = site?.org_number ?? "955 273 117";

  return (
    <footer className="bg-bg-light dark:bg-[#0a0b0d]">
      {/* Subtil rød accent-stripe på toppen */}
      <div className="h-[1px] bg-gradient-to-r from-transparent via-accent/15 to-transparent" />
      <div className="mx-auto max-w-7xl px-4 py-16 sm:px-6 sm:py-20 lg:px-8">
        {/* Logo */}
        <div className="mb-12">
          <Image src="/logo.png" alt={siteName} width={200} height={108} className="h-20 w-auto dark:[filter:brightness(0)_invert(1)]" />
        </div>

        <div className="grid grid-cols-1 gap-8 sm:grid-cols-2 sm:gap-12 lg:grid-cols-4">
          {/* Kontakt */}
          <div>
            <h3 className="mb-5 text-xs font-semibold uppercase tracking-[0.2em] text-accent">
              Kontakt
            </h3>
            <ul className="space-y-3 text-sm text-text-dark/80 dark:text-white/70">
              {settings.visit_address && <li>{settings.visit_address}</li>}
              {settings.phone && (
                <li>
                  <a href={formatPhoneLink(settings.phone)} className="transition-colors duration-200 hover:text-accent">
                    Tlf: {settings.phone}
                  </a>
                </li>
              )}
              {settings.email_general && (
                <li>
                  <a href={`mailto:${settings.email_general}`} className="transition-colors duration-200 hover:text-accent">
                    {settings.email_general}
                  </a>
                </li>
              )}
              <li>
                <OpenStatusBadge />
              </li>
            </ul>

            {/* Sosiale medier. Lucide fjernet merkevareikoner i v1, så disse er
                de offisielle merkene som inline SVG. Lenkene kommer fra
                site_settings.social og redigeres i admin. */}
            {(settings.social?.facebook || settings.social?.instagram) && (
              <div className="mt-6 flex items-center gap-4">
                {settings.social?.facebook && (
                  <a
                    href={settings.social.facebook}
                    target="_blank"
                    rel="noopener noreferrer"
                    aria-label="Reol-Consult på Facebook"
                    className="text-text-muted transition-colors duration-200 hover:text-accent dark:text-white/50 dark:hover:text-accent"
                  >
                    <svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
                      <path d="M24 12.073C24 5.405 18.627 0 12 0S0 5.405 0 12.073C0 18.1 3.926 23.094 9.101 24v-8.437H6.627v-3.49h2.474V9.36c0-3.667 1.792-5.278 4.79-5.278 1.435 0 2.194.108 2.553.157v3.29h-2.045c-1.273 0-1.718 1.21-1.718 2.572v1.972h3.73l-.506 3.49h-3.224V24C20.075 23.094 24 18.1 24 12.073Z" />
                    </svg>
                  </a>
                )}
                {settings.social?.instagram && (
                  <a
                    href={settings.social.instagram}
                    target="_blank"
                    rel="noopener noreferrer"
                    aria-label="Reol-Consult på Instagram"
                    className="text-text-muted transition-colors duration-200 hover:text-accent dark:text-white/50 dark:hover:text-accent"
                  >
                    <svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
                      <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069ZM12 0C8.741 0 8.333.014 7.053.072 2.695.272.273 2.69.073 7.052.014 8.333 0 8.741 0 12c0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98C8.333 23.986 8.741 24 12 24c3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98C15.668.014 15.259 0 12 0Zm0 5.838a6.162 6.162 0 1 0 0 12.324 6.162 6.162 0 0 0 0-12.324ZM12 16a4 4 0 1 1 0-8 4 4 0 0 1 0 8Zm6.406-11.845a1.44 1.44 0 1 0 0 2.881 1.44 1.44 0 0 0 0-2.881Z" />
                    </svg>
                  </a>
                )}
              </div>
            )}
          </div>

          {/* Produkter */}
          <div>
            <h3 className="mb-5 text-xs font-semibold uppercase tracking-[0.2em] text-accent">
              Produkter
            </h3>
            <ul className="space-y-3 text-sm text-text-dark/80 dark:text-white/70">
              <li>
                <Link href="/produkter/lager" className="transition-colors duration-200 hover:text-accent">
                  Lagerinnredning
                </Link>
              </li>
              <li>
                <Link href="/produkter/butikk" className="transition-colors duration-200 hover:text-accent">
                  Butikkinnredning
                </Link>
              </li>
              <li>
                <Link href="/produkter/verksted" className="transition-colors duration-200 hover:text-accent">
                  Verksted
                </Link>
              </li>
              <li>
                <Link href="/produkter/kontor" className="transition-colors duration-200 hover:text-accent">
                  Kontor
                </Link>
              </li>
              <li>
                <Link href="/produkter/garderobe" className="transition-colors duration-200 hover:text-accent">
                  Garderobe
                </Link>
              </li>
              <li>
                <Link href="/produkter/skole" className="transition-colors duration-200 hover:text-accent">
                  Skole & barnehage
                </Link>
              </li>
              <li>
                <Link href="/kataloger" className="transition-colors duration-200 hover:text-accent">
                  Kataloger
                </Link>
              </li>
            </ul>
          </div>

          {/* Selskapet */}
          <div>
            <h3 className="mb-5 text-xs font-semibold uppercase tracking-[0.2em] text-accent">
              Selskapet
            </h3>
            <ul className="space-y-3 text-sm text-text-dark/80 dark:text-white/70">
              <li>
                <Link href="/om-oss" className="transition-colors duration-200 hover:text-accent">
                  Om oss
                </Link>
              </li>
              <li>
                <Link href="/referanser" className="transition-colors duration-200 hover:text-accent">
                  Referanser
                </Link>
              </li>
              <li>
                <Link href="/bruktsalg" className="transition-colors duration-200 hover:text-accent">
                  Bruktsalg
                </Link>
              </li>
            </ul>
          </div>

          {/* Info */}
          <div>
            <h3 className="mb-5 text-xs font-semibold uppercase tracking-[0.2em] text-accent">
              Info
            </h3>
            <ul className="space-y-3 text-sm text-text-dark/80 dark:text-white/70">
              <li>
                <Link href="/kontakt" className="transition-colors duration-200 hover:text-accent">
                  Kontakt oss
                </Link>
              </li>
              <li>Org.nr: {orgNumber}</li>
              <li>
                <Link href="/personvern" className="transition-colors duration-200 hover:text-accent">
                  Personvern
                </Link>
              </li>
            </ul>
          </div>
        </div>

        <div className="mt-14 pt-8 text-center text-xs text-text-dark/40 dark:text-white/35">
          &copy; {new Date().getFullYear()} {siteName}
        </div>
      </div>
    </footer>
  );
}
