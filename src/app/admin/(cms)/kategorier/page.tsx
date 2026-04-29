"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import { supabase } from "@/lib/supabase";
import { getCurrentSite, type Site } from "@/lib/site";
import MediaPicker from "@/components/admin/MediaPicker";
import { revalidatePublicSite } from "@/app/actions/revalidate";

type Category = {
  id: string;
  site_id: string;
  slug: string;
  title: string;
  description: string;
  hero_image_url: string | null;
  sort_order: number;
  published: boolean;
};

const NEW: Omit<Category, "id" | "site_id"> = {
  slug: "",
  title: "",
  description: "",
  hero_image_url: null,
  sort_order: 0,
  published: true,
};

export default function KategorierPage() {
  const [site, setSite] = useState<Site | null>(null);
  const [items, setItems] = useState<Category[]>([]);
  const [editing, setEditing] = useState<Category | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    let cancelled = false;
    (async () => {
      const s = await getCurrentSite();
      if (!s || cancelled) return;
      setSite(s);
      const { data } = await supabase.from("categories").select("*").eq("site_id", s.id).order("sort_order");
      if (!cancelled) {
        setItems((data ?? []) as Category[]);
        setLoading(false);
      }
    })();
    return () => { cancelled = true; };
  }, []);

  function add() {
    if (!site) return;
    setEditing({ id: "", site_id: site.id, ...NEW, sort_order: items.length });
  }

  async function save() {
    if (!editing || !site) return;
    if (!editing.slug.match(/^[a-z0-9-]+$/)) {
      alert("Slug kan kun inneholde små bokstaver, tall og bindestrek.");
      return;
    }
    setSaving(true);
    const { id, ...rest } = editing;
    const payload = { ...rest, site_id: site.id };
    let success = false;
    if (id) {
      const { error } = await supabase.from("categories").update(payload).eq("id", id);
      if (!error) {
        setItems((prev) => prev.map((c) => c.id === id ? { ...editing } : c));
        setEditing(null);
        success = true;
      } else alert("Feil: " + error.message);
    } else {
      const { data, error } = await supabase.from("categories").insert(payload).select().single();
      if (!error && data) {
        setItems((prev) => [...prev, data as Category]);
        setEditing(null);
        success = true;
      } else if (error) alert("Feil: " + error.message);
    }
    if (success) await revalidatePublicSite();
    setSaving(false);
  }

  async function remove(id: string) {
    if (!confirm("Slette denne kategorien? Produkter knyttet til den må flyttes manuelt.")) return;
    const { error } = await supabase.from("categories").delete().eq("id", id);
    if (!error) {
      setItems((prev) => prev.filter((c) => c.id !== id));
      await revalidatePublicSite();
    }
  }

  return (
    <>
      <div className="sticky top-0 z-10 flex h-14 shrink-0 items-center justify-between border-b border-[#e5e5e5] bg-white px-6">
        <h1 className="text-base font-semibold">Kategorier</h1>
        <button onClick={add} className="rounded-full bg-[#dc2626] px-5 py-2 text-sm font-semibold text-white hover:bg-[#b91c1c]">Ny kategori</button>
      </div>

      <div className="flex-1 overflow-y-auto p-6 lg:p-8">
        <div className="mx-auto max-w-3xl space-y-3">
          {loading ? (
            <div className="flex h-40 items-center justify-center"><span className="text-sm text-[#a3a3a3]">Laster…</span></div>
          ) : items.length === 0 ? (
            <div className="flex h-40 items-center justify-center rounded-2xl border border-dashed border-[#e5e5e5] bg-white">
              <p className="text-sm text-[#a3a3a3]">Ingen kategorier.</p>
            </div>
          ) : items.map((c) => (
            <div key={c.id} className="flex items-center gap-4 rounded-xl border border-[#e5e5e5] bg-white p-4">
              <div className="relative h-14 w-20 shrink-0 overflow-hidden rounded-lg bg-[#fafafa]">
                {c.hero_image_url && <Image src={c.hero_image_url} alt="" fill sizes="80px" className="object-cover" unoptimized />}
              </div>
              <div className="flex-1">
                <p className="text-sm font-semibold">{c.title}</p>
                <p className="text-xs text-[#a3a3a3]">/{c.slug}</p>
              </div>
              <button onClick={() => setEditing(c)} className="rounded-md border border-[#e5e5e5] px-3 py-1.5 text-xs hover:bg-[#f5f5f5]">Rediger</button>
              <button onClick={() => remove(c.id)} className="rounded-md border border-[#e5e5e5] px-3 py-1.5 text-xs text-[#dc2626] hover:bg-red-50">Slett</button>
            </div>
          ))}
        </div>
      </div>

      {editing && site && (
        <div className="fixed inset-0 z-[200] flex items-center justify-center bg-black/50 p-4" onClick={() => setEditing(null)}>
          <div className="flex max-h-[90vh] w-full max-w-lg flex-col overflow-hidden rounded-2xl bg-white shadow-2xl" onClick={(e) => e.stopPropagation()}>
            <div className="flex shrink-0 items-center justify-between border-b border-[#e5e5e5] px-6 py-4">
              <h2 className="text-lg font-semibold">{editing.id ? "Rediger kategori" : "Ny kategori"}</h2>
              <button onClick={() => setEditing(null)} className="text-sm text-[#737373]">Avbryt</button>
            </div>
            <div className="flex-1 overflow-y-auto p-6 space-y-4">
              <FieldText label="Slug (URL-vennlig kort navn)" value={editing.slug} onChange={(v) => setEditing({ ...editing, slug: v })} placeholder="lager" />
              <FieldText label="Tittel" value={editing.title} onChange={(v) => setEditing({ ...editing, title: v })} placeholder="Lagerinnredning" />
              <label className="block">
                <span className="text-xs font-medium text-[#737373]">Kort beskrivelse</span>
                <textarea value={editing.description} onChange={(e) => setEditing({ ...editing, description: e.target.value })} rows={2} className="mt-1 w-full rounded-lg border border-[#e5e5e5] bg-[#fafafa] px-3 py-2.5 text-sm focus:border-[#dc2626] focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#dc2626]/20" />
              </label>
              <MediaPicker value={editing.hero_image_url} onChange={(url) => setEditing({ ...editing, hero_image_url: url })} siteId={site.id} defaultCategory="hero" label="Hero-bilde" />
            </div>
            <div className="flex shrink-0 justify-end gap-3 border-t border-[#e5e5e5] px-6 py-4">
              <button onClick={() => setEditing(null)} className="rounded-full border border-[#e5e5e5] px-5 py-2 text-sm text-[#737373] hover:bg-[#f5f5f5]">Avbryt</button>
              <button onClick={save} disabled={saving || !editing.slug || !editing.title} className="rounded-full bg-[#dc2626] px-5 py-2 text-sm font-semibold text-white hover:bg-[#b91c1c] disabled:opacity-50">{saving ? "Lagrer..." : "Lagre"}</button>
            </div>
          </div>
        </div>
      )}
    </>
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
