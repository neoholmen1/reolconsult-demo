"use client";

import { useEffect, useState, useMemo } from "react";
import Link from "next/link";
import { notFound, useParams } from "next/navigation";
import { supabase } from "@/lib/supabase";
import { getCurrentSite, type Site } from "@/lib/site";
import { type Page, type PageSection } from "@/lib/cms";
import { savePageHero, savePageSections, buildSectionMap } from "@/lib/page-content";
import { getPageDef, type PageDef, type FieldDef } from "@/lib/page-definitions";
import SaveBar from "@/components/admin/SaveBar";
import UnsavedChangesGuard from "@/components/admin/UnsavedChangesGuard";
import RichTextEditor from "@/components/admin/RichTextEditor";
import MediaPicker from "@/components/admin/MediaPicker";
import { revalidatePublicSite } from "@/app/actions/revalidate";

type HeroState = {
  hero_image_url: string;
  hero_eyebrow: string;
  hero_title: string;
  hero_subtitle: string;
  hero_cta_primary_label: string;
  hero_cta_primary_href: string;
  hero_cta_secondary_label: string;
  hero_cta_secondary_href: string;
  meta_title: string;
  meta_description: string;
};

const EMPTY_HERO: HeroState = {
  hero_image_url: "",
  hero_eyebrow: "",
  hero_title: "",
  hero_subtitle: "",
  hero_cta_primary_label: "",
  hero_cta_primary_href: "",
  hero_cta_secondary_label: "",
  hero_cta_secondary_href: "",
  meta_title: "",
  meta_description: "",
};

export default function PageEditor() {
  const params = useParams<{ slug: string }>();
  const slug = params.slug;
  const def = useMemo<PageDef | null>(() => getPageDef(slug), [slug]);

  const [site, setSite] = useState<Site | null>(null);
  const [page, setPage] = useState<Page | null>(null);
  const [hero, setHero] = useState<HeroState>(EMPTY_HERO);
  const [sectionValues, setSectionValues] = useState<Record<string, Record<string, string>>>({});
  const [loading, setLoading] = useState(true);
  const [dirty, setDirty] = useState(false);
  const [status, setStatus] = useState<"idle" | "saving" | "saved" | "error">("idle");
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  // Last side + seksjoner
  useEffect(() => {
    if (!def) return;
    let cancelled = false;
    setLoading(true);
    (async () => {
      const s = await getCurrentSite();
      if (cancelled || !s) return;
      setSite(s);

      const [{ data: pageData }, { data: sectionData }] = await Promise.all([
        supabase
          .from("pages")
          .select("*")
          .eq("site_id", s.id)
          .eq("slug", slug)
          .maybeSingle(),
        supabase
          .from("page_sections")
          .select("*")
          .eq("site_id", s.id)
          .eq("page_slug", slug),
      ]);

      if (cancelled) return;
      setPage(pageData as Page | null);
      if (pageData) {
        setHero({
          hero_image_url: pageData.hero_image_url ?? "",
          hero_eyebrow: pageData.hero_eyebrow ?? "",
          hero_title: pageData.hero_title ?? "",
          hero_subtitle: pageData.hero_subtitle ?? "",
          hero_cta_primary_label: pageData.hero_cta_primary_label ?? "",
          hero_cta_primary_href: pageData.hero_cta_primary_href ?? "",
          hero_cta_secondary_label: pageData.hero_cta_secondary_label ?? "",
          hero_cta_secondary_href: pageData.hero_cta_secondary_href ?? "",
          meta_title: pageData.meta_title ?? "",
          meta_description: pageData.meta_description ?? "",
        });
      }

      const map = buildSectionMap((sectionData as PageSection[]) ?? []);
      setSectionValues(map);
      setLoading(false);
    })();
    return () => {
      cancelled = true;
    };
  }, [def, slug]);

  if (!def) return notFound();

  function updateHero<K extends keyof HeroState>(key: K, value: HeroState[K]) {
    setHero((prev) => ({ ...prev, [key]: value }));
    setDirty(true);
    setStatus("idle");
  }

  function updateSection(sectionKey: string, fieldKey: string, value: string) {
    setSectionValues((prev) => ({
      ...prev,
      [sectionKey]: { ...(prev[sectionKey] ?? {}), [fieldKey]: value },
    }));
    setDirty(true);
    setStatus("idle");
  }

  async function handleSave() {
    if (!site) return;
    setStatus("saving");
    setErrorMessage(null);

    // 1. Hero / SEO
    if (def?.hasHero || def?.hasSeo) {
      const fields: Record<string, string | null> = {};
      if (def.hasHero) {
        fields.hero_image_url = hero.hero_image_url || null;
        fields.hero_eyebrow = hero.hero_eyebrow || null;
        fields.hero_title = hero.hero_title || null;
        fields.hero_subtitle = hero.hero_subtitle || null;
        fields.hero_cta_primary_label = hero.hero_cta_primary_label || null;
        fields.hero_cta_primary_href = hero.hero_cta_primary_href || null;
        fields.hero_cta_secondary_label = hero.hero_cta_secondary_label || null;
        fields.hero_cta_secondary_href = hero.hero_cta_secondary_href || null;
      }
      if (def.hasSeo) {
        fields.meta_title = hero.meta_title || null;
        fields.meta_description = hero.meta_description || null;
      }
      const r = await savePageHero(site.id, slug, fields);
      if (r.error) {
        setStatus("error");
        setErrorMessage(r.error);
        return;
      }
    }

    // 2. Page sections
    const sectionRows: { section_key: string; field_key: string; value: string }[] = [];
    for (const section of def?.sections ?? []) {
      for (const field of section.fields) {
        const value = sectionValues[section.key]?.[field.key] ?? "";
        sectionRows.push({
          section_key: section.key,
          field_key: field.key,
          value,
        });
      }
    }
    const r = await savePageSections(site.id, slug, sectionRows);
    if (r.error) {
      setStatus("error");
      setErrorMessage(r.error);
      return;
    }

    await revalidatePublicSite();
    setDirty(false);
    setStatus("saved");
  }

  if (loading) {
    return (
      <div className="flex flex-1 items-center justify-center">
        <div className="h-8 w-8 animate-spin rounded-full border-2 border-[#dc2626] border-t-transparent" />
      </div>
    );
  }

  const previewHref = slug === "home" ? "/" : `/${slug}`;

  return (
    <>
      <UnsavedChangesGuard dirty={dirty} />
      <SaveBar
        title={def.name}
        dirty={dirty}
        status={status}
        onSave={handleSave}
        errorMessage={errorMessage}
        rightContent={
          <Link
            href={previewHref}
            target="_blank"
            className="rounded-full border border-[#e5e5e5] px-4 py-2 text-sm font-medium text-[#404040] transition-colors hover:bg-[#f5f5f5]"
          >
            Forhåndsvis ↗
          </Link>
        }
      />

      <div className="flex-1 overflow-y-auto p-6 lg:p-8">
        <div className="mx-auto max-w-3xl space-y-6">
          <div>
            <Link
              href="/admin/innhold"
              className="inline-flex items-center gap-1 text-xs text-[#737373] hover:text-[#171717]"
            >
              ← Tilbake til alle sider
            </Link>
          </div>

          {/* Hero */}
          {def.hasHero && site && (
            <Card title="Hero / topbilde">
              <div className="space-y-4">
                <MediaPicker
                  value={hero.hero_image_url || null}
                  onChange={(url) => updateHero("hero_image_url", url ?? "")}
                  siteId={site.id}
                  defaultCategory="hero"
                  label="Bakgrunnsbilde"
                />
                <FieldText
                  label="Liten overskrift over"
                  value={hero.hero_eyebrow}
                  onChange={(v) => updateHero("hero_eyebrow", v)}
                  placeholder="F.eks. SIDEN 1984"
                />
                <FieldTextarea
                  label="Hovedtittel"
                  value={hero.hero_title}
                  onChange={(v) => updateHero("hero_title", v)}
                  rows={2}
                />
                <FieldTextarea
                  label="Undertekst"
                  value={hero.hero_subtitle}
                  onChange={(v) => updateHero("hero_subtitle", v)}
                  rows={3}
                />
                <div className="grid gap-4 sm:grid-cols-2">
                  <FieldText
                    label="Primær knapp – tekst"
                    value={hero.hero_cta_primary_label}
                    onChange={(v) => updateHero("hero_cta_primary_label", v)}
                  />
                  <FieldText
                    label="Primær knapp – lenke"
                    value={hero.hero_cta_primary_href}
                    onChange={(v) => updateHero("hero_cta_primary_href", v)}
                    placeholder="/kontakt"
                  />
                  <FieldText
                    label="Sekundær knapp – tekst"
                    value={hero.hero_cta_secondary_label}
                    onChange={(v) => updateHero("hero_cta_secondary_label", v)}
                  />
                  <FieldText
                    label="Sekundær knapp – lenke"
                    value={hero.hero_cta_secondary_href}
                    onChange={(v) => updateHero("hero_cta_secondary_href", v)}
                    placeholder="/produkter"
                  />
                </div>
              </div>
            </Card>
          )}

          {/* Sections */}
          {site &&
            def.sections?.map((section) => (
              <Card key={section.key} title={section.name} description={section.description}>
                <div className="space-y-4">
                  {section.fields.map((field) => (
                    <FieldRenderer
                      key={field.key}
                      field={field}
                      value={sectionValues[section.key]?.[field.key] ?? ""}
                      onChange={(v) => updateSection(section.key, field.key, v)}
                      siteId={site.id}
                    />
                  ))}
                </div>
              </Card>
            ))}

          {/* SEO */}
          {def.hasSeo && (
            <Card
              title="Søkemotor-data (SEO)"
              description="Hva som vises i Google og når lenken deles."
            >
              <div className="space-y-4">
                <FieldText
                  label="Sidetittel (vises i Google og i fanen)"
                  value={hero.meta_title}
                  onChange={(v) => updateHero("meta_title", v)}
                />
                <FieldTextarea
                  label="Meta-beskrivelse (vises under tittelen i Google)"
                  value={hero.meta_description}
                  onChange={(v) => updateHero("meta_description", v)}
                  rows={3}
                />
              </div>
            </Card>
          )}
        </div>
      </div>
    </>
  );
}

// ────────────────────────────────────────────────────────────
// Sub-komponenter
// ────────────────────────────────────────────────────────────

function Card({
  title,
  description,
  children,
}: {
  title: string;
  description?: string;
  children: React.ReactNode;
}) {
  return (
    <section className="rounded-2xl border border-[#e5e5e5] bg-white p-6">
      <h3 className="text-sm font-semibold text-[#171717]">{title}</h3>
      {description && <p className="mt-1 text-xs text-[#a3a3a3]">{description}</p>}
      <div className="mt-4">{children}</div>
    </section>
  );
}

function FieldText({
  label,
  value,
  onChange,
  placeholder,
  help,
}: {
  label: string;
  value: string;
  onChange: (v: string) => void;
  placeholder?: string;
  help?: string;
}) {
  return (
    <label className="block">
      <span className="text-xs font-medium text-[#737373]">{label}</span>
      <input
        type="text"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        className="mt-1 w-full rounded-lg border border-[#e5e5e5] bg-[#fafafa] px-3 py-2.5 text-sm text-[#171717] placeholder:text-[#a3a3a3] focus:border-[#dc2626] focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#dc2626]/20"
      />
      {help && <span className="mt-1 block text-[11px] text-[#a3a3a3]">{help}</span>}
    </label>
  );
}

function FieldTextarea({
  label,
  value,
  onChange,
  placeholder,
  rows = 4,
}: {
  label: string;
  value: string;
  onChange: (v: string) => void;
  placeholder?: string;
  rows?: number;
}) {
  return (
    <label className="block">
      <span className="text-xs font-medium text-[#737373]">{label}</span>
      <textarea
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        rows={rows}
        className="mt-1 w-full rounded-lg border border-[#e5e5e5] bg-[#fafafa] px-3 py-2.5 text-sm text-[#171717] placeholder:text-[#a3a3a3] focus:border-[#dc2626] focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#dc2626]/20"
      />
    </label>
  );
}

function FieldRenderer({
  field,
  value,
  onChange,
  siteId,
}: {
  field: FieldDef;
  value: string;
  onChange: (v: string) => void;
  siteId: string;
}) {
  switch (field.type) {
    case "text":
    case "href":
      return (
        <FieldText
          label={field.label}
          value={value}
          onChange={onChange}
          placeholder={field.placeholder}
          help={field.help}
        />
      );
    case "textarea":
      return (
        <FieldTextarea
          label={field.label}
          value={value}
          onChange={onChange}
          placeholder={field.placeholder}
        />
      );
    case "richtext":
      return (
        <div>
          <span className="text-xs font-medium text-[#737373]">{field.label}</span>
          <div className="mt-1">
            <RichTextEditor value={value} onChange={onChange} placeholder={field.placeholder} />
          </div>
          {field.help && <span className="mt-1 block text-[11px] text-[#a3a3a3]">{field.help}</span>}
        </div>
      );
    case "image":
      return (
        <MediaPicker
          value={value || null}
          onChange={(url) => onChange(url ?? "")}
          siteId={siteId}
          defaultCategory="general"
          label={field.label}
        />
      );
  }
}
