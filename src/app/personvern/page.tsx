import type { Metadata } from "next";
import AnimateOnScroll from "@/components/AnimateOnScroll";
import { getCurrentSite, getSiteSettingsOrFallback } from "@/lib/site";

export const metadata: Metadata = {
  title: "Personvern – Reol-Consult AS",
  description:
    "Reol-Consult AS sin personvernerklæring: hva vi samler inn, hvordan vi bruker det, og dine rettigheter.",
};

export default async function Personvern() {
  const site = await getCurrentSite();
  const settings = await getSiteSettingsOrFallback(site?.id ?? null);
  const siteName = site?.name ?? "Reol-Consult AS";
  const orgNumber = site?.org_number ?? "955 273 117";

  return (
    <div>
      <section className="bg-white py-16 sm:py-24">
        <div className="mx-auto max-w-[700px] px-4 sm:px-6">
          <AnimateOnScroll>
            <h1 className="text-3xl font-bold tracking-tight text-primary sm:text-4xl">
              Personvernerklæring
            </h1>
            <p className="mt-3 text-sm text-text-muted">
              Sist oppdatert: april 2026
            </p>
          </AnimateOnScroll>

          <AnimateOnScroll delay={0.1}>
            <div className="mt-12 space-y-10 text-[15px] leading-relaxed text-[#6b7280]">
              <div>
                <h2 className="mb-3 text-lg font-bold text-primary">
                  Behandlingsansvarlig
                </h2>
                <p>
                  {siteName}, org.nr {orgNumber}
                  {settings.visit_address && (
                    <>
                      <br />
                      {settings.visit_address}
                    </>
                  )}
                  {(settings.email_general || settings.phone) && (
                    <>
                      <br />
                      {[settings.email_general, settings.phone].filter(Boolean).join(", ")}
                    </>
                  )}
                </p>
              </div>

              <div>
                <h2 className="mb-3 text-lg font-bold text-primary">
                  Hvilke opplysninger vi samler inn
                </h2>
                <ul className="list-disc space-y-1.5 pl-5">
                  <li>
                    Kontaktinformasjon du oppgir via kontaktskjema (navn, e-post,
                    telefon, melding)
                  </li>
                  <li>Meldinger du sender via chatboten på nettsiden</li>
                  <li>
                    Teknisk informasjon som IP-adresse, nettlesertype og
                    operativsystem via informasjonskapsler
                  </li>
                </ul>
              </div>

              <div>
                <h2 className="mb-3 text-lg font-bold text-primary">
                  Formål med behandlingen
                </h2>
                <ul className="list-disc space-y-1.5 pl-5">
                  <li>Besvare henvendelser og gi tilbud</li>
                  <li>Forbedre nettsiden og brukeropplevelsen</li>
                  <li>Føre statistikk over besøk på nettsiden</li>
                </ul>
              </div>

              <div>
                <h2 className="mb-3 text-lg font-bold text-primary">
                  Informasjonskapsler
                </h2>
                <ul className="list-disc space-y-1.5 pl-5">
                  <li>
                    <strong className="text-primary">Nødvendige:</strong> for at
                    nettsiden skal fungere (sesjoner, cookie-samtykke)
                  </li>
                  <li>
                    <strong className="text-primary">Analytiske:</strong> for å
                    forstå hvordan nettsiden brukes (anonymisert)
                  </li>
                  <li>Vi bruker ingen markedsføringscookies</li>
                </ul>
              </div>

              <div>
                <h2 className="mb-3 text-lg font-bold text-primary">
                  Deling av opplysninger
                </h2>
                <ul className="list-disc space-y-1.5 pl-5">
                  <li>
                    Vi selger aldri dine opplysninger til tredjepart
                  </li>
                  <li>
                    Data lagres sikkert hos Supabase (EU-baserte servere)
                  </li>
                  <li>
                    Vi deler kun opplysninger der det er nødvendig for å levere
                    tjenester
                  </li>
                </ul>
              </div>

              <div>
                <h2 className="mb-3 text-lg font-bold text-primary">
                  Dine rettigheter
                </h2>
                <ul className="list-disc space-y-1.5 pl-5">
                  <li>Rett til innsyn i egne personopplysninger</li>
                  <li>Rett til å korrigere uriktige opplysninger</li>
                  <li>Rett til å slette opplysninger</li>
                  <li>Rett til å trekke tilbake samtykke</li>
                </ul>
                {settings.email_general && (
                  <p className="mt-3">
                    Kontakt oss på{" "}
                    <a
                      href={`mailto:${settings.email_general}`}
                      className="text-accent underline decoration-accent/40 underline-offset-4 transition-colors hover:text-accent-hover"
                    >
                      {settings.email_general}
                    </a>{" "}
                    for å utøve dine rettigheter.
                  </p>
                )}
              </div>

              <div>
                <h2 className="mb-3 text-lg font-bold text-primary">
                  Lagring
                </h2>
                <ul className="list-disc space-y-1.5 pl-5">
                  <li>
                    Personopplysninger lagres så lenge det er nødvendig for
                    formålet
                  </li>
                  <li>Kontakthenvendelser slettes etter 12 måneder</li>
                </ul>
              </div>

              <div>
                <h2 className="mb-3 text-lg font-bold text-primary">
                  Kontakt
                </h2>
                <p>
                  For spørsmål om personvern, kontakt oss på{" "}
                  {settings.email_general && (
                    <a
                      href={`mailto:${settings.email_general}`}
                      className="text-accent underline decoration-accent/40 underline-offset-4 transition-colors hover:text-accent-hover"
                    >
                      {settings.email_general}
                    </a>
                  )}
                  {settings.email_general && settings.phone && " eller ring "}
                  {settings.phone && (
                    <a
                      href={`tel:+47${settings.phone.replace(/\s/g, "")}`}
                      className="text-accent underline decoration-accent/40 underline-offset-4 transition-colors hover:text-accent-hover"
                    >
                      {settings.phone}
                    </a>
                  )}
                  .
                </p>
              </div>
            </div>
          </AnimateOnScroll>
        </div>
      </section>
    </div>
  );
}
