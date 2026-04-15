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
    title: "Skrivebord",
    shortDesc:
      "Hev/senk-bord, faste skrivebord og hjørneplasser. Ergonomisk og tilpasningsdyktig.",
    image:
      "https://reolconsult.no/wp-content/uploads/2018/08/projectskrivebordv.jpg",
    modal: {
      title: "Skrivebord",
      description:
        "Vi leverer et bredt utvalg skrivebord tilpasset moderne kontormiljøer. Elektrisk hev/senk for ergonomisk tilpasning gjennom arbeidsdagen, faste skrivebord i flere størrelser, og hjørneplasser for bedre utnyttelse av rommet. Alt kan utstyres med tilbehør som kabelkanaler, monitorarmer og bordskjermer for et ryddig og funksjonelt arbeidsmiljø.",
      images: [
        "https://reolconsult.no/wp-content/uploads/2018/08/projectskrivebordv.jpg",
        "https://reolconsult.no/wp-content/uploads/2023/11/Miljo-InLINE-sort-sort-bredformat-1024x724-1.jpg",
        "https://reolconsult.no/wp-content/uploads/2023/11/Miljo-2.jpg",
        "https://reolconsult.no/wp-content/uploads/2023/11/Kontormiljo-2.jpg",
        "https://reolconsult.no/wp-content/uploads/2023/11/Miljo-5.jpg",
        "https://reolconsult.no/wp-content/uploads/2023/11/Kontormiljo-1.jpg",
        "https://reolconsult.no/wp-content/uploads/2023/11/Kontormiljo-3.jpg",
      ],
      specs: [
        "Elektrisk hev/senk",
        "Faste skrivebord",
        "Hjørneplasser",
        "Kabelkanaler",
        "Monitorarmer",
        "Bordskjermer",
      ],
    },
  },
  {
    title: "Kontorstoler",
    shortDesc:
      "Ergonomiske kontorstoler, konferansestoler og besøksstoler.",
    image:
      "https://reolconsult.no/wp-content/uploads/2023/11/Savo-1.jpg",
    modal: {
      title: "Kontorstoler",
      description:
        "Ergonomiske kontorstoler med justerbar korsryggstøtte, armlener og setedybde for optimal komfort gjennom hele arbeidsdagen. Vi tilbyr også konferansestoler og besøksstoler i flere prisklasser og utførelser, slik at du finner riktig stol for alle bruksområder på kontoret.",
      images: [
        "https://reolconsult.no/wp-content/uploads/2023/11/Savo-1.jpg",
        "https://reolconsult.no/wp-content/uploads/2023/11/Savo-5.jpg",
        "https://reolconsult.no/wp-content/uploads/2023/11/Savo-10.jpg",
        "https://reolconsult.no/wp-content/uploads/2023/11/Soul-stol.jpg",
        "https://reolconsult.no/wp-content/uploads/2023/11/Stol-7.jpg",
        "https://reolconsult.no/wp-content/uploads/2023/11/Stol-8-scaled.jpg",
      ],
      specs: [
        "Justerbar korsryggstøtte",
        "Justerbare armlener",
        "Setedybde",
        "Konferansestoler",
        "Besøksstoler",
        "Flere prisklasser",
      ],
    },
  },
  {
    title: "Oppbevaring",
    shortDesc: "Arkivskap, reolsystemer og låsbare skap.",
    image:
      "https://reolconsult.no/wp-content/uploads/2023/11/Oppbevaring-18.jpg",
    modal: {
      title: "Oppbevaring",
      description:
        "Arkivskap med hengemapper, reolsystemer tilpasset kontormiljøer, og låsbare skap for personlige eiendeler. Fleksible løsninger som kan kombineres og tilpasses etter kontorets behov og tilgjengelig plass.",
      images: [
        "https://reolconsult.no/wp-content/uploads/2023/11/Oppbevaring-18.jpg",
        "https://reolconsult.no/wp-content/uploads/2022/11/JIVE-skyvedorsskap-scaled.jpg",
        "https://reolconsult.no/wp-content/uploads/2023/11/Oppbevaring-9.jpg",
        "https://reolconsult.no/wp-content/uploads/2023/11/Oppbevaring-14-scaled.jpg",
        "https://reolconsult.no/wp-content/uploads/2023/11/Oppbevaring-2.jpg",
      ],
      specs: [
        "Arkivskap",
        "Hengemapper",
        "Reolsystemer",
        "Låsbare skap",
        "Fleksibel inndeling",
      ],
    },
  },
  {
    title: "Resepsjon & Konferanse",
    shortDesc:
      "Resepsjonsdisker etter mål og konferansebord i flere størrelser.",
    image:
      "https://reolconsult.no/wp-content/uploads/2023/11/Skranke-resepsjon-3.jpg",
    modal: {
      title: "Resepsjon & Konferanse",
      description:
        "Resepsjonsdisker bygges etter mål for å passe perfekt til ditt lokale og din profil. Konferansebord leveres i flere størrelser og materialer, fra kompakte møtebord til store konferanseløsninger. Vi prosjekterer og leverer komplett, inkludert montering.",
      images: [
        "https://reolconsult.no/wp-content/uploads/2023/11/Skranke-resepsjon-3.jpg",
        "https://reolconsult.no/wp-content/uploads/2018/08/focusskrankeii.jpg",
        "https://reolconsult.no/wp-content/uploads/2023/11/FOCUS-3-stk-pa-raekke-lufthavn-1024x760-1.jpg",
      ],
      specs: [
        "Resepsjonsdisker etter mål",
        "Konferansebord",
        "Flere størrelser",
        "Komplett leveranse",
      ],
    },
  },
  {
    title: "Skjermvegger",
    shortDesc:
      "Støydempende paneler for åpne kontorlandskap.",
    image:
      "https://reolconsult.no/wp-content/uploads/2023/11/Ab_Stitch-scaled.jpg",
    modal: {
      title: "Skjermvegger",
      description:
        "Støydempende paneler for åpne kontorlandskap som skaper bedre arbeidsro og naturlig sonedeling. Leveres frittstående eller bordmontert, i mange farger og størrelser. Enkle å flytte og rekonfigurere etter behov.",
      images: [
        "https://reolconsult.no/wp-content/uploads/2023/11/Ab_Stitch-scaled.jpg",
        "https://reolconsult.no/wp-content/uploads/2022/11/ABS_2232-kopia-scaled.jpg",
        "https://reolconsult.no/wp-content/uploads/2023/11/Window-I.jpg",
        "https://reolconsult.no/wp-content/uploads/2023/11/Aircone-Pink_and_black-scaled.jpg",
      ],
      specs: [
        "Støydempende",
        "Frittstående",
        "Bordmontert",
        "Mange farger",
        "Enkel omgjøring",
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

export default function Kontor() {
  const router = useRouter();
  const [activeProduct, setActiveProduct] = useState<ProductModalData | null>(
    null
  );

  return (
    <main>
      {/* Hero */}
      <section className="relative h-[250px] sm:h-[50vh] md:h-[60vh] sm:min-h-[400px] flex items-end">
        <Image
          src="https://reolconsult.no/wp-content/uploads/2018/08/projectskrivebordv.jpg"
          alt="Kontor"
          fill
          sizes="100vw"
          className="object-cover"
          priority
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-black/20" />
        <div className="relative z-10 mx-auto w-full max-w-6xl px-4 sm:px-6 lg:px-8 pb-8 sm:pb-16">
          <AnimateOnScroll>
            <h1 className="text-3xl sm:text-5xl lg:text-6xl font-bold text-white tracking-tight mb-2 sm:mb-4">
              Kontor
            </h1>
            <p className="text-base sm:text-xl text-white/80 max-w-xl">
              Kontormøbler, oppbevaring, resepsjon, konferansemøbler og
              skjermvegger. Vi hjelper deg med planlegging av hele kontoret.
            </p>
          </AnimateOnScroll>
        </div>
      </section>

      {/* Breadcrumb */}
      <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8 py-5">
        <nav className="flex items-center gap-2 text-sm text-text-muted">
          <button
            onClick={() => router.back()}
            className="inline-flex items-center gap-1.5 hover:text-primary transition-colors"
          >
            <svg className="h-3.5 w-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M10.5 19.5L3 12m0 0l7.5-7.5M3 12h18" />
            </svg>
            Tilbake
          </button>
          <svg className="h-3.5 w-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M8.25 4.5l7.5 7.5-7.5 7.5" />
          </svg>
          <span className="text-primary font-medium">Kontor</span>
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
              Trenger du hjelp med kontorinnredning?
            </h2>
            <p className="text-base sm:text-lg text-white/60 mb-8 sm:mb-10 max-w-xl mx-auto">
              Vi hjelper med planlegging av hele kontoret — fra enkeltmøbler til
              komplett innredning. Ta kontakt for et uforpliktende tilbud.
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
