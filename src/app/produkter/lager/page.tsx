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
    title: "Pallreoler",
    shortDesc:
      "Konvensjonelle pallreoler med ubegrenset tilgang til alle paller. Høyder opptil 30 meter.",
    image:
      "https://reolconsult.no/wp-content/uploads/2022/11/Hekta-Pa-Tur-2-scaled.jpg",
    modal: {
      title: "Pallreoler",
      description:
        "Våre pallreoler gir deg ubegrenset tilgang til alle paller, og kan leveres i høyder opptil 30 meter. Vi tilbyr konvensjonelle reoler i enkel og dobbel dybde, innskyvsreoler (drive-in) for maksimal utnyttelse av gulvplass, samt dynamiske pallreoler med automatisk fremføring. Systemet tilpasses alle palltyper — EUR-pall, engangspall og gitterpall — med kapasitet opptil 3.000 kg per pallplass. Alt leveres i galvanisert eller pulverlakkert stål. Komplett tilbehør inkluderer nettinghyller, pallstøtter, stolpebeskyttere og endeveggsnett. Vi prosjekterer gratis basert på dine lagertegninger.",
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
      specs: [
        "Opptil 30 m høyde",
        "3.000 kg/pallplass",
        "Galvanisert stål",
        "Enkel/dobbel dybde",
        "Drive-in",
        "Gratis prosjektering",
      ],
    },
  },
  {
    title: "Mesanin",
    shortDesc:
      "Doble gulvarealet ved å utnytte takhøyden. Bæreevne 250–1000 kg/m².",
    image:
      "https://reolconsult.no/wp-content/uploads/2022/11/Mesanin-6-scaled.jpeg",
    modal: {
      title: "Mesanin",
      description:
        "En mesaninløsning dobler gulvarealet ditt ved å bygge en ekstra etasje inne i eksisterende bygg — perfekt for å utnytte takhøyden uten å flytte til større lokaler. Bæreevnen tilpasses fra 250 til 1000 kg/m² avhengig av behov. Leveres komplett med trappeløsninger og vareheiser, og kan kombineres med pallreoler under. Alt er godkjent etter gjeldende byggeforskrifter, med rekkverk og sikkerhetsutstyr inkludert. Vi kommer på befaring, måler opp og lager en komplett løsning.",
      images: [
        "https://reolconsult.no/wp-content/uploads/2022/11/Mesanin-6-scaled.jpeg",
        "https://reolconsult.no/wp-content/uploads/2022/11/Mesanin-9.jpg",
        "https://reolconsult.no/wp-content/uploads/2022/11/Floyd-april-2022-3.jpg",
        "https://reolconsult.no/wp-content/uploads/2022/11/Floyd-april-2022-7.jpg",
        "https://reolconsult.no/wp-content/uploads/2022/11/Mesanin-19.jpg",
        "https://reolconsult.no/wp-content/uploads/2022/11/Mesanin-7.jpg",
        "https://reolconsult.no/wp-content/uploads/2022/11/H-Henriksen-AS-VI.jpg",
        "https://reolconsult.no/wp-content/uploads/2022/11/Mesanin-3.jpg",
        "https://reolconsult.no/wp-content/uploads/2022/11/LOS-6.jpg",
        "https://reolconsult.no/wp-content/uploads/2022/11/Mesanin-13.jpg",
        "https://reolconsult.no/wp-content/uploads/2022/11/Mesanin-4-Floyd.jpg",
        "https://reolconsult.no/wp-content/uploads/2022/11/Mesanin-20.jpg",
        "https://reolconsult.no/wp-content/uploads/2023/11/Mesanin-44.jpg",
        "https://reolconsult.no/wp-content/uploads/2023/11/Mesanin-43.jpg",
        "https://reolconsult.no/wp-content/uploads/2023/11/Mesanin-33-med-vekstedinnredning.jpg",
      ],
      specs: [
        "250–1000 kg/m²",
        "Trapp og vareheis",
        "Godkjent etter byggeforskrifter",
        "Kombinerbar med pallreoler",
        "Befaring inkludert",
      ],
    },
  },
  {
    title: "Småvarereoler",
    shortDesc:
      "Høykvalitets hyllereol i galvanisert stål. Enkel montering uten verktøy.",
    image:
      "https://reolconsult.no/wp-content/uploads/2022/11/Smavarereol-15-scaled.jpg",
    modal: {
      title: "Småvarereoler",
      description:
        "Våre småvarereoler i galvanisert stål er designet for enkel og rask montering uten verktøy, takket være et smart klikksystem. Hyllebredde fra 600 til 1200 mm, dybde 300–600 mm og høyde opptil 3000 mm. Kapasiteten er 80–250 kg per hylle, og hyllene justeres enkelt i 25 mm deling. Kan brukes som frittstående hyllereol, hjørnereol eller dobbeltsidig — tilpass etter behov.",
      images: [
        "https://reolconsult.no/wp-content/uploads/2022/11/Smavarereol-15-scaled.jpg",
        "https://reolconsult.no/wp-content/uploads/2022/11/Dagligvare-Foodora-1.jpg",
        "https://reolconsult.no/wp-content/uploads/2022/11/Smavarereol-31.jpg",
        "https://reolconsult.no/wp-content/uploads/2022/11/Smavarereol-1-1-scaled.jpg",
        "https://reolconsult.no/wp-content/uploads/2022/11/Smavarereol-47-scaled.jpg",
        "https://reolconsult.no/wp-content/uploads/2022/11/Smavarereol-40-scaled.jpg",
        "https://reolconsult.no/wp-content/uploads/2022/11/Smavarereol-41-scaled.jpg",
        "https://reolconsult.no/wp-content/uploads/2023/11/Smavarereol-VI-scaled.jpg",
        "https://reolconsult.no/wp-content/uploads/2023/11/Smavarereol-35-scaled.jpg",
        "https://reolconsult.no/wp-content/uploads/2023/11/Smavarereol-53-med-lukket-endevegg-og-ryggplater-scaled.jpg",
      ],
      specs: [
        "600–1200 mm bredde",
        "Opptil 3000 mm høyde",
        "80–250 kg/hylle",
        "25 mm deling",
        "Klikksystem",
        "Ingen verktøy",
      ],
    },
  },
  {
    title: "Grenreoler",
    shortDesc:
      "For langgods som rør, stenger, profiler og planker.",
    image:
      "https://reolconsult.no/wp-content/uploads/2022/11/Grenreol-Ahlsell-Klofta.jpg",
    modal: {
      title: "Grenreoler",
      description:
        "Grenreoler er spesialdesignet for lagring av langgods som rør, stenger, profiler og planker. Vi tilbyr både lett og tung variant — den lette med pulverlakkerte stammer og grener, den tunge individuelt tilpasset basert på godsets størrelse og vekt. Montering skjer uten skruer, og tung variant kan galvaniseres for utendørs bruk. Ingen frontstolper hindrer lasting, slik at du får enkel tilgang fra alle sider.",
      images: [
        "https://reolconsult.no/wp-content/uploads/2022/11/Grenreol-Ahlsell-Klofta.jpg",
        "https://reolconsult.no/wp-content/uploads/2022/11/Grenreol-Hasas-1.jpg",
        "https://reolconsult.no/wp-content/uploads/2022/11/Grenreol-Byggmakker-1.jpg",
        "https://reolconsult.no/wp-content/uploads/2022/11/Grenreol-Byggmakker-2.jpg",
        "https://reolconsult.no/wp-content/uploads/2022/11/Grenreol-I.jpg",
      ],
      specs: [
        "Lett og tung variant",
        "Montering uten skruer",
        "Kan galvaniseres",
        "Utendørs bruk",
      ],
    },
  },
  {
    title: "Universalreoler",
    shortDesc:
      "Der småvarereoler er for smått og pallreoler for stort.",
    image:
      "https://reolconsult.no/wp-content/uploads/2023/11/Universalreol-kraftig.jpg",
    modal: {
      title: "Universalreoler",
      description:
        "Universalreoler fyller gapet mellom småvarereoler og pallreoler — ideelt for mellomstore og tunge varer som ikke trenger full pallplass. Fleksibelt system med hyller av sponplater eller stål, mange kombinasjonsmuligheter og enkel montering uten skruer. Juster hyllehøyder, legg til skillevegger, eller kombiner med andre reoltyper etter behov.",
      images: [
        "https://reolconsult.no/wp-content/uploads/2023/11/Universalreol-kraftig.jpg",
        "https://reolconsult.no/wp-content/uploads/2022/11/Universalreol-1.jpg",
        "https://reolconsult.no/wp-content/uploads/2023/11/Universalreol-III.jpg",
        "https://reolconsult.no/wp-content/uploads/2023/11/Universalreol-I.jpg",
        "https://reolconsult.no/wp-content/uploads/2023/11/Universalreol.jpg",
      ],
      specs: [
        "Fleksibelt system",
        "Sponplater eller stål",
        "Enkel montering",
        "Kombinerbart",
      ],
    },
  },
  {
    title: "Spesialreoler",
    shortDesc:
      "Dekkreoler, båtreoler og trelastreoler tilpasset dine behov.",
    image:
      "https://reolconsult.no/wp-content/uploads/2022/11/Dekkreol-1.jpg",
    modal: {
      title: "Spesialreoler",
      description:
        "Vi leverer spesialreoler for dekk, båter og trelast — alle tilpasset dine spesifikke behov. Dekkreoler optimert for bilverksteder og dekkhoteller i høyder opptil 3000 mm. Båtreoler med skråstilte konfigurasjoner og spesialbygde vugger for sikker oppbevaring. Trelastreoler med justerbare skillevegger i 400 mm intervaller, tilgjengelig i enkel- eller dobbeltsidig variant opptil 4000 mm høyde. Galvanisert finish for lang levetid.",
      images: [
        "https://reolconsult.no/wp-content/uploads/2022/11/Dekkreol-1.jpg",
        "https://reolconsult.no/wp-content/uploads/2022/11/Dekkreol-2.jpg",
        "https://reolconsult.no/wp-content/uploads/2022/11/Dekkreol-3.jpg",
        "https://reolconsult.no/wp-content/uploads/2022/11/Dekkvogn.jpg",
        "https://reolconsult.no/wp-content/uploads/2022/11/Medo-Marina-1.jpg",
        "https://reolconsult.no/wp-content/uploads/2022/11/Medo-Marina-3.jpg",
        "https://reolconsult.no/wp-content/uploads/2022/11/Askvik-Marine-Bilde006.jpg",
      ],
      specs: [
        "Dekkreoler",
        "Båtreoler",
        "Trelastreoler",
        "Galvanisert",
        "Spesialtilpasset",
      ],
    },
  },
  {
    title: "HMS Sikkerhetskontroll",
    shortDesc:
      "Lovpålagt kontroll av pallreoler og lagerinnredning.",
    image:
      "https://reolconsult.no/wp-content/uploads/2022/11/Pallreol-1.jpg",
    modal: {
      title: "HMS Sikkerhetskontroll",
      description:
        "Alle virksomheter med lagerreoler er pålagt å gjennomføre regelmessig sikkerhetskontroll. Vi utfører visuell inspeksjon av alle komponenter — stolper, bjelker, fotplater og bolter. Bæreevne og lastmerking kontrolleres grundig. Hver seksjon merkes med grønt (ok), gult (obs) eller rødt (må utbedres). Du mottar en skriftlig rapport med tilstandsvurdering, fotografier og konkrete anbefalinger.",
      specs: [
        "Visuell inspeksjon",
        "Grønn/gul/rød merking",
        "Skriftlig rapport",
        "Hele Østlandet",
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

export default function Lager() {
  const router = useRouter();
  const [activeProduct, setActiveProduct] = useState<ProductModalData | null>(
    null
  );

  return (
    <main>
      {/* Hero */}
      <section className="relative h-[250px] sm:h-[50vh] md:h-[60vh] sm:min-h-[400px] flex items-end">
        <Image
          src="https://reolconsult.no/wp-content/uploads/2022/11/Hekta-Pa-Tur-2-scaled.jpg"
          alt="Lagerinnredning"
          fill
          sizes="100vw"
          className="object-cover"
          priority
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-black/20" />
        <div className="relative z-10 mx-auto w-full max-w-6xl px-4 sm:px-6 lg:px-8 pb-8 sm:pb-16">
          <AnimateOnScroll>
            <h1 className="text-3xl sm:text-5xl lg:text-6xl font-bold text-white tracking-tight mb-2 sm:mb-4">
              Lagerinnredning
            </h1>
            <p className="text-base sm:text-xl text-white/80 max-w-xl">
              Våre lagerreoler er høykvalitetsreoler i galvanisert stål, til
              meget konkurransedyktige priser. Et system med mange
              muligheter: hyllereoler, dekkreoler, hjørnereoler og mer.
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
          <span className="text-primary font-medium">Lager</span>
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
              Trenger du hjelp med lagerinnredning?
            </h2>
            <p className="text-base sm:text-lg text-white/60 mb-8 sm:mb-10 max-w-xl mx-auto">
              Vi prosjekterer gratis og leverer over hele landet. Ta kontakt for
              et uforpliktende tilbud.
            </p>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-3 sm:gap-4">
              <Link
                href="/kontakt"
                className="w-full sm:w-auto rounded-full bg-accent px-8 py-3.5 text-base font-semibold text-white transition-all duration-300 hover:bg-accent-hover hover:shadow-[0_0_25px_rgba(212,32,39,0.4)] active:translate-y-[1px]"
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
