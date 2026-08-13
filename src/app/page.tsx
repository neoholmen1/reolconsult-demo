import Hero from "@/components/sections/Hero";
import ProductCategories from "@/components/sections/ProductCategories";
import ProcessSection from "@/components/sections/ProcessSection";
import References from "@/components/sections/References";
import ReolkontrollSection from "@/components/sections/ReolkontrollSection";
import Testimonials from "@/components/sections/Testimonials";
import AboutTeaser from "@/components/sections/AboutTeaser";
import UsedSalesTeaser from "@/components/sections/UsedSalesTeaser";
import CTASection from "@/components/sections/CTASection";
import { getCurrentSite } from "@/lib/site";
import { getPage } from "@/lib/cms";

export default async function Forside() {
  const site = await getCurrentSite();
  const page = site ? await getPage(site.id, "home") : null;

  const heroData = {
    eyebrow: page?.hero_eyebrow ?? null,
    title: page?.hero_title ?? null,
    subtitle: page?.hero_subtitle ?? null,
    primaryLabel: page?.hero_cta_primary_label ?? null,
    primaryHref: page?.hero_cta_primary_href ?? null,
    secondaryLabel: page?.hero_cta_secondary_label ?? null,
    secondaryHref: page?.hero_cta_secondary_href ?? null,
  };

  return (
    <>
      <Hero heroData={heroData} />
      <ProductCategories />
      <ProcessSection />
      <References />
      <ReolkontrollSection />
      <Testimonials />
      <AboutTeaser />
      <UsedSalesTeaser />
      <CTASection />
    </>
  );
}
