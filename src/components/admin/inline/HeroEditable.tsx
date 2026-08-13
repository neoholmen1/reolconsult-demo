"use client";

import Image from "next/image";
import EditableText from "./EditableText";
import EditableImage from "./EditableImage";

const DEFAULT_IMAGE = "https://reolconsult.no/wp-content/uploads/2022/11/Hekta-Pa-Tur-2-scaled.jpg";

const DEFAULT_FALLBACKS = {
  eyebrow: "Siden 1984",
  title: "Alt til ditt\nlager, butikk\nog kontor",
  subtitle:
    "Vi leverer innredning til butikk, lager, verksted, kontor, arkiv og garderobe — fra første tegning til ferdig montert. Bredt sortiment, og 350 kvm utstilling i Tønsberg.",
  primaryLabel: "Utforsk produkter",
  secondaryLabel: "Ring oss",
};

export type HeroFallbacks = Partial<typeof DEFAULT_FALLBACKS> & { image?: string };

/**
 * Admin-variant av Hero. Speiler den offentlige Hero sin layout og styling,
 * men gjør tekst- og bilde-feltene redigerbare inline. Animasjoner og
 * bilde-karusell er fjernet for å gi rask feedback under redigering.
 */
export default function HeroEditable({
  siteId,
  fallbacks,
}: {
  siteId: string;
  fallbacks?: HeroFallbacks;
}) {
  const f = { ...DEFAULT_FALLBACKS, ...fallbacks };
  const fallbackImage = fallbacks?.image ?? DEFAULT_IMAGE;

  return (
    <section className="relative overflow-hidden bg-white pt-12 pb-8 sm:pt-16 sm:pb-12 lg:pt-20 lg:pb-14">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 items-center gap-12 lg:grid-cols-2 lg:gap-20">
          <div>
            <EditableText
              fieldKey="hero_eyebrow"
              fallback={f.eyebrow}
              as="p"
              className="text-sm font-semibold uppercase tracking-[0.2em] text-accent"
            />

            <EditableText
              fieldKey="hero_title"
              fallback={f.title}
              as="h1"
              multiline
              preserveLineBreaks
              className="mt-5 text-[2rem] font-bold tracking-tight text-primary sm:text-5xl md:text-6xl lg:text-[4.25rem]"
              style={{ lineHeight: 1.05 }}
            />

            <EditableText
              fieldKey="hero_subtitle"
              fallback={f.subtitle}
              as="p"
              multiline
              className="mt-6 sm:mt-8 max-w-md text-base sm:text-lg leading-relaxed text-text-muted"
            />

            <div className="mt-10 flex flex-wrap gap-3">
              <span className="inline-flex items-center gap-2 rounded-full bg-accent px-6 py-3.5 text-sm sm:px-8 sm:py-4 sm:text-base font-semibold text-white opacity-95">
                <EditableText
                  fieldKey="hero_cta_primary_label"
                  fallback={f.primaryLabel}
                  as="span"
                />
              </span>
              <span className="inline-flex items-center gap-2 rounded-full border border-primary px-6 py-3.5 text-sm sm:px-8 sm:py-4 sm:text-base font-medium text-primary">
                <EditableText
                  fieldKey="hero_cta_secondary_label"
                  fallback={f.secondaryLabel}
                  as="span"
                />
              </span>
            </div>
          </div>

          <div className="relative">
            <EditableImage
              fieldKey="hero_image_url"
              siteId={siteId}
              defaultCategory="hero"
              fallback={fallbackImage}
            >
              {(url) => (
                <div className="relative aspect-[16/10] sm:aspect-[4/5] overflow-hidden rounded-2xl sm:rounded-3xl shadow-[0_25px_50px_rgba(0,0,0,0.1)]">
                  <Image
                    src={url ?? fallbackImage}
                    alt=""
                    fill
                    sizes="(max-width: 1024px) 100vw, 50vw"
                    className="object-cover"
                    unoptimized
                  />
                </div>
              )}
            </EditableImage>
          </div>
        </div>
      </div>
    </section>
  );
}
