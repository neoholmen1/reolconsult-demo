"use client";

import Image from "next/image";
import EditableText from "../EditableText";
import EditableImage from "../EditableImage";
import { sectionKey } from "../save";

const FALLBACK_IMAGE = "https://reolconsult.no/wp-content/uploads/2022/11/Mesanin-6-scaled.jpeg";

/** Forsidens "Om oss"-blokk: bilde + eyebrow + tittel + body + (team-kort, ikke editerbart her) */
export default function AboutTeaserEditable({ siteId }: { siteId: string }) {
  return (
    <section className="bg-white pt-10 pb-10 sm:pt-12 sm:pb-12">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 items-center gap-10 lg:grid-cols-2 lg:gap-12">
          <EditableImage
            fieldKey={sectionKey("about_teaser", "image_url")}
            siteId={siteId}
            defaultCategory="general"
            fallback={FALLBACK_IMAGE}
          >
            {(url) => (
              <div className="relative aspect-[4/3] overflow-hidden rounded-2xl">
                <Image src={url ?? FALLBACK_IMAGE} alt="" fill sizes="(max-width: 1024px) 100vw, 50vw" className="object-cover" unoptimized />
              </div>
            )}
          </EditableImage>

          <div>
            <EditableText
              fieldKey={sectionKey("about_teaser", "eyebrow")}
              fallback="Snakk direkte med oss"
              as="p"
              className="text-xs font-semibold uppercase tracking-[0.2em] text-accent"
            />
            <EditableText
              fieldKey={sectionKey("about_teaser", "title")}
              fallback="Ta kontakt"
              as="h2"
              multiline
              preserveLineBreaks
              className="mt-4 text-3xl font-bold tracking-tight text-primary sm:text-4xl md:text-5xl"
              style={{ lineHeight: 1.1 }}
            />
            <EditableText
              fieldKey={sectionKey("about_teaser", "body")}
              fallback="Vi gir uforpliktende tilbud, befaring og rådgivning. Reol-Consult har holdt til på Vear siden 1984."
              as="p"
              multiline
              preserveLineBreaks
              className="mt-6 text-lg leading-relaxed text-text-muted"
            />
            <div className="mt-8 rounded-xl border border-dashed border-[#d4d4d4] bg-[#fafaf9] p-4 text-[12px] text-[#737373]">
              Team-kortene vises automatisk fra <span className="font-medium text-[#171717]">Team-fanen</span> i admin.
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
