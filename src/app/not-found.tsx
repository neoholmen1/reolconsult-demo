import Link from "next/link";

export default function NotFound() {
  return (
    <div className="flex min-h-[70vh] flex-col items-center justify-center px-4 py-16 text-center">
      {/* Decorative number */}
      <div className="relative">
        <p
          aria-hidden="true"
          className="select-none font-display text-[120px] font-semibold leading-none tracking-tighter text-bg-sand sm:text-[180px]"
        >
          404
        </p>
        <p className="absolute inset-0 flex items-center justify-center">
          <span className="rounded-full bg-accent/10 px-3 py-1 text-xs font-semibold uppercase tracking-[0.22em] text-accent">
            Side ikke funnet
          </span>
        </p>
      </div>

      <h1 className="mt-6 font-display text-4xl font-semibold leading-[1.08] tracking-[-0.02em] text-primary sm:text-5xl md:text-6xl">
        Vi finner ikke siden du leter etter
      </h1>
      <p className="mt-4 max-w-md text-base sm:text-lg leading-relaxed text-text-muted">
        Lenken kan være feil eller siden kan ha blitt flyttet. Du finner alt vi tilbyr på forsiden,
        eller du kan kontakte oss om du leter etter noe spesifikt.
      </p>

      <div className="mt-10 flex flex-wrap justify-center gap-3">
        <Link
          href="/"
          className="inline-flex items-center gap-2 rounded-full bg-accent px-7 py-3.5 text-base font-semibold text-white transition hover:bg-accent-hover hover:shadow-[0_8px_24px_rgba(220,38,38,0.25)] active:translate-y-[1px]"
        >
          Til forsiden
          <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.25}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 4.5 21 12m0 0-7.5 7.5M21 12H3" />
          </svg>
        </Link>
        <Link
          href="/kontakt"
          className="inline-flex items-center gap-2 rounded-full border border-primary/20 px-7 py-3.5 text-base font-semibold text-primary transition duration-300 hover:border-primary/40 hover:bg-primary/5 active:translate-y-[1px]"
        >
          Kontakt oss
        </Link>
      </div>
    </div>
  );
}
