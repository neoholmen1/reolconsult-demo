import Link from "next/link";

export default function NotFound() {
  return (
    <div className="flex min-h-[60vh] flex-col items-center justify-center px-4 text-center">
      <p className="text-sm font-semibold uppercase tracking-[0.2em] text-accent">
        404
      </p>
      <h1 className="mt-4 text-4xl font-bold tracking-tight text-primary sm:text-5xl">
        Siden finnes ikke
      </h1>
      <p className="mt-4 max-w-md text-lg text-text-muted">
        Beklager, vi finner ikke siden du leter etter. Den kan ha blitt flyttet
        eller fjernet.
      </p>
      <div className="mt-8 flex flex-wrap justify-center gap-3">
        <Link
          href="/"
          className="rounded-full bg-accent px-8 py-3.5 text-base font-semibold text-white transition-all duration-300 hover:bg-accent-hover hover:shadow-lg"
        >
          Til forsiden
        </Link>
        <Link
          href="/kontakt"
          className="rounded-full border border-border px-8 py-3.5 text-base font-semibold text-primary transition-all duration-300 hover:bg-bg-light"
        >
          Kontakt oss
        </Link>
      </div>
    </div>
  );
}
