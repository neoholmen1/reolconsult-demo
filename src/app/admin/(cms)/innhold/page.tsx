"use client";

import Link from "next/link";
import { PAGE_DEFINITIONS } from "@/lib/page-definitions";

export default function InnholdIndex() {
  return (
    <>
      <div className="sticky top-0 z-10 flex h-14 shrink-0 items-center justify-between border-b border-[#e5e5e5] bg-white px-6">
        <h1 className="text-base font-semibold text-[#171717]">Innhold</h1>
      </div>

      <div className="flex-1 overflow-y-auto p-6 lg:p-8">
        <div className="mx-auto max-w-3xl space-y-6">
          <div>
            <h2 className="text-xl font-semibold text-[#171717]">Velg side å redigere</h2>
            <p className="mt-2 text-sm text-[#737373]">
              Endringer lagres umiddelbart og blir synlige på den offentlige siden ved neste
              oppdatering. Layouten er låst — du kan kun endre innholdet.
            </p>
          </div>

          <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
            {PAGE_DEFINITIONS.map((p) => (
              <Link
                key={p.slug}
                href={`/admin/innhold/${p.slug}`}
                className="group flex items-center justify-between rounded-xl border border-[#e5e5e5] bg-white p-5 transition-all hover:border-[#dc2626]/40 hover:shadow-[0_4px_12px_rgba(0,0,0,0.04)]"
              >
                <div>
                  <p className="text-sm font-semibold text-[#171717]">{p.name}</p>
                  <p className="mt-0.5 text-[11px] text-[#a3a3a3]">/{p.slug === "home" ? "" : p.slug}</p>
                </div>
                <svg
                  className="h-4 w-4 text-[#a3a3a3] transition-colors group-hover:text-[#dc2626]"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                  strokeWidth={2}
                >
                  <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
                </svg>
              </Link>
            ))}
          </div>
        </div>
      </div>
    </>
  );
}
