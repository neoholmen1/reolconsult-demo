import Link from "next/link";
import Image from "next/image";

export default function Footer() {
  return (
    <footer className="bg-bg-light">
      <div className="mx-auto max-w-7xl px-4 py-16 sm:px-6 sm:py-20 lg:px-8">
        {/* Logo */}
        <div className="mb-12">
          <Image src="/logo.png" alt="Reolconsult" width={200} height={108} className="h-20 w-auto" />
        </div>

        <div className="grid grid-cols-1 gap-8 sm:grid-cols-2 sm:gap-12 lg:grid-cols-4">
          {/* Kontakt */}
          <div>
            <h3 className="mb-5 text-xs font-semibold uppercase tracking-[0.2em] text-accent">
              Kontakt
            </h3>
            <ul className="space-y-3 text-sm text-text-dark/90">
              <li>Smiløkka 7, 3173 Vear</li>
              <li>
                <a href="tel:+4733365580" className="transition-colors duration-200 hover:text-accent">
                  Tlf: 333 65 580
                </a>
              </li>
              <li>
                <a href="mailto:mail@reolconsult.no" className="transition-colors duration-200 hover:text-accent">
                  mail@reolconsult.no
                </a>
              </li>
            </ul>
          </div>

          {/* Produkter */}
          <div>
            <h3 className="mb-5 text-xs font-semibold uppercase tracking-[0.2em] text-accent">
              Produkter
            </h3>
            <ul className="space-y-3 text-sm text-text-dark/90">
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
            </ul>
          </div>

          {/* Selskapet */}
          <div>
            <h3 className="mb-5 text-xs font-semibold uppercase tracking-[0.2em] text-accent">
              Selskapet
            </h3>
            <ul className="space-y-3 text-sm text-text-dark/90">
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
            <ul className="space-y-3 text-sm text-text-dark/90">
              <li>
                <Link href="/kontakt" className="transition-colors duration-200 hover:text-accent">
                  Kontakt oss
                </Link>
              </li>
              <li>Org.nr: 955 273 117</li>
              <li>
                <Link href="/personvern" className="transition-colors duration-200 hover:text-accent">
                  Personvern
                </Link>
              </li>
              <li>
                <Link href="/admin" className="transition-colors duration-200 hover:text-accent">
                  Admin
                </Link>
              </li>
            </ul>
          </div>
        </div>

        <div className="mt-14 pt-8 text-center text-xs text-text-dark/40">
          &copy; {new Date().getFullYear()} Reolconsult AS
        </div>
      </div>
    </footer>
  );
}
