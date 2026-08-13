"use client";

import Image from "next/image";
import EditableText from "../EditableText";
import EditableImage from "../EditableImage";
import { sectionKey } from "../save";

/**
 * Intro med bilde + tekst (Om oss). image + eyebrow + title + body.
 */
export default function IntroWithImageEditable({
  sectionId,
  siteId,
  fallback,
  fallbackImage,
}: {
  sectionId: string;
  siteId: string;
  fallback: { eyebrow: string; title: string; body: string };
  fallbackImage: string;
}) {
  return (
    <section className="bg-white pt-12 pb-10 sm:pt-16 sm:pb-12">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 items-center gap-10 lg:grid-cols-2 lg:gap-16">
          <div>
            <EditableImage
              fieldKey={sectionKey(sectionId, "image_url")}
              siteId={siteId}
              defaultCategory="general"
              fallback={fallbackImage}
            >
              {(url) => (
                <div className="relative aspect-[4/3] overflow-hidden rounded-2xl">
                  <Image src={url ?? fallbackImage} alt="" fill sizes="(max-width: 1024px) 100vw, 50vw" className="object-cover" unoptimized />
                </div>
              )}
            </EditableImage>
          </div>
          <div>
            <EditableText
              fieldKey={sectionKey(sectionId, "eyebrow")}
              fallback={fallback.eyebrow}
              as="p"
              className="text-xs font-semibold uppercase tracking-[0.2em] text-accent"
            />
            <EditableText
              fieldKey={sectionKey(sectionId, "title")}
              fallback={fallback.title}
              as="h1"
              multiline
              preserveLineBreaks
              className="mt-4 text-3xl font-bold tracking-tight text-primary sm:text-4xl md:text-5xl"
              style={{ lineHeight: 1.1 }}
            />
            <EditableText
              fieldKey={sectionKey(sectionId, "body")}
              fallback={fallback.body}
              as="p"
              multiline
              preserveLineBreaks
              className="mt-6 text-lg leading-relaxed text-text-muted"
            />
          </div>
        </div>
      </div>
    </section>
  );
}
