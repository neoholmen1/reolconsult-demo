import type { MetadataRoute } from "next";
import { supabase } from "@/lib/supabase";

const BASE_URL = "https://reolconsult.no";

const STATISKE = [
  "",
  "/produkter",
  "/produkter/lager",
  "/produkter/butikk",
  "/produkter/kontor",
  "/produkter/verksted",
  "/produkter/garderobe",
  "/produkter/skole",
  "/kataloger",
  "/bruktsalg",
  "/referanser",
  "/om-oss",
  "/kontakt",
  "/blogg",
  "/personvern",
];

/**
 * Blogginnlegg hentes fra basen slik at nye innlegg havner i sitemap uten at
 * noen må huske å oppdatere lista. Feiler spørringen, faller vi tilbake til de
 * statiske rutene — en sitemap uten blogg er bedre enn et bygg som stopper.
 */
export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const na = new Date();

  const statiske = STATISKE.map((path) => ({
    url: `${BASE_URL}${path}`,
    lastModified: na,
    changeFrequency: (path === "" ? "monthly" : "yearly") as "monthly" | "yearly",
    priority: path === "" ? 1 : path.startsWith("/produkter") ? 0.8 : 0.6,
  }));

  let innlegg: MetadataRoute.Sitemap = [];
  try {
    const { data } = await supabase
      .from("blog_posts")
      .select("slug, updated_at, published")
      .eq("published", true)
      .order("updated_at", { ascending: false });
    innlegg = (data ?? []).map((p) => ({
      url: `${BASE_URL}/blogg/${p.slug}`,
      lastModified: p.updated_at ? new Date(p.updated_at) : na,
      changeFrequency: "yearly" as const,
      priority: 0.5,
    }));
  } catch {
    // Stille fallback — se kommentaren over.
  }

  return [...statiske, ...innlegg];
}
