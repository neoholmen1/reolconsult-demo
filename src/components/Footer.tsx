import Link from "next/link";
/* eslint-disable @next/next/no-img-element */

export default function Footer() {
  return (
    <footer className="bg-[#1A1A1A] text-white">
      <div className="mx-auto max-w-7xl px-4 py-20 sm:px-6 sm:py-24 lg:px-8">
        {/* Logo */}
        <div className="mb-12">
          <img src="/logo.png" alt="Reolconsult" className="h-10 w-auto brightness-0 invert" />
        </div>

        <div className="grid grid-cols-1 gap-8 sm:grid-cols-2 sm:gap-12 lg:grid-cols-4">
          {/* Kontakt */}
          <div>
            <h3 className="mb-6 text-xs font-semibold uppercase tracking-[0.2em] text-white/40">
              Kontakt
            </h3>
            <ul className="space-y-3 text-sm text-white/60">
              <li>Smiløkka 7, 3173 Vear</li>
              <li>
                <a href="tel:+4733365580" className="transition-colors duration-200 hover:text-white">
                  Tlf: 33 36 55 80
                </a>
              </li>
              <li>
                <a href="mailto:mail@reolconsult.no" className="transition-colors duration-200 hover:text-white">
                  mail@reolconsult.no
                </a>
              </li>
            </ul>
          </div>

          {/* Produkter */}
          <div>
            <h3 className="mb-6 text-xs font-semibold uppercase tracking-[0.2em] text-white/40">
              Produkter
            </h3>
            <ul className="space-y-3 text-sm text-white/60">
              <li>
                <Link href="/produkter?kategori=lager" className="transition-colors duration-200 hover:text-white">
                  Lagerinnredning
                </Link>
              </li>
              <li>
                <Link href="/produkter?kategori=butikk" className="transition-colors duration-200 hover:text-white">
                  Butikkinnredning
                </Link>
              </li>
              <li>
                <Link href="/produkter?kategori=verksted" className="transition-colors duration-200 hover:text-white">
                  Verksted
                </Link>
              </li>
              <li>
                <Link href="/produkter?kategori=kontor" className="transition-colors duration-200 hover:text-white">
                  Kontor
                </Link>
              </li>
              <li>
                <Link href="/produkter?kategori=garderobe" className="transition-colors duration-200 hover:text-white">
                  Garderobe
                </Link>
              </li>
              <li>
                <Link href="/produkter?kategori=skole" className="transition-colors duration-200 hover:text-white">
                  Skole & barnehage
                </Link>
              </li>
            </ul>
          </div>

          {/* Selskapet */}
          <div>
            <h3 className="mb-6 text-xs font-semibold uppercase tracking-[0.2em] text-white/40">
              Selskapet
            </h3>
            <ul className="space-y-3 text-sm text-white/60">
              <li>
                <Link href="/om-oss" className="transition-colors duration-200 hover:text-white">
                  Om oss
                </Link>
              </li>
              <li>
                <Link href="/referanser" className="transition-colors duration-200 hover:text-white">
                  Referanser
                </Link>
              </li>
              <li>
                <Link href="/bruktsalg" className="transition-colors duration-200 hover:text-white">
                  Bruktsalg
                </Link>
              </li>
            </ul>
          </div>

          {/* Info */}
          <div>
            <h3 className="mb-6 text-xs font-semibold uppercase tracking-[0.2em] text-white/40">
              Info
            </h3>
            <ul className="space-y-3 text-sm text-white/60">
              <li>
                <Link href="/kontakt" className="transition-colors duration-200 hover:text-white">
                  Kontakt oss
                </Link>
              </li>
              <li>Org.nr: 955 273 117</li>
            </ul>
          </div>
        </div>

        <div className="mt-16 border-t border-white/10 pt-8 text-center text-xs text-white/30">
          &copy; 2026 Reolconsult AS
        </div>
      </div>
    </footer>
  );
}
