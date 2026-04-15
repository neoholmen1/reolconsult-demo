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
    title: "Arbeidsbord",
    shortDesc:
      "Manuelt justerbare, elektrisk hev/senk, pakkebord og rullebord.",
    image:
      "https://reolconsult.no/wp-content/uploads/2018/08/arbeidsbord500.jpg",
    modal: {
      title: "Arbeidsbord",
      description:
        "Vi tilbyr et komplett utvalg arbeidsbord — manuelt hev/senk for enkel justering, elektrisk hev/senk for ergonomisk tilpasning gjennom arbeidsdagen, pakkebord med integrerte verktøy og rullebord for fleksible arbeidsstasjoner. Hvert bord kan utstyres med skuffer, verktøytavler, belysning og stikkontakter. Bordplatene leveres i bøk, laminat, stål eller ESD-sikre varianter. Ingen arbeidsplass er lik — vi tilpasser etter behov.",
      images: [
        "https://reolconsult.no/wp-content/uploads/2018/08/arbeidsbord500.jpg",
        "https://reolconsult.no/wp-content/uploads/2018/08/hjemmeside1.jpg",
        "https://reolconsult.no/wp-content/uploads/2018/08/hjemmeside2.jpg",
        "https://reolconsult.no/wp-content/uploads/2018/08/hjemmeside3.jpg",
        "https://reolconsult.no/wp-content/uploads/2018/08/hjemmeside4.jpg",
        "https://reolconsult.no/wp-content/uploads/2018/08/hjemmeside5.jpg",
        "https://reolconsult.no/wp-content/uploads/2018/08/hjemmeside6.jpg",
        "https://reolconsult.no/wp-content/uploads/2018/08/hjemmeside7.jpg",
      ],
      specs: [
        "Manuell hev/senk",
        "Elektrisk hev/senk",
        "Pakkebord",
        "Rullebord",
        "Skuffer og verktøytavler",
        "ESD-sikre varianter",
      ],
    },
  },
  {
    title: "Verktøyskap & Oppbevaring",
    shortDesc:
      "Skap med perforerte dører, skuffeseksjoner, verktøytavler.",
    image:
      "https://reolconsult.no/wp-content/uploads/2018/08/hjemmeside60.jpg",
    modal: {
      title: "Verktøyskap & Oppbevaring",
      description:
        "Verktøyskap med perforerte dører for oversiktlig oppbevaring, justerbare hyller og kroker. Låsbare for sikker oppbevaring av verdifullt utstyr. Industriskuffer med kulelagerføringer for jevn og tung belastning, i ulike skuffehøyder med sentrallås. Perforerte verktøytavler med komplett sortiment av kroker, holdere og hyller — monteres på vegg eller som del av arbeidsbordets overbygg.",
      images: [
        "https://reolconsult.no/wp-content/uploads/2018/08/hjemmeside60.jpg",
        "https://reolconsult.no/wp-content/uploads/2018/08/hjemmeside61.jpg",
        "https://reolconsult.no/wp-content/uploads/2018/08/hjemmeside62.jpg",
        "https://reolconsult.no/wp-content/uploads/2018/08/hjemmeside63.jpg",
        "https://reolconsult.no/wp-content/uploads/2018/08/hjemmeside64.jpg",
        "https://reolconsult.no/wp-content/uploads/2018/08/hjemmeside65.jpg",
      ],
      specs: [
        "Perforerte dører",
        "Låsbare skap",
        "Kulelagerføringer",
        "Sentrallås",
        "Verktøytavler",
      ],
    },
  },
  {
    title: "Transport",
    shortDesc:
      "Traller, vogner og transportløsninger for intern logistikk.",
    image:
      "https://reolconsult.no/wp-content/uploads/2018/08/hjemmeside130.jpg",
    modal: {
      title: "Transport",
      description:
        "Komplette transportløsninger for intern logistikk. Plattformtraller, hylletraller, reoltraller og spesialtilpassede transportvogner i ulike størrelser og bæreevner. Fra enkel manuell transport til rullebaner og transportband for automatisert materialflyt.",
      images: [
        "https://reolconsult.no/wp-content/uploads/2018/08/hjemmeside130.jpg",
        "https://reolconsult.no/wp-content/uploads/2018/08/hjemmeside131.jpg",
        "https://reolconsult.no/wp-content/uploads/2018/08/hjemmeside132.jpg",
        "https://reolconsult.no/wp-content/uploads/2018/08/hjemmeside133.jpg",
        "https://reolconsult.no/wp-content/uploads/2018/08/hjemmeside134.jpg",
      ],
      specs: [
        "Plattformtraller",
        "Hylletraller",
        "Reoltraller",
        "Transportvogner",
        "Rullebaner",
      ],
    },
  },
  {
    title: "Miljøsikring",
    shortDesc:
      "Oppsamlingskar, spillbarrierer og miljøsikringsprodukter.",
    image:
      "https://reolconsult.no/wp-content/uploads/2018/08/hjemmeside210.jpg",
    modal: {
      title: "Miljøsikring",
      description:
        "Oppsamlingskar i stål og plast for sikker lagring av kjemikalier, oljer og andre væsker — godkjent etter gjeldende miljøforskrifter. Spillbarrierer og absorpsjonsmidler for å hindre og håndtere spill, med rask opprydding og minimering av miljøskader.",
      images: [
        "https://reolconsult.no/wp-content/uploads/2018/08/hjemmeside210.jpg",
        "https://reolconsult.no/wp-content/uploads/2018/08/hjemmeside211.jpg",
        "https://reolconsult.no/wp-content/uploads/2018/08/hjemmeside212.jpg",
        "https://reolconsult.no/wp-content/uploads/2018/08/hjemmeside213.jpg",
        "https://reolconsult.no/wp-content/uploads/2018/08/hjemmeside214.jpg",
      ],
      specs: [
        "Oppsamlingskar",
        "Spillbarrierer",
        "Absorpsjonsmidler",
        "Miljøgodkjent",
      ],
    },
  },
  {
    title: "Løfteutstyr",
    shortDesc: "Løftebord, stablere og annet løfteutstyr.",
    image:
      "https://reolconsult.no/wp-content/uploads/2018/08/hjemmeside220.jpg",
    modal: {
      title: "Løfteutstyr",
      description:
        "Stasjonære og mobile løftebord for ergonomisk arbeidshøyde, med hydraulisk eller elektrisk drift og bæreevne fra 300 kg til flere tonn. Manuelle og elektriske stablere for pall- og varehåndtering, inkludert kompakte modeller for trange ganger og lager med begrenset plass.",
      images: [
        "https://reolconsult.no/wp-content/uploads/2018/08/hjemmeside220.jpg",
        "https://reolconsult.no/wp-content/uploads/2018/08/hjemmeside221.jpg",
        "https://reolconsult.no/wp-content/uploads/2018/08/hjemmeside222.jpg",
        "https://reolconsult.no/wp-content/uploads/2018/08/hjemmeside223.jpg",
      ],
      specs: [
        "Løftebord",
        "Stablere",
        "Hydraulisk/elektrisk",
        "Fra 300 kg",
        "Mobile og stasjonære",
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

export default function Verksted() {
  const router = useRouter();
  const [activeProduct, setActiveProduct] = useState<ProductModalData | null>(
    null
  );

  return (
    <main>
      {/* Hero */}
      <section className="relative h-[250px] sm:h-[50vh] md:h-[60vh] sm:min-h-[400px] flex items-end">
        <Image
          src="https://reolconsult.no/wp-content/uploads/2018/08/arbeidsbord500.jpg"
          alt="Verksted og industri"
          fill
          sizes="100vw"
          className="object-cover"
          priority
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-black/20" />
        <div className="relative z-10 mx-auto w-full max-w-6xl px-4 sm:px-6 lg:px-8 pb-8 sm:pb-16">
          <AnimateOnScroll>
            <h1 className="text-3xl sm:text-5xl lg:text-6xl font-bold text-white tracking-tight mb-2 sm:mb-4">
              Verksted & Industri
            </h1>
            <p className="text-base sm:text-xl text-white/80 max-w-xl">
              Ingen arbeidsplass er lik, derfor har vi arbeidsplasser som er
              enkle og tilpasses etter behov. Vi har mange
              standardløsninger, men trenger du spesialløsninger, fikser vi
              det også.
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
          <span className="text-primary font-medium">Verksted</span>
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
              Trenger du hjelp med verkstedinnredning?
            </h2>
            <p className="text-base sm:text-lg text-white/60 mb-8 sm:mb-10 max-w-xl mx-auto">
              Vi tilpasser arbeidsplasser etter dine behov. Ta kontakt for et
              uforpliktende tilbud.
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
