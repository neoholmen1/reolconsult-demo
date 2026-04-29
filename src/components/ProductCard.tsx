"use client";

import { useState, useCallback, useEffect } from "react";
import Link from "next/link";

interface ProductCardProps {
  title: string;
  description: string;
  iconBg?: string;
  image?: string;
  images?: { src: string; alt: string }[];
  details: string[];
}

export default function ProductCard({
  title,
  description,
  iconBg,
  image,
  images,
  details,
}: ProductCardProps) {
  const [expanded, setExpanded] = useState(false);
  const [lightboxIndex, setLightboxIndex] = useState<number | null>(null);

  const allImages = images ?? (image ? [{ src: image, alt: title }] : []);

  const closeLightbox = useCallback(() => setLightboxIndex(null), []);
  const prevImage = useCallback(
    () =>
      setLightboxIndex((i) =>
        i !== null ? (i - 1 + allImages.length) % allImages.length : null
      ),
    [allImages.length]
  );
  const nextImage = useCallback(
    () =>
      setLightboxIndex((i) =>
        i !== null ? (i + 1) % allImages.length : null
      ),
    [allImages.length]
  );

  useEffect(() => {
    if (lightboxIndex === null) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") closeLightbox();
      if (e.key === "ArrowLeft") prevImage();
      if (e.key === "ArrowRight") nextImage();
    };
    document.body.style.overflow = "hidden";
    window.addEventListener("keydown", onKey);
    return () => {
      document.body.style.overflow = "";
      window.removeEventListener("keydown", onKey);
    };
  }, [lightboxIndex, closeLightbox, prevImage, nextImage]);

  return (
    <>
      <div className="overflow-hidden rounded-xl bg-white shadow-sm transition-shadow duration-300 hover:shadow-lg">
        {/* Clickable card header */}
        <button
          onClick={() => setExpanded(!expanded)}
          className="flex w-full text-left"
        >
          {/* Visual */}
          <div className="w-[140px] shrink-0 sm:w-[180px]">
            {image || images ? (
              <div className="aspect-square h-full overflow-hidden">
                <img
                  src={images ? images[0].src : image!}
                  alt={title}
                  className="h-full w-full object-cover"
                />
              </div>
            ) : (
              <div
                className="flex aspect-square h-full items-center justify-center text-accent"
                style={{ backgroundColor: iconBg ?? "#f5f5f7" }}
              >
                <svg className="h-12 w-12 sm:h-14 sm:w-14" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="m20.25 7.5-.625 10.632a2.25 2.25 0 0 1-2.247 2.118H6.622a2.25 2.25 0 0 1-2.247-2.118L3.75 7.5M10 11.25h4M3.375 7.5h17.25c.621 0 1.125-.504 1.125-1.125v-1.5c0-.621-.504-1.125-1.125-1.125H3.375c-.621 0-1.125.504-1.125 1.125v1.5c0 .621.504 1.125 1.125 1.125Z" />
                </svg>
              </div>
            )}
          </div>

          {/* Text */}
          <div className="flex min-w-0 flex-1 items-center justify-between gap-3 p-5 sm:p-6">
            <div className="min-w-0">
              <h3 className="text-lg font-semibold text-primary sm:text-xl">
                {title}
              </h3>
              <p className="mt-1.5 text-sm leading-relaxed text-text-muted line-clamp-2">
                {description}
              </p>
            </div>

            {/* Chevron */}
            <div
              className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-bg-light transition-transform duration-300 ${
                expanded ? "rotate-180" : ""
              }`}
            >
              <svg
                className="h-4 w-4 text-text-muted"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                strokeWidth={2}
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="m19.5 8.25-7.5 7.5-7.5-7.5"
                />
              </svg>
            </div>
          </div>
        </button>

        {/* Expandable detail panel */}
        <div
          className="grid transition-[grid-template-rows] duration-300 ease-in-out"
          style={{ gridTemplateRows: expanded ? "1fr" : "0fr" }}
        >
          <div className="overflow-hidden">
            <div className="border-t border-black/[0.06] px-5 py-6 sm:px-6">
              {/* Image gallery — horizontal scroll */}
              {allImages.length > 0 && (
                <div className="mb-6 flex gap-3 overflow-x-auto pb-2 -mx-1 px-1">
                  {allImages.map((img, i) => (
                    <button
                      key={img.src}
                      onClick={() => setLightboxIndex(i)}
                      className="group relative aspect-[4/3] h-[140px] shrink-0 overflow-hidden rounded-xl focus:outline-none focus-visible:ring-2 focus-visible:ring-accent sm:h-[180px]"
                    >
                      <img
                        src={img.src}
                        alt={img.alt}
                        className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
                      />
                      <div className="absolute inset-0 rounded-xl bg-black/0 transition-colors duration-300 group-hover:bg-black/10" />
                    </button>
                  ))}
                </div>
              )}

              {/* Detail bullets */}
              <ul className="space-y-2.5">
                {details.map((detail) => (
                  <li
                    key={detail}
                    className="flex items-start gap-3 text-sm leading-relaxed text-text-dark"
                  >
                    <span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-accent" />
                    {detail}
                  </li>
                ))}
              </ul>

              {/* CTA */}
              <div className="mt-6">
                <Link
                  href="/kontakt"
                  className="inline-flex items-center gap-2 rounded-full bg-accent px-6 py-2.5 text-sm font-semibold text-white transition-all duration-200 hover:bg-accent-hover hover:shadow-[0_4px_15px_rgba(212,32,39,0.25)]"
                >
                  Kontakt oss om dette
                  <svg
                    className="h-4 w-4"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                    strokeWidth={2}
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M13.5 4.5L21 12m0 0l-7.5 7.5M21 12H3"
                    />
                  </svg>
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Lightbox */}
      {lightboxIndex !== null && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/90 backdrop-blur-sm"
          onClick={closeLightbox}
        >
          <button
            onClick={closeLightbox}
            className="absolute right-4 top-4 z-10 flex h-10 w-10 items-center justify-center rounded-full bg-white/10 text-white transition-colors hover:bg-white/20"
            aria-label="Lukk"
          >
            <svg
              className="h-6 w-6"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              strokeWidth={2}
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M6 18L18 6M6 6l12 12"
              />
            </svg>
          </button>

          {allImages.length > 1 && (
            <button
              onClick={(e) => {
                e.stopPropagation();
                prevImage();
              }}
              className="absolute left-4 top-1/2 z-10 flex h-12 w-12 -translate-y-1/2 items-center justify-center rounded-full bg-white/10 text-white transition-colors hover:bg-white/20"
              aria-label="Forrige bilde"
            >
              <svg
                className="h-6 w-6"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                strokeWidth={2.5}
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M15.75 19.5L8.25 12l7.5-7.5"
                />
              </svg>
            </button>
          )}

          <img
            src={allImages[lightboxIndex].src}
            alt={allImages[lightboxIndex].alt}
            className="max-h-[85vh] max-w-[90vw] rounded-xl object-contain"
            onClick={(e) => e.stopPropagation()}
          />

          {allImages.length > 1 && (
            <button
              onClick={(e) => {
                e.stopPropagation();
                nextImage();
              }}
              className="absolute right-4 top-1/2 z-10 flex h-12 w-12 -translate-y-1/2 items-center justify-center rounded-full bg-white/10 text-white transition-colors hover:bg-white/20"
              aria-label="Neste bilde"
            >
              <svg
                className="h-6 w-6"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                strokeWidth={2.5}
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="m8.25 4.5 7.5 7.5-7.5 7.5"
                />
              </svg>
            </button>
          )}

          {allImages.length > 1 && (
            <div className="absolute bottom-6 left-1/2 -translate-x-1/2 rounded-full bg-white/10 px-4 py-1.5 text-sm text-white backdrop-blur-sm">
              {lightboxIndex + 1} / {allImages.length}
            </div>
          )}
        </div>
      )}
    </>
  );
}
