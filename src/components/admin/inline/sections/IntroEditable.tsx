"use client";

import EditableText from "../EditableText";
import { sectionKey } from "../save";

/**
 * Generisk intro-seksjon brukt på Om oss, Kontakt, Bruktsalg, Referanser, Kataloger, Produkter.
 * eyebrow + title + body. Bruktsalg bruker badge i stedet for eyebrow.
 */
export default function IntroEditable({
  sectionId,
  eyebrowField = "eyebrow",
  titleField = "title",
  bodyField = "body",
  fallback,
  variant = "default",
}: {
  sectionId: string;
  eyebrowField?: string;
  titleField?: string;
  bodyField?: string;
  fallback: { eyebrow?: string; title: string; body: string };
  variant?: "default" | "centered" | "badge";
}) {
  const wrapperClass =
    variant === "centered"
      ? "mx-auto max-w-3xl text-center"
      : "max-w-3xl";

  return (
    <section className="bg-white pt-12 pb-10 sm:pt-16 sm:pb-12">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className={wrapperClass}>
          {variant === "badge" ? (
            <EditableText
              fieldKey={sectionKey(sectionId, eyebrowField)}
              fallback={fallback.eyebrow ?? "Spar penger"}
              as="span"
              className="inline-block rounded-full border border-green-600/20 bg-green-600/8 px-4 py-1.5 text-xs font-semibold uppercase tracking-[0.15em] text-green-700"
            />
          ) : fallback.eyebrow !== undefined ? (
            <EditableText
              fieldKey={sectionKey(sectionId, eyebrowField)}
              fallback={fallback.eyebrow}
              as="p"
              className="text-xs font-semibold uppercase tracking-[0.2em] text-accent"
            />
          ) : null}

          <EditableText
            fieldKey={sectionKey(sectionId, titleField)}
            fallback={fallback.title}
            as="h1"
            multiline
            preserveLineBreaks
            className="mt-4 text-3xl font-bold tracking-tight text-primary sm:text-5xl md:text-6xl"
            style={{ lineHeight: 1.1 }}
          />

          <EditableText
            fieldKey={sectionKey(sectionId, bodyField)}
            fallback={fallback.body}
            as="p"
            multiline
            preserveLineBreaks
            className="mt-6 text-lg leading-relaxed text-text-muted"
          />
        </div>
      </div>
    </section>
  );
}
