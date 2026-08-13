import type { Metadata } from "next";
import Image from "next/image";
import AnimateOnScroll from "@/components/AnimateOnScroll";
import { getCurrentSite, getSiteSettingsOrFallback, formatPhoneLink } from "@/lib/site";
import { getPageSections, getSectionField } from "@/lib/cms";
import { ryddTekst } from "@/lib/tekst";

export const metadata: Metadata = {
  title: "Bruktsalg – Reol-Consult AS",
  description:
    "Brukte reoler, lagerinnredning og butikkinnredning til gode priser. Kvalitetskontrollert av Reol-Consult.",
};

const HERO_IMAGE = "https://reolconsult.no/wp-content/uploads/2022/11/Pallreol-II-scaled.jpg";

type Tone = "rose" | "amber" | "emerald" | "blue";
const TONE: Record<Tone, { bg: string; ring: string; icon: string }> = {
  rose:    { bg: "bg-rose-50",    ring: "ring-rose-100",    icon: "text-rose-700" },
  amber:   { bg: "bg-amber-50",   ring: "ring-amber-100",   icon: "text-amber-700" },
  emerald: { bg: "bg-emerald-50", ring: "ring-emerald-100", icon: "text-emerald-700" },
  blue:    { bg: "bg-blue-50",    ring: "ring-blue-100",    icon: "text-blue-700" },
};

const fordeler: { title: string; text: string; tone: Tone; icon: React.ReactNode }[] = [
  {
    title: "Kvalitetskontrollert",
    text: "Alt brukt utstyr blir grundig sjekket og klargjort før salg. Du kan være trygg på at du får produkter i god stand.",
    tone: "emerald",
    icon: (
      <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.75}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75 11.25 15 15 9.75M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z" />
      </svg>
    ),
  },
  {
    title: "Rimeligere alternativ",
    text: "Brukte reoler og innredning gir deg god kvalitet til en lavere pris. Aktuelt for oppstartsbedrifter og utvidelser.",
    tone: "amber",
    icon: (
      <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.75}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 18.75a60.07 60.07 0 0 1 15.797 2.101c.727.198 1.453-.342 1.453-1.096V18.75M3.75 4.5v.75A.75.75 0 0 1 3 6h-.75m0 0v-.375c0-.621.504-1.125 1.125-1.125H20.25M2.25 6v9m18-10.5v.75c0 .414.336.75.75.75h.75m-1.5-1.5h.375c.621 0 1.125.504 1.125 1.125v9.75c0 .621-.504 1.125-1.125 1.125h-.375m1.5-1.5H21a.75.75 0 0 0-.75.75v.75m0 0H3.75m0 0h-.375a1.125 1.125 0 0 1-1.125-1.125V15m1.5 1.5v-.75A.75.75 0 0 0 3 15h-.75M15 10.5a3 3 0 1 1-6 0 3 3 0 0 1 6 0Zm3 0h.008v.008H18V10.5Zm-12 0h.008v.008H6V10.5Z" />
      </svg>
    ),
  },
  {
    title: "Bærekraftig valg",
    text: "Ved å velge brukt gir du produkter nytt liv og bidrar til mindre avfall. Godt for miljøet – og lommeboken.",
    tone: "blue",
    icon: (
      <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.75}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M12.75 3.03v.568c0 .334.148.65.405.864l1.068.89c.442.369.535 1.01.216 1.49l-.51.766a2.25 2.25 0 0 1-1.161.886l-.143.048a1.107 1.107 0 0 0-.57 1.664c.369.555.169 1.307-.427 1.605L9 13.125l.423 1.059a.956.956 0 0 1-1.652.928l-.679-.906a1.125 1.125 0 0 0-1.906.172L4.5 15.75l-.612.153M12.75 3.031a9 9 0 0 1 8.028 8.924M12.75 3.031a9 9 0 0 0-8.141 6.294l-.12.401m0 0 .572.04c.477.033.955-.018 1.41-.175l.057-.019a1.003 1.003 0 0 1 1.084.313l.11.132a1.12 1.12 0 0 0 1.666.074l.621-.555a1.125 1.125 0 0 1 1.395-.089l.094.063a1.125 1.125 0 0 0 1.282-.09l.062-.052a1.127 1.127 0 0 1 1.457-.05l.062.05M3.889 15.905 2.25 18.75m8.528-13.725a9 9 0 0 1 10 8.924" />
      </svg>
    ),
  },
  {
    title: "Levering og montering",
    text: "Vi tilbyr frakt og montering av brukte produkter, akkurat som med nye. Alt håndteres profesjonelt.",
    tone: "rose",
    icon: (
      <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.75}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M8.25 18.75a1.5 1.5 0 0 1-3 0m3 0a1.5 1.5 0 0 0-3 0m3 0h6m-9 0H3.375a1.125 1.125 0 0 1-1.125-1.125V14.25m17.25 4.5a1.5 1.5 0 0 1-3 0m3 0a1.5 1.5 0 0 0-3 0m3 0h1.125c.621 0 1.129-.504 1.09-1.124a17.902 17.902 0 0 0-3.213-9.193 2.056 2.056 0 0 0-1.58-.86H14.25M16.5 18.75h-2.25m0-11.177v-.958c0-.568-.422-1.048-.987-1.106a48.554 48.554 0 0 0-10.026 0 1.106 1.106 0 0 0-.987 1.106v7.635m12-6.677v6.677m0 4.5v-4.5m0 0h-12" />
      </svg>
    ),
  },
];

const kategorier = [
  { title: "Pallreol / lagerreol", desc: "Brukte pallreolsystemer i forskjellige størrelser og bæreevner." },
  { title: "Småvarereol", desc: "Hyllereol for mindre varer, arkiv og kontorlager." },
  { title: "Butikkinnredning", desc: "Gondoler, veggsystemer og butikkhyller til dagligvare og fag." },
  { title: "Verkstedinnredning", desc: "Arbeidsbenker, verktøyskap og lagersystemer for verksted." },
  { title: "Kontormøbler", desc: "Skrivebord, arkivskap og kontorinnredning." },
  { title: "Garderobeinnredning", desc: "Garderobeskap og benker for garderober og omkledningsrom." },
];

const eksempler = [
  { src: "https://reolconsult.no/wp-content/uploads/2022/11/Pallreol-1.jpg", label: "Pallreoler" },
  { src: "https://reolconsult.no/wp-content/uploads/2022/11/Smavarereol-15-scaled.jpg", label: "Småvarereoler" },
  { src: "https://reolconsult.no/wp-content/uploads/2022/11/Nettinghyller-4.jpg", label: "Nettinghyller" },
];

export default async function Bruktsalg() {
  const site = await getCurrentSite();
  const [settings, sections] = await Promise.all([
    getSiteSettingsOrFallback(site?.id ?? null),
    site ? getPageSections(site.id, "bruktsalg") : Promise.resolve([]),
  ]);

  const introTitle = getSectionField(sections, "intro", "title", "Brukte reoler og\ninnredning til gode priser");
  const introBody = getSectionField(
    sections,
    "intro",
    "body",
    "Vi har alltid et utvalg av brukte reoler, butikkinnredning, lagerinnredning og kontormøbler på lager. Alt er kvalitetskontrollert og klar for nytt bruk — til en brøkdel av nyprisen.",
  );
  const fordelerTitle = getSectionField(sections, "fordeler", "title", "Hvorfor kjøpe brukt?");

  return (
    <div>
      {/* Hero */}
      <section className="bg-bg-light py-16 md:py-24">
        <div className="mx-auto max-w-6xl px-4 sm:px-6">
          <div className="grid grid-cols-1 items-center gap-10 lg:grid-cols-2 lg:gap-16">
            <AnimateOnScroll>
              <p className="inline-flex items-center gap-2.5 text-xs font-semibold uppercase tracking-[0.22em] text-accent">
                <span className="h-px w-7 bg-accent/50" />
                Bruktsalg
              </p>
              <h1 className="mt-5 font-display text-[2.25rem] font-semibold leading-tight tracking-[-0.02em] text-primary md:text-5xl whitespace-pre-line">
                {introTitle}
              </h1>
              <p className="mt-5 max-w-xl text-base leading-relaxed text-text-muted md:text-lg whitespace-pre-line">
                {ryddTekst(introBody)}
              </p>
              <div className="mt-8 flex flex-col gap-3 sm:flex-row sm:gap-4">
                <a
                  href="/kontakt"
                  className="inline-flex items-center justify-center gap-2 rounded-full bg-accent px-8 py-4 font-semibold text-white transition hover:bg-accent-hover hover:shadow-[0_8px_24px_rgba(220,38,38,0.25)] active:translate-y-[1px]"
                >
                  Få tilbud på brukt
                  <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.25}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 4.5 21 12m0 0-7.5 7.5M21 12H3" />
                  </svg>
                </a>
                <a
                  href={formatPhoneLink(settings.phone)}
                  className="inline-flex items-center justify-center gap-2 rounded-full border border-primary/20 px-7 py-3.5 font-semibold text-primary transition duration-300 hover:border-primary/40 hover:bg-primary/5 active:translate-y-[1px]"
                >
                  Ring {settings.phone ?? "33 36 55 80"}
                </a>
              </div>
            </AnimateOnScroll>

            <AnimateOnScroll delay={0.2}>
              <div className="relative aspect-[4/3] overflow-hidden rounded-[1.5rem] ring-1 ring-black/5 shadow-[var(--shadow-card)] sm:rounded-[2rem]">
                <Image
                  src={HERO_IMAGE}
                  alt="Brukte pallreoler klare for nytt bruk"
                  fill
                  sizes="(max-width: 1024px) 100vw, 50vw"
                  className="object-cover"
                  priority
                  unoptimized
                  quality={90}
                />
                <div className="pointer-events-none absolute inset-x-0 bottom-0 h-1/4 bg-gradient-to-t from-black/30 to-transparent" />
              </div>
            </AnimateOnScroll>
          </div>
        </div>
      </section>

      {/* Fordeler */}
      <section className="bg-surface py-20 md:py-28">
        <div className="mx-auto max-w-6xl px-4 sm:px-6">
          <AnimateOnScroll className="text-center">
            <h2 className="font-display text-[2.25rem] font-semibold tracking-[-0.02em] text-primary md:text-5xl">
              {fordelerTitle}
            </h2>
            <p className="mx-auto mt-4 max-w-2xl text-base leading-relaxed text-text-muted md:text-lg">
              Fire grunner til at brukt-løsninger er et smart valg for mange bedrifter.
            </p>
          </AnimateOnScroll>

          <div className="mt-14 grid gap-5 sm:grid-cols-2 sm:gap-6">
            {fordeler.map((item, i) => {
              const tone = TONE[item.tone];
              return (
                <AnimateOnScroll key={item.title} delay={i * 0.08}>
                  <div className="flex h-full gap-5 rounded-3xl border border-border bg-surface-warm p-6 shadow-[var(--shadow-soft)] transition duration-200 hover:-translate-y-1 hover:shadow-[var(--shadow-lift)] sm:p-7">
                    <div className={`flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl ${tone.bg} ${tone.icon} ring-1 ring-inset ${tone.ring}`}>
                      {item.icon}
                    </div>
                    <div>
                      <h3 className="text-lg font-semibold text-primary">{item.title}</h3>
                      <p className="mt-1.5 text-[15px] leading-relaxed text-text-muted">
                        {item.text}
                      </p>
                    </div>
                  </div>
                </AnimateOnScroll>
              );
            })}
          </div>
        </div>
      </section>

      {/* Kategorier */}
      <section className="bg-bg-light py-20 md:py-28">
        <div className="mx-auto max-w-6xl px-4 sm:px-6">
          <AnimateOnScroll>
            <p className="inline-flex items-center gap-2.5 text-xs font-semibold uppercase tracking-[0.22em] text-accent">
              <span className="h-px w-7 bg-accent/50" />
              Kategorier
            </p>
            <h2 className="mt-5 font-display text-[2.25rem] font-semibold tracking-[-0.02em] text-primary md:text-5xl">
              Hva vi tilbyr brukt
            </h2>
            <p className="mt-4 max-w-2xl text-base leading-relaxed text-text-muted md:text-lg">
              Utvalget varierer. Ta kontakt for å høre hva vi har tilgjengelig akkurat nå, eller fortell oss hva du er på utkikk etter.
            </p>
          </AnimateOnScroll>

          <div className="mt-12 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {kategorier.map((kat, i) => (
              <AnimateOnScroll key={kat.title} delay={i * 0.08}>
                <div className="h-full rounded-3xl border border-border bg-surface p-6 shadow-[var(--shadow-soft)] transition duration-200 hover:-translate-y-1 hover:shadow-[var(--shadow-lift)] sm:p-7">
                  <h3 className="text-lg font-semibold text-primary">{kat.title}</h3>
                  <p className="mt-2 text-sm leading-relaxed text-text-muted">{kat.desc}</p>
                </div>
              </AnimateOnScroll>
            ))}
          </div>
        </div>
      </section>

      {/* Eksempler — featured + 2 stacked */}
      <section className="bg-surface py-20 md:py-28">
        <div className="mx-auto max-w-6xl px-4 sm:px-6">
          <AnimateOnScroll>
            <h2 className="font-display text-[2.25rem] font-semibold tracking-[-0.02em] text-primary md:text-5xl">
              Eksempler på det vi har hatt inne
            </h2>
            <p className="mt-3 max-w-2xl text-base leading-relaxed text-text-muted md:text-lg">
              Utvalget endrer seg fra uke til uke. Ring {settings.phone ?? "33 36 55 80"} så sier vi hva vi har akkurat nå.
            </p>
          </AnimateOnScroll>

          <div className="mt-12 grid gap-5 lg:grid-cols-2">
            {/* Featured stort kort */}
            <AnimateOnScroll>
              <a
                href="/kontakt"
                className="group relative block aspect-[4/3] overflow-hidden rounded-3xl border border-border shadow-[var(--shadow-soft)] transition duration-200 hover:-translate-y-1 hover:shadow-[var(--shadow-lift)] sm:aspect-[5/4] lg:aspect-auto lg:h-full"
              >
                <Image
                  src={eksempler[0].src}
                  alt={eksempler[0].label}
                  fill
                  sizes="(max-width: 1024px) 100vw, 50vw"
                  className="object-cover transition-transform duration-700 group-hover:scale-[1.04]"
                  unoptimized
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/30 to-transparent" />
                <div className="absolute inset-x-0 bottom-0 p-6">
                  <span className="text-xs font-semibold uppercase tracking-[0.22em] text-white/80">Brukt</span>
                  <h3 className="mt-1.5 font-display text-2xl font-semibold tracking-[-0.02em] text-white">{eksempler[0].label}</h3>
                  <p className="mt-2 text-sm text-white/80">Ta kontakt for tilgjengelighet</p>
                </div>
              </a>
            </AnimateOnScroll>

            {/* To mindre kort stacket */}
            <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-1">
              {eksempler.slice(1).map((item, i) => (
                <AnimateOnScroll key={item.label} delay={0.1 + i * 0.08}>
                  <a
                    href="/kontakt"
                    className="group relative block aspect-[4/3] overflow-hidden rounded-3xl border border-border shadow-[var(--shadow-soft)] transition duration-200 hover:-translate-y-1 hover:shadow-[var(--shadow-lift)] lg:aspect-[16/9]"
                  >
                    <Image
                      src={item.src}
                      alt={item.label}
                      fill
                      sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 50vw"
                      className="object-cover transition-transform duration-700 group-hover:scale-[1.04]"
                      unoptimized
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />
                    <div className="absolute inset-x-0 bottom-0 p-5">
                      <h3 className="text-lg font-bold text-white">{item.label}</h3>
                    </div>
                  </a>
                </AnimateOnScroll>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* CTA — har du brukt å selge */}
      <section className="bg-bg-light py-20 md:py-28">
        <div className="mx-auto max-w-3xl px-4 text-center sm:px-6">
          <AnimateOnScroll>
            <h2 className="font-display text-[2.25rem] font-semibold tracking-[-0.02em] text-primary md:text-5xl">
              Har du brukt innredning å selge?
            </h2>
            <p className="mx-auto mt-5 max-w-lg text-base leading-relaxed text-text-muted md:text-lg">
              Vi kjøper også inn brukt innredning. Ta kontakt med oss for en uforpliktende vurdering.
            </p>
            <div className="mt-8 flex flex-col items-center gap-3 sm:flex-row sm:justify-center sm:gap-4">
              <a
                href="/kontakt"
                className="w-full rounded-full bg-accent px-8 py-4 text-center text-base font-semibold text-white transition hover:bg-accent-hover hover:shadow-[0_8px_24px_rgba(220,38,38,0.25)] active:translate-y-[1px] sm:w-auto"
              >
                Kontakt oss
              </a>
              <a
                href={formatPhoneLink(settings.phone)}
                className="w-full rounded-full border border-primary/20 px-8 py-4 text-center text-base font-semibold text-primary transition duration-300 hover:border-primary/40 hover:bg-primary/5 active:translate-y-[1px] sm:w-auto"
              >
                Ring {settings.phone ?? "33 36 55 80"}
              </a>
            </div>
          </AnimateOnScroll>
        </div>
      </section>
    </div>
  );
}
