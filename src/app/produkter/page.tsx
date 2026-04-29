import { getCurrentSite } from "@/lib/site";
import { getCategories, getPageSections, getSectionField } from "@/lib/cms";
import ProdukterContent, { type CategoryItem } from "./produkter-content";

const FALLBACK_CATEGORIES: CategoryItem[] = [
  { slug: "lager", title: "Lagerinnredning", subtitle: "Pallreoler, stålhyller, mesanin og spesialreoler", image: "https://reolconsult.no/wp-content/uploads/2022/11/Hekta-Pa-Tur-2-scaled.jpg" },
  { slug: "butikk", title: "Butikkinnredning", subtitle: "Gondoler, disker og komplett butikkinnredning", image: "https://reolconsult.no/wp-content/uploads/2022/11/Dagligvare-Foodora.jpg" },
  { slug: "verksted", title: "Verksted & Industri", subtitle: "Arbeidsbord, verktøyskap og verkstedløsninger", image: "https://reolconsult.no/wp-content/uploads/2018/08/arbeidsbord500.jpg" },
  { slug: "kontor", title: "Kontor", subtitle: "Skrivebord, stoler og kontorinnredning", image: "https://reolconsult.no/wp-content/uploads/2018/08/projectskrivebordv.jpg" },
  { slug: "garderobe", title: "Garderobe", subtitle: "Garderobeskap, skoleskap og ladeskap", image: "https://reolconsult.no/wp-content/uploads/2023/11/IMG_1148-scaled.jpg" },
  { slug: "skole", title: "Skole & Barnehage", subtitle: "Pulter, stoler og innredning for alle aldre", image: "https://reolconsult.no/wp-content/uploads/2023/11/Skole-og-barnehage-1.jpg" },
];

export default async function ProdukterPage() {
  const site = await getCurrentSite();
  const [categoriesFromDb, sections] = await Promise.all([
    site ? getCategories(site.id) : Promise.resolve([]),
    site ? getPageSections(site.id, "produkter") : Promise.resolve([]),
  ]);

  const categories: CategoryItem[] =
    categoriesFromDb.length > 0
      ? categoriesFromDb.map((c) => ({
          slug: c.slug,
          title: c.title,
          subtitle: c.description,
          image: c.hero_image_url ?? "",
        }))
      : FALLBACK_CATEGORIES;

  const introTitle = getSectionField(sections, "intro", "title", "Vårt sortiment");
  const introBody = getSectionField(
    sections,
    "intro",
    "body",
    "Vårt produktregister omfatter alt fra mindre detaljinnredninger til hele systemer for store miljøer. Utforsk våre kategorier og kontakt oss for et uforpliktende tilbud.",
  );
  const ctaTitle = getSectionField(sections, "cta_final", "title", "Finner du ikke det du leter etter?");
  const ctaBody = getSectionField(
    sections,
    "cta_final",
    "body",
    "Kontakt oss — vi har et bredt sortiment.",
  );

  return (
    <ProdukterContent
      categories={categories}
      introTitle={introTitle}
      introBody={introBody}
      ctaTitle={ctaTitle}
      ctaBody={ctaBody}
    />
  );
}
