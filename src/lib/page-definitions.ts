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
  fields: FieldDef[];
}

export interface PageDef {
  slug: string;
  name: string;
  description?: string;
  /** Vises hero-redigering (knyttet til pages-tabellens hero_*-kolonner) */
  hasHero?: boolean;
  /** Vises SEO-felter (meta_title, meta_description) */
  hasSeo?: boolean;
  sections?: SectionDef[];
}

const HERO_SECTION_DESC = "Stort topp-banner med tittel, tekst og CTA-knapper.";

export const PAGE_DEFINITIONS: PageDef[] = [
  {
    slug: "home",
    name: "Forsiden",
    hasHero: true,
    hasSeo: true,
    sections: [
      {
        key: "hva_trenger_du",
        name: "Kategori-grid (Hva trenger du?)",
        fields: [
          { key: "eyebrow", label: "Liten overskrift", type: "text" },
          { key: "title", label: "Tittel", type: "text" },
          { key: "subtitle", label: "Undertekst", type: "textarea" },
        ],
      },
      {
        key: "about_teaser",
        name: "Om oss-blokk",
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
        fields: [
          { key: "title", label: "Tittel", type: "text" },
          { key: "body", label: "Brødtekst", type: "textarea" },
        ],
      },
      {
        key: "references_intro",
        name: "Referanselogo-stripe",
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
        fields: [
          { key: "eyebrow", label: "Liten overskrift", type: "text" },
          { key: "title", label: "Tittel", type: "text" },
          { key: "body", label: "Brødtekst", type: "richtext" },
        ],
      },
      {
        key: "nokkelfakta",
        name: "Nøkkelfakta-overskrift",
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
        fields: [
          { key: "eyebrow", label: "Liten overskrift", type: "text" },
          { key: "title", label: "Tittel", type: "text" },
          { key: "body", label: "Brødtekst", type: "textarea" },
        ],
      },
      {
        key: "form",
        name: "Skjema-tekst",
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
        fields: [
          { key: "badge", label: "Pille-tekst", type: "text" },
          { key: "title", label: "Tittel", type: "text" },
          { key: "body", label: "Brødtekst", type: "richtext" },
        ],
      },
      {
        key: "fordeler",
        name: "Fordeler-overskrift",
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
        fields: [
          { key: "eyebrow", label: "Liten overskrift", type: "text" },
          { key: "title", label: "Tittel", type: "text" },
          { key: "body", label: "Brødtekst", type: "richtext" },
        ],
      },
      {
        key: "cases",
        name: "Cases-overskrift",
        fields: [
          { key: "title", label: "Overskrift over prosjekt-cases", type: "text" },
        ],
      },
      {
        key: "logos",
        name: "Logo-overskrift",
        fields: [
          { key: "title", label: "Overskrift over logo-grid", type: "text" },
        ],
      },
      {
        key: "cta_final",
        name: "Avsluttende CTA",
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
        fields: [
          { key: "eyebrow", label: "Liten overskrift", type: "text" },
          { key: "title", label: "Tittel", type: "text" },
          { key: "body", label: "Brødtekst", type: "textarea" },
        ],
      },
      {
        key: "cta_final",
        name: "Avsluttende CTA",
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
    hasSeo: true,
    description: HERO_SECTION_DESC,
    sections: [
      {
        key: "cta_final",
        name: "Avsluttende CTA",
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
    hasSeo: true,
    sections: [
      {
        key: "cta_final",
        name: "Avsluttende CTA",
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
    hasSeo: true,
    sections: [
      {
        key: "cta_final",
        name: "Avsluttende CTA",
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
    hasSeo: true,
    sections: [
      {
        key: "cta_final",
        name: "Avsluttende CTA",
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
    hasSeo: true,
    sections: [
      {
        key: "cta_final",
        name: "Avsluttende CTA",
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
    hasSeo: true,
    sections: [
      {
        key: "cta_final",
        name: "Avsluttende CTA",
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
        fields: [
          { key: "title", label: "Tittel", type: "text" },
          { key: "body", label: "Brødtekst", type: "textarea" },
        ],
      },
      {
        key: "cta_final",
        name: "Avsluttende CTA",
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
