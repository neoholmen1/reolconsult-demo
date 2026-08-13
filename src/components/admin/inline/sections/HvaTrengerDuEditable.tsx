"use client";

import EditableText from "../EditableText";
import { sectionKey } from "../save";

/** Forsidens kategori-grid header (eyebrow + title + subtitle). Selve kategoriene rendres ikke her. */
export default function HvaTrengerDuEditable() {
  return (
    <section className="bg-bg-light pt-10 pb-12 sm:pt-12 sm:pb-14">
      <div className="mx-auto max-w-[1200px] px-4 sm:px-6 text-center">
        <EditableText
          fieldKey={sectionKey("hva_trenger_du", "eyebrow")}
          fallback="Våre kategorier"
          as="p"
          className="text-xs font-semibold uppercase tracking-[0.2em] text-accent"
        />
        <EditableText
          fieldKey={sectionKey("hva_trenger_du", "title")}
          fallback="Hva trenger du?"
          as="h2"
          className="mt-4 text-3xl font-bold tracking-tight text-primary sm:text-4xl md:text-5xl"
        />
        <EditableText
          fieldKey={sectionKey("hva_trenger_du", "subtitle")}
          fallback="Vi leverer komplette innredningsløsninger for alle typer virksomheter."
          as="p"
          multiline
          preserveLineBreaks
          className="mx-auto mt-5 max-w-2xl text-lg text-text-muted"
        />
        <div className="mt-10 rounded-xl border border-dashed border-[#d4d4d4] bg-white p-5 text-left text-[12.5px] text-[#737373]">
          Selve kategori-rutenettet hentes fra <span className="font-medium text-[#171717]">Produkter → Rediger kategorier</span>.
        </div>
      </div>
    </section>
  );
}
