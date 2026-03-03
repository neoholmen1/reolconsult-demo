import Link from "next/link";
import AnimateOnScroll from "@/components/AnimateOnScroll";

export default function UsedSalesTeaser() {
  return (
    <section className="bg-white py-28 sm:py-36">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <AnimateOnScroll>
          <div className="rounded-3xl border border-black/[0.04] bg-[#faf8f6] p-10 sm:p-14 lg:p-20">
            <div className="grid grid-cols-1 items-center gap-8 sm:gap-10 lg:gap-12 lg:grid-cols-2">
              <div>
                <span className="inline-block rounded-full border border-green-600/20 bg-green-600/10 px-4 py-1.5 text-xs font-semibold uppercase tracking-[0.15em] text-green-700">
                  Spar penger
                </span>
                <h2
                  className="mt-6 text-4xl font-bold tracking-tight text-primary sm:text-5xl"
                  style={{ lineHeight: 1.1 }}
                >
                  Brukte reoler til
                  <br />
                  gode priser
                </h2>
                <p className="mt-6 text-lg font-light leading-relaxed text-text-muted">
                  Vi har jevnlig inn brukte pallreoler, stålhyller og
                  butikkinnredning i god stand. En rimelig løsning for deg som
                  trenger innredning uten å sprenge budsjettet.
                </p>
                <Link
                  href="/bruktsalg"
                  className="mt-10 inline-flex rounded-full bg-accent px-8 py-4 text-base font-semibold text-white transition-all duration-300 hover:bg-accent-hover hover:shadow-[0_8px_30px_rgba(212,32,39,0.25)]"
                >
                  Se brukte produkter
                </Link>
              </div>

              <div className="aspect-[4/3] overflow-hidden rounded-2xl shadow-[0_20px_40px_rgba(0,0,0,0.06)]">
                <img
                  src="https://reolconsult.no/wp-content/uploads/2022/11/Nettinghyller-4.jpg"
                  alt="Brukte reoler"
                  className="h-full w-full object-cover"
                />
              </div>
            </div>
          </div>
        </AnimateOnScroll>
      </div>
    </section>
  );
}
