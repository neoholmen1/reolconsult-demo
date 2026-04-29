import { getCurrentSite, getSiteSettingsOrFallback } from "@/lib/site";
import { getPageSections, getSectionField, getTeamMembers } from "@/lib/cms";
import KontaktContent, { type KontaktAnsatt } from "./kontakt-content";

const FALLBACK_ANSATTE: KontaktAnsatt[] = [
  { name: "Agnete H. Bechmann", role: "Salg & rådgivning", phone: "450 07 322", email: "agh@reolconsult.no" },
  { name: "Tore Aas-Kristiansen", role: "Salg & rådgivning", phone: "982 04 323", email: "tk@reolconsult.no" },
];

export default async function KontaktPage() {
  const site = await getCurrentSite();
  const [sections, teamFromDb, settings] = await Promise.all([
    site ? getPageSections(site.id, "kontakt") : Promise.resolve([]),
    site ? getTeamMembers(site.id) : Promise.resolve([]),
    getSiteSettingsOrFallback(site?.id ?? null),
  ]);

  // Bygg ansatte-liste: team_members fra DB (eller fallback) + Sentralbord fra site_settings
  const teamCards: KontaktAnsatt[] =
    teamFromDb.length > 0
      ? teamFromDb.map((m) => ({ name: m.name, role: m.role, phone: m.phone, email: m.email }))
      : FALLBACK_ANSATTE;

  const ansatte: KontaktAnsatt[] = [
    ...teamCards,
    {
      name: "Sentralbord",
      role: "Generelle henvendelser",
      phone: settings.phone ?? "33 36 55 80",
      email: settings.email_general ?? "mail@reolconsult.no",
    },
  ];

  const introEyebrow = getSectionField(sections, "intro", "eyebrow", "Kontakt");
  const introTitle = getSectionField(sections, "intro", "title", "Ta kontakt med oss");
  const introBody = getSectionField(
    sections,
    "intro",
    "body",
    "Har du spørsmål, trenger et tilbud, eller ønsker å besøke vårt showroom? Fyll ut skjemaet eller ta kontakt direkte med en av våre ansatte.",
  );
  const formTitle = getSectionField(sections, "form", "title", "Send oss en melding");
  const formHelp = getSectionField(
    sections,
    "form",
    "help",
    "Når du trykker «Send melding» åpnes e-postklienten din med meldingen ferdig utfylt. Vi svarer som regel innen én virkedag.",
  );

  return (
    <KontaktContent
      ansatte={ansatte}
      introEyebrow={introEyebrow}
      introTitle={introTitle}
      introBody={introBody}
      formTitle={formTitle}
      formHelp={formHelp}
    />
  );
}
