"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { supabase } from "@/lib/supabase";

type Item = { href: string; label: string };

const ITEMS: Item[] = [
  { href: "/admin/innhold", label: "Innhold" },
  { href: "/admin/produkter", label: "Produkter" },
  { href: "/admin/kategorier", label: "Kategorier" },
  { href: "/admin/team", label: "Team" },
  { href: "/admin/referanser", label: "Referanser" },
  { href: "/admin/testimonials", label: "Testimonials" },
  { href: "/admin/blogg", label: "Blogg" },
  { href: "/admin/bilder", label: "Bilder" },
];

const FOOTER_ITEMS: Item[] = [
  { href: "/admin", label: "Innstillinger og chatbot →" },
];

export default function AdminSidebar({ userEmail }: { userEmail: string | null }) {
  const pathname = usePathname();

  return (
    <aside className="flex w-[240px] shrink-0 flex-col border-r border-[#e5e5e5] bg-[#fafafa]">
      <div className="flex h-14 items-center border-b border-[#e5e5e5] px-5">
        <span className="text-sm font-bold text-[#171717]">Reol-Consult CMS</span>
      </div>

      <nav className="flex-1 overflow-y-auto p-3 space-y-1">
        {ITEMS.map((item) => {
          const active = pathname === item.href || pathname.startsWith(item.href + "/");
          return (
            <Link
              key={item.href}
              href={item.href}
              className={`flex h-10 items-center rounded-lg px-3 text-[13px] transition-all ${
                active
                  ? "bg-[#dc2626] font-medium text-white shadow-sm"
                  : "text-[#404040] hover:bg-white hover:shadow-[0_1px_3px_rgba(0,0,0,0.06)]"
              }`}
            >
              {item.label}
            </Link>
          );
        })}
      </nav>

      <div className="border-t border-[#e5e5e5] p-3 space-y-1">
        {FOOTER_ITEMS.map((item) => (
          <Link
            key={item.href}
            href={item.href}
            className="flex h-10 items-center rounded-lg px-3 text-[13px] text-[#737373] hover:bg-white hover:text-[#171717]"
          >
            {item.label}
          </Link>
        ))}
        <div className="mt-3 rounded-lg bg-white p-3 shadow-[0_1px_3px_rgba(0,0,0,0.04)]">
          <p className="text-[11px] text-[#a3a3a3]">Innlogget</p>
          <p className="mt-0.5 truncate text-xs text-[#404040]">{userEmail ?? "—"}</p>
          <button
            onClick={() => supabase.auth.signOut()}
            className="mt-2 text-[11px] font-medium text-[#737373] hover:text-[#dc2626]"
          >
            Logg ut
          </button>
        </div>
      </div>
    </aside>
  );
}
