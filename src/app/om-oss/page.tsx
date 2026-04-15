import type { Metadata } from "next";
import Image from "next/image";
import AnimateOnScroll from "@/components/AnimateOnScroll";

export const metadata: Metadata = {
  title: "Om oss – Reol-Consult AS",
  description:
    "Reol-Consult AS ble etablert i 1984. Østlandets største sortiment innen butikk, lager, verksted, kontor, arkiv og garderobe.",
};

export default function OmOss() {
  return (
    <div>
      {/* Hero */}
      <section className="bg-bg-light pt-8 pb-16 sm:pt-20 sm:pb-24">
        <div className="mx-auto max-w-6xl px-4 sm:px-6">
          <div className="grid items-center gap-14 md:grid-cols-2">
            <AnimateOnScroll>
              <span className="text-sm font-semibold uppercase tracking-[0.2em] text-accent">
                Om oss
              </span>
              <h1 className="mt-4 text-3xl font-bold leading-tight tracking-tight text-primary sm:text-4xl md:text-5xl">
                Om Reol-Consult&nbsp;AS
              </h1>
              <p className="mt-6 text-lg leading-relaxed text-text-muted">
                Reol-Consult AS ble etablert i november 1984. Vi har Østlandets
                største produktsortiment innen butikk, lager, verksted, kontor,
                arkiv og garderobe. Vi tilbyr effektive og konkurransedyktige
                løsninger fra idé til sluttprodukt.
              </p>
              <p className="mt-4 text-lg leading-relaxed text-text-muted">
                Under årenes løp har vi skaffet oss unike kunnskaper om
                planlegging og innredningsdesign. Hos oss finnes alt på ett og
                samme sted og vi leverer til store og små bedrifter over hele
                landet. På grunn av nærhet til produksjon kan vi tilby
                skreddersydde løsninger ved behov.
              </p>
              <p className="mt-4 text-lg leading-relaxed text-text-muted">
                Vi er en gruppe fagfolk med høy kompetanse, service og
                ekspertise, samt lang erfaring innen vårt fag. Vi har gjennom
                årene levert innredninger til en rekke store og små prosjekter.
                I Smiløkka 7 på Vear Industriområde i Tønsberg finner du vår
                350 kvm store utstilling, hvor vi viser et stort utvalg av
                produktene vi leverer. Mye av utstyret lagerføres!
              </p>
              <p className="mt-4 text-lg leading-relaxed text-text-muted">
                Vårt produktregister omfatter alt fra mindre detaljinnredninger
                til hele systemer for store miljøer. Vi har ett av markedets
                mest komplette, fleksible og høykvalitets hylle- og
                innredningssortiment og tør påstå at vi har det meste til din
                bedrift.
              </p>
              <p className="mt-4 text-lg leading-relaxed text-text-muted">
                Grunnsystemet er bedriftens skjelett og skal kunne bære stativ,
                konsoller, hyller, skilter, belysning og alle typer av
                produkter. Vårt grunnsystem er utviklet slik at det klarer
                belastninger og tøffe tak i mange år. Dessuten er den svært
                enkel å montere, bygge om, bygge ut og komplettere, hvilket er
                viktig da forandringer ofte kreves for en lang attraksjonskraft.
              </p>
              <p className="mt-4 text-lg leading-relaxed text-text-muted">
                Ta kontakt med oss når du skal investere i ny innredning, da er
                du sikker på å få levert inventar tilpasset de krav som til
                enhver tid stilles til innredningen. Vi er der du er!
              </p>
            </AnimateOnScroll>

            <AnimateOnScroll delay={0.2}>
              <Image
                src="https://reolconsult.no/wp-content/uploads/2022/11/Mesanin-6-scaled.jpeg"
                alt="Butikkinnredning levert av Reol-Consult"
                width={600}
                height={400}
                className="w-full rounded-2xl object-cover shadow-[0_30px_60px_rgba(0,0,0,0.12)]"
              />
            </AnimateOnScroll>
          </div>
        </div>
      </section>

      {/* Nøkkelfakta */}
      <section className="bg-white py-16 sm:py-24">
        <div className="mx-auto max-w-6xl px-4 sm:px-6">
          <AnimateOnScroll>
            <h2 className="text-center text-3xl font-bold tracking-tight text-primary md:text-4xl">
              Derfor velger kundene oss
            </h2>
          </AnimateOnScroll>

          <div className="mt-16 grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
            {[
              {
                title: "Etablert 1984",
                text: "Over 40 års erfaring med innredningsløsninger for næringsliv i hele Norge.",
                icon: "🏢",
              },
              {
                title: "350 kvm utstilling",
                text: "Besøk vårt showroom i Smiløkka 7 på Vear og se produktene i virkeligheten.",
                icon: "📐",
              },
              {
                title: "Fra idé til sluttprodukt",
                text: "Vi bistår med rådgivning, planlegging, tegning, levering og montering.",
                icon: "🔧",
              },
              {
                title: "Bredt sortiment",
                text: "Østlandets største utvalg innen butikk, lager, verksted, kontor, arkiv og garderobe.",
                icon: "📦",
              },
              {
                title: "Konkurransedyktige priser",
                text: "Vi forhandler direkte med produsenter og sikrer gode betingelser for våre kunder.",
                icon: "💰",
              },
              {
                title: "Over hele Norge",
                text: "Vi leverer og monterer innredningsløsninger over hele landet.",
                icon: "🇳🇴",
              },
            ].map((item, i) => (
              <AnimateOnScroll key={item.title} delay={i * 0.1}>
                <div className="rounded-2xl border border-border bg-white p-8 transition-shadow duration-300 hover:shadow-[0_20px_50px_rgba(0,0,0,0.08)]">
                  <span className="text-3xl">{item.icon}</span>
                  <h3 className="mt-4 text-xl font-semibold text-primary">
                    {item.title}
                  </h3>
                  <p className="mt-2 leading-relaxed text-text-muted">
                    {item.text}
                  </p>
                </div>
              </AnimateOnScroll>
            ))}
          </div>
        </div>
      </section>

      {/* Showroom */}
      <section className="bg-bg-light py-16 sm:py-24">
        <div className="mx-auto max-w-6xl px-4 sm:px-6">
          <div className="grid items-center gap-14 md:grid-cols-2">
            <AnimateOnScroll>
              <div className="overflow-hidden rounded-2xl">
                <iframe
                  src="https://www.google.com/maps?q=Smiløkka+7,+3173+Vear,+Norway&t=&z=15&ie=UTF8&iwloc=&output=embed"
                  className="h-80 w-full rounded-2xl border-0"
                  allowFullScreen
                  loading="lazy"
                  referrerPolicy="no-referrer-when-downgrade"
                  title="Kart til Reol-Consult AS"
                />
              </div>
            </AnimateOnScroll>

            <AnimateOnScroll delay={0.2}>
              <span className="text-sm font-semibold uppercase tracking-[0.2em] text-accent">
                Besøk oss
              </span>
              <h2 className="mt-4 text-3xl font-bold tracking-tight text-primary md:text-4xl">
                Showroom på Vear
              </h2>
              <p className="mt-6 text-lg leading-relaxed text-text-muted">
                Vi holder til i Smiløkka 7 på Vear, med 350 kvadratmeter
                utstilling. Her kan du se og oppleve produktene våre i praksis
                — og få råd fra våre erfarne konsulenter.
              </p>
              <div className="mt-8 space-y-3 text-text-muted">
                <p>
                  <span className="font-semibold text-primary">Adresse:</span>{" "}
                  Smiløkka 7, 3173 Vear
                </p>
                <p>
                  <span className="font-semibold text-primary">Telefon:</span>{" "}
                  <a
                    href="tel:+4733365580"
                    className="underline decoration-accent/40 underline-offset-4 transition-colors hover:text-accent"
                  >
                    333 65 580
                  </a>
                </p>
              </div>
              <a
                href="/kontakt"
                className="mt-8 inline-flex items-center gap-2 rounded-full bg-accent px-7 py-3.5 font-semibold text-white transition-all duration-300 hover:bg-accent-hover hover:shadow-lg active:translate-y-[1px]"
              >
                Kontakt oss
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
            </AnimateOnScroll>
          </div>
        </div>
      </section>
    </div>
  );
}
