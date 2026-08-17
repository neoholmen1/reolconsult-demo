import type { Metadata } from "next";
import { getCategoryPageData } from "@/lib/category-page-data";
import CategoryPageContent from "@/components/CategoryPageContent";
import { KATEGORI_FALLBACK } from "@/lib/produkt-fallback/butikk";


export const metadata: Metadata = {
  title: "Butikkinnredning",
  description:
    "Gondoler, disker, veggreoler og komplett butikkinnredning. Vi tegner løsningen etter lokalet ditt og monterer ferdig. 350 kvm utstilling i Tønsberg.",
  alternates: { canonical: "/produkter/butikk" },
};

export default async function ButikkPage() {
  const data = await getCategoryPageData("butikk", KATEGORI_FALLBACK);
  return <CategoryPageContent {...data} />;
}
