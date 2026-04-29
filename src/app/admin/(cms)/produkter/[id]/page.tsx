"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { useParams, useRouter } from "next/navigation";
import { supabase } from "@/lib/supabase";
import { getCurrentSite, type Site } from "@/lib/site";
import MediaPicker from "@/components/admin/MediaPicker";
import RichTextEditor from "@/components/admin/RichTextEditor";
import SaveBar from "@/components/admin/SaveBar";
import UnsavedChangesGuard from "@/components/admin/UnsavedChangesGuard";
import { revalidatePublicSite } from "@/app/actions/revalidate";

type GalleryImage = { url: string; alt: string };

type Product = {
  id: string;
  site_id: string;
  category_slug: string;
  slug: string;
  title: string;
  short_description: string;
  long_description: string;
  hero_image_url: string | null;
  gallery_images: GalleryImage[];
  specs: string[];
  variants: unknown[];
  price_from: number | null;
  price_unit: string;
  sort_order: number;
  published: boolean;
};

const EMPTY: Product = {
  id: "",
  site_id: "",
  category_slug: "",
  slug: "",
  title: "",
  short_description: "",
  long_description: "",
  hero_image_url: null,
  gallery_images: [],
  specs: [],
  variants: [],
  price_from: null,
  price_unit: "",
  sort_order: 0,
  published: true,
};

export default function ProduktEditor() {
  const params = useParams<{ id: string }>();
  const router = useRouter();
  const isNew = params.id === "ny";

  const [site, setSite] = useState<Site | null>(null);
  const [categories, setCategories] = useState<{ slug: string; title: string }[]>([]);
  const [product, setProduct] = useState<Product>(EMPTY);
  const [loading, setLoading] = useState(true);
  const [dirty, setDirty] = useState(false);
  const [status, setStatus] = useState<"idle" | "saving" | "saved" | "error">("idle");
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;
    (async () => {
      const s = await getCurrentSite();
      if (!s || cancelled) return;
      setSite(s);
      const { data: cats } = await supabase.from("categories").select("slug, title").eq("site_id", s.id).order("sort_order");
      if (cancelled) return;
      setCategories((cats ?? []) as { slug: string; title: string }[]);

      if (isNew) {
        setProduct({ ...EMPTY, site_id: s.id, category_slug: cats?.[0]?.slug ?? "" });
        setLoading(false);
        return;
      }

      const { data, error } = await supabase.from("products").select("*").eq("id", params.id).maybeSingle();
      if (!cancelled) {
        if (error || !data) {
          setErrorMessage("Fant ikke produktet");
          setLoading(false);
          return;
        }
        setProduct({
          ...data,
          gallery_images: Array.isArray(data.gallery_images) ? data.gallery_images : [],
          specs: Array.isArray(data.specs) ? data.specs : [],
          variants: Array.isArray(data.variants) ? data.variants : [],
        } as Product);
        setLoading(false);
      }
    })();
    return () => { cancelled = true; };
  }, [params.id, isNew]);

  function update<K extends keyof Product>(key: K, value: Product[K]) {
    setProduct((prev) => ({ ...prev, [key]: value }));
    setDirty(true);
    setStatus("idle");
  }

  function addSpec() { update("specs", [...product.specs, ""]); }
  function updateSpec(i: number, v: string) { update("specs", product.specs.map((s, idx) => idx === i ? v : s)); }
  function removeSpec(i: number) { update("specs", product.specs.filter((_, idx) => idx !== i)); }

  function addGalleryImage(url: string) { update("gallery_images", [...product.gallery_images, { url, alt: "" }]); }
  function updateGalleryAlt(i: number, alt: string) { update("gallery_images", product.gallery_images.map((g, idx) => idx === i ? { ...g, alt } : g)); }
  function removeGalleryImage(i: number) { update("gallery_images", product.gallery_images.filter((_, idx) => idx !== i)); }

  async function save() {
    if (!site) return;
    if (!product.slug.match(/^[a-z0-9-]+$/)) {
      setStatus("error");
      setErrorMessage("Slug kan kun inneholde små bokstaver, tall og bindestrek.");
      return;
    }
    setStatus("saving");
    setErrorMessage(null);
    const payload = {
      site_id: site.id,
      category_slug: product.category_slug,
      slug: product.slug,
      title: product.title,
      short_description: product.short_description,
      long_description: product.long_description,
      hero_image_url: product.hero_image_url,
      gallery_images: product.gallery_images,
      specs: product.specs.filter(Boolean),
      variants: product.variants,
      price_from: product.price_from,
      price_unit: product.price_unit,
      sort_order: product.sort_order,
      published: product.published,
    };
    if (product.id) {
      const { error } = await supabase.from("products").update(payload).eq("id", product.id);
      if (error) { setStatus("error"); setErrorMessage(error.message); return; }
    } else {
      const { data, error } = await supabase.from("products").insert(payload).select().single();
      if (error || !data) { setStatus("error"); setErrorMessage(error?.message ?? "Feilet"); return; }
      router.replace(`/admin/produkter/${data.id}`);
    }
    await revalidatePublicSite();
    setDirty(false);
    setStatus("saved");
  }

  if (loading) return <div className="flex flex-1 items-center justify-center"><div className="h-8 w-8 animate-spin rounded-full border-2 border-[#dc2626] border-t-transparent" /></div>;

  return (
    <>
      <UnsavedChangesGuard dirty={dirty} />
      <SaveBar
        title={isNew ? "Nytt produkt" : product.title || "Produkt"}
        dirty={dirty}
        status={status}
        onSave={save}
        errorMessage={errorMessage}
        rightContent={
          <Link href="/admin/produkter" className="rounded-full border border-[#e5e5e5] px-4 py-2 text-sm font-medium text-[#404040] hover:bg-[#f5f5f5]">← Til listen</Link>
        }
      />

      <div className="flex-1 overflow-y-auto p-6 lg:p-8">
        <div className="mx-auto max-w-3xl space-y-6">
          <Card title="Grunninfo">
            <div className="space-y-4">
              <div className="grid gap-4 sm:grid-cols-2">
                <FieldText label="Tittel" value={product.title} onChange={(v) => update("title", v)} />
                <FieldText label="Slug" value={product.slug} onChange={(v) => update("slug", v)} placeholder="pallreoler" />
              </div>
              <label className="block">
                <span className="text-xs font-medium text-[#737373]">Kategori</span>
                <select value={product.category_slug} onChange={(e) => update("category_slug", e.target.value)} className="mt-1 w-full rounded-lg border border-[#e5e5e5] bg-[#fafafa] px-3 py-2.5 text-sm focus:border-[#dc2626] focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#dc2626]/20">
                  {categories.map((c) => (<option key={c.slug} value={c.slug}>{c.title}</option>))}
                </select>
              </label>
              <FieldTextarea label="Kort beskrivelse (vises i kortet)" value={product.short_description} onChange={(v) => update("short_description", v)} rows={2} />
              <div>
                <span className="text-xs font-medium text-[#737373]">Lang beskrivelse (markdown)</span>
                <div className="mt-1">
                  <RichTextEditor value={product.long_description} onChange={(v) => update("long_description", v)} />
                </div>
              </div>
            </div>
          </Card>

          {site && (
            <Card title="Bilder">
              <div className="space-y-4">
                <MediaPicker value={product.hero_image_url} onChange={(url) => update("hero_image_url", url)} siteId={site.id} defaultCategory="product" label="Hovedbilde" />

                <div>
                  <span className="text-xs font-medium text-[#737373]">Galleri</span>
                  <div className="mt-2 space-y-2">
                    {product.gallery_images.map((img, i) => (
                      <div key={i} className="flex items-start gap-3 rounded-lg border border-[#e5e5e5] bg-[#fafafa] p-3">
                        <div className="relative h-16 w-20 shrink-0 overflow-hidden rounded">
                          <Image src={img.url} alt={img.alt} fill sizes="80px" className="object-cover" unoptimized />
                        </div>
                        <input type="text" value={img.alt} onChange={(e) => updateGalleryAlt(i, e.target.value)} placeholder="Alt-tekst" className="flex-1 rounded-md border border-[#e5e5e5] bg-white px-2 py-1.5 text-xs focus:border-[#dc2626] focus:outline-none" />
                        <button onClick={() => removeGalleryImage(i)} className="rounded p-1 text-xs text-[#dc2626] hover:bg-red-50">✕</button>
                      </div>
                    ))}
                  </div>
                  <div className="mt-2">
                    <MediaPicker value={null} onChange={(url) => { if (url) addGalleryImage(url); }} siteId={site.id} defaultCategory="product" label="Legg til galleribilde" />
                  </div>
                </div>
              </div>
            </Card>
          )}

          <Card title="Specs (kort liste under produktet)">
            <div className="space-y-2">
              {product.specs.map((s, i) => (
                <div key={i} className="flex gap-2">
                  <input type="text" value={s} onChange={(e) => updateSpec(i, e.target.value)} className="flex-1 rounded-lg border border-[#e5e5e5] bg-[#fafafa] px-3 py-2 text-sm focus:border-[#dc2626] focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#dc2626]/20" placeholder="F.eks. Opptil 30 m høyde" />
                  <button onClick={() => removeSpec(i)} className="rounded-md border border-[#e5e5e5] px-3 text-xs text-[#dc2626] hover:bg-red-50">Fjern</button>
                </div>
              ))}
              <button onClick={addSpec} className="rounded-md border border-dashed border-[#e5e5e5] px-4 py-2 text-xs text-[#737373] hover:border-[#dc2626] hover:text-[#dc2626]">+ Legg til spec</button>
            </div>
          </Card>

          <Card title="Pris">
            <div className="grid gap-4 sm:grid-cols-2">
              <label className="block">
                <span className="text-xs font-medium text-[#737373]">Fra-pris (kr)</span>
                <input type="number" value={product.price_from ?? ""} onChange={(e) => update("price_from", e.target.value === "" ? null : Number(e.target.value))} placeholder="2990" className="mt-1 w-full rounded-lg border border-[#e5e5e5] bg-[#fafafa] px-3 py-2.5 text-sm focus:border-[#dc2626] focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#dc2626]/20" />
                <span className="mt-1 block text-[11px] text-[#a3a3a3]">La stå tomt for å skjule pris.</span>
              </label>
              <FieldText label="Enhet" value={product.price_unit} onChange={(v) => update("price_unit", v)} placeholder="per seksjon" />
            </div>
          </Card>

          <Card title="Synlighet">
            <label className="flex items-center gap-3">
              <input type="checkbox" checked={product.published} onChange={(e) => update("published", e.target.checked)} className="h-4 w-4" />
              <span className="text-sm text-[#404040]">Publisert (vises på nettsiden)</span>
            </label>
          </Card>
        </div>
      </div>
    </>
  );
}

function Card({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <section className="rounded-2xl border border-[#e5e5e5] bg-white p-6">
      <h3 className="text-sm font-semibold text-[#171717]">{title}</h3>
      <div className="mt-4">{children}</div>
    </section>
  );
}

function FieldText({ label, value, onChange, placeholder }: { label: string; value: string; onChange: (v: string) => void; placeholder?: string }) {
  return (
    <label className="block">
      <span className="text-xs font-medium text-[#737373]">{label}</span>
      <input type="text" value={value} onChange={(e) => onChange(e.target.value)} placeholder={placeholder} className="mt-1 w-full rounded-lg border border-[#e5e5e5] bg-[#fafafa] px-3 py-2.5 text-sm focus:border-[#dc2626] focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#dc2626]/20" />
    </label>
  );
}

function FieldTextarea({ label, value, onChange, rows = 4, placeholder }: { label: string; value: string; onChange: (v: string) => void; rows?: number; placeholder?: string }) {
  return (
    <label className="block">
      <span className="text-xs font-medium text-[#737373]">{label}</span>
      <textarea value={value} onChange={(e) => onChange(e.target.value)} rows={rows} placeholder={placeholder} className="mt-1 w-full rounded-lg border border-[#e5e5e5] bg-[#fafafa] px-3 py-2.5 text-sm focus:border-[#dc2626] focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#dc2626]/20" />
    </label>
  );
}
