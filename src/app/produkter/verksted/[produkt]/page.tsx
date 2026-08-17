import type { Metadata } from "next";
import ProduktDetalj, { finnProdukt, alleProduktSlugs } from "@/components/ProduktDetalj";
import { KATEGORI_FALLBACK } from "@/lib/produkt-fallback/verksted";

const KATEGORI = "verksted";

/** Forhåndsgenererer fallback-produktene. Produkter som kun finnes i basen
 *  rendres på forespørsel. */
export async function generateStaticParams() {
  return (await alleProduktSlugs(KATEGORI, KATEGORI_FALLBACK)).map((slug) => ({ produkt: slug }));
}

export async function generateMetadata(
  { params }: { params: Promise<{ produkt: string }> },
): Promise<Metadata> {
  const { produkt } = await params;
  const treff = await finnProdukt(KATEGORI, produkt, KATEGORI_FALLBACK);
  if (!treff) return { title: "Fant ikke produktet" };
  return {
    title: treff.produkt.title,
    description: treff.produkt.shortDesc,
    alternates: { canonical: `/produkter/${KATEGORI}/${produkt}` },
    openGraph: treff.produkt.image
      ? { images: [{ url: treff.produkt.image }] }
      : undefined,
  };
}

export default async function Side(
  { params }: { params: Promise<{ produkt: string }> },
) {
  const { produkt } = await params;
  return (
    <ProduktDetalj kategori={KATEGORI} produktId={produkt} fallback={KATEGORI_FALLBACK} />
  );
}
