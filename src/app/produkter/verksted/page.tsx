import { getCategoryPageData } from "@/lib/category-page-data";
import CategoryPageContent, { type CategoryProduct } from "@/components/CategoryPageContent";

const FALLBACK_PRODUCTS: CategoryProduct[] = [
  {
    id: "arbeidsbord",
    title: "Arbeidsbord",
    shortDesc: "Manuelt justerbare, elektrisk hev/senk, pakkebord og rullebord.",
    image: "https://reolconsult.no/wp-content/uploads/2018/08/arbeidsbord500.jpg",
    modal: {
      title: "Arbeidsbord",
      description:
        "Komplett utvalg arbeidsbord — manuelt og elektrisk hev/senk, pakkebord og rullebord. Bordplater i bøk, laminat, stål eller ESD-sikre varianter.",
      images: ["https://reolconsult.no/wp-content/uploads/2018/08/arbeidsbord500.jpg"],
      specs: ["Manuell hev/senk", "Elektrisk hev/senk", "Pakkebord", "Rullebord", "ESD-sikre varianter"],
    },
  },
  {
    id: "verktoyskap",
    title: "Verktøyskap & Oppbevaring",
    shortDesc: "Skap med perforerte dører, skuffeseksjoner, verktøytavler.",
    image: "https://reolconsult.no/wp-content/uploads/2018/08/hjemmeside60.jpg",
    modal: {
      title: "Verktøyskap & Oppbevaring",
      description: "Verktøyskap med perforerte dører. Industriskuffer med kulelagerføringer.",
      images: ["https://reolconsult.no/wp-content/uploads/2018/08/hjemmeside60.jpg"],
      specs: ["Perforerte dører", "Låsbare skap", "Kulelagerføringer", "Sentrallås", "Verktøytavler"],
    },
  },
  {
    id: "transport",
    title: "Transport",
    shortDesc: "Traller, vogner og transportløsninger for intern logistikk.",
    image: "https://reolconsult.no/wp-content/uploads/2018/08/hjemmeside130.jpg",
    modal: {
      title: "Transport",
      description: "Plattformtraller, hylletraller, reoltraller og spesialtilpassede transportvogner.",
      images: ["https://reolconsult.no/wp-content/uploads/2018/08/hjemmeside130.jpg"],
      specs: ["Plattformtraller", "Hylletraller", "Reoltraller", "Transportvogner", "Rullebaner"],
    },
  },
  {
    id: "miljosikring",
    title: "Miljøsikring",
    shortDesc: "Oppsamlingskar, spillbarrierer og miljøsikringsprodukter.",
    image: "https://reolconsult.no/wp-content/uploads/2018/08/hjemmeside210.jpg",
    modal: {
      title: "Miljøsikring",
      description: "Oppsamlingskar, spillbarrierer og absorpsjonsmidler — godkjent etter miljøforskrifter.",
      images: ["https://reolconsult.no/wp-content/uploads/2018/08/hjemmeside210.jpg"],
      specs: ["Oppsamlingskar", "Spillbarrierer", "Absorpsjonsmidler", "Miljøgodkjent"],
    },
  },
  {
    id: "lofteutstyr",
    title: "Løfteutstyr",
    shortDesc: "Løftebord, stablere og annet løfteutstyr.",
    image: "https://reolconsult.no/wp-content/uploads/2018/08/hjemmeside220.jpg",
    modal: {
      title: "Løfteutstyr",
      description: "Stasjonære og mobile løftebord for ergonomisk arbeidshøyde, hydraulisk eller elektrisk.",
      images: ["https://reolconsult.no/wp-content/uploads/2018/08/hjemmeside220.jpg"],
      specs: ["Løftebord", "Stablere", "Hydraulisk/elektrisk", "Fra 300 kg", "Mobile og stasjonære"],
    },
  },
];

export default async function VerkstedPage() {
  const data = await getCategoryPageData("verksted", {
    heroTitle: "Verksted & Industri",
    heroSubtitle:
      "Ingen arbeidsplass er lik. Vi har et bredt utvalg standardløsninger og lager spesialtilpasninger når det trengs.",
    heroImage: "https://reolconsult.no/wp-content/uploads/2018/08/arbeidsbord500.jpg",
    breadcrumbLabel: "Verksted",
    ctaTitle: "Trenger dere arbeidsplasser tilpasset bedriften?",
    ctaBody: "Vi tilpasser arbeidsbord, verktøyskap og oppbevaring etter dine behov. Ta kontakt for et uforpliktende tilbud.",
    products: FALLBACK_PRODUCTS,
  });
  return <CategoryPageContent {...data} />;
}
