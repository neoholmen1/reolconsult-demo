import { supabase } from "@/lib/supabase";
import { savePageHero, savePageSections } from "@/lib/page-content";
import type { Page, PageSection } from "@/lib/cms";
import type { EditableValues } from "./EditableContext";

/**
 * Nøkkelkonvensjon i EditableContext:
 *
 *   "hero_eyebrow", "hero_title", "hero_image_url", ... → pages-tabellens kolonner
 *   "meta_title", "meta_description"                   → pages-tabellens kolonner
 *   "${section_key}::${field_key}"                     → page_sections-rad
 */
const PAGE_COLUMNS = new Set<string>([
  "hero_eyebrow",
  "hero_title",
  "hero_subtitle",
  "hero_image_url",
  "hero_cta_primary_label",
  "hero_cta_primary_href",
  "hero_cta_secondary_label",
  "hero_cta_secondary_href",
  "meta_title",
  "meta_description",
]);

export function isPageColumn(key: string): boolean {
  return PAGE_COLUMNS.has(key);
}

export function sectionKey(sectionKey: string, fieldKey: string): string {
  return `${sectionKey}::${fieldKey}`;
}

export function parseSectionKey(key: string): { section: string; field: string } | null {
  const idx = key.indexOf("::");
  if (idx === -1) return null;
  return { section: key.slice(0, idx), field: key.slice(idx + 2) };
}

export async function loadInitialValues(
  siteId: string,
  slug: string,
): Promise<EditableValues> {
  const [{ data: pageData }, { data: sectionData }] = await Promise.all([
    supabase
      .from("pages")
      .select("*")
      .eq("site_id", siteId)
      .eq("slug", slug)
      .maybeSingle(),
    supabase
      .from("page_sections")
      .select("*")
      .eq("site_id", siteId)
      .eq("page_slug", slug),
  ]);

  const out: EditableValues = {};

  const p = pageData as Page | null;
  for (const col of PAGE_COLUMNS) {
    out[col] = (p?.[col as keyof Page] as string | null | undefined) ?? null;
  }

  const sections = (sectionData as PageSection[] | null) ?? [];
  for (const row of sections) {
    out[sectionKey(row.section_key, row.field_key)] = row.value ?? "";
  }

  return out;
}

/**
 * Bygg payload basert på diff (kun endrede nøkler) og lagre. Returnerer ev. feil.
 */
export async function saveValues(
  siteId: string,
  slug: string,
  diff: EditableValues,
): Promise<{ error: string | null }> {
  const heroFields: Record<string, string | null> = {};
  const sectionRows: { section_key: string; field_key: string; value: string }[] = [];

  for (const [key, value] of Object.entries(diff)) {
    if (PAGE_COLUMNS.has(key)) {
      heroFields[key] = (value as string | null) ?? null;
    } else {
      const parsed = parseSectionKey(key);
      if (parsed) {
        sectionRows.push({
          section_key: parsed.section,
          field_key: parsed.field,
          value: (value as string | null) ?? "",
        });
      }
    }
  }

  if (Object.keys(heroFields).length > 0) {
    const r = await savePageHero(siteId, slug, heroFields);
    if (r.error) return r;
  }

  if (sectionRows.length > 0) {
    const r = await savePageSections(siteId, slug, sectionRows);
    if (r.error) return r;
  }

  return { error: null };
}
