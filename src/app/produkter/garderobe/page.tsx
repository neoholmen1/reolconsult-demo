import type { Metadata } from "next";
import { getCategoryPageData } from "@/lib/category-page-data";
import CategoryPageContent from "@/components/CategoryPageContent";
import { KATEGORI_FALLBACK } from "@/lib/produkt-fallback/garderobe";


export const metadata: Metadata = {
  title: "Garderobeskap",
  description:
    "Garderobeskap og garderobeinnredning til bedrift, skole, idrettsanlegg og industri. Ulike størrelser, låstyper og materialer.",
  alternates: { canonical: "/produkter/garderobe" },
};

export default async function GarderobePage() {
  const data = await getCategoryPageData("garderobe", KATEGORI_FALLBACK);
  return <CategoryPageContent {...data} />;
}
