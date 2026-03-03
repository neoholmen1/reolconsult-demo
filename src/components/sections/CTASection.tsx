import Link from "next/link";
import AnimateOnScroll from "@/components/AnimateOnScroll";

export default function CTASection() {
  return (
    <section className="bg-[#faf8f6] py-32 sm:py-40">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <AnimateOnScroll className="text-center">
          <h2 className="text-5xl font-bold tracking-tight text-primary sm:text-6xl lg:text-7xl">
            Trenger du innredning?
          </h2>
          <p className="mx-auto mt-8 max-w-2xl text-lg font-light text-text-muted sm:text-xl">
            Ring oss, så tar vi en prat om hva du trenger. Vi hjelper deg med
            alt fra planlegging til montering.
          </p>
          <div className="mt-12 flex flex-col items-center gap-4 sm:flex-row sm:justify-center">
            <Link
              href="/kontakt"
              className="rounded-full bg-primary px-10 py-4 text-base font-semibold text-white transition-all duration-300 hover:bg-primary-light"
            >
              Kontakt oss
            </Link>
            <a
              href="tel:33365580"
              className="rounded-full border border-primary/20 px-10 py-4 text-base font-semibold text-primary transition-all duration-300 hover:bg-primary hover:text-white"
            >
              Ring 33 36 55 80
            </a>
          </div>
          <p className="mt-10 text-sm text-text-muted">
            Eller besøk utstillingen vår: Smiløkka 7, 3173 Vear
          </p>
        </AnimateOnScroll>
      </div>
    </section>
  );
}
