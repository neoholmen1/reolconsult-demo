"use client";

import EditableText from "../EditableText";
import { sectionKey } from "../save";

/** Forsidens "Logo-stripe" — kun overskriften er editerbar. */
export default function ReferencesIntroEditable() {
  return (
    <section className="bg-bg-light pt-10 pb-12 sm:pt-12">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 text-center">
        <EditableText
          fieldKey={sectionKey("references_intro", "eyebrow")}
          fallback="Selskaper som bruker oss"
          as="p"
          className="text-xs font-semibold uppercase tracking-[0.2em] text-accent"
        />
        <div className="mt-6 rounded-xl border border-dashed border-[#d4d4d4] bg-white px-5 py-6 text-[12.5px] text-[#737373]">
          Selve kunde-logo-stripen hentes fra <span className="font-medium text-[#171717]">Nettside → Referanser → Logoer</span>.
        </div>
      </div>
    </section>
  );
}
