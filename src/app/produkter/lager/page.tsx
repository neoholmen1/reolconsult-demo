import type { Metadata } from "next";
import { getCategoryPageData } from "@/lib/category-page-data";
import CategoryPageContent from "@/components/CategoryPageContent";
import { KATEGORI_FALLBACK } from "@/lib/produkt-fallback/lager";


export const metadata: Metadata = {
  title: "Lagerinnredning og pallreoler",
  description:
    "Pallreoler, småvarereoler, mesanin, grenreoler og spesialreoler til lager. Vi prosjekterer, leverer og monterer i hele Norge. HMS-sikkerhetskontroll av eksisterende reoler.",
  alternates: { canonical: "/produkter/lager" },
};

export default async function LagerPage() {
  const data = await getCategoryPageData("lager", KATEGORI_FALLBACK);
  return <CategoryPageContent {...data} />;
}
