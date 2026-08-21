import Image from "next/image";
import AnimateOnScroll from "@/components/AnimateOnScroll";
import { getCurrentSite } from "@/lib/site";
import { getClientLogos, getPageSections, getSectionField } from "@/lib/cms";

const FALLBACK_CLIENTS = [
  "Nortura", "Floyd by Smith", "Foodora Market", "Nordisk Aviation Products",
  "Tilbords", "Rheinmetall Defence", "Cemo Gourmet", "TESS",
  "ASKO", "Diplomat", "Findus", "Solar",
];

export default async function References() {
  const site = await getCurrentSite();
  const [logos, sections] = await Promise.all([
    site ? getClientLogos(site.id) : Promise.resolve([]),
    site ? getPageSections(site.id, "home") : Promise.resolve([]),
  ]);

  const eyebrow = getSectionField(
    sections,
    "references_intro",
    "eyebrow",
    "Et utvalg av kunder vi har levert til",
  );

  const items =
    logos.length > 0
      ? logos.map((l) => ({ key: l.id, name: l.name, logo: l.logo_url }))
      : FALLBACK_CLIENTS.map((name, i) => ({ key: `fb-${i}`, name, logo: null as string | null }));

  // Repeat for marquee continuity
  const repeated = [...items, ...items, ...items, ...items];

  return (
    <section className="bg-surface dark:bg-[#0b0c0f]/55 dark:backdrop-blur-md py-20 md:py-28">
      <div className="mx-auto max-w-6xl px-4 sm:px-6">
        <AnimateOnScroll className="mb-12 text-center md:mb-16" variant="fadeIn">
          <p className="text-[13px] font-medium tracking-tight text-text-dark/80 dark:text-white/80">
            {eyebrow}
          </p>
          <p className="mt-1.5 text-xs text-text-muted dark:text-white/65">
            Vi leverer til bedrifter i hele Norge
          </p>
        </AnimateOnScroll>
      </div>

      <div
        className="overflow-hidden"
        style={{
          maskImage: "linear-gradient(to right, transparent, black 8%, black 92%, transparent)",
          WebkitMaskImage: "linear-gradient(to right, transparent, black 8%, black 92%, transparent)",
        }}
      >
        <div className="flex w-max animate-marquee">
          {repeated.map((item, i) => (
            <div
              key={`${item.key}-${i}`}
              className="group mx-2 flex h-16 w-[180px] shrink-0 items-center justify-center px-6"
            >
              {item.logo ? (
                <Image
                  src={item.logo}
                  alt={item.name}
                  width={120}
                  height={40}
                  className="max-h-8 max-w-full object-contain opacity-50 grayscale transition duration-300 group-hover:opacity-100 group-hover:grayscale-0"
                />
              ) : (
                <span className="text-[13px] font-semibold tracking-wide text-text-muted dark:text-white/65 whitespace-nowrap transition-colors duration-300 group-hover:text-primary dark:group-hover:text-white">
                  {item.name}
                </span>
              )}
            </div>
          ))}
        </div>
      </div>

      <AnimateOnScroll className="mt-12 text-center md:mt-16" delay={0.2}>
        <a
          href="/referanser"
          className="group inline-flex items-center gap-2 text-sm font-medium text-primary dark:text-white transition duration-200 hover:gap-3"
        >
          Se alle referanser
          <svg className="h-4 w-4 transition-transform duration-300 group-hover:translate-x-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 4.5L21 12m0 0l-7.5 7.5M21 12H3" />
          </svg>
        </a>
      </AnimateOnScroll>
    </section>
  );
}
