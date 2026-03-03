import Hero from "@/components/sections/Hero";
import ProductCategories from "@/components/sections/ProductCategories";
import TrustNumbers from "@/components/sections/TrustNumbers";
import References from "@/components/sections/References";
import AboutTeaser from "@/components/sections/AboutTeaser";
import UsedSalesTeaser from "@/components/sections/UsedSalesTeaser";
import CTASection from "@/components/sections/CTASection";

export default function Forside() {
  return (
    <>
      <Hero />
      <ProductCategories />
      <TrustNumbers />
      <References />
      <AboutTeaser />
      <UsedSalesTeaser />
      <CTASection />
    </>
  );
}
