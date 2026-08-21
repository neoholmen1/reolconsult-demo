import Link from "next/link";
import Image from "next/image";
import AnimateOnScroll from "@/components/AnimateOnScroll";
import TiltCard from "@/components/motion/TiltCard";
import { getCurrentSite } from "@/lib/site";
import {
  getCategories,
  getPageSections,
  getSectionField,
  type Category,
} from "@/lib/cms";

const FALLBACK_CATEGORIES: Category[] = [
  { id: "1", slug: "lager", title: "Lagerinnredning", description: "Pallreoler, stålhyller og mesanin", hero_image_url: "https://reolconsult.no/wp-content/uploads/2022/11/Hekta-Pa-Tur-2-scaled.jpg" },
  { id: "2", slug: "butikk", title: "Butikkinnredning", description: "Gondoler, disker og tilbehør", hero_image_url: "https://reolconsult.no/wp-content/uploads/2022/11/Disk-Vrengen-Maritime-1-1-scaled.jpg" },
  { id: "3", slug: "kontor", title: "Kontor", description: "Skrivebord, stoler og oppbevaring", hero_image_url: "https://reolconsult.no/wp-content/uploads/2018/08/projectskrivebordv.jpg" },
  { id: "4", slug: "verksted", title: "Verksted og industri", description: "Arbeidsbord, verktøyskap og løfteutstyr", hero_image_url: "https://reolconsult.no/wp-content/uploads/2022/11/Mesanin-6-scaled.jpeg" },
  { id: "5", slug: "garderobe", title: "Garderobe", description: "Garderobeskap og ladeskap", hero_image_url: "https://reolconsult.no/wp-content/uploads/2023/11/IMG_1148-scaled.jpg" },
  { id: "6", slug: "skole", title: "Skole og barnehage", description: "Innredning for alle aldre", hero_image_url: "https://reolconsult.no/wp-content/uploads/2023/11/Skole-og-barnehage-1.jpg" },
];

// Forsiden viser alle kjernekategoriene i et bento-rutenett. Første flis = stor feature.
const PRIMARY_SLUGS = ["lager", "butikk", "kontor", "verksted", "garderobe", "skole"];

export default async function ProductCategories() {
  const site = await getCurrentSite();
  const [categoriesFromDb, sections] = await Promise.all([
    site ? getCategories(site.id) : Promise.resolve([] as Category[]),
    site ? getPageSections(site.id, "home") : Promise.resolve([]),
  ]);

  const allCategories = categoriesFromDb.length > 0 ? categoriesFromDb : FALLBACK_CATEGORIES;
  // Filtrer + sorter etter PRIMARY_SLUGS-rekkefølgen
  const categories = PRIMARY_SLUGS
    .map((slug) => allCategories.find((c) => c.slug === slug))
    .filter((c): c is Category => Boolean(c));

  const eyebrow = getSectionField(sections, "hva_trenger_du", "eyebrow", "Hva vi leverer");
  const title = getSectionField(sections, "hva_trenger_du", "title", "Vi innreder hele bedriften din");
  const subtitle = getSectionField(
    sections,
    "hva_trenger_du",
    "subtitle",
    "Fra første tegning til ferdig montert. Vi tar befaring, prosjekterer og leverer komplette løsninger.",
  );

  return (
    <section id="kategorier" className="bg-surface dark:bg-[#0b0c0f]/55 dark:backdrop-blur-md py-20 md:py-28">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <AnimateOnScroll className="max-w-2xl">
          <p className="inline-flex items-center gap-2.5 text-xs font-semibold uppercase tracking-[0.22em] text-accent">
            <span className="h-px w-7 bg-accent/60" />
            {eyebrow}
          </p>
          <h2 className="font-display mt-4 text-[2.25rem] font-semibold tracking-[-0.02em] text-primary dark:text-white md:text-[3.25rem]" style={{ lineHeight: 1.04 }}>
            {title}
          </h2>
          <p className="mt-4 text-base leading-relaxed text-text-muted dark:text-white/65 md:text-lg">
            {subtitle}
          </p>
        </AnimateOnScroll>

        <div className="mt-12 grid grid-cols-2 gap-4 sm:mt-16 sm:grid-cols-3 sm:auto-rows-[200px] sm:gap-5 lg:auto-rows-[240px]">
          {categories.map((cat, i) => {
            const feature = i === 0;
            return (
              <AnimateOnScroll
                key={cat.slug}
                delay={i * 0.07}
                className={feature ? "col-span-2 row-span-2" : ""}
              >
                <TiltCard className="h-full rounded-3xl" intensity={feature ? 5 : 7}>
                <Link
                  href={`/produkter/${cat.slug}`}
                  className="group relative flex h-full min-h-[200px] overflow-hidden rounded-3xl shadow-[var(--shadow-card)] ring-1 ring-black/5 transition-shadow duration-500 hover:shadow-[var(--shadow-float)]"
                >
                  {cat.hero_image_url && (
                    <Image
                      src={cat.hero_image_url}
                      alt={cat.title}
                      fill
                      sizes={feature ? "(max-width: 640px) 100vw, 66vw" : "(max-width: 640px) 50vw, 33vw"}
                      className="img-grade object-cover group-hover:scale-[1.06]"
                    />
                  )}
                  <div className="img-wash" />
                  <div className="absolute inset-0 bg-gradient-to-t from-[#0c0a09]/92 via-[#0c0a09]/30 to-transparent" />

                  {feature && (
                    <span className="absolute left-5 top-5 inline-flex items-center gap-2 rounded-full bg-accent/90 px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.12em] text-white backdrop-blur">
                      Mest etterspurt
                    </span>
                  )}

                  <div className={`absolute inset-x-0 bottom-0 ${feature ? "p-6 sm:p-7" : "p-5"}`}>
                    <h3 className={`font-bold leading-tight text-white ${feature ? "font-display text-2xl font-semibold tracking-[-0.01em] sm:text-3xl" : "text-lg"}`}>
                      {cat.title}
                    </h3>
                    {cat.description && (
                      <p className={`mt-1.5 leading-snug text-white/80 ${feature ? "text-sm sm:text-[15px]" : "hidden text-[13px] sm:block"}`}>
                        {cat.description}
                      </p>
                    )}
                    <span className="mt-3 inline-flex items-center gap-1.5 text-[12.5px] font-semibold text-white transition-all duration-300 group-hover:gap-2.5">
                      Se løsninger
                      <svg className="h-3.5 w-3.5 transition-transform duration-300 group-hover:translate-x-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.25}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
                      </svg>
                    </span>
                  </div>
                </Link>
                </TiltCard>
              </AnimateOnScroll>
            );
          })}
        </div>

        <AnimateOnScroll className="mt-10 text-center" delay={0.3}>
          <Link
            href="/produkter"
            className="group inline-flex items-center gap-2 text-sm font-semibold text-primary dark:text-white transition duration-200 hover:gap-3"
          >
            Se alle produktområder
            <svg className="h-4 w-4 transition-transform duration-300 group-hover:translate-x-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 4.5L21 12m0 0l-7.5 7.5M21 12H3" />
            </svg>
          </Link>
        </AnimateOnScroll>
      </div>
    </section>
  );
}
