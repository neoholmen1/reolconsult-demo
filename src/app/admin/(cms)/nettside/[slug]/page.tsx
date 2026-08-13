"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { notFound, useParams } from "next/navigation";
import { Search } from "lucide-react";
import { getCurrentSite, type Site } from "@/lib/site";
import { getPageDef } from "@/lib/page-definitions";
import { revalidatePublicSite } from "@/app/actions/revalidate";
import UnsavedChangesGuard from "@/components/admin/UnsavedChangesGuard";
import { EditableProvider, useEditable, type EditableValues } from "@/components/admin/inline/EditableContext";
import InlineSaveBar from "@/components/admin/inline/InlineSaveBar";
import PageRenderer from "@/components/admin/inline/PageRenderer";
import { loadInitialValues, saveValues } from "@/components/admin/inline/save";

export default function InlinePageEditor() {
  const params = useParams<{ slug: string }>();
  const slug = params.slug;
  const def = getPageDef(slug);

  const [site, setSite] = useState<Site | null>(null);
  const [initial, setInitial] = useState<EditableValues | null>(null);
  const [reloadKey, setReloadKey] = useState(0);

  useEffect(() => {
    if (!def) return;
    let cancelled = false;
    (async () => {
      const s = await getCurrentSite();
      if (cancelled || !s) return;
      setSite(s);
      const values = await loadInitialValues(s.id, slug);
      if (!cancelled) setInitial(values);
    })();
    return () => { cancelled = true; };
  }, [def, slug, reloadKey]);

  if (!def) return notFound();

  if (!initial || !site) {
    return (
      <div className="flex flex-1 items-center justify-center bg-[#fafaf9]">
        <div className="h-8 w-8 animate-spin rounded-full border-2 border-[#171717] border-t-transparent" />
      </div>
    );
  }

  return (
    <EditableProvider key={reloadKey} initial={initial}>
      <PageInner
        slug={slug}
        site={site}
        pageName={def.name}
        onSaved={() => setReloadKey((k) => k + 1)}
      />
    </EditableProvider>
  );
}

function PageInner({
  slug,
  site,
  pageName,
  onSaved,
}: {
  slug: string;
  site: Site;
  pageName: string;
  onSaved: () => void;
}) {
  const { dirty, diff } = useEditable();
  const [saving, setSaving] = useState(false);
  const [status, setStatus] = useState<"idle" | "saved" | "error">("idle");
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  useEffect(() => {
    if (dirty && status === "saved") setStatus("idle");
  }, [dirty, status]);

  async function handleSave() {
    if (!dirty) return;
    setSaving(true);
    setErrorMessage(null);
    setStatus("idle");
    const r = await saveValues(site.id, slug, diff);
    if (r.error) {
      setStatus("error");
      setErrorMessage(r.error);
      setSaving(false);
      return;
    }
    await revalidatePublicSite();
    setStatus("saved");
    setSaving(false);
    // Forny initial-snapshot via reloadKey (bumper EditableProvider)
    setTimeout(() => onSaved(), 600);
  }

  const previewHref = slug === "home" ? "/" : `/${slug}`;

  return (
    <>
      <UnsavedChangesGuard dirty={dirty} />
      <InlineSaveBar
        pageName={pageName}
        previewHref={previewHref}
        saving={saving}
        status={status}
        errorMessage={errorMessage}
        onSave={handleSave}
      />

      <div className="flex-1 overflow-y-auto bg-[#fafaf9]">
        <div className="mx-auto max-w-[1400px] px-6 py-6 lg:px-10 lg:py-8">
          <div className="overflow-hidden rounded-2xl border border-[#ececec] bg-white shadow-[0_1px_2px_rgba(0,0,0,0.02)]">
            <PageRenderer slug={slug} siteId={site.id} />
          </div>

          {/* SEO-skjema */}
          <div className="mx-auto mt-6 max-w-2xl rounded-2xl border border-[#ececec] bg-white p-5">
            <div className="flex items-center gap-2">
              <Search className="h-4 w-4 text-[#737373]" strokeWidth={1.75} />
              <h2 className="text-[14px] font-semibold tracking-tight text-[#171717]">
                Søkemotor-data (SEO)
              </h2>
            </div>
            <p className="mt-1 text-[12px] text-[#737373]">
              Vises ikke på selve siden — dette er det Google og Facebook viser i søk og delingslinker.
            </p>
            <Link
              href={`/admin/innhold/${slug}#seo`}
              className="mt-3 inline-flex items-center gap-1.5 rounded-full bg-[#f5f5f4] px-3.5 py-1.5 text-[12px] font-medium text-[#525252] transition-colors duration-150 hover:bg-[#ececec] hover:text-[#171717]"
            >
              Rediger SEO →
            </Link>
          </div>
        </div>
      </div>
    </>
  );
}
