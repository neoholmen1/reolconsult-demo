"use client";

import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import AnimateOnScroll from "@/components/AnimateOnScroll";
import { useSite } from "@/components/SiteProvider";
import { formatPhoneLink } from "@/lib/site";
import { ryddTekst } from "@/lib/tekst";

export type CategoryItem = {
  slug: string;
  title: string;
  subtitle: string;
  image: string;
};

export default function ProdukterContent({
  categories,
  introTitle,
  introBody,
  ctaTitle,
  ctaBody,
}: {
  categories: CategoryItem[];
  introTitle: string;
  introBody: string;
  ctaTitle: string;
  ctaBody: string;
}) {
  const router = useRouter();
  const { settings } = useSite();

  return (
    <div className="bg-surface-warm pb-24 pt-10 sm:pt-16">
      <section className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8 mb-16 sm:mb-24">
        <button
          onClick={() => router.back()}
          className="mb-4 inline-flex items-center gap-1.5 text-sm font-medium text-text-muted transition-colors hover:text-primary"
        >
          <svg className="h-3.5 w-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M10.5 19.5L3 12m0 0l7.5-7.5M3 12h18" />
          </svg>
          Tilbake
        </button>
        <p className="mb-4 inline-flex items-center gap-2.5 text-xs font-semibold uppercase tracking-[0.22em] text-accent"><span className="h-px w-7 bg-accent/50" />Produkter</p>
        <h1 className="font-display text-[2rem] font-semibold tracking-[-0.02em] text-primary mb-3 sm:mb-4 md:text-5xl">
          {introTitle}
        </h1>
        <p className="text-base sm:text-lg text-text-muted mb-5 sm:mb-8 max-w-2xl whitespace-pre-line">
          {ryddTekst(introBody)}
        </p>
        <div className="grid grid-cols-2 gap-3 sm:gap-5 lg:grid-cols-3">
          {categories.map((cat, i) => (
            <AnimateOnScroll key={cat.slug} delay={i * 0.06}>
              <Link
                href={`/produkter/${cat.slug}`}
                className="group relative block aspect-square sm:aspect-[4/3] overflow-hidden rounded-[1.5rem] sm:rounded-[2rem] ring-1 ring-black/5 shadow-[var(--shadow-card)] transition duration-200 hover:-translate-y-1 hover:shadow-[var(--shadow-lift)]"
              >
                <Image
                  src={cat.image}
                  alt={cat.title}
                  fill
                  className="object-cover transition-transform duration-500 group-hover:scale-105"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/40 to-black/10" />
                <div className="absolute inset-x-0 bottom-0 p-4 sm:p-6">
                  <h3 className="font-display text-[15px] leading-snug sm:text-xl font-semibold tracking-[-0.01em] text-white">
                    {cat.title}
                  </h3>
                  <p className="mt-1 text-xs leading-snug sm:text-sm text-white/70 hidden sm:block">{cat.subtitle}</p>
                </div>
              </Link>
            </AnimateOnScroll>
          ))}
        </div>
      </section>

      <section className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
        <AnimateOnScroll>
          <div className="rounded-3xl bg-primary px-6 sm:px-12 py-12 sm:py-20 text-center text-white shadow-[var(--shadow-float)]">
            <h2 className="font-display text-[2rem] sm:text-4xl md:text-5xl font-semibold tracking-[-0.02em] mb-4">{ctaTitle}</h2>
            <p className="text-base sm:text-lg text-white/50 mb-8 sm:mb-10 max-w-xl mx-auto whitespace-pre-line">
              {ryddTekst(ctaBody)}
            </p>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-3 sm:gap-4">
              <Link
                href="/kontakt"
                className="w-full sm:w-auto rounded-full bg-accent px-8 py-4 text-base font-semibold text-white transition hover:bg-accent-hover hover:shadow-[0_8px_24px_rgba(220,38,38,0.25)] active:translate-y-[1px]"
              >
                Kontakt oss
              </Link>
              {settings.phone && (
                <a
                  href={formatPhoneLink(settings.phone)}
                  className="w-full sm:w-auto rounded-full border border-white/15 px-8 py-3.5 text-base font-medium text-white transition-colors duration-300 hover:bg-white/10 active:translate-y-[1px]"
                >
                  Ring {settings.phone}
                </a>
              )}
            </div>
          </div>
        </AnimateOnScroll>
      </section>
    </div>
  );
}
