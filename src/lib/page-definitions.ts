/**
 * Definisjoner av hvilke felt hver side har. Brukes av admin-editoren til å
 * vite hvilke skjemafelter som skal vises, og av frontend til å hente verdier.
 *
 * Strukturen er låst — kunden kan ikke legge til seksjoner eller felter,
 * bare endre verdier i de feltene som er definert her.
 */

export type FieldType = "text" | "textarea" | "richtext" | "image" | "href";

export interface FieldDef {
  key: string;
  label: string;
  type: FieldType;
  help?: string;
  placeholder?: string;
}

export interface SectionDef {
  key: string;
  name: string;
  description?: string;
  /** Kontekst-rik tekst som forklarer HVOR på den ferdige siden seksjonen vises. */
  placement?: string;
  fields: FieldDef[];
}

export interface PageDef {
  slug: string;
  name: string;
  description?: string;
  /** Vises hero-redigering (knyttet til pages-tabellens hero_*-kolonner) */
  hasHero?: boolean;
  /** Tekst som forklarer hvor på siden hero-blokken vises. */
  heroPlacement?: string;
  /** Vises SEO-felter (meta_title, meta_description) */
  hasSeo?: boolean;
  sections?: SectionDef[];
}

export const PAGE_DEFINITIONS: PageDef[] = [
  {
    slug: "home",
    name: "Forsiden",
    hasHero: true,
    heroPlacement: "Stort topp-banner med bilde og knapper — det aller første besøkende ser når de kommer til reolconsult.no",
    hasSeo: true,
    sections: [
      {
        key: "hva_trenger_du",
        name: "Kategori-grid (Hva trenger du?)",
        placement: "Rett under topp-banneret — kategori-rutenettet med Lager, Butikk, Kontor osv.",
        fields: [
          { key: "eyebrow", label: "Liten overskrift", type: "text" },
          { key: "title", label: "Tittel", type: "text" },
          { key: "subtitle", label: "Undertekst", type: "textarea" },
        ],
      },
      {
        key: "about_teaser",
        name: "Om oss-blokk",
        placement: "Midt på forsiden — boks med bilde og navngitt kontaktperson",
        description: "Boks med navngitt kontaktperson — for nå Agnete + Tore.",
        fields: [
          { key: "eyebrow", label: "Liten overskrift", type: "text" },
          { key: "title", label: "Tittel", type: "text" },
          { key: "body", label: "Brødtekst", type: "richtext" },
          { key: "image_url", label: "Bilde til venstre", type: "image" },
        ],
      },
      {
        key: "used_sales_teaser",
        name: "Bruktsalg-teaser",
        placement: "Under Om oss-blokken — teaser som fremhever bruktsalg-siden med bilde + knapp",
        fields: [
          { key: "badge", label: "Pille-tekst", type: "text", placeholder: "Spar penger" },
          { key: "title", label: "Tittel", type: "text" },
          { key: "body", label: "Brødtekst", type: "richtext" },
          { key: "image_url", label: "Bilde", type: "image" },
          { key: "cta_label", label: "Knapp-tekst", type: "text" },
        ],
      },
      {
        key: "cta_final",
        name: "Avsluttende CTA",
        placement: "Nederst på forsiden — siste call-to-action før footer med kontaktinfo",
        fields: [
          { key: "title", label: "Tittel", type: "text" },
          { key: "body", label: "Brødtekst", type: "textarea" },
        ],
      },
      {
        key: "references_intro",
        name: "Referanselogo-stripe",
        placement: "Helt nederst, rett over footer — overskriften over kunde-logo-stripen",
        description: "Logoer hentes fra Referanser-fanen. Her bare overskriften.",
        fields: [
          { key: "eyebrow", label: "Liten overskrift", type: "text" },
        ],
      },
    ],
  },

  {
    slug: "om-oss",
    name: "Om oss",
    hasHero: false,
    hasSeo: true,
    sections: [
      {
        key: "intro",
        name: "Intro",
        placement: "Helt øverst på Om oss-siden — det første besøkende ser, med bilde og brødtekst",
        fields: [
          { key: "eyebrow", label: "Liten overskrift", type: "text" },
          { key: "title", label: "Tittel", type: "text" },
          { key: "body", label: "Brødtekst", type: "richtext" },
          { key: "image_url", label: "Bilde", type: "image" },
        ],
      },
      {
        key: "showroom",
        name: "Showroom",
        placement: "Midt på siden — egen blokk om showroomet",
        fields: [
          { key: "eyebrow", label: "Liten overskrift", type: "text" },
          { key: "title", label: "Tittel", type: "text" },
          { key: "body", label: "Brødtekst", type: "richtext" },
        ],
      },
      {
        key: "nokkelfakta",
        name: "Nøkkelfakta-overskrift",
        placement: "Under Showroom-blokken — overskriften over fakta-kortene (40 år, antall ansatte, etc.)",
        fields: [
          { key: "title", label: "Overskrift", type: "text" },
        ],
      },
    ],
  },

  {
    slug: "kontakt",
    name: "Kontakt",
    hasHero: false,
    hasSeo: true,
    sections: [
      {
        key: "intro",
        name: "Intro",
        placement: "Helt øverst på Kontakt-siden — over selve kontaktskjemaet",
        fields: [
          { key: "eyebrow", label: "Liten overskrift", type: "text" },
          { key: "title", label: "Tittel", type: "text" },
          { key: "body", label: "Brødtekst", type: "textarea" },
        ],
      },
      {
        key: "form",
        name: "Skjema-tekst",
        placement: "Like over selve kontaktskjemaet — overskrift og hjelpetekst som introduserer skjemafeltene",
        fields: [
          { key: "title", label: "Tittel over skjemaet", type: "text" },
          { key: "help", label: "Hjelpetekst", type: "textarea" },
        ],
      },
    ],
  },

  {
    slug: "bruktsalg",
    name: "Bruktsalg",
    hasHero: false,
    hasSeo: true,
    sections: [
      {
        key: "intro",
        name: "Intro",
        placement: "Helt øverst på Bruktsalg-siden — det første besøkende ser, over bruktproduktene",
        fields: [
          { key: "badge", label: "Pille-tekst", type: "text" },
          { key: "title", label: "Tittel", type: "text" },
          { key: "body", label: "Brødtekst", type: "richtext" },
        ],
      },
      {
        key: "fordeler",
        name: "Fordeler-overskrift",
        placement: "Under produktlisten — overskriften over fordels-punktene (kvalitet, pris, miljø)",
        fields: [
          { key: "title", label: "Overskrift over fordelene", type: "text" },
        ],
      },
    ],
  },

  {
    slug: "referanser",
    name: "Referanser",
    hasHero: false,
    hasSeo: true,
    sections: [
      {
        key: "intro",
        name: "Intro",
        placement: "Helt øverst på Referanser-siden — det første besøkende ser",
        fields: [
          { key: "eyebrow", label: "Liten overskrift", type: "text" },
          { key: "title", label: "Tittel", type: "text" },
          { key: "body", label: "Brødtekst", type: "richtext" },
        ],
      },
      {
        key: "cases",
        name: "Cases-overskrift",
        placement: "Midt på siden — overskriften over prosjekt-cases-rutenettet",
        fields: [
          { key: "title", label: "Overskrift over prosjekt-cases", type: "text" },
        ],
      },
      {
        key: "logos",
        name: "Logo-overskrift",
        placement: "Under cases — overskriften over kunde-logo-rutenettet",
        fields: [
          { key: "title", label: "Overskrift over logo-grid", type: "text" },
        ],
      },
      {
        key: "cta_final",
        name: "Avsluttende CTA",
        placement: "Nederst på siden — siste call-to-action før footer",
        fields: [
          { key: "title", label: "Tittel", type: "text" },
          { key: "body", label: "Brødtekst", type: "textarea" },
        ],
      },
    ],
  },

  {
    slug: "kataloger",
    name: "Kataloger",
    hasHero: false,
    hasSeo: true,
    sections: [
      {
        key: "intro",
        name: "Intro",
        placement: "Helt øverst på Kataloger-siden — over selve katalog-listen",
        fields: [
          { key: "eyebrow", label: "Liten overskrift", type: "text" },
          { key: "title", label: "Tittel", type: "text" },
          { key: "body", label: "Brødtekst", type: "textarea" },
        ],
      },
      {
        key: "cta_final",
        name: "Avsluttende CTA",
        placement: "Nederst på siden — under katalog-listen, siste CTA før footer",
        fields: [
          { key: "title", label: "Tittel", type: "text" },
          { key: "body", label: "Brødtekst", type: "textarea" },
        ],
      },
    ],
  },

  // Produktundersider — alle har samme struktur (hero + cta_final)
  {
    slug: "lager",
    name: "Lager",
    hasHero: true,
    heroPlacement: "Stort topp-banner med bilde og knapper — det første besøkende ser på Lager-siden",
    hasSeo: true,
    sections: [
      {
        key: "cta_final",
        name: "Avsluttende CTA",
        placement: "Nederst på siden — under produktene, siste CTA før footer",
        fields: [
          { key: "title", label: "Tittel", type: "text" },
          { key: "body", label: "Brødtekst", type: "textarea" },
        ],
      },
    ],
  },
  {
    slug: "butikk",
    name: "Butikk",
    hasHero: true,
    heroPlacement: "Stort topp-banner med bilde og knapper — det første besøkende ser på Butikk-siden",
    hasSeo: true,
    sections: [
      {
        key: "cta_final",
        name: "Avsluttende CTA",
        placement: "Nederst på siden — under produktene, siste CTA før footer",
        fields: [
          { key: "title", label: "Tittel", type: "text" },
          { key: "body", label: "Brødtekst", type: "textarea" },
        ],
      },
    ],
  },
  {
    slug: "kontor",
    name: "Kontor",
    hasHero: true,
    heroPlacement: "Stort topp-banner med bilde og knapper — det første besøkende ser på Kontor-siden",
    hasSeo: true,
    sections: [
      {
        key: "cta_final",
        name: "Avsluttende CTA",
        placement: "Nederst på siden — under produktene, siste CTA før footer",
        fields: [
          { key: "title", label: "Tittel", type: "text" },
          { key: "body", label: "Brødtekst", type: "textarea" },
        ],
      },
    ],
  },
  {
    slug: "verksted",
    name: "Verksted og industri",
    hasHero: true,
    heroPlacement: "Stort topp-banner med bilde og knapper — det første besøkende ser på Verksted-siden",
    hasSeo: true,
    sections: [
      {
        key: "cta_final",
        name: "Avsluttende CTA",
        placement: "Nederst på siden — under produktene, siste CTA før footer",
        fields: [
          { key: "title", label: "Tittel", type: "text" },
          { key: "body", label: "Brødtekst", type: "textarea" },
        ],
      },
    ],
  },
  {
    slug: "garderobe",
    name: "Garderobe",
    hasHero: true,
    heroPlacement: "Stort topp-banner med bilde og knapper — det første besøkende ser på Garderobe-siden",
    hasSeo: true,
    sections: [
      {
        key: "cta_final",
        name: "Avsluttende CTA",
        placement: "Nederst på siden — under produktene, siste CTA før footer",
        fields: [
          { key: "title", label: "Tittel", type: "text" },
          { key: "body", label: "Brødtekst", type: "textarea" },
        ],
      },
    ],
  },
  {
    slug: "skole",
    name: "Skole og barnehage",
    hasHero: true,
    heroPlacement: "Stort topp-banner med bilde og knapper — det første besøkende ser på Skole/barnehage-siden",
    hasSeo: true,
    sections: [
      {
        key: "cta_final",
        name: "Avsluttende CTA",
        placement: "Nederst på siden — under produktene, siste CTA før footer",
        fields: [
          { key: "title", label: "Tittel", type: "text" },
          { key: "body", label: "Brødtekst", type: "textarea" },
        ],
      },
    ],
  },

  {
    slug: "produkter",
    name: "Produkter (oversikt)",
    hasHero: false,
    hasSeo: true,
    sections: [
      {
        key: "intro",
        name: "Intro",
        placement: "Øverst på produktoversikt-siden — over kategori-rutenettet",
        fields: [
          { key: "title", label: "Tittel", type: "text" },
          { key: "body", label: "Brødtekst", type: "textarea" },
        ],
      },
      {
        key: "cta_final",
        name: "Avsluttende CTA",
        placement: "Nederst på siden — under kategori-rutenettet, siste CTA før footer",
        fields: [
          { key: "title", label: "Tittel", type: "text" },
          { key: "body", label: "Brødtekst", type: "textarea" },
        ],
      },
    ],
  },
];

export function getPageDef(slug: string): PageDef | null {
  return PAGE_DEFINITIONS.find((p) => p.slug === slug) ?? null;
}
