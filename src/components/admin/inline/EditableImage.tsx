"use client";

import { useState, type ReactNode } from "react";
import { Camera } from "lucide-react";
import { PickerModal } from "@/components/admin/MediaPicker";
import { useEditable } from "./EditableContext";

/**
 * Render-prop-komponent: viser bildet (eller fallback) via children-funksjon, og overlegg
 * med kamera-ikon ved hover. Klikk åpner MediaPicker-modal.
 */
export default function EditableImage({
  fieldKey,
  siteId,
  defaultCategory = "general",
  children,
  fallback,
}: {
  fieldKey: string;
  siteId: string;
  defaultCategory?: string;
  fallback?: string | null;
  children: (url: string | null) => ReactNode;
}) {
  const { get, set } = useEditable();
  const [open, setOpen] = useState(false);
  const value = get(fieldKey);
  const displayUrl = value ?? fallback ?? null;

  return (
    <>
      <div className="group relative inline-block w-full">
        {children(displayUrl)}

        {/* Hint-prikk i hjørnet (vises lavt-mettet, fader inn ved hover) */}
        <span className="pointer-events-none absolute right-3 top-3 z-10 flex h-8 w-8 items-center justify-center rounded-full bg-white/90 text-[#171717] opacity-0 shadow-[0_2px_8px_rgba(0,0,0,0.15)] backdrop-blur transition-opacity duration-150 group-hover:opacity-100">
          <Camera className="h-4 w-4" strokeWidth={1.75} />
        </span>

        {/* Klikkbart overlegg + sentrert "Bytt bilde"-pill ved hover */}
        <button
          type="button"
          onClick={() => setOpen(true)}
          className="absolute inset-0 z-20 flex items-center justify-center rounded-[inherit] bg-black/0 outline-none transition duration-150 hover:bg-black/30 focus-visible:bg-black/30"
          aria-label="Bytt bilde"
          title="Klikk for å bytte bilde"
        >
          <span className="inline-flex items-center gap-2 rounded-full bg-white px-4 py-2 text-[13px] font-semibold text-[#171717] opacity-0 shadow-[0_4px_12px_rgba(0,0,0,0.2)] transition-opacity duration-150 group-hover:opacity-100 group-focus-within:opacity-100">
            <Camera className="h-4 w-4" strokeWidth={1.75} />
            Bytt bilde
          </span>
        </button>
      </div>

      {open && (
        <PickerModal
          siteId={siteId}
          defaultCategory={defaultCategory}
          onClose={() => setOpen(false)}
          onSelect={(item) => {
            set(fieldKey, item.url);
            setOpen(false);
          }}
        />
      )}
    </>
  );
}
