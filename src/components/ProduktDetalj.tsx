import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { getCategoryPageData } from "@/lib/category-page-data";
import type { CategoryProduct } from "@/components/CategoryPageContent";
import JsonLd from "@/components/JsonLd";

/**
 * Produktside med alle bildene listet ut.
 *
 * Erstatter modal-karusellen: kunden ville se hele bildeserien på én side,
 * nærmere måten den opprinnelige nettsiden deres fungerte. Bildene ligger som
 * en vanlig liste man scroller gjennom, ikke bak piler.
 */

export type KategoriFallback = Parameters<typeof getCategoryPageData>[1];

export async function finnProdukt(
  kategori: string,
  produktId: string,
  fallback: KategoriFallback,
): Promise<{ produkt: CategoryProduct; breadcrumbLabel: string } | null> {
  const data = await getCategoryPageData(kategori, fallback);
  const produkt = data.products.find((p) => (p.slug ?? p.id) === produktId);
  return produkt ? { produkt, breadcrumbLabel: data.breadcrumbLabel } : null;
}

/** Slugs for forhåndsgenerering — fra basen når den har produkter, ellers fallback. */
export async function alleProduktSlugs(
  kategori: string,
  fallback: KategoriFallback,
): Promise<string[]> {
  const data = await getCategoryPageData(kategori, fallback);
  return data.products.map((p) => p.slug ?? p.id);
}

export default async function ProduktDetalj({
  kategori,
  produktId,
  fallback,
}: {
  kategori: string;
  produktId: string;
  fallback: KategoriFallback;
}) {
  const treff = await finnProdukt(kategori, produktId, fallback);
  if (!treff) notFound();
  const { produkt, breadcrumbLabel } = treff;

  // Hovedbildet først, deretter galleriet. Dubletter fjernes så det samme
  // bildet ikke vises to ganger øverst.
  const bilder = Array.from(
    new Set([produkt.image, ...(produkt.modal.images ?? [])].filter((b): b is string => !!b)),
  );

  // Product-schema: gir Google beskjed om at dette ER et produkt, ikke bare en
  // side som nevner ett. Pris utelates med vilje — basen har ingen, og et
  // tomt offers-felt er verre enn ingen.
  const produktLd = {
    "@context": "https://schema.org",
    "@type": "Product",
    name: produkt.title,
    description: produkt.shortDesc,
    ...(bilder.length > 0 ? { image: bilder } : {}),
    brand: { "@type": "Brand", name: "Reol-Consult AS" },
    category: breadcrumbLabel,
    ...(produkt.modal.specs?.length
      ? {
          additionalProperty: produkt.modal.specs.map((v) => ({
            "@type": "PropertyValue",
            name: v,
          })),
        }
      : {}),
    url: `https://reolconsult.no/produkter/${kategori}/${produkt.slug ?? produkt.id}`,
  };

  const ld = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      { "@type": "ListItem", position: 1, name: "Hjem", item: "https://reolconsult.no/" },
      { "@type": "ListItem", position: 2, name: "Produkter", item: "https://reolconsult.no/produkter" },
      {
        "@type": "ListItem",
        position: 3,
        name: breadcrumbLabel,
        item: `https://reolconsult.no/produkter/${kategori}`,
      },
      {
        "@type": "ListItem",
        position: 4,
        name: produkt.title,
        item: `https://reolconsult.no/produkter/${kategori}/${produkt.slug ?? produkt.id}`,
      },
    ],
  };

  return (
    <main className="bg-surface-warm pb-24">
      <JsonLd data={ld} />
      <JsonLd data={produktLd} />

      <div className="mx-auto max-w-5xl px-4 pt-10 sm:px-6 sm:pt-16 lg:px-8">
        <nav aria-label="Brødsmuler" className="mb-6 flex flex-wrap items-center gap-2 text-sm">
          <Link href="/produkter" className="text-text-muted transition-colors hover:text-primary">
            Produkter
          </Link>
          <span className="text-text-light">/</span>
          <Link
            href={`/produkter/${kategori}`}
            className="text-text-muted transition-colors hover:text-primary"
          >
            {breadcrumbLabel}
          </Link>
          <span className="text-text-light">/</span>
          <span className="font-medium text-primary">{produkt.title}</span>
        </nav>

        <h1 className="font-display text-[2rem] font-semibold tracking-[-0.02em] text-primary md:text-5xl">
          {produkt.title}
        </h1>

        <div className="mt-6 max-w-3xl space-y-4 text-base leading-relaxed text-text-muted sm:text-lg">
          {produkt.modal.description
            .split(/\n{2,}/)
            .map((avsnitt, i) => <p key={i}>{avsnitt}</p>)}
        </div>

        {produkt.modal.specs && produkt.modal.specs.length > 0 && (
          <ul className="mt-8 flex flex-wrap gap-2">
            {produkt.modal.specs.map((spec) => (
              <li
                key={spec}
                className="rounded-full border border-border bg-surface px-4 py-2 text-[13.5px] font-medium text-primary"
              >
                {spec}
              </li>
            ))}
          </ul>
        )}

        {bilder.length > 0 && (
          <section className="mt-12">
            <h2 className="mb-5 font-display text-xl font-semibold tracking-[-0.01em] text-primary">
              Bilder
              <span className="ml-2 text-sm font-normal text-text-light">
                {bilder.length} {bilder.length === 1 ? "bilde" : "bilder"}
              </span>
            </h2>
            <div className="grid gap-4 sm:grid-cols-2">
              {bilder.map((src, i) => (
                <figure
                  key={src}
                  className="relative aspect-[4/3] overflow-hidden rounded-2xl border border-border bg-surface"
                >
                  <Image
                    src={src}
                    alt={`${produkt.title} – bilde ${i + 1}`}
                    fill
                    sizes="(max-width: 640px) 100vw, 50vw"
                    className="object-cover"
                    // Bildene ligger på kundens gamle WordPress og er ikke
                    // konfigurert som remote pattern i next.config.
                    priority={i === 0}
                  />
                </figure>
              ))}
            </div>
          </section>
        )}

        <section className="mt-14 rounded-3xl bg-primary px-6 py-12 text-center text-white sm:px-12 sm:py-16">
          <h2 className="font-display text-[1.75rem] font-semibold tracking-[-0.02em] sm:text-4xl">
            Interessert i {produkt.title.toLowerCase()}?
          </h2>
          <p className="mx-auto mt-3 max-w-xl text-base text-white/60 sm:text-lg">
            Vi kommer gjerne på befaring, måler opp og gir deg et uforpliktende tilbud.
          </p>
          <div className="mt-8 flex flex-col items-center justify-center gap-3 sm:flex-row sm:gap-4">
            <Link
              href="/kontakt"
              className="w-full rounded-full bg-accent px-8 py-4 text-base font-semibold text-white transition hover:bg-accent-hover sm:w-auto"
            >
              Kontakt oss
            </Link>
            <Link
              href={`/produkter/${kategori}`}
              className="w-full rounded-full border border-white/15 px-8 py-3.5 text-base font-medium text-white transition-colors hover:bg-white/10 sm:w-auto"
            >
              Tilbake til {breadcrumbLabel.toLowerCase()}
            </Link>
          </div>
        </section>
      </div>
    </main>
  );
}
