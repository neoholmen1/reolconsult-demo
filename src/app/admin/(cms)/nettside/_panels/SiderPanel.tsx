"use client";

import Link from "next/link";
import { ArrowUpRight, Lock } from "lucide-react";
import { PAGE_META, TONE_STYLES, type PageMeta } from "@/lib/page-meta";

const HOVEDSIDER_SLUGS = ["home", "om-oss", "kontakt", "bruktsalg", "referanser", "kataloger", "produkter"];
const TJENESTESIDER_SLUGS = ["lager", "butikk", "kontor", "verksted", "garderobe", "skole"];

const PAGE_NAMES: Record<string, string> = {
  home: "Forsiden",
  "om-oss": "Om oss",
  kontakt: "Kontakt",
  bruktsalg: "Bruktsalg",
  referanser: "Referanser",
  kataloger: "Kataloger",
  produkter: "Produkter (oversikt)",
  lager: "Lager",
  butikk: "Butikk",
  kontor: "Kontor",
  verksted: "Verksted og industri",
  garderobe: "Garderobe",
  skole: "Skole og barnehage",
};

export default function SiderPanel() {
  return (
    <div className="mx-auto max-w-6xl space-y-10 p-8 lg:p-10">
      <div className="flex gap-3 rounded-xl border border-[#ececec] bg-gradient-to-br from-white to-[#fafaf9] p-4 shadow-[0_1px_2px_rgba(0,0,0,0.02)]">
        <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-[#fef2f2] text-[#dc2626] ring-1 ring-rose-100">
          <Lock className="h-4 w-4" strokeWidth={1.75} />
        </div>
        <div className="flex-1">
          <p className="text-[13px] font-semibold text-[#171717]">Layouten er låst — du fyller bare inn innholdet</p>
          <p className="mt-1 text-[12.5px] leading-relaxed text-[#737373]">
            På hver side endrer du overskrifter, brødtekst, bilder og knapper. Endringer går live umiddelbart etter at du trykker «Lagre».
          </p>
        </div>
      </div>

      <Section title="Hovedsider" description="De faste sidene som ikke handler om en spesifikk produktkategori." count={HOVEDSIDER_SLUGS.length}>
        <Grid slugs={HOVEDSIDER_SLUGS} />
      </Section>

      <Section title="Tjenestesider" description="Kategori-sidene under /produkter. Selve produktene legges inn under «Produkter»-fanen." count={TJENESTESIDER_SLUGS.length}>
        <Grid slugs={TJENESTESIDER_SLUGS} />
      </Section>
    </div>
  );
}

function Section({ title, description, count, children }: { title: string; description: string; count: number; children: React.ReactNode }) {
  return (
    <div>
      <div className="mb-5 flex items-end justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="h-1.5 w-1.5 rounded-full bg-[#dc2626]" />
            <h2 className="text-[15px] font-semibold tracking-tight text-[#171717]">{title}</h2>
            <span className="rounded-full bg-[#f5f5f4] px-2 py-0.5 text-[10.5px] font-medium text-[#737373]">{count}</span>
          </div>
          <p className="mt-1.5 text-[12.5px] text-[#737373]">{description}</p>
        </div>
      </div>
      {children}
    </div>
  );
}

function Grid({ slugs }: { slugs: string[] }) {
  return (
    <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3">
      {slugs.map((slug) => {
        const meta = PAGE_META[slug];
        if (!meta) return null;
        return <Card key={slug} slug={slug} name={PAGE_NAMES[slug] ?? slug} meta={meta} />;
      })}
    </div>
  );
}

function Card({ slug, name, meta }: { slug: string; name: string; meta: PageMeta }) {
  const Icon = meta.icon;
  const tone = TONE_STYLES[meta.tone];
  return (
    <Link
      href={`/admin/nettside/${slug}`}
      className="group relative flex flex-col overflow-hidden rounded-xl border border-[#ececec] bg-white p-5 shadow-[0_1px_2px_rgba(0,0,0,0.02)] transition duration-200 ease-out hover:-translate-y-0.5 hover:border-[#d4d4d4] hover:shadow-[0_12px_32px_-12px_rgba(0,0,0,0.12),0_2px_4px_rgba(0,0,0,0.04)]"
    >
      <span className={`absolute inset-x-0 top-0 h-[2px] bg-gradient-to-r ${tone.bg} opacity-0 transition-opacity duration-200 group-hover:opacity-100`} />

      <div className="flex items-start justify-between gap-3">
        <div className={`flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-gradient-to-br ${tone.bg} ${tone.icon} ring-1 ring-inset ${tone.ring} transition-transform duration-200 group-hover:scale-105`}>
          <Icon className="h-5 w-5" strokeWidth={1.75} />
        </div>
        <ArrowUpRight
          className="h-4 w-4 shrink-0 text-[#d4d4d4] transition duration-200 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 group-hover:text-[#dc2626]"
          strokeWidth={2}
        />
      </div>

      <div className="mt-4">
        <p className="text-[14px] font-semibold tracking-tight text-[#171717]">{name}</p>
        <p className="mt-0.5 text-[10.5px] font-mono uppercase tracking-wider text-[#a3a3a3]">{meta.url}</p>
      </div>
      <p className="mt-2.5 text-[12px] leading-relaxed text-[#737373]">{meta.description}</p>
    </Link>
  );
}
