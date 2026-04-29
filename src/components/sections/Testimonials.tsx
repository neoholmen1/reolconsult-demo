import AnimateOnScroll from "@/components/AnimateOnScroll";
import { getCurrentSite } from "@/lib/site";
import { getTestimonials } from "@/lib/cms";

export default async function Testimonials() {
  const site = await getCurrentSite();
  const items = site ? await getTestimonials(site.id) : [];

  // Skjul hele seksjonen hvis det ikke finnes testimonials.
  if (items.length === 0) return null;

  return (
    <section className="bg-white pt-10 pb-12 sm:pt-12 sm:pb-14">
      <div className="mx-auto max-w-6xl px-4 sm:px-6">
        <AnimateOnScroll className="text-center">
          <p className="text-xs font-semibold uppercase tracking-[0.2em] text-accent">
            Sagt om oss
          </p>
          <h2 className="mt-4 text-3xl font-bold tracking-tight text-primary sm:text-4xl md:text-5xl">
            Hva kundene sier
          </h2>
        </AnimateOnScroll>

        <div className="mt-12 grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {items.map((t, i) => (
            <AnimateOnScroll key={t.id} delay={i * 0.08}>
              <figure className="flex h-full flex-col rounded-2xl border border-border bg-white p-6 shadow-[0_2px_12px_rgba(0,0,0,0.04)] transition-shadow duration-300 hover:shadow-[0_12px_40px_rgba(0,0,0,0.08)]">
                <svg
                  className="h-6 w-6 text-accent/40"
                  fill="currentColor"
                  viewBox="0 0 24 24"
                  aria-hidden="true"
                >
                  <path d="M9.5 4.5C7 4.5 5 6.5 5 9c0 2 1.5 3.5 3.5 3.5.5 0 1-.1 1.4-.2-.1.7-.4 1.5-.9 2.2-.7 1-1.7 1.6-2.5 1.9l.6 1.1c1.5-.4 3-1.4 4.1-2.8 1-1.4 1.5-3 1.5-4.7 0-2.5-1.5-4.5-4-4.5zm9 0c-2.5 0-4.5 2-4.5 4.5 0 2 1.5 3.5 3.5 3.5.5 0 1-.1 1.4-.2-.1.7-.4 1.5-.9 2.2-.7 1-1.7 1.6-2.5 1.9l.6 1.1c1.5-.4 3-1.4 4.1-2.8 1-1.4 1.5-3 1.5-4.7 0-2.5-1.5-4.5-4-4.5z" />
                </svg>
                <blockquote className="mt-3 flex-1 text-base leading-relaxed text-text-dark">
                  «{t.quote}»
                </blockquote>
                <figcaption className="mt-5 border-t border-border pt-4">
                  <p className="text-sm font-semibold text-primary">{t.author_name}</p>
                  {(t.author_role || t.author_company) && (
                    <p className="mt-0.5 text-xs text-text-muted">
                      {[t.author_role, t.author_company].filter(Boolean).join(" · ")}
                    </p>
                  )}
                </figcaption>
              </figure>
            </AnimateOnScroll>
          ))}
        </div>
      </div>
    </section>
  );
}
