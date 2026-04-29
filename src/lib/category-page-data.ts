import type { CategoryProduct } from "@/components/CategoryPageContent";
import { getCurrentSite } from "@/lib/site";
import {
  getPage,
  getPageSections,
  getProductsByCategory,
  getSectionField,
} from "@/lib/cms";

/**
 * Henter sammenstilt data for en produktkategori-side. Kaller server-side fra
 * page.tsx for hver underside (lager, butikk osv.).
 *
 * Strategien er at hardkodet `fallback` brukes når DB ikke har innhold ennå.
 * Den dagen kunden har lagt inn produkter via admin, leverer DB-en alt.
 */
export async function getCategoryPageData(
  slug: string,
  fallback: {
    heroTitle: string;
    heroSubtitle: string;
    heroImage: string;
    breadcrumbLabel: string;
    ctaTitle: string;
    ctaBody: string;
    products: CategoryProduct[];
  },
) {
  const site = await getCurrentSite();
  const [page, sections, productsFromDb] = await Promise.all([
    site ? getPage(site.id, slug) : Promise.resolve(null),
    site ? getPageSections(site.id, slug) : Promise.resolve([]),
    site ? getProductsByCategory(site.id, slug) : Promise.resolve([]),
  ]);

  const heroTitle = page?.hero_title || fallback.heroTitle;
  const heroSubtitle = page?.hero_subtitle || fallback.heroSubtitle;
  const heroImage = page?.hero_image_url || fallback.heroImage;

  const ctaTitle = getSectionField(sections, "cta_final", "title", fallback.ctaTitle);
  const ctaBody = getSectionField(sections, "cta_final", "body", fallback.ctaBody);

  const products: CategoryProduct[] =
    productsFromDb.length > 0
      ? productsFromDb.map((p) => ({
          id: p.id,
          title: p.title,
          shortDesc: p.short_description,
          image: p.hero_image_url ?? undefined,
          modal: {
            title: p.title,
            description: p.long_description || p.short_description,
            images: p.gallery_images.map((g) => g.url),
            specs: p.specs,
          },
        }))
      : fallback.products;

  return {
    hero: { title: heroTitle, subtitle: heroSubtitle, image: heroImage },
    breadcrumbLabel: fallback.breadcrumbLabel,
    products,
    cta: { title: ctaTitle, body: ctaBody },
  };
}
