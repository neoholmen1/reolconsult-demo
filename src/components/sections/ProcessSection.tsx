import AnimateOnScroll from "@/components/AnimateOnScroll";
import TiltCard from "@/components/motion/TiltCard";

const steps = [
  {
    n: "01",
    title: "Befaring",
    body: "Vi kommer ut, måler opp og kartlegger behovet ditt på stedet — uforpliktende.",
    icon: "M15 10.5a3 3 0 1 1-6 0 3 3 0 0 1 6 0Z M19.5 10.5c0 7.142-7.5 11.25-7.5 11.25S4.5 17.642 4.5 10.5a7.5 7.5 0 1 1 15 0Z",
  },
  {
    n: "02",
    title: "Tegning & tilbud",
    body: "Vi prosjekterer løsningen, tegner den ut og gir deg et tydelig, tilpasset tilbud.",
    icon: "M9 17.25v1.007a3 3 0 0 1-.879 2.122L7.5 21h9l-.621-.621A3 3 0 0 1 15 18.257V17.25m6-12V15a2.25 2.25 0 0 1-2.25 2.25H5.25A2.25 2.25 0 0 1 3 15V5.25m18 0A2.25 2.25 0 0 0 18.75 3H5.25A2.25 2.25 0 0 0 3 5.25m18 0V12a2.25 2.25 0 0 1-2.25 2.25H5.25A2.25 2.25 0 0 1 3 12V5.25",
  },
  {
    n: "03",
    title: "Levering",
    body: "Vi leverer produktene i hele Norge, med fast logistikk og avtalt tidspunkt.",
    icon: "M8.25 18.75a1.5 1.5 0 0 1-3 0m3 0a1.5 1.5 0 0 0-3 0m3 0h6m-9 0H3.375a1.125 1.125 0 0 1-1.125-1.125V14.25m17.25 4.5a1.5 1.5 0 0 1-3 0m3 0a1.5 1.5 0 0 0-3 0m3 0h1.125c.621 0 1.129-.504 1.09-1.124a17.902 17.902 0 0 0-3.213-9.193 2.056 2.056 0 0 0-1.58-.86H14.25M16.5 18.75h-6.375m-9-3v-4.5m0 0V6.375c0-.621.504-1.125 1.125-1.125h9.75c.621 0 1.125.504 1.125 1.125v9.375m-12 0h12m0 0V8.25",
  },
  {
    n: "04",
    title: "Montering",
    body: "Vårt team monterer ferdig på plass, så alt står klart til bruk fra dag én.",
    icon: "M11.42 15.17 17.25 21A2.652 2.652 0 0 0 21 17.25l-5.877-5.877M11.42 15.17l2.496-3.03c.317-.384.74-.626 1.208-.766M11.42 15.17l-4.655 5.653a2.548 2.548 0 1 1-3.586-3.586l6.837-5.63m5.108-.233c.55-.164 1.163-.188 1.743-.14a4.5 4.5 0 0 0 4.486-6.336l-3.276 3.277a3.004 3.004 0 0 1-2.25-2.25l3.276-3.276a4.5 4.5 0 0 0-6.336 4.486c.091 1.076-.071 2.264-.904 2.95l-.102.085m-1.745 1.437L5.909 7.5H4.5L2.25 3.75l1.5-1.5L7.5 4.5v1.409l4.26 4.26",
  },
];

export default function ProcessSection() {
  return (
    <section className="bg-bg-light dark:bg-[#0b0c0f]/55 dark:backdrop-blur-md py-20 md:py-28">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <AnimateOnScroll className="max-w-2xl">
          <p className="inline-flex items-center gap-2.5 text-xs font-semibold uppercase tracking-[0.22em] text-accent">
            <span className="h-px w-7 bg-accent/60" />
            Slik jobber vi
          </p>
          <h2 className="font-display mt-4 text-[2.25rem] font-semibold tracking-[-0.02em] text-primary dark:text-white md:text-[3.25rem]" style={{ lineHeight: 1.04 }}>
            Fra første tegning til ferdig montert
          </h2>
          <p className="mt-4 text-base leading-relaxed text-text-muted dark:text-white/65 md:text-lg">
            Én leverandør gjennom hele prosjektet. Du slipper å koordinere flere ledd — vi tar ansvar fra start til ferdig løsning.
          </p>
        </AnimateOnScroll>

        <div className="mt-12 grid grid-cols-1 gap-5 sm:mt-16 sm:grid-cols-2 lg:grid-cols-4">
          {steps.map((step, i) => (
            <AnimateOnScroll key={step.n} delay={i * 0.08}>
              <TiltCard className="h-full rounded-3xl" intensity={6} glare={false}>
              <div className="group relative flex h-full flex-col rounded-3xl bg-surface border border-border p-7 shadow-[var(--shadow-soft)] dark:bg-white/[0.05] dark:border-white/10 dark:backdrop-blur-xl dark:shadow-[inset_0_1px_0_rgba(255,255,255,0.16),0_20px_50px_-20px_rgba(0,0,0,0.65)] transition duration-300 hover:shadow-[var(--shadow-lift)] dark:hover:bg-white/[0.08]">
                <div className="flex items-center justify-between">
                  <span className="flex h-12 w-12 items-center justify-center rounded-2xl bg-accent/10 text-accent border border-border dark:bg-accent/20 dark:border-white/10 transition-colors duration-300 group-hover:bg-accent group-hover:text-white">
                    <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.6}>
                      <path strokeLinecap="round" strokeLinejoin="round" d={step.icon} />
                    </svg>
                  </span>
                  <span className="font-display text-3xl font-semibold text-primary/15 dark:text-white/15">{step.n}</span>
                </div>
                <h3 className="mt-6 text-lg font-semibold text-primary dark:text-white">{step.title}</h3>
                <p className="mt-2 text-sm leading-relaxed text-text-muted dark:text-white/65">{step.body}</p>
              </div>
              </TiltCard>
            </AnimateOnScroll>
          ))}
        </div>
      </div>
    </section>
  );
}
