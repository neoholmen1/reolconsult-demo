import type { Metadata } from "next";
import AnimateOnScroll from "@/components/AnimateOnScroll";
import { getCurrentSite, getSiteSettingsOrFallback, formatPhoneLink } from "@/lib/site";
import { getPageSections, getSectionField } from "@/lib/cms";

export const metadata: Metadata = {
  title: "Kataloger – Reol-Consult AS",
  description:
    "Bla gjennom produktkataloger fra Reol-Consult digitalt: butikkinnredning, disker, hjul, miljøsikring og verkstedinnredning.",
};

const kataloger = [
  {
    title: "Butikkinnredning",
    description: "Komplett produktkatalog for butikkinnredning — gondoler, veggsystemer og tilbehør.",
    href: "/kataloger/butikkinnredning.pdf",
  },
  {
    title: "Disker",
    description: "Kassedisker, betjeningsdisker og skranker — se alle muligheter.",
    href: "/kataloger/disker.pdf",
  },
  {
    title: "Hjulkatalog",
    description: "Hjul og trinser for alle bruksområder.",
    href: "https://viewer.zmags.com/publication/905cc178#/905cc178/1",
  },
  {
    title: "Miljø & Lastsikring",
    description: "Oppsamlingskar, spillbarrierer og utstyr for sikker lasting.",
    href: "https://viewer.zmags.com/publication/76b6daa8#/76b6daa8/1",
  },
  {
    title: "Gigant Arbeidsplasskatalog",
    description: "Arbeidsbord, verktøyskap og verkstedinnredning.",
    href: "https://viewer.zmags.com/publication/f98e993c#/f98e993c/1",
  },
];

function PdfIcon() {
  return (
    <svg className="h-10 w-10 text-accent" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.5}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 14.25v-2.625a3.375 3.375 0 00-3.375-3.375h-1.5A1.125 1.125 0 0113.5 7.125v-1.5a3.375 3.375 0 00-3.375-3.375H8.25m2.25 0H5.625c-.621 0-1.125.504-1.125 1.125v17.25c0 .621.504 1.125 1.125 1.125h12.75c.621 0 1.125-.504 1.125-1.125V11.25a9 9 0 00-9-9z" />
    </svg>
  );
}

export default async function Kataloger() {
  const site = await getCurrentSite();
  const [settings, sections] = await Promise.all([
    getSiteSettingsOrFallback(site?.id ?? null),
    site ? getPageSections(site.id, "kataloger") : Promise.resolve([]),
  ]);

  const eyebrow = getSectionField(sections, "intro", "eyebrow", "Dokumenter");
  const introTitle = getSectionField(sections, "intro", "title", "Kataloger");
  const introBody = getSectionField(
    sections,
    "intro",
    "body",
    "Bla gjennom våre produktkataloger digitalt, eller kontakt oss for å få tilsendt trykte brosjyrer.",
  );
  const ctaTitle = getSectionField(sections, "cta_final", "title", "Ønsker du trykte brosjyrer?");
  const ctaBody = getSectionField(
    sections,
    "cta_final",
    "body",
    "Kontakt oss for å få tilsendt produktbrosjyrer i posten.",
  );

  return (
    <div>
      <section className="pb-16 sm:pb-20">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <AnimateOnScroll className="text-center">
            <p className="text-sm font-semibold uppercase tracking-[0.2em] text-accent">{eyebrow}</p>
            <h1 className="mt-4 text-3xl font-bold tracking-tight text-primary sm:text-4xl md:text-5xl">
              {introTitle}
            </h1>
            <p className="mx-auto mt-6 max-w-2xl text-lg text-text-muted whitespace-pre-line">
              {introBody}
            </p>
          </AnimateOnScroll>
        </div>
      </section>

      {/* Grid */}
      <section className="bg-bg-light py-20 sm:py-28">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {kataloger.map((katalog, i) => (
              <AnimateOnScroll key={katalog.title} delay={i * 0.08}>
                <a
                  href={katalog.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="group flex h-full flex-col rounded-2xl border border-border bg-white p-8 transition-all duration-300 hover:-translate-y-1 hover:shadow-[0_20px_50px_rgba(0,0,0,0.08)]"
                >
                  <div className="mb-5 flex h-14 w-14 items-center justify-center rounded-xl bg-accent/5">
                    <PdfIcon />
                  </div>
                  <h3 className="text-lg font-semibold text-primary">{katalog.title}</h3>
                  <p className="mt-2 flex-1 text-sm leading-relaxed text-text-muted">
                    {katalog.description}
                  </p>
                  <div className="mt-6 inline-flex items-center gap-1.5 text-sm font-semibold text-accent transition-all duration-300 group-hover:gap-2.5">
                    Åpne katalog
                    <svg className="h-4 w-4 transition-transform duration-300 group-hover:translate-x-1" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 4.5L21 12m0 0l-7.5 7.5M21 12H3" />
                    </svg>
                  </div>
                </a>
              </AnimateOnScroll>
            ))}
          </div>
        </div>
      </section>

      {/* Brosjyre CTA */}
      <section className="bg-white py-24 sm:py-32">
        <div className="mx-auto max-w-3xl px-4 text-center sm:px-6 lg:px-8">
          <AnimateOnScroll>
            <h2 className="text-3xl font-bold tracking-tight text-primary sm:text-4xl">{ctaTitle}</h2>
            <p className="mt-4 text-lg text-text-muted whitespace-pre-line">{ctaBody}</p>
            <div className="mt-10 flex flex-col items-center gap-3 sm:flex-row sm:justify-center sm:gap-4">
              <a
                href={formatPhoneLink(settings.phone)}
                className="w-full sm:w-auto rounded-full bg-accent px-8 py-4 text-center text-base font-semibold text-white transition-all duration-300 hover:bg-accent-hover hover:shadow-lg active:translate-y-[1px]"
              >
                Ring {settings.phone ?? "33 36 55 80"}
              </a>
              <a
                href={`mailto:${settings.email_general ?? "mail@reolconsult.no"}?subject=${encodeURIComponent("Jeg ønsker tilsendt en produktbrosjyre")}`}
                className="w-full sm:w-auto rounded-full border border-primary/20 px-8 py-4 text-center text-base font-semibold text-primary transition-all duration-300 hover:bg-primary hover:text-white active:translate-y-[1px]"
              >
                Send e-post
              </a>
            </div>
          </AnimateOnScroll>
        </div>
      </section>
    </div>
  );
}
