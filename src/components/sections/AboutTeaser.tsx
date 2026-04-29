import Link from "next/link";
import Image from "next/image";
import AnimateOnScroll from "@/components/AnimateOnScroll";
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

const FALLBACK_IMAGE = "https://reolconsult.no/wp-content/uploads/2022/11/Mesanin-6-scaled.jpeg";

export default async function AboutTeaser() {
  const site = await getCurrentSite();
  const [sections, teamFromDb] = await Promise.all([
    site ? getPageSections(site.id, "home") : Promise.resolve([]),
    site ? getTeamMembers(site.id) : Promise.resolve([]),
  ]);

  const eyebrow = getSectionField(sections, "about_teaser", "eyebrow", "Snakk direkte med oss");
  const title = getSectionField(sections, "about_teaser", "title", "Ring Agnete eller Tore");
  const body = getSectionField(
    sections,
    "about_teaser",
    "body",
    "Vi gir uforpliktende tilbud, befaring og rådgivning. Reol-Consult har holdt til på Vear siden 1984.",
  );
  const imageUrl = getSectionField(sections, "about_teaser", "image_url", FALLBACK_IMAGE);

  const team = (teamFromDb.length > 0 ? teamFromDb : FALLBACK_TEAM).slice(0, 2);

  return (
    <section className="bg-white pt-10 pb-10 sm:pt-12 sm:pb-12">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 items-center gap-10 sm:gap-12 lg:gap-12 lg:grid-cols-2">
          <AnimateOnScroll variant="scaleIn">
            <div className="relative aspect-[4/3] overflow-hidden rounded-2xl">
              <Image
                src={imageUrl}
                alt="Reol-Consult"
                fill
                sizes="(max-width: 1024px) 100vw, 50vw"
                className="object-cover"
                unoptimized
              />
            </div>
          </AnimateOnScroll>

          <AnimateOnScroll delay={0.15}>
            <p className="text-xs font-semibold uppercase tracking-[0.2em] text-accent">
              {eyebrow}
            </p>
            <h2 className="mt-4 text-3xl font-bold tracking-tight text-primary sm:text-4xl md:text-5xl" style={{ lineHeight: 1.1 }}>
              {title}
            </h2>
            <p className="mt-6 text-lg leading-relaxed text-text-muted whitespace-pre-line">
              {body}
            </p>

            <div className="mt-8 grid grid-cols-1 gap-3 sm:grid-cols-2">
              {team.map((member) => (
                <a
                  key={member.id}
                  href={`tel:+47${member.phone.replace(/\s/g, "")}`}
                  className="group flex items-center gap-4 rounded-2xl border border-border bg-bg-light p-5 transition-all duration-200 hover:border-accent/30 hover:bg-white hover:shadow-[0_8px_24px_rgba(0,0,0,0.06)]"
                >
                  <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-accent/10 text-accent transition-colors group-hover:bg-accent group-hover:text-white">
                    {member.photo_url ? (
                      <Image src={member.photo_url} alt={member.name} width={44} height={44} className="h-full w-full rounded-full object-cover" unoptimized />
                    ) : (
                      <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 6.75c0 8.284 6.716 15 15 15h2.25a2.25 2.25 0 0 0 2.25-2.25v-1.372c0-.516-.351-.966-.852-1.091l-4.423-1.106c-.44-.11-.902.055-1.173.417l-.97 1.293c-.282.376-.769.542-1.21.38a12.035 12.035 0 0 1-7.143-7.143c-.162-.441.004-.928.38-1.21l1.293-.97c.363-.271.527-.734.417-1.173L6.963 3.102a1.125 1.125 0 0 0-1.091-.852H4.5A2.25 2.25 0 0 0 2.25 4.5v2.25Z" />
                      </svg>
                    )}
                  </div>
                  <div>
                    <p className="text-sm font-semibold text-primary">{member.name}</p>
                    {member.role && <p className="text-xs text-text-muted">{member.role}</p>}
                    {member.phone && <p className="mt-0.5 text-sm font-medium text-accent">{member.phone}</p>}
                    {member.email && <p className="text-xs text-text-muted">{member.email}</p>}
                  </div>
                </a>
              ))}
            </div>

            <Link
              href="/om-oss"
              className="group mt-8 inline-flex items-center gap-2 text-base font-semibold text-primary transition-all duration-200 hover:gap-3"
            >
              Les mer om oss
              <svg className="h-4 w-4 transition-transform duration-300 group-hover:translate-x-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 4.5L21 12m0 0l-7.5 7.5M21 12H3" />
              </svg>
            </Link>
          </AnimateOnScroll>
        </div>
      </div>
    </section>
  );
}
