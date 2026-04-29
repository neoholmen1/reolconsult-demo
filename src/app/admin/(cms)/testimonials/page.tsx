"use client";

import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";
import { getCurrentSite, type Site } from "@/lib/site";
import { revalidatePublicSite } from "@/app/actions/revalidate";

type Testimonial = {
  id: string;
  site_id: string;
  author_name: string;
  author_role: string;
  author_company: string;
  quote: string;
  rating: number | null;
  sort_order: number;
  published: boolean;
};

const NEW: Omit<Testimonial, "id" | "site_id"> = {
  author_name: "",
  author_role: "",
  author_company: "",
  quote: "",
  rating: null,
  sort_order: 0,
  published: true,
};

export default function TestimonialsPage() {
  const [site, setSite] = useState<Site | null>(null);
  const [items, setItems] = useState<Testimonial[]>([]);
  const [editing, setEditing] = useState<Testimonial | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    let cancelled = false;
    (async () => {
      const s = await getCurrentSite();
      if (!s || cancelled) return;
      setSite(s);
      const { data } = await supabase.from("testimonials").select("*").eq("site_id", s.id).order("sort_order");
      if (!cancelled) {
        setItems((data ?? []) as Testimonial[]);
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
    setSaving(true);
    const payload = {
      site_id: site.id,
      author_name: editing.author_name,
      author_role: editing.author_role,
      author_company: editing.author_company,
      quote: editing.quote,
      rating: editing.rating,
      sort_order: editing.sort_order,
      published: editing.published,
    };
    let success = false;
    if (editing.id) {
      const { error } = await supabase.from("testimonials").update(payload).eq("id", editing.id);
      if (!error) {
        setItems((prev) => prev.map((i) => (i.id === editing.id ? { ...editing } : i)));
        setEditing(null);
        success = true;
      } else alert("Feil: " + error.message);
    } else {
      const { data, error } = await supabase.from("testimonials").insert(payload).select().single();
      if (!error && data) {
        setItems((prev) => [...prev, data as Testimonial]);
        setEditing(null);
        success = true;
      } else if (error) alert("Feil: " + error.message);
    }
    if (success) await revalidatePublicSite();
    setSaving(false);
  }

  async function remove(id: string) {
    if (!confirm("Slette dette sitatet?")) return;
    const { error } = await supabase.from("testimonials").delete().eq("id", id);
    if (!error) {
      setItems((prev) => prev.filter((i) => i.id !== id));
      await revalidatePublicSite();
    }
  }

  async function togglePublished(t: Testimonial) {
    const { error } = await supabase.from("testimonials").update({ published: !t.published }).eq("id", t.id);
    if (!error) {
      setItems((prev) => prev.map((i) => i.id === t.id ? { ...i, published: !i.published } : i));
      await revalidatePublicSite();
    }
  }

  return (
    <>
      <div className="sticky top-0 z-10 flex h-14 shrink-0 items-center justify-between border-b border-[#e5e5e5] bg-white px-6">
        <h1 className="text-base font-semibold text-[#171717]">Testimonials</h1>
        <button onClick={add} className="rounded-full bg-[#dc2626] px-5 py-2 text-sm font-semibold text-white hover:bg-[#b91c1c]">Nytt sitat</button>
      </div>

      <div className="flex-1 overflow-y-auto p-6 lg:p-8">
        <div className="mx-auto max-w-3xl space-y-3">
          {loading ? (
            <div className="flex h-40 items-center justify-center"><span className="text-sm text-[#a3a3a3]">Laster…</span></div>
          ) : items.length === 0 ? (
            <div className="flex h-40 items-center justify-center rounded-2xl border border-dashed border-[#e5e5e5] bg-white">
              <p className="text-sm text-[#a3a3a3]">Ingen sitater enda.</p>
            </div>
          ) : (
            items.map((t) => (
              <div key={t.id} className="rounded-xl border border-[#e5e5e5] bg-white p-5">
                <p className="text-sm italic text-[#404040]">«{t.quote}»</p>
                <div className="mt-3 flex items-center justify-between">
                  <p className="text-xs text-[#737373]">
                    <span className="font-medium text-[#171717]">{t.author_name}</span>
                    {t.author_role && ` · ${t.author_role}`}
                    {t.author_company && ` · ${t.author_company}`}
                  </p>
                  <div className="flex items-center gap-2">
                    <button onClick={() => togglePublished(t)} className={`rounded-full px-2 py-0.5 text-[10px] font-medium ${t.published ? "bg-emerald-50 text-emerald-700" : "bg-[#e5e5e5] text-[#737373]"}`}>
                      {t.published ? "Publisert" : "Utkast"}
                    </button>
                    <button onClick={() => setEditing(t)} className="rounded-md border border-[#e5e5e5] px-3 py-1.5 text-xs hover:bg-[#f5f5f5]">Rediger</button>
                    <button onClick={() => remove(t.id)} className="rounded-md border border-[#e5e5e5] px-3 py-1.5 text-xs text-[#dc2626] hover:bg-red-50">Slett</button>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      </div>

      {editing && (
        <div className="fixed inset-0 z-[200] flex items-center justify-center bg-black/50 p-4" onClick={() => setEditing(null)}>
          <div className="flex max-h-[90vh] w-full max-w-lg flex-col overflow-hidden rounded-2xl bg-white shadow-2xl" onClick={(e) => e.stopPropagation()}>
            <div className="flex shrink-0 items-center justify-between border-b border-[#e5e5e5] px-6 py-4">
              <h2 className="text-lg font-semibold">{editing.id ? "Rediger sitat" : "Nytt sitat"}</h2>
              <button onClick={() => setEditing(null)} className="text-sm text-[#737373]">Avbryt</button>
            </div>
            <div className="flex-1 overflow-y-auto p-6 space-y-4">
              <label className="block">
                <span className="text-xs font-medium text-[#737373]">Sitat</span>
                <textarea value={editing.quote} onChange={(e) => setEditing({ ...editing, quote: e.target.value })} rows={4} className="mt-1 w-full rounded-lg border border-[#e5e5e5] bg-[#fafafa] px-3 py-2.5 text-sm focus:border-[#dc2626] focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#dc2626]/20" />
              </label>
              <FieldText label="Navn" value={editing.author_name} onChange={(v) => setEditing({ ...editing, author_name: v })} />
              <FieldText label="Rolle" value={editing.author_role} onChange={(v) => setEditing({ ...editing, author_role: v })} placeholder="F.eks. Daglig leder" />
              <FieldText label="Bedrift" value={editing.author_company} onChange={(v) => setEditing({ ...editing, author_company: v })} />
            </div>
            <div className="flex shrink-0 justify-end gap-3 border-t border-[#e5e5e5] px-6 py-4">
              <button onClick={() => setEditing(null)} className="rounded-full border border-[#e5e5e5] px-5 py-2 text-sm text-[#737373] hover:bg-[#f5f5f5]">Avbryt</button>
              <button onClick={save} disabled={saving || !editing.quote || !editing.author_name} className="rounded-full bg-[#dc2626] px-5 py-2 text-sm font-semibold text-white hover:bg-[#b91c1c] disabled:opacity-50">{saving ? "Lagrer..." : "Lagre"}</button>
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
