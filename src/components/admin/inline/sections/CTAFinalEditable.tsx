"use client";

import EditableText from "../EditableText";
import { sectionKey } from "../save";

/**
 * Avsluttende CTA — title + body. Faktiske knapper rendres som visuelle plassholdere.
 */
export default function CTAFinalEditable({
  sectionId = "cta_final",
  fallback,
}: {
  sectionId?: string;
  fallback: { title: string; body: string };
}) {
  return (
    <section className="bg-bg-light pt-10 pb-10 sm:pt-12 sm:pb-12">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 text-center">
        <EditableText
          fieldKey={sectionKey(sectionId, "title")}
          fallback={fallback.title}
          as="h2"
          className="text-3xl font-bold tracking-tight text-primary sm:text-5xl md:text-6xl"
          style={{ lineHeight: 1.1 }}
        />
        <EditableText
          fieldKey={sectionKey(sectionId, "body")}
          fallback={fallback.body}
          as="p"
          multiline
          preserveLineBreaks
          className="mx-auto mt-6 max-w-2xl text-lg text-text-muted sm:text-xl"
        />
        <div className="mt-10 flex flex-col items-center gap-3 sm:flex-row sm:justify-center sm:gap-4">
          <span className="rounded-full bg-accent px-10 py-4 text-base font-semibold text-white opacity-90">Kontakt oss</span>
          <span className="rounded-full border border-primary/20 px-10 py-4 text-base font-semibold text-primary">Ring oss</span>
        </div>
      </div>
    </section>
  );
}
