"use client";

import Link from "next/link";
import { ChevronRight, ExternalLink } from "lucide-react";
import { useEditable } from "./EditableContext";

export default function InlineSaveBar({
  pageName,
  previewHref,
  saving,
  status,
  errorMessage,
  onSave,
}: {
  pageName: string;
  previewHref: string;
  saving: boolean;
  status: "idle" | "saved" | "error";
  errorMessage?: string | null;
  onSave: () => void;
}) {
  const { dirty, reset, diff } = useEditable();
  const changeCount = Object.keys(diff).length;

  return (
    <div className="sticky top-0 z-30 border-b border-[#ececec] bg-white/95 backdrop-blur supports-[backdrop-filter]:bg-white/80">
      <div className="flex h-[68px] items-center justify-between gap-4 px-8">
        <div className="min-w-0">
          <div className="flex items-center gap-1 text-[11px] text-[#a3a3a3]">
            <Link href="/admin/nettside" className="font-medium text-[#737373] hover:text-[#171717]">
              Nettside
            </Link>
            <ChevronRight className="h-3 w-3" strokeWidth={2} />
            <span className="font-medium text-[#171717]">{pageName}</span>
          </div>
          <div className="mt-0.5 flex items-center gap-2.5">
            <h1 className="text-[16px] font-semibold tracking-tight text-[#171717]">{pageName}</h1>
            {dirty && (
              <span className="inline-flex items-center gap-1.5 rounded-full bg-amber-50 px-2.5 py-0.5 text-[11px] font-medium text-amber-700">
                <span className="h-1.5 w-1.5 rounded-full bg-amber-500" />
                {changeCount} {changeCount === 1 ? "endring" : "endringer"} ulagret
              </span>
            )}
            {status === "saved" && !dirty && (
              <span className="inline-flex items-center gap-1.5 rounded-full bg-emerald-50 px-2.5 py-0.5 text-[11px] font-medium text-emerald-700">
                <span className="h-1.5 w-1.5 rounded-full bg-emerald-500" />
                Lagret
              </span>
            )}
            {status === "error" && errorMessage && (
              <span className="rounded-full bg-red-50 px-2.5 py-0.5 text-[11px] font-medium text-red-700">
                {errorMessage}
              </span>
            )}
          </div>
        </div>

        <div className="flex shrink-0 items-center gap-2">
          <Link
            href={previewHref}
            target="_blank"
            className="inline-flex items-center gap-1.5 rounded-full border border-[#ececec] bg-white px-3.5 py-2 text-[12.5px] font-medium text-[#525252] transition duration-150 hover:border-[#d4d4d4] hover:text-[#171717]"
          >
            Live <ExternalLink className="h-3 w-3" strokeWidth={2} />
          </Link>
          {dirty && (
            <button
              onClick={reset}
              className="rounded-full px-4 py-2 text-[12.5px] font-medium text-[#525252] transition-colors duration-150 hover:bg-[#fafaf9] hover:text-[#171717]"
            >
              Forkast
            </button>
          )}
          <button
            onClick={onSave}
            disabled={!dirty || saving}
            className="inline-flex items-center gap-1.5 rounded-full bg-[#171717] px-5 py-2 text-[13px] font-semibold text-white shadow-[0_1px_2px_rgba(0,0,0,0.08)] transition duration-150 hover:bg-[#000] hover:shadow-[0_4px_12px_rgba(0,0,0,0.15)] disabled:cursor-not-allowed disabled:bg-[#e5e5e4] disabled:text-[#a3a3a3] disabled:shadow-none"
          >
            {saving ? "Lagrer..." : "Lagre endringer"}
          </button>
        </div>
      </div>
      <div className="h-[1px] bg-gradient-to-r from-transparent via-[#dc2626]/15 to-transparent" />
    </div>
  );
}
