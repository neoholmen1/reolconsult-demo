import Link from "next/link";
import Image from "next/image";
import AnimateOnScroll from "@/components/AnimateOnScroll";
import Parallax from "@/components/motion/Parallax";
import { getCurrentSite } from "@/lib/site";
import { getPageSections, getSectionField } from "@/lib/cms";

const FALLBACK_IMAGE =
  "https://reolconsult.no/wp-content/uploads/2023/11/Pallreoler-stigebeskyttere-021120101167.jpg";

const punkter = [
  "Visuell inspeksjon av alle reol-komponenter",
  "Grønn/gul/rød merking etter NS-EN 15635",
  "Skriftlig rapport med foto og anbefalinger",
  "Vi dekker hele Østlandet — fast rute eller på kort varsel",
];

export default async function ReolkontrollSection() {
  const site = await getCurrentSite();
  const sections = site ? await getPageSections(site.id, "home") : [];

  const eyebrow = getSectionField(sections, "reolkontroll", "eyebrow", "Sikkerhetskontroll");
  const title = getSectionField(sections, "reolkontroll", "title", "Vi sjekker reolene dine årlig");
  const body = getSectionField(
    sections,
    "reolkontroll",
    "body",
    "Alle virksomheter med lagerreoler er pålagt regelmessig sikkerhetskontroll. Vi utfører profesjonell HMS-inspeksjon og gir deg en skriftlig rapport på hva som må utbedres — så du har dokumentasjonen i orden.",
  );
  const imageUrl = getSectionField(sections, "reolkontroll", "image_url", FALLBACK_IMAGE);

  return (
    <section className="bg-primary dark:bg-[#0b0c0f]/55 dark:backdrop-blur-md py-20 md:py-28">
      <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 items-center gap-12 lg:grid-cols-2 lg:gap-16">
          <AnimateOnScroll>
            <p className="inline-flex items-center gap-2 rounded-full bg-accent/20 border border-white/10 px-3 py-1 text-xs font-semibold uppercase tracking-[0.15em] text-accent">
              <span className="h-1.5 w-1.5 rounded-full bg-accent" />
              {eyebrow}
            </p>
            <h2 className="font-display mt-5 text-[2rem] font-semibold leading-[1.08] tracking-[-0.02em] text-white md:text-5xl">
              {title}
            </h2>
            <p className="mt-5 max-w-xl text-base leading-relaxed text-white/70 md:text-lg">
              {body}
            </p>

            <ul className="mt-8 space-y-3">
              {punkter.map((punkt) => (
                <li key={punkt} className="flex items-start gap-3">
                  <span className="mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-accent/20 text-accent border border-white/10">
                    <svg className="h-3 w-3" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M4.5 12.75l6 6 9-13.5" />
                    </svg>
                  </span>
                  <span className="text-[15px] leading-snug text-white/85">{punkt}</span>
                </li>
              ))}
            </ul>

            <div className="mt-10 flex flex-col gap-3 sm:flex-row sm:gap-4">
              <Link
                href="/kontakt"
                className="inline-flex items-center justify-center gap-2 rounded-full bg-accent px-7 py-3.5 font-semibold text-white shadow-[0_1px_2px_rgba(220,38,38,0.2)] transition duration-300 hover:bg-accent-hover hover:shadow-[0_8px_24px_rgba(220,38,38,0.35)] active:translate-y-[1px]"
              >
                Få sikkerhetskontroll
                <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.25}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 4.5 21 12m0 0-7.5 7.5M21 12H3" />
                </svg>
              </Link>
              <Link
                href="/produkter/lager"
                className="inline-flex items-center justify-center gap-2 rounded-full border border-white/25 px-7 py-3.5 font-medium text-white transition duration-300 hover:bg-white/10 active:translate-y-[1px]"
              >
                Les mer
              </Link>
            </div>
          </AnimateOnScroll>

          <AnimateOnScroll delay={0.2}>
            <div className="relative aspect-[4/3] overflow-hidden rounded-[1.5rem] shadow-[0_30px_60px_rgba(0,0,0,0.35)] ring-1 ring-white/10 sm:rounded-[2rem]">
              <Parallax className="absolute -inset-y-[9%] inset-x-0" distance={90}>
                <Image
                  src={imageUrl}
                  alt="Sikkerhetskontroll av pallreoler"
                  fill
                  sizes="(max-width: 1024px) 100vw, 50vw"
                  className="object-cover"
                  unoptimized
                  quality={90}
                />
              </Parallax>
              {/* Hjørne-badge */}
              <div className="absolute left-5 top-5 inline-flex items-center gap-2 rounded-full bg-white/95 px-3.5 py-1.5 text-[11px] font-semibold uppercase tracking-[0.12em] text-primary shadow-[0_4px_12px_rgba(0,0,0,0.15)] backdrop-blur">
                <span className="h-1.5 w-1.5 rounded-full bg-emerald-500" />
                HMS-godkjent
              </div>
            </div>
          </AnimateOnScroll>
        </div>
      </div>
    </section>
  );
}
