import type { MetadataRoute } from "next";

const BASE_URL = "https://reolconsult.no";

export default function sitemap(): MetadataRoute.Sitemap {
  const lastModified = new Date();

  const routes = [
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
    "/personvern",
  ];

  return routes.map((path) => ({
    url: `${BASE_URL}${path}`,
    lastModified,
    changeFrequency: path === "" ? "monthly" : "yearly",
    priority: path === "" ? 1 : path.startsWith("/produkter") ? 0.8 : 0.6,
  }));
}
