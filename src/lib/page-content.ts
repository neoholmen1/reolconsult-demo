import { supabase } from "./supabase";
import type { Page, PageSection } from "./cms";

export type PageHeroFields = {
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
};

/** Lagre hero/SEO-felter på pages-tabellen for én side */
export async function savePageHero(
  siteId: string,
  slug: string,
  fields: Partial<PageHeroFields>,
): Promise<{ error: string | null }> {
  const { error } = await supabase
    .from("pages")
    .update(fields)
    .eq("site_id", siteId)
    .eq("slug", slug);
  return { error: error?.message ?? null };
}

/**
 * Lagre alle page_sections for en side. Bruker bulk-upsert.
 * Caller passer en flat liste av {section_key, field_key, value}.
 */
export type SectionFieldValue = {
  section_key: string;
  field_key: string;
  value: string;
  sort_order?: number;
};

export async function savePageSections(
  siteId: string,
  slug: string,
  fields: SectionFieldValue[],
): Promise<{ error: string | null }> {
  if (fields.length === 0) return { error: null };
  const rows = fields.map((f) => ({
    site_id: siteId,
    page_slug: slug,
    section_key: f.section_key,
    field_key: f.field_key,
    value: f.value,
    sort_order: f.sort_order ?? 0,
  }));
  const { error } = await supabase
    .from("page_sections")
    .upsert(rows, {
      onConflict: "site_id,page_slug,section_key,field_key,sort_order",
    });
  return { error: error?.message ?? null };
}

/**
 * Bygg et oppslagskart fra en liste page_sections-rader til
 * { sectionKey: { fieldKey: value } }. For lister-bruk: bruk getSectionList separat.
 */
export function buildSectionMap(
  sections: PageSection[],
): Record<string, Record<string, string>> {
  const map: Record<string, Record<string, string>> = {};
  for (const s of sections) {
    if (s.sort_order !== 0) continue;
    if (!map[s.section_key]) map[s.section_key] = {};
    map[s.section_key][s.field_key] = s.value;
  }
  return map;
}

export type { Page, PageSection };
