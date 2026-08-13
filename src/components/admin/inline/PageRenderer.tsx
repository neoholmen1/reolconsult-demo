"use client";

import HeroEditable from "./HeroEditable";
import IntroEditable from "./sections/IntroEditable";
import IntroWithImageEditable from "./sections/IntroWithImageEditable";
import HeadingOnlyEditable from "./sections/HeadingOnlyEditable";
import CTAFinalEditable from "./sections/CTAFinalEditable";
import AboutTeaserEditable from "./sections/AboutTeaserEditable";
import UsedSalesTeaserEditable from "./sections/UsedSalesTeaserEditable";
import HvaTrengerDuEditable from "./sections/HvaTrengerDuEditable";
import ReferencesIntroEditable from "./sections/ReferencesIntroEditable";
import KontaktFormEditable from "./sections/KontaktFormEditable";

const SERVICE_HEROES: Record<string, { title: string; subtitle: string; image: string; primary: string; secondary: string }> = {
  lager: {
    title: "Lagerinnredning",
    subtitle: "Pallreoler, stålhyller, mesanin og lagerautomater — fra én seksjon til komplette lagerløsninger.",
    image: "https://reolconsult.no/wp-content/uploads/2022/11/Hekta-Pa-Tur-2-scaled.jpg",
    primary: "Be om tilbud",
    secondary: "Ring oss",
  },
  butikk: {
    title: "Butikkinnredning",
    subtitle: "Gondoler, disker, vegg- og krokpaneler. Vi leverer alt fra dagligvare til konseptbutikk.",
    image: "https://reolconsult.no/wp-content/uploads/2022/11/Dagligvare-Foodora.jpg",
    primary: "Be om tilbud",
    secondary: "Ring oss",
  },
  kontor: {
    title: "Kontor­innredning",
    subtitle: "Skrivebord, stoler, oppbevaring og møterom — funksjonelle løsninger for moderne arbeidsplasser.",
    image: "https://reolconsult.no/wp-content/uploads/2018/08/projectskrivebordv.jpg",
    primary: "Be om tilbud",
    secondary: "Ring oss",
  },
  verksted: {
    title: "Verksted og industri",
    subtitle: "Arbeidsbord, verktøyskap og løfteutstyr for produktive verksteder.",
    image: "https://reolconsult.no/wp-content/uploads/2022/11/Mesanin-6-scaled.jpeg",
    primary: "Be om tilbud",
    secondary: "Ring oss",
  },
  garderobe: {
    title: "Garderobe og ladeskap",
    subtitle: "Garderobeskap, ladeskap og oppbevaring for arbeidsplasser, idrettsanlegg og skoler.",
    image: "https://reolconsult.no/wp-content/uploads/2023/11/IMG_1148-scaled.jpg",
    primary: "Be om tilbud",
    secondary: "Ring oss",
  },
  skole: {
    title: "Skole og barnehage",
    subtitle: "Innredning som tåler dagligbruk og skaper trygge rom for barn i alle aldre.",
    image: "https://reolconsult.no/wp-content/uploads/2023/11/Skole-og-barnehage-1.jpg",
    primary: "Be om tilbud",
    secondary: "Ring oss",
  },
};

export default function PageRenderer({ slug, siteId }: { slug: string; siteId: string }) {
  switch (slug) {
    case "home":
      return (
        <>
          <HeroEditable siteId={siteId} />
          <HvaTrengerDuEditable />
          <AboutTeaserEditable siteId={siteId} />
          <UsedSalesTeaserEditable siteId={siteId} />
          <CTAFinalEditable
            sectionId="cta_final"
            fallback={{
              title: "Trenger du innredning?",
              body: "Ring oss eller fyll ut skjemaet, så lager vi et tilbud tilpasset ditt behov.",
            }}
          />
          <ReferencesIntroEditable />
        </>
      );

    case "om-oss":
      return (
        <>
          <IntroWithImageEditable
            sectionId="intro"
            siteId={siteId}
            fallbackImage="https://reolconsult.no/wp-content/uploads/2022/11/Mesanin-6-scaled.jpeg"
            fallback={{
              eyebrow: "Om oss",
              title: "Reol-Consult AS\nsiden 1984",
              body: "Vi har hjulpet norsk næringsliv med innredning i over 40 år. På Vear har vi 350 kvm utstilling der du kan se og prøve produktene før du bestemmer deg.",
            }}
          />
          <IntroEditable
            sectionId="showroom"
            fallback={{
              eyebrow: "Showroom",
              title: "Besøk utstillingen vår",
              body: "Kom innom på Vear og se produktene i full størrelse. Vi tar imot på dagtid — ring gjerne på forhånd.",
            }}
          />
          <HeadingOnlyEditable
            sectionId="nokkelfakta"
            fallback="Reol-Consult i tall"
            bgClass="bg-bg-light"
          />
          <div className="bg-bg-light pb-12 px-4 sm:px-6 lg:px-8">
            <div className="mx-auto max-w-7xl rounded-xl border border-dashed border-[#d4d4d4] bg-white p-5 text-[12.5px] text-[#737373]">
              Selve fakta-kortene under denne overskriften er hardkodet i designet og endres ikke fra admin.
            </div>
          </div>
        </>
      );

    case "kontakt":
      return (
        <>
          <IntroEditable
            sectionId="intro"
            variant="centered"
            fallback={{
              eyebrow: "Kontakt",
              title: "Si hei til oss",
              body: "Vi svarer raskt på henvendelser. Du kan også ringe oss direkte eller besøke utstillingen på Vear.",
            }}
          />
          <KontaktFormEditable />
        </>
      );

    case "bruktsalg":
      return (
        <>
          <IntroEditable
            sectionId="intro"
            variant="badge"
            eyebrowField="badge"
            fallback={{
              eyebrow: "Spar penger",
              title: "Brukte reoler og innredning\ntil gode priser",
              body: "Vi har jevnlig inn brukte pallreoler, stålhyller, butikkinnredning og kontormøbler — alt kvalitetskontrollert og klart for nytt bruk til en brøkdel av nyprisen.",
            }}
          />
          <HeadingOnlyEditable
            sectionId="fordeler"
            fallback="Hvorfor velge brukt?"
            bgClass="bg-bg-light"
          />
          <div className="bg-bg-light pb-12 px-4 sm:px-6 lg:px-8">
            <div className="mx-auto max-w-7xl rounded-xl border border-dashed border-[#d4d4d4] bg-white p-5 text-[12.5px] text-[#737373]">
              Selve fordels-punktene under denne overskriften er hardkodet i designet og endres ikke fra admin.
            </div>
          </div>
        </>
      );

    case "referanser":
      return (
        <>
          <IntroEditable
            sectionId="intro"
            variant="centered"
            fallback={{
              eyebrow: "Referanser",
              title: "Prosjekter vi har levert",
              body: "Et utvalg av oppdragene våre — fra disk til komplette varehus.",
            }}
          />
          <HeadingOnlyEditable sectionId="cases" fallback="Utvalgte prosjekter" />
          <div className="bg-white pb-6 px-4 sm:px-6 lg:px-8">
            <div className="mx-auto max-w-7xl rounded-xl border border-dashed border-[#d4d4d4] bg-[#fafaf9] p-5 text-[12.5px] text-[#737373]">
              Selve prosjekt-kortene hentes fra <span className="font-medium text-[#171717]">Nettside → Referanser → Prosjekter</span>.
            </div>
          </div>
          <HeadingOnlyEditable sectionId="logos" fallback="Selskaper som bruker oss" bgClass="bg-bg-light" />
          <div className="bg-bg-light pb-12 px-4 sm:px-6 lg:px-8">
            <div className="mx-auto max-w-7xl rounded-xl border border-dashed border-[#d4d4d4] bg-white p-5 text-[12.5px] text-[#737373]">
              Selve logo-grid-en hentes fra <span className="font-medium text-[#171717]">Nettside → Referanser → Logoer</span>.
            </div>
          </div>
          <CTAFinalEditable
            fallback={{
              title: "Klar for et nytt prosjekt?",
              body: "Vi gir uforpliktende tilbud og rådgivning på alle størrelser oppdrag.",
            }}
          />
        </>
      );

    case "kataloger":
      return (
        <>
          <IntroEditable
            sectionId="intro"
            variant="centered"
            fallback={{
              eyebrow: "Kataloger",
              title: "Bla i katalogene våre",
              body: "Last ned PDF-katalogene for produktområdene våre.",
            }}
          />
          <div className="bg-white pb-6 px-4 sm:px-6 lg:px-8">
            <div className="mx-auto max-w-7xl rounded-xl border border-dashed border-[#d4d4d4] bg-[#fafaf9] p-5 text-[12.5px] text-[#737373]">
              Selve katalog-listen er hardkodet i designet og endres ikke fra admin.
            </div>
          </div>
          <CTAFinalEditable
            fallback={{
              title: "Trenger du innredning?",
              body: "Ring oss eller send forespørsel, så lager vi et tilbud tilpasset ditt behov.",
            }}
          />
        </>
      );

    case "produkter":
      return (
        <>
          <IntroEditable
            sectionId="intro"
            variant="centered"
            fallback={{
              eyebrow: "Produkter",
              title: "Alle produktområder",
              body: "Velg kategori for å se utvalget vårt.",
            }}
          />
          <div className="bg-white pb-6 px-4 sm:px-6 lg:px-8">
            <div className="mx-auto max-w-7xl rounded-xl border border-dashed border-[#d4d4d4] bg-[#fafaf9] p-5 text-[12.5px] text-[#737373]">
              Selve kategori-rutenettet hentes fra <span className="font-medium text-[#171717]">Produkter → Rediger kategorier</span>.
            </div>
          </div>
          <CTAFinalEditable
            fallback={{
              title: "Trenger du noe annet?",
              body: "Vi har sortimenter utover det som vises her — ta kontakt så finner vi løsningen.",
            }}
          />
        </>
      );

    case "lager":
    case "butikk":
    case "kontor":
    case "verksted":
    case "garderobe":
    case "skole": {
      const h = SERVICE_HEROES[slug];
      return (
        <>
          <HeroEditable
            siteId={siteId}
            fallbacks={{
              eyebrow: "Reol-Consult",
              title: h.title,
              subtitle: h.subtitle,
              image: h.image,
              primaryLabel: h.primary,
              secondaryLabel: h.secondary,
            }}
          />
          <div className="bg-white pb-6 px-4 sm:px-6 lg:px-8 pt-8">
            <div className="mx-auto max-w-7xl rounded-xl border border-dashed border-[#d4d4d4] bg-[#fafaf9] p-5 text-[12.5px] text-[#737373]">
              Selve produkt-listen for {h.title.toLowerCase()} hentes fra <span className="font-medium text-[#171717]">Produkter</span>-fanen og er ikke editerbar her.
            </div>
          </div>
          <CTAFinalEditable
            fallback={{
              title: "Trenger du tilbud?",
              body: "Ring oss eller fyll ut skjemaet, så lager vi et tilbud tilpasset ditt behov.",
            }}
          />
        </>
      );
    }

    default:
      return (
        <div className="p-12 text-center text-[#737373]">
          Ingen inline-editor er definert for slug «{slug}». Bruk skjema-editoren.
        </div>
      );
  }
}
