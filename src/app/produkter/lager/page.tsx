import { getCategoryPageData } from "@/lib/category-page-data";
import CategoryPageContent, { type CategoryProduct } from "@/components/CategoryPageContent";

const FALLBACK_PRODUCTS: CategoryProduct[] = [
  {
    id: "pallreoler",
    title: "Pallreoler",
    shortDesc: "Konvensjonelle pallreoler med ubegrenset tilgang til alle paller. Høyder opptil 30 meter.",
    image: "https://reolconsult.no/wp-content/uploads/2022/11/Hekta-Pa-Tur-2-scaled.jpg",
    modal: {
      title: "Pallreoler",
      description:
        "Våre pallreoler gir deg ubegrenset tilgang til alle paller, og kan leveres i høyder opptil 30 meter. Vi tilbyr konvensjonelle reoler i enkel og dobbel dybde, innskyvsreoler (drive-in) for maksimal utnyttelse av gulvplass, samt dynamiske pallreoler med automatisk fremføring. Systemet tilpasses alle palltyper — EUR-pall, engangspall og gitterpall — med kapasitet opptil 3.000 kg per pallplass. Alt leveres i galvanisert eller pulverlakkert stål. Komplett tilbehør inkluderer nettinghyller, pallstøtter, stolpebeskyttere og endeveggsnett. Send oss lagertegninger, så lager vi et uforpliktende forslag.",
      images: [
        "https://reolconsult.no/wp-content/uploads/2023/11/Pallreol-14191.jpg",
        "https://reolconsult.no/wp-content/uploads/2022/11/Pallreol-II-scaled.jpg",
        "https://reolconsult.no/wp-content/uploads/2022/11/Hekta-Pa-Tur-2-scaled.jpg",
        "https://reolconsult.no/wp-content/uploads/2022/11/Nettinghyller-4.jpg",
        "https://reolconsult.no/wp-content/uploads/2022/11/Pallreol-IV-scaled.jpg",
        "https://reolconsult.no/wp-content/uploads/2022/11/Thoresen-Transport-1.jpg",
        "https://reolconsult.no/wp-content/uploads/2022/11/Pallreol-1.jpg",
        "https://reolconsult.no/wp-content/uploads/2023/11/Pallreoler-stigebeskyttere-021120101167.jpg",
        "https://reolconsult.no/wp-content/uploads/2022/11/Dagligvare-Foodora-1.jpg",
      ],
      specs: ["Opptil 30 m høyde", "3.000 kg/pallplass", "Galvanisert stål", "Enkel/dobbel dybde", "Drive-in", "Uforpliktende prosjektering"],
    },
  },
  {
    id: "mesanin",
    title: "Mesanin",
    shortDesc: "Doble gulvarealet ved å utnytte takhøyden. Bæreevne 250–1000 kg/m².",
    image: "https://reolconsult.no/wp-content/uploads/2022/11/Mesanin-6-scaled.jpeg",
    modal: {
      title: "Mesanin",
      description:
        "En mesaninløsning dobler gulvarealet ditt ved å bygge en ekstra etasje inne i eksisterende bygg — perfekt for å utnytte takhøyden uten å flytte til større lokaler. Bæreevnen tilpasses fra 250 til 1000 kg/m² avhengig av behov. Leveres komplett med trappeløsninger og vareheiser, og kan kombineres med pallreoler under. Alt er godkjent etter gjeldende byggeforskrifter, med rekkverk og sikkerhetsutstyr inkludert. Vi kommer på befaring, måler opp og lager en komplett løsning.",
      images: [
        "https://reolconsult.no/wp-content/uploads/2022/11/Mesanin-6-scaled.jpeg",
        "https://reolconsult.no/wp-content/uploads/2022/11/Mesanin-9.jpg",
        "https://reolconsult.no/wp-content/uploads/2022/11/Floyd-april-2022-3.jpg",
        "https://reolconsult.no/wp-content/uploads/2022/11/Mesanin-19.jpg",
        "https://reolconsult.no/wp-content/uploads/2022/11/Mesanin-7.jpg",
      ],
      specs: ["250–1000 kg/m²", "Trapp og vareheis", "Godkjent etter byggeforskrifter", "Kombinerbar med pallreoler", "Befaring inkludert"],
    },
  },
  {
    id: "smavarereoler",
    title: "Småvarereoler",
    shortDesc: "Høykvalitets hyllereol i galvanisert stål. Enkel montering uten verktøy.",
    image: "https://reolconsult.no/wp-content/uploads/2022/11/Smavarereol-15-scaled.jpg",
    modal: {
      title: "Småvarereoler",
      description:
        "Våre småvarereoler i galvanisert stål er designet for enkel og rask montering uten verktøy, takket være et smart klikksystem. Hyllebredde fra 600 til 1200 mm, dybde 300–600 mm og høyde opptil 3000 mm. Kapasiteten er 80–250 kg per hylle, og hyllene justeres enkelt i 25 mm deling.",
      images: [
        "https://reolconsult.no/wp-content/uploads/2022/11/Smavarereol-15-scaled.jpg",
        "https://reolconsult.no/wp-content/uploads/2022/11/Smavarereol-31.jpg",
        "https://reolconsult.no/wp-content/uploads/2022/11/Smavarereol-1-1-scaled.jpg",
      ],
      specs: ["600–1200 mm bredde", "Opptil 3000 mm høyde", "80–250 kg/hylle", "25 mm deling", "Klikksystem", "Ingen verktøy"],
    },
  },
  {
    id: "grenreoler",
    title: "Grenreoler",
    shortDesc: "For langgods som rør, stenger, profiler og planker.",
    image: "https://reolconsult.no/wp-content/uploads/2022/11/Grenreol-Ahlsell-Klofta.jpg",
    modal: {
      title: "Grenreoler",
      description:
        "Grenreoler er spesialdesignet for lagring av langgods som rør, stenger, profiler og planker. Vi tilbyr både lett og tung variant. Montering skjer uten skruer, og tung variant kan galvaniseres for utendørs bruk.",
      images: [
        "https://reolconsult.no/wp-content/uploads/2022/11/Grenreol-Ahlsell-Klofta.jpg",
        "https://reolconsult.no/wp-content/uploads/2022/11/Grenreol-Hasas-1.jpg",
        "https://reolconsult.no/wp-content/uploads/2022/11/Grenreol-I.jpg",
      ],
      specs: ["Lett og tung variant", "Montering uten skruer", "Kan galvaniseres", "Utendørs bruk"],
    },
  },
  {
    id: "universalreoler",
    title: "Universalreoler",
    shortDesc: "Der småvarereoler er for smått og pallreoler for stort.",
    image: "https://reolconsult.no/wp-content/uploads/2023/11/Universalreol-kraftig.jpg",
    modal: {
      title: "Universalreoler",
      description:
        "Universalreoler fyller gapet mellom småvarereoler og pallreoler — ideelt for mellomstore og tunge varer. Fleksibelt system med hyller av sponplater eller stål, mange kombinasjonsmuligheter og enkel montering uten skruer.",
      images: [
        "https://reolconsult.no/wp-content/uploads/2023/11/Universalreol-kraftig.jpg",
        "https://reolconsult.no/wp-content/uploads/2022/11/Universalreol-1.jpg",
      ],
      specs: ["Fleksibelt system", "Sponplater eller stål", "Enkel montering", "Kombinerbart"],
    },
  },
  {
    id: "spesialreoler",
    title: "Spesialreoler",
    shortDesc: "Dekkreoler, båtreoler og trelastreoler tilpasset dine behov.",
    image: "https://reolconsult.no/wp-content/uploads/2022/11/Dekkreol-1.jpg",
    modal: {
      title: "Spesialreoler",
      description:
        "Vi leverer spesialreoler for dekk, båter og trelast — alle tilpasset dine spesifikke behov. Galvanisert finish for lang levetid.",
      images: [
        "https://reolconsult.no/wp-content/uploads/2022/11/Dekkreol-1.jpg",
        "https://reolconsult.no/wp-content/uploads/2022/11/Medo-Marina-1.jpg",
      ],
      specs: ["Dekkreoler", "Båtreoler", "Trelastreoler", "Galvanisert", "Spesialtilpasset"],
    },
  },
  {
    id: "hms",
    title: "HMS Sikkerhetskontroll",
    shortDesc: "Lovpålagt kontroll av pallreoler og lagerinnredning.",
    image: "https://reolconsult.no/wp-content/uploads/2022/11/Pallreol-1.jpg",
    modal: {
      title: "HMS Sikkerhetskontroll",
      description:
        "Alle virksomheter med lagerreoler er pålagt å gjennomføre regelmessig sikkerhetskontroll. Vi utfører visuell inspeksjon av alle komponenter. Du mottar en skriftlig rapport med tilstandsvurdering, fotografier og konkrete anbefalinger.",
      specs: ["Visuell inspeksjon", "Grønn/gul/rød merking", "Skriftlig rapport", "Hele Østlandet"],
    },
  },
];

export default async function LagerPage() {
  const data = await getCategoryPageData("lager", {
    heroTitle: "Lagerinnredning",
    heroSubtitle:
      "Robuste lagerreoler i galvanisert stål — pallreoler, hyllereoler, dekkreoler, hjørnereoler og mer. Konkurransedyktige priser.",
    heroImage: "https://reolconsult.no/wp-content/uploads/2022/11/Hekta-Pa-Tur-2-scaled.jpg",
    breadcrumbLabel: "Lager",
    ctaTitle: "Skal du planlegge nytt lager?",
    ctaBody: "Send oss tegninger eller mål, så lager vi et uforpliktende forslag. Vi leverer og monterer over hele landet.",
    products: FALLBACK_PRODUCTS,
  });
  return <CategoryPageContent {...data} />;
}
