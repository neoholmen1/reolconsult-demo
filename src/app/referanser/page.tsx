import type { Metadata } from "next";
import Image from "next/image";
import AnimateOnScroll from "@/components/AnimateOnScroll";
import { getCurrentSite, getSiteSettingsOrFallback, formatPhoneLink } from "@/lib/site";
import {
  getCaseStudies,
  getClientLogos,
  getPageSections,
  getSectionField,
  type CaseStudy,
  type ClientLogo,
} from "@/lib/cms";

export const metadata: Metadata = {
  title: "Referanser – Reol-Consult AS",
  description:
    "Se noen av kundene som har valgt Reol-Consult for sine innredningsløsninger.",
};

const FALLBACK_CASES: CaseStudy[] = [
  { id: "1", customer_name: "Hekta På Tur", project_type: "Pallreoler", description: "", year: "", image_url: "https://reolconsult.no/wp-content/uploads/2022/11/Hekta-Pa-Tur-2-scaled.jpg" },
  { id: "2", customer_name: "Foodora Market", project_type: "Butikk- og lagerinnredning", description: "", year: "", image_url: "https://reolconsult.no/wp-content/uploads/2022/11/Dagligvare-Foodora.jpg" },
  { id: "3", customer_name: "Vrengen Maritime", project_type: "Disk og butikkinnredning", description: "", year: "", image_url: "https://reolconsult.no/wp-content/uploads/2022/11/Disk-Vrengen-Maritime-1-1-scaled.jpg" },
  { id: "4", customer_name: "Floyd by Smith", project_type: "Mesaninløsning", description: "", year: "", image_url: "https://reolconsult.no/wp-content/uploads/2022/11/Floyd-april-2022-3.jpg" },
  { id: "5", customer_name: "TESS Elverum", project_type: "Disk og butikkinnredning", description: "", year: "", image_url: "https://reolconsult.no/wp-content/uploads/2022/11/Disk-TESS-Elverum.jpg" },
  { id: "6", customer_name: "Mandal Maritime", project_type: "Disk og butikkinnredning", description: "", year: "", image_url: "https://reolconsult.no/wp-content/uploads/2022/11/Disk-Mandal-Maritime-1-002-scaled.jpg" },
];

const FALLBACK_LOGOS: ClientLogo[] = [
  { id: "1", name: "Nortura", logo_url: "https://reolconsult.no/wp-content/uploads/2018/08/23226ae2_d07d_451c_abd1_fa5e50fef0f6-380x126-resize.jpg" },
  { id: "2", name: "Floyd by Smith", logo_url: "https://reolconsult.no/wp-content/uploads/2018/08/552fb566_6481_410d_b76c_e37af2eb5884-380x83-resize.png" },
  { id: "3", name: "Foodora Market", logo_url: "https://reolconsult.no/wp-content/uploads/2022/11/Foodora.png" },
  { id: "4", name: "Nordisk Aviation Products", logo_url: "https://reolconsult.no/wp-content/uploads/2018/08/3ad43556_013c_425e_86c0_f2fd844cde45-358x56-resize.jpg" },
  { id: "5", name: "Tilbords", logo_url: "https://reolconsult.no/wp-content/uploads/2018/08/4dcb4aa1_91b1_4d43_8df3_3d2f998838d2.jpg" },
  { id: "6", name: "Rheinmetall Defence", logo_url: "https://reolconsult.no/wp-content/uploads/2018/08/93c39b25_6a32_4f9b_98f3_1886fc4dbffe-380x65-resize.jpg" },
  { id: "7", name: "Cemo Gourmet", logo_url: "https://reolconsult.no/wp-content/uploads/2018/08/cemogourmet_cmyk-380x89-resize.jpg" },
  { id: "8", name: "TESS", logo_url: "https://reolconsult.no/wp-content/uploads/2018/08/ff3538c2_96c8_4082_9668_40d1f8f952bb-380x41-resize.png" },
  { id: "9", name: "ASKO", logo_url: "https://reolconsult.no/wp-content/uploads/2018/08/97ae76fb-60c7-4702-9d28-d4eeced6cd31-380x53-resize.jpg" },
  { id: "10", name: "Diplomat", logo_url: "https://reolconsult.no/wp-content/uploads/2018/08/4598e373_77ac_4336_bfba_85d17a33b1ad-380x80-resize.jpg" },
  { id: "11", name: "Findus", logo_url: "https://reolconsult.no/wp-content/uploads/2018/08/0aea0788-8358-4cc5-8041-8ad3e331a2ea-380x163-resize.png" },
  { id: "12", name: "Solar", logo_url: "https://reolconsult.no/wp-content/uploads/2018/08/f39f4f7a_bfdc_492e_9d0c_b57f5cb2847b-380x127-resize.jpg" },
];

export default async function Referanser() {
  const site = await getCurrentSite();
  const [settings, casesFromDb, logosFromDb, sections] = await Promise.all([
    getSiteSettingsOrFallback(site?.id ?? null),
    site ? getCaseStudies(site.id) : Promise.resolve([]),
    site ? getClientLogos(site.id) : Promise.resolve([]),
    site ? getPageSections(site.id, "referanser") : Promise.resolve([]),
  ]);

  const cases = casesFromDb.length > 0 ? casesFromDb : FALLBACK_CASES;
  const logos = logosFromDb.length > 0 ? logosFromDb : FALLBACK_LOGOS;

  const eyebrow = getSectionField(sections, "intro", "eyebrow", "Referanser");
  const title = getSectionField(sections, "intro", "title", "Noen av våre kunder");
  const body = getSectionField(
    sections,
    "intro",
    "body",
    "Vi har levert innredning til alt fra dagligvarebutikker til maritime butikker, lager og verksteder over hele landet. Her er et utvalg.",
  );
  const casesTitle = getSectionField(sections, "cases", "title", "Utvalgte prosjekter");
  const logosTitle = getSectionField(sections, "logos", "title", "Et utvalg av kunder vi har levert til");
  const ctaTitle = getSectionField(sections, "cta_final", "title", "Vurderer du oss til ditt prosjekt?");
  const ctaBody = getSectionField(
    sections,
    "cta_final",
    "body",
    "Uansett om du trenger innredning til butikk, lager, kontor eller verksted — vi finner løsningen for deg.",
  );

  return (
    <div>
      <section className="bg-bg-light pt-8 pb-16 sm:pt-20 sm:pb-24">
        <div className="mx-auto max-w-6xl px-4 sm:px-6">
          <AnimateOnScroll>
            <span className="text-sm font-semibold uppercase tracking-[0.2em] text-accent">
              {eyebrow}
            </span>
            <h1 className="mt-4 text-3xl font-bold leading-tight tracking-tight text-primary sm:text-4xl md:text-5xl">
              {title}
            </h1>
            <p className="mt-6 max-w-2xl text-lg leading-relaxed text-text-muted whitespace-pre-line">
              {body}
            </p>
          </AnimateOnScroll>
        </div>
      </section>

      <section className="bg-white py-16 sm:py-24">
        <div className="mx-auto max-w-6xl px-4 sm:px-6">
          <AnimateOnScroll>
            <h2 className="text-2xl font-bold tracking-tight text-primary md:text-3xl">{casesTitle}</h2>
          </AnimateOnScroll>

          <div className="mt-10 grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {cases.map((c, i) => (
              <AnimateOnScroll key={c.id} delay={i * 0.06}>
                <div className="group overflow-hidden rounded-2xl border border-border bg-white transition-all duration-300 hover:-translate-y-0.5 hover:shadow-[0_20px_50px_rgba(0,0,0,0.08)]">
                  {c.image_url && (
                    <div className="relative aspect-[4/3] overflow-hidden bg-bg-light">
                      <Image
                        src={c.image_url}
                        alt={`${c.customer_name} – ${c.project_type}`}
                        fill
                        sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                        className="object-cover transition-transform duration-500 group-hover:scale-[1.03]"
                        unoptimized
                      />
                    </div>
                  )}
                  <div className="p-5">
                    {c.project_type && (
                      <p className="text-xs font-semibold uppercase tracking-[0.15em] text-accent">{c.project_type}</p>
                    )}
                    <h3 className="mt-1 text-lg font-semibold text-primary">{c.customer_name}</h3>
                    {c.description && (
                      <p className="mt-2 text-sm text-text-muted line-clamp-3">{c.description}</p>
                    )}
                  </div>
                </div>
              </AnimateOnScroll>
            ))}
          </div>
        </div>
      </section>

      <section className="bg-bg-light py-16 sm:py-24">
        <div className="mx-auto max-w-6xl px-4 sm:px-6">
          <AnimateOnScroll>
            <h2 className="text-2xl font-bold tracking-tight text-primary md:text-3xl">{logosTitle}</h2>
          </AnimateOnScroll>
          <div className="mt-10 grid grid-cols-2 gap-6 sm:grid-cols-3 lg:grid-cols-4">
            {logos.map((ref, i) => (
              <AnimateOnScroll key={ref.id} delay={i * 0.06}>
                <div className="flex aspect-[3/2] items-center justify-center rounded-2xl border border-border bg-white p-4 sm:p-8 transition-all duration-300 hover:-translate-y-0.5 hover:shadow-[0_20px_50px_rgba(0,0,0,0.08)]">
                  <Image
                    src={ref.logo_url}
                    alt={ref.name}
                    width={200}
                    height={64}
                    className="max-h-16 max-w-full object-contain opacity-70 transition-opacity duration-300 hover:opacity-100"
                    unoptimized
                  />
                </div>
              </AnimateOnScroll>
            ))}
          </div>
        </div>
      </section>

      <section className="bg-bg-light py-16 sm:py-24">
        <div className="mx-auto max-w-3xl px-6 text-center">
          <AnimateOnScroll>
            <h2 className="text-3xl font-bold tracking-tight text-primary md:text-4xl">{ctaTitle}</h2>
            <p className="mx-auto mt-4 max-w-lg text-lg text-text-muted whitespace-pre-line">{ctaBody}</p>
            <div className="mt-8 flex flex-wrap justify-center gap-4">
              <a
                href="/kontakt"
                className="inline-flex items-center gap-2 rounded-full bg-accent px-7 py-3.5 font-semibold text-white transition-all duration-300 hover:bg-accent-hover hover:shadow-lg active:translate-y-[1px]"
              >
                Få et uforpliktende tilbud
              </a>
              <a
                href={formatPhoneLink(settings.phone)}
                className="inline-flex items-center gap-2 rounded-full border-2 border-primary/20 px-7 py-3.5 font-semibold text-primary transition-all duration-300 hover:border-primary/40 hover:bg-primary/5 active:translate-y-[1px]"
              >
                Ring {settings.phone ?? "33 36 55 80"}
              </a>
            </div>
          </AnimateOnScroll>
        </div>
      </section>
    </div>
  );
}
