import { DM_Sans } from "next/font/google";
import type { Metadata } from "next";
import AnimateOnScroll from "@/components/AnimateOnScroll";

const dmSans = DM_Sans({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
});

export const metadata: Metadata = {
  title: "Referanser – Reol-Consult AS",
  description:
    "Se noen av kundene som har valgt Reol-Consult for sine innredningsløsninger.",
};

const referanser = [
  {
    name: "Foodora",
    logo: "https://reolconsult.no/wp-content/uploads/2022/11/Foodora.png",
  },
  {
    name: "Cemo Gourmet",
    logo: "https://reolconsult.no/wp-content/uploads/2018/08/cemogourmet_cmyk-380x89-resize.jpg",
  },
  {
    name: "Byggmakker",
    logo: "https://reolconsult.no/wp-content/uploads/2018/08/23226ae2_d07d_451c_abd1_fa5e50fef0f6-380x126-resize.jpg",
  },
  {
    name: "Jula",
    logo: "https://reolconsult.no/wp-content/uploads/2018/08/552fb566_6481_410d_b76c_e37af2eb5884-380x83-resize.png",
  },
  {
    name: "Nille",
    logo: "https://reolconsult.no/wp-content/uploads/2018/08/3ad43556_013c_425e_86c0_f2fd844cde45-358x56-resize.jpg",
  },
  {
    name: "Elkjøp",
    logo: "https://reolconsult.no/wp-content/uploads/2018/08/4dcb4aa1_91b1_4d43_8df3_3d2f998838d2.jpg",
  },
  {
    name: "Coop",
    logo: "https://reolconsult.no/wp-content/uploads/2018/08/93c39b25_6a32_4f9b_98f3_1886fc4dbffe-380x65-resize.jpg",
  },
  {
    name: "Rema 1000",
    logo: "https://reolconsult.no/wp-content/uploads/2018/08/ff3538c2_96c8_4082_9668_40d1f8f952bb-380x41-resize.png",
  },
  {
    name: "Biltema",
    logo: "https://reolconsult.no/wp-content/uploads/2018/08/97ae76fb-60c7-4702-9d28-d4eeced6cd31-380x53-resize.jpg",
  },
  {
    name: "Europris",
    logo: "https://reolconsult.no/wp-content/uploads/2018/08/4598e373_77ac_4336_bfba_85d17a33b1ad-380x80-resize.jpg",
  },
  {
    name: "Normal",
    logo: "https://reolconsult.no/wp-content/uploads/2018/08/0aea0788-8358-4cc5-8041-8ad3e331a2ea-380x163-resize.png",
  },
  {
    name: "Jernia",
    logo: "https://reolconsult.no/wp-content/uploads/2018/08/f39f4f7a_bfdc_492e_9d0c_b57f5cb2847b-380x127-resize.jpg",
  },
];

export default function Referanser() {
  return (
    <div className={dmSans.className}>
      {/* Hero */}
      <section className="bg-[#faf8f6] pt-36 pb-24">
        <div className="mx-auto max-w-6xl px-6">
          <AnimateOnScroll>
            <span className="text-sm font-semibold uppercase tracking-[0.2em] text-accent">
              Referanser
            </span>
            <h1 className="mt-4 text-4xl font-bold leading-tight tracking-tight text-primary md:text-5xl">
              Noen av våre kunder
            </h1>
            <p className="mt-6 max-w-2xl text-lg leading-relaxed text-text-muted">
              Gjennom over 40 år har vi levert innredningsløsninger til et bredt
              spekter av bransjer og bedrifter i hele Norge. Her er et utvalg av
              våre fornøyde kunder.
            </p>
          </AnimateOnScroll>
        </div>
      </section>

      {/* Logo-grid */}
      <section className="bg-white py-24">
        <div className="mx-auto max-w-6xl px-6">
          <div className="grid grid-cols-2 gap-6 sm:grid-cols-3 lg:grid-cols-4">
            {referanser.map((ref, i) => (
              <AnimateOnScroll key={ref.name} delay={i * 0.06}>
                <div className="flex aspect-[3/2] items-center justify-center rounded-2xl border border-black/[0.04] bg-white p-8 transition-all duration-300 hover:-translate-y-0.5 hover:shadow-[0_20px_50px_rgba(0,0,0,0.08)]">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={ref.logo}
                    alt={ref.name}
                    className="max-h-16 max-w-full object-contain opacity-70 transition-opacity duration-300 hover:opacity-100"
                    loading="lazy"
                  />
                </div>
              </AnimateOnScroll>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="bg-[#faf8f6] py-24">
        <div className="mx-auto max-w-3xl px-6 text-center">
          <AnimateOnScroll>
            <h2 className="text-3xl font-bold tracking-tight text-primary md:text-4xl">
              Bli vår neste fornøyde kunde
            </h2>
            <p className="mx-auto mt-4 max-w-lg text-lg text-text-muted">
              Uansett om du trenger innredning til butikk, lager, kontor eller
              verksted — vi finner løsningen for deg.
            </p>
            <div className="mt-8 flex flex-wrap justify-center gap-4">
              <a
                href="/kontakt"
                className="inline-flex items-center gap-2 rounded-full bg-accent px-7 py-3.5 font-semibold text-white transition-all duration-300 hover:bg-accent-hover hover:shadow-[0_8px_30px_rgba(212,32,39,0.25)]"
              >
                Få et uforpliktende tilbud
                <svg
                  className="h-4 w-4"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                  strokeWidth={2.5}
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M13.5 4.5 21 12m0 0-7.5 7.5M21 12H3"
                  />
                </svg>
              </a>
              <a
                href="tel:+4733365580"
                className="inline-flex items-center gap-2 rounded-full border-2 border-primary/20 px-7 py-3.5 font-semibold text-primary transition-all duration-300 hover:border-primary/40 hover:bg-primary/5"
              >
                Ring 33 36 55 80
              </a>
            </div>
          </AnimateOnScroll>
        </div>
      </section>
    </div>
  );
}
