"use client";

import { type ReactNode, useEffect } from "react";
import { X } from "lucide-react";

export default function Modal({
  open,
  onClose,
  title,
  description,
  children,
  footer,
  size = "md",
}: {
  open: boolean;
  onClose: () => void;
  title: string;
  description?: string;
  children: ReactNode;
  footer?: ReactNode;
  size?: "sm" | "md" | "lg";
}) {
  useEffect(() => {
    if (!open) return;
    function onKey(e: KeyboardEvent) {
      if (e.key === "Escape") onClose();
    }
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open, onClose]);

  if (!open) return null;

  const maxWidth = size === "sm" ? "max-w-md" : size === "lg" ? "max-w-2xl" : "max-w-lg";

  return (
    <div
      className="fixed inset-0 z-[200] flex items-center justify-center bg-black/40 p-4 backdrop-blur-sm"
      onClick={onClose}
    >
      <div
        className={`flex max-h-[90vh] w-full ${maxWidth} flex-col overflow-hidden rounded-2xl bg-white shadow-[0_20px_60px_-12px_rgba(0,0,0,0.25)] ring-1 ring-[#ececec]`}
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex shrink-0 items-start justify-between border-b border-[#ececec] px-6 py-4">
          <div>
            <h2 className="text-[15px] font-semibold tracking-tight text-[#171717]">{title}</h2>
            {description && (
              <p className="mt-0.5 text-[12px] text-[#737373]">{description}</p>
            )}
          </div>
          <button
            onClick={onClose}
            aria-label="Lukk"
            className="-mr-1 -mt-1 flex h-8 w-8 items-center justify-center rounded-lg text-[#737373] transition-colors duration-150 hover:bg-[#fafaf9] hover:text-[#171717]"
          >
            <X className="h-4 w-4" strokeWidth={1.75} />
          </button>
        </div>
        <div className="flex-1 overflow-y-auto p-6">{children}</div>
        {footer && (
          <div className="flex shrink-0 items-center justify-end gap-2 border-t border-[#ececec] bg-[#fafaf9] px-6 py-3.5">
            {footer}
          </div>
        )}
      </div>
    </div>
  );
}

export function ModalActions({
  onCancel,
  onSave,
  saving,
  disabled,
  saveLabel = "Lagre",
}: {
  onCancel: () => void;
  onSave: () => void;
  saving: boolean;
  disabled?: boolean;
  saveLabel?: string;
}) {
  return (
    <>
      <button
        onClick={onCancel}
        className="rounded-full px-4 py-2 text-[13px] font-medium text-[#525252] transition-colors duration-150 hover:bg-white hover:text-[#171717]"
      >
        Avbryt
      </button>
      <button
        onClick={onSave}
        disabled={saving || disabled}
        className="inline-flex items-center gap-1.5 rounded-full bg-[#171717] px-5 py-2 text-[13px] font-semibold text-white shadow-[0_1px_2px_rgba(0,0,0,0.08)] transition duration-150 hover:bg-[#000] hover:shadow-[0_4px_12px_rgba(0,0,0,0.15)] disabled:cursor-not-allowed disabled:bg-[#a3a3a3] disabled:shadow-none"
      >
        {saving ? "Lagrer..." : saveLabel}
      </button>
    </>
  );
}
