"use client";

import { useEffect, useCallback, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { motion, AnimatePresence } from "motion/react";

export interface ProductModalData {
  title: string;
  description: string;
  images?: string[];
  specs?: string[];
}

interface Props {
  product: ProductModalData | null;
  onClose: () => void;
}

export default function ProductModal({ product, onClose }: Props) {
  const [currentImage, setCurrentImage] = useState(0);

  const handleKeyDown = useCallback(
    (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
      if (!product?.images?.length) return;
      if (e.key === "ArrowLeft")
        setCurrentImage((p) => (p === 0 ? product.images!.length - 1 : p - 1));
      if (e.key === "ArrowRight")
        setCurrentImage((p) => (p === product.images!.length - 1 ? 0 : p + 1));
    },
    [onClose, product]
  );

  useEffect(() => {
    if (product) {
      document.body.style.overflow = "hidden";
      window.addEventListener("keydown", handleKeyDown);
      setCurrentImage(0);
    }
    return () => {
      document.body.style.overflow = "";
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [product, handleKeyDown]);

  return (
    <AnimatePresence>
      {product && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.15 }}
          className="fixed inset-0 z-50 flex items-end sm:items-center justify-center sm:p-6"
          onClick={onClose}
        >
          {/* Overlay */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.15 }}
            className="absolute inset-0 bg-black/70"
          />

          {/* Modal */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            transition={{ duration: 0.2, ease: [0.16, 1, 0.3, 1] }}
            className="relative w-full max-h-[100dvh] sm:max-w-[800px] sm:max-h-[90vh] overflow-y-auto rounded-t-2xl sm:rounded-2xl bg-white shadow-2xl"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Close button */}
            <button
              onClick={onClose}
              className="absolute top-4 right-4 z-20 flex h-10 w-10 cursor-pointer items-center justify-center rounded-full bg-white text-[#dc2626] shadow-[0_2px_8px_rgba(0,0,0,0.15)] transition-all duration-200 ease-in-out hover:bg-[#dc2626] hover:text-white hover:scale-110 active:translate-y-[1px]"
              aria-label="Lukk"
            >
              <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>

            {/* Image gallery */}
            {product.images && product.images.length > 0 ? (
              <div className="relative">
                <div className="relative aspect-[16/9] overflow-hidden rounded-t-2xl bg-[#1a1a1a]">
                  <Image
                    src={product.images[currentImage]}
                    alt={`${product.title} ${currentImage + 1}`}
                    fill
                    sizes="800px"
                    className="object-contain"
                  />
                </div>

                {product.images.length > 1 && (
                  <>
                    <button
                      onClick={() =>
                        setCurrentImage((p) =>
                          p === 0 ? product.images!.length - 1 : p - 1
                        )
                      }
                      className="absolute left-3 top-1/2 -translate-y-1/2 flex h-10 w-10 items-center justify-center rounded-full bg-white/90 text-gray-700 shadow-lg backdrop-blur-sm transition-all duration-200 hover:bg-white hover:scale-105 active:translate-y-[1px]"
                      aria-label="Forrige bilde"
                    >
                      <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 19.5L8.25 12l7.5-7.5" />
                      </svg>
                    </button>

                    <button
                      onClick={() =>
                        setCurrentImage((p) =>
                          p === product.images!.length - 1 ? 0 : p + 1
                        )
                      }
                      className="absolute right-3 top-1/2 -translate-y-1/2 flex h-10 w-10 items-center justify-center rounded-full bg-white/90 text-gray-700 shadow-lg backdrop-blur-sm transition-all duration-200 hover:bg-white hover:scale-105 active:translate-y-[1px]"
                      aria-label="Neste bilde"
                    >
                      <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M8.25 4.5l7.5 7.5-7.5 7.5" />
                      </svg>
                    </button>

                    <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-2">
                      {product.images.map((_, i) => (
                        <button
                          key={i}
                          onClick={() => setCurrentImage(i)}
                          className={`h-2 rounded-full transition-all duration-300 ${
                            i === currentImage
                              ? "w-6 bg-white"
                              : "w-2 bg-white/50 hover:bg-white/70"
                          }`}
                          aria-label={`Bilde ${i + 1}`}
                        />
                      ))}
                    </div>
                  </>
                )}
              </div>
            ) : null}

            {/* Content */}
            <div className="p-6 sm:p-8">
              <h2 className="text-2xl font-bold text-primary mb-4">
                {product.title}
              </h2>

              <p className="text-text-muted leading-relaxed mb-6">
                {product.description}
              </p>

              {product.specs && product.specs.length > 0 && (
                <div className="flex flex-wrap gap-2 mb-8">
                  {product.specs.map((spec) => (
                    <span
                      key={spec}
                      className="inline-block rounded-full bg-bg-light px-4 py-1.5 text-sm font-medium text-text-dark"
                    >
                      {spec}
                    </span>
                  ))}
                </div>
              )}

              <Link
                href="/kontakt"
                className="flex w-full sm:inline-flex sm:w-auto items-center justify-center gap-2 rounded-full bg-accent px-6 py-3.5 text-sm font-semibold text-white transition-all duration-200 hover:bg-accent-hover hover:shadow-lg active:translate-y-[1px]"
              >
                Kontakt oss om dette
                <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 4.5L21 12m0 0l-7.5 7.5M21 12H3" />
                </svg>
              </Link>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
