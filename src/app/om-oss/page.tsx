import type { Metadata } from "next";
import Image from "next/image";
import AnimateOnScroll from "@/components/AnimateOnScroll";
import { getCurrentSite } from "@/lib/site";
import { getPageSections, getSectionField } from "@/lib/cms";

export const metadata: Metadata = {
  title: "Om oss – Reol-Consult AS",
  description:
    "Reol-Consult AS ble etablert i 1984. Bredt sortiment innen butikk, lager, verksted, kontor, arkiv og garderobe.",
};

const FALLBACK_INTRO_BODY = `Reol-Consult AS ble etablert i november 1984. Vi leverer innredning til butikk, lager, verksted, kontor, arkiv og garderobe — fra første tegning til ferdig montert.

Under årenes løp har vi skaffet oss unike kunnskaper om planlegging og innredningsdesign. Hos oss finnes alt på ett og samme sted og vi leverer til store og små bedrifter over hele landet. På grunn av nærhet til produksjon kan vi tilby skreddersydde løsninger ved behov.

Vi er fagfolk med lang erfaring og har gjennom årene levert innredning til en rekke store og små prosjekter. På Smiløkka 7 på Vear i Tønsberg finner du vår 350 kvm utstilling. Her viser vi et stort utvalg av produktene vi leverer — mye av utstyret er på lager.`;

export default async function OmOss() {
  const site = await getCurrentSite();
  const sections = site ? await getPageSections(site.id, "om-oss") : [];

  const introEyebrow = getSectionField(sections, "intro", "eyebrow", "Om oss");
  const introTitle = getSectionField(sections, "intro", "title", "Om Reol-Consult AS");
  const introBody = getSectionField(sections, "intro", "body", FALLBACK_INTRO_BODY);
  const introImage = getSectionField(
    sections,
    "intro",
    "image_url",
    "https://reolconsult.no/wp-content/uploads/2022/11/Mesanin-6-scaled.jpeg",
  );
  const nokkelfaktaTitle = getSectionField(sections, "nokkelfakta", "title", "Derfor velger kundene oss");
  const showroomEyebrow = getSectionField(sections, "showroom", "eyebrow", "Besøk oss");
  const showroomTitle = getSectionField(sections, "showroom", "title", "Showroom på Vear");
  const showroomBody = getSectionField(
    sections,
    "showroom",
    "body",
    "Vi holder til i Smiløkka 7 på Vear, med 350 kvadratmeter utstilling. Her kan du se og oppleve produktene våre i praksis — og få råd fra våre erfarne konsulenter.",
  );

  return (
    <div>
      <section className="bg-bg-light pt-8 pb-16 sm:pt-20 sm:pb-24">
        <div className="mx-auto max-w-6xl px-4 sm:px-6">
          <div className="grid items-center gap-14 md:grid-cols-2">
            <AnimateOnScroll>
              <span className="text-sm font-semibold uppercase tracking-[0.2em] text-accent">
                {introEyebrow}
              </span>
              <h1 className="mt-4 text-3xl font-bold leading-tight tracking-tight text-primary sm:text-4xl md:text-5xl">
                {introTitle}
              </h1>
              <div className="mt-6 text-lg leading-relaxed text-text-muted whitespace-pre-line">
                {introBody}
              </div>
            </AnimateOnScroll>

            <AnimateOnScroll delay={0.2}>
              <Image
                src={introImage}
                alt="Reol-Consult AS"
                width={600}
                height={400}
                className="w-full rounded-2xl object-cover shadow-[0_30px_60px_rgba(0,0,0,0.12)]"
                unoptimized
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
              {nokkelfaktaTitle}
            </h2>
          </AnimateOnScroll>

          <div className="mt-16 grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
            {[
              {
                title: "Etablert 1984",
                text: "Over 40 års erfaring med innredningsløsninger for næringsliv i hele Norge.",
                icon: (
                  <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.6}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 21h16.5M4.5 3h15M5.25 3v18m13.5-18v18M9 6.75h1.5m-1.5 3h1.5m-1.5 3h1.5m3-6H15m-1.5 3H15m-1.5 3H15M9 21v-3.375c0-.621.504-1.125 1.125-1.125h3.75c.621 0 1.125.504 1.125 1.125V21" />
                  </svg>
                ),
              },
              {
                title: "350 kvm utstilling",
                text: "Besøk vårt showroom i Smiløkka 7 på Vear og se produktene i virkeligheten.",
                icon: (
                  <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.6}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 3v11.25A2.25 2.25 0 0 0 6 16.5h2.25M3.75 3h-1.5m1.5 0h16.5m0 0h1.5m-1.5 0v11.25A2.25 2.25 0 0 1 18 16.5h-2.25m-7.5 0h7.5m-7.5 0-1 3m8.5-3 1 3m0 0 .5 1.5m-.5-1.5h-9.5m0 0-.5 1.5M9 11.25v1.5M12 9v3.75m3-6v6" />
                  </svg>
                ),
              },
              {
                title: "Fra første tegning til ferdig montert",
                text: "Vi bistår med rådgivning, planlegging, tegning, levering og montering.",
                icon: (
                  <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.6}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M11.42 15.17 17.25 21A2.652 2.652 0 0 0 21 17.25l-5.877-5.877M11.42 15.17l2.496-3.03c.317-.384.74-.626 1.208-.766M11.42 15.17l-4.655 5.653a2.548 2.548 0 1 1-3.586-3.586l6.837-5.63m5.108-.233c.55-.164 1.163-.188 1.743-.14a4.5 4.5 0 0 0 4.486-6.336l-3.276 3.277a3.004 3.004 0 0 1-2.25-2.25l3.276-3.276a4.5 4.5 0 0 0-6.336 4.486c.091 1.076-.071 2.264-.904 2.95l-.102.085m-1.745 1.437L5.909 7.5H4.5L2.25 3.75l1.5-1.5L7.5 4.5v1.409l4.26 4.26m-1.745 1.437 1.745-1.437m6.615 8.206L15.75 15.75M4.867 19.125h.008v.008h-.008v-.008Z" />
                  </svg>
                ),
              },
              {
                title: "Bredt sortiment",
                text: "Bredt utvalg innen butikk, lager, verksted, kontor, arkiv og garderobe.",
                icon: (
                  <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.6}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="m20.25 7.5-.625 10.632a2.25 2.25 0 0 1-2.247 2.118H6.622a2.25 2.25 0 0 1-2.247-2.118L3.75 7.5M10 11.25h4M3.375 7.5h17.25c.621 0 1.125-.504 1.125-1.125v-1.5c0-.621-.504-1.125-1.125-1.125H3.375c-.621 0-1.125.504-1.125 1.125v1.5c0 .621.504 1.125 1.125 1.125Z" />
                  </svg>
                ),
              },
              {
                title: "Konkurransedyktige priser",
                text: "Vi forhandler direkte med produsenter og sikrer gode betingelser for våre kunder.",
                icon: (
                  <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.6}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 18.75a60.07 60.07 0 0 1 15.797 2.101c.727.198 1.453-.342 1.453-1.096V18.75M3.75 4.5v.75A.75.75 0 0 1 3 6h-.75m0 0v-.375c0-.621.504-1.125 1.125-1.125H20.25M2.25 6v9m18-10.5v.75c0 .414.336.75.75.75h.75m-1.5-1.5h.375c.621 0 1.125.504 1.125 1.125v9.75c0 .621-.504 1.125-1.125 1.125h-.375m1.5-1.5H21a.75.75 0 0 0-.75.75v.75m0 0H3.75m0 0h-.375a1.125 1.125 0 0 1-1.125-1.125V15m1.5 1.5v-.75A.75.75 0 0 0 3 15h-.75M15 10.5a3 3 0 1 1-6 0 3 3 0 0 1 6 0Zm3 0h.008v.008H18V10.5Zm-12 0h.008v.008H6V10.5Z" />
                  </svg>
                ),
              },
              {
                title: "Over hele Norge",
                text: "Vi leverer og monterer innredningsløsninger over hele landet.",
                icon: (
                  <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.6}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M9 6.75V15m6-6v8.25m.503 3.498 4.875-2.437c.381-.19.622-.58.622-1.006V4.82c0-.836-.88-1.38-1.628-1.006l-3.869 1.934c-.317.159-.69.159-1.006 0L9.503 3.252a1.125 1.125 0 0 0-1.006 0L3.622 5.689C3.24 5.88 3 6.27 3 6.695V19.18c0 .836.88 1.38 1.628 1.006l3.869-1.934c.317-.159.69-.159 1.006 0l4.994 2.497c.317.158.69.158 1.006 0Z" />
                  </svg>
                ),
              },
            ].map((item, i) => (
              <AnimateOnScroll key={item.title} delay={i * 0.1}>
                <div className="rounded-2xl border border-border bg-white p-8 transition-shadow duration-300 hover:shadow-[0_20px_50px_rgba(0,0,0,0.08)]">
                  <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-accent/10 text-accent">
                    {item.icon}
                  </div>
                  <h3 className="mt-5 text-xl font-semibold text-primary">
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
                {showroomEyebrow}
              </span>
              <h2 className="mt-4 text-3xl font-bold tracking-tight text-primary md:text-4xl">
                {showroomTitle}
              </h2>
              <p className="mt-6 text-lg leading-relaxed text-text-muted whitespace-pre-line">
                {showroomBody}
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
                    33 36 55 80
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
