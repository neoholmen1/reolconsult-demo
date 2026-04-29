import { getCategoryPageData } from "@/lib/category-page-data";
import CategoryPageContent, { type CategoryProduct } from "@/components/CategoryPageContent";

const FALLBACK_PRODUCTS: CategoryProduct[] = [
  {
    id: "gondoler",
    title: "Gondoler & Veggsystemer",
    shortDesc: "Enkel- og dobbeltsidig med justerbare hyller. Tåler tøff daglig bruk i mange år.",
    image: "https://reolconsult.no/wp-content/uploads/2022/11/Verdal-15-scaled.jpeg",
    modal: {
      title: "Gondoler & Veggsystemer",
      description:
        "Grunnsystemet er utviklet etter svensk byggestandard — robust nok til å bære stativ, hyller, skilter og belysning. Enkel- og dobbeltsidig med justerbare hyller og kroker som tilpasses enkelt etter butikkens behov.",
      images: [
        "https://reolconsult.no/wp-content/uploads/2022/11/Verdal-15-scaled.jpeg",
        "https://reolconsult.no/wp-content/uploads/2022/11/Ahlsell-1.jpg",
        "https://reolconsult.no/wp-content/uploads/2022/11/TESS-18-scaled.jpeg",
      ],
      specs: ["Svensk byggestandard", "Enkel- og dobbeltsidig", "Justerbare hyller", "Enkel montering", "Enkelt å utvide"],
    },
  },
  {
    id: "disker",
    title: "Disker",
    shortDesc: "Robust, modulbasert disksystem fra Sverige med topplater for høy slitestyrke.",
    image: "https://reolconsult.no/wp-content/uploads/2022/11/Disk-Vrengen-Maritime-1-scaled.jpg",
    modal: {
      title: "Disker",
      description:
        "Vårt fleksible, modulbaserte disksystem fra Sverige bygges akkurat slik du ønsker. Standardfarger front i hvit, svart eller grå.",
      images: [
        "https://reolconsult.no/wp-content/uploads/2022/11/Disk-Vrengen-Maritime-1-scaled.jpg",
        "https://reolconsult.no/wp-content/uploads/2022/11/Disk-TESS-Elverum.jpg",
      ],
      specs: ["Modulbasert", "Hvit/svart/grå front", "LED-belysning", "Skranketopp", "Skreddersydd"],
    },
  },
  {
    id: "tilbehor",
    title: "Tilbehør",
    shortDesc: "Prislister, skiltholdere, varesikring, belysning og mer.",
    image: "https://reolconsult.no/wp-content/uploads/2020/03/Enkeltspyd-for-spydskinne-L300mm-Ø8-Art.-2327-L400mm-Ø8-Art.-2328.jpg",
    modal: {
      title: "Tilbehør",
      description: "Komplett utvalg av tilbehør for butikkinnredning.",
      images: ["https://reolconsult.no/wp-content/uploads/2023/11/Brosjyrestativ-007.jpg"],
      specs: ["Prislister", "Skiltholdere", "Varesikring", "LED-belysning", "Kroker og konsoller"],
    },
  },
];

export default async function ButikkPage() {
  const data = await getCategoryPageData("butikk", {
    heroTitle: "Butikkinnredning",
    heroSubtitle:
      "Fra enkelte detaljer til komplette systemer for store butikkmiljøer. Grunnsystemet er utviklet etter svensk byggestandard og tåler hard daglig bruk i mange år.",
    heroImage: "https://reolconsult.no/wp-content/uploads/2022/11/Dagligvare-Foodora.jpg",
    breadcrumbLabel: "Butikk",
    ctaTitle: "Skal du innrede ny butikk eller pusse opp?",
    ctaBody: "Vi tegner og leverer komplett innredning — fra disker og hyller til belysning og prislister. Ta kontakt for et uforpliktende tilbud.",
    products: FALLBACK_PRODUCTS,
  });
  return <CategoryPageContent {...data} />;
}
