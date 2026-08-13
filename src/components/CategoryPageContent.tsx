"use client";

import { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { useRouter } from "next/navigation";
import AnimateOnScroll from "@/components/AnimateOnScroll";
import ProductModal, { type ProductModalData } from "@/components/ProductModal";
import JsonLd from "@/components/JsonLd";
import { useSite } from "@/components/SiteProvider";
import { formatPhoneLink } from "@/lib/site";
import { ryddTekst } from "@/lib/tekst";

export type CategoryProduct = {
  id: string;
  title: string;
  shortDesc: string;
  image?: string;
  modal: ProductModalData;
};

export type CategoryPageContentProps = {
  hero: {
    title: string;
    subtitle: string;
    image: string;
  };
  breadcrumbLabel: string;
  /** Slug for kategori-URL i breadcrumb-strukturdata (f.eks. "lager"). */
  categorySlug?: string;
  products: CategoryProduct[];
  cta: {
    title: string;
    body: string;
  };
  /** Hvis true, vis "Tilbake"-knapp som går til router.back(). Hvis false, gå til /produkter. */
  useRouterBack?: boolean;
};

export default function CategoryPageContent({
  hero,
  breadcrumbLabel,
  categorySlug,
  products,
  cta,
  useRouterBack = true,
}: CategoryPageContentProps) {
  const router = useRouter();
  const { settings } = useSite();
  const [activeProduct, setActiveProduct] = useState<ProductModalData | null>(null);

  // Strukturdata: BreadcrumbList + ItemList av produktene på denne kategori-siden
  const breadcrumbLd = categorySlug && {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      { "@type": "ListItem", position: 1, name: "Hjem", item: "https://reolconsult.no/" },
      { "@type": "ListItem", position: 2, name: "Produkter", item: "https://reolconsult.no/produkter" },
      {
        "@type": "ListItem",
        position: 3,
        name: breadcrumbLabel,
        item: `https://reolconsult.no/produkter/${categorySlug}`,
      },
    ],
  };

  const itemListLd = categorySlug && products.length > 0 && {
    "@context": "https://schema.org",
    "@type": "ItemList",
    name: `${breadcrumbLabel} – produkter`,
    itemListElement: products.map((p, i) => ({
      "@type": "ListItem",
      position: i + 1,
      item: {
        "@type": "Product",
        name: p.title,
        description: p.shortDesc,
        image: p.image,
        brand: { "@type": "Brand", name: "Reol-Consult" },
      },
    })),
  };

  return (
    <main>
      {breadcrumbLd && <JsonLd data={breadcrumbLd} />}
      {itemListLd && <JsonLd data={itemListLd} />}
      {/* Hero */}
      <section className="relative flex min-h-[360px] items-end sm:min-h-[440px] md:h-[60vh] md:min-h-[480px]">
        <Image
          src={hero.image}
          alt={hero.title}
          fill
          sizes="100vw"
          className="object-cover"
          priority
          unoptimized
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/45 to-black/15" />
        <div className="relative z-10 mx-auto w-full max-w-6xl px-4 pb-10 sm:px-6 sm:pb-16 lg:px-8">
          <AnimateOnScroll>
            <h1 className="mb-3 font-display text-[2rem] font-semibold leading-[1.05] tracking-[-0.02em] text-white sm:mb-4 sm:text-5xl lg:text-6xl">
              {hero.title}
            </h1>
            <p className="max-w-xl text-base leading-relaxed text-white/85 sm:text-lg whitespace-pre-line">
              {ryddTekst(hero.subtitle)}
            </p>
          </AnimateOnScroll>
        </div>
      </section>

      {/* Breadcrumb */}
      <div className="bg-surface-warm">
      <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8 py-5">
        <nav className="flex items-center gap-2 text-sm text-text-muted">
          {useRouterBack ? (
            <button
              onClick={() => router.back()}
              className="inline-flex items-center gap-1.5 hover:text-primary transition-colors"
            >
              <svg className="h-3.5 w-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M10.5 19.5L3 12m0 0l7.5-7.5M3 12h18" />
              </svg>
              Tilbake
            </button>
          ) : (
            <Link
              href="/produkter"
              className="inline-flex items-center gap-1.5 hover:text-primary transition-colors"
            >
              <svg className="h-3.5 w-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M10.5 19.5L3 12m0 0l7.5-7.5M3 12h18" />
              </svg>
              Produkter
            </Link>
          )}
          <svg className="h-3.5 w-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M8.25 4.5l7.5 7.5-7.5 7.5" />
          </svg>
          <span className="text-primary font-medium">{breadcrumbLabel}</span>
        </nav>
      </div>

      {/* Product grid */}
      <section className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8 pb-20 sm:pb-24">
        {products.length === 0 ? (
          <AnimateOnScroll>
            <div className="mx-auto flex max-w-md flex-col items-center rounded-3xl border border-dashed border-border bg-bg-light px-6 py-16 text-center shadow-[var(--shadow-soft)]">
              <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-accent/10 text-accent">
                <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.6}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="m20.25 7.5-.625 10.632a2.25 2.25 0 0 1-2.247 2.118H6.622a2.25 2.25 0 0 1-2.247-2.118L3.75 7.5M10 11.25h4M3.375 7.5h17.25c.621 0 1.125-.504 1.125-1.125v-1.5c0-.621-.504-1.125-1.125-1.125H3.375c-.621 0-1.125.504-1.125 1.125v1.5c0 .621.504 1.125 1.125 1.125Z" />
                </svg>
              </div>
              <h2 className="mt-5 font-display text-xl font-semibold tracking-[-0.01em] text-primary">Produktene oppdateres</h2>
              <p className="mt-2 text-sm leading-relaxed text-text-muted">
                Vi jobber med å publisere alt vi har innen {breadcrumbLabel.toLowerCase()}. Ta kontakt så
                kan vi fortelle hva som er tilgjengelig.
              </p>
              <Link
                href="/kontakt"
                className="mt-6 inline-flex items-center gap-1.5 rounded-full border border-primary/20 px-5 py-2 text-sm font-medium text-primary transition duration-200 hover:border-primary/40 hover:bg-primary/5"
              >
                Kontakt oss
              </Link>
            </div>
          </AnimateOnScroll>
        ) : (
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 sm:gap-6 lg:grid-cols-3">
            {products.map((product, i) => (
              <ProductCard
                key={product.id}
                product={product}
                index={i}
                onClick={() => setActiveProduct(product.modal)}
              />
            ))}
          </div>
        )}
      </section>
      </div>

      {/* CTA */}
      <section className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8 py-20 sm:py-24">
        <AnimateOnScroll>
          <div className="rounded-3xl bg-primary px-6 sm:px-12 py-12 sm:py-20 text-center text-white shadow-[var(--shadow-float)]">
            <h2 className="font-display text-[2rem] sm:text-4xl md:text-5xl font-semibold tracking-[-0.02em] mb-4">{cta.title}</h2>
            <p className="text-base sm:text-lg text-white/60 mb-8 sm:mb-10 max-w-xl mx-auto whitespace-pre-line">
              {ryddTekst(cta.body)}
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
                  className="w-full sm:w-auto rounded-full border border-white/20 px-8 py-3.5 text-base font-medium text-white transition-colors duration-300 hover:bg-white/10 active:translate-y-[1px]"
                >
                  Ring {settings.phone}
                </a>
              )}
            </div>
          </div>
        </AnimateOnScroll>
      </section>

      <ProductModal product={activeProduct} onClose={() => setActiveProduct(null)} />
    </main>
  );
}

function ProductCard({
  product,
  index,
  onClick,
}: {
  product: CategoryProduct;
  index: number;
  onClick: () => void;
}) {
  return (
    <AnimateOnScroll delay={index * 0.08}>
      <button
        onClick={onClick}
        className="group w-full overflow-hidden rounded-3xl border border-border bg-surface text-left shadow-[var(--shadow-soft)] transition duration-200 hover:-translate-y-1 hover:shadow-[var(--shadow-lift)]"
      >
        {product.image ? (
          <div className="relative aspect-[4/3] overflow-hidden bg-bg-light">
            <Image
              src={product.image}
              alt={product.title}
              fill
              sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
              className="object-cover transition-transform duration-500 group-hover:scale-[1.04]"
              unoptimized
            />
          </div>
        ) : (
          <div className="flex aspect-[4/3] items-center justify-center bg-gradient-to-br from-primary-light to-primary-dark">
            <span className="text-sm font-semibold tracking-wide text-white/70">
              {product.title}
            </span>
          </div>
        )}
        <div className="flex items-start justify-between gap-3 p-5">
          <div className="flex-1 min-w-0">
            <h3 className="font-display text-lg font-semibold leading-snug tracking-[-0.01em] text-primary">{product.title}</h3>
            <p className="mt-1.5 text-sm leading-relaxed text-text-muted">{product.shortDesc}</p>
          </div>
          <span className="mt-1 flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-bg-light text-text-muted transition duration-300 group-hover:bg-accent group-hover:text-white">
            <svg className="h-3.5 w-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.25}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
            </svg>
          </span>
        </div>
      </button>
    </AnimateOnScroll>
  );
}
