"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import { supabase } from "@/lib/supabase";
import { uploadImage } from "@/lib/storage";
import { listMedia, MEDIA_CATEGORIES, type MediaItem } from "@/lib/cms";
import MediaGrid from "./MediaGrid";

/**
 * Modal for å velge et bilde fra biblioteket eller laste opp et nytt.
 * Brukes som <MediaPicker value={url} onChange={...} category="hero" siteId={...} />.
 */
export default function MediaPicker({
  value,
  onChange,
  siteId,
  defaultCategory = "general",
  label = "Bilde",
}: {
  value: string | null;
  onChange: (url: string | null) => void;
  siteId: string;
  defaultCategory?: string;
  label?: string;
}) {
  const [open, setOpen] = useState(false);

  return (
    <div>
      <span className="text-[12px] font-medium text-[#404040]">{label}</span>
      <div className="mt-1.5 flex items-start gap-3">
        {value ? (
          <div className="relative h-24 w-32 overflow-hidden rounded-lg border border-[#ececec] bg-[#fafaf9]">
            <Image src={value} alt="" fill sizes="128px" className="object-cover" unoptimized />
          </div>
        ) : (
          <div className="flex h-24 w-32 items-center justify-center rounded-lg border border-dashed border-[#d4d4d4] bg-[#fafaf9]">
            <span className="text-[11px] text-[#a3a3a3]">Ingen bilde</span>
          </div>
        )}
        <div className="flex flex-col gap-1.5">
          <button
            type="button"
            onClick={() => setOpen(true)}
            className="rounded-full border border-[#ececec] bg-white px-3.5 py-1.5 text-[12px] font-medium text-[#525252] transition duration-150 hover:border-[#d4d4d4] hover:text-[#171717]"
          >
            {value ? "Bytt bilde" : "Velg eller last opp"}
          </button>
          {value && (
            <button
              type="button"
              onClick={() => onChange(null)}
              className="rounded-full px-3.5 py-1.5 text-[12px] font-medium text-[#737373] transition-colors duration-150 hover:bg-[#fafaf9] hover:text-[#171717]"
            >
              Fjern
            </button>
          )}
        </div>
      </div>

      {open && (
        <PickerModal
          siteId={siteId}
          defaultCategory={defaultCategory}
          onClose={() => setOpen(false)}
          onSelect={(item) => {
            onChange(item.url);
            setOpen(false);
          }}
        />
      )}
    </div>
  );
}

export function PickerModal({
  siteId,
  defaultCategory,
  onClose,
  onSelect,
}: {
  siteId: string;
  defaultCategory: string;
  onClose: () => void;
  onSelect: (item: MediaItem) => void;
}) {
  const [items, setItems] = useState<MediaItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [category, setCategory] = useState(defaultCategory);
  const [uploading, setUploading] = useState(false);
  const [uploadError, setUploadError] = useState<string | null>(null);
  const [dragActive, setDragActive] = useState(false);

  useEffect(() => {
    let cancelled = false;
    setLoading(true);
    listMedia(siteId, category === "all" ? undefined : category).then((data) => {
      if (!cancelled) {
        setItems(data);
        setLoading(false);
      }
    });
    return () => {
      cancelled = true;
    };
  }, [siteId, category]);

  async function handleUpload(file: File) {
    setUploadError(null);
    setUploading(true);
    try {
      const result = await uploadImage(siteId, category === "all" ? "general" : category, file);
      const { data, error } = await supabase
        .from("media")
        .insert({
          site_id: siteId,
          storage_path: result.storagePath,
          url: result.url,
          alt_text: file.name.replace(/\.[^.]+$/, ""),
          category: category === "all" ? "general" : category,
          mime_type: result.mime,
          size_bytes: result.size,
          width: result.width,
          height: result.height,
        })
        .select()
        .single();

      if (error) throw error;
      setItems((prev) => [data as MediaItem, ...prev]);
    } catch (e) {
      setUploadError(e instanceof Error ? e.message : "Opplasting feilet");
    } finally {
      setUploading(false);
    }
  }

  function handleDrop(e: React.DragEvent) {
    e.preventDefault();
    setDragActive(false);
    const file = e.dataTransfer.files[0];
    if (file) handleUpload(file);
  }

  return (
    <div className="fixed inset-0 z-[200] flex items-center justify-center bg-black/40 p-4 backdrop-blur-sm" onClick={onClose}>
      <div
        className="flex h-[80vh] w-full max-w-4xl flex-col overflow-hidden rounded-2xl bg-white shadow-[0_20px_60px_-12px_rgba(0,0,0,0.25)] ring-1 ring-[#ececec]"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex shrink-0 items-center justify-between border-b border-[#ececec] px-6 py-4">
          <h2 className="text-[15px] font-semibold tracking-tight text-[#171717]">Velg bilde</h2>
          <button onClick={onClose} className="rounded-full px-3 py-1 text-[12.5px] font-medium text-[#737373] transition-colors duration-150 hover:bg-[#fafaf9] hover:text-[#171717]">
            Lukk
          </button>
        </div>

        {/* Filter */}
        <div className="flex shrink-0 flex-wrap gap-1.5 border-b border-[#ececec] bg-[#fafaf9] px-6 py-3">
          <button
            onClick={() => setCategory("all")}
            className={`rounded-full px-3 py-1 text-[11.5px] font-medium transition duration-150 ${
              category === "all" ? "bg-[#171717] text-white shadow-[0_1px_2px_rgba(0,0,0,0.08)]" : "bg-white text-[#525252] ring-1 ring-[#ececec] hover:text-[#171717]"
            }`}
          >
            Alle
          </button>
          {MEDIA_CATEGORIES.map((c) => (
            <button
              key={c.key}
              onClick={() => setCategory(c.key)}
              className={`rounded-full px-3 py-1 text-[11.5px] font-medium transition duration-150 ${
                category === c.key ? "bg-[#171717] text-white shadow-[0_1px_2px_rgba(0,0,0,0.08)]" : "bg-white text-[#525252] ring-1 ring-[#ececec] hover:text-[#171717]"
              }`}
            >
              {c.label}
            </button>
          ))}
        </div>

        {/* Drag-drop og upload-knapp */}
        <div
          onDragOver={(e) => {
            e.preventDefault();
            setDragActive(true);
          }}
          onDragLeave={() => setDragActive(false)}
          onDrop={handleDrop}
          className={`shrink-0 px-6 py-4 transition-colors duration-150 ${dragActive ? "bg-[#171717]/[0.03]" : ""}`}
        >
          <label className="flex cursor-pointer items-center justify-center gap-2 rounded-xl border-2 border-dashed border-[#d4d4d4] bg-[#fafaf9] py-5 text-[12.5px] text-[#737373] transition duration-150 hover:border-[#171717]/40 hover:bg-white hover:text-[#171717]">
            <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M3 16.5v2.25A2.25 2.25 0 0 0 5.25 21h13.5A2.25 2.25 0 0 0 21 18.75V16.5M16.5 12 12 16.5m0 0L7.5 12m4.5 4.5V3" />
            </svg>
            <span>{uploading ? "Laster opp..." : "Dra inn bilde, eller klikk for å velge"}</span>
            <input
              type="file"
              accept="image/*"
              onChange={(e) => {
                const file = e.target.files?.[0];
                if (file) handleUpload(file);
              }}
              className="hidden"
              disabled={uploading}
            />
          </label>
          {uploadError && <p className="mt-2 text-[11.5px] text-red-600">{uploadError}</p>}
        </div>

        {/* Bibliotek */}
        <div className="flex-1 overflow-y-auto bg-[#fafaf9] px-6 py-4">
          {loading ? (
            <div className="flex h-40 items-center justify-center">
              <span className="text-[13px] text-[#a3a3a3]">Laster…</span>
            </div>
          ) : (
            <MediaGrid items={items} onSelect={onSelect} />
          )}
        </div>
      </div>
    </div>
  );
}
