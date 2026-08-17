import type { Metadata } from "next";
import { getCategoryPageData } from "@/lib/category-page-data";
import CategoryPageContent from "@/components/CategoryPageContent";
import { KATEGORI_FALLBACK } from "@/lib/produkt-fallback/skole";


export const metadata: Metadata = {
  title: "Skole- og barnehageinnredning",
  description:
    "Innredning til skole og barnehage: garderobe, oppbevaring, hyller og robuste møbler tilpasset daglig bruk.",
  alternates: { canonical: "/produkter/skole" },
};

export default async function SkolePage() {
  const data = await getCategoryPageData("skole", KATEGORI_FALLBACK);
  return <CategoryPageContent {...data} />;
}
