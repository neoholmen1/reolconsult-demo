import Link from "next/link";
import Image from "next/image";
import AnimateOnScroll from "@/components/AnimateOnScroll";
import { getCurrentSite } from "@/lib/site";
import { getPageSections, getSectionField } from "@/lib/cms";

export default async function UsedSalesTeaser() {
  const site = await getCurrentSite();
  const sections = site ? await getPageSections(site.id, "home") : [];

  const badge = getSectionField(sections, "used_sales_teaser", "badge", "Spar penger");
  const title = getSectionField(
    sections,
    "used_sales_teaser",
    "title",
    "Brukte reoler til\ngode priser",
  );
  const body = getSectionField(
    sections,
    "used_sales_teaser",
    "body",
    "Vi har jevnlig inn brukte pallreoler, stålhyller og butikkinnredning i god stand. En rimelig løsning for deg som trenger innredning uten å sprenge budsjettet.",
  );
  const imageUrl = getSectionField(
    sections,
    "used_sales_teaser",
    "image_url",
    "https://reolconsult.no/wp-content/uploads/2022/11/Nettinghyller-4.jpg",
  );
  const ctaLabel = getSectionField(sections, "used_sales_teaser", "cta_label", "Se brukte produkter");

  return (
    <section className="bg-white pt-10 pb-10 sm:pt-12 sm:pb-12">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <AnimateOnScroll>
          <div className="rounded-2xl sm:rounded-3xl border border-border bg-bg-light p-6 sm:p-14 lg:p-20">
            <div className="grid grid-cols-1 items-center gap-8 sm:gap-10 lg:gap-16 lg:grid-cols-2">
              <div>
                <span className="inline-block rounded-full border border-green-600/20 bg-green-600/8 px-4 py-1.5 text-xs font-semibold uppercase tracking-[0.15em] text-green-700">
                  {badge}
                </span>
                <h2
                  className="mt-6 text-3xl font-bold tracking-tight text-primary sm:text-4xl md:text-5xl whitespace-pre-line"
                  style={{ lineHeight: 1.1 }}
                >
                  {title}
                </h2>
                <p className="mt-6 text-lg leading-relaxed text-text-muted whitespace-pre-line">
                  {body}
                </p>
                <Link
                  href="/bruktsalg"
                  className="mt-10 inline-flex rounded-full bg-accent px-8 py-4 text-base font-semibold text-white transition-all duration-200 hover:bg-accent-hover hover:shadow-lg active:translate-y-[1px]"
                >
                  {ctaLabel}
                </Link>
              </div>

              <div className="relative aspect-[4/3] overflow-hidden rounded-2xl shadow-[0_20px_40px_rgba(0,0,0,0.06)]">
                <Image
                  src={imageUrl}
                  alt="Brukte reoler"
                  fill
                  sizes="(max-width: 1024px) 100vw, 45vw"
                  className="object-cover"
                  unoptimized
                />
              </div>
            </div>
          </div>
        </AnimateOnScroll>
      </div>
    </section>
  );
}
