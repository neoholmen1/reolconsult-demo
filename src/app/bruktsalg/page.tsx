import { DM_Sans } from "next/font/google";
import type { Metadata } from "next";
import AnimateOnScroll from "@/components/AnimateOnScroll";

const dmSans = DM_Sans({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
});

export const metadata: Metadata = {
  title: "Bruktsalg – Reol-Consult AS",
  description:
    "Brukte reoler, lagerinnredning og butikkinnredning til gode priser. Kvalitetskontrollert av Reol-Consult.",
};

const fordeler = [
  {
    title: "Kvalitetskontrollert",
    text: "Alt brukt utstyr blir grundig sjekket og klargjort før salg. Du kan være trygg på at du får produkter i god stand.",
    icon: (
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
          d="M9 12.75 11.25 15 15 9.75M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z"
        />
      </svg>
    ),
  },
  {
    title: "Spar opptil 50 %",
    text: "Brukte reoler og innredning gir deg god kvalitet til en brøkdel av prisen. Perfekt for oppstartsbedrifter og utvidelser.",
    icon: (
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
          d="M2.25 18.75a60.07 60.07 0 0 1 15.797 2.101c.727.198 1.453-.342 1.453-1.096V18.75M3.75 4.5v.75A.75.75 0 0 1 3 6h-.75m0 0v-.375c0-.621.504-1.125 1.125-1.125H20.25M2.25 6v9m18-10.5v.75c0 .414.336.75.75.75h.75m-1.5-1.5h.375c.621 0 1.125.504 1.125 1.125v9.75c0 .621-.504 1.125-1.125 1.125h-.375m1.5-1.5H21a.75.75 0 0 0-.75.75v.75m0 0H3.75m0 0h-.375a1.125 1.125 0 0 1-1.125-1.125V15m1.5 1.5v-.75A.75.75 0 0 0 3 15h-.75M15 10.5a3 3 0 1 1-6 0 3 3 0 0 1 6 0Zm3 0h.008v.008H18V10.5Zm-12 0h.008v.008H6V10.5Z"
        />
      </svg>
    ),
  },
  {
    title: "Bærekraftig valg",
    text: "Ved å velge brukt gir du produkter nytt liv og bidrar til mindre avfall. Godt for miljøet – og lommeboken.",
    icon: (
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
          d="M12.75 3.03v.568c0 .334.148.65.405.864l1.068.89c.442.369.535 1.01.216 1.49l-.51.766a2.25 2.25 0 0 1-1.161.886l-.143.048a1.107 1.107 0 0 0-.57 1.664c.369.555.169 1.307-.427 1.605L9 13.125l.423 1.059a.956.956 0 0 1-1.652.928l-.679-.906a1.125 1.125 0 0 0-1.906.172L4.5 15.75l-.612.153M12.75 3.031a9 9 0 0 1 8.028 8.924M12.75 3.031a9 9 0 0 0-8.141 6.294l-.12.401m0 0 .572.04c.477.033.955-.018 1.41-.175l.057-.019a1.003 1.003 0 0 1 1.084.313l.11.132a1.12 1.12 0 0 0 1.666.074l.621-.555a1.125 1.125 0 0 1 1.395-.089l.094.063a1.125 1.125 0 0 0 1.282-.09l.062-.052a1.127 1.127 0 0 1 1.457-.05l.062.05M3.889 15.905 2.25 18.75m8.528-13.725a9 9 0 0 1 10 8.924"
        />
      </svg>
    ),
  },
  {
    title: "Levering & montering",
    text: "Vi tilbyr frakt og montering av brukte produkter, akkurat som med nye. Alt håndteres profesjonelt.",
    icon: (
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
          d="M8.25 18.75a1.5 1.5 0 0 1-3 0m3 0a1.5 1.5 0 0 0-3 0m3 0h6m-9 0H3.375a1.125 1.125 0 0 1-1.125-1.125V14.25m17.25 4.5a1.5 1.5 0 0 1-3 0m3 0a1.5 1.5 0 0 0-3 0m3 0h1.125c.621 0 1.129-.504 1.09-1.124a17.902 17.902 0 0 0-3.213-9.193 2.056 2.056 0 0 0-1.58-.86H14.25M16.5 18.75h-2.25m0-11.177v-.958c0-.568-.422-1.048-.987-1.106a48.554 48.554 0 0 0-10.026 0 1.106 1.106 0 0 0-.987 1.106v7.635m12-6.677v6.677m0 4.5v-4.5m0 0h-12"
        />
      </svg>
    ),
  },
];

const kategorier = [
  {
    title: "Pallereol / lagerreol",
    desc: "Brukte pallereolsystemer i forskjellige størrelser og bæreevner.",
  },
  {
    title: "Småvarereol",
    desc: "Hyllereol for mindre varer, arkiv og kontorlager.",
  },
  {
    title: "Butikkinnredning",
    desc: "Gondoler, veggsystemer og butikkhyller til dagligvare og fag.",
  },
  {
    title: "Verkstedinnredning",
    desc: "Arbeidsbenker, verktøyskap og lagersystemer for verksted.",
  },
  {
    title: "Kontormøbler",
    desc: "Skrivebord, arkivskap og kontorinnredning.",
  },
  {
    title: "Garderobeinnredning",
    desc: "Garderobeskap og benker for garderober og omkleidningsrom.",
  },
];

export default function Bruktsalg() {
  return (
    <div className={dmSans.className}>
      {/* Hero */}
      <section className="bg-[#faf8f6] pt-36 pb-24">
        <div className="mx-auto max-w-6xl px-6">
          <AnimateOnScroll>
            <div className="inline-flex items-center gap-2 rounded-full border border-green-600/20 bg-green-600/10 px-4 py-1.5 text-sm font-semibold text-green-700">
              <span className="h-2 w-2 rounded-full bg-green-600" />
              Spar penger
            </div>
            <h1 className="mt-6 text-4xl font-bold leading-tight tracking-tight text-primary md:text-5xl">
              Brukte reoler og
              <br />
              innredning til gode priser
            </h1>
            <p className="mt-6 max-w-2xl text-lg leading-relaxed text-text-muted">
              Vi har alltid et utvalg av brukte reoler, butikkinnredning,
              lagerinnredning og kontormøbler på lager. Alt er kvalitetskontrollert
              og klar for nytt bruk — til en brøkdel av nyprisen.
            </p>
            <div className="mt-8 flex flex-wrap gap-4">
              <a
                href="/kontakt"
                className="inline-flex items-center gap-2 rounded-full bg-accent px-7 py-3.5 font-semibold text-white transition-all duration-300 hover:bg-accent-hover hover:shadow-[0_8px_30px_rgba(212,32,39,0.25)]"
              >
                Få tilbud på brukt
                <svg
                  className="h-4 w-4"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                  strokeWidth={2.5}
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M13.5 4.5 21 12m0 0-7.5 7.5M21 12H3"
                  />
                </svg>
              </a>
              <a
                href="tel:+4733365580"
                className="inline-flex items-center gap-2 rounded-full border-2 border-primary/20 px-7 py-3.5 font-semibold text-primary transition-all duration-300 hover:border-primary/40 hover:bg-primary/5"
              >
                Ring 33 36 55 80
              </a>
            </div>
          </AnimateOnScroll>
        </div>
      </section>

      {/* Fordeler */}
      <section className="bg-white py-24">
        <div className="mx-auto max-w-6xl px-6">
          <AnimateOnScroll>
            <h2 className="text-center text-3xl font-bold tracking-tight text-primary md:text-4xl">
              Hvorfor kjøpe brukt?
            </h2>
          </AnimateOnScroll>

          <div className="mt-16 grid gap-8 sm:grid-cols-2">
            {fordeler.map((item, i) => (
              <AnimateOnScroll key={item.title} delay={i * 0.1}>
                <div className="flex gap-5 rounded-2xl border border-black/[0.04] bg-white p-7 transition-shadow duration-300 hover:shadow-[0_20px_50px_rgba(0,0,0,0.08)]">
                  <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-accent/10 text-accent">
                    {item.icon}
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold text-primary">
                      {item.title}
                    </h3>
                    <p className="mt-1.5 leading-relaxed text-text-muted">
                      {item.text}
                    </p>
                  </div>
                </div>
              </AnimateOnScroll>
            ))}
          </div>
        </div>
      </section>

      {/* Kategorier */}
      <section className="bg-[#faf8f6] py-24">
        <div className="mx-auto max-w-6xl px-6">
          <AnimateOnScroll>
            <span className="text-sm font-semibold uppercase tracking-[0.2em] text-accent">
              Kategorier
            </span>
            <h2 className="mt-4 text-3xl font-bold tracking-tight text-primary md:text-4xl">
              Hva vi tilbyr brukt
            </h2>
            <p className="mt-4 max-w-2xl text-text-muted">
              Utvalget varierer. Ta kontakt for å høre hva vi har tilgjengelig
              akkurat nå, eller fortell oss hva du er på utkikk etter.
            </p>
          </AnimateOnScroll>

          <div className="mt-14 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {kategorier.map((kat, i) => (
              <AnimateOnScroll key={kat.title} delay={i * 0.08}>
                <div className="rounded-2xl border border-black/[0.04] bg-white p-7 transition-all duration-300 hover:-translate-y-0.5 hover:shadow-[0_20px_50px_rgba(0,0,0,0.08)]">
                  <h3 className="text-lg font-semibold text-primary">
                    {kat.title}
                  </h3>
                  <p className="mt-2 text-sm leading-relaxed text-text-muted">
                    {kat.desc}
                  </p>
                </div>
              </AnimateOnScroll>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="bg-white py-24">
        <div className="mx-auto max-w-3xl px-6 text-center">
          <AnimateOnScroll>
            <h2 className="text-3xl font-bold tracking-tight text-primary md:text-4xl">
              Har du brukt innredning å selge?
            </h2>
            <p className="mx-auto mt-4 max-w-lg text-lg text-text-muted">
              Vi kjøper også inn brukt innredning. Ta kontakt med oss for en
              uforpliktende vurdering.
            </p>
            <div className="mt-8 flex flex-wrap justify-center gap-4">
              <a
                href="/kontakt"
                className="inline-flex items-center gap-2 rounded-full bg-primary px-7 py-3.5 font-semibold text-white transition-all duration-300 hover:bg-primary-light hover:shadow-[0_20px_50px_rgba(0,0,0,0.15)]"
              >
                Kontakt oss
              </a>
              <a
                href="tel:+4733365580"
                className="inline-flex items-center gap-2 rounded-full border-2 border-primary/20 px-7 py-3.5 font-semibold text-primary transition-all duration-300 hover:border-primary/40 hover:bg-primary/5"
              >
                Ring 33 36 55 80
              </a>
            </div>
          </AnimateOnScroll>
        </div>
      </section>
    </div>
  );
}
