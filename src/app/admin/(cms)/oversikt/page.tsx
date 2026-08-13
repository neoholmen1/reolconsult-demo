"use client";

import Link from "next/link";
import {
  FileText,
  Package,
  FolderOpen,
  Users,
  Award,
  MessageSquare,
  PenLine,
  Image as ImageIcon,
  Settings,
  ArrowRight,
  type LucideIcon,
} from "lucide-react";
import PageHeader from "@/components/admin/PageHeader";

type Card = {
  href: string;
  icon: LucideIcon;
  title: string;
  description: string;
  examples: string;
};

const CARDS: Card[] = [
  {
    href: "/admin/innhold",
    icon: FileText,
    title: "Innhold",
    description: "Endre tekster og bilder på sidene dine.",
    examples: "Hero-overskrifter, ingresser, knapper, om-oss-tekst.",
  },
  {
    href: "/admin/produkter",
    icon: Package,
    title: "Produkter",
    description: "Legg til og rediger produktene som vises i kategoriene.",
    examples: "Pallreoler, garderobeskap, arbeidsbord m.m.",
  },
  {
    href: "/admin/kategorier",
    icon: FolderOpen,
    title: "Kategorier",
    description: "Styr produktkategoriene som vises på forsiden.",
    examples: "Lager, Butikk, Kontor, Verksted, Garderobe, Skole.",
  },
  {
    href: "/admin/team",
    icon: Users,
    title: "Team",
    description: "Legg til ansatte med navn, telefon og portrettbilde.",
    examples: "Vises på forsiden og kontaktsiden.",
  },
  {
    href: "/admin/referanser",
    icon: Award,
    title: "Referanser",
    description: "Vis fram prosjekter og kunde-logoer dere har levert til.",
    examples: "Foodora, TESS, Vrengen Maritime osv.",
  },
  {
    href: "/admin/testimonials",
    icon: MessageSquare,
    title: "Testimonials",
    description: "Sitater fra fornøyde kunder.",
    examples: "Vises i en egen seksjon på forsiden hvis dere har noen.",
  },
  {
    href: "/admin/blogg",
    icon: PenLine,
    title: "Blogg",
    description: "Skriv nyheter, tips eller fagartikler.",
    examples: "Synlige under /blogg når de er publisert.",
  },
  {
    href: "/admin/bilder",
    icon: ImageIcon,
    title: "Bilder",
    description: "Last opp og organiser bildebiblioteket ditt.",
    examples: "Brukes overalt: hero, produkter, team, referanser.",
  },
];

export default function OversiktPage() {
  return (
    <>
      <PageHeader title="Oversikt" />

      <div className="flex-1 overflow-y-auto bg-[#fafafa] p-8 lg:p-12">
        <div className="mx-auto max-w-5xl">
          {/* Velkomst */}
          <div className="rounded-2xl border border-[#e5e5e5] bg-white p-8 sm:p-10">
            <div className="inline-flex items-center gap-2 rounded-full bg-[#fef2f2] px-3 py-1 text-[11px] font-semibold uppercase tracking-wide text-[#dc2626]">
              Velkommen
            </div>
            <h2 className="mt-4 text-2xl font-bold tracking-tight text-[#171717] sm:text-3xl">
              Velkommen til ditt kontrollpanel
            </h2>
            <p className="mt-3 max-w-2xl text-sm leading-relaxed text-[#525252] sm:text-base">
              Herfra kan du selv endre alt innholdet på nettsiden din — uten å måtte
              kontakte noen. Velg en av kortene under for å komme i gang. Endringer
              lagres med en gang du trykker «Lagre» og blir synlige på nettsiden umiddelbart.
            </p>
            <div className="mt-6 grid gap-3 sm:grid-cols-3">
              <InfoChip label="Designet er låst" detail="Du kan kun endre innhold, ikke layout." />
              <InfoChip label="Endringer er live" detail="Synlig på nettsiden med en gang du lagrer." />
              <InfoChip label="Trygt å prøve" detail="Du kan ikke ødelegge noe — alt kan endres tilbake." />
            </div>
          </div>

          {/* Kort */}
          <h3 className="mt-10 mb-5 text-sm font-semibold uppercase tracking-wide text-[#737373]">
            Hva vil du gjøre?
          </h3>
          <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3">
            {CARDS.map((c) => {
              const Icon = c.icon;
              return (
                <Link
                  key={c.href}
                  href={c.href}
                  className="group flex flex-col rounded-xl border border-[#e5e5e5] bg-white p-5 transition hover:-translate-y-0.5 hover:border-[#dc2626]/30 hover:shadow-[0_8px_24px_rgba(0,0,0,0.06)]"
                >
                  <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-[#fef2f2] text-[#dc2626]">
                    <Icon className="h-5 w-5" strokeWidth={1.75} />
                  </div>
                  <h4 className="mt-4 text-sm font-semibold text-[#171717]">{c.title}</h4>
                  <p className="mt-1 text-xs leading-relaxed text-[#525252]">{c.description}</p>
                  <p className="mt-2 text-[11px] italic text-[#a3a3a3]">{c.examples}</p>
                  <div className="mt-4 flex items-center gap-1.5 text-[11px] font-medium text-[#dc2626] opacity-0 transition-opacity group-hover:opacity-100">
                    Åpne <ArrowRight className="h-3 w-3" strokeWidth={2} />
                  </div>
                </Link>
              );
            })}
          </div>

          {/* Hjelp */}
          <div className="mt-10 rounded-2xl border border-[#e5e5e5] bg-white p-6">
            <div className="flex items-start gap-4">
              <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-[#fafafa] text-[#737373]">
                <Settings className="h-5 w-5" strokeWidth={1.75} />
              </div>
              <div>
                <h4 className="text-sm font-semibold text-[#171717]">Trenger du å endre kontaktinfo eller AI-assistent?</h4>
                <p className="mt-1 text-xs leading-relaxed text-[#525252]">
                  Telefon, e-post, åpningstider og data til AI-assistenten redigeres i et eget panel.
                </p>
                <Link
                  href="/admin"
                  className="mt-3 inline-flex items-center gap-1.5 text-xs font-medium text-[#dc2626] hover:gap-2 transition"
                >
                  Åpne innstillinger og AI-assistent <ArrowRight className="h-3 w-3" strokeWidth={2} />
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

function InfoChip({ label, detail }: { label: string; detail: string }) {
  return (
    <div className="rounded-lg bg-[#fafafa] p-3">
      <p className="text-xs font-semibold text-[#171717]">{label}</p>
      <p className="mt-0.5 text-[11px] text-[#737373]">{detail}</p>
    </div>
  );
}
