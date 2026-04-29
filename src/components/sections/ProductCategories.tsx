import Link from "next/link";
import Image from "next/image";
import AnimateOnScroll from "@/components/AnimateOnScroll";
import { getCurrentSite } from "@/lib/site";
import {
  getCategories,
  getPageSections,
  getSectionField,
  type Category,
} from "@/lib/cms";

const FALLBACK_CATEGORIES: Category[] = [
  { id: "1", slug: "lager", title: "Lagerinnredning", description: "Pallreoler, stålhyller og mesanin", hero_image_url: "https://reolconsult.no/wp-content/uploads/2022/11/Hekta-Pa-Tur-2-scaled.jpg" },
  { id: "2", slug: "butikk", title: "Butikkinnredning", description: "Gondoler, disker og tilbehør", hero_image_url: "https://reolconsult.no/wp-content/uploads/2022/11/Dagligvare-Foodora.jpg" },
  { id: "3", slug: "verksted", title: "Verksted & Industri", description: "Arbeidsbord, verktøyskap og løfteutstyr", hero_image_url: "https://reolconsult.no/wp-content/uploads/2022/11/Mesanin-6-scaled.jpeg" },
  { id: "4", slug: "kontor", title: "Kontor", description: "Skrivebord, stoler og oppbevaring", hero_image_url: "https://reolconsult.no/wp-content/uploads/2018/08/projectskrivebordv.jpg" },
  { id: "5", slug: "garderobe", title: "Garderobe", description: "Garderobeskap og ladeskap", hero_image_url: "https://reolconsult.no/wp-content/uploads/2023/11/IMG_1148-scaled.jpg" },
  { id: "6", slug: "skole", title: "Skole & barnehage", description: "Innredning for alle aldre", hero_image_url: "https://reolconsult.no/wp-content/uploads/2023/11/Skole-og-barnehage-1.jpg" },
];

export default async function ProductCategories() {
  const site = await getCurrentSite();
  const [categoriesFromDb, sections] = await Promise.all([
    site ? getCategories(site.id) : Promise.resolve([] as Category[]),
    site ? getPageSections(site.id, "home") : Promise.resolve([]),
  ]);

  const categories = categoriesFromDb.length > 0 ? categoriesFromDb : FALLBACK_CATEGORIES;
  const eyebrow = getSectionField(sections, "hva_trenger_du", "eyebrow", "Våre kategorier");
  const title = getSectionField(sections, "hva_trenger_du", "title", "Hva trenger du?");
  const subtitle = getSectionField(
    sections,
    "hva_trenger_du",
    "subtitle",
    "Vi leverer komplette innredningsløsninger for alle typer virksomheter.",
  );

  return (
    <section id="kategorier" className="bg-bg-light pt-10 pb-12 sm:pt-12 sm:pb-14">
      <div className="mx-auto max-w-[1200px] px-4 sm:px-6">
        <AnimateOnScroll className="text-center">
          <p className="text-xs font-semibold uppercase tracking-[0.2em] text-accent">
            {eyebrow}
          </p>
          <h2 className="mt-4 text-3xl font-bold tracking-tight text-primary sm:text-4xl md:text-5xl">
            {title}
          </h2>
          <p className="mx-auto mt-5 max-w-2xl text-lg text-text-muted">{subtitle}</p>
        </AnimateOnScroll>

        <div className="mt-12 sm:mt-16 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {categories.map((cat, i) => (
            <AnimateOnScroll key={cat.slug} delay={i * 0.08}>
              <Link
                href={`/produkter/${cat.slug}`}
                className="group relative block aspect-[3/2] overflow-hidden rounded-2xl shadow-[0_2px_12px_rgba(0,0,0,0.08)] transition-all duration-500 hover:shadow-[0_12px_40px_rgba(0,0,0,0.15)]"
              >
                {cat.hero_image_url && (
                  <Image
                    src={cat.hero_image_url}
                    alt={cat.title}
                    fill
                    sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 350px"
                    className="object-cover transition-transform duration-600 ease-out group-hover:scale-[1.04]"
                    unoptimized
                  />
                )}
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/20 to-transparent" />

                <div className="absolute bottom-0 left-0 right-0 p-5">
                  <div className="flex items-end justify-between">
                    <div>
                      <h3 className="text-[19px] font-bold text-white">{cat.title}</h3>
                      {cat.description && (
                        <p className="mt-0.5 text-[13px] text-white/80">{cat.description}</p>
                      )}
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
