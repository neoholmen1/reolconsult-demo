"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import { supabase } from "@/lib/supabase";
import { getCurrentSite, type Site } from "@/lib/site";
import MediaPicker from "@/components/admin/MediaPicker";
import { revalidatePublicSite } from "@/app/actions/revalidate";

type CaseStudy = {
  id: string;
  site_id: string;
  customer_name: string;
  project_type: string;
  description: string;
  image_url: string | null;
  year: string;
  sort_order: number;
  published: boolean;
};

type ClientLogo = {
  id: string;
  site_id: string;
  name: string;
  logo_url: string;
  sort_order: number;
};

const NEW_CASE: Omit<CaseStudy, "id" | "site_id"> = {
  customer_name: "",
  project_type: "",
  description: "",
  image_url: null,
  year: "",
  sort_order: 0,
  published: true,
};

export default function ReferanserPage() {
  const [site, setSite] = useState<Site | null>(null);
  const [tab, setTab] = useState<"cases" | "logos">("cases");
  const [cases, setCases] = useState<CaseStudy[]>([]);
  const [logos, setLogos] = useState<ClientLogo[]>([]);
  const [editingCase, setEditingCase] = useState<CaseStudy | null>(null);
  const [editingLogo, setEditingLogo] = useState<ClientLogo | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    let cancelled = false;
    (async () => {
      const s = await getCurrentSite();
      if (!s || cancelled) return;
      setSite(s);
      const [cs, lg] = await Promise.all([
        supabase.from("case_studies").select("*").eq("site_id", s.id).order("sort_order"),
        supabase.from("client_logos").select("*").eq("site_id", s.id).order("sort_order"),
      ]);
      if (!cancelled) {
        setCases((cs.data ?? []) as CaseStudy[]);
        setLogos((lg.data ?? []) as ClientLogo[]);
        setLoading(false);
      }
    })();
    return () => { cancelled = true; };
  }, []);

  // ─── Case studies ───
  function addCase() {
    if (!site) return;
    setEditingCase({ id: "", site_id: site.id, ...NEW_CASE, sort_order: cases.length });
  }
  async function saveCase() {
    if (!editingCase || !site) return;
    setSaving(true);
    const { id, ...rest } = editingCase;
    const payload = { ...rest, site_id: site.id };
    let success = false;
    if (id) {
      const { error } = await supabase.from("case_studies").update(payload).eq("id", id);
      if (!error) {
        setCases((prev) => prev.map((c) => c.id === id ? { ...editingCase } : c));
        setEditingCase(null);
        success = true;
      } else alert("Feil: " + error.message);
    } else {
      const { data, error } = await supabase.from("case_studies").insert(payload).select().single();
      if (!error && data) {
        setCases((prev) => [...prev, data as CaseStudy]);
        setEditingCase(null);
        success = true;
      } else if (error) alert("Feil: " + error.message);
    }
    if (success) await revalidatePublicSite();
    setSaving(false);
  }
  async function removeCase(id: string) {
    if (!confirm("Slette denne casen?")) return;
    const { error } = await supabase.from("case_studies").delete().eq("id", id);
    if (!error) {
      setCases((prev) => prev.filter((c) => c.id !== id));
      await revalidatePublicSite();
    }
  }

  // ─── Logos ───
  function addLogo() {
    if (!site) return;
    setEditingLogo({ id: "", site_id: site.id, name: "", logo_url: "", sort_order: logos.length });
  }
  async function saveLogo() {
    if (!editingLogo || !site) return;
    setSaving(true);
    const { id, ...rest } = editingLogo;
    const payload = { ...rest, site_id: site.id };
    let success = false;
    if (id) {
      const { error } = await supabase.from("client_logos").update(payload).eq("id", id);
      if (!error) {
        setLogos((prev) => prev.map((l) => l.id === id ? { ...editingLogo } : l));
        setEditingLogo(null);
        success = true;
      } else alert("Feil: " + error.message);
    } else {
      const { data, error } = await supabase.from("client_logos").insert(payload).select().single();
      if (!error && data) {
        setLogos((prev) => [...prev, data as ClientLogo]);
        setEditingLogo(null);
        success = true;
      } else if (error) alert("Feil: " + error.message);
    }
    if (success) await revalidatePublicSite();
    setSaving(false);
  }
  async function removeLogo(id: string) {
    if (!confirm("Slette denne logoen?")) return;
    const { error } = await supabase.from("client_logos").delete().eq("id", id);
    if (!error) {
      setLogos((prev) => prev.filter((l) => l.id !== id));
      await revalidatePublicSite();
    }
  }

  return (
    <>
      <div className="sticky top-0 z-10 flex h-14 shrink-0 items-center justify-between border-b border-[#e5e5e5] bg-white px-6">
        <div className="flex items-center gap-3">
          <h1 className="text-base font-semibold text-[#171717]">Referanser</h1>
          <div className="flex gap-1 rounded-full bg-[#f5f5f5] p-1">
            <button onClick={() => setTab("cases")} className={`rounded-full px-3 py-1 text-xs font-medium ${tab === "cases" ? "bg-white text-[#171717] shadow-sm" : "text-[#737373]"}`}>Prosjekter ({cases.length})</button>
            <button onClick={() => setTab("logos")} className={`rounded-full px-3 py-1 text-xs font-medium ${tab === "logos" ? "bg-white text-[#171717] shadow-sm" : "text-[#737373]"}`}>Logoer ({logos.length})</button>
          </div>
        </div>
        <button onClick={tab === "cases" ? addCase : addLogo} className="rounded-full bg-[#dc2626] px-5 py-2 text-sm font-semibold text-white hover:bg-[#b91c1c]">
          {tab === "cases" ? "Nytt prosjekt" : "Ny logo"}
        </button>
      </div>

      <div className="flex-1 overflow-y-auto p-6 lg:p-8">
        <div className="mx-auto max-w-3xl space-y-3">
          {loading ? (
            <div className="flex h-40 items-center justify-center"><span className="text-sm text-[#a3a3a3]">Laster…</span></div>
          ) : tab === "cases" ? (
            cases.length === 0 ? (
              <div className="flex h-40 items-center justify-center rounded-2xl border border-dashed border-[#e5e5e5] bg-white">
                <p className="text-sm text-[#a3a3a3]">Ingen prosjekter.</p>
              </div>
            ) : (
              cases.map((c) => (
                <div key={c.id} className="flex items-center gap-4 rounded-xl border border-[#e5e5e5] bg-white p-4">
                  <div className="relative h-16 w-20 shrink-0 overflow-hidden rounded-lg bg-[#fafafa]">
                    {c.image_url && <Image src={c.image_url} alt="" fill sizes="80px" className="object-cover" unoptimized />}
                  </div>
                  <div className="flex-1">
                    <p className="text-sm font-semibold">{c.customer_name}</p>
                    <p className="text-xs text-[#737373]">{c.project_type}{c.year && ` · ${c.year}`}</p>
                  </div>
                  <button onClick={() => setEditingCase(c)} className="rounded-md border border-[#e5e5e5] px-3 py-1.5 text-xs hover:bg-[#f5f5f5]">Rediger</button>
                  <button onClick={() => removeCase(c.id)} className="rounded-md border border-[#e5e5e5] px-3 py-1.5 text-xs text-[#dc2626] hover:bg-red-50">Slett</button>
                </div>
              ))
            )
          ) : (
            logos.length === 0 ? (
              <div className="flex h-40 items-center justify-center rounded-2xl border border-dashed border-[#e5e5e5] bg-white">
                <p className="text-sm text-[#a3a3a3]">Ingen logoer.</p>
              </div>
            ) : (
              <div className="grid grid-cols-2 gap-3 sm:grid-cols-3">
                {logos.map((l) => (
                  <div key={l.id} className="overflow-hidden rounded-xl border border-[#e5e5e5] bg-white">
                    <div className="flex aspect-[3/2] items-center justify-center p-4">
                      {l.logo_url ? (
                        <Image src={l.logo_url} alt={l.name} width={120} height={60} className="max-h-12 max-w-full object-contain" unoptimized />
                      ) : <span className="text-[10px] text-[#a3a3a3]">Mangler bilde</span>}
                    </div>
                    <div className="border-t border-[#e5e5e5] p-2 flex items-center justify-between">
                      <p className="text-xs font-medium truncate">{l.name}</p>
                      <div className="flex gap-1">
                        <button onClick={() => setEditingLogo(l)} className="rounded p-1 text-xs hover:bg-[#f5f5f5]">✎</button>
                        <button onClick={() => removeLogo(l.id)} className="rounded p-1 text-xs text-[#dc2626] hover:bg-red-50">✕</button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )
          )}
        </div>
      </div>

      {/* Case-modal */}
      {editingCase && site && (
        <Modal onClose={() => setEditingCase(null)} title={editingCase.id ? "Rediger prosjekt" : "Nytt prosjekt"} onSave={saveCase} saving={saving} disabled={!editingCase.customer_name}>
          <MediaPicker value={editingCase.image_url} onChange={(url) => setEditingCase({ ...editingCase, image_url: url })} siteId={site.id} defaultCategory="case" label="Bilde" />
          <FieldText label="Kundenavn" value={editingCase.customer_name} onChange={(v) => setEditingCase({ ...editingCase, customer_name: v })} />
          <FieldText label="Type prosjekt" value={editingCase.project_type} onChange={(v) => setEditingCase({ ...editingCase, project_type: v })} placeholder="Disk og butikkinnredning" />
          <FieldText label="År" value={editingCase.year} onChange={(v) => setEditingCase({ ...editingCase, year: v })} placeholder="2022" />
          <label className="block">
            <span className="text-xs font-medium text-[#737373]">Beskrivelse (valgfritt)</span>
            <textarea value={editingCase.description} onChange={(e) => setEditingCase({ ...editingCase, description: e.target.value })} rows={3} className="mt-1 w-full rounded-lg border border-[#e5e5e5] bg-[#fafafa] px-3 py-2.5 text-sm focus:border-[#dc2626] focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#dc2626]/20" />
          </label>
        </Modal>
      )}

      {/* Logo-modal */}
      {editingLogo && site && (
        <Modal onClose={() => setEditingLogo(null)} title={editingLogo.id ? "Rediger logo" : "Ny logo"} onSave={saveLogo} saving={saving} disabled={!editingLogo.name || !editingLogo.logo_url}>
          <FieldText label="Kundenavn" value={editingLogo.name} onChange={(v) => setEditingLogo({ ...editingLogo, name: v })} />
          <MediaPicker value={editingLogo.logo_url} onChange={(url) => setEditingLogo({ ...editingLogo, logo_url: url ?? "" })} siteId={site.id} defaultCategory="logo" label="Logo" />
        </Modal>
      )}
    </>
  );
}

function Modal({ onClose, title, children, onSave, saving, disabled }: { onClose: () => void; title: string; children: React.ReactNode; onSave: () => void; saving: boolean; disabled?: boolean }) {
  return (
    <div className="fixed inset-0 z-[200] flex items-center justify-center bg-black/50 p-4" onClick={onClose}>
      <div className="flex max-h-[90vh] w-full max-w-lg flex-col overflow-hidden rounded-2xl bg-white shadow-2xl" onClick={(e) => e.stopPropagation()}>
        <div className="flex shrink-0 items-center justify-between border-b border-[#e5e5e5] px-6 py-4">
          <h2 className="text-lg font-semibold">{title}</h2>
          <button onClick={onClose} className="text-sm text-[#737373]">Avbryt</button>
        </div>
        <div className="flex-1 overflow-y-auto p-6 space-y-4">{children}</div>
        <div className="flex shrink-0 justify-end gap-3 border-t border-[#e5e5e5] px-6 py-4">
          <button onClick={onClose} className="rounded-full border border-[#e5e5e5] px-5 py-2 text-sm text-[#737373] hover:bg-[#f5f5f5]">Avbryt</button>
          <button onClick={onSave} disabled={saving || disabled} className="rounded-full bg-[#dc2626] px-5 py-2 text-sm font-semibold text-white hover:bg-[#b91c1c] disabled:opacity-50">{saving ? "Lagrer..." : "Lagre"}</button>
        </div>
      </div>
    </div>
  );
}

function FieldText({ label, value, onChange, placeholder }: { label: string; value: string; onChange: (v: string) => void; placeholder?: string }) {
  return (
    <label className="block">
      <span className="text-xs font-medium text-[#737373]">{label}</span>
      <input type="text" value={value} onChange={(e) => onChange(e.target.value)} placeholder={placeholder} className="mt-1 w-full rounded-lg border border-[#e5e5e5] bg-[#fafafa] px-3 py-2.5 text-sm focus:border-[#dc2626] focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#dc2626]/20" />
    </label>
  );
}
