"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import Image from "next/image";
import { motion } from "motion/react";

const navLinks = [
  { href: "/produkter", label: "Produkter" },
  { href: "/kataloger", label: "Kataloger" },
  { href: "/bruktsalg", label: "Bruktsalg" },
  { href: "/referanser", label: "Referanser" },
  { href: "/om-oss", label: "Om oss" },
];

export default function Header() {
  const [menuOpen, setMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [scrollingDown, setScrollingDown] = useState(false);
  const [hoveredLink, setHoveredLink] = useState<string | null>(null);
  const pathname = usePathname();

  useEffect(() => {
    let lastY = window.scrollY;
    const handleScroll = () => {
      const y = window.scrollY;
      setScrolled(y > 50);
      setScrollingDown(y > lastY && y > 50);
      lastY = y;
    };
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Close mobile menu on route change
  useEffect(() => {
    setMenuOpen(false);
  }, [pathname]);

  const isActive = (href: string) => pathname === href || pathname.startsWith(href + "/");

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ${
        scrolled
          ? "bg-white/80 backdrop-blur-xl shadow-[0_1px_3px_rgba(0,0,0,0.06)] border-b border-border/50"
          : "bg-white"
      }`}
    >
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        {/* Desktop: Nav row centered on top */}
        <div className="hidden md:flex h-14 items-center justify-center gap-1 pt-2">
          {navLinks.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className={`relative px-4 py-2.5 text-[13px] font-medium transition-colors duration-300 ${
                isActive(link.href)
                  ? "text-text-dark"
                  : "text-text-dark/70 hover:text-text-dark"
              }`}
              onMouseEnter={() => setHoveredLink(link.href)}
              onMouseLeave={() => setHoveredLink(null)}
            >
              {/* Hover: animated circle drawing around button */}
              <span
                key={hoveredLink === link.href ? "hover" : "idle"}
                className={`nav-draw-circle ${
                  hoveredLink === link.href && !isActive(link.href) ? "drawing" : ""
                }`}
              />
              <span className="relative z-10">{link.label}</span>
              {/* Active dot */}
              {isActive(link.href) && (
                <motion.span
                  layoutId="nav-dot"
                  className="absolute bottom-0 left-1/2 -translate-x-1/2 h-[6px] w-[6px] rounded-full bg-accent"
                  transition={{ type: "spring", stiffness: 400, damping: 30 }}
                />
              )}
            </Link>
          ))}
          <Link
            href="/kontakt"
            className="ml-4 rounded-full bg-accent px-6 py-2 text-[13px] font-semibold text-white transition-all duration-200 hover:bg-accent-hover hover:shadow-lg active:translate-y-[1px]"
          >
            Kontakt oss
          </Link>
        </div>

        {/* Desktop: Logo row — hides on scroll down */}
        <div
          className={`hidden md:flex items-center justify-center overflow-hidden transition-all duration-300 ease-in-out ${
            scrollingDown ? "max-h-0 opacity-0 pt-0 pb-0" : "max-h-40 opacity-100 pt-1 pb-2"
          }`}
        >
          <Link href="/">
            <Image src="/logo.png" alt="Reol-Consult" width={223} height={121} className="w-[223px] h-auto" priority />
          </Link>
        </div>

        {/* Mobile: single row */}
        <div className="flex h-[80px] items-center justify-between md:hidden">
          <Link href="/" className="shrink-0">
            <Image src="/logo.png" alt="Reol-Consult" width={111} height={60} className="h-[60px] w-auto" priority />
          </Link>
          <div className="flex items-center gap-3">
            <Link
              href="/kontakt"
              className="rounded-full bg-accent px-5 py-3 text-sm font-semibold text-white transition-all duration-200 hover:bg-accent-hover active:translate-y-[1px]"
            >
              Kontakt
            </Link>
            <button
              onClick={() => setMenuOpen(!menuOpen)}
              className="flex h-11 w-11 items-center justify-center rounded-xl text-text-dark transition-colors hover:bg-black/5"
              aria-label="Meny"
            >
              <svg
                className="h-6 w-6"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                strokeWidth={1.5}
              >
                {menuOpen ? (
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M6 18L18 6M6 6l12 12"
                  />
                ) : (
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M3.75 6.75h16.5M3.75 12h16.5M3.75 17.25h16.5"
                  />
                )}
              </svg>
            </button>
          </div>
        </div>
      </div>

      {/* Mobile fullscreen overlay */}
      {menuOpen && (
        <div className="fixed inset-0 top-[80px] z-40 bg-white md:hidden">
          <nav className="flex flex-col gap-1 px-6 pt-8">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className={`flex w-full items-center justify-center rounded-2xl py-4 text-lg font-semibold transition-colors ${
                  isActive(link.href)
                    ? "text-accent bg-accent/5"
                    : "text-text-dark hover:bg-black/[0.03] hover:text-accent"
                }`}
              >
                {link.label}
              </Link>
            ))}
            <Link
              href="/kontakt"
              className="mt-4 w-full rounded-full bg-accent py-4 text-center text-base font-semibold text-white hover:bg-accent-hover transition-all duration-300"
            >
              Kontakt oss
            </Link>
          </nav>
        </div>
      )}
    </header>
  );
}
