import { getCategoryPageData } from "@/lib/category-page-data";
import CategoryPageContent, { type CategoryProduct } from "@/components/CategoryPageContent";

const FALLBACK_PRODUCTS: CategoryProduct[] = [
  {
    id: "skrivebord",
    title: "Skrivebord",
    shortDesc: "Hev/senk-bord, faste skrivebord og hjørneplasser. Ergonomisk og tilpasningsdyktig.",
    image: "https://reolconsult.no/wp-content/uploads/2018/08/projectskrivebordv.jpg",
    modal: {
      title: "Skrivebord",
      description:
        "Bredt utvalg skrivebord tilpasset moderne kontormiljøer. Elektrisk hev/senk for ergonomisk tilpasning, faste skrivebord og hjørneplasser.",
      images: [
        "https://reolconsult.no/wp-content/uploads/2018/08/projectskrivebordv.jpg",
        "https://reolconsult.no/wp-content/uploads/2023/11/Kontormiljo-2.jpg",
      ],
      specs: ["Elektrisk hev/senk", "Faste skrivebord", "Hjørneplasser", "Kabelkanaler", "Monitorarmer", "Bordskjermer"],
    },
  },
  {
    id: "kontorstoler",
    title: "Kontorstoler",
    shortDesc: "Ergonomiske kontorstoler, konferansestoler og besøksstoler.",
    image: "https://reolconsult.no/wp-content/uploads/2023/11/Savo-1.jpg",
    modal: {
      title: "Kontorstoler",
      description: "Ergonomiske kontorstoler med justerbar korsryggstøtte, armlener og setedybde.",
      images: ["https://reolconsult.no/wp-content/uploads/2023/11/Savo-1.jpg"],
      specs: ["Justerbar korsryggstøtte", "Justerbare armlener", "Setedybde", "Konferansestoler", "Besøksstoler"],
    },
  },
  {
    id: "oppbevaring",
    title: "Oppbevaring",
    shortDesc: "Arkivskap, reolsystemer og låsbare skap.",
    image: "https://reolconsult.no/wp-content/uploads/2023/11/Oppbevaring-18.jpg",
    modal: {
      title: "Oppbevaring",
      description: "Arkivskap, reolsystemer og låsbare skap.",
      images: ["https://reolconsult.no/wp-content/uploads/2023/11/Oppbevaring-18.jpg"],
      specs: ["Arkivskap", "Hengemapper", "Reolsystemer", "Låsbare skap", "Fleksibel inndeling"],
    },
  },
  {
    id: "resepsjon",
    title: "Resepsjon & Konferanse",
    shortDesc: "Resepsjonsdisker etter mål og konferansebord i flere størrelser.",
    image: "https://reolconsult.no/wp-content/uploads/2023/11/Skranke-resepsjon-3.jpg",
    modal: {
      title: "Resepsjon & Konferanse",
      description: "Resepsjonsdisker bygges etter mål. Konferansebord i flere størrelser.",
      images: ["https://reolconsult.no/wp-content/uploads/2023/11/Skranke-resepsjon-3.jpg"],
      specs: ["Resepsjonsdisker etter mål", "Konferansebord", "Flere størrelser", "Komplett leveranse"],
    },
  },
  {
    id: "skjermvegger",
    title: "Skjermvegger",
    shortDesc: "Støydempende paneler for åpne kontorlandskap.",
    image: "https://reolconsult.no/wp-content/uploads/2023/11/Ab_Stitch-scaled.jpg",
    modal: {
      title: "Skjermvegger",
      description: "Støydempende paneler. Frittstående eller bordmontert.",
      images: ["https://reolconsult.no/wp-content/uploads/2023/11/Ab_Stitch-scaled.jpg"],
      specs: ["Støydempende", "Frittstående", "Bordmontert", "Mange farger"],
    },
  },
];

export default async function KontorPage() {
  const data = await getCategoryPageData("kontor", {
    heroTitle: "Kontor",
    heroSubtitle:
      "Kontormøbler, oppbevaring, resepsjon, konferansemøbler og skjermvegger. Vi hjelper deg med planlegging av hele kontoret.",
    heroImage: "https://reolconsult.no/wp-content/uploads/2018/08/projectskrivebordv.jpg",
    breadcrumbLabel: "Kontor",
    ctaTitle: "Flytter dere til nye lokaler?",
    ctaBody: "Vi planlegger hele kontoret — fra skrivebord og stoler til skjermvegger og resepsjonsdisk. Ta kontakt for et uforpliktende tilbud.",
    products: FALLBACK_PRODUCTS,
  });
  return <CategoryPageContent {...data} />;
}
