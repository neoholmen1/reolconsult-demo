import Link from "next/link";
import AnimateOnScroll from "@/components/AnimateOnScroll";
import { getCurrentSite } from "@/lib/site";
import { getPageSections, getSectionField } from "@/lib/cms";

export default async function UsedSalesTeaser() {
  const site = await getCurrentSite();
  const sections = site ? await getPageSections(site.id, "home") : [];

  const text = getSectionField(
    sections,
    "used_sales_teaser",
    "title",
    "Vi har også brukte reoler og innredning til gode priser",
  );
  const ctaLabel = getSectionField(sections, "used_sales_teaser", "cta_label", "Se bruktsalg");

  return (
    <section className="bg-surface dark:bg-[#0b0c0f]/55 dark:backdrop-blur-md py-12 md:py-16">
      <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
        <AnimateOnScroll>
          <Link
            href="/bruktsalg"
            className="group flex flex-col items-start gap-4 rounded-3xl bg-surface border border-border shadow-[var(--shadow-soft)] dark:bg-white/[0.05] dark:border-white/10 dark:backdrop-blur-xl dark:shadow-[inset_0_1px_0_rgba(255,255,255,0.16),0_20px_50px_-20px_rgba(0,0,0,0.65)] p-6 transition duration-200 hover:-translate-y-1 hover:border-accent/30 hover:shadow-[var(--shadow-lift)] dark:hover:bg-white/[0.08] sm:flex-row sm:items-center sm:justify-between sm:p-7"
          >
            <div className="flex items-center gap-4">
              <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-accent/10 text-accent border border-border dark:bg-accent/20 dark:border-white/10 transition-colors duration-200 group-hover:bg-accent group-hover:text-white">
                <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.75}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M9 17.25v1.007a3 3 0 0 1-.879 2.122L7.5 21h9l-.621-.621A3 3 0 0 1 15 18.257V17.25m6-12V15a2.25 2.25 0 0 1-2.25 2.25H5.25A2.25 2.25 0 0 1 3 15V5.25m18 0A2.25 2.25 0 0 0 18.75 3H5.25A2.25 2.25 0 0 0 3 5.25m18 0V12a2.25 2.25 0 0 1-2.25 2.25H5.25A2.25 2.25 0 0 1 3 12V5.25" />
                </svg>
              </div>
              <p className="text-[15px] font-medium leading-snug text-primary dark:text-white md:text-base">
                {text}
              </p>
            </div>

            <span className="inline-flex items-center gap-1.5 self-stretch rounded-full bg-bg-light text-primary dark:bg-white/10 dark:text-white px-4 py-2 text-sm font-semibold transition-all duration-200 group-hover:gap-2.5 group-hover:bg-primary group-hover:text-white sm:self-auto">
              {ctaLabel}
              <svg className="h-3.5 w-3.5 transition-transform duration-200" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.25}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 4.5L21 12m0 0l-7.5 7.5M21 12H3" />
              </svg>
            </span>
          </Link>
        </AnimateOnScroll>
      </div>
    </section>
  );
}
