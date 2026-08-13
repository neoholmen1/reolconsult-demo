"use client";

import Image from "next/image";
import EditableText from "../EditableText";
import EditableImage from "../EditableImage";
import { sectionKey } from "../save";

const FALLBACK_IMAGE = "https://reolconsult.no/wp-content/uploads/2022/11/Nettinghyller-4.jpg";

export default function UsedSalesTeaserEditable({ siteId }: { siteId: string }) {
  return (
    <section className="bg-white pt-10 pb-10 sm:pt-12 sm:pb-12">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="rounded-2xl sm:rounded-3xl border border-border bg-bg-light p-6 sm:p-14 lg:p-20">
          <div className="grid grid-cols-1 items-center gap-8 lg:grid-cols-2 lg:gap-16">
            <div>
              <EditableText
                fieldKey={sectionKey("used_sales_teaser", "badge")}
                fallback="Spar penger"
                as="span"
                className="inline-block rounded-full border border-green-600/20 bg-green-600/8 px-4 py-1.5 text-xs font-semibold uppercase tracking-[0.15em] text-green-700"
              />
              <EditableText
                fieldKey={sectionKey("used_sales_teaser", "title")}
                fallback="Brukte reoler til\ngode priser"
                as="h2"
                multiline
                preserveLineBreaks
                className="mt-6 text-3xl font-bold tracking-tight text-primary sm:text-4xl md:text-5xl"
                style={{ lineHeight: 1.1 }}
              />
              <EditableText
                fieldKey={sectionKey("used_sales_teaser", "body")}
                fallback="Vi har jevnlig inn brukte pallreoler, stålhyller og butikkinnredning i god stand. En rimelig løsning for deg som trenger innredning uten å sprenge budsjettet."
                as="p"
                multiline
                preserveLineBreaks
                className="mt-6 text-lg leading-relaxed text-text-muted"
              />
              <div className="mt-10 inline-block rounded-full bg-accent px-8 py-4 text-white">
                <EditableText
                  fieldKey={sectionKey("used_sales_teaser", "cta_label")}
                  fallback="Se brukte produkter"
                  as="span"
                  className="text-base font-semibold"
                />
              </div>
            </div>

            <EditableImage
              fieldKey={sectionKey("used_sales_teaser", "image_url")}
              siteId={siteId}
              defaultCategory="general"
              fallback={FALLBACK_IMAGE}
            >
              {(url) => (
                <div className="relative aspect-[4/3] overflow-hidden rounded-2xl shadow-[0_20px_40px_rgba(0,0,0,0.06)]">
                  <Image src={url ?? FALLBACK_IMAGE} alt="" fill sizes="(max-width: 1024px) 100vw, 45vw" className="object-cover" unoptimized />
                </div>
              )}
            </EditableImage>
          </div>
        </div>
      </div>
    </section>
  );
}
