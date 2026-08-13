import Link from "next/link";
import AnimateOnScroll from "@/components/AnimateOnScroll";
import {
  getCurrentSite,
  getSiteSettingsOrFallback,
  formatPhoneLink,
} from "@/lib/site";
import { getPageSections, getSectionField } from "@/lib/cms";

export default async function CTASection() {
  const site = await getCurrentSite();
  const [settings, sections] = await Promise.all([
    getSiteSettingsOrFallback(site?.id ?? null),
    site ? getPageSections(site.id, "home") : Promise.resolve([]),
  ]);

  const title = getSectionField(sections, "cta_final", "title", "Trenger du innredning?");
  const body = getSectionField(
    sections,
    "cta_final",
    "body",
    "Ring oss eller fyll ut skjemaet, så lager vi et tilbud tilpasset ditt behov.",
  );

  return (
    <section className="relative overflow-hidden bg-surface dark:bg-[#0b0c0f]/55 dark:backdrop-blur-md py-20 md:py-28">
      <div className="pointer-events-none absolute left-1/2 top-1/2 -z-0 h-[420px] w-[680px] max-w-[90%] -translate-x-1/2 -translate-y-1/2 rounded-full bg-[radial-gradient(circle,rgba(220,38,38,0.05),transparent_70%)] blur-2xl" />
      <div className="relative mx-auto max-w-3xl px-4 sm:px-6 lg:px-8">
        <AnimateOnScroll className="text-center">
          <h2 className="font-display text-[2.25rem] font-semibold tracking-[-0.02em] text-primary dark:text-white md:text-[3.25rem]" style={{ lineHeight: 1.05 }}>
            {title}
          </h2>
          <p className="mx-auto mt-4 max-w-2xl text-base leading-relaxed text-text-muted dark:text-white/65 md:text-lg whitespace-pre-line">
            {body}
          </p>
          <div className="mt-10 flex w-full flex-col items-center gap-3 sm:flex-row sm:justify-center sm:gap-4">
            <Link
              href="/kontakt"
              className="w-full sm:w-auto rounded-full bg-accent px-10 py-4 text-center text-base font-semibold text-white shadow-[0_1px_2px_rgba(220,38,38,0.15)] transition duration-200 hover:bg-accent-hover hover:shadow-[0_8px_24px_rgba(220,38,38,0.25)] active:translate-y-[1px]"
            >
              Kontakt oss
            </Link>
            {settings.phone && (
              <a
                href={formatPhoneLink(settings.phone)}
                className="w-full sm:w-auto rounded-full border border-primary/20 text-primary hover:bg-primary hover:text-white dark:border-white/25 dark:text-white dark:hover:bg-white dark:hover:text-[#0b0c0f] px-10 py-4 text-center text-base font-semibold transition duration-200 active:translate-y-[1px]"
              >
                Ring {settings.phone}
              </a>
            )}
          </div>
          {settings.visit_address && (
            <p className="mt-8 text-sm text-text-muted dark:text-white/65">
              Eller besøk utstillingen vår: {settings.visit_address}
            </p>
          )}
        </AnimateOnScroll>
      </div>
    </section>
  );
}
