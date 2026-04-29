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
    <section className="bg-bg-light pt-10 pb-10 sm:pt-12 sm:pb-12">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <AnimateOnScroll className="text-center">
          <h2 className="text-3xl font-bold tracking-tight text-primary sm:text-5xl md:text-6xl">
            {title}
          </h2>
          <p className="mx-auto mt-6 max-w-2xl text-lg text-text-muted sm:text-xl whitespace-pre-line">
            {body}
          </p>
          <div className="mt-10 sm:mt-12 flex flex-col items-center gap-3 sm:flex-row sm:justify-center sm:gap-4">
            <Link
              href="/kontakt"
              className="w-full sm:w-auto rounded-full bg-accent px-10 py-4 text-center text-base font-semibold text-white transition-all duration-200 hover:bg-accent-hover hover:shadow-lg active:translate-y-[1px]"
            >
              Kontakt oss
            </Link>
            {settings.phone && (
              <a
                href={formatPhoneLink(settings.phone)}
                className="w-full sm:w-auto rounded-full border border-primary/20 px-10 py-4 text-center text-base font-semibold text-primary transition-all duration-200 hover:bg-primary hover:text-white active:translate-y-[1px]"
              >
                Ring {settings.phone}
              </a>
            )}
          </div>
          {settings.visit_address && (
            <p className="mt-10 text-sm text-text-muted">
              Eller besøk utstillingen vår: {settings.visit_address}
            </p>
          )}
        </AnimateOnScroll>
      </div>
    </section>
  );
}
