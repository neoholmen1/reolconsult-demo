"use client";

import { useEffect, useState } from "react";
import { FileText, Users, Award, MessageSquare, type LucideIcon } from "lucide-react";
import { supabase } from "@/lib/supabase";
import { getCurrentSite } from "@/lib/site";
import PageHeader from "@/components/admin/PageHeader";
import SiderPanel from "./_panels/SiderPanel";
import TeamPanel from "./_panels/TeamPanel";
import ReferanserPanel from "./_panels/ReferanserPanel";
import TestimonialsPanel from "./_panels/TestimonialsPanel";

type TabKey = "sider" | "team" | "referanser" | "testimonials";

const TABS: { key: TabKey; label: string; icon: LucideIcon }[] = [
  { key: "sider", label: "Sider", icon: FileText },
  { key: "team", label: "Team", icon: Users },
  { key: "referanser", label: "Referanser", icon: Award },
  { key: "testimonials", label: "Kundesitater", icon: MessageSquare },
];

type Counts = { team: number; referanser: number; testimonials: number };

export default function NettsidePage() {
  const [tab, setTab] = useState<TabKey>("sider");
  const [counts, setCounts] = useState<Counts>({ team: 0, referanser: 0, testimonials: 0 });

  useEffect(() => {
    let cancelled = false;
    (async () => {
      const s = await getCurrentSite();
      if (!s || cancelled) return;
      const [t, c, l, q] = await Promise.all([
        supabase.from("team_members").select("id", { count: "exact", head: true }).eq("site_id", s.id),
        supabase.from("case_studies").select("id", { count: "exact", head: true }).eq("site_id", s.id),
        supabase.from("client_logos").select("id", { count: "exact", head: true }).eq("site_id", s.id),
        supabase.from("testimonials").select("id", { count: "exact", head: true }).eq("site_id", s.id),
      ]);
      if (!cancelled) {
        setCounts({
          team: t.count ?? 0,
          referanser: (c.count ?? 0) + (l.count ?? 0),
          testimonials: q.count ?? 0,
        });
      }
    })();
    return () => { cancelled = true; };
  }, []);

  return (
    <>
      <PageHeader title="Nettside" subtitle="Sider, team, referanser og kundesitater" />

      <div className="border-b border-[#ececec] bg-white px-8">
        <nav className="-mb-px flex gap-1">
          {TABS.map((t) => {
            const active = tab === t.key;
            const Icon = t.icon;
            const count =
              t.key === "team" ? counts.team
              : t.key === "referanser" ? counts.referanser
              : t.key === "testimonials" ? counts.testimonials
              : null;
            return (
              <button
                key={t.key}
                onClick={() => setTab(t.key)}
                className={`group relative inline-flex items-center gap-2 px-4 py-4 text-[13px] transition duration-200 ease-out ${
                  active
                    ? "font-semibold text-[#171717]"
                    : "font-medium text-[#737373] hover:text-[#171717]"
                }`}
              >
                <Icon
                  className={`h-3.5 w-3.5 transition-colors duration-200 ${
                    active ? "text-[#dc2626]" : "text-[#a3a3a3] group-hover:text-[#525252]"
                  }`}
                  strokeWidth={1.75}
                />
                {t.label}
                {count !== null && count > 0 && (
                  <span
                    className={`rounded-full px-1.5 text-[10px] font-medium transition-colors duration-200 ${
                      active ? "bg-[#fef2f2] text-[#dc2626]" : "bg-[#f5f5f4] text-[#a3a3a3]"
                    }`}
                  >
                    {count}
                  </span>
                )}
                <span
                  className={`absolute inset-x-3 -bottom-px h-[2px] rounded-full transition duration-200 ease-out ${
                    active ? "bg-[#dc2626] opacity-100" : "bg-transparent opacity-0"
                  }`}
                />
              </button>
            );
          })}
        </nav>
      </div>

      <div className="flex-1 overflow-y-auto bg-[#fafaf9]">
        {tab === "sider" && <SiderPanel />}
        {tab === "team" && <TeamPanel />}
        {tab === "referanser" && <ReferanserPanel />}
        {tab === "testimonials" && <TestimonialsPanel />}
      </div>
    </>
  );
}
