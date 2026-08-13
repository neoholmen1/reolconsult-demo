"use client";

import { useState, useEffect, useRef } from "react";
import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { motion } from "motion/react";
import { useSite } from "@/components/SiteProvider";
import { formatPhoneLink } from "@/lib/site";
import OpenStatusBadge from "@/components/OpenStatusBadge";
import ThemeToggle from "@/components/ThemeToggle";

type SubLink = { href: string; label: string; description?: string };
type NavLink =
  | { href: string; label: string; sublinks?: SubLink[] }
  | { label: string; sublinks: SubLink[]; href: string };

const navLinks: NavLink[] = [
  {
    href: "/produkter",
    label: "Produkter",
    sublinks: [
      { href: "/produkter/lager", label: "Lager", description: "Pallreoler, mesanin, småvarereoler" },
      { href: "/produkter/butikk", label: "Butikk", description: "Disker, gondoler, veggsystemer" },
      { href: "/produkter/kontor", label: "Kontor", description: "Møbler, oppbevaring, skjermvegger" },
      { href: "/produkter/verksted", label: "Verksted", description: "Arbeidsbord, verktøyskap, transport" },
      { href: "/produkter/garderobe", label: "Garderobe", description: "Skap, ladeskap, sittebenker" },
      { href: "/produkter/skole", label: "Skole og barnehage", description: "Innredning for læringsmiljø" },
      { href: "/kataloger", label: "Kataloger", description: "Bla i produktbrosjyrene" },
    ],
  },
  { href: "/referanser", label: "Referanser" },
  { href: "/bruktsalg", label: "Bruktsalg" },
  { href: "/om-oss", label: "Om oss" },
];

export default function Header() {
  const [menuOpen, setMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [hoveredLink, setHoveredLink] = useState<string | null>(null);
  const [openDropdown, setOpenDropdown] = useState<string | null>(null);
  const dropdownTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const pathname = usePathname();
  const { settings } = useSite();

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 50);
    handleScroll();
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  useEffect(() => {
    setMenuOpen(false);
    setOpenDropdown(null);
  }, [pathname]);

  const isActive = (href: string) => pathname === href || pathname.startsWith(href + "/");
  // Forsiden har en fullbleed hero — headeren flyter transparent over den til man scroller.
  // Farger styres av tema (.dark) via dark:-varianter; dette flagget styrer kun transparens.
  const heroTop = pathname === "/" && !scrolled && !menuOpen;

  function openDropdownNow(label: string) {
    if (dropdownTimer.current) clearTimeout(dropdownTimer.current);
    setOpenDropdown(label);
  }

  function closeDropdownDelayed() {
    if (dropdownTimer.current) clearTimeout(dropdownTimer.current);
    dropdownTimer.current = setTimeout(() => setOpenDropdown(null), 120);
  }

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-50 transition duration-300 ${
        scrolled
          ? "bg-surface-warm/80 dark:bg-[#0d0e12]/85 backdrop-blur-xl shadow-[var(--shadow-soft)] border-b border-border/60 dark:border-white/10"
          : heroTop
            ? "bg-surface-warm/95 backdrop-blur-md border-b border-border/60 dark:bg-transparent dark:backdrop-blur-none dark:border-transparent"
            : "bg-surface-warm dark:bg-[#0d0e12] border-b border-transparent"
      }`}
    >
      {/* Slim utility-stripe (desktop) — kollapser ved scroll */}
      <div
        className={`hidden overflow-hidden border-b transition duration-300 md:block ${heroTop ? "border-transparent" : "border-border/60 dark:border-white/10"} ${
          scrolled ? "max-h-0 opacity-0" : "max-h-12 opacity-100"
        }`}
      >
        <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-2 text-[12.5px] text-text-muted sm:px-6 lg:px-8 dark:text-white/70">
          <div className="flex items-center gap-2">
            <span className="font-medium text-text-dark/70 dark:text-white/85">Innredning siden 1984</span>
            {settings.visit_address && (
              <>
                <span className="text-border dark:text-white/30">·</span>
                <span>{settings.visit_address}</span>
              </>
            )}
          </div>
          <div className="flex items-center gap-5">
            <OpenStatusBadge />
            {settings.email_general && (
              <a href={`mailto:${settings.email_general}`} className="hidden transition-colors hover:text-accent lg:inline">
                {settings.email_general}
              </a>
            )}
            {settings.phone && (
              <a href={formatPhoneLink(settings.phone)} className="inline-flex items-center gap-1.5 font-semibold text-text-dark transition-colors hover:text-accent dark:text-white">
                <svg className="h-3.5 w-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 6.75c0 8.284 6.716 15 15 15h2.25a2.25 2.25 0 0 0 2.25-2.25v-1.372c0-.516-.351-.966-.852-1.091l-4.423-1.106c-.44-.11-.902.055-1.173.417l-.97 1.293c-.282.376-.769.542-1.21.38a12.035 12.035 0 0 1-7.143-7.143c-.162-.441.004-.928.38-1.21l1.293-.97c.363-.271.527-.734.417-1.173L6.963 3.102a1.125 1.125 0 0 0-1.091-.852H4.5A2.25 2.25 0 0 0 2.25 4.5v2.25Z" />
                </svg>
                {settings.phone}
              </a>
            )}
            <ThemeToggle />
          </div>
        </div>
      </div>

      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        {/* Desktop: single row — logo venstre, nav midten, CTA høyre */}
        <div className={`hidden md:flex items-center justify-between gap-6 transition duration-300 ${scrolled ? "h-[76px]" : "h-[88px]"}`}>
          {/* Logo venstre */}
          {/* Ordmerket fra den offisielle logoen. To varianter fordi «consult»
              er nesten svart og forsvinner på mørk bakgrunn — den mørke filen
              har den delen i hvitt. Kun ordmerket brukes: originalen er en
              stablet lockup med R-merke og URL, og den blir uleselig i en
              header på 76–88 px. */}
          <Link href="/" className="shrink-0" aria-label="Reol-Consult – til forsiden">
            <Image
              src="/logo-reolconsult.png"
              alt="Reol-Consult"
              width={1415}
              height={236}
              priority
              className="h-8 w-auto dark:hidden"
            />
            <Image
              src="/logo-reolconsult-dark.png"
              alt="Reol-Consult"
              width={1415}
              height={236}
              priority
              className="hidden h-8 w-auto dark:block"
            />
          </Link>

          {/* Nav midten */}
          <nav className="flex items-center gap-1">
            {navLinks.map((link) => {
              const hasDropdown = !!link.sublinks?.length;
              const dropdownOpen = openDropdown === link.label;

              return (
                <div
                  key={link.label}
                  className="relative"
                  onMouseEnter={() => hasDropdown && openDropdownNow(link.label)}
                  onMouseLeave={() => hasDropdown && closeDropdownDelayed()}
                >
                  <Link
                    href={link.href}
                    className={`relative inline-flex items-center gap-1 px-4 py-2.5 text-[13.5px] font-medium transition-colors duration-300 ${
                      isActive(link.href)
                        ? "text-text-dark dark:text-white"
                        : "text-text-dark/70 hover:text-text-dark dark:text-white/75 dark:hover:text-white"
                    }`}
                    onMouseEnter={() => setHoveredLink(link.href)}
                    onMouseLeave={() => setHoveredLink(null)}
                    aria-expanded={hasDropdown ? dropdownOpen : undefined}
                  >
                    <span
                      key={hoveredLink === link.href ? "hover" : "idle"}
                      className={`nav-draw-circle ${
                        hoveredLink === link.href && !isActive(link.href) ? "drawing" : ""
                      }`}
                    />
                    <span className="relative z-10">{link.label}</span>
                    {hasDropdown && (
                      <svg
                        className={`relative z-10 h-3 w-3 transition-transform duration-200 ${dropdownOpen ? "rotate-180" : ""}`}
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                        strokeWidth={2.25}
                      >
                        <path strokeLinecap="round" strokeLinejoin="round" d="m19.5 8.25-7.5 7.5-7.5-7.5" />
                      </svg>
                    )}
                    {isActive(link.href) && (
                      <motion.span
                        layoutId="nav-dot"
                        className="absolute -bottom-1 left-1/2 h-[6px] w-[6px] -translate-x-1/2 rounded-full bg-accent"
                        transition={{ type: "spring", stiffness: 400, damping: 30 }}
                      />
                    )}
                  </Link>

                  {/* Dropdown panel */}
                  {hasDropdown && dropdownOpen && (
                    <div
                      className="absolute left-1/2 top-full z-40 mt-2 w-[420px] -translate-x-1/2 rounded-3xl border border-border bg-surface-warm p-2 shadow-[var(--shadow-float)] ring-1 ring-black/[0.02] dark:border-white/10 dark:bg-[#14161a] dark:ring-white/5"
                      onMouseEnter={() => openDropdownNow(link.label)}
                      onMouseLeave={() => closeDropdownDelayed()}
                    >
                      <div className="grid grid-cols-2 gap-1">
                        {link.sublinks!.map((sub) => (
                          <Link
                            key={sub.href}
                            href={sub.href}
                            className={`group flex flex-col rounded-xl px-3 py-2.5 transition-colors duration-150 hover:bg-bg-light dark:hover:bg-white/5 ${
                              isActive(sub.href) ? "bg-bg-light dark:bg-white/5" : ""
                            }`}
                          >
                            <span className="text-[13px] font-semibold text-primary group-hover:text-accent dark:text-white">
                              {sub.label}
                            </span>
                            {sub.description && (
                              <span className="mt-0.5 text-[11.5px] leading-snug text-text-muted dark:text-white/55">
                                {sub.description}
                              </span>
                            )}
                          </Link>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              );
            })}
          </nav>

          {/* CTA høyre */}
          <Link
            href="/kontakt"
            className="shrink-0 rounded-full bg-accent px-6 py-2.5 text-[13px] font-semibold text-white shadow-[0_1px_2px_rgba(220,38,38,0.15)] transition duration-200 hover:bg-accent-hover hover:shadow-[0_4px_14px_rgba(220,38,38,0.25)] active:translate-y-[1px]"
          >
            Kontakt oss
          </Link>
        </div>

        {/* Mobile: single row */}
        <div className="flex h-[80px] items-center justify-between md:hidden">
          <Link href="/" className="shrink-0" aria-label="Reol-Consult – til forsiden">
            <Image
              src="/logo-reolconsult.png"
              alt="Reol-Consult"
              width={1415}
              height={236}
              priority
              className="h-7 w-auto dark:hidden"
            />
            <Image
              src="/logo-reolconsult-dark.png"
              alt="Reol-Consult"
              width={1415}
              height={236}
              priority
              className="hidden h-7 w-auto dark:block"
            />
          </Link>
          <div className="flex items-center gap-2">
            <ThemeToggle />
            <Link
              href="/kontakt"
              className="rounded-full bg-accent px-4 py-2.5 text-sm font-semibold text-white transition duration-200 hover:bg-accent-hover active:translate-y-[1px]"
            >
              Kontakt
            </Link>
            <button
              onClick={() => setMenuOpen(!menuOpen)}
              className="flex h-11 w-11 items-center justify-center rounded-xl text-text-dark transition-colors hover:bg-black/5 dark:text-white dark:hover:bg-white/10"
              aria-label="Meny"
              aria-expanded={menuOpen}
            >
              <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.75}>
                {menuOpen ? (
                  <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                ) : (
                  <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 6.75h16.5M3.75 12h16.5M3.75 17.25h16.5" />
                )}
              </svg>
            </button>
          </div>
        </div>
      </div>

      {/* Mobile fullscreen overlay */}
      {menuOpen && (
        <div className="fixed inset-0 top-[80px] z-40 overflow-y-auto bg-surface-warm md:hidden dark:bg-[#0d0e12]">
          <nav className="flex flex-col gap-1 px-6 py-6">
            {navLinks.map((link) => (
              <div key={link.label}>
                <Link
                  href={link.href}
                  className={`flex w-full items-center justify-center rounded-2xl py-4 text-lg font-semibold transition-colors ${
                    isActive(link.href)
                      ? "text-accent bg-accent/5"
                      : "text-text-dark hover:bg-black/[0.03] hover:text-accent dark:text-white dark:hover:bg-white/5"
                  }`}
                >
                  {link.label}
                </Link>
                {link.sublinks?.length ? (
                  <div className="ml-3 mt-1 mb-2 flex flex-col gap-0.5 border-l border-border pl-3 dark:border-white/10">
                    {link.sublinks.map((sub) => (
                      <Link
                        key={sub.href}
                        href={sub.href}
                        className={`rounded-lg px-3 py-2 text-sm transition-colors ${
                          isActive(sub.href)
                            ? "text-accent"
                            : "text-text-muted hover:bg-black/[0.03] hover:text-text-dark dark:text-white/65 dark:hover:bg-white/5 dark:hover:text-white"
                        }`}
                      >
                        {sub.label}
                      </Link>
                    ))}
                  </div>
                ) : null}
              </div>
            ))}
            <Link
              href="/kontakt"
              className="mt-4 w-full rounded-full bg-accent py-4 text-center text-base font-semibold text-white hover:bg-accent-hover transition duration-300"
            >
              Kontakt oss
            </Link>
          </nav>
        </div>
      )}
    </header>
  );
}
