import Link from "next/link";
import Image from "next/image";
import AnimateOnScroll from "@/components/AnimateOnScroll";
import TiltCard from "@/components/motion/TiltCard";
import { getCurrentSite } from "@/lib/site";
import {
  getPageSections,
  getSectionField,
  getTeamMembers,
  type TeamMember,
} from "@/lib/cms";

const FALLBACK_TEAM: TeamMember[] = [
  { id: "1", name: "Agnete H. Bechmann", role: "Salg & rådgivning", phone: "450 07 322", email: "agh@reolconsult.no", photo_url: null, bio: "", sort_order: 0 },
  { id: "2", name: "Tore Aas-Kristiansen", role: "Salg & rådgivning", phone: "982 04 323", email: "tk@reolconsult.no", photo_url: null, bio: "", sort_order: 1 },
];

export default async function AboutTeaser() {
  const site = await getCurrentSite();
  const [sections, teamFromDb] = await Promise.all([
    site ? getPageSections(site.id, "home") : Promise.resolve([]),
    site ? getTeamMembers(site.id) : Promise.resolve([]),
  ]);

  const eyebrow = getSectionField(sections, "about_teaser", "eyebrow", "Snakk direkte med oss");
  const title = getSectionField(sections, "about_teaser", "title", "Ta kontakt");
  const body = getSectionField(
    sections,
    "about_teaser",
    "body",
    "Gratis befaring og uforpliktende tilbud. Reol-Consult har holdt til på Vear siden 1984 og leverer i hele Norge.",
  );

  const team = (teamFromDb.length > 0 ? teamFromDb : FALLBACK_TEAM).slice(0, 2);

  return (
    <section className="bg-bg-light dark:bg-[#0b0c0f]/55 dark:backdrop-blur-md py-20 md:py-28">
      <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8">
        <AnimateOnScroll className="text-center">
          <p className="inline-flex items-center gap-2.5 text-xs font-semibold uppercase tracking-[0.22em] text-accent">
            <span className="h-px w-7 bg-accent/60" />
            {eyebrow}
            <span className="h-px w-7 bg-accent/60" />
          </p>
          <h2 className="font-display mt-4 text-[2rem] font-semibold tracking-[-0.02em] text-primary dark:text-white md:text-5xl" style={{ lineHeight: 1.1 }}>
            {title}
          </h2>
          <p className="mx-auto mt-4 max-w-xl text-base leading-relaxed text-text-muted dark:text-white/65 md:text-lg whitespace-pre-line">
            {body}
          </p>
        </AnimateOnScroll>

        <div className="mt-12 grid grid-cols-1 gap-5 sm:grid-cols-2 md:mt-14">
          {team.map((member, i) => (
            <AnimateOnScroll key={member.id} delay={0.1 + i * 0.08}>
              <TiltCard className="h-full rounded-3xl" intensity={5} glare={false}>
              <div className="group flex h-full flex-col rounded-3xl border border-border bg-surface p-7 shadow-[var(--shadow-soft)] transition duration-200 hover:border-accent/30 hover:shadow-[var(--shadow-lift)] dark:border-white/10 dark:bg-white/[0.05] dark:backdrop-blur-xl dark:shadow-[inset_0_1px_0_rgba(255,255,255,0.16),0_20px_50px_-20px_rgba(0,0,0,0.65)] dark:hover:bg-white/[0.08]">
                <div className="flex items-center gap-5">
                  <div className="flex h-20 w-20 shrink-0 items-center justify-center overflow-hidden rounded-full bg-accent/10 dark:bg-accent/20 text-accent ring-1 ring-accent/20 transition duration-300 group-hover:ring-accent/30">
                    {member.photo_url ? (
                      <Image src={member.photo_url} alt={member.name} width={80} height={80} className="h-full w-full object-cover" />
                    ) : (
                      <span className="text-xl font-semibold">
                        {member.name.split(" ").map((n) => n[0]).slice(0, 2).join("")}
                      </span>
                    )}
                  </div>
                  <div className="min-w-0 flex-1">
                    <p className="text-base font-semibold text-primary dark:text-white">{member.name}</p>
                    {member.role && <p className="mt-0.5 text-sm text-text-muted dark:text-white/65">{member.role}</p>}
                  </div>
                </div>

                {/* Klikk-bar telefon-knapp */}
                {member.phone && (
                  <a
                    href={`tel:+47${member.phone.replace(/\s/g, "")}`}
                    className="mt-5 inline-flex w-full items-center justify-center gap-2 rounded-xl border border-border bg-bg-light text-primary dark:border-white/10 dark:bg-white/10 dark:text-white px-4 py-3 text-sm font-semibold transition duration-200 hover:border-accent/40 hover:bg-accent hover:text-white active:translate-y-[1px]"
                  >
                    <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 6.75c0 8.284 6.716 15 15 15h2.25a2.25 2.25 0 0 0 2.25-2.25v-1.372c0-.516-.351-.966-.852-1.091l-4.423-1.106c-.44-.11-.902.055-1.173.417l-.97 1.293c-.282.376-.769.542-1.21.38a12.035 12.035 0 0 1-7.143-7.143c-.162-.441.004-.928.38-1.21l1.293-.97c.363-.271.527-.734.417-1.173L6.963 3.102a1.125 1.125 0 0 0-1.091-.852H4.5A2.25 2.25 0 0 0 2.25 4.5v2.25Z" />
                    </svg>
                    Ring {member.phone}
                  </a>
                )}
                {member.email && (
                  <a
                    href={`mailto:${member.email}`}
                    className="mt-2 inline-flex w-full items-center justify-center gap-2 rounded-xl px-4 py-2 text-xs font-medium text-text-muted dark:text-white/65 transition-colors duration-200 hover:text-accent"
                  >
                    {member.email}
                  </a>
                )}
              </div>
              </TiltCard>
            </AnimateOnScroll>
          ))}
        </div>

        <AnimateOnScroll className="mt-10 text-center" delay={0.3}>
          <Link
            href="/om-oss"
            className="group inline-flex items-center gap-2 text-sm font-semibold text-primary dark:text-white transition duration-200 hover:gap-3"
          >
            Les mer om oss
            <svg className="h-4 w-4 transition-transform duration-300 group-hover:translate-x-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 4.5L21 12m0 0l-7.5 7.5M21 12H3" />
            </svg>
          </Link>
        </AnimateOnScroll>
      </div>
    </section>
  );
}
