"use client";

import { useState } from "react";
import Link from "next/link";
import Image from "next/image";
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
    title: "Skoleinnredning",
    shortDesc:
      "Elevpulter, stoler, tavler og elevskap. Justerbar høyde for alle aldersgrupper.",
    image:
      "https://reolconsult.no/wp-content/uploads/2023/11/IMG_1153.jpg",
    modal: {
      title: "Skoleinnredning",
      description:
        "Komplett innredning for skolen — elevpulter med justerbar høyde, stoler tilpasset ulike aldersgrupper, tavler i både whiteboard og kritt, samt elevskap for sikker oppbevaring. Holdbarhet er nøkkelordet — alle produkter er designet for å tåle hard daglig slitasje i mange år uten å bli umoderne. Vi leverer også bord, paller og benker for fleksible læringsmiljøer.",
      images: [
        "https://reolconsult.no/wp-content/uploads/2023/11/IMG_1153.jpg",
        "https://reolconsult.no/wp-content/uploads/2023/11/Skole-og-barnehage-1.jpg",
        "https://reolconsult.no/wp-content/uploads/2023/11/Skole-og-barnehage-2.jpg",
        "https://reolconsult.no/wp-content/uploads/2018/08/bstgarderobei.jpg",
        "https://reolconsult.no/wp-content/uploads/2018/08/bstgarderobeii.jpg",
        "https://reolconsult.no/wp-content/uploads/2018/08/skoleinnredning15.jpg",
      ],
      specs: [
        "Elevpulter",
        "Justerbar høyde",
        "Stoler",
        "Tavler",
        "Elevskap",
        "Holdbart design",
      ],
    },
  },
  {
    title: "Barnehageinnredning",
    shortDesc:
      "Barnestoler, småbord, stellebord og hvileløsninger for de minste.",
    image:
      "https://reolconsult.no/wp-content/uploads/2023/11/Skole-og-barnehage-2.jpg",
    modal: {
      title: "Barnehageinnredning",
      description:
        "Barnestoler og bord tilpasset de minste, i sikre materialer og barnevennlige farger. Stellebord godkjent etter gjeldende forskrifter for trygg bruk i barnehagen. Madrasser og hvileløsninger for hvilestunder. Åpen innredning for leker som gjør det lett for barna å finne frem og rydde opp selv.",
      images: [
        "https://reolconsult.no/wp-content/uploads/2023/11/Skole-og-barnehage-2.jpg",
      ],
      specs: [
        "Barnestoler og bord",
        "Stellebord",
        "Godkjent etter forskrift",
        "Madrasser",
        "Hvileløsninger",
        "Åpen innredning",
      ],
    },
  },
  {
    title: "Fellesarealer",
    shortDesc:
      "Sofaer, benker og møbler for fellesarealer og personalrom.",
    image:
      "https://reolconsult.no/wp-content/uploads/2023/11/Skole-og-barnehage-1.jpg",
    modal: {
      title: "Fellesarealer",
      description:
        "Møbler for fellesarealer, personalrom og samlingsplasser. Sofaer, benker og sittegrupper som skaper trivelige og funksjonelle rom for både elever, barn og ansatte. Holdbare materialer som tåler daglig bruk i offentlige miljøer.",
      images: [
        "https://reolconsult.no/wp-content/uploads/2023/11/Skole-og-barnehage-1.jpg",
      ],
      specs: [
        "Sofaer",
        "Benker",
        "Sittegrupper",
        "Personalrom",
        "Holdbare materialer",
      ],
    },
  },
  {
    title: "Oppbevaring",
    shortDesc:
      "Åpen innredning for leker og materiell i barnvennlig design.",
    image:
      "https://reolconsult.no/wp-content/uploads/2023/11/Skole-og-barnehage-2.jpg",
    modal: {
      title: "Oppbevaring",
      description:
        "Åpen innredning for leker og materiell i barnvennlig design og tilpasset høyde. Hyller, bokser og oppbevaringsmoduler som er trygge og enkle for barn å bruke. Fleksibel inndeling som kan tilpasses etter behov og aktiviteter.",
      specs: [
        "Barnvennlig design",
        "Tilpasset høyde",
        "Åpen innredning",
        "Fleksibel inndeling",
        "Trygt og enkelt",
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

export default function Skole() {
  const [activeProduct, setActiveProduct] = useState<ProductModalData | null>(
    null
  );

  return (
    <main>
      {/* Hero */}
      <section className="relative h-[250px] sm:h-[50vh] md:h-[60vh] sm:min-h-[400px] flex items-end">
        <Image
          src="https://reolconsult.no/wp-content/uploads/2023/11/Skole-og-barnehage-1.jpg"
          alt="Skole og barnehage"
          fill
          sizes="100vw"
          className="object-cover"
          priority
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-black/20" />
        <div className="relative z-10 mx-auto w-full max-w-6xl px-4 sm:px-6 lg:px-8 pb-8 sm:pb-16">
          <AnimateOnScroll>
            <h1 className="text-3xl sm:text-5xl lg:text-6xl font-bold text-white tracking-tight mb-2 sm:mb-4">
              Skole & Barnehage
            </h1>
            <p className="text-base sm:text-xl text-white/80 max-w-xl">
              For oss er holdbarhet et nøkkelord. Vi har levert innredning
              til en rekke skoler og har de først handlet våre
              kvalitetsprodukter, kan lite annet sammenliknes og de kommer
              tilbake og handler mer! Våre produkter skal tåle hard
              slitasje, samt være holdbare når det gjelder design slik at de
              fungerer i mange år uten å bli umoderne.
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
          <span className="text-primary font-medium">Skole & Barnehage</span>
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
              Trenger du innredning til skole eller barnehage?
            </h2>
            <p className="text-base sm:text-lg text-white/60 mb-8 sm:mb-10 max-w-xl mx-auto">
              Vi har levert innredning til en rekke skoler over hele landet. Ta
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
