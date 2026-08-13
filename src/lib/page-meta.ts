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
  type LucideIcon,
} from "lucide-react";

export type Tone = "rose" | "amber" | "stone" | "blue" | "emerald" | "violet" | "sky";

export const TONE_STYLES: Record<Tone, { bg: string; ring: string; icon: string; dot: string }> = {
  rose:    { bg: "from-rose-50 to-rose-100/40",       ring: "ring-rose-100",    icon: "text-rose-700",    dot: "bg-rose-500" },
  amber:   { bg: "from-amber-50 to-amber-100/40",     ring: "ring-amber-100",   icon: "text-amber-700",   dot: "bg-amber-500" },
  stone:   { bg: "from-stone-50 to-stone-100/40",     ring: "ring-stone-200",   icon: "text-stone-700",   dot: "bg-stone-500" },
  blue:    { bg: "from-blue-50 to-blue-100/40",       ring: "ring-blue-100",    icon: "text-blue-700",    dot: "bg-blue-500" },
  emerald: { bg: "from-emerald-50 to-emerald-100/40", ring: "ring-emerald-100", icon: "text-emerald-700", dot: "bg-emerald-500" },
  violet:  { bg: "from-violet-50 to-violet-100/40",   ring: "ring-violet-100",  icon: "text-violet-700",  dot: "bg-violet-500" },
  sky:     { bg: "from-sky-50 to-sky-100/40",         ring: "ring-sky-100",     icon: "text-sky-700",     dot: "bg-sky-500" },
};

export type PageMeta = {
  icon: LucideIcon;
  tone: Tone;
  url: string;
  description: string;
  group: "Hovedsider" | "Tjenestesider";
};

export const PAGE_META: Record<string, PageMeta> = {
  home:      { icon: Home,           tone: "rose",    url: "/",                  group: "Hovedsider", description: "Stor topp-banner, kontaktkort, brukt-teaser og avsluttende CTA." },
  "om-oss":  { icon: Building2,      tone: "stone",   url: "/om-oss",            group: "Hovedsider", description: "Historie, nøkkelfakta, showroom-info." },
  kontakt:   { icon: Mail,           tone: "blue",    url: "/kontakt",           group: "Hovedsider", description: "Intro-tekst og hjelpetekst over kontaktskjemaet." },
  bruktsalg: { icon: Tag,            tone: "amber",   url: "/bruktsalg",         group: "Hovedsider", description: "Hero-tekst og fordel-overskrift på brukt-siden." },
  referanser:{ icon: Award,          tone: "violet",  url: "/referanser",        group: "Hovedsider", description: "Tekstene rundt prosjekter og kunde-logoer." },
  kataloger: { icon: FileText,       tone: "stone",   url: "/kataloger",         group: "Hovedsider", description: "Topptekst og avsluttende CTA på katalogsiden." },
  produkter: { icon: LayoutGrid,     tone: "sky",     url: "/produkter",         group: "Hovedsider", description: "Toppoverskrift og avsluttende CTA på oversiktssiden." },
  lager:     { icon: Warehouse,      tone: "stone",   url: "/produkter/lager",   group: "Tjenestesider", description: "Hero-bilde og topptekst, samt avsluttende CTA." },
  butikk:    { icon: ShoppingBag,    tone: "rose",    url: "/produkter/butikk",  group: "Tjenestesider", description: "Hero og CTA på butikkinnredning-siden." },
  kontor:    { icon: Briefcase,      tone: "blue",    url: "/produkter/kontor",  group: "Tjenestesider", description: "Hero og CTA på kontor-siden." },
  verksted:  { icon: Wrench,         tone: "amber",   url: "/produkter/verksted",group: "Tjenestesider", description: "Hero og CTA på verkstedsiden." },
  garderobe: { icon: Shirt,          tone: "violet",  url: "/produkter/garderobe",group:"Tjenestesider", description: "Hero og CTA på garderobe-siden." },
  skole:     { icon: GraduationCap,  tone: "emerald", url: "/produkter/skole",   group: "Tjenestesider", description: "Hero og CTA på skole/barnehage-siden." },
};

export function getPageMeta(slug: string): PageMeta | null {
  return PAGE_META[slug] ?? null;
}
