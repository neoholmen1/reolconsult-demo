export interface Product {
  id: string;
  name: string;
  category: string;
  categorySlug: string;
  description: string;
  features: string[];
  priceFrom: number;
  priceUnit: string;
  image: string;
}

export interface Category {
  slug: string;
  name: string;
  description: string;
  image: string;
}

export const categories: Category[] = [
  {
    slug: "lager",
    name: "Lagerinnredning",
    description: "Pallreoler, stålhyller, mesanin og komplettreoler for effektiv lagring.",
    image: "https://reolconsult.no/wp-content/uploads/2022/11/Hekta-Pa-Tur-2-scaled.jpg",
  },
  {
    slug: "butikk",
    name: "Butikkinnredning",
    description: "Gondoler, displayer og kassedisker for butikk og dagligvare.",
    image: "https://reolconsult.no/wp-content/uploads/2022/11/Dagligvare-Foodora.jpg",
  },
  {
    slug: "verksted",
    name: "Verksted",
    description: "Arbeidsbenker, verktøyskap og verkstedinnredning.",
    image: "https://reolconsult.no/wp-content/uploads/2018/08/arbeidsbord500.jpg",
  },
  {
    slug: "kontor",
    name: "Kontor",
    description: "Skrivebord, stoler og oppbevaringsløsninger.",
    image: "https://reolconsult.no/wp-content/uploads/2018/08/projectskrivebordv.jpg",
  },
  {
    slug: "garderobe",
    name: "Garderobe",
    description: "Garderobeskap og benker for arbeidsplasser.",
    image: "https://reolconsult.no/wp-content/uploads/2023/11/IMG_1148-scaled.jpg",
  },
  {
    slug: "skole",
    name: "Skole & barnehage",
    description: "Hyller og skap tilpasset skoler og barnehager.",
    image: "https://reolconsult.no/wp-content/uploads/2023/11/Skole-og-barnehage-1.jpg",
  },
];

export const products: Product[] = [
  // === LAGER ===
  {
    id: "pallreol",
    name: "Pallreoler",
    category: "Lagerinnredning",
    categorySlug: "lager",
    description: "Robuste pallreoler for tung lagring. Tilpasset europallar og industripaller. Leveres i ulike høyder og bredder.",
    features: ["Kapasitet opp til 3000 kg per nivå", "Justerbare bjelker", "Pulverlakkert stål", "Sertifisert etter EN 15512"],
    priceFrom: 2990,
    priceUnit: "per seksjon",
    image: "https://reolconsult.no/wp-content/uploads/2022/11/Pallreol-II-scaled.jpg",
  },
  {
    id: "smavarereol",
    name: "Småvarereol",
    category: "Lagerinnredning",
    categorySlug: "lager",
    description: "Stålhyller for småvarer og plukklager. Enkel montering uten bolter. Perfekt for organisering av mindre varer.",
    features: ["Boltfri montering", "Opp til 150 kg per hylle", "Justerbare hyller", "Finnes med stålhyller eller sponplatehyller"],
    priceFrom: 1490,
    priceUnit: "per seksjon",
    image: "https://reolconsult.no/wp-content/uploads/2022/11/Smavarereol-15-scaled.jpg",
  },
  {
    id: "grenreol",
    name: "Grenreoler",
    category: "Lagerinnredning",
    categorySlug: "lager",
    description: "Konsolreoler for lange og tunge varer som rør, stenger, plater og trelast. Ensidig eller dobbeltsidig.",
    features: ["For langgods og plater", "Armlengder opp til 1200 mm", "Kapasitet opp til 1000 kg per arm", "Ensidig eller dobbeltsidig"],
    priceFrom: 4990,
    priceUnit: "per seksjon",
    image: "https://reolconsult.no/wp-content/uploads/2022/11/Grenreol-Ahlsell-Klofta-scaled.jpg",
  },
  {
    id: "mesanin",
    name: "Mesanin / Mellometasje",
    category: "Lagerinnredning",
    categorySlug: "lager",
    description: "Doble lagerarealet ditt med en mesanin-løsning. Skreddersydd etter dine behov med trapp, rekkverk og belysning.",
    features: ["Skreddersydd til lokalet", "Kapasitet opp til 500 kg/m²", "Inkl. trapp og rekkverk", "Kan kombineres med reoler"],
    priceFrom: 14990,
    priceUnit: "per prosjekt",
    image: "https://reolconsult.no/wp-content/uploads/2022/11/Mesanin-6-1-scaled.jpeg",
  },
  {
    id: "universalreol",
    name: "Universalreoler",
    category: "Lagerinnredning",
    categorySlug: "lager",
    description: "Allsidig stålreol som passer til de fleste formål. Robust og fleksibel med justerbare hylleplan.",
    features: ["Allsidig bruk", "Justerbare hylleplan", "Opp til 300 kg per hylle", "Enkel å bygge ut"],
    priceFrom: 1990,
    priceUnit: "per seksjon",
    image: "https://reolconsult.no/wp-content/uploads/2023/11/Universalreol-kraftig.jpg",
  },
  {
    id: "dekkreol",
    name: "Dekkreoler",
    category: "Lagerinnredning",
    categorySlug: "lager",
    description: "Spesialreoler for lagring av dekk og felger. Optimert for bilverksteder og dekkhoteller.",
    features: ["Lagring av dekk på felg og uten felg", "Justerbar bredde", "Stabil konstruksjon", "Dekkvogner tilgjengelig"],
    priceFrom: 2490,
    priceUnit: "per seksjon",
    image: "https://reolconsult.no/wp-content/uploads/2022/11/Dekkreol-1.jpg",
  },
  {
    id: "flyttbart-kontor",
    name: "Flyttbare kontorer",
    category: "Lagerinnredning",
    categorySlug: "lager",
    description: "Innendørs kontorløsninger som plasseres i lagerhallen. Lyddempet og isolert. Rask montering.",
    features: ["6,6 m² eller 8,8 m² standard", "Lyddempende vegger", "Inkl. belysning og ventilasjon", "Rask montering"],
    priceFrom: 29990,
    priceUnit: "per enhet",
    image: "https://reolconsult.no/wp-content/uploads/2023/11/Flyttbart-kontor-8.jpg",
  },

  // === BUTIKK ===
  {
    id: "gondol",
    name: "Gondolreoler",
    category: "Butikkinnredning",
    categorySlug: "butikk",
    description: "Frittståede gondolreoler for butikk. Standard for dagligvare, byggvare og faghandel. Mange tilbehør.",
    features: ["Dobbeltsidig eller enkeltsidig", "Mange tilbehør: kroker, hyller, kurver", "Standard RAL-farger", "Enkel å flytte og rekonfigurere"],
    priceFrom: 2490,
    priceUnit: "per seksjon",
    image: "https://reolconsult.no/wp-content/uploads/2023/11/Gondolreoler-001.jpg",
  },
  {
    id: "kassedisk",
    name: "Kassedisker",
    category: "Butikkinnredning",
    categorySlug: "butikk",
    description: "Profesjonelle kassedisker tilpasset din butikk. Med plass til kasse, skanner og varebånd.",
    features: ["Skreddersydd lengde", "Integrert impulsvareplassering", "Laminat eller ståloverflate", "Tilpasset din kassaløsning"],
    priceFrom: 4990,
    priceUnit: "per stk",
    image: "https://reolconsult.no/wp-content/uploads/2022/11/Disk-Vrengen-Maritime-1-1-scaled.jpg",
  },
  {
    id: "butikkhyller",
    name: "Butikkhyller & displayer",
    category: "Butikkinnredning",
    categorySlug: "butikk",
    description: "Vegghyller, endedisplayer og spesialhyller for effektiv vareeksponering i butikk.",
    features: ["Vegmontert eller frittstående", "Spydskinner og kroker", "Prislistholdere inkludert", "Mange standardmål"],
    priceFrom: 1290,
    priceUnit: "per seksjon",
    image: "https://reolconsult.no/wp-content/uploads/2022/11/Ahlsell-1.jpg",
  },

  // === VERKSTED ===
  {
    id: "arbeidsbenk",
    name: "Arbeidsbenker",
    category: "Verksted",
    categorySlug: "verksted",
    description: "Solide arbeidsbenker for verksted og produksjon. Høydejusterbare og med ulike bordplater.",
    features: ["Bæreevne opp til 500 kg", "Bøk, stål eller laminat bordplate", "Justerbar høyde", "Skuffer og skap som tilbehør"],
    priceFrom: 3490,
    priceUnit: "per stk",
    image: "https://reolconsult.no/wp-content/uploads/2018/08/arbeidsbord500.jpg",
  },
  {
    id: "verktoyskap",
    name: "Verktøyskap",
    category: "Verksted",
    categorySlug: "verksted",
    description: "Industrielle skap for oppbevaring av verktøy og deler. Med skuffer, hyller eller kombinasjon.",
    features: ["Skuffer med kulelagerføring", "Sentrallås", "Opp til 200 kg per skuff", "Pulverlakkert stål"],
    priceFrom: 2990,
    priceUnit: "per stk",
    image: "https://reolconsult.no/wp-content/uploads/2023/11/Mesanin-33-med-vekstedinnredning-scaled.jpg",
  },
  {
    id: "verkstedhyller",
    name: "Verkstedhyller & tavler",
    category: "Verksted",
    categorySlug: "verksted",
    description: "Verktøytavler, redskapshyller og oppbevaringssystemer for et ryddig verksted.",
    features: ["Perforerte verktøytavler", "Kroker og holdere inkludert", "Veggmontert eller frittstående", "Kombiner med arbeidsbenk"],
    priceFrom: 990,
    priceUnit: "per stk",
    image: "https://reolconsult.no/wp-content/uploads/2022/11/Nettinghyller-4.jpg",
  },

  // === KONTOR ===
  {
    id: "skrivebord",
    name: "Skrivebord",
    category: "Kontor",
    categorySlug: "kontor",
    description: "Ergonomiske skrivebord med elektrisk hev/senk. Flere størrelser og farger tilgjengelig.",
    features: ["Elektrisk hev/senk", "60–125 cm regulering", "Bordplater fra 120 til 200 cm", "Kabelgjennomføring inkludert"],
    priceFrom: 3990,
    priceUnit: "per stk",
    image: "https://reolconsult.no/wp-content/uploads/2018/08/projectskrivebordv.jpg",
  },
  {
    id: "arkivskap",
    name: "Arkivskap & oppbevaring",
    category: "Kontor",
    categorySlug: "kontor",
    description: "Arkivskap, ringpermreoler og oppbevaringsløsninger for kontoret. Låsbart og brannklassifisert.",
    features: ["Låsbare dører", "Justerbare hyller", "Flere bredder og høyder", "RAL-farger etter ønske"],
    priceFrom: 1990,
    priceUnit: "per stk",
    image: "https://reolconsult.no/wp-content/uploads/2022/11/Smavarereol-1-1-scaled.jpg",
  },

  // === GARDEROBE ===
  {
    id: "garderobeskap",
    name: "Garderobeskap",
    category: "Garderobe",
    categorySlug: "garderobe",
    description: "Garderobeskap i stål for arbeidsplasser, treningssentre og skoler. 1-6 rom per skap.",
    features: ["1, 2, 3, 4 eller 6 rom", "Z-skap tilgjengelig", "Ventilasjonshull", "Hengelås eller sylinderås"],
    priceFrom: 1290,
    priceUnit: "per skap",
    image: "https://reolconsult.no/wp-content/uploads/2023/11/IMG_1148-scaled.jpg",
  },
  {
    id: "garderobebenk",
    name: "Garderobebenker",
    category: "Garderobe",
    categorySlug: "garderobe",
    description: "Garderobebenker i stål eller tre. Frittstående eller vegghengt. Med eller uten skohylle.",
    features: ["Stål eller tre", "Frittstående eller vegghengt", "Med/uten skohylle", "Standard og spesialmål"],
    priceFrom: 890,
    priceUnit: "per stk",
    image: "https://reolconsult.no/wp-content/uploads/2023/11/Skole-og-barnehage-1.jpg",
  },

  // === SKOLE ===
  {
    id: "elevskap",
    name: "Elevskap",
    category: "Skole & barnehage",
    categorySlug: "skole",
    description: "Kompakte elevskap for skoler. Tilgjengelig med 2, 3 eller 4 rom. Fargerike dører tilgjengelig.",
    features: ["2, 3 eller 4 rom", "Fargerike dører", "Ventilasjonshull", "Hengelås standard"],
    priceFrom: 990,
    priceUnit: "per skap",
    image: "https://reolconsult.no/wp-content/uploads/2023/11/Skole-og-barnehage-1.jpg",
  },
  {
    id: "skolehyller",
    name: "Skolehyller & oppbevaring",
    category: "Skole & barnehage",
    categorySlug: "skole",
    description: "Hyller og oppbevaringssystemer tilpasset skoler og barnehager. Trygge og robuste.",
    features: ["Avrundede kanter", "Lave høyder for barn", "Fargerike alternativer", "Robust konstruksjon"],
    priceFrom: 1490,
    priceUnit: "per seksjon",
    image: "https://reolconsult.no/wp-content/uploads/2022/11/Smavarereol-31.jpg",
  },
];
