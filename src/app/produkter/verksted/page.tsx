import type { Metadata } from "next";
import { getCategoryPageData } from "@/lib/category-page-data";
import CategoryPageContent from "@/components/CategoryPageContent";
import { KATEGORI_FALLBACK } from "@/lib/produkt-fallback/verksted";


export const metadata: Metadata = {
  title: "Verkstedinnredning",
  description:
    "Arbeidsbord, verktøyskap, oppbevaring og komplett verkstedinnredning til industri og bilverksted. Robuste løsninger tilpasset lokalet.",
  alternates: { canonical: "/produkter/verksted" },
};

export default async function VerkstedPage() {
  const data = await getCategoryPageData("verksted", KATEGORI_FALLBACK);
  return <CategoryPageContent {...data} />;
}
