import Link from "next/link";
import AnimateOnScroll from "@/components/AnimateOnScroll";

const categories = [
  {
    title: "Lagerinnredning",
    description: "Pallreoler, stålhyller, mesanin og komplettreoler.",
    href: "/produkter?kategori=lager",
    image: "https://reolconsult.no/wp-content/uploads/2022/11/Hekta-Pa-Tur-2-scaled.jpg",
    span: "sm:col-span-2 sm:row-span-2",
  },
  {
    title: "Butikkinnredning",
    description: "Gondoler, displayer og kassedisker.",
    href: "/produkter?kategori=butikk",
    image: "https://reolconsult.no/wp-content/uploads/2022/11/Dagligvare-Foodora.jpg",
    span: "",
  },
  {
    title: "Verksted",
    description: "Arbeidsbenker og verktøyskap.",
    href: "/produkter?kategori=verksted",
    image: "https://reolconsult.no/wp-content/uploads/2018/08/arbeidsbord500.jpg",
    span: "",
  },
  {
    title: "Kontor",
    description: "Skrivebord, stoler og oppbevaring.",
    href: "/produkter?kategori=kontor",
    image: "https://reolconsult.no/wp-content/uploads/2018/08/projectskrivebordv.jpg",
    span: "",
  },
  {
    title: "Garderobe",
    description: "Garderobeskap og benker.",
    href: "/produkter?kategori=garderobe",
    image: "https://reolconsult.no/wp-content/uploads/2023/11/IMG_1148-scaled.jpg",
    span: "",
  },
  {
    title: "Skole & barnehage",
    description: "Hyller og skap tilpasset skoler og barnehager.",
    href: "/produkter?kategori=skole",
    image: "https://reolconsult.no/wp-content/uploads/2023/11/Skole-og-barnehage-1.jpg",
    span: "sm:col-span-2",
  },
];

export default function ProductCategories() {
  return (
    <section id="kategorier" className="bg-[#faf8f6] py-28 sm:py-36">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <AnimateOnScroll className="text-center">
          <h2 className="text-4xl font-bold tracking-tight text-primary sm:text-5xl">
            Hva trenger du?
          </h2>
          <p className="mx-auto mt-6 max-w-2xl text-lg font-light text-text-muted">
            Vi leverer komplette innredningsløsninger for alle typer virksomheter.
          </p>
        </AnimateOnScroll>

        <div className="mt-14 grid auto-rows-[180px] grid-cols-1 gap-3 sm:auto-rows-[200px] sm:grid-cols-2 md:auto-rows-[220px] md:grid-cols-4 md:gap-4">
          {categories.map((cat, i) => (
            <AnimateOnScroll key={cat.href} delay={i * 0.08} className={cat.span}>
              <Link
                href={cat.href}
                className="group relative flex h-full overflow-hidden rounded-2xl transition-all duration-500 hover:-translate-y-0.5 hover:shadow-[0_20px_50px_rgba(0,0,0,0.15)]"
              >
                {/* Background image */}
                <img
                  src={cat.image}
                  alt={cat.title}
                  className="absolute inset-0 h-full w-full object-cover transition-transform duration-700 group-hover:scale-105"
                />

                {/* Dark gradient overlay */}
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />

                {/* Content */}
                <div className="relative z-10 flex h-full w-full flex-col justify-end p-6">
                  <h3 className="text-xl font-semibold text-white sm:text-2xl">
                    {cat.title}
                  </h3>
                  <p className="mt-1 text-sm text-white/70 opacity-0 transition-all duration-300 group-hover:opacity-100">
                    {cat.description}
                  </p>
                  <div className="mt-2 flex items-center gap-1 text-sm font-medium text-white/90 opacity-0 transition-all duration-300 group-hover:opacity-100 group-hover:translate-x-1">
                    Utforsk
                    <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 4.5L21 12m0 0l-7.5 7.5M21 12H3" />
                    </svg>
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
