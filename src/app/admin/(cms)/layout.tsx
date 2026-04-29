"use client";

import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";
import {
  getCurrentSite,
  getSiteAccessForCurrentUser,
  type Site,
  type SiteRole,
} from "@/lib/site";
import type { User } from "@supabase/supabase-js";
import AdminSidebar from "@/components/admin/AdminSidebar";

export default function CmsLayout({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [authReady, setAuthReady] = useState(false);
  const [site, setSite] = useState<Site | null>(null);
  const [siteRole, setSiteRole] = useState<SiteRole | null>(null);
  const [accessChecking, setAccessChecking] = useState(false);

  // Auth-listener — venter på første session-sjekk før vi vurderer å rendere noe
  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      setUser(session?.user ?? null);
      setAuthReady(true);
    });
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user ?? null);
      if (!session?.user) {
        setSiteRole(null);
        setSite(null);
      }
    });
    return () => subscription.unsubscribe();
  }, []);

  // Hent site + tilgang når bruker er innlogget
  useEffect(() => {
    if (!user) return;
    let cancelled = false;
    setAccessChecking(true);
    (async () => {
      const currentSite = await getCurrentSite();
      if (cancelled) return;
      setSite(currentSite);
      if (!currentSite) {
        setAccessChecking(false);
        return;
      }
      const access = await getSiteAccessForCurrentUser(currentSite.id);
      if (cancelled) return;
      setSiteRole(access.role);
      setAccessChecking(false);
    })();
    return () => {
      cancelled = true;
    };
  }, [user]);

  // Spinner — venter både på auth og (hvis innlogget) tilgangssjekk
  if (!authReady || (user && accessChecking)) {
    return (
      <div className="fixed inset-0 z-[100] flex items-center justify-center bg-white">
        <div className="h-8 w-8 animate-spin rounded-full border-2 border-[#dc2626] border-t-transparent" />
      </div>
    );
  }

  // Ikke innlogget — pek brukeren til /admin (som har login-skjema)
  if (!user) {
    return (
      <div className="fixed inset-0 z-[100] flex items-center justify-center bg-[#fafafa] p-6">
        <div className="w-full max-w-md rounded-2xl bg-white p-8 shadow-[0_20px_60px_rgba(0,0,0,0.08)]">
          <h1 className="text-2xl font-bold text-[#171717]">Logg inn</h1>
          <p className="mt-3 text-sm text-[#737373]">
            Du må være innlogget for å redigere innhold.
          </p>
          <a
            href="/admin"
            className="mt-6 inline-flex w-full justify-center rounded-full bg-[#dc2626] py-3 font-semibold text-white transition-colors hover:bg-[#b91c1c]"
          >
            Til innlogging
          </a>
        </div>
      </div>
    );
  }

  // Innlogget men uten tilgang
  if (!siteRole) {
    return (
      <div className="fixed inset-0 z-[100] flex items-center justify-center bg-[#fafafa] p-6">
        <div className="w-full max-w-md rounded-2xl bg-white p-8 shadow-[0_20px_60px_rgba(0,0,0,0.08)]">
          <h1 className="text-2xl font-bold text-[#171717]">Ingen tilgang</h1>
          <p className="mt-3 text-sm text-[#737373]">
            Brukeren <span className="font-medium text-[#404040]">{user.email}</span> har ikke
            tilgang til {site?.name ?? "denne siten"}.
          </p>
          <button
            onClick={() => supabase.auth.signOut()}
            className="mt-6 w-full rounded-full bg-[#dc2626] py-3 font-semibold text-white transition-colors hover:bg-[#b91c1c]"
          >
            Logg ut
          </button>
        </div>
      </div>
    );
  }

  // OK
  return (
    <div className="fixed inset-0 z-[100] flex bg-[#fafafa]">
      <AdminSidebar userEmail={user.email ?? null} />
      <main className="flex flex-1 flex-col overflow-hidden">
        {children}
      </main>
    </div>
  );
}
