"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { Sparkles, ArrowLeft, CheckCircle2 } from "lucide-react";
import { supabase } from "@/lib/supabase";
import { getCurrentSite, type Site } from "@/lib/site";
import PageHeader from "@/components/admin/PageHeader";

const NOTES_CATEGORY = "_freeform_notes";

export default function ChatbotInfoPage() {
  const [notes, setNotes] = useState("");
  const [rowId, setRowId] = useState<string | null>(null);
  const [site, setSite] = useState<Site | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [savedAt, setSavedAt] = useState<Date | null>(null);

  // Hent eksisterende notater for DENNE siten.
  // Uten site-filteret hentet spørringen første beste rad med denne kategorien
  // uansett hvilken kunde den tilhørte, og lagring skrev da over den.
  useEffect(() => {
    let cancelled = false;
    (async () => {
      const s = await getCurrentSite();
      if (cancelled) return;
      setSite(s);
      if (!s) {
        setLoading(false);
        return;
      }
      const { data } = await supabase
        .from("chatbot_knowledge")
        .select("id, description")
        .eq("site_id", s.id)
        .eq("category", NOTES_CATEGORY)
        .maybeSingle();
      if (!cancelled) {
        if (data) {
          setRowId(data.id);
          setNotes(data.description ?? "");
        }
        setLoading(false);
      }
    })();
    return () => { cancelled = true; };
  }, []);

  async function save() {
    if (!site) {
      alert("Fant ikke hvilken side dette gjelder — last siden på nytt.");
      return;
    }
    setSaving(true);
    if (rowId) {
      const { error } = await supabase
        .from("chatbot_knowledge")
        .update({ description: notes, updated_at: new Date().toISOString() })
        .eq("id", rowId);
      if (error) {
        alert("Kunne ikke lagre: " + error.message);
      } else {
        setSavedAt(new Date());
      }
    } else {
      const { data, error } = await supabase
        .from("chatbot_knowledge")
        .insert({
          // site_id er NOT NULL, og RLS-policyen er
          // WITH CHECK (has_site_access(site_id)). Uten den feilet den aller
          // første lagringen — den som oppretter raden.
          site_id: site.id,
          category: NOTES_CATEGORY,
          category_type: "bedriftsinfo",
          description: notes,
        })
        .select("id")
        .single();
      if (error) {
        alert("Kunne ikke lagre: " + error.message);
      } else if (data) {
        setRowId(data.id);
        setSavedAt(new Date());
      }
    }
    setSaving(false);
  }

  return (
    <>
      <PageHeader
        title="AI-assistent"
        subtitle="Lim inn rå info som AI-assistenten skal kunne svare på"
        right={
          <>
            {savedAt && (
              <span className="inline-flex items-center gap-1.5 rounded-full bg-emerald-50 px-2.5 py-1 text-[11px] font-medium text-emerald-700">
                <CheckCircle2 className="h-3 w-3" strokeWidth={2} />
                Lagret
              </span>
            )}
            <Link
              href="/admin/oversikt"
              className="inline-flex items-center gap-1.5 rounded-full border border-[#ececec] bg-white px-3.5 py-2 text-[12.5px] font-medium text-[#525252] transition duration-150 hover:border-[#d4d4d4] hover:text-[#171717]"
            >
              <ArrowLeft className="h-3.5 w-3.5" strokeWidth={1.75} /> Til oversikt
            </Link>
            <button
              onClick={save}
              disabled={saving || loading}
              className="inline-flex items-center gap-1.5 rounded-full bg-[#171717] px-5 py-2 text-[13px] font-semibold text-white shadow-[0_1px_2px_rgba(0,0,0,0.08)] transition duration-150 hover:bg-[#000] hover:shadow-[0_4px_12px_rgba(0,0,0,0.15)] disabled:cursor-not-allowed disabled:bg-[#e5e5e4] disabled:text-[#a3a3a3] disabled:shadow-none"
            >
              {saving ? "Lagrer..." : "Lagre"}
            </button>
          </>
        }
      />

      <div className="flex-1 overflow-y-auto bg-[#fafaf9] p-8 lg:p-10">
        <div className="mx-auto max-w-3xl space-y-5">
          <div className="flex gap-3 rounded-xl border border-[#ececec] bg-white p-5">
            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-[#fef2f2] text-[#dc2626] ring-1 ring-rose-100">
              <Sparkles className="h-5 w-5" strokeWidth={1.75} />
            </div>
            <div className="flex-1">
              <h2 className="text-[15px] font-semibold tracking-tight text-[#171717]">
                Hvordan dette fungerer
              </h2>
              <p className="mt-1 text-[12.5px] leading-relaxed text-[#737373]">
                Skriv eller lim inn alt AI-assistenten skal kunne svare på — priser, leveringstider, hvilke
                produkter dere har på lager, åpningstider, spesifikke fakta om bedriften osv. Du trenger
                ikke strukturere det — bare skriv naturlig, så bruker AI-assistenten det som ekstra kontekst.
              </p>
              <p className="mt-2 text-[12.5px] leading-relaxed text-[#737373]">
                Eksempel: <span className="italic text-[#525252]">&quot;Vi har for tiden ekstra mange brukte pallreoler fra Nortura-leveransen — pris 1500 kr per seksjon. Levering 2 uker.&quot;</span>
              </p>
            </div>
          </div>

          <div className="overflow-hidden rounded-2xl border border-[#ececec] bg-white shadow-[0_1px_2px_rgba(0,0,0,0.02)]">
            <div className="border-b border-[#ececec] bg-[#fafaf9] px-6 py-3">
              <h3 className="text-[13px] font-semibold tracking-tight text-[#171717]">
                Notater og info for AI-assistenten
              </h3>
              <p className="mt-0.5 text-[11.5px] text-[#737373]">
                Endringer her påvirker AI-assistentens svar umiddelbart etter lagring.
              </p>
            </div>
            <div className="p-6">
              <textarea
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                placeholder={loading ? "Laster..." : "Lim inn eller skriv all info AI-assistenten skal kunne svare på her..."}
                disabled={loading}
                rows={20}
                className="w-full resize-y rounded-lg border border-[#ececec] bg-[#fafaf9] px-3.5 py-3 text-[13px] leading-relaxed text-[#171717] placeholder:text-[#a3a3a3] transition duration-150 focus:border-[#171717] focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#171717]/10"
              />
              <p className="mt-2 text-[11px] text-[#a3a3a3]">
                {notes.length} tegn
              </p>
            </div>
          </div>

          <div className="rounded-xl border border-blue-100 bg-blue-50/50 p-4">
            <p className="text-[12.5px] leading-relaxed text-blue-900/80">
              <span className="font-semibold">Tips:</span> AI-assistenten har allerede tilgang til alle produkter, kategorier,
              team-medlemmer, åpningstider og kontaktinfo fra CMS-en. Bruk dette feltet for ekstra ting som ikke passer i
              de andre fanene — som midlertidige tilbud, lagerinfo, eller spesielle FAQ-svar.
            </p>
          </div>
        </div>
      </div>
    </>
  );
}
