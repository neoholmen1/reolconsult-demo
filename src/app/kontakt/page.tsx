"use client";

import { DM_Sans } from "next/font/google";
import { useState } from "react";
import AnimateOnScroll from "@/components/AnimateOnScroll";

const dmSans = DM_Sans({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
});

const ansatte = [
  {
    name: "Agnete H. Bechmann",
    role: "Salg & rådgivning",
    phone: "45 00 73 22",
  },
  {
    name: "Tore Aas-Kristiansen",
    role: "Salg & rådgivning",
    phone: "98 20 43 23",
  },
  {
    name: "Sentralbord",
    role: "Generelle henvendelser",
    phone: "33 36 55 80",
  },
];

export default function Kontakt() {
  const [submitted, setSubmitted] = useState(false);

  return (
    <div className={dmSans.className}>
      {/* Hero */}
      <section className="bg-[#faf8f6] pt-36 pb-24">
        <div className="mx-auto max-w-6xl px-6">
          <AnimateOnScroll>
            <span className="text-sm font-semibold uppercase tracking-[0.2em] text-accent">
              Kontakt
            </span>
            <h1 className="mt-4 text-4xl font-bold leading-tight tracking-tight text-primary md:text-5xl">
              Ta kontakt med oss
            </h1>
            <p className="mt-6 max-w-2xl text-lg leading-relaxed text-text-muted">
              Har du spørsmål, trenger et tilbud, eller ønsker å besøke vårt
              showroom? Fyll ut skjemaet eller ta kontakt direkte med en av
              våre ansatte.
            </p>
          </AnimateOnScroll>
        </div>
      </section>

      {/* Skjema + Info */}
      <section className="bg-white py-24">
        <div className="mx-auto max-w-6xl px-6">
          <div className="grid gap-16 lg:grid-cols-5">
            {/* Kontaktskjema */}
            <AnimateOnScroll className="lg:col-span-3">
              <div className="rounded-2xl border border-black/[0.04] bg-white p-8 shadow-[0_20px_40px_rgba(0,0,0,0.06)] md:p-10">
                <h2 className="text-2xl font-bold text-primary">
                  Send oss en melding
                </h2>
                <p className="mt-2 text-text-muted">
                  Vi svarer som regel innen én virkedag.
                </p>

                {submitted ? (
                  <div className="mt-8 rounded-xl bg-green-50 p-8 text-center">
                    <span className="text-4xl">✓</span>
                    <p className="mt-3 text-lg font-semibold text-green-800">
                      Takk for din henvendelse!
                    </p>
                    <p className="mt-1 text-green-700/75">
                      Vi tar kontakt med deg så snart vi kan.
                    </p>
                  </div>
                ) : (
                  <form
                    onSubmit={(e) => {
                      e.preventDefault();
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
                          className="w-full rounded-xl border border-black/[0.04] bg-[#faf8f6] px-4 py-3.5 text-primary placeholder:text-text-muted/50 transition-colors focus:border-accent focus:outline-none focus:ring-2 focus:ring-accent/20"
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
                          className="w-full rounded-xl border border-black/[0.04] bg-[#faf8f6] px-4 py-3.5 text-primary placeholder:text-text-muted/50 transition-colors focus:border-accent focus:outline-none focus:ring-2 focus:ring-accent/20"
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
                        className="w-full rounded-xl border border-black/[0.04] bg-[#faf8f6] px-4 py-3.5 text-primary placeholder:text-text-muted/50 transition-colors focus:border-accent focus:outline-none focus:ring-2 focus:ring-accent/20"
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
                        className="w-full resize-none rounded-xl border border-black/[0.04] bg-[#faf8f6] px-4 py-3.5 text-primary placeholder:text-text-muted/50 transition-colors focus:border-accent focus:outline-none focus:ring-2 focus:ring-accent/20"
                      />
                    </div>

                    <button
                      type="submit"
                      className="w-full rounded-full bg-accent py-4 font-semibold text-white transition-all duration-300 hover:bg-accent-hover hover:shadow-[0_8px_30px_rgba(212,32,39,0.25)] sm:w-auto sm:px-10"
                    >
                      Send melding
                    </button>
                  </form>
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
                        className="rounded-xl border border-black/[0.04] bg-white p-5 transition-shadow duration-300 hover:shadow-[0_20px_50px_rgba(0,0,0,0.08)]"
                      >
                        <p className="font-semibold text-primary">
                          {person.name}
                        </p>
                        <p className="mt-0.5 text-sm text-text-muted">
                          {person.role}
                        </p>
                        <a
                          href={`tel:${person.phone.replace(/\s/g, "")}`}
                          className="mt-2 inline-flex items-center gap-2 font-medium text-accent transition-colors hover:text-accent-hover"
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
                    <div>
                      <p className="font-semibold text-primary">
                        Besøksadresse
                      </p>
                      <p>Smiløkka 7, 3173 Vear</p>
                    </div>
                    <div>
                      <p className="font-semibold text-primary">
                        Postadresse
                      </p>
                      <p>Postboks 1, 3108 Vear</p>
                    </div>
                    <div>
                      <p className="font-semibold text-primary">E-post</p>
                      <a
                        href="mailto:post@reolconsult.no"
                        className="text-accent underline decoration-accent/40 underline-offset-4 transition-colors hover:text-accent-hover"
                      >
                        post@reolconsult.no
                      </a>
                    </div>
                  </div>
                </div>
              </div>
            </AnimateOnScroll>
          </div>
        </div>
      </section>

      {/* Google Maps */}
      <section className="bg-[#faf8f6] py-24">
        <div className="mx-auto max-w-6xl px-6">
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
