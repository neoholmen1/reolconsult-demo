"use client";

import { useState, useRef, useEffect, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import { categories, products, type Product } from "@/data/products";
import { motion, AnimatePresence } from "motion/react";

function formatPrice(price: number) {
  return price.toLocaleString("no-NO");
}

function InquiryModal({
  selected,
  onClose,
  onRemove,
  onUpdateQty,
}: {
  selected: { product: Product; qty: number }[];
  onClose: () => void;
  onRemove: (id: string) => void;
  onUpdateQty: (id: string, qty: number) => void;
}) {
  const [form, setForm] = useState({ name: "", email: "", phone: "", company: "", message: "" });
  const [sending, setSending] = useState(false);
  const [sent, setSent] = useState(false);

  const totalEstimate = selected.reduce((sum, s) => sum + s.product.priceFrom * s.qty, 0);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setSending(true);

    try {
      const res = await fetch("/api/inquiry", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...form,
          products: selected.map((s) => ({ name: s.product.name, qty: s.qty })),
        }),
      });
      const data = await res.json();

      if (data.mailto) {
        window.open(data.mailto, "_blank");
      }
      setSent(true);
    } catch {
      alert("Noe gikk galt. Prøv igjen.");
    } finally {
      setSending(false);
    }
  }

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4"
      onClick={onClose}
    >
      <motion.div
        initial={{ opacity: 0, y: 40, scale: 0.95 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        exit={{ opacity: 0, y: 40, scale: 0.95 }}
        transition={{ type: "spring", damping: 25, stiffness: 300 }}
        className="w-full max-w-2xl max-h-[90vh] overflow-y-auto rounded-3xl bg-white p-8 shadow-2xl"
        onClick={(e) => e.stopPropagation()}
      >
        {sent ? (
          <div className="text-center py-12">
            <div className="mx-auto mb-6 flex h-16 w-16 items-center justify-center rounded-full bg-green-100">
              <svg className="h-8 w-8 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
              </svg>
            </div>
            <h3 className="text-2xl font-bold text-primary">Forespørsel sendt!</h3>
            <p className="mt-3 text-text-muted">
              Vi kontakter deg snart med et tilbud. Du kan også ringe oss på 33 36 55 80.
            </p>
            <button onClick={onClose} className="mt-8 rounded-full bg-primary px-8 py-3 font-semibold text-white hover:bg-primary-light transition-colors">
              Lukk
            </button>
          </div>
        ) : (
          <>
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-2xl font-bold text-primary">Din forespørsel</h3>
              <button onClick={onClose} className="rounded-full p-2 hover:bg-black/5 transition-colors">
                <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>

            {/* Selected products */}
            <div className="mb-6 space-y-3">
              {selected.map((s) => (
                <div key={s.product.id} className="flex items-center gap-4 rounded-2xl bg-[#faf8f6] p-4">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img src={s.product.image} alt={s.product.name} className="h-16 w-16 rounded-xl object-cover" />
                  <div className="flex-1 min-w-0">
                    <p className="font-semibold text-primary truncate">{s.product.name}</p>
                    <p className="text-sm text-text-muted">fra kr {formatPrice(s.product.priceFrom)} {s.product.priceUnit}</p>
                  </div>
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => onUpdateQty(s.product.id, Math.max(1, s.qty - 1))}
                      className="flex h-8 w-8 items-center justify-center rounded-full bg-white text-primary shadow-sm hover:bg-black/5"
                    >
                      -
                    </button>
                    <span className="w-8 text-center font-semibold">{s.qty}</span>
                    <button
                      onClick={() => onUpdateQty(s.product.id, s.qty + 1)}
                      className="flex h-8 w-8 items-center justify-center rounded-full bg-white text-primary shadow-sm hover:bg-black/5"
                    >
                      +
                    </button>
                  </div>
                  <button onClick={() => onRemove(s.product.id)} className="text-text-muted hover:text-accent transition-colors">
                    <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                    </svg>
                  </button>
                </div>
              ))}

              <div className="flex justify-between items-center pt-3 border-t border-black/10">
                <span className="text-sm text-text-muted">Estimert totalpris</span>
                <span className="text-xl font-bold text-primary">fra kr {formatPrice(totalEstimate)}</span>
              </div>
            </div>

            {/* Form */}
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                <input
                  type="text"
                  placeholder="Navn *"
                  required
                  value={form.name}
                  onChange={(e) => setForm({ ...form, name: e.target.value })}
                  className="rounded-xl border border-black/10 bg-[#faf8f6] px-4 py-3 text-sm outline-none focus:border-accent focus:ring-1 focus:ring-accent transition-colors"
                />
                <input
                  type="email"
                  placeholder="E-post *"
                  required
                  value={form.email}
                  onChange={(e) => setForm({ ...form, email: e.target.value })}
                  className="rounded-xl border border-black/10 bg-[#faf8f6] px-4 py-3 text-sm outline-none focus:border-accent focus:ring-1 focus:ring-accent transition-colors"
                />
                <input
                  type="tel"
                  placeholder="Telefon"
                  value={form.phone}
                  onChange={(e) => setForm({ ...form, phone: e.target.value })}
                  className="rounded-xl border border-black/10 bg-[#faf8f6] px-4 py-3 text-sm outline-none focus:border-accent focus:ring-1 focus:ring-accent transition-colors"
                />
                <input
                  type="text"
                  placeholder="Bedrift"
                  value={form.company}
                  onChange={(e) => setForm({ ...form, company: e.target.value })}
                  className="rounded-xl border border-black/10 bg-[#faf8f6] px-4 py-3 text-sm outline-none focus:border-accent focus:ring-1 focus:ring-accent transition-colors"
                />
              </div>
              <textarea
                placeholder="Melding (valgfritt) — f.eks. spesialmål, leveringstid, etc."
                rows={3}
                value={form.message}
                onChange={(e) => setForm({ ...form, message: e.target.value })}
                className="w-full rounded-xl border border-black/10 bg-[#faf8f6] px-4 py-3 text-sm outline-none focus:border-accent focus:ring-1 focus:ring-accent transition-colors resize-none"
              />
              <button
                type="submit"
                disabled={sending}
                className="w-full rounded-full bg-accent py-4 text-base font-semibold text-white transition-all duration-300 hover:bg-accent-hover hover:shadow-[0_8px_30px_rgba(212,32,39,0.25)] disabled:opacity-50"
              >
                {sending ? "Sender..." : "Send forespørsel"}
              </button>
              <p className="text-center text-xs text-text-muted">
                Vi svarer vanligvis innen 1 virkedag. Du kan også ringe oss direkte på{" "}
                <a href="tel:+4733365580" className="font-semibold text-primary">33 36 55 80</a>.
              </p>
            </form>
          </>
        )}
      </motion.div>
    </motion.div>
  );
}

function ProductCard({
  product,
  onAdd,
  isSelected,
}: {
  product: Product;
  onAdd: (product: Product) => void;
  isSelected: boolean;
}) {
  const [expanded, setExpanded] = useState(false);

  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      className="group flex flex-col overflow-hidden rounded-2xl bg-white shadow-sm transition-all duration-300 hover:shadow-lg"
    >
      {/* Image */}
      <div
        className="relative aspect-[4/3] cursor-pointer overflow-hidden"
        onClick={() => setExpanded(!expanded)}
      >
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={product.image}
          alt={product.name}
          className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-105"
        />
        {isSelected && (
          <div className="absolute top-3 right-3 flex h-8 w-8 items-center justify-center rounded-full bg-accent text-white shadow-lg">
            <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
            </svg>
          </div>
        )}
        <div className="absolute bottom-0 inset-x-0 bg-gradient-to-t from-black/40 to-transparent h-20" />
        <div className="absolute bottom-3 left-4">
          <span className="rounded-full bg-white/90 backdrop-blur-sm px-3 py-1 text-xs font-semibold text-primary">
            fra kr {formatPrice(product.priceFrom)}
          </span>
        </div>
      </div>

      {/* Info */}
      <div className="flex flex-1 flex-col p-5">
        <h3 className="text-lg font-semibold text-primary">{product.name}</h3>
        <p className="mt-1 text-sm text-text-muted leading-relaxed line-clamp-2">{product.description}</p>

        <AnimatePresence>
          {expanded && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: "auto", opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              transition={{ duration: 0.3 }}
              className="overflow-hidden"
            >
              <ul className="mt-4 space-y-2">
                {product.features.map((f) => (
                  <li key={f} className="flex items-start gap-2 text-sm text-text-muted">
                    <span className="mt-1.5 h-1.5 w-1.5 flex-shrink-0 rounded-full bg-accent" />
                    {f}
                  </li>
                ))}
              </ul>
              <p className="mt-4 text-sm text-text-muted">
                <span className="font-semibold text-primary">fra kr {formatPrice(product.priceFrom)}</span>{" "}
                {product.priceUnit}
              </p>
            </motion.div>
          )}
        </AnimatePresence>

        <div className="mt-4 flex items-center gap-2 pt-2 border-t border-black/5">
          <button
            onClick={() => setExpanded(!expanded)}
            className="flex-1 rounded-full border border-black/10 px-4 py-2.5 text-sm font-medium text-primary transition-all hover:bg-black/5"
          >
            {expanded ? "Skjul detaljer" : "Se detaljer"}
          </button>
          <button
            onClick={() => onAdd(product)}
            className={`flex-1 rounded-full px-4 py-2.5 text-sm font-semibold transition-all duration-300 ${
              isSelected
                ? "bg-accent/10 text-accent border border-accent/20"
                : "bg-accent text-white hover:bg-accent-hover hover:shadow-[0_4px_15px_rgba(212,32,39,0.25)]"
            }`}
          >
            {isSelected ? "Lagt til" : "Legg til"}
          </button>
        </div>
      </div>
    </motion.div>
  );
}

function ProdukterContent() {
  const searchParams = useSearchParams();
  const [activeCategory, setActiveCategory] = useState<string | null>(null);
  const [selectedProducts, setSelectedProducts] = useState<Map<string, { product: Product; qty: number }>>(new Map());
  const [showInquiry, setShowInquiry] = useState(false);
  const gridRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const kategori = searchParams.get("kategori");
    if (kategori && categories.some((c) => c.slug === kategori)) {
      setActiveCategory(kategori);
    }
  }, [searchParams]);

  const filteredProducts = activeCategory
    ? products.filter((p) => p.categorySlug === activeCategory)
    : products;

  function addProduct(product: Product) {
    setSelectedProducts((prev) => {
      const next = new Map(prev);
      if (next.has(product.id)) {
        next.delete(product.id);
      } else {
        next.set(product.id, { product, qty: 1 });
      }
      return next;
    });
  }

  function removeProduct(id: string) {
    setSelectedProducts((prev) => {
      const next = new Map(prev);
      next.delete(id);
      return next;
    });
  }

  function updateQty(id: string, qty: number) {
    setSelectedProducts((prev) => {
      const next = new Map(prev);
      const item = next.get(id);
      if (item) {
        next.set(id, { ...item, qty });
      }
      return next;
    });
  }

  function scrollToGrid() {
    gridRef.current?.scrollIntoView({ behavior: "smooth", block: "start" });
  }

  return (
    <div>
      {/* Hero */}
      <section className="relative -mt-[180px] overflow-hidden bg-primary">
        <div className="absolute inset-0">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src="https://reolconsult.no/wp-content/uploads/2022/11/Hekta-Pa-Tur-2-scaled.jpg"
            alt=""
            className="h-full w-full object-cover opacity-20"
          />
        </div>
        <div className="relative mx-auto max-w-7xl px-4 pt-56 pb-20 sm:px-6 sm:pb-24 lg:px-8">
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="text-sm font-semibold uppercase tracking-[0.2em] text-accent"
          >
            Produkter
          </motion.p>
          <motion.h1
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="mt-4 text-4xl font-bold tracking-tight text-white sm:text-5xl lg:text-6xl"
          >
            Velg dine produkter
          </motion.h1>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="mt-6 max-w-xl text-lg text-white/70"
          >
            Utforsk vårt sortiment, se estimerte priser og send en forespørsel — alt på ett sted.
          </motion.p>
        </div>
      </section>

      {/* Category tabs */}
      <section className="sticky top-[56px] z-30 bg-white/80 backdrop-blur-xl border-b border-black/5">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="flex items-center gap-2 py-4 overflow-x-auto no-scrollbar">
            <button
              onClick={() => { setActiveCategory(null); scrollToGrid(); }}
              className={`flex-shrink-0 rounded-full px-5 py-2 text-sm font-medium transition-all duration-300 ${
                activeCategory === null
                  ? "bg-primary text-white shadow-sm"
                  : "bg-black/5 text-text-muted hover:bg-black/10"
              }`}
            >
              Alle
            </button>
            {categories.map((cat) => (
              <button
                key={cat.slug}
                onClick={() => { setActiveCategory(cat.slug); scrollToGrid(); }}
                className={`flex-shrink-0 rounded-full px-5 py-2 text-sm font-medium transition-all duration-300 ${
                  activeCategory === cat.slug
                    ? "bg-primary text-white shadow-sm"
                    : "bg-black/5 text-text-muted hover:bg-black/10"
                }`}
              >
                {cat.name}
              </button>
            ))}
          </div>
        </div>
      </section>

      {/* Product grid */}
      <section ref={gridRef} className="bg-[#faf8f6] py-16 sm:py-20">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          {activeCategory && (
            <motion.div
              key={activeCategory}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="mb-10"
            >
              <h2 className="text-3xl font-bold text-primary">
                {categories.find((c) => c.slug === activeCategory)?.name}
              </h2>
              <p className="mt-2 text-text-muted">
                {categories.find((c) => c.slug === activeCategory)?.description}
              </p>
            </motion.div>
          )}

          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
            <AnimatePresence mode="popLayout">
              {filteredProducts.map((product) => (
                <ProductCard
                  key={product.id}
                  product={product}
                  onAdd={addProduct}
                  isSelected={selectedProducts.has(product.id)}
                />
              ))}
            </AnimatePresence>
          </div>
        </div>
      </section>

      {/* Floating cart */}
      <AnimatePresence>
        {selectedProducts.size > 0 && (
          <motion.div
            initial={{ y: 100, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: 100, opacity: 0 }}
            transition={{ type: "spring", damping: 25, stiffness: 300 }}
            className="fixed bottom-6 left-1/2 z-40 -translate-x-1/2"
          >
            <button
              onClick={() => setShowInquiry(true)}
              className="flex items-center gap-4 rounded-full bg-accent px-10 py-5 text-white shadow-[0_10px_40px_rgba(212,32,39,0.4)] transition-all hover:shadow-[0_15px_50px_rgba(212,32,39,0.5)] hover:scale-[1.02] text-lg"
            >
              <span className="flex h-7 w-7 items-center justify-center rounded-full bg-accent text-sm font-bold">
                {selectedProducts.size}
              </span>
              <span className="font-semibold">
                Få tilbud — fra kr {formatPrice(
                  Array.from(selectedProducts.values()).reduce(
                    (sum, s) => sum + s.product.priceFrom * s.qty, 0
                  )
                )}
              </span>
              <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 4.5L21 12m0 0l-7.5 7.5M21 12H3" />
              </svg>
            </button>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Inquiry modal */}
      <AnimatePresence>
        {showInquiry && (
          <InquiryModal
            selected={Array.from(selectedProducts.values())}
            onClose={() => setShowInquiry(false)}
            onRemove={removeProduct}
            onUpdateQty={updateQty}
          />
        )}
      </AnimatePresence>
    </div>
  );
}

export default function Produkter() {
  return (
    <Suspense>
      <ProdukterContent />
    </Suspense>
  );
}
