import Link from "next/link";
import Image from "next/image";
import AnimateOnScroll from "@/components/AnimateOnScroll";

const categories = [
  {
    title: "Lagerinnredning",
    description: "Pallreoler, stålhyller og mesanin",
    tag: "Mest populært",
    href: "/produkter/lager",
    image: "https://reolconsult.no/wp-content/uploads/2022/11/Hekta-Pa-Tur-2-scaled.jpg",
  },
  {
    title: "Butikkinnredning",
    description: "Gondoler, disker og tilbehør",
    tag: "Butikk & dagligvare",
    href: "/produkter/butikk",
    image: "https://reolconsult.no/wp-content/uploads/2022/11/Dagligvare-Foodora.jpg",
  },
  {
    title: "Verksted & Industri",
    description: "Arbeidsbord, verktøyskap og løfteutstyr",
    tag: "Produksjon & lager",
    href: "/produkter/verksted",
    image: "https://reolconsult.no/wp-content/uploads/2022/11/Mesanin-6-scaled.jpeg",
  },
  {
    title: "Kontor",
    description: "Skrivebord, stoler og oppbevaring",
    tag: "Ergonomi & design",
    href: "/produkter/kontor",
    image: "https://reolconsult.no/wp-content/uploads/2018/08/projectskrivebordv.jpg",
  },
  {
    title: "Garderobe",
    description: "Garderobeskap og ladeskap",
    tag: "Ansattløsninger",
    href: "/produkter/garderobe",
    image: "https://reolconsult.no/wp-content/uploads/2023/11/IMG_1148-scaled.jpg",
  },
  {
    title: "Skole & barnehage",
    description: "Innredning for alle aldre",
    tag: "Offentlig sektor",
    href: "/produkter/skole",
    image: "https://reolconsult.no/wp-content/uploads/2023/11/Skole-og-barnehage-1.jpg",
  },
];

export default function ProductCategories() {
  return (
    <section id="kategorier" className="bg-bg-light pt-10 pb-12 sm:pt-12 sm:pb-14">
      <div className="mx-auto max-w-[1200px] px-4 sm:px-6">
        <AnimateOnScroll className="text-center">
          <p className="text-xs font-semibold uppercase tracking-[0.2em] text-accent">
            Våre kategorier
          </p>
          <h2 className="mt-4 text-3xl font-bold tracking-tight text-primary sm:text-4xl md:text-5xl">
            Hva trenger du?
          </h2>
          <p className="mx-auto mt-5 max-w-2xl text-lg text-text-muted">
            Vi leverer komplette innredningsløsninger for alle typer virksomheter.
          </p>
        </AnimateOnScroll>

        <div className="mt-12 sm:mt-16 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {categories.map((cat, i) => (
            <AnimateOnScroll key={cat.href} delay={i * 0.08}>
              <Link
                href={cat.href}
                className="group relative block aspect-[3/2] overflow-hidden rounded-2xl shadow-[0_2px_12px_rgba(0,0,0,0.08)] transition-all duration-500 hover:shadow-[0_12px_40px_rgba(0,0,0,0.15)]"
              >
                <Image
                  src={cat.image}
                  alt={cat.title}
                  fill
                  sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 350px"
                  className="object-cover transition-transform duration-600 ease-out group-hover:scale-[1.04]"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/20 to-transparent" />

                {/* Tag */}
                <span className="absolute top-4 left-4 rounded-full bg-white/90 px-3 py-1 text-[11px] font-semibold text-[#171717] backdrop-blur-sm">
                  {cat.tag}
                </span>

                {/* Text + arrow */}
                <div className="absolute bottom-0 left-0 right-0 p-5">
                  <div className="flex items-end justify-between">
                    <div>
                      <h3 className="text-[19px] font-bold text-white">
                        {cat.title}
                      </h3>
                      <p className="mt-0.5 text-[13px] text-white/80">
                        {cat.description}
                      </p>
                    </div>
                    <span className="mb-1 flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-white/20 text-white backdrop-blur-sm transition-all duration-300 group-hover:bg-white group-hover:text-[#171717]">
                      <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
                      </svg>
                    </span>
                  </div>
                </div>
              </Link>
            </AnimateOnScroll>
          ))}
        </div>
      </div>
    </section>
  );
}
