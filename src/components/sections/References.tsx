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
    <section className="bg-bg-light pt-6 pb-10 sm:pt-8 sm:pb-12">
      <AnimateOnScroll className="text-center mb-12" variant="fadeIn">
        <p className="text-xs font-semibold uppercase tracking-[0.2em] text-text-muted">
          {eyebrow}
        </p>
      </AnimateOnScroll>

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
              className="mx-3 flex h-14 shrink-0 items-center justify-center rounded-xl border border-border bg-white px-10"
            >
              {item.logo ? (
                <Image
                  src={item.logo}
                  alt={item.name}
                  width={120}
                  height={40}
                  className="max-h-10 max-w-full object-contain opacity-70"
                  unoptimized
                />
              ) : (
                <span className="text-sm font-semibold tracking-wide text-text-muted/60 whitespace-nowrap">
                  {item.name}
                </span>
              )}
            </div>
          ))}
        </div>
      </div>

      <AnimateOnScroll delay={0.2}>
        <div className="mt-10 text-center">
          <a
            href="/referanser"
            className="group inline-flex items-center gap-2 text-sm font-medium text-primary transition-all duration-200 hover:gap-3"
          >
            Se alle referanser
            <svg className="h-4 w-4 transition-transform duration-300 group-hover:translate-x-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 4.5L21 12m0 0l-7.5 7.5M21 12H3" />
            </svg>
          </a>
        </div>
      </AnimateOnScroll>
    </section>
  );
}
