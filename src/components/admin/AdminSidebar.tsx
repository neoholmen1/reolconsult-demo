"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  LayoutTemplate,
  Package,
  PenLine,
  Settings,
  LogOut,
  ExternalLink,
  Sparkles,
  type LucideIcon,
} from "lucide-react";
import { supabase } from "@/lib/supabase";

type Item = { href: string; label: string; icon: LucideIcon };

const ITEMS: Item[] = [
  { href: "/admin/nettside", label: "Nettside", icon: LayoutTemplate },
  { href: "/admin/produkter", label: "Produkter", icon: Package },
  { href: "/admin/blogg", label: "Blogg", icon: PenLine },
  { href: "/admin/chatbot-info", label: "AI-assistent", icon: Sparkles },
  { href: "/admin", label: "Innstillinger", icon: Settings },
];

export default function AdminSidebar({ userEmail }: { userEmail: string | null }) {
  const pathname = usePathname();

  function isActive(href: string) {
    if (href === "/admin") return pathname === "/admin";
    return pathname === href || pathname.startsWith(href + "/");
  }

  const initial = (userEmail ?? "?").charAt(0).toUpperCase();

  return (
    <aside className="relative flex w-[260px] shrink-0 flex-col border-r border-[#ececec] bg-gradient-to-b from-white to-[#fafaf9]">
      {/* Workspace block */}
      <div className="border-b border-[#ececec] px-4 py-4">
        <div className="flex items-center gap-2.5">
          <div className="relative flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-gradient-to-br from-[#dc2626] to-[#7f1d1d] text-[15px] font-bold tracking-tight text-white shadow-[0_2px_8px_-2px_rgba(220,38,38,0.4),inset_0_1px_0_rgba(255,255,255,0.2)]">
            R
          </div>
          <div className="min-w-0 flex-1">
            <p className="truncate text-[14px] font-semibold tracking-tight text-[#171717]">
              Reol-Consult
            </p>
            <a
              href="https://reolconsult.no"
              target="_blank"
              rel="noopener"
              className="group mt-0.5 inline-flex items-center gap-1 text-[11px] text-[#737373] transition-colors duration-150 hover:text-[#171717]"
            >
              reolconsult.no
              <ExternalLink className="h-2.5 w-2.5 opacity-0 transition-opacity duration-150 group-hover:opacity-100" strokeWidth={2} />
            </a>
          </div>
          <div title="Live" className="flex items-center gap-1.5 rounded-full bg-emerald-50 px-2 py-1 text-[10px] font-medium text-emerald-700">
            <span className="relative flex h-1.5 w-1.5">
              <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-emerald-400 opacity-60" />
              <span className="relative inline-flex h-1.5 w-1.5 rounded-full bg-emerald-500" />
            </span>
            Live
          </div>
        </div>
      </div>

      {/* Navigation */}
      <nav className="flex-1 overflow-y-auto px-3 py-4">
        <p className="mb-2 px-2.5 text-[10.5px] font-medium uppercase tracking-[0.1em] text-[#a3a3a3]">
          Arbeidsområde
        </p>
        <div className="space-y-0.5">
          {ITEMS.map((item) => {
            const active = isActive(item.href);
            const Icon = item.icon;
            return (
              <Link
                key={item.label}
                href={item.href}
                className={`group relative flex h-10 items-center gap-3 rounded-lg px-3 text-[13.5px] transition duration-150 ease-out ${
                  active
                    ? "bg-white font-semibold text-[#171717] shadow-[0_1px_2px_rgba(0,0,0,0.04),0_0_0_1px_rgba(0,0,0,0.04)]"
                    : "text-[#525252] hover:bg-white/60 hover:text-[#171717]"
                }`}
              >
                {active && (
                  <span className="absolute left-0 top-1/2 h-5 w-[2.5px] -translate-y-1/2 rounded-r-full bg-[#dc2626]" />
                )}
                <Icon
                  className={`h-[17px] w-[17px] shrink-0 transition-colors duration-150 ${
                    active ? "text-[#dc2626]" : "text-[#a3a3a3] group-hover:text-[#525252]"
                  }`}
                  strokeWidth={1.75}
                />
                <span className="flex-1">{item.label}</span>
              </Link>
            );
          })}
        </div>

        <div className="mt-8 mx-2.5 rounded-xl border border-[#ececec] bg-white/70 p-3">
          <p className="text-[11.5px] font-medium text-[#171717]">Trenger du hjelp?</p>
          <p className="mt-1 text-[11px] leading-relaxed text-[#737373]">
            Layouten er låst. Du kan trygt eksperimentere — endringer kan alltid endres tilbake.
          </p>
        </div>
      </nav>

      {/* User chip */}
      <div className="border-t border-[#ececec] bg-white p-3">
        <div className="group flex items-center gap-3 rounded-xl px-2.5 py-2 transition-colors duration-150 hover:bg-[#fafaf9]">
          <div className="relative">
            <div className="flex h-9 w-9 items-center justify-center rounded-full bg-gradient-to-br from-[#262626] to-[#0a0a0a] text-[12.5px] font-semibold text-white shadow-[0_1px_2px_rgba(0,0,0,0.1),inset_0_1px_0_rgba(255,255,255,0.08)]">
              {initial}
            </div>
            <span className="absolute right-0 bottom-0 h-2.5 w-2.5 rounded-full bg-emerald-500 ring-2 ring-white" />
          </div>
          <div className="min-w-0 flex-1">
            <p className="truncate text-[12.5px] font-semibold leading-tight text-[#171717]">
              {userEmail ?? "Innlogget"}
            </p>
            <p className="mt-0.5 text-[11px] leading-tight text-[#a3a3a3]">Administrator</p>
          </div>
          <button
            onClick={() => supabase.auth.signOut()}
            title="Logg ut"
            aria-label="Logg ut"
            className="flex h-7 w-7 items-center justify-center rounded-lg text-[#a3a3a3] transition duration-150 hover:bg-white hover:text-[#dc2626] hover:shadow-[0_1px_2px_rgba(0,0,0,0.06)]"
          >
            <LogOut className="h-3.5 w-3.5" strokeWidth={1.75} />
          </button>
        </div>
      </div>
    </aside>
  );
}
