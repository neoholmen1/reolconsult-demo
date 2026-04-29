import { getCategoryPageData } from "@/lib/category-page-data";
import CategoryPageContent, { type CategoryProduct } from "@/components/CategoryPageContent";

const FALLBACK_PRODUCTS: CategoryProduct[] = [
  {
    id: "skoleinnredning",
    title: "Skoleinnredning",
    shortDesc: "Elevpulter, stoler, tavler og elevskap. Justerbar høyde for alle aldersgrupper.",
    image: "https://reolconsult.no/wp-content/uploads/2023/11/IMG_1153.jpg",
    modal: {
      title: "Skoleinnredning",
      description:
        "Komplett innredning for skolen — elevpulter, stoler, tavler og elevskap. Holdbarhet er nøkkelordet.",
      images: ["https://reolconsult.no/wp-content/uploads/2023/11/IMG_1153.jpg"],
      specs: ["Elevpulter", "Justerbar høyde", "Stoler", "Tavler", "Elevskap", "Holdbart design"],
    },
  },
  {
    id: "barnehage",
    title: "Barnehageinnredning",
    shortDesc: "Barnestoler, småbord, stellebord og hvileløsninger for de minste.",
    image: "https://reolconsult.no/wp-content/uploads/2023/11/Skole-og-barnehage-2.jpg",
    modal: {
      title: "Barnehageinnredning",
      description:
        "Barnestoler og bord tilpasset de minste. Stellebord godkjent etter forskrifter. Madrasser og hvileløsninger.",
      images: ["https://reolconsult.no/wp-content/uploads/2023/11/Skole-og-barnehage-2.jpg"],
      specs: ["Barnestoler og bord", "Stellebord", "Godkjent etter forskrift", "Madrasser", "Hvileløsninger"],
    },
  },
  {
    id: "fellesarealer",
    title: "Fellesarealer",
    shortDesc: "Sofaer, benker og møbler for fellesarealer og personalrom.",
    image: "https://reolconsult.no/wp-content/uploads/2023/11/Skole-og-barnehage-1.jpg",
    modal: {
      title: "Fellesarealer",
      description: "Møbler for fellesarealer, personalrom og samlingsplasser.",
      images: ["https://reolconsult.no/wp-content/uploads/2023/11/Skole-og-barnehage-1.jpg"],
      specs: ["Sofaer", "Benker", "Sittegrupper", "Personalrom", "Holdbare materialer"],
    },
  },
  {
    id: "oppbevaring",
    title: "Oppbevaring",
    shortDesc: "Åpen innredning for leker og materiell i barnvennlig design.",
    image: "https://reolconsult.no/wp-content/uploads/2023/11/Skole-og-barnehage-2.jpg",
    modal: {
      title: "Oppbevaring",
      description: "Åpen innredning for leker og materiell i barnvennlig design og tilpasset høyde.",
      specs: ["Barnvennlig design", "Tilpasset høyde", "Åpen innredning", "Fleksibel inndeling", "Trygt og enkelt"],
    },
  },
];

export default async function SkolePage() {
  const data = await getCategoryPageData("skole", {
    heroTitle: "Skole & Barnehage",
    heroSubtitle:
      "Holdbarhet er nøkkelordet. Vi har levert innredning til en rekke skoler og barnehager over hele landet, og mange kunder kommer tilbake år etter år. Produktene våre skal tåle hard slitasje og holde seg moderne i mange år.",
    heroImage: "https://reolconsult.no/wp-content/uploads/2023/11/Skole-og-barnehage-1.jpg",
    breadcrumbLabel: "Skole & Barnehage",
    ctaTitle: "Skal skolen eller barnehagen innredes?",
    ctaBody: "Vi leverer holdbare møbler som tåler hard daglig bruk. Ta kontakt for et uforpliktende tilbud.",
    products: FALLBACK_PRODUCTS,
  });
  return <CategoryPageContent {...data} />;
}
