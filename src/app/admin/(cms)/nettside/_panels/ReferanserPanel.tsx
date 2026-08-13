"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import { Award, Building2, Plus, Pencil, Trash2 } from "lucide-react";
import { supabase } from "@/lib/supabase";
import { getCurrentSite, type Site } from "@/lib/site";
import MediaPicker from "@/components/admin/MediaPicker";
import { revalidatePublicSite } from "@/app/actions/revalidate";
import EmptyState from "@/components/admin/EmptyState";
import IconButton from "@/components/admin/IconButton";
import Modal, { ModalActions } from "@/components/admin/Modal";
import { FieldText, FieldTextarea } from "@/components/admin/Field";

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

export default function ReferanserPanel() {
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
    <div className="mx-auto max-w-3xl space-y-5 p-8 lg:p-12">
      <div className="flex items-center justify-between gap-4">
        <div className="inline-flex rounded-full border border-[#ececec] bg-white p-1 shadow-[0_1px_2px_rgba(0,0,0,0.02)]">
          <SubTab active={tab === "cases"} onClick={() => setTab("cases")} icon={Award} label="Prosjekter" count={cases.length} />
          <SubTab active={tab === "logos"} onClick={() => setTab("logos")} icon={Building2} label="Logoer" count={logos.length} />
        </div>
        <button
          onClick={tab === "cases" ? addCase : addLogo}
          className="inline-flex items-center gap-1.5 rounded-full bg-[#171717] px-4 py-2 text-[12.5px] font-semibold text-white shadow-[0_1px_2px_rgba(0,0,0,0.08)] transition duration-150 hover:bg-[#000] hover:shadow-[0_4px_12px_rgba(0,0,0,0.12)]"
        >
          <Plus className="h-3.5 w-3.5" strokeWidth={2.25} />
          {tab === "cases" ? "Nytt prosjekt" : "Ny logo"}
        </button>
      </div>

      {loading ? (
        <div className="flex h-40 items-center justify-center"><span className="text-[13px] text-[#a3a3a3]">Laster…</span></div>
      ) : tab === "cases" ? (
        cases.length === 0 ? (
          <EmptyState
            icon={Award}
            title="Ingen prosjekter ennå"
            description="Vis fram prosjekter dere har levert til kunder. Hvert prosjekt har bilde, kundenavn og prosjekttype."
            actionLabel="Legg til første prosjekt"
            onAction={addCase}
          />
        ) : (
          <div className="overflow-hidden rounded-xl border border-[#ececec] bg-white">
            {cases.map((c, i) => (
              <div
                key={c.id}
                className={`group flex items-center gap-4 px-4 py-3.5 transition-colors duration-150 hover:bg-[#fafaf9] ${
                  i < cases.length - 1 ? "border-b border-[#f5f5f4]" : ""
                }`}
              >
                <div className="relative h-14 w-20 shrink-0 overflow-hidden rounded-lg bg-[#fafaf9] ring-1 ring-[#ececec]">
                  {c.image_url && <Image src={c.image_url} alt="" fill sizes="80px" className="object-cover" unoptimized />}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="truncate text-[13.5px] font-semibold text-[#171717]">{c.customer_name}</p>
                  <p className="mt-0.5 truncate text-[12px] text-[#737373]">
                    {c.project_type}
                    {c.year && <span className="text-[#d4d4d4]"> · </span>}
                    {c.year}
                  </p>
                </div>
                <div className="flex items-center gap-1 opacity-0 transition-opacity duration-150 group-hover:opacity-100">
                  <IconButton icon={Pencil} label="Rediger" onClick={() => setEditingCase(c)} />
                  <IconButton icon={Trash2} label="Slett" onClick={() => removeCase(c.id)} variant="danger" />
                </div>
              </div>
            ))}
          </div>
        )
      ) : (
        logos.length === 0 ? (
          <EmptyState
            icon={Building2}
            title="Ingen logoer ennå"
            description="Last opp kunde-logoer som vises i en stripe på forsiden og som rutenett på referansesiden."
            actionLabel="Legg til første logo"
            onAction={addLogo}
          />
        ) : (
          <div className="grid grid-cols-2 gap-3 sm:grid-cols-3">
            {logos.map((l) => (
              <div key={l.id} className="group overflow-hidden rounded-xl border border-[#ececec] bg-white transition duration-200 hover:shadow-[0_4px_12px_-4px_rgba(0,0,0,0.06)]">
                <div className="flex aspect-[3/2] items-center justify-center bg-[#fafaf9] p-5">
                  {l.logo_url ? (
                    <Image src={l.logo_url} alt={l.name} width={120} height={60} className="max-h-12 max-w-full object-contain" unoptimized />
                  ) : <span className="text-[10px] text-[#a3a3a3]">Mangler bilde</span>}
                </div>
                <div className="flex items-center justify-between gap-2 border-t border-[#ececec] px-3 py-2">
                  <p className="truncate text-[12px] font-medium text-[#171717]">{l.name}</p>
                  <div className="flex items-center gap-0.5">
                    <IconButton icon={Pencil} label="Rediger" onClick={() => setEditingLogo(l)} />
                    <IconButton icon={Trash2} label="Slett" onClick={() => removeLogo(l.id)} variant="danger" />
                  </div>
                </div>
              </div>
            ))}
          </div>
        )
      )}

      {editingCase && site && (
        <Modal
          open
          onClose={() => setEditingCase(null)}
          title={editingCase.id ? "Rediger prosjekt" : "Nytt prosjekt"}
          description="Vises på referansesiden."
          footer={
            <ModalActions
              onCancel={() => setEditingCase(null)}
              onSave={saveCase}
              saving={saving}
              disabled={!editingCase.customer_name}
            />
          }
        >
          <div className="space-y-5">
            <MediaPicker value={editingCase.image_url} onChange={(url) => setEditingCase({ ...editingCase, image_url: url })} siteId={site.id} defaultCategory="case" label="Bilde" />
            <FieldText label="Kundenavn" value={editingCase.customer_name} onChange={(v) => setEditingCase({ ...editingCase, customer_name: v })} />
            <div className="grid grid-cols-2 gap-4">
              <FieldText label="Type prosjekt" value={editingCase.project_type} onChange={(v) => setEditingCase({ ...editingCase, project_type: v })} placeholder="Disk og butikkinnredning" />
              <FieldText label="År" value={editingCase.year} onChange={(v) => setEditingCase({ ...editingCase, year: v })} placeholder="2022" />
            </div>
            <FieldTextarea label="Beskrivelse" hint="(valgfritt)" value={editingCase.description} onChange={(v) => setEditingCase({ ...editingCase, description: v })} rows={3} />
          </div>
        </Modal>
      )}

      {editingLogo && site && (
        <Modal
          open
          onClose={() => setEditingLogo(null)}
          title={editingLogo.id ? "Rediger logo" : "Ny logo"}
          footer={
            <ModalActions
              onCancel={() => setEditingLogo(null)}
              onSave={saveLogo}
              saving={saving}
              disabled={!editingLogo.name || !editingLogo.logo_url}
            />
          }
        >
          <div className="space-y-5">
            <FieldText label="Kundenavn" value={editingLogo.name} onChange={(v) => setEditingLogo({ ...editingLogo, name: v })} />
            <MediaPicker value={editingLogo.logo_url} onChange={(url) => setEditingLogo({ ...editingLogo, logo_url: url ?? "" })} siteId={site.id} defaultCategory="logo" label="Logo" />
          </div>
        </Modal>
      )}
    </div>
  );
}

function SubTab({
  active,
  onClick,
  icon: Icon,
  label,
  count,
}: {
  active: boolean;
  onClick: () => void;
  icon: typeof Award;
  label: string;
  count: number;
}) {
  return (
    <button
      onClick={onClick}
      className={`inline-flex items-center gap-1.5 rounded-full px-3.5 py-1.5 text-[12px] font-medium transition duration-150 ${
        active
          ? "bg-[#171717] text-white shadow-[0_1px_2px_rgba(0,0,0,0.08)]"
          : "text-[#525252] hover:text-[#171717]"
      }`}
    >
      <Icon className="h-3.5 w-3.5" strokeWidth={1.75} />
      {label}
      <span className={`text-[10.5px] ${active ? "text-white/70" : "text-[#a3a3a3]"}`}>{count}</span>
    </button>
  );
}
