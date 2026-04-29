import { cache } from "react";
import { supabase } from "./supabase";

// ────────────────────────────────────────────────────────────
// Typer
// ────────────────────────────────────────────────────────────

export type MediaItem = {
  id: string;
  site_id: string;
  storage_path: string;
  url: string;
  alt_text: string;
  category: string;
  mime_type: string | null;
  size_bytes: number | null;
  width: number | null;
  height: number | null;
  uploaded_by: string | null;
  uploaded_at: string;
};

export type Page = {
  id: string;
  site_id: string;
  slug: string;
  name: string;
  hero_image_url: string | null;
  hero_eyebrow: string | null;
  hero_title: string | null;
  hero_subtitle: string | null;
  hero_cta_primary_label: string | null;
  hero_cta_primary_href: string | null;
  hero_cta_secondary_label: string | null;
  hero_cta_secondary_href: string | null;
  meta_title: string | null;
  meta_description: string | null;
  created_at: string;
  updated_at: string;
};

export type PageSection = {
  id: string;
  site_id: string;
  page_slug: string;
  section_key: string;
  field_key: string;
  value: string;
  sort_order: number;
  updated_at: string;
};

// ────────────────────────────────────────────────────────────
// Media (bildebibliotek)
// ────────────────────────────────────────────────────────────

export async function listMedia(
  siteId: string,
  category?: string,
): Promise<MediaItem[]> {
  let query = supabase
    .from("media")
    .select("*")
    .eq("site_id", siteId)
    .order("uploaded_at", { ascending: false });

  if (category) query = query.eq("category", category);

  const { data, error } = await query;
  if (error || !data) return [];
  return data as MediaItem[];
}

export const MEDIA_CATEGORIES = [
  { key: "hero", label: "Hero / topbilde" },
  { key: "product", label: "Produkt" },
  { key: "team", label: "Team / portrett" },
  { key: "blog", label: "Blogg" },
  { key: "case", label: "Case / referanse" },
  { key: "logo", label: "Logo" },
  { key: "general", label: "Generelt" },
] as const;

// ────────────────────────────────────────────────────────────
// Pages
// ────────────────────────────────────────────────────────────

export const getPage = cache(async (siteId: string, slug: string): Promise<Page | null> => {
  const { data, error } = await supabase
    .from("pages")
    .select("*")
    .eq("site_id", siteId)
    .eq("slug", slug)
    .maybeSingle();

  if (error || !data) return null;
  return data as Page;
});

export async function listPages(siteId: string): Promise<Page[]> {
  const { data } = await supabase
    .from("pages")
    .select("*")
    .eq("site_id", siteId)
    .order("name");

  return (data ?? []) as Page[];
}

// ────────────────────────────────────────────────────────────
// Page sections (key/value-tekst)
// ────────────────────────────────────────────────────────────

/**
 * Hent alle seksjon-rader for en side. Returnerer et nested map:
 *   sections[section_key][field_key] = string  (når sort_order=0 og kun én rad)
 *   sections[section_key][field_key + "_list"] = string[]  (når sort_order > 0 eller flere rader)
 *
 * Bruk getSectionField() / getSectionList() som typesafe wrappers.
 */
export const getPageSections = cache(async (siteId: string, slug: string): Promise<PageSection[]> => {
  const { data } = await supabase
    .from("page_sections")
    .select("*")
    .eq("site_id", siteId)
    .eq("page_slug", slug)
    .order("section_key")
    .order("field_key")
    .order("sort_order");

  return (data ?? []) as PageSection[];
});

/**
 * Hent én verdi (sort_order = 0).
 * Returnerer fallback hvis raden ikke finnes eller verdien er tom.
 */
export function getSectionField(
  sections: PageSection[],
  sectionKey: string,
  fieldKey: string,
  fallback = "",
): string {
  const row = sections.find(
    (s) => s.section_key === sectionKey && s.field_key === fieldKey && s.sort_order === 0,
  );
  return row?.value || fallback;
}

/**
 * Hent en liste (alle rader med samme section_key + field_key, sortert på sort_order).
 */
export function getSectionList(
  sections: PageSection[],
  sectionKey: string,
  fieldKey: string,
): string[] {
  return sections
    .filter((s) => s.section_key === sectionKey && s.field_key === fieldKey)
    .sort((a, b) => a.sort_order - b.sort_order)
    .map((s) => s.value);
}

// ────────────────────────────────────────────────────────────
// Innholdstyper (fase 4-6)
// ────────────────────────────────────────────────────────────

export type TeamMember = {
  id: string;
  name: string;
  role: string;
  phone: string;
  email: string;
  photo_url: string | null;
  bio: string;
  sort_order: number;
};

export type Testimonial = {
  id: string;
  author_name: string;
  author_role: string;
  author_company: string;
  quote: string;
  rating: number | null;
};

export type CaseStudy = {
  id: string;
  customer_name: string;
  project_type: string;
  description: string;
  image_url: string | null;
  year: string;
};

export type ClientLogo = {
  id: string;
  name: string;
  logo_url: string;
};

export type Category = {
  id: string;
  slug: string;
  title: string;
  description: string;
  hero_image_url: string | null;
};

export type Product = {
  id: string;
  category_slug: string;
  slug: string;
  title: string;
  short_description: string;
  long_description: string;
  hero_image_url: string | null;
  gallery_images: { url: string; alt: string }[];
  specs: string[];
  price_from: number | null;
  price_unit: string;
  sort_order: number;
};

export const getTeamMembers = cache(async (siteId: string): Promise<TeamMember[]> => {
  const { data } = await supabase
    .from("team_members")
    .select("id, name, role, phone, email, photo_url, bio, sort_order")
    .eq("site_id", siteId)
    .eq("active", true)
    .order("sort_order");
  return (data ?? []) as TeamMember[];
});

export const getTestimonials = cache(async (siteId: string): Promise<Testimonial[]> => {
  const { data } = await supabase
    .from("testimonials")
    .select("id, author_name, author_role, author_company, quote, rating")
    .eq("site_id", siteId)
    .eq("published", true)
    .order("sort_order");
  return (data ?? []) as Testimonial[];
});

export const getCaseStudies = cache(async (siteId: string): Promise<CaseStudy[]> => {
  const { data } = await supabase
    .from("case_studies")
    .select("id, customer_name, project_type, description, image_url, year")
    .eq("site_id", siteId)
    .eq("published", true)
    .order("sort_order");
  return (data ?? []) as CaseStudy[];
});

export const getClientLogos = cache(async (siteId: string): Promise<ClientLogo[]> => {
  const { data } = await supabase
    .from("client_logos")
    .select("id, name, logo_url")
    .eq("site_id", siteId)
    .order("sort_order");
  return (data ?? []) as ClientLogo[];
});

export const getCategories = cache(async (siteId: string): Promise<Category[]> => {
  const { data } = await supabase
    .from("categories")
    .select("id, slug, title, description, hero_image_url")
    .eq("site_id", siteId)
    .eq("published", true)
    .order("sort_order");
  return (data ?? []) as Category[];
});

export const getProductsByCategory = cache(async (
  siteId: string,
  categorySlug: string,
): Promise<Product[]> => {
  const { data } = await supabase
    .from("products")
    .select("id, category_slug, slug, title, short_description, long_description, hero_image_url, gallery_images, specs, price_from, price_unit, sort_order")
    .eq("site_id", siteId)
    .eq("category_slug", categorySlug)
    .eq("published", true)
    .order("sort_order");
  return (data ?? []).map((p) => ({
    ...p,
    gallery_images: Array.isArray(p.gallery_images) ? p.gallery_images : [],
    specs: Array.isArray(p.specs) ? p.specs : [],
  })) as Product[];
});
