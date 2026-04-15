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
    title: "Gondoler & Veggsystemer",
    shortDesc:
      "Enkel- og dobbeltsidig med justerbare hyller. Tåler tøff daglig bruk i mange år.",
    image:
      "https://reolconsult.no/wp-content/uploads/2022/11/Verdal-15-scaled.jpeg",
    modal: {
      title: "Gondoler & Veggsystemer",
      description:
        "Grunnsystemet er utviklet etter svensk byggestandard — robust nok til å bære stativ, konsoller, hyller, skilter og belysning. Enkel- og dobbeltsidig med justerbare hyller, konsoller og kroker som tilpasses enkelt etter butikkens behov. Fra små detaljinnredninger til hele systemer for store butikkmiljøer. Systemet er enkelt å montere, bygge om og utvide, noe som gjør det til en langsiktig investering som vokser med butikken din.",
      images: [
        "https://reolconsult.no/wp-content/uploads/2020/03/Butikkmiljo-VL5L4385_low.jpg",
        "https://reolconsult.no/wp-content/uploads/2022/11/Verdal-15-scaled.jpeg",
        "https://reolconsult.no/wp-content/uploads/2022/11/Ahlsell-1.jpg",
        "https://reolconsult.no/wp-content/uploads/2022/11/TESS-18-scaled.jpeg",
        "https://reolconsult.no/wp-content/uploads/2022/11/Ahlsell-3.jpg",
        "https://reolconsult.no/wp-content/uploads/2023/11/Gondolreoler-001.jpg",
        "https://reolconsult.no/wp-content/uploads/2023/11/Butikkinnredning-kiosk-3.jpg",
        "https://reolconsult.no/wp-content/uploads/2023/11/Butikkinnredning-kiosk-1.jpg",
        "https://reolconsult.no/wp-content/uploads/2018/08/pelly2011028.jpg",
        "https://reolconsult.no/wp-content/uploads/2020/03/Kopi-av-Cross-IX.jpg",
        "https://reolconsult.no/wp-content/uploads/2023/11/Mandal-Maritime-2-scaled.jpg",
        "https://reolconsult.no/wp-content/uploads/2023/11/Mandal-Maritime-3-scaled.jpg",
        "https://reolconsult.no/wp-content/uploads/2023/11/Vrengen-Maritime-1.jpg",
        "https://reolconsult.no/wp-content/uploads/2023/11/Avanor-Hobby-AS_03-scaled.jpg",
        "https://reolconsult.no/wp-content/uploads/2023/11/Butikk-Kirkens-Bymisjon-13.jpg",
        "https://reolconsult.no/wp-content/uploads/2023/11/Butikkmiljo.jpg",
        "https://reolconsult.no/wp-content/uploads/2023/11/Smavarereol-Dagligvare-med-tette-gavler-og-rygger-scaled.jpg",
      ],
      specs: [
        "Svensk byggestandard",
        "Enkel- og dobbeltsidig",
        "Justerbare hyller",
        "Enkel montering",
        "Enkelt å utvide",
      ],
    },
  },
  {
    title: "Disker",
    shortDesc:
      "Robust, modulbasert disksystem fra Sverige med topplater for høy slitestyrke.",
    image:
      "https://reolconsult.no/wp-content/uploads/2022/11/Disk-Vrengen-Maritime-1-scaled.jpg",
    modal: {
      title: "Disker",
      description:
        "Vårt fleksible, modulbaserte disksystem fra Sverige bygges akkurat slik du ønsker. Standardfarger front i hvit, svart eller grå, med topplate i lys eller mørk grå for høy slitestyrke. Kan leveres med skranketopp, skuffer, hyller, dører og LED-belysning — fra enkle kassedisker til store betjeningsdisker. Vi prosjekterer, tegner og leverer komplett inkludert montering.",
      images: [
        "https://reolconsult.no/wp-content/uploads/2022/11/Disk-Vrengen-Maritime-1-scaled.jpg",
        "https://reolconsult.no/wp-content/uploads/2022/11/Disk-Mandal-Maritime-1-002-scaled.jpg",
        "https://reolconsult.no/wp-content/uploads/2022/11/Vrengen-1-scaled.jpg",
        "https://reolconsult.no/wp-content/uploads/2022/11/Disk-TESS-Elverum.jpg",
        "https://reolconsult.no/wp-content/uploads/2022/11/Disk-Ahlsell-2.png",
        "https://reolconsult.no/wp-content/uploads/2022/11/Disk-Ahlsell-1.png",
        "https://reolconsult.no/wp-content/uploads/2022/11/Verdal-10-scaled.jpeg",
        "https://reolconsult.no/wp-content/uploads/2022/11/Disk-13.jpg",
        "https://reolconsult.no/wp-content/uploads/2022/11/Disk-20.jpg",
        "https://reolconsult.no/wp-content/uploads/2022/11/Disk.png",
      ],
      specs: [
        "Modulbasert",
        "Hvit/svart/grå front",
        "LED-belysning",
        "Skranketopp",
        "Skreddersydd",
      ],
    },
  },
  {
    title: "Tilbehør",
    shortDesc:
      "Prislister, skiltholdere, varesikring, belysning og mer.",
    image:
      "https://reolconsult.no/wp-content/uploads/2020/03/Enkeltspyd-for-spydskinne-L300mm-Ø8-Art.-2327-L400mm-Ø8-Art.-2328.jpg",
    modal: {
      title: "Tilbehør",
      description:
        "Vi har et komplett utvalg av tilbehør for butikkinnredning. Prislister og skiltholdere i flere formater for enkel utskifting av prisinfo og kampanjemateriell. Varesikringsløsninger og LED-belysning for hyller og disker. Kroker, konsoller, skillevegger, spydsystem og hyller i ulike materialer — alt du trenger for å innrede butikken komplett.",
      images: [
        "https://reolconsult.no/wp-content/uploads/2020/03/Enkeltspyd-for-spydskinne-L300mm-Ø8-Art.-2327-L400mm-Ø8-Art.-2328.jpg",
        "https://reolconsult.no/wp-content/uploads/2023/11/Brosjyrestativ-A4-Zic-Zac-Art.5245.jpg",
        "https://reolconsult.no/wp-content/uploads/2023/11/Brosjyrestativ-007.jpg",
        "https://reolconsult.no/wp-content/uploads/2023/11/Wall.jpg",
        "https://reolconsult.no/wp-content/uploads/2023/11/Apollo-brosjyrestativ.jpg",
        "https://reolconsult.no/wp-content/uploads/2023/11/Skiltholder-A5-art.pr-pla-621-A4-art.pr-pla-622-A3-art.pr-pla-623-1.jpg",
        "https://reolconsult.no/wp-content/uploads/2023/11/Brosjyrestativ-III.jpg",
        "https://reolconsult.no/wp-content/uploads/2023/11/Spyd.jpg",
        "https://reolconsult.no/wp-content/uploads/2023/11/Skiltholder-IV.jpg",
        "https://reolconsult.no/wp-content/uploads/2018/08/sporpanel_hoved.jpg",
        "https://reolconsult.no/wp-content/uploads/2023/11/XT-new.jpg",
        "https://reolconsult.no/wp-content/uploads/2023/11/Etikettlist-med-fargeband-for-tradhyller-til-TESS.jpeg",
        "https://reolconsult.no/wp-content/uploads/2023/11/Etikettlist-for-spyd.jpg",
      ],
      specs: [
        "Prislister",
        "Skiltholdere",
        "Varesikring",
        "LED-belysning",
        "Kroker og konsoller",
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

export default function Butikk() {
  const router = useRouter();
  const [activeProduct, setActiveProduct] = useState<ProductModalData | null>(
    null
  );

  return (
    <main>
      {/* Hero */}
      <section className="relative h-[250px] sm:h-[50vh] md:h-[60vh] sm:min-h-[400px] flex items-end">
        <Image
          src="https://reolconsult.no/wp-content/uploads/2022/11/Dagligvare-Foodora.jpg"
          alt="Butikkinnredning"
          fill
          sizes="100vw"
          className="object-cover"
          priority
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-black/20" />
        <div className="relative z-10 mx-auto w-full max-w-6xl px-4 sm:px-6 lg:px-8 pb-8 sm:pb-16">
          <AnimateOnScroll>
            <h1 className="text-3xl sm:text-5xl lg:text-6xl font-bold text-white tracking-tight mb-2 sm:mb-4">
              Butikkinnredning
            </h1>
            <p className="text-base sm:text-xl text-white/80 max-w-xl">
              Vårt produktregister omfatter alt fra mindre detaljinnredninger
              til hele systemer for store butikkmiljøer. Vi har ett av
              markedets mest komplette, fleksible og høykvalitets hylle- og
              innredningssortiment og tør påstå at vi har det meste for din
              butikk. Grunnsystemet er utviklet etter svensk byggestandard
              for butikkinnredning og klarer belastninger og tøffe tak i
              mange år.
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
          <span className="text-primary font-medium">Butikk</span>
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
              Trenger du hjelp med butikkinnredning?
            </h2>
            <p className="text-base sm:text-lg text-white/60 mb-8 sm:mb-10 max-w-xl mx-auto">
              Vi prosjekterer, tegner og leverer komplett innredning til hele
              landet. Ta kontakt for et uforpliktende tilbud.
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

      {/* Modal */}
      <ProductModal
        product={activeProduct}
        onClose={() => setActiveProduct(null)}
      />
    </main>
  );
}
