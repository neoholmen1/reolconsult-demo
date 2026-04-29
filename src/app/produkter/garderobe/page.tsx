import { getCategoryPageData } from "@/lib/category-page-data";
import CategoryPageContent, { type CategoryProduct } from "@/components/CategoryPageContent";

const FALLBACK_PRODUCTS: CategoryProduct[] = [
  {
    id: "garderobeskap",
    title: "Garderobeskap",
    shortDesc: "1-4 roms skap og Z-skap. Velg dørtype, materialer, farger og lås.",
    image: "https://reolconsult.no/wp-content/uploads/2023/11/IMG_1148-scaled.jpg",
    modal: {
      title: "Garderobeskap",
      description:
        "Garderobeskap i 1-4 roms konfigurasjon og Z-skap. Velg mellom ståldør, laminatdør, kryssfiner og finér.",
      images: [
        "https://reolconsult.no/wp-content/uploads/2023/11/IMG_1148-scaled.jpg",
        "https://reolconsult.no/wp-content/uploads/2023/11/IMG_1149-scaled.jpg",
      ],
      specs: ["1-4 roms og Z-skap", "Ståldør", "Laminatdør", "Kryssfiner/finér", "Galvanisert stål", "Hengelås / kodelås / RFID"],
    },
  },
  {
    id: "skoleskap",
    title: "Skoleskap",
    shortDesc: "Robuste skap for skolemiljø. Tåler hard slitasje.",
    image: "https://reolconsult.no/wp-content/uploads/2023/11/IMG_1152-scaled.jpg",
    modal: {
      title: "Skoleskap",
      description: "Ekstra robuste garderobeskap utviklet spesielt for skolemiljøer.",
      specs: ["Ekstra robust", "Skolemiljø", "Mange farger", "Lang levetid"],
    },
  },
  {
    id: "ladeskap",
    title: "Ladeskap & PC-skap",
    shortDesc: "Sikker lading og oppbevaring av mobiler, nettbrett og PC.",
    image: "https://reolconsult.no/wp-content/uploads/2023/11/IMG_1151-scaled.jpg",
    modal: {
      title: "Ladeskap & PC-skap",
      description: "Sikker lading og oppbevaring. Integrerte stikkontakter og USB-porter. Låsbare rom.",
      specs: ["Integrert lading", "USB-porter", "Låsbare rom", "Mobil og nettbrett", "PC-oppbevaring"],
    },
  },
  {
    id: "tilbehor",
    title: "Tilbehør",
    shortDesc: "Skohyller, sittebenker, navneskilt og låssystemer.",
    image: "https://reolconsult.no/wp-content/uploads/2023/11/Skohyller.jpg",
    modal: {
      title: "Tilbehør",
      description: "Komplett tilbehørssortiment for garderoberommet.",
      images: ["https://reolconsult.no/wp-content/uploads/2023/11/Skohyller.jpg"],
      specs: ["Skohyller", "Sittebenker", "Navneskilt", "Nummerskilt", "Låssystemer"],
    },
  },
];

export default async function GarderobePage() {
  const data = await getCategoryPageData("garderobe", {
    heroTitle: "Garderobe",
    heroSubtitle:
      "Garderoberom skal være praktiske, men også trivelige å være i. Med våre garderobeskap bestemmer du selv farger, materialer, lås og funksjoner.",
    heroImage: "https://reolconsult.no/wp-content/uploads/2023/11/IMG_1148-scaled.jpg",
    breadcrumbLabel: "Garderobe",
    ctaTitle: "Skal dere innrede nye garderobeskap?",
    ctaBody: "Velg dørtype, materialer, lås og farger. Vi hjelper deg med å finne riktig løsning. Ta kontakt for et uforpliktende tilbud.",
    products: FALLBACK_PRODUCTS,
  });
  return <CategoryPageContent {...data} />;
}
