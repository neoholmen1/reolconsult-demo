"use client";

import Link from "next/link";
import {
  Home,
  Building2,
  Mail,
  Tag,
  Award,
  FileText,
  Warehouse,
  ShoppingBag,
  Briefcase,
  Wrench,
  Shirt,
  GraduationCap,
  LayoutGrid,
  ArrowRight,
  type LucideIcon,
} from "lucide-react";
import PageHeader from "@/components/admin/PageHeader";

type PageEntry = {
  slug: string;
  name: string;
  url: string;
  description: string;
  icon: LucideIcon;
};

const HOVEDSIDER: PageEntry[] = [
  {
    slug: "home",
    name: "Forsiden",
    url: "/",
    icon: Home,
    description: "Stor topp-banner, kontaktkort, brukt-teaser og avsluttende CTA.",
  },
  {
    slug: "om-oss",
    name: "Om oss",
    url: "/om-oss",
    icon: Building2,
    description: "Historie, nøkkelfakta, showroom-info.",
  },
  {
    slug: "kontakt",
    name: "Kontakt",
    url: "/kontakt",
    icon: Mail,
    description: "Intro-tekst og hjelpetekst over kontaktskjemaet.",
  },
  {
    slug: "bruktsalg",
    name: "Bruktsalg",
    url: "/bruktsalg",
    icon: Tag,
    description: "Hero-tekst og fordel-overskrift på brukt-siden.",
  },
  {
    slug: "referanser",
    name: "Referanser",
    url: "/referanser",
    icon: Award,
    description: "Tekstene rundt prosjekter og kunde-logoer.",
  },
  {
    slug: "kataloger",
    name: "Kataloger",
    url: "/kataloger",
    icon: FileText,
    description: "Topptekst og avsluttende CTA på katalogsiden.",
  },
  {
    slug: "produkter",
    name: "Produkter (oversikt)",
    url: "/produkter",
    icon: LayoutGrid,
    description: "Toppoverskrift og avsluttende CTA på oversiktssiden.",
  },
];

const TJENESTESIDER: PageEntry[] = [
  {
    slug: "lager",
    name: "Lager",
    url: "/produkter/lager",
    icon: Warehouse,
    description: "Hero-bilde og topptekst, samt avsluttende CTA.",
  },
  {
    slug: "butikk",
    name: "Butikk",
    url: "/produkter/butikk",
    icon: ShoppingBag,
    description: "Hero og CTA på butikkinnredning-siden.",
  },
  {
    slug: "kontor",
    name: "Kontor",
    url: "/produkter/kontor",
    icon: Briefcase,
    description: "Hero og CTA på kontor-siden.",
  },
  {
    slug: "verksted",
    name: "Verksted og industri",
    url: "/produkter/verksted",
    icon: Wrench,
    description: "Hero og CTA på verkstedsiden.",
  },
  {
    slug: "garderobe",
    name: "Garderobe",
    url: "/produkter/garderobe",
    icon: Shirt,
    description: "Hero og CTA på garderobe-siden.",
  },
  {
    slug: "skole",
    name: "Skole og barnehage",
    url: "/produkter/skole",
    icon: GraduationCap,
    description: "Hero og CTA på skole/barnehage-siden.",
  },
];

export default function InnholdIndex() {
  return (
    <>
      <PageHeader title="Innhold" subtitle="Velg hvilken side du vil redigere" />

      <div className="flex-1 overflow-y-auto bg-[#fafafa] p-8 lg:p-12">
        <div className="mx-auto max-w-4xl space-y-10">
          <div>
            <p className="text-sm leading-relaxed text-[#525252]">
              På hver side kan du endre overskrifter, brødtekst, bilder og knapper.
              Layouten er låst — du kan kun fylle inn verdier i feltene som er
              definert. Endringer blir synlige umiddelbart etter at du trykker «Lagre».
            </p>
          </div>

          <Section title="Hovedsider" description="De faste sidene som ikke handler om en spesifikk produktkategori.">
            <Grid items={HOVEDSIDER} />
          </Section>

          <Section title="Tjenestesider" description="Kategori-sidene under /produkter. Selve produktene legges inn under «Produkter»-fanen.">
            <Grid items={TJENESTESIDER} />
          </Section>
        </div>
      </div>
    </>
  );
}

function Section({
  title,
  description,
  children,
}: {
  title: string;
  description: string;
  children: React.ReactNode;
}) {
  return (
    <div>
      <div className="mb-4">
        <h2 className="text-base font-semibold text-[#171717]">{title}</h2>
        <p className="mt-1 text-xs text-[#737373]">{description}</p>
      </div>
      {children}
    </div>
  );
}

function Grid({ items }: { items: PageEntry[] }) {
  return (
    <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
      {items.map((p) => {
        const Icon = p.icon;
        return (
          <Link
            key={p.slug}
            href={`/admin/innhold/${p.slug}`}
            className="group flex items-start gap-4 rounded-xl border border-[#e5e5e5] bg-white p-5 transition hover:-translate-y-0.5 hover:border-[#dc2626]/30 hover:shadow-[0_8px_24px_rgba(0,0,0,0.06)]"
          >
            <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-[#fef2f2] text-[#dc2626]">
              <Icon className="h-5 w-5" strokeWidth={1.75} />
            </div>
            <div className="flex-1 min-w-0">
              <div className="flex items-center justify-between gap-2">
                <p className="text-sm font-semibold text-[#171717]">{p.name}</p>
                <ArrowRight className="h-4 w-4 shrink-0 text-[#a3a3a3] transition group-hover:translate-x-0.5 group-hover:text-[#dc2626]" strokeWidth={1.75} />
              </div>
              <p className="mt-0.5 text-[11px] text-[#a3a3a3]">{p.url}</p>
              <p className="mt-2 text-xs leading-relaxed text-[#525252]">{p.description}</p>
            </div>
          </Link>
        );
      })}
    </div>
  );
}
