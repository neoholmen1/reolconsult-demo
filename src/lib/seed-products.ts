/**
 * Seed-data: alle eksisterende hardkodede produkter på public-sidene, samlet
 * her for engangs-import til products-tabellen via /admin/import-produkter.
 *
 * Etter import er DB autoritativ — kunden kan redigere alt via admin.
 * FALLBACK_PRODUCTS-listene i src/app/produkter/{kategori}/page.tsx er fortsatt
 * tilstede som sikkerhetsnett om DB-en skulle bli tom igjen.
 */

export type SeedProduct = {
  category_slug: string;
  slug: string;
  title: string;
  short_description: string;
  long_description: string;
  hero_image_url: string | null;
  gallery_images: { url: string; alt: string }[];
  specs: string[];
  sort_order: number;
};

export const SEED_PRODUCTS: SeedProduct[] = [
  // ───── LAGER (7) ─────
  {
    category_slug: "lager",
    slug: "pallreoler",
    title: "Pallreoler",
    short_description: "Konvensjonelle pallreoler med ubegrenset tilgang til alle paller. Høyder opptil 30 meter.",
    long_description:
      "Våre pallreoler gir deg ubegrenset tilgang til alle paller, og kan leveres i høyder opptil 30 meter. Vi tilbyr konvensjonelle reoler i enkel og dobbel dybde, innskyvsreoler (drive-in) for maksimal utnyttelse av gulvplass, samt dynamiske pallreoler med automatisk fremføring. Systemet tilpasses alle palltyper — EUR-pall, engangspall og gitterpall — med kapasitet opptil 3.000 kg per pallplass. Alt leveres i galvanisert eller pulverlakkert stål. Komplett tilbehør inkluderer nettinghyller, pallstøtter, stolpebeskyttere og endeveggsnett. Send oss lagertegninger, så lager vi et uforpliktende forslag.",
    hero_image_url: "https://reolconsult.no/wp-content/uploads/2022/11/Hekta-Pa-Tur-2-scaled.jpg",
    gallery_images: [
      { url: "https://reolconsult.no/wp-content/uploads/2023/11/Pallreol-14191.jpg", alt: "" },
      { url: "https://reolconsult.no/wp-content/uploads/2022/11/Pallreol-II-scaled.jpg", alt: "" },
      { url: "https://reolconsult.no/wp-content/uploads/2022/11/Hekta-Pa-Tur-2-scaled.jpg", alt: "" },
      { url: "https://reolconsult.no/wp-content/uploads/2022/11/Nettinghyller-4.jpg", alt: "" },
      { url: "https://reolconsult.no/wp-content/uploads/2022/11/Pallreol-IV-scaled.jpg", alt: "" },
      { url: "https://reolconsult.no/wp-content/uploads/2022/11/Thoresen-Transport-1.jpg", alt: "" },
      { url: "https://reolconsult.no/wp-content/uploads/2022/11/Pallreol-1.jpg", alt: "" },
      { url: "https://reolconsult.no/wp-content/uploads/2023/11/Pallreoler-stigebeskyttere-021120101167.jpg", alt: "" },
      { url: "https://reolconsult.no/wp-content/uploads/2022/11/Dagligvare-Foodora-1.jpg", alt: "" },
    ],
    specs: ["Opptil 30 m høyde", "3.000 kg/pallplass", "Galvanisert stål", "Enkel/dobbel dybde", "Drive-in", "Uforpliktende prosjektering"],
    sort_order: 0,
  },
  {
    category_slug: "lager",
    slug: "mesanin",
    title: "Mesanin",
    short_description: "Doble gulvarealet ved å utnytte takhøyden. Bæreevne 250–1000 kg/m².",
    long_description:
      "En mesaninløsning dobler gulvarealet ditt ved å bygge en ekstra etasje inne i eksisterende bygg — perfekt for å utnytte takhøyden uten å flytte til større lokaler. Bæreevnen tilpasses fra 250 til 1000 kg/m² avhengig av behov. Leveres komplett med trappeløsninger og vareheiser, og kan kombineres med pallreoler under. Alt er godkjent etter gjeldende byggeforskrifter, med rekkverk og sikkerhetsutstyr inkludert. Vi kommer på befaring, måler opp og lager en komplett løsning.",
    hero_image_url: "https://reolconsult.no/wp-content/uploads/2022/11/Mesanin-6-scaled.jpeg",
    gallery_images: [
      { url: "https://reolconsult.no/wp-content/uploads/2022/11/Mesanin-6-scaled.jpeg", alt: "" },
      { url: "https://reolconsult.no/wp-content/uploads/2022/11/Mesanin-9.jpg", alt: "" },
      { url: "https://reolconsult.no/wp-content/uploads/2022/11/Floyd-april-2022-3.jpg", alt: "" },
      { url: "https://reolconsult.no/wp-content/uploads/2022/11/Mesanin-19.jpg", alt: "" },
      { url: "https://reolconsult.no/wp-content/uploads/2022/11/Mesanin-7.jpg", alt: "" },
    ],
    specs: ["250–1000 kg/m²", "Trapp og vareheis", "Godkjent etter byggeforskrifter", "Kombinerbar med pallreoler", "Befaring inkludert"],
    sort_order: 1,
  },
  {
    category_slug: "lager",
    slug: "smavarereoler",
    title: "Småvarereoler",
    short_description: "Høykvalitets hyllereol i galvanisert stål. Enkel montering uten verktøy.",
    long_description:
      "Våre småvarereoler i galvanisert stål er designet for enkel og rask montering uten verktøy, takket være et smart klikksystem. Hyllebredde fra 600 til 1200 mm, dybde 300–600 mm og høyde opptil 3000 mm. Kapasiteten er 80–250 kg per hylle, og hyllene justeres enkelt i 25 mm deling.",
    hero_image_url: "https://reolconsult.no/wp-content/uploads/2022/11/Smavarereol-15-scaled.jpg",
    gallery_images: [
      { url: "https://reolconsult.no/wp-content/uploads/2022/11/Smavarereol-15-scaled.jpg", alt: "" },
      { url: "https://reolconsult.no/wp-content/uploads/2022/11/Smavarereol-31.jpg", alt: "" },
      { url: "https://reolconsult.no/wp-content/uploads/2022/11/Smavarereol-1-1-scaled.jpg", alt: "" },
    ],
    specs: ["600–1200 mm bredde", "Opptil 3000 mm høyde", "80–250 kg/hylle", "25 mm deling", "Klikksystem", "Ingen verktøy"],
    sort_order: 2,
  },
  {
    category_slug: "lager",
    slug: "grenreoler",
    title: "Grenreoler",
    short_description: "For langgods som rør, stenger, profiler og planker.",
    long_description:
      "Grenreoler er spesialdesignet for lagring av langgods som rør, stenger, profiler og planker. Vi tilbyr både lett og tung variant. Montering skjer uten skruer, og tung variant kan galvaniseres for utendørs bruk.",
    hero_image_url: "https://reolconsult.no/wp-content/uploads/2022/11/Grenreol-Ahlsell-Klofta.jpg",
    gallery_images: [
      { url: "https://reolconsult.no/wp-content/uploads/2022/11/Grenreol-Ahlsell-Klofta.jpg", alt: "" },
      { url: "https://reolconsult.no/wp-content/uploads/2022/11/Grenreol-Hasas-1.jpg", alt: "" },
      { url: "https://reolconsult.no/wp-content/uploads/2022/11/Grenreol-I.jpg", alt: "" },
    ],
    specs: ["Lett og tung variant", "Montering uten skruer", "Kan galvaniseres", "Utendørs bruk"],
    sort_order: 3,
  },
  {
    category_slug: "lager",
    slug: "universalreoler",
    title: "Universalreoler",
    short_description: "Der småvarereoler er for smått og pallreoler for stort.",
    long_description:
      "Universalreoler fyller gapet mellom småvarereoler og pallreoler — ideelt for mellomstore og tunge varer. Fleksibelt system med hyller av sponplater eller stål, mange kombinasjonsmuligheter og enkel montering uten skruer.",
    hero_image_url: "https://reolconsult.no/wp-content/uploads/2023/11/Universalreol-kraftig.jpg",
    gallery_images: [
      { url: "https://reolconsult.no/wp-content/uploads/2023/11/Universalreol-kraftig.jpg", alt: "" },
      { url: "https://reolconsult.no/wp-content/uploads/2022/11/Universalreol-1.jpg", alt: "" },
    ],
    specs: ["Fleksibelt system", "Sponplater eller stål", "Enkel montering", "Kombinerbart"],
    sort_order: 4,
  },
  {
    category_slug: "lager",
    slug: "spesialreoler",
    title: "Spesialreoler",
    short_description: "Dekkreoler, båtreoler og trelastreoler tilpasset dine behov.",
    long_description:
      "Vi leverer spesialreoler for dekk, båter og trelast — alle tilpasset dine spesifikke behov. Galvanisert finish for lang levetid.",
    hero_image_url: "https://reolconsult.no/wp-content/uploads/2022/11/Dekkreol-1.jpg",
    gallery_images: [
      { url: "https://reolconsult.no/wp-content/uploads/2022/11/Dekkreol-1.jpg", alt: "" },
      { url: "https://reolconsult.no/wp-content/uploads/2022/11/Medo-Marina-1.jpg", alt: "" },
    ],
    specs: ["Dekkreoler", "Båtreoler", "Trelastreoler", "Galvanisert", "Spesialtilpasset"],
    sort_order: 5,
  },
  {
    category_slug: "lager",
    slug: "hms-sikkerhetskontroll",
    title: "HMS Sikkerhetskontroll",
    short_description: "Lovpålagt kontroll av pallreoler og lagerinnredning.",
    long_description:
      "Alle virksomheter med lagerreoler er pålagt å gjennomføre regelmessig sikkerhetskontroll. Vi utfører visuell inspeksjon av alle komponenter. Du mottar en skriftlig rapport med tilstandsvurdering, fotografier og konkrete anbefalinger.",
    hero_image_url: "https://reolconsult.no/wp-content/uploads/2022/11/Pallreol-1.jpg",
    gallery_images: [],
    specs: ["Visuell inspeksjon", "Grønn/gul/rød merking", "Skriftlig rapport", "Hele Østlandet"],
    sort_order: 6,
  },

  // ───── BUTIKK (3) ─────
  {
    category_slug: "butikk",
    slug: "gondoler-veggsystemer",
    title: "Gondoler & Veggsystemer",
    short_description: "Enkel- og dobbeltsidig med justerbare hyller. Tåler tøff daglig bruk i mange år.",
    long_description:
      "Grunnsystemet er utviklet etter svensk byggestandard — robust nok til å bære stativ, hyller, skilter og belysning. Enkel- og dobbeltsidig med justerbare hyller og kroker som tilpasses enkelt etter butikkens behov.",
    hero_image_url: "https://reolconsult.no/wp-content/uploads/2022/11/Verdal-15-scaled.jpeg",
    gallery_images: [
      { url: "https://reolconsult.no/wp-content/uploads/2022/11/Verdal-15-scaled.jpeg", alt: "" },
      { url: "https://reolconsult.no/wp-content/uploads/2022/11/Ahlsell-1.jpg", alt: "" },
      { url: "https://reolconsult.no/wp-content/uploads/2022/11/TESS-18-scaled.jpeg", alt: "" },
    ],
    specs: ["Svensk byggestandard", "Enkel- og dobbeltsidig", "Justerbare hyller", "Enkel montering", "Enkelt å utvide"],
    sort_order: 0,
  },
  {
    category_slug: "butikk",
    slug: "disker",
    title: "Disker",
    short_description: "Robust, modulbasert disksystem fra Sverige med topplater for høy slitestyrke.",
    long_description:
      "Vårt fleksible, modulbaserte disksystem fra Sverige bygges akkurat slik du ønsker. Standardfarger front i hvit, svart eller grå.",
    hero_image_url: "https://reolconsult.no/wp-content/uploads/2022/11/Disk-Vrengen-Maritime-1-scaled.jpg",
    gallery_images: [
      { url: "https://reolconsult.no/wp-content/uploads/2022/11/Disk-Vrengen-Maritime-1-scaled.jpg", alt: "" },
      { url: "https://reolconsult.no/wp-content/uploads/2022/11/Disk-TESS-Elverum.jpg", alt: "" },
    ],
    specs: ["Modulbasert", "Hvit/svart/grå front", "LED-belysning", "Skranketopp", "Skreddersydd"],
    sort_order: 1,
  },
  {
    category_slug: "butikk",
    slug: "tilbehor",
    title: "Tilbehør",
    short_description: "Prislister, skiltholdere, varesikring, belysning og mer.",
    long_description: "Komplett utvalg av tilbehør for butikkinnredning.",
    hero_image_url: "https://reolconsult.no/wp-content/uploads/2020/03/Enkeltspyd-for-spydskinne-L300mm-Ø8-Art.-2327-L400mm-Ø8-Art.-2328.jpg",
    gallery_images: [
      { url: "https://reolconsult.no/wp-content/uploads/2023/11/Brosjyrestativ-007.jpg", alt: "" },
    ],
    specs: ["Prislister", "Skiltholdere", "Varesikring", "LED-belysning", "Kroker og konsoller"],
    sort_order: 2,
  },

  // ───── KONTOR (5) ─────
  {
    category_slug: "kontor",
    slug: "skrivebord",
    title: "Skrivebord",
    short_description: "Hev/senk-bord, faste skrivebord og hjørneplasser. Ergonomisk og tilpasningsdyktig.",
    long_description:
      "Bredt utvalg skrivebord tilpasset moderne kontormiljøer. Elektrisk hev/senk for ergonomisk tilpasning, faste skrivebord og hjørneplasser.",
    hero_image_url: "https://reolconsult.no/wp-content/uploads/2018/08/projectskrivebordv.jpg",
    gallery_images: [
      { url: "https://reolconsult.no/wp-content/uploads/2018/08/projectskrivebordv.jpg", alt: "" },
      { url: "https://reolconsult.no/wp-content/uploads/2023/11/Kontormiljo-2.jpg", alt: "" },
    ],
    specs: ["Elektrisk hev/senk", "Faste skrivebord", "Hjørneplasser", "Kabelkanaler", "Monitorarmer", "Bordskjermer"],
    sort_order: 0,
  },
  {
    category_slug: "kontor",
    slug: "kontorstoler",
    title: "Kontorstoler",
    short_description: "Ergonomiske kontorstoler, konferansestoler og besøksstoler.",
    long_description: "Ergonomiske kontorstoler med justerbar korsryggstøtte, armlener og setedybde.",
    hero_image_url: "https://reolconsult.no/wp-content/uploads/2023/11/Savo-1.jpg",
    gallery_images: [
      { url: "https://reolconsult.no/wp-content/uploads/2023/11/Savo-1.jpg", alt: "" },
    ],
    specs: ["Justerbar korsryggstøtte", "Justerbare armlener", "Setedybde", "Konferansestoler", "Besøksstoler"],
    sort_order: 1,
  },
  {
    category_slug: "kontor",
    slug: "oppbevaring",
    title: "Oppbevaring",
    short_description: "Arkivskap, reolsystemer og låsbare skap.",
    long_description: "Arkivskap, reolsystemer og låsbare skap.",
    hero_image_url: "https://reolconsult.no/wp-content/uploads/2023/11/Oppbevaring-18.jpg",
    gallery_images: [
      { url: "https://reolconsult.no/wp-content/uploads/2023/11/Oppbevaring-18.jpg", alt: "" },
    ],
    specs: ["Arkivskap", "Hengemapper", "Reolsystemer", "Låsbare skap", "Fleksibel inndeling"],
    sort_order: 2,
  },
  {
    category_slug: "kontor",
    slug: "resepsjon-konferanse",
    title: "Resepsjon & Konferanse",
    short_description: "Resepsjonsdisker etter mål og konferansebord i flere størrelser.",
    long_description: "Resepsjonsdisker bygges etter mål. Konferansebord i flere størrelser.",
    hero_image_url: "https://reolconsult.no/wp-content/uploads/2023/11/Skranke-resepsjon-3.jpg",
    gallery_images: [
      { url: "https://reolconsult.no/wp-content/uploads/2023/11/Skranke-resepsjon-3.jpg", alt: "" },
    ],
    specs: ["Resepsjonsdisker etter mål", "Konferansebord", "Flere størrelser", "Komplett leveranse"],
    sort_order: 3,
  },
  {
    category_slug: "kontor",
    slug: "skjermvegger",
    title: "Skjermvegger",
    short_description: "Støydempende paneler for åpne kontorlandskap.",
    long_description: "Støydempende paneler. Frittstående eller bordmontert.",
    hero_image_url: "https://reolconsult.no/wp-content/uploads/2023/11/Ab_Stitch-scaled.jpg",
    gallery_images: [
      { url: "https://reolconsult.no/wp-content/uploads/2023/11/Ab_Stitch-scaled.jpg", alt: "" },
    ],
    specs: ["Støydempende", "Frittstående", "Bordmontert", "Mange farger"],
    sort_order: 4,
  },

  // ───── VERKSTED (5) ─────
  {
    category_slug: "verksted",
    slug: "arbeidsbord",
    title: "Arbeidsbord",
    short_description: "Manuelt justerbare, elektrisk hev/senk, pakkebord og rullebord.",
    long_description:
      "Komplett utvalg arbeidsbord — manuelt og elektrisk hev/senk, pakkebord og rullebord. Bordplater i bøk, laminat, stål eller ESD-sikre varianter.",
    hero_image_url: "https://reolconsult.no/wp-content/uploads/2018/08/arbeidsbord500.jpg",
    gallery_images: [
      { url: "https://reolconsult.no/wp-content/uploads/2018/08/arbeidsbord500.jpg", alt: "" },
    ],
    specs: ["Manuell hev/senk", "Elektrisk hev/senk", "Pakkebord", "Rullebord", "ESD-sikre varianter"],
    sort_order: 0,
  },
  {
    category_slug: "verksted",
    slug: "verktoyskap-oppbevaring",
    title: "Verktøyskap & Oppbevaring",
    short_description: "Skap med perforerte dører, skuffeseksjoner, verktøytavler.",
    long_description: "Verktøyskap med perforerte dører. Industriskuffer med kulelagerføringer.",
    hero_image_url: "https://reolconsult.no/wp-content/uploads/2018/08/hjemmeside60.jpg",
    gallery_images: [
      { url: "https://reolconsult.no/wp-content/uploads/2018/08/hjemmeside60.jpg", alt: "" },
    ],
    specs: ["Perforerte dører", "Låsbare skap", "Kulelagerføringer", "Sentrallås", "Verktøytavler"],
    sort_order: 1,
  },
  {
    category_slug: "verksted",
    slug: "transport",
    title: "Transport",
    short_description: "Traller, vogner og transportløsninger for intern logistikk.",
    long_description: "Plattformtraller, hylletraller, reoltraller og spesialtilpassede transportvogner.",
    hero_image_url: "https://reolconsult.no/wp-content/uploads/2018/08/hjemmeside130.jpg",
    gallery_images: [
      { url: "https://reolconsult.no/wp-content/uploads/2018/08/hjemmeside130.jpg", alt: "" },
    ],
    specs: ["Plattformtraller", "Hylletraller", "Reoltraller", "Transportvogner", "Rullebaner"],
    sort_order: 2,
  },
  {
    category_slug: "verksted",
    slug: "miljosikring",
    title: "Miljøsikring",
    short_description: "Oppsamlingskar, spillbarrierer og miljøsikringsprodukter.",
    long_description: "Oppsamlingskar, spillbarrierer og absorpsjonsmidler — godkjent etter miljøforskrifter.",
    hero_image_url: "https://reolconsult.no/wp-content/uploads/2018/08/hjemmeside210.jpg",
    gallery_images: [
      { url: "https://reolconsult.no/wp-content/uploads/2018/08/hjemmeside210.jpg", alt: "" },
    ],
    specs: ["Oppsamlingskar", "Spillbarrierer", "Absorpsjonsmidler", "Miljøgodkjent"],
    sort_order: 3,
  },
  {
    category_slug: "verksted",
    slug: "lofteutstyr",
    title: "Løfteutstyr",
    short_description: "Løftebord, stablere og annet løfteutstyr.",
    long_description: "Stasjonære og mobile løftebord for ergonomisk arbeidshøyde, hydraulisk eller elektrisk.",
    hero_image_url: "https://reolconsult.no/wp-content/uploads/2018/08/hjemmeside220.jpg",
    gallery_images: [
      { url: "https://reolconsult.no/wp-content/uploads/2018/08/hjemmeside220.jpg", alt: "" },
    ],
    specs: ["Løftebord", "Stablere", "Hydraulisk/elektrisk", "Fra 300 kg", "Mobile og stasjonære"],
    sort_order: 4,
  },

  // ───── GARDEROBE (4) ─────
  {
    category_slug: "garderobe",
    slug: "garderobeskap",
    title: "Garderobeskap",
    short_description: "1-4 roms skap og Z-skap. Velg dørtype, materialer, farger og lås.",
    long_description:
      "Garderobeskap i 1-4 roms konfigurasjon og Z-skap. Velg mellom ståldør, laminatdør, kryssfiner og finér.",
    hero_image_url: "https://reolconsult.no/wp-content/uploads/2023/11/IMG_1148-scaled.jpg",
    gallery_images: [
      { url: "https://reolconsult.no/wp-content/uploads/2023/11/IMG_1148-scaled.jpg", alt: "" },
      { url: "https://reolconsult.no/wp-content/uploads/2023/11/IMG_1149-scaled.jpg", alt: "" },
    ],
    specs: ["1-4 roms og Z-skap", "Ståldør", "Laminatdør", "Kryssfiner/finér", "Galvanisert stål", "Hengelås / kodelås / RFID"],
    sort_order: 0,
  },
  {
    category_slug: "garderobe",
    slug: "skoleskap",
    title: "Skoleskap",
    short_description: "Robuste skap for skolemiljø. Tåler hard slitasje.",
    long_description: "Ekstra robuste garderobeskap utviklet spesielt for skolemiljøer.",
    hero_image_url: "https://reolconsult.no/wp-content/uploads/2023/11/IMG_1152-scaled.jpg",
    gallery_images: [],
    specs: ["Ekstra robust", "Skolemiljø", "Mange farger", "Lang levetid"],
    sort_order: 1,
  },
  {
    category_slug: "garderobe",
    slug: "ladeskap-pc-skap",
    title: "Ladeskap & PC-skap",
    short_description: "Sikker lading og oppbevaring av mobiler, nettbrett og PC.",
    long_description: "Sikker lading og oppbevaring. Integrerte stikkontakter og USB-porter. Låsbare rom.",
    hero_image_url: "https://reolconsult.no/wp-content/uploads/2023/11/IMG_1151-scaled.jpg",
    gallery_images: [],
    specs: ["Integrert lading", "USB-porter", "Låsbare rom", "Mobil og nettbrett", "PC-oppbevaring"],
    sort_order: 2,
  },
  {
    category_slug: "garderobe",
    slug: "garderobe-tilbehor",
    title: "Tilbehør",
    short_description: "Skohyller, sittebenker, navneskilt og låssystemer.",
    long_description: "Komplett tilbehørssortiment for garderoberommet.",
    hero_image_url: "https://reolconsult.no/wp-content/uploads/2023/11/Skohyller.jpg",
    gallery_images: [
      { url: "https://reolconsult.no/wp-content/uploads/2023/11/Skohyller.jpg", alt: "" },
    ],
    specs: ["Skohyller", "Sittebenker", "Navneskilt", "Nummerskilt", "Låssystemer"],
    sort_order: 3,
  },

  // ───── SKOLE (4) ─────
  {
    category_slug: "skole",
    slug: "skoleinnredning",
    title: "Skoleinnredning",
    short_description: "Elevpulter, stoler, tavler og elevskap. Justerbar høyde for alle aldersgrupper.",
    long_description:
      "Komplett innredning for skolen — elevpulter, stoler, tavler og elevskap. Holdbarhet er nøkkelordet.",
    hero_image_url: "https://reolconsult.no/wp-content/uploads/2023/11/IMG_1153.jpg",
    gallery_images: [
      { url: "https://reolconsult.no/wp-content/uploads/2023/11/IMG_1153.jpg", alt: "" },
    ],
    specs: ["Elevpulter", "Justerbar høyde", "Stoler", "Tavler", "Elevskap", "Holdbart design"],
    sort_order: 0,
  },
  {
    category_slug: "skole",
    slug: "barnehage",
    title: "Barnehageinnredning",
    short_description: "Barnestoler, småbord, stellebord og hvileløsninger for de minste.",
    long_description:
      "Barnestoler og bord tilpasset de minste. Stellebord godkjent etter forskrifter. Madrasser og hvileløsninger.",
    hero_image_url: "https://reolconsult.no/wp-content/uploads/2023/11/Skole-og-barnehage-2.jpg",
    gallery_images: [
      { url: "https://reolconsult.no/wp-content/uploads/2023/11/Skole-og-barnehage-2.jpg", alt: "" },
    ],
    specs: ["Barnestoler og bord", "Stellebord", "Godkjent etter forskrift", "Madrasser", "Hvileløsninger"],
    sort_order: 1,
  },
  {
    category_slug: "skole",
    slug: "fellesarealer",
    title: "Fellesarealer",
    short_description: "Sofaer, benker og møbler for fellesarealer og personalrom.",
    long_description: "Møbler for fellesarealer, personalrom og samlingsplasser.",
    hero_image_url: "https://reolconsult.no/wp-content/uploads/2023/11/Skole-og-barnehage-1.jpg",
    gallery_images: [
      { url: "https://reolconsult.no/wp-content/uploads/2023/11/Skole-og-barnehage-1.jpg", alt: "" },
    ],
    specs: ["Sofaer", "Benker", "Sittegrupper", "Personalrom", "Holdbare materialer"],
    sort_order: 2,
  },
  {
    category_slug: "skole",
    slug: "skole-oppbevaring",
    title: "Oppbevaring",
    short_description: "Åpen innredning for leker og materiell i barnvennlig design.",
    long_description: "Åpen innredning for leker og materiell i barnvennlig design og tilpasset høyde.",
    hero_image_url: "https://reolconsult.no/wp-content/uploads/2023/11/Skole-og-barnehage-2.jpg",
    gallery_images: [],
    specs: ["Barnvennlig design", "Tilpasset høyde", "Åpen innredning", "Fleksibel inndeling", "Trygt og enkelt"],
    sort_order: 3,
  },
];
