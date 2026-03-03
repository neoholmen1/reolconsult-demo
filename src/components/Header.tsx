"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
/* eslint-disable @next/next/no-img-element */

const navLinks = [
  { href: "/produkter", label: "Produkter" },
  { href: "/kataloger", label: "Kataloger" },
  { href: "/bruktsalg", label: "Bruktsalg" },
  { href: "/referanser", label: "Referanser" },
  { href: "/om-oss", label: "Om oss" },
  { href: "/kontakt", label: "Kontakt" },
];

export default function Header() {
  const [menuOpen, setMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [scrollingDown, setScrollingDown] = useState(false);

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

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-50 bg-white transition-all duration-500 ${
        scrolled
          ? "shadow-[0_1px_3px_rgba(0,0,0,0.08)] border-b border-black/5"
          : ""
      }`}
    >
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        {/* Nav row: centered on top */}
        <div className="hidden md:flex h-14 items-center justify-center gap-8 pt-2">
          {navLinks.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className="group relative px-3 py-1.5 text-[13px] font-medium text-text-dark/70 transition-colors duration-300 hover:text-text-dark"
            >
              {link.label}
              <svg
                className="pointer-events-none absolute inset-0 h-full w-full overflow-visible"
                viewBox="0 0 100 40"
                preserveAspectRatio="none"
                fill="none"
              >
                <rect
                  x="2" y="2" width="96" height="36" rx="18"
                  stroke="#D42027"
                  strokeWidth="2"
                  pathLength="1"
                  strokeDasharray="1"
                  strokeDashoffset="1"
                  className="transition-all duration-500 ease-out group-hover:[stroke-dashoffset:0]"
                />
              </svg>
            </Link>
          ))}
          <Link
            href="/kontakt"
            className="rounded-full bg-accent px-5 py-1.5 text-[13px] font-semibold text-white transition-all duration-300 hover:bg-accent-hover hover:shadow-[0_0_20px_rgba(212,32,39,0.3)]"
          >
            Kontakt oss
          </Link>
        </div>

        {/* Logo row: centered below nav — hides on scroll down */}
        <div
          className={`hidden md:flex items-center justify-center overflow-hidden transition-all duration-300 ease-in-out ${
            scrollingDown ? "max-h-0 opacity-0 pt-0 pb-0" : "max-h-40 opacity-100 pt-3 pb-5"
          }`}
        >
          <Link href="/">
            <img src="/logo.png" alt="Reolconsult" width="223" height="121" className="w-[223px] h-auto" />
          </Link>
        </div>

        {/* Mobile: single row */}
        <div className="flex h-16 items-center justify-between md:hidden">
          <Link href="/">
            <img src="/logo.png" alt="Reolconsult" className="h-8 w-auto" />
          </Link>
          <div className="flex items-center gap-4">
            <a
              href="tel:33365580"
              className="text-sm font-semibold text-primary"
            >
              33 36 55 80
            </a>
            <button
              onClick={() => setMenuOpen(!menuOpen)}
              className="text-text-dark"
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
        <div className="fixed inset-0 top-16 z-40 bg-white/95 backdrop-blur-2xl md:hidden">
          <nav className="flex flex-col items-center justify-center gap-6 pt-20">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                onClick={() => setMenuOpen(false)}
                className="text-2xl font-semibold text-text-dark hover:text-primary transition-colors"
              >
                {link.label}
              </Link>
            ))}
            <Link
              href="/kontakt"
              onClick={() => setMenuOpen(false)}
              className="mt-4 rounded-full bg-accent px-8 py-3 text-base font-semibold text-white hover:bg-accent-hover transition-colors"
            >
              Få tilbud
            </Link>
          </nav>
        </div>
      )}
    </header>
  );
}
