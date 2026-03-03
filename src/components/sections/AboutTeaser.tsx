import Link from "next/link";
import AnimateOnScroll from "@/components/AnimateOnScroll";

export default function AboutTeaser() {
  return (
    <section className="bg-white py-32 sm:py-40">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 items-center gap-10 sm:gap-12 lg:gap-16 lg:grid-cols-[1.2fr_1fr]">
          <AnimateOnScroll>
            <div className="relative aspect-[4/3] sm:aspect-[3/4] overflow-hidden rounded-3xl shadow-[0_30px_60px_rgba(0,0,0,0.12)]">
              <img
                src="https://reolconsult.no/wp-content/uploads/2022/11/Dagligvare-Foodora-1.jpg"
                alt="Reolconsult utstilling"
                className="h-full w-full object-cover"
              />
            </div>
          </AnimateOnScroll>

          <AnimateOnScroll delay={0.2}>
            <p className="text-xs font-semibold uppercase tracking-[0.2em] text-accent">
              Om oss
            </p>
            <h2 className="mt-4 text-4xl font-bold tracking-tight text-primary sm:text-5xl" style={{ lineHeight: 1.1 }}>
              Vi har innredet norske lagre siden 1984
            </h2>
            <p className="mt-8 text-lg font-light leading-relaxed text-text-muted">
              Reolconsult ble etablert i 1984 og holder til på Vear i Tønsberg.
              Med over 40 års erfaring og en 350 kvm stor utstilling hjelper vi
              bedrifter over hele landet med å finne riktig innredning — fra
              pallreoler og butikkhyller til kontormøbler og garderobeskap.
            </p>
            <p className="mt-4 text-lg font-light leading-relaxed text-text-muted">
              Kom innom utstillingen vår, så tar vi en prat om hva du trenger.
            </p>
            <Link
              href="/om-oss"
              className="mt-10 inline-flex items-center gap-2 text-base font-medium text-primary transition-all duration-300 hover:gap-3"
            >
              Les mer om oss
              <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 4.5L21 12m0 0l-7.5 7.5M21 12H3" />
              </svg>
            </Link>
          </AnimateOnScroll>
        </div>
      </div>
    </section>
  );
}
