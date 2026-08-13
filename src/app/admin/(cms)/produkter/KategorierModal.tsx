"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import { FolderOpen, Plus, Pencil, Trash2 } from "lucide-react";
import { supabase } from "@/lib/supabase";
import MediaPicker from "@/components/admin/MediaPicker";
import { revalidatePublicSite } from "@/app/actions/revalidate";
import EmptyState from "@/components/admin/EmptyState";
import IconButton from "@/components/admin/IconButton";
import Modal from "@/components/admin/Modal";
import { FieldText, FieldTextarea } from "@/components/admin/Field";

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

export default function KategorierModal({
  siteId,
  onClose,
  onChanged,
}: {
  siteId: string;
  onClose: () => void;
  onChanged?: () => void;
}) {
  const [items, setItems] = useState<Category[]>([]);
  const [editing, setEditing] = useState<Category | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    let cancelled = false;
    (async () => {
      const { data } = await supabase
        .from("categories")
        .select("*")
        .eq("site_id", siteId)
        .order("sort_order");
      if (!cancelled) {
        setItems((data ?? []) as Category[]);
        setLoading(false);
      }
    })();
    return () => { cancelled = true; };
  }, [siteId]);

  function add() {
    setEditing({ id: "", site_id: siteId, ...NEW, sort_order: items.length });
  }

  async function save() {
    if (!editing) return;
    if (!editing.slug.match(/^[a-z0-9-]+$/)) {
      alert("Slug kan kun inneholde små bokstaver, tall og bindestrek.");
      return;
    }
    setSaving(true);
    const { id, ...rest } = editing;
    const payload = { ...rest, site_id: siteId };
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
    if (success) {
      await revalidatePublicSite();
      onChanged?.();
    }
    setSaving(false);
  }

  async function remove(id: string) {
    if (!confirm("Slette denne kategorien? Produkter knyttet til den må flyttes manuelt.")) return;
    const { error } = await supabase.from("categories").delete().eq("id", id);
    if (!error) {
      setItems((prev) => prev.filter((c) => c.id !== id));
      await revalidatePublicSite();
      onChanged?.();
    }
  }

  return (
    <Modal
      open
      onClose={onClose}
      title="Rediger kategorier"
      description="Hovedkategoriene som vises på forsiden og under /produkter."
      size="lg"
      footer={
        editing ? (
          <>
            <button
              onClick={() => setEditing(null)}
              className="rounded-full px-4 py-2 text-[13px] font-medium text-[#525252] transition-colors duration-150 hover:bg-white hover:text-[#171717]"
            >
              Tilbake
            </button>
            <button
              onClick={save}
              disabled={saving || !editing.slug || !editing.title}
              className="inline-flex items-center gap-1.5 rounded-full bg-[#171717] px-5 py-2 text-[13px] font-semibold text-white shadow-[0_1px_2px_rgba(0,0,0,0.08)] transition duration-150 hover:bg-[#000] hover:shadow-[0_4px_12px_rgba(0,0,0,0.15)] disabled:cursor-not-allowed disabled:bg-[#a3a3a3] disabled:shadow-none"
            >
              {saving ? "Lagrer..." : "Lagre kategori"}
            </button>
          </>
        ) : (
          <>
            <button
              onClick={add}
              className="inline-flex items-center gap-1.5 rounded-full border border-[#ececec] bg-white px-3.5 py-2 text-[12.5px] font-medium text-[#525252] transition duration-150 hover:border-[#d4d4d4] hover:text-[#171717]"
            >
              <Plus className="h-3.5 w-3.5" strokeWidth={2.25} /> Ny kategori
            </button>
            <button
              onClick={onClose}
              className="rounded-full bg-[#171717] px-5 py-2 text-[13px] font-semibold text-white shadow-[0_1px_2px_rgba(0,0,0,0.08)] transition duration-150 hover:bg-[#000] hover:shadow-[0_4px_12px_rgba(0,0,0,0.12)]"
            >
              Ferdig
            </button>
          </>
        )
      }
    >
      {editing ? (
        <div className="space-y-5">
          <h3 className="text-[14px] font-semibold tracking-tight text-[#171717]">
            {editing.id ? "Rediger kategori" : "Ny kategori"}
          </h3>
          <div className="grid grid-cols-2 gap-4">
            <FieldText
              label="Slug"
              hint="(URL-vennlig)"
              value={editing.slug}
              onChange={(v) => setEditing({ ...editing, slug: v })}
              placeholder="lager"
            />
            <FieldText
              label="Tittel"
              value={editing.title}
              onChange={(v) => setEditing({ ...editing, title: v })}
              placeholder="Lagerinnredning"
            />
          </div>
          <FieldTextarea
            label="Kort beskrivelse"
            value={editing.description}
            onChange={(v) => setEditing({ ...editing, description: v })}
            rows={2}
          />
          <MediaPicker
            value={editing.hero_image_url}
            onChange={(url) => setEditing({ ...editing, hero_image_url: url })}
            siteId={siteId}
            defaultCategory="hero"
            label="Hero-bilde"
          />
        </div>
      ) : loading ? (
        <div className="flex h-40 items-center justify-center"><span className="text-[13px] text-[#a3a3a3]">Laster…</span></div>
      ) : items.length === 0 ? (
        <EmptyState
          icon={FolderOpen}
          title="Ingen kategorier ennå"
          description="Kategoriene styrer hvordan produkter grupperes på forsiden og produktoversikten."
          actionLabel="Legg til første kategori"
          onAction={add}
        />
      ) : (
        <div className="overflow-hidden rounded-xl border border-[#ececec] bg-white">
          {items.map((c, i) => (
            <div
              key={c.id}
              className={`group flex items-center gap-4 px-4 py-3 transition-colors duration-150 hover:bg-[#fafaf9] ${
                i < items.length - 1 ? "border-b border-[#f5f5f4]" : ""
              }`}
            >
              <div className="relative h-12 w-16 shrink-0 overflow-hidden rounded-lg bg-[#fafaf9] ring-1 ring-[#ececec]">
                {c.hero_image_url && <Image src={c.hero_image_url} alt="" fill sizes="64px" className="object-cover" unoptimized />}
              </div>
              <div className="flex-1 min-w-0">
                <p className="truncate text-[13.5px] font-semibold text-[#171717]">{c.title}</p>
                <p className="mt-0.5 truncate text-[11.5px] font-mono text-[#a3a3a3]">/{c.slug}</p>
              </div>
              <div className="flex items-center gap-0.5 opacity-0 transition-opacity duration-150 group-hover:opacity-100">
                <IconButton icon={Pencil} label="Rediger" onClick={() => setEditing(c)} />
                <IconButton icon={Trash2} label="Slett" variant="danger" onClick={() => remove(c.id)} />
              </div>
            </div>
          ))}
        </div>
      )}
    </Modal>
  );
}
