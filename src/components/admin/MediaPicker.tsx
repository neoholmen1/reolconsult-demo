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
      <span className="text-xs font-medium text-[#737373]">{label}</span>
      <div className="mt-1 flex items-start gap-3">
        {value ? (
          <div className="relative h-24 w-32 overflow-hidden rounded-lg border border-[#e5e5e5] bg-[#fafafa]">
            <Image src={value} alt="" fill sizes="128px" className="object-cover" unoptimized />
          </div>
        ) : (
          <div className="flex h-24 w-32 items-center justify-center rounded-lg border border-dashed border-[#e5e5e5] bg-[#fafafa]">
            <span className="text-[11px] text-[#a3a3a3]">Ingen bilde</span>
          </div>
        )}
        <div className="flex flex-col gap-1.5">
          <button
            type="button"
            onClick={() => setOpen(true)}
            className="rounded-lg border border-[#e5e5e5] bg-white px-4 py-1.5 text-xs font-medium text-[#404040] transition-colors hover:bg-[#f5f5f5]"
          >
            {value ? "Bytt" : "Velg eller last opp"}
          </button>
          {value && (
            <button
              type="button"
              onClick={() => onChange(null)}
              className="rounded-lg border border-transparent px-4 py-1.5 text-xs font-medium text-[#737373] hover:text-[#dc2626]"
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

function PickerModal({
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
    <div className="fixed inset-0 z-[200] flex items-center justify-center bg-black/50 p-4" onClick={onClose}>
      <div
        className="flex h-[80vh] w-full max-w-4xl flex-col overflow-hidden rounded-2xl bg-white shadow-2xl"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex shrink-0 items-center justify-between border-b border-[#e5e5e5] px-6 py-4">
          <h2 className="text-lg font-semibold text-[#171717]">Velg bilde</h2>
          <button onClick={onClose} className="text-sm text-[#737373] hover:text-[#171717]">
            Lukk
          </button>
        </div>

        {/* Filter */}
        <div className="flex shrink-0 flex-wrap gap-1.5 border-b border-[#e5e5e5] px-6 py-3">
          <button
            onClick={() => setCategory("all")}
            className={`rounded-full px-3 py-1 text-xs font-medium transition-colors ${
              category === "all" ? "bg-[#171717] text-white" : "bg-[#f5f5f5] text-[#404040] hover:bg-[#e5e5e5]"
            }`}
          >
            Alle
          </button>
          {MEDIA_CATEGORIES.map((c) => (
            <button
              key={c.key}
              onClick={() => setCategory(c.key)}
              className={`rounded-full px-3 py-1 text-xs font-medium transition-colors ${
                category === c.key ? "bg-[#171717] text-white" : "bg-[#f5f5f5] text-[#404040] hover:bg-[#e5e5e5]"
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
          className={`shrink-0 px-6 py-4 ${dragActive ? "bg-[#dc2626]/5" : ""}`}
        >
          <label className="flex cursor-pointer items-center justify-center gap-2 rounded-xl border-2 border-dashed border-[#e5e5e5] bg-[#fafafa] py-4 text-sm text-[#737373] hover:border-[#dc2626]/40 hover:text-[#dc2626]">
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
          {uploadError && <p className="mt-2 text-xs text-red-600">{uploadError}</p>}
        </div>

        {/* Bibliotek */}
        <div className="flex-1 overflow-y-auto px-6 py-4">
          {loading ? (
            <div className="flex h-40 items-center justify-center">
              <span className="text-sm text-[#a3a3a3]">Laster…</span>
            </div>
          ) : (
            <MediaGrid items={items} onSelect={onSelect} />
          )}
        </div>
      </div>
    </div>
  );
}
