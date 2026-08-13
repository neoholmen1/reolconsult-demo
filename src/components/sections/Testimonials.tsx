import AnimateOnScroll from "@/components/AnimateOnScroll";
import TiltCard from "@/components/motion/TiltCard";
import { getCurrentSite } from "@/lib/site";
import { getTestimonials } from "@/lib/cms";

export default async function Testimonials() {
  const site = await getCurrentSite();
  const items = site ? await getTestimonials(site.id) : [];

  // Skjul hele seksjonen hvis det ikke finnes testimonials.
  if (items.length === 0) return null;

  return (
    <section className="bg-surface dark:bg-[#0b0c0f]/55 dark:backdrop-blur-md py-20 md:py-28">
      <div className="mx-auto max-w-6xl px-4 sm:px-6">
        <AnimateOnScroll className="text-center">
          <p className="inline-flex items-center gap-2.5 text-xs font-semibold uppercase tracking-[0.22em] text-accent">
            <span className="h-px w-7 bg-accent/50" />
            Sagt om oss
            <span className="h-px w-7 bg-accent/50" />
          </p>
          <h2 className="font-display mt-4 text-[2rem] font-semibold tracking-[-0.02em] text-primary dark:text-white md:text-5xl">
            Hva kundene sier
          </h2>
        </AnimateOnScroll>

        <div className="mt-12 grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {items.map((t, i) => (
            <AnimateOnScroll key={t.id} delay={i * 0.08}>
              <TiltCard className="h-full rounded-3xl" intensity={6} glare={false}>
              <figure className="flex h-full flex-col rounded-3xl bg-surface border border-border shadow-[var(--shadow-soft)] dark:bg-white/[0.05] dark:border-white/10 dark:backdrop-blur-xl dark:shadow-[inset_0_1px_0_rgba(255,255,255,0.16),0_20px_50px_-20px_rgba(0,0,0,0.65)] p-7 transition duration-300 hover:shadow-[var(--shadow-lift)] dark:hover:bg-white/[0.08]">
                <svg
                  className="h-6 w-6 text-accent/40"
                  fill="currentColor"
                  viewBox="0 0 24 24"
                  aria-hidden="true"
                >
                  <path d="M9.5 4.5C7 4.5 5 6.5 5 9c0 2 1.5 3.5 3.5 3.5.5 0 1-.1 1.4-.2-.1.7-.4 1.5-.9 2.2-.7 1-1.7 1.6-2.5 1.9l.6 1.1c1.5-.4 3-1.4 4.1-2.8 1-1.4 1.5-3 1.5-4.7 0-2.5-1.5-4.5-4-4.5zm9 0c-2.5 0-4.5 2-4.5 4.5 0 2 1.5 3.5 3.5 3.5.5 0 1-.1 1.4-.2-.1.7-.4 1.5-.9 2.2-.7 1-1.7 1.6-2.5 1.9l.6 1.1c1.5-.4 3-1.4 4.1-2.8 1-1.4 1.5-3 1.5-4.7 0-2.5-1.5-4.5-4-4.5z" />
                </svg>
                <blockquote className="font-display mt-3 flex-1 text-[1.2rem] italic leading-relaxed text-text-dark dark:text-white">
                  «{t.quote}»
                </blockquote>
                <figcaption className="mt-5 border-t border-border dark:border-white/10 pt-4">
                  <p className="text-sm font-semibold text-primary dark:text-white">{t.author_name}</p>
                  {(t.author_role || t.author_company) && (
                    <p className="mt-0.5 text-xs text-text-muted dark:text-white/55">
                      {[t.author_role, t.author_company].filter(Boolean).join(" · ")}
                    </p>
                  )}
                </figcaption>
              </figure>
              </TiltCard>
            </AnimateOnScroll>
          ))}
        </div>
      </div>
    </section>
  );
}
