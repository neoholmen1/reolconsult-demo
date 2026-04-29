"use client";

import { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { useRouter } from "next/navigation";
import AnimateOnScroll from "@/components/AnimateOnScroll";
import ProductModal, { type ProductModalData } from "@/components/ProductModal";
import { useSite } from "@/components/SiteProvider";
import { formatPhoneLink } from "@/lib/site";

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
  products,
  cta,
  useRouterBack = true,
}: CategoryPageContentProps) {
  const router = useRouter();
  const { settings } = useSite();
  const [activeProduct, setActiveProduct] = useState<ProductModalData | null>(null);

  return (
    <main>
      {/* Hero */}
      <section className="relative h-[250px] sm:h-[50vh] md:h-[60vh] sm:min-h-[400px] flex items-end">
        <Image
          src={hero.image}
          alt={hero.title}
          fill
          sizes="100vw"
          className="object-cover"
          priority
          unoptimized
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-black/20" />
        <div className="relative z-10 mx-auto w-full max-w-6xl px-4 sm:px-6 lg:px-8 pb-8 sm:pb-16">
          <AnimateOnScroll>
            <h1 className="text-3xl sm:text-5xl lg:text-6xl font-bold text-white tracking-tight mb-2 sm:mb-4">
              {hero.title}
            </h1>
            <p className="text-base sm:text-xl text-white/80 max-w-xl whitespace-pre-line">
              {hero.subtitle}
            </p>
          </AnimateOnScroll>
        </div>
      </section>

      {/* Breadcrumb */}
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
      <section className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8 pb-24">
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
      </section>

      {/* CTA */}
      <section className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8 pb-24">
        <AnimateOnScroll>
          <div className="rounded-2xl sm:rounded-3xl bg-primary px-6 sm:px-12 py-12 sm:py-20 text-center text-white">
            <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold mb-4">{cta.title}</h2>
            <p className="text-base sm:text-lg text-white/60 mb-8 sm:mb-10 max-w-xl mx-auto whitespace-pre-line">
              {cta.body}
            </p>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-3 sm:gap-4">
              <Link
                href="/kontakt"
                className="w-full sm:w-auto rounded-full bg-accent px-8 py-3.5 text-base font-semibold text-white transition-all duration-300 hover:bg-accent-hover hover:shadow-lg active:translate-y-[1px]"
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
        className="group w-full text-left rounded-xl overflow-hidden bg-white shadow-[0_1px_3px_rgba(0,0,0,0.06)] transition-all duration-300 hover:shadow-[0_12px_40px_rgba(0,0,0,0.1)] hover:-translate-y-1"
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
          <div className="aspect-[4/3] flex items-center justify-center bg-gradient-to-br from-[#171717] to-[#262626]">
            <span className="text-sm font-semibold text-white/70 tracking-wide">
              {product.title}
            </span>
          </div>
        )}
        <div className="p-5">
          <h3 className="text-lg font-semibold text-primary mb-1.5">{product.title}</h3>
          <p className="text-sm text-text-muted leading-relaxed">{product.shortDesc}</p>
        </div>
      </button>
    </AnimateOnScroll>
  );
}
