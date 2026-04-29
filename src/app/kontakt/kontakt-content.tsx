"use client";

import { useState } from "react";
import AnimateOnScroll from "@/components/AnimateOnScroll";
import { useSite } from "@/components/SiteProvider";
import { formatPhoneLink } from "@/lib/site";

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

export default function KontaktContent({
  ansatte,
  introEyebrow,
  introTitle,
  introBody,
  formTitle,
  formHelp,
}: KontaktContentProps) {
  const { settings } = useSite();
  const [submitted, setSubmitted] = useState(false);
  const phoneFromSettings = settings.phone ?? "33 36 55 80";
  const emailFromSettings = settings.email_general ?? "mail@reolconsult.no";

  return (
    <div>
      {/* Hero */}
      <section className="bg-bg-light pt-8 pb-16 sm:pt-20 sm:pb-24">
        <div className="mx-auto max-w-6xl px-4 sm:px-6">
          <AnimateOnScroll>
            <span className="text-sm font-semibold uppercase tracking-[0.2em] text-accent">
              {introEyebrow}
            </span>
            <h1 className="mt-4 text-3xl font-bold leading-tight tracking-tight text-primary sm:text-4xl md:text-5xl">
              {introTitle}
            </h1>
            <p className="mt-6 max-w-2xl text-lg leading-relaxed text-text-muted whitespace-pre-line">
              {introBody}
            </p>
          </AnimateOnScroll>
        </div>
      </section>

      {/* Skjema + Info */}
      <section className="bg-white py-16 sm:py-24">
        <div className="mx-auto max-w-6xl px-4 sm:px-6">
          <div className="grid gap-16 lg:grid-cols-5">
            {/* Kontaktskjema */}
            <AnimateOnScroll className="lg:col-span-3">
              <div className="rounded-2xl border border-border bg-white p-8 shadow-[0_20px_40px_rgba(0,0,0,0.06)] md:p-10">
                <h2 className="text-2xl font-bold text-primary">{formTitle}</h2>
                <p className="mt-2 text-text-muted whitespace-pre-line">{formHelp}</p>

                {submitted ? (
                  <div className="mt-8 rounded-xl bg-green-50 p-8 text-center">
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
                      const subject = `Henvendelse fra ${name || "nettsiden"}`;
                      const body = [
                        `Navn: ${name}`,
                        `E-post: ${email}`,
                        phone ? `Telefon: ${phone}` : null,
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
                          className="w-full rounded-xl border border-border bg-bg-light px-4 py-3.5 text-primary placeholder:text-text-muted/50 transition-colors focus:border-accent focus:outline-none focus:ring-2 focus:ring-accent/20"
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
                          className="w-full rounded-xl border border-border bg-bg-light px-4 py-3.5 text-primary placeholder:text-text-muted/50 transition-colors focus:border-accent focus:outline-none focus:ring-2 focus:ring-accent/20"
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
                        className="w-full rounded-xl border border-border bg-bg-light px-4 py-3.5 text-primary placeholder:text-text-muted/50 transition-colors focus:border-accent focus:outline-none focus:ring-2 focus:ring-accent/20"
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
                        rows={5}
                        placeholder="Hva kan vi hjelpe deg med?"
                        className="w-full resize-none rounded-xl border border-border bg-bg-light px-4 py-3.5 text-primary placeholder:text-text-muted/50 transition-colors focus:border-accent focus:outline-none focus:ring-2 focus:ring-accent/20"
                      />
                    </div>

                    <button
                      type="submit"
                      className="w-full rounded-full bg-accent py-4 font-semibold text-white transition-all duration-300 hover:bg-accent-hover hover:shadow-lg sm:w-auto sm:px-10 active:translate-y-[1px]"
                    >
                      Send melding
                    </button>
                  </form>
                )}

                {!submitted && (
                  <div className="mt-8 rounded-xl border border-dashed border-border bg-bg-light p-5">
                    <p className="text-sm font-semibold text-primary">
                      Foretrekker du å ringe eller skrive direkte?
                    </p>
                    <p className="mt-1 text-sm text-text-muted">
                      Skjemaet åpner e-postklienten din. Du kan også kontakte
                      oss direkte:
                    </p>
                    <div className="mt-3 flex flex-wrap gap-3">
                      <a
                        href={formatPhoneLink(phoneFromSettings)}
                        className="inline-flex items-center gap-2 rounded-full bg-white px-4 py-2 text-sm font-medium text-primary transition-colors hover:bg-primary hover:text-white"
                      >
                        <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                          <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 6.75c0 8.284 6.716 15 15 15h2.25a2.25 2.25 0 0 0 2.25-2.25v-1.372c0-.516-.351-.966-.852-1.091l-4.423-1.106c-.44-.11-.902.055-1.173.417l-.97 1.293c-.282.376-.769.542-1.21.38a12.035 12.035 0 0 1-7.143-7.143c-.162-.441.004-.928.38-1.21l1.293-.97c.363-.271.527-.734.417-1.173L6.963 3.102a1.125 1.125 0 0 0-1.091-.852H4.5A2.25 2.25 0 0 0 2.25 4.5v2.25Z" />
                        </svg>
                        {phoneFromSettings}
                      </a>
                      <a
                        href={`mailto:${emailFromSettings}`}
                        className="inline-flex items-center gap-2 rounded-full bg-white px-4 py-2 text-sm font-medium text-primary transition-colors hover:bg-primary hover:text-white"
                      >
                        <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                          <path strokeLinecap="round" strokeLinejoin="round" d="M21.75 6.75v10.5a2.25 2.25 0 0 1-2.25 2.25h-15a2.25 2.25 0 0 1-2.25-2.25V6.75m19.5 0A2.25 2.25 0 0 0 19.5 4.5h-15a2.25 2.25 0 0 0-2.25 2.25m19.5 0v.243a2.25 2.25 0 0 1-1.07 1.916l-7.5 4.615a2.25 2.25 0 0 1-2.36 0L3.32 8.91a2.25 2.25 0 0 1-1.07-1.916V6.75" />
                        </svg>
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
                  <h2 className="text-2xl font-bold text-primary">
                    Ansatte
                  </h2>
                  <div className="mt-6 space-y-5">
                    {ansatte.map((person) => (
                      <div
                        key={person.phone}
                        className="rounded-xl border border-border bg-white p-5 transition-shadow duration-300 hover:shadow-[0_20px_50px_rgba(0,0,0,0.08)]"
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
                  <h2 className="text-2xl font-bold text-primary">
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
                        <p className="font-semibold text-primary">Åpningstider</p>
                        <p className="whitespace-pre-line">{settings.opening_hours}</p>
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
            <h2 className="text-center text-3xl font-bold tracking-tight text-primary md:text-4xl">
              Finn oss
            </h2>
            <p className="mx-auto mt-4 max-w-lg text-center text-text-muted">
              Vi holder til i Smiløkka 7 på Vear, med 350 kvm utstilling.
              Velkommen på besøk!
            </p>
          </AnimateOnScroll>
          <AnimateOnScroll delay={0.15}>
            <div className="mt-12 overflow-hidden rounded-2xl shadow-[0_20px_50px_rgba(0,0,0,0.08)]">
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
