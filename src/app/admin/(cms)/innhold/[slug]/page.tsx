"use client";

import { useEffect, useState, useMemo } from "react";
import Link from "next/link";
import { notFound, useParams } from "next/navigation";
import { ChevronRight, ExternalLink, Search, Sparkles, MapPin } from "lucide-react";
import { supabase } from "@/lib/supabase";
import { getCurrentSite, type Site } from "@/lib/site";
import { type Page, type PageSection } from "@/lib/cms";
import { savePageHero, savePageSections, buildSectionMap } from "@/lib/page-content";
import { getPageDef, type PageDef, type FieldDef } from "@/lib/page-definitions";
import { getPageMeta, TONE_STYLES } from "@/lib/page-meta";
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
      <div className="flex flex-1 items-center justify-center bg-[#fafaf9]">
        <div className="h-8 w-8 animate-spin rounded-full border-2 border-[#171717] border-t-transparent" />
      </div>
    );
  }

  const previewHref = slug === "home" ? "/" : `/${slug}`;

  // Bygg en flat liste over seksjoner for nummerering + ankere
  const sectionList: { id: string; label: string; placement: string }[] = [];
  if (def.hasHero) sectionList.push({ id: "hero", label: "Topp-banner", placement: def.heroPlacement ?? "Topp av siden" });
  def.sections?.forEach((s) => {
    sectionList.push({ id: s.key, label: s.name, placement: s.placement ?? "" });
  });
  if (def.hasSeo) sectionList.push({ id: "seo", label: "SEO", placement: "Vises ikke på siden — Google og delingslinker" });

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
            className="inline-flex items-center gap-1.5 rounded-full border border-[#ececec] bg-white px-3.5 py-2 text-[12.5px] font-medium text-[#525252] transition duration-150 hover:border-[#d4d4d4] hover:text-[#171717]"
          >
            Forhåndsvis <ExternalLink className="h-3 w-3" strokeWidth={2} />
          </Link>
        }
      />

      <div className="flex-1 overflow-y-auto bg-[#fafaf9]">
        <div className="mx-auto max-w-3xl space-y-5 p-6 lg:p-10">
          <PageIntro
            slug={slug}
            name={def.name}
            previewHref={previewHref}
            sections={sectionList}
          />

          {/* Hero */}
          {def.hasHero && site && (
              <Card
                id="hero"
                step="Topp-banner"
                placement={def.heroPlacement ?? "Helt øverst på siden — det første besøkende ser"}
                title="Hero / topbilde"
              >
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
              def.sections?.map((section, i) => {
                const total = def.sections!.length;
                const stepLabel = `Seksjon ${i + 1} av ${total}`;
                return (
                  <Card
                    key={section.key}
                    id={section.key}
                    step={stepLabel}
                    placement={section.placement ?? section.description ?? ""}
                    title={section.name}
                    description={section.placement ? section.description : undefined}
                  >
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
                );
              })}

            {/* SEO */}
            {def.hasSeo && (
              <Card
                id="seo"
                step="Søkemotor"
                placement="Vises ikke på selve siden — dette er det Google og Facebook viser i søk og delingslinker"
                title="Søkemotor-data (SEO)"
                icon={Search}
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

function PageIntro({
  slug,
  name,
  previewHref,
  sections,
}: {
  slug: string;
  name: string;
  previewHref: string;
  sections: { id: string; label: string; placement: string }[];
}) {
  const meta = getPageMeta(slug);
  const tone = meta ? TONE_STYLES[meta.tone] : null;
  const Icon = meta?.icon ?? Sparkles;

  return (
    <div className="overflow-hidden rounded-2xl border border-[#ececec] bg-white shadow-[0_1px_2px_rgba(0,0,0,0.02)]">
      <div className="flex items-start gap-5 p-6">
        <div
          className={`flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl bg-gradient-to-br ${
            tone?.bg ?? "from-stone-50 to-stone-100/40"
          } ring-1 ring-inset ${tone?.ring ?? "ring-stone-200"} ${tone?.icon ?? "text-stone-700"}`}
        >
          <Icon className="h-6 w-6" strokeWidth={1.5} />
        </div>
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-1 text-[11px] text-[#a3a3a3]">
            <Link href="/admin/nettside" className="font-medium hover:text-[#171717]">Nettside</Link>
            <ChevronRight className="h-3 w-3" strokeWidth={2} />
            <span className="font-medium">{meta?.group ?? "Sider"}</span>
            <ChevronRight className="h-3 w-3" strokeWidth={2} />
            <span className="font-medium text-[#171717]">{name}</span>
          </div>
          <div className="mt-1 flex items-baseline gap-2.5">
            <h2 className="text-[20px] font-semibold tracking-tight text-[#171717]">{name}</h2>
            <a
              href={`https://reolconsult.no${previewHref}`}
              target="_blank"
              rel="noopener"
              className="group inline-flex items-center gap-1 rounded-md bg-[#fafaf9] px-2 py-0.5 font-mono text-[11px] text-[#737373] transition-colors duration-150 hover:bg-[#f5f5f4] hover:text-[#171717]"
            >
              reolconsult.no{previewHref === "/" ? "" : previewHref}
              <ExternalLink className="h-2.5 w-2.5 opacity-0 transition-opacity duration-150 group-hover:opacity-100" strokeWidth={2} />
            </a>
          </div>
          {meta?.description && (
            <p className="mt-2.5 text-[13px] leading-relaxed text-[#525252]">{meta.description}</p>
          )}
        </div>
        <Link
          href={previewHref}
          target="_blank"
          className="inline-flex shrink-0 items-center gap-1.5 rounded-full border border-[#ececec] bg-white px-3.5 py-2 text-[12px] font-medium text-[#525252] transition duration-150 hover:border-[#d4d4d4] hover:text-[#171717]"
        >
          Forhåndsvis side <ExternalLink className="h-3 w-3" strokeWidth={2} />
        </Link>
      </div>

      {sections.length > 0 && (
        <div className="flex flex-wrap items-center gap-1.5 border-t border-[#ececec] bg-[#fafaf9] px-6 py-3">
          <span className="mr-1 text-[10.5px] font-medium uppercase tracking-wider text-[#a3a3a3]">
            {sections.length} {sections.length === 1 ? "seksjon" : "seksjoner"}
          </span>
          {sections.map((s, i) => (
            <a
              key={s.id}
              href={`#${s.id}`}
              title={s.placement}
              className="inline-flex items-center gap-1.5 rounded-full border border-[#ececec] bg-white px-2.5 py-1 text-[11.5px] font-medium text-[#525252] transition duration-150 hover:border-[#d4d4d4] hover:text-[#171717]"
            >
              <span className="text-[10px] text-[#a3a3a3]">{i + 1}</span>
              {s.label}
            </a>
          ))}
        </div>
      )}
    </div>
  );
}

// ────────────────────────────────────────────────────────────
// Sub-komponenter
// ────────────────────────────────────────────────────────────

function Card({
  id,
  step,
  placement,
  title,
  description,
  icon: Icon,
  children,
}: {
  id?: string;
  step?: string;
  placement?: string;
  title: string;
  description?: string;
  icon?: typeof ChevronRight;
  children: React.ReactNode;
}) {
  return (
    <section
      id={id}
      className="scroll-mt-24 overflow-hidden rounded-2xl border border-[#ececec] bg-white shadow-[0_1px_2px_rgba(0,0,0,0.02)]"
    >
      <div className="border-b border-[#ececec] bg-[#fafaf9] px-6 py-4">
        <div className="flex items-center gap-2">
          {step && (
            <span className="inline-flex items-center gap-1 rounded-full bg-white px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wider text-[#525252] ring-1 ring-[#ececec]">
              {step}
            </span>
          )}
        </div>
        <div className="mt-2 flex items-start gap-2">
          {Icon && <Icon className="mt-0.5 h-4 w-4 text-[#737373]" strokeWidth={1.75} />}
          <div className="flex-1">
            <h3 className="text-[15px] font-semibold tracking-tight text-[#171717]">{title}</h3>
            {description && <p className="mt-0.5 text-[12.5px] text-[#737373]">{description}</p>}
          </div>
        </div>
        {placement && (
          <div className="mt-3 flex items-start gap-2 rounded-lg border border-rose-100 bg-rose-50/40 px-3 py-2">
            <MapPin className="mt-px h-3.5 w-3.5 shrink-0 text-[#dc2626]" strokeWidth={1.75} />
            <p className="text-[12px] leading-snug text-[#525252]">
              <span className="font-medium text-[#171717]">Hvor på siden: </span>
              {placement}
            </p>
          </div>
        )}
      </div>
      <div className="p-6">{children}</div>
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
      <span className="text-[12px] font-medium text-[#404040]">{label}</span>
      <input
        type="text"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        className="mt-1.5 w-full rounded-lg border border-[#ececec] bg-[#fafaf9] px-3.5 py-2.5 text-[13px] text-[#171717] placeholder:text-[#a3a3a3] transition duration-150 focus:border-[#171717] focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#171717]/10"
      />
      {help && <span className="mt-1.5 block text-[11px] text-[#a3a3a3]">{help}</span>}
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
      <span className="text-[12px] font-medium text-[#404040]">{label}</span>
      <textarea
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        rows={rows}
        className="mt-1.5 w-full resize-y rounded-lg border border-[#ececec] bg-[#fafaf9] px-3.5 py-2.5 text-[13px] text-[#171717] placeholder:text-[#a3a3a3] transition duration-150 focus:border-[#171717] focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#171717]/10"
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
          <span className="text-[12px] font-medium text-[#404040]">{field.label}</span>
          <div className="mt-1.5">
            <RichTextEditor value={value} onChange={onChange} placeholder={field.placeholder} />
          </div>
          {field.help && <span className="mt-1.5 block text-[11px] text-[#a3a3a3]">{field.help}</span>}
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
