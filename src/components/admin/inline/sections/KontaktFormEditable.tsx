"use client";

import EditableText from "../EditableText";
import { sectionKey } from "../save";

/** Kontakt-sidens "Skjema-tekst" seksjon — title + help over kontaktskjemaet (skjemaet rendres ikke). */
export default function KontaktFormEditable() {
  return (
    <section className="bg-white pt-10 pb-10 sm:pt-12 sm:pb-12">
      <div className="mx-auto max-w-3xl px-4 sm:px-6 lg:px-8">
        <EditableText
          fieldKey={sectionKey("form", "title")}
          fallback="Send oss en henvendelse"
          as="h2"
          className="text-2xl font-bold tracking-tight text-primary sm:text-3xl"
        />
        <EditableText
          fieldKey={sectionKey("form", "help")}
          fallback="Fortell oss kort hva du trenger så hører vi fra deg innen kort tid."
          as="p"
          multiline
          preserveLineBreaks
          className="mt-3 text-base leading-relaxed text-text-muted"
        />
        <div className="mt-6 rounded-xl border border-dashed border-[#d4d4d4] bg-[#fafaf9] p-5 text-[12.5px] text-[#737373]">
          Selve skjemaet rendres dynamisk på siden og er ikke editerbart her.
        </div>
      </div>
    </section>
  );
}
