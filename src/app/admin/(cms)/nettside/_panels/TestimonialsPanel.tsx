"use client";

import { useEffect, useState } from "react";
import { MessageSquare, Plus, Pencil, Trash2 } from "lucide-react";
import { supabase } from "@/lib/supabase";
import { getCurrentSite, type Site } from "@/lib/site";
import { revalidatePublicSite } from "@/app/actions/revalidate";
import EmptyState from "@/components/admin/EmptyState";
import IconButton from "@/components/admin/IconButton";
import Modal, { ModalActions } from "@/components/admin/Modal";
import { FieldText, FieldTextarea } from "@/components/admin/Field";

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

export default function TestimonialsPanel() {
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
    <div className="mx-auto max-w-3xl space-y-5 p-8 lg:p-12">
      <div className="flex items-center justify-between">
        <p className="text-[13px] text-[#737373]">Kundesitater vises i en egen seksjon på forsiden.</p>
        <button
          onClick={add}
          className="inline-flex items-center gap-1.5 rounded-full bg-[#171717] px-4 py-2 text-[12.5px] font-semibold text-white shadow-[0_1px_2px_rgba(0,0,0,0.08)] transition duration-150 hover:bg-[#000] hover:shadow-[0_4px_12px_rgba(0,0,0,0.12)]"
        >
          <Plus className="h-3.5 w-3.5" strokeWidth={2.25} /> Nytt sitat
        </button>
      </div>

      {loading ? (
        <div className="flex h-40 items-center justify-center"><span className="text-[13px] text-[#a3a3a3]">Laster…</span></div>
      ) : items.length === 0 ? (
        <EmptyState
          icon={MessageSquare}
          title="Ingen sitater ennå"
          description="Legg til kundesitater for å vise dem i en egen seksjon på forsiden. Seksjonen er skjult inntil du har minst ett publisert sitat."
          actionLabel="Legg til første sitat"
          onAction={add}
        />
      ) : (
        <div className="space-y-3">
          {items.map((t) => (
            <div
              key={t.id}
              className="group rounded-xl border border-[#ececec] bg-white p-5 transition duration-150 hover:border-[#d4d4d4] hover:shadow-[0_4px_12px_-4px_rgba(0,0,0,0.06)]"
            >
              <p className="text-[14px] italic leading-relaxed text-[#404040]">«{t.quote}»</p>
              <div className="mt-4 flex items-center justify-between">
                <p className="text-[12px] text-[#737373]">
                  <span className="font-medium text-[#171717]">{t.author_name}</span>
                  {t.author_role && <span className="text-[#d4d4d4]"> · </span>}
                  {t.author_role}
                  {t.author_company && <span className="text-[#d4d4d4]"> · </span>}
                  {t.author_company}
                </p>
                <div className="flex items-center gap-1">
                  <button
                    onClick={() => togglePublished(t)}
                    className={`rounded-full px-2.5 py-0.5 text-[10.5px] font-medium transition-colors duration-150 ${
                      t.published
                        ? "bg-emerald-50 text-emerald-700 hover:bg-emerald-100"
                        : "bg-[#f5f5f4] text-[#737373] hover:bg-[#ececec]"
                    }`}
                  >
                    {t.published ? "Publisert" : "Utkast"}
                  </button>
                  <div className="opacity-0 transition-opacity duration-150 group-hover:opacity-100 flex items-center gap-0.5 ml-1">
                    <IconButton icon={Pencil} label="Rediger" onClick={() => setEditing(t)} />
                    <IconButton icon={Trash2} label="Slett" onClick={() => remove(t.id)} variant="danger" />
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {editing && (
        <Modal
          open
          onClose={() => setEditing(null)}
          title={editing.id ? "Rediger sitat" : "Nytt sitat"}
          footer={
            <ModalActions
              onCancel={() => setEditing(null)}
              onSave={save}
              saving={saving}
              disabled={!editing.quote || !editing.author_name}
            />
          }
        >
          <div className="space-y-5">
            <FieldTextarea label="Sitat" value={editing.quote} onChange={(v) => setEditing({ ...editing, quote: v })} rows={4} placeholder="Skriv hva kunden sa…" />
            <FieldText label="Navn" value={editing.author_name} onChange={(v) => setEditing({ ...editing, author_name: v })} />
            <div className="grid grid-cols-2 gap-4">
              <FieldText label="Rolle" value={editing.author_role} onChange={(v) => setEditing({ ...editing, author_role: v })} placeholder="F.eks. Daglig leder" />
              <FieldText label="Bedrift" value={editing.author_company} onChange={(v) => setEditing({ ...editing, author_company: v })} />
            </div>
          </div>
        </Modal>
      )}
    </div>
  );
}
