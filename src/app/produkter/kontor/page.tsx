import type { Metadata } from "next";
import { getCategoryPageData } from "@/lib/category-page-data";
import CategoryPageContent from "@/components/CategoryPageContent";
import { KATEGORI_FALLBACK } from "@/lib/produkt-fallback/kontor";


export const metadata: Metadata = {
  title: "Kontorinnredning og arkiv",
  description:
    "Skrivebord, oppbevaring, arkivreoler og kontormøbler. Komplette løsninger fra tegning til ferdig montert, levert i hele Norge.",
  alternates: { canonical: "/produkter/kontor" },
};

export default async function KontorPage() {
  const data = await getCategoryPageData("kontor", KATEGORI_FALLBACK);
  return <CategoryPageContent {...data} />;
}
