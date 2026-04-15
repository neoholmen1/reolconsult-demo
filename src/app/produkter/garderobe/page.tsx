"use client";

import { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { useRouter } from "next/navigation";
import AnimateOnScroll from "@/components/AnimateOnScroll";
import ProductModal, { type ProductModalData } from "@/components/ProductModal";

interface Product {
  title: string;
  shortDesc: string;
  image?: string;
  icon?: string;
  modal: ProductModalData;
}

const products: Product[] = [
  {
    title: "Garderobeskap",
    shortDesc:
      "1-4 roms skap og Z-skap. Velg dørtype, materialer, farger og lås.",
    image:
      "https://reolconsult.no/wp-content/uploads/2023/11/IMG_1148-scaled.jpg",
    modal: {
      title: "Garderobeskap",
      description:
        "Våre garderobeskap leveres i 1-4 roms konfigurasjon og Z-skap. Velg mellom ståldør med 15mm sandwich-konstruksjon, lyddempende med skjulte hengsler og dørstopper. Laminatdør i fuktbestandig MDF-kjerne, tilgjengelig i mange farger. Kryssfiner og finér for et dekorativt og vakkert uttrykk. Galvanisert stål for fuktige rom. Låsalternativer inkluderer hengelås, kodelås, RFID og myntsystem. Ventilasjon er valgfritt i alle modeller. Vi har et stort utvalg standardfarger pluss mulighet for spesialfarger.",
      images: [
        "https://reolconsult.no/wp-content/uploads/2023/11/IMG_1148-scaled.jpg",
        "https://reolconsult.no/wp-content/uploads/2023/11/IMG_1149-scaled.jpg",
        "https://reolconsult.no/wp-content/uploads/2023/11/IMG_1150-scaled.jpg",
        "https://reolconsult.no/wp-content/uploads/2023/11/IMG_1151-scaled.jpg",
        "https://reolconsult.no/wp-content/uploads/2023/11/IMG_1152-scaled.jpg",
        "https://reolconsult.no/wp-content/uploads/2023/11/Skohyller.jpg",
        "https://reolconsult.no/wp-content/uploads/2023/11/Standard-farger.jpg",
      ],
      specs: [
        "1-4 roms og Z-skap",
        "Ståldør",
        "Laminatdør",
        "Kryssfiner/finér",
        "Galvanisert stål",
        "Hengelås / kodelås / RFID",
        "Ventilasjon valgfritt",
        "Spesialfarger",
      ],
    },
  },
  {
    title: "Skoleskap",
    shortDesc: "Robuste skap for skolemiljø. Tåler hard slitasje.",
    image:
      "https://reolconsult.no/wp-content/uploads/2023/11/IMG_1152-scaled.jpg",
    modal: {
      title: "Skoleskap",
      description:
        "Ekstra robuste garderobeskap utviklet spesielt for skolemiljøer der utstyret utsettes for daglig hard bruk. Tilgjengelig i mange fargekombinasjoner som passer til skolens profil. Konstruert for å tåle tøff behandling over mange år.",
      specs: [
        "Ekstra robust",
        "Skolemiljø",
        "Mange farger",
        "Lang levetid",
      ],
    },
  },
  {
    title: "Ladeskap & PC-skap",
    shortDesc:
      "Sikker lading og oppbevaring av mobiler, nettbrett og PC.",
    image:
      "https://reolconsult.no/wp-content/uploads/2023/11/IMG_1151-scaled.jpg",
    modal: {
      title: "Ladeskap & PC-skap",
      description:
        "Sikker lading og oppbevaring av mobiler, nettbrett og PC-er. Integrerte stikkontakter og USB-porter sørger for enkel og sikker lading. Låsbare rom beskytter verdifullt utstyr. Perfekt for skoler, kontorer og offentlige bygg.",
      specs: [
        "Integrert lading",
        "USB-porter",
        "Låsbare rom",
        "Mobil og nettbrett",
        "PC-oppbevaring",
      ],
    },
  },
  {
    title: "Tilbehør",
    shortDesc: "Skohyller, sittebenker, navneskilt og låssystemer.",
    image:
      "https://reolconsult.no/wp-content/uploads/2023/11/Skohyller.jpg",
    modal: {
      title: "Tilbehør",
      description:
        "Komplett tilbehørssortiment for garderoberommet. Skohyller i flere bredder, sittebenker for komfortabel omkleding, navneskilt og nummerskilt for enkel identifisering, og låssystemer i flere varianter. Alt for å skape et funksjonelt og trivelig garderoberom.",
      images: [
        "https://reolconsult.no/wp-content/uploads/2023/11/Skohyller.jpg",
      ],
      specs: [
        "Skohyller",
        "Sittebenker",
        "Navneskilt",
        "Nummerskilt",
        "Låssystemer",
      ],
    },
  },
  {
    title: "Fargevalg",
    shortDesc: "Se vårt utvalg av standardfarger og spesialfarger.",
    image:
      "https://reolconsult.no/wp-content/uploads/2023/11/Standard-farger.jpg",
    modal: {
      title: "Fargevalg",
      description:
        "Vi tilbyr et stort utvalg standardfarger som dekker de fleste behov, pluss mulighet for spesialfarger tilpasset din bedrifts profil eller ønsket design. Alle farger er tilgjengelige for både garderobeskap, skoleskap og tilbehør. Ta kontakt for fargeprøver.",
      images: [
        "https://reolconsult.no/wp-content/uploads/2023/11/Standard-farger.jpg",
      ],
      specs: [
        "Standardfarger",
        "Spesialfarger",
        "Fargeprøver tilgjengelig",
      ],
    },
  },
];

function ProductCard({
  product,
  index,
  onClick,
}: {
  product: Product;
  index: number;
  onClick: () => void;
}) {
  return (
    <AnimateOnScroll delay={index * 0.08}>
      <button
        onClick={onClick}
        className="group w-full text-left rounded-xl overflow-hidden bg-white shadow-[0_1px_3px_rgba(0,0,0,0.06)] transition-all duration-300 hover:shadow-[0_12px_40px_rgba(0,0,0,0.1)] hover:-translate-y-1"
      >
        {product.image ? (
          <div className="relative aspect-[4/3] overflow-hidden bg-bg-light">
            <Image
              src={product.image}
              alt={product.title}
              fill
              sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
              className="object-cover transition-transform duration-500 group-hover:scale-[1.04]"
            />
          </div>
        ) : (
          <div className="aspect-[4/3] flex flex-col items-center justify-center gap-3 bg-gradient-to-br from-[#171717] to-[#262626]">
            <span className="text-5xl">{product.icon}</span>
            <span className="text-sm font-semibold text-white/70 tracking-wide">
              {product.title}
            </span>
          </div>
        )}
        <div className="p-5">
          <h3 className="text-lg font-semibold text-primary mb-1.5">
            {product.title}
          </h3>
          <p className="text-sm text-text-muted leading-relaxed">
            {product.shortDesc}
          </p>
        </div>
      </button>
    </AnimateOnScroll>
  );
}

export default function Garderobe() {
  const router = useRouter();
  const [activeProduct, setActiveProduct] = useState<ProductModalData | null>(
    null
  );

  return (
    <main>
      {/* Hero */}
      <section className="relative h-[250px] sm:h-[50vh] md:h-[60vh] sm:min-h-[400px] flex items-end">
        <Image
          src="https://reolconsult.no/wp-content/uploads/2023/11/IMG_1148-scaled.jpg"
          alt="Garderobe"
          fill
          sizes="100vw"
          className="object-cover"
          priority
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-black/20" />
        <div className="relative z-10 mx-auto w-full max-w-6xl px-4 sm:px-6 lg:px-8 pb-8 sm:pb-16">
          <AnimateOnScroll>
            <h1 className="text-3xl sm:text-5xl lg:text-6xl font-bold text-white tracking-tight mb-2 sm:mb-4">
              Garderobe
            </h1>
            <p className="text-base sm:text-xl text-white/80 max-w-xl">
              Vår moderne innredning har et helt annet utgangspunkt enn de
              gamle dystre garderobene. Selvsagt skal de løse dine
              oppbevaringsbehov på en smart og effektiv måte, men hyggelige
              omkledningsrom og økt trivsel bør være like viktig. Velger du
              våre garderobeskap, har du alle muligheter til selv å bestemme
              hvordan dine skap skal se ut.
            </p>
          </AnimateOnScroll>
        </div>
      </section>

      {/* Breadcrumb */}
      <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8 py-5">
        <nav className="flex items-center gap-2 text-sm text-text-muted">
          <Link
            href="/produkter"
            className="inline-flex items-center gap-1.5 hover:text-primary transition-colors"
          >
            <svg className="h-3.5 w-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M10.5 19.5L3 12m0 0l7.5-7.5M3 12h18" />
            </svg>
            Produkter
          </Link>
          <svg className="h-3.5 w-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M8.25 4.5l7.5 7.5-7.5 7.5" />
          </svg>
          <span className="text-primary font-medium">Garderobe</span>
        </nav>
      </div>

      {/* Product grid */}
      <section className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8 pb-24">
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 sm:gap-6 lg:grid-cols-3">
          {products.map((product, i) => (
            <ProductCard
              key={product.title}
              product={product}
              index={i}
              onClick={() => setActiveProduct(product.modal)}
            />
          ))}
        </div>
      </section>

      {/* CTA */}
      <section className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8 pb-24">
        <AnimateOnScroll>
          <div className="rounded-2xl sm:rounded-3xl bg-primary px-6 sm:px-12 py-12 sm:py-20 text-center text-white">
            <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold mb-4">
              Trenger du hjelp med garderobeinnredning?
            </h2>
            <p className="text-base sm:text-lg text-white/60 mb-8 sm:mb-10 max-w-xl mx-auto">
              Vi hjelper deg med å finne riktig løsning for garderobene. Ta
              kontakt for et uforpliktende tilbud.
            </p>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-3 sm:gap-4">
              <Link
                href="/kontakt"
                className="w-full sm:w-auto rounded-full bg-accent px-8 py-3.5 text-base font-semibold text-white transition-all duration-300 hover:bg-accent-hover hover:shadow-lg active:translate-y-[1px]"
              >
                Kontakt oss
              </Link>
              <a
                href="tel:+4733365580"
                className="w-full sm:w-auto rounded-full border border-white/20 px-8 py-3.5 text-base font-medium text-white transition-colors duration-300 hover:bg-white/10 active:translate-y-[1px]"
              >
                Ring 333 65 580
              </a>
            </div>
          </div>
        </AnimateOnScroll>
      </section>

      <ProductModal
        product={activeProduct}
        onClose={() => setActiveProduct(null)}
      />
    </main>
  );
}
