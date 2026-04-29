"use client";

import Image from "next/image";
import type { MediaItem } from "@/lib/cms";

export default function MediaGrid({
  items,
  selectedId,
  onSelect,
}: {
  items: MediaItem[];
  selectedId?: string | null;
  onSelect: (item: MediaItem) => void;
}) {
  if (items.length === 0) {
    return (
      <div className="flex h-40 items-center justify-center rounded-xl border border-dashed border-[#e5e5e5] bg-[#fafafa]">
        <p className="text-sm text-[#a3a3a3]">Ingen bilder ennå.</p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-4">
      {items.map((item) => {
        const selected = selectedId === item.id;
        return (
          <button
            key={item.id}
            onClick={() => onSelect(item)}
            className={`group relative aspect-square overflow-hidden rounded-xl border transition-all ${
              selected
                ? "border-[#dc2626] ring-2 ring-[#dc2626]/30"
                : "border-[#e5e5e5] hover:border-[#a3a3a3]"
            }`}
          >
            <Image
              src={item.url}
              alt={item.alt_text || ""}
              fill
              sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 25vw"
              className="object-cover"
              unoptimized
            />
            <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/70 to-transparent p-2 opacity-0 transition-opacity group-hover:opacity-100">
              <p className="truncate text-[10px] text-white">
                {item.alt_text || item.storage_path.split("/").pop()}
              </p>
            </div>
            {selected && (
              <div className="absolute right-2 top-2 flex h-6 w-6 items-center justify-center rounded-full bg-[#dc2626] text-white">
                <svg className="h-3.5 w-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="m4.5 12.75 6 6 9-13.5" />
                </svg>
              </div>
            )}
          </button>
        );
      })}
    </div>
  );
}
