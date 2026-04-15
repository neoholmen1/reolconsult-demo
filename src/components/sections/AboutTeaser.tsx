import Link from "next/link";
import Image from "next/image";
import AnimateOnScroll from "@/components/AnimateOnScroll";

export default function AboutTeaser() {
  return (
    <section className="bg-white pt-10 pb-10 sm:pt-12 sm:pb-12">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 items-center gap-10 sm:gap-12 lg:gap-12 lg:grid-cols-2">
          <AnimateOnScroll variant="scaleIn">
            <div className="relative aspect-[4/3] overflow-hidden rounded-2xl">
              <Image
                src="https://reolconsult.no/wp-content/uploads/2022/11/Mesanin-6-scaled.jpeg"
                alt="Mesaninløsning fra Reolconsult"
                fill
                sizes="(max-width: 1024px) 100vw, 50vw"
                className="object-cover"
              />
            </div>
          </AnimateOnScroll>

          <AnimateOnScroll delay={0.15}>
            <p className="text-xs font-semibold uppercase tracking-[0.2em] text-accent">
              Om oss
            </p>
            <h2 className="mt-4 text-3xl font-bold tracking-tight text-primary sm:text-4xl md:text-5xl" style={{ lineHeight: 1.1 }}>
              Vi er der du er!
            </h2>
            <p className="mt-8 text-lg leading-relaxed text-text-muted">
              Reol-Consult AS ble etablert i november 1984. Vi er en gruppe
              fagfolk med høy kompetanse, service og ekspertise, samt lang
              erfaring innen vårt fag. I Smiløkka 7 på Vear Industriområde i
              Tønsberg finner du vår 350 kvm store utstilling, hvor vi viser et
              stort utvalg av produktene vi leverer. Mye av utstyret
              lagerføres!
            </p>
            <Link
              href="/om-oss"
              className="group mt-10 inline-flex items-center gap-2 text-base font-semibold text-primary transition-all duration-200 hover:gap-3"
            >
              Les mer om oss
              <svg className="h-4 w-4 transition-transform duration-300 group-hover:translate-x-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 4.5L21 12m0 0l-7.5 7.5M21 12H3" />
              </svg>
            </Link>
          </AnimateOnScroll>
        </div>
      </div>
    </section>
  );
}
