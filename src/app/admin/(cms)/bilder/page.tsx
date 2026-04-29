"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import { supabase } from "@/lib/supabase";
import { getCurrentSite, type Site } from "@/lib/site";
import { listMedia, MEDIA_CATEGORIES, type MediaItem } from "@/lib/cms";
import { uploadImage, deleteFromStorage } from "@/lib/storage";
import { revalidatePublicSite } from "@/app/actions/revalidate";

type Filter = "all" | (typeof MEDIA_CATEGORIES)[number]["key"];

export default function BilderPage() {
  const [site, setSite] = useState<Site | null>(null);
  const [items, setItems] = useState<MediaItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState<Filter>("all");
  const [uploadCategory, setUploadCategory] = useState<string>("general");
  const [uploading, setUploading] = useState(false);
  const [uploadError, setUploadError] = useState<string | null>(null);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [draftAlt, setDraftAlt] = useState("");
  const [draftCategory, setDraftCategory] = useState("general");
  const [savingId, setSavingId] = useState<string | null>(null);
  const [deletingId, setDeletingId] = useState<string | null>(null);

  // Hent site
  useEffect(() => {
    let cancelled = false;
    (async () => {
      const s = await getCurrentSite();
      if (!cancelled) setSite(s);
    })();
    return () => {
      cancelled = true;
    };
  }, []);

  // Hent bilder
  useEffect(() => {
    if (!site) return;
    let cancelled = false;
    setLoading(true);
    listMedia(site.id, filter === "all" ? undefined : filter).then((data) => {
      if (!cancelled) {
        setItems(data);
        setLoading(false);
      }
    });
    return () => {
      cancelled = true;
    };
  }, [site, filter]);

  async function handleFiles(files: FileList | File[]) {
    if (!site) return;
    setUploadError(null);
    setUploading(true);
    const newItems: MediaItem[] = [];
    for (const file of Array.from(files)) {
      try {
        const result = await uploadImage(site.id, uploadCategory, file);
        const { data, error } = await supabase
          .from("media")
          .insert({
            site_id: site.id,
            storage_path: result.storagePath,
            url: result.url,
            alt_text: file.name.replace(/\.[^.]+$/, ""),
            category: uploadCategory,
            mime_type: result.mime,
            size_bytes: result.size,
            width: result.width,
            height: result.height,
          })
          .select()
          .single();
        if (error) throw error;
        newItems.push(data as MediaItem);
      } catch (e) {
        setUploadError(e instanceof Error ? e.message : "Opplasting feilet");
      }
    }
    if (newItems.length > 0) {
      setItems((prev) => [...newItems, ...prev]);
      await revalidatePublicSite();
    }
    setUploading(false);
  }

  function startEdit(item: MediaItem) {
    setEditingId(item.id);
    setDraftAlt(item.alt_text);
    setDraftCategory(item.category);
  }

  async function saveEdit(item: MediaItem) {
    setSavingId(item.id);
    const { error } = await supabase
      .from("media")
      .update({ alt_text: draftAlt, category: draftCategory })
      .eq("id", item.id);
    if (!error) {
      setItems((prev) =>
        prev.map((i) =>
          i.id === item.id ? { ...i, alt_text: draftAlt, category: draftCategory } : i,
        ),
      );
      setEditingId(null);
      await revalidatePublicSite();
    } else {
      alert("Kunne ikke lagre: " + error.message);
    }
    setSavingId(null);
  }

  async function handleDelete(item: MediaItem) {
    if (!confirm(`Slette "${item.alt_text || item.storage_path.split("/").pop()}"?`)) return;
    setDeletingId(item.id);
    try {
      // Slett fra storage først, deretter fra databasen
      await deleteFromStorage(item.storage_path);
      const { error } = await supabase.from("media").delete().eq("id", item.id);
      if (error) throw error;
      setItems((prev) => prev.filter((i) => i.id !== item.id));
      await revalidatePublicSite();
    } catch (e) {
      alert("Sletting feilet: " + (e instanceof Error ? e.message : "Ukjent feil"));
    } finally {
      setDeletingId(null);
    }
  }

  return (
    <>
      {/* Topbar */}
      <div className="sticky top-0 z-10 flex h-14 shrink-0 items-center justify-between border-b border-[#e5e5e5] bg-white px-6">
        <h1 className="text-base font-semibold text-[#171717]">Bilder</h1>
        <div className="flex items-center gap-3">
          <span className="text-xs text-[#a3a3a3]">{items.length} bilder</span>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto p-6 lg:p-8">
        <div className="mx-auto max-w-5xl space-y-6">
          {/* Last opp */}
          <div className="rounded-2xl border border-[#e5e5e5] bg-white p-6">
            <h2 className="text-sm font-semibold text-[#171717]">Last opp bilder</h2>
            <p className="mt-1 text-xs text-[#a3a3a3]">
              Maks 10 MB per bilde. Støttede formater: JPG, PNG, WebP, GIF.
            </p>

            <div className="mt-4 flex items-end gap-3">
              <label className="flex-1">
                <span className="text-[11px] font-medium text-[#737373]">Kategori</span>
                <select
                  value={uploadCategory}
                  onChange={(e) => setUploadCategory(e.target.value)}
                  className="mt-1 w-full rounded-lg border border-[#e5e5e5] bg-[#fafafa] px-3 py-2 text-sm text-[#171717] focus:border-[#dc2626] focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#dc2626]/20"
                >
                  {MEDIA_CATEGORIES.map((c) => (
                    <option key={c.key} value={c.key}>
                      {c.label}
                    </option>
                  ))}
                </select>
              </label>
            </div>

            <DropZone
              uploading={uploading}
              onFiles={handleFiles}
            />

            {uploadError && <p className="mt-3 text-xs text-red-600">{uploadError}</p>}
          </div>

          {/* Filter */}
          <div className="flex flex-wrap gap-1.5">
            <button
              onClick={() => setFilter("all")}
              className={`rounded-full px-3 py-1.5 text-xs font-medium transition-colors ${
                filter === "all"
                  ? "bg-[#171717] text-white"
                  : "bg-white text-[#404040] hover:bg-[#f5f5f5]"
              }`}
            >
              Alle
            </button>
            {MEDIA_CATEGORIES.map((c) => (
              <button
                key={c.key}
                onClick={() => setFilter(c.key)}
                className={`rounded-full px-3 py-1.5 text-xs font-medium transition-colors ${
                  filter === c.key
                    ? "bg-[#171717] text-white"
                    : "bg-white text-[#404040] hover:bg-[#f5f5f5]"
                }`}
              >
                {c.label}
              </button>
            ))}
          </div>

          {/* Grid */}
          {loading ? (
            <div className="flex h-40 items-center justify-center">
              <span className="text-sm text-[#a3a3a3]">Laster…</span>
            </div>
          ) : items.length === 0 ? (
            <div className="flex h-40 items-center justify-center rounded-2xl border border-dashed border-[#e5e5e5] bg-white">
              <p className="text-sm text-[#a3a3a3]">Ingen bilder i {filter === "all" ? "biblioteket" : "denne kategorien"} ennå.</p>
            </div>
          ) : (
            <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4">
              {items.map((item) => {
                const isEditing = editingId === item.id;
                return (
                  <div key={item.id} className="overflow-hidden rounded-xl border border-[#e5e5e5] bg-white">
                    <div className="relative aspect-square bg-[#fafafa]">
                      <Image
                        src={item.url}
                        alt={item.alt_text || ""}
                        fill
                        sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 25vw"
                        className="object-cover"
                        unoptimized
                      />
                    </div>
                    <div className="p-3 space-y-2">
                      {isEditing ? (
                        <>
                          <input
                            type="text"
                            value={draftAlt}
                            onChange={(e) => setDraftAlt(e.target.value)}
                            placeholder="Alt-tekst"
                            className="w-full rounded-md border border-[#e5e5e5] bg-[#fafafa] px-2 py-1.5 text-xs focus:border-[#dc2626] focus:bg-white focus:outline-none"
                          />
                          <select
                            value={draftCategory}
                            onChange={(e) => setDraftCategory(e.target.value)}
                            className="w-full rounded-md border border-[#e5e5e5] bg-[#fafafa] px-2 py-1.5 text-xs focus:border-[#dc2626] focus:bg-white focus:outline-none"
                          >
                            {MEDIA_CATEGORIES.map((c) => (
                              <option key={c.key} value={c.key}>
                                {c.label}
                              </option>
                            ))}
                          </select>
                          <div className="flex gap-1.5">
                            <button
                              onClick={() => saveEdit(item)}
                              disabled={savingId === item.id}
                              className="flex-1 rounded-md bg-[#dc2626] py-1.5 text-xs font-medium text-white hover:bg-[#b91c1c] disabled:opacity-50"
                            >
                              {savingId === item.id ? "Lagrer..." : "Lagre"}
                            </button>
                            <button
                              onClick={() => setEditingId(null)}
                              className="rounded-md border border-[#e5e5e5] px-3 py-1.5 text-xs text-[#737373] hover:bg-[#f5f5f5]"
                            >
                              Avbryt
                            </button>
                          </div>
                        </>
                      ) : (
                        <>
                          <p className="line-clamp-1 text-xs font-medium text-[#171717]">
                            {item.alt_text || <span className="italic text-[#a3a3a3]">Mangler alt-tekst</span>}
                          </p>
                          <p className="text-[10px] text-[#a3a3a3]">
                            {MEDIA_CATEGORIES.find((c) => c.key === item.category)?.label ?? item.category}
                            {item.width && item.height && ` · ${item.width}×${item.height}`}
                          </p>
                          <div className="flex gap-1.5">
                            <button
                              onClick={() => startEdit(item)}
                              className="flex-1 rounded-md border border-[#e5e5e5] py-1.5 text-xs text-[#404040] hover:bg-[#f5f5f5]"
                            >
                              Rediger
                            </button>
                            <button
                              onClick={() => handleDelete(item)}
                              disabled={deletingId === item.id}
                              className="rounded-md border border-[#e5e5e5] px-3 py-1.5 text-xs text-[#dc2626] hover:bg-red-50 disabled:opacity-50"
                            >
                              {deletingId === item.id ? "..." : "Slett"}
                            </button>
                          </div>
                        </>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </div>
    </>
  );
}

function DropZone({
  uploading,
  onFiles,
}: {
  uploading: boolean;
  onFiles: (files: FileList | File[]) => void;
}) {
  const [active, setActive] = useState(false);
  return (
    <label
      onDragOver={(e) => {
        e.preventDefault();
        setActive(true);
      }}
      onDragLeave={() => setActive(false)}
      onDrop={(e) => {
        e.preventDefault();
        setActive(false);
        if (e.dataTransfer.files.length > 0) onFiles(e.dataTransfer.files);
      }}
      className={`mt-4 flex cursor-pointer items-center justify-center gap-2 rounded-xl border-2 border-dashed py-6 text-sm transition-colors ${
        active
          ? "border-[#dc2626] bg-[#dc2626]/5 text-[#dc2626]"
          : "border-[#e5e5e5] bg-[#fafafa] text-[#737373] hover:border-[#dc2626]/40 hover:text-[#dc2626]"
      }`}
    >
      <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M3 16.5v2.25A2.25 2.25 0 0 0 5.25 21h13.5A2.25 2.25 0 0 0 21 18.75V16.5M16.5 12 12 16.5m0 0L7.5 12m4.5 4.5V3" />
      </svg>
      <span>{uploading ? "Laster opp..." : "Dra inn bilder, eller klikk for å velge"}</span>
      <input
        type="file"
        accept="image/*"
        multiple
        onChange={(e) => {
          if (e.target.files && e.target.files.length > 0) {
            onFiles(e.target.files);
            e.target.value = "";
          }
        }}
        className="hidden"
        disabled={uploading}
      />
    </label>
  );
}
