"use client";

import { useEffect, useRef, useState } from "react";
import { useSearchParams } from "next/navigation";
import AnimateOnScroll from "@/components/AnimateOnScroll";
import OpenStatusBadge from "@/components/OpenStatusBadge";
import { useSite } from "@/components/SiteProvider";
import { formatPhoneLink } from "@/lib/site";
import { supabase } from "@/lib/supabase";
import { ryddTekst } from "@/lib/tekst";

export type KontaktAnsatt = {
  name: string;
  role: string;
  phone: string;
  email: string;
};

export type KontaktContentProps = {
  ansatte: KontaktAnsatt[];
  introEyebrow: string;
  introTitle: string;
  introBody: string;
  formTitle: string;
  formHelp: string;
};

type ProductOption = { title: string; category_slug: string };

export default function KontaktContent({
  ansatte,
  introEyebrow,
  introTitle,
  introBody,
  formTitle,
  formHelp,
}: KontaktContentProps) {
  const { settings } = useSite();
  const searchParams = useSearchParams();
  const [submitted, setSubmitted] = useState(false);
  const [selectedProducts, setSelectedProducts] = useState<string[]>([]);
  const [availableProducts, setAvailableProducts] = useState<ProductOption[]>([]);
  const [showProductDropdown, setShowProductDropdown] = useState(false);
  const [message, setMessage] = useState("");
  const messageEditedRef = useRef(false);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const phoneFromSettings = settings.phone ?? "33 36 55 80";
  const emailFromSettings = settings.email_general ?? "mail@reolconsult.no";

  // Bygg en naturlig norsk meldingstekst basert på valgte produkter
  function buildAutoMessage(products: string[]): string {
    if (products.length === 0) return "";
    let list: string;
    if (products.length === 1) list = products[0];
    else if (products.length === 2) list = `${products[0]} og ${products[1]}`;
    else list = `${products.slice(0, -1).join(", ")} og ${products[products.length - 1]}`;
    return `Hei,\n\nJeg ønsker mer informasjon om ${list}, og gjerne et uforpliktende tilbud.\n\nMvh`;
  }

  // Oppdater meldingsfeltet når produkter endres — men kun hvis brukeren ikke
  // allerede har begynt å skrive sin egen tekst.
  useEffect(() => {
    if (messageEditedRef.current) return;
    setMessage(buildAutoMessage(selectedProducts));
  }, [selectedProducts]);

  // Les ?produkt=… fra URL ved første render og pre-select det
  useEffect(() => {
    const param = searchParams.get("produkt");
    if (param) {
      setSelectedProducts([param]);
    }
  }, [searchParams]);

  // Hent produkt-liste fra DB for dropdown
  useEffect(() => {
    let cancelled = false;
    supabase
      .from("products")
      .select("title, category_slug")
      .eq("published", true)
      .order("category_slug")
      .order("sort_order")
      .then(({ data }) => {
        if (!cancelled && data) setAvailableProducts(data as ProductOption[]);
      });
    return () => { cancelled = true; };
  }, []);

  // Lukk dropdown når man klikker utenfor
  useEffect(() => {
    if (!showProductDropdown) return;
    function handleClick(e: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
        setShowProductDropdown(false);
      }
    }
    window.addEventListener("mousedown", handleClick);
    return () => window.removeEventListener("mousedown", handleClick);
  }, [showProductDropdown]);

  function addProduct(title: string) {
    setSelectedProducts((prev) => (prev.includes(title) ? prev : [...prev, title]));
    setShowProductDropdown(false);
  }

  function removeProduct(title: string) {
    setSelectedProducts((prev) => prev.filter((p) => p !== title));
  }

  const remainingProducts = availableProducts.filter((p) => !selectedProducts.includes(p.title));

  return (
    <div>
      {/* Hero */}
      <section className="bg-bg-light pt-8 pb-16 sm:pt-20 sm:pb-24">
        <div className="mx-auto max-w-6xl px-4 sm:px-6">
          <AnimateOnScroll>
            <p className="inline-flex items-center gap-2.5 text-xs font-semibold uppercase tracking-[0.22em] text-accent">
              <span className="h-px w-7 bg-accent/50" />
              {introEyebrow}
            </p>
            <h1 className="mt-5 font-display text-4xl font-semibold leading-[1.05] tracking-[-0.02em] text-primary sm:text-5xl md:text-6xl">
              {introTitle}
            </h1>
            <p className="mt-6 max-w-2xl text-lg leading-relaxed text-text-muted whitespace-pre-line">
              {ryddTekst(introBody)}
            </p>
          </AnimateOnScroll>
        </div>
      </section>

      {/* Skjema + Info */}
      <section className="bg-surface-warm py-16 sm:py-24">
        <div className="mx-auto max-w-6xl px-4 sm:px-6">
          <div className="grid gap-16 lg:grid-cols-5">
            {/* Kontaktskjema */}
            <AnimateOnScroll className="lg:col-span-3">
              <div className="rounded-3xl border border-border bg-surface p-8 shadow-[var(--shadow-card)] md:p-10">
                <h2 className="font-display text-2xl font-semibold tracking-[-0.02em] text-primary">{formTitle}</h2>
                <p className="mt-2 text-text-muted whitespace-pre-line">{ryddTekst(formHelp)}</p>

                {submitted ? (
                  <div className="mt-8 rounded-2xl bg-green-50 p-8 text-center">
                    <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-green-600/10 text-green-700">
                      <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="m4.5 12.75 6 6 9-13.5" />
                      </svg>
                    </div>
                    <p className="mt-4 text-lg font-semibold text-green-800">
                      E-postklienten din åpnes
                    </p>
                    <p className="mt-1 text-green-700/75">
                      Trykk send i e-postklienten for å fullføre henvendelsen. Vi
                      svarer som regel innen én virkedag.
                    </p>
                  </div>
                ) : (
                  <form
                    onSubmit={(e) => {
                      e.preventDefault();
                      const form = e.currentTarget;
                      const data = new FormData(form);
                      const name = String(data.get("name") ?? "").trim();
                      const phone = String(data.get("phone") ?? "").trim();
                      const email = String(data.get("email") ?? "").trim();
                      const message = String(data.get("message") ?? "").trim();
                      const productsLine =
                        selectedProducts.length > 0
                          ? `Interessert i: ${selectedProducts.join(", ")}`
                          : null;
                      const subject =
                        selectedProducts.length > 0
                          ? `Henvendelse: ${selectedProducts.join(", ")}`
                          : `Henvendelse fra ${name || "nettsiden"}`;
                      const body = [
                        `Navn: ${name}`,
                        `E-post: ${email}`,
                        phone ? `Telefon: ${phone}` : null,
                        productsLine,
                        "",
                        "Melding:",
                        message,
                      ]
                        .filter((line) => line !== null)
                        .join("\n");
                      const mailto = `mailto:${emailFromSettings}?subject=${encodeURIComponent(
                        subject,
                      )}&body=${encodeURIComponent(body)}`;
                      window.location.href = mailto;
                      setSubmitted(true);
                    }}
                    className="mt-8 space-y-6"
                  >
                    {/* Produkter du er interessert i */}
                    <div ref={dropdownRef}>
                      <label className="mb-2 block text-sm font-medium text-primary">
                        Interessert i{" "}
                        <span className="font-normal text-text-muted">(valgfritt)</span>
                      </label>
                      <div className="flex flex-wrap gap-2">
                        {selectedProducts.map((p) => (
                          <span
                            key={p}
                            className="inline-flex items-center gap-1.5 rounded-full border border-accent/20 bg-accent/5 py-1.5 pl-3 pr-1.5 text-sm font-medium text-accent"
                          >
                            {p}
                            <button
                              type="button"
                              onClick={() => removeProduct(p)}
                              className="flex h-5 w-5 items-center justify-center rounded-full bg-accent/10 text-accent transition-colors hover:bg-accent hover:text-white"
                              aria-label={`Fjern ${p}`}
                            >
                              <svg className="h-3 w-3" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.25}>
                                <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                              </svg>
                            </button>
                          </span>
                        ))}
                        {remainingProducts.length > 0 && (
                          <div className="relative">
                            <button
                              type="button"
                              onClick={() => setShowProductDropdown((p) => !p)}
                              className="inline-flex items-center gap-1.5 rounded-full border border-dashed border-text-muted/40 bg-surface px-3 py-1.5 text-sm font-medium text-text-muted transition-colors hover:border-primary/40 hover:text-primary"
                            >
                              <svg className="h-3.5 w-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                                <path strokeLinecap="round" strokeLinejoin="round" d="M12 4.5v15m7.5-7.5h-15" />
                              </svg>
                              Legg til produkt
                            </button>
                            {showProductDropdown && (
                              <div className="absolute left-0 top-full z-10 mt-2 max-h-72 w-80 overflow-y-auto rounded-2xl border border-border bg-surface p-1.5 shadow-[var(--shadow-float)]">
                                {Object.entries(
                                  remainingProducts.reduce<Record<string, ProductOption[]>>((acc, p) => {
                                    (acc[p.category_slug] ||= []).push(p);
                                    return acc;
                                  }, {}),
                                ).map(([slug, items]) => (
                                  <div key={slug} className="py-1">
                                    <p className="px-2 pb-1 pt-1 text-[10px] font-semibold uppercase tracking-wider text-text-muted">
                                      {slug}
                                    </p>
                                    {items.map((p) => (
                                      <button
                                        key={p.title}
                                        type="button"
                                        onClick={() => addProduct(p.title)}
                                        className="block w-full rounded-lg px-2.5 py-1.5 text-left text-sm text-primary transition-colors hover:bg-bg-light"
                                      >
                                        {p.title}
                                      </button>
                                    ))}
                                  </div>
                                ))}
                              </div>
                            )}
                          </div>
                        )}
                      </div>
                    </div>

                    <div className="grid gap-6 sm:grid-cols-2">
                      <div>
                        <label
                          htmlFor="name"
                          className="mb-2 block text-sm font-medium text-primary"
                        >
                          Navn
                        </label>
                        <input
                          type="text"
                          id="name"
                          name="name"
                          required
                          placeholder="Ditt fulle navn"
                          className="w-full rounded-2xl border border-border bg-surface px-4 py-3 text-primary placeholder:text-text-muted/50 outline-none transition focus:border-accent/50 focus:ring-2 focus:ring-accent/15"
                        />
                      </div>
                      <div>
                        <label
                          htmlFor="phone"
                          className="mb-2 block text-sm font-medium text-primary"
                        >
                          Telefon
                        </label>
                        <input
                          type="tel"
                          id="phone"
                          name="phone"
                          placeholder="Ditt telefonnummer"
                          className="w-full rounded-2xl border border-border bg-surface px-4 py-3 text-primary placeholder:text-text-muted/50 outline-none transition focus:border-accent/50 focus:ring-2 focus:ring-accent/15"
                        />
                      </div>
                    </div>

                    <div>
                      <label
                        htmlFor="email"
                        className="mb-2 block text-sm font-medium text-primary"
                      >
                        E-post
                      </label>
                      <input
                        type="email"
                        id="email"
                        name="email"
                        required
                        placeholder="din@epost.no"
                        className="w-full rounded-2xl border border-border bg-surface px-4 py-3 text-primary placeholder:text-text-muted/50 outline-none transition focus:border-accent/50 focus:ring-2 focus:ring-accent/15"
                      />
                    </div>

                    <div>
                      <label
                        htmlFor="message"
                        className="mb-2 block text-sm font-medium text-primary"
                      >
                        Melding
                      </label>
                      <textarea
                        id="message"
                        name="message"
                        required
                        rows={6}
                        placeholder="Hva kan vi hjelpe deg med?"
                        value={message}
                        onChange={(e) => {
                          messageEditedRef.current = true;
                          setMessage(e.target.value);
                        }}
                        className="w-full resize-y rounded-2xl border border-border bg-surface px-4 py-3 text-primary placeholder:text-text-muted/50 outline-none transition focus:border-accent/50 focus:ring-2 focus:ring-accent/15"
                      />
                      {selectedProducts.length > 0 && !messageEditedRef.current && (
                        <p className="mt-2 text-xs text-text-muted">
                          Vi har skrevet et utkast — endre fritt om du vil.
                        </p>
                      )}
                    </div>

                    <button
                      type="submit"
                      className="w-full rounded-full bg-accent py-4 font-semibold text-white transition hover:bg-accent-hover hover:shadow-[0_8px_24px_rgba(220,38,38,0.25)] sm:w-auto sm:px-10 active:translate-y-[1px]"
                    >
                      Send melding
                    </button>
                  </form>
                )}

                {!submitted && (
                  <div className="mt-8 rounded-2xl border border-border bg-bg-light p-5">
                    <p className="text-sm font-semibold text-primary">
                      Foretrekker du å ringe eller skrive direkte?
                    </p>
                    <p className="mt-1 text-sm text-text-muted">
                      Skjemaet åpner e-postklienten din. Du kan også kontakte oss direkte:
                    </p>
                    <div className="mt-4 flex flex-wrap gap-2.5">
                      <a
                        href={formatPhoneLink(phoneFromSettings)}
                        className="group inline-flex items-center gap-2 rounded-full border border-border bg-surface px-4 py-2.5 text-sm font-medium text-primary shadow-[var(--shadow-soft)] transition duration-200 hover:border-accent/30 hover:bg-accent/5 hover:text-accent"
                      >
                        <span className="flex h-7 w-7 items-center justify-center rounded-full bg-accent/10 text-accent transition-colors duration-200 group-hover:bg-accent group-hover:text-white">
                          <svg className="h-3.5 w-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                            <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 6.75c0 8.284 6.716 15 15 15h2.25a2.25 2.25 0 0 0 2.25-2.25v-1.372c0-.516-.351-.966-.852-1.091l-4.423-1.106c-.44-.11-.902.055-1.173.417l-.97 1.293c-.282.376-.769.542-1.21.38a12.035 12.035 0 0 1-7.143-7.143c-.162-.441.004-.928.38-1.21l1.293-.97c.363-.271.527-.734.417-1.173L6.963 3.102a1.125 1.125 0 0 0-1.091-.852H4.5A2.25 2.25 0 0 0 2.25 4.5v2.25Z" />
                          </svg>
                        </span>
                        {phoneFromSettings}
                      </a>
                      <a
                        href={`mailto:${emailFromSettings}`}
                        className="group inline-flex items-center gap-2 rounded-full border border-border bg-surface px-4 py-2.5 text-sm font-medium text-primary shadow-[var(--shadow-soft)] transition duration-200 hover:border-accent/30 hover:bg-accent/5 hover:text-accent"
                      >
                        <span className="flex h-7 w-7 items-center justify-center rounded-full bg-accent/10 text-accent transition-colors duration-200 group-hover:bg-accent group-hover:text-white">
                          <svg className="h-3.5 w-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                            <path strokeLinecap="round" strokeLinejoin="round" d="M21.75 6.75v10.5a2.25 2.25 0 0 1-2.25 2.25h-15a2.25 2.25 0 0 1-2.25-2.25V6.75m19.5 0A2.25 2.25 0 0 0 19.5 4.5h-15a2.25 2.25 0 0 0-2.25 2.25m19.5 0v.243a2.25 2.25 0 0 1-1.07 1.916l-7.5 4.615a2.25 2.25 0 0 1-2.36 0L3.32 8.91a2.25 2.25 0 0 1-1.07-1.916V6.75" />
                          </svg>
                        </span>
                        {emailFromSettings}
                      </a>
                    </div>
                  </div>
                )}
              </div>
            </AnimateOnScroll>

            {/* Kontaktinfo */}
            <AnimateOnScroll delay={0.2} className="lg:col-span-2">
              <div className="space-y-10">
                {/* Ansatte */}
                <div>
                  <h2 className="font-display text-2xl font-semibold tracking-[-0.02em] text-primary">
                    Ansatte
                  </h2>
                  <div className="mt-6 space-y-5">
                    {ansatte.map((person) => (
                      <div
                        key={person.phone}
                        className="rounded-3xl border border-border bg-surface p-5 shadow-[var(--shadow-soft)] transition duration-200 hover:-translate-y-1 hover:shadow-[var(--shadow-lift)]"
                      >
                        <p className="font-semibold text-primary">
                          {person.name}
                        </p>
                        <p className="mt-0.5 text-sm text-text-muted">
                          {person.role}
                        </p>
                        <div className="mt-2 flex flex-wrap items-center gap-x-4 gap-y-1">
                          <a
                            href={`tel:+47${person.phone.replace(/\s/g, "")}`}
                            className="inline-flex items-center gap-2 font-medium text-accent transition-colors hover:text-accent-hover"
                          >
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
                                d="M2.25 6.75c0 8.284 6.716 15 15 15h2.25a2.25 2.25 0 0 0 2.25-2.25v-1.372c0-.516-.351-.966-.852-1.091l-4.423-1.106c-.44-.11-.902.055-1.173.417l-.97 1.293c-.282.376-.769.542-1.21.38a12.035 12.035 0 0 1-7.143-7.143c-.162-.441.004-.928.38-1.21l1.293-.97c.363-.271.527-.734.417-1.173L6.963 3.102a1.125 1.125 0 0 0-1.091-.852H4.5A2.25 2.25 0 0 0 2.25 4.5v2.25Z"
                              />
                            </svg>
                            {person.phone}
                          </a>
                          <a
                            href={`mailto:${person.email}`}
                            className="inline-flex items-center gap-2 text-sm font-medium text-text-muted transition-colors hover:text-accent"
                          >
                            <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                              <path strokeLinecap="round" strokeLinejoin="round" d="M21.75 6.75v10.5a2.25 2.25 0 0 1-2.25 2.25h-15a2.25 2.25 0 0 1-2.25-2.25V6.75m19.5 0A2.25 2.25 0 0 0 19.5 4.5h-15a2.25 2.25 0 0 0-2.25 2.25m19.5 0v.243a2.25 2.25 0 0 1-1.07 1.916l-7.5 4.615a2.25 2.25 0 0 1-2.36 0L3.32 8.91a2.25 2.25 0 0 1-1.07-1.916V6.75" />
                            </svg>
                            {person.email}
                          </a>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Adresse */}
                <div>
                  <h2 className="font-display text-2xl font-semibold tracking-[-0.02em] text-primary">
                    Adresse
                  </h2>
                  <div className="mt-4 space-y-3 text-text-muted">
                    {settings.visit_address && (
                      <div>
                        <p className="font-semibold text-primary">
                          Besøksadresse
                        </p>
                        <p>{settings.visit_address}</p>
                      </div>
                    )}
                    {settings.postal_address && (
                      <div>
                        <p className="font-semibold text-primary">
                          Postadresse
                        </p>
                        <p>{settings.postal_address}</p>
                      </div>
                    )}
                    {settings.email_general && (
                      <div>
                        <p className="font-semibold text-primary">E-post</p>
                        <a
                          href={`mailto:${settings.email_general}`}
                          className="text-accent underline decoration-accent/40 underline-offset-4 transition-colors hover:text-accent-hover"
                        >
                          {settings.email_general}
                        </a>
                      </div>
                    )}
                    {settings.opening_hours && (
                      <div>
                        <div className="flex items-center gap-2.5">
                          <p className="font-semibold text-primary">Åpningstider</p>
                          <OpenStatusBadge />
                        </div>
                        <p className="mt-1 whitespace-pre-line">{settings.opening_hours}</p>
                        <p className="text-sm text-text-muted/80">Besøk etter avtale.</p>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </AnimateOnScroll>
          </div>
        </div>
      </section>

      {/* Google Maps */}
      <section className="bg-bg-light py-16 sm:py-24">
        <div className="mx-auto max-w-6xl px-4 sm:px-6">
          <AnimateOnScroll>
            <h2 className="text-center font-display text-3xl font-semibold tracking-[-0.02em] text-primary md:text-4xl">
              Finn oss
            </h2>
            <p className="mx-auto mt-4 max-w-lg text-center text-text-muted">
              Vi holder til i Smiløkka 7 på Vear, med 350 kvm utstilling.
              Velkommen på besøk!
            </p>
          </AnimateOnScroll>
          <AnimateOnScroll delay={0.15}>
            <div className="mt-12 overflow-hidden rounded-[1.5rem] ring-1 ring-black/5 shadow-[var(--shadow-card)] sm:rounded-[2rem]">
              <iframe
                src="https://www.google.com/maps?q=Smiløkka+7,+3173+Vear,+Norway&t=&z=15&ie=UTF8&iwloc=&output=embed"
                className="h-96 w-full border-0 md:h-[450px]"
                allowFullScreen
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
                title="Kart til Reol-Consult AS, Smiløkka 7, 3173 Vear"
              />
            </div>
          </AnimateOnScroll>
        </div>
      </section>
    </div>
  );
}
