"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import { supabase } from "@/lib/supabase";
import { getCurrentSite, type Site } from "@/lib/site";
import MediaPicker from "@/components/admin/MediaPicker";
import { revalidatePublicSite } from "@/app/actions/revalidate";

type Member = {
  id: string;
  site_id: string;
  name: string;
  role: string;
  phone: string;
  email: string;
  photo_url: string | null;
  bio: string;
  sort_order: number;
  active: boolean;
};

const NEW_MEMBER: Omit<Member, "id" | "site_id"> = {
  name: "",
  role: "",
  phone: "",
  email: "",
  photo_url: null,
  bio: "",
  sort_order: 0,
  active: true,
};

export default function TeamPage() {
  const [site, setSite] = useState<Site | null>(null);
  const [members, setMembers] = useState<Member[]>([]);
  const [editing, setEditing] = useState<Member | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    let cancelled = false;
    (async () => {
      const s = await getCurrentSite();
      if (!s || cancelled) return;
      setSite(s);
      const { data } = await supabase
        .from("team_members")
        .select("*")
        .eq("site_id", s.id)
        .order("sort_order");
      if (!cancelled) {
        setMembers((data ?? []) as Member[]);
        setLoading(false);
      }
    })();
    return () => { cancelled = true; };
  }, []);

  function newMember() {
    if (!site) return;
    setEditing({ id: "", site_id: site.id, ...NEW_MEMBER, sort_order: members.length });
  }

  async function save() {
    if (!editing || !site) return;
    setSaving(true);
    const payload = {
      site_id: site.id,
      name: editing.name,
      role: editing.role,
      phone: editing.phone,
      email: editing.email,
      photo_url: editing.photo_url,
      bio: editing.bio,
      sort_order: editing.sort_order,
      active: editing.active,
    };
    let success = false;
    if (editing.id) {
      const { error } = await supabase.from("team_members").update(payload).eq("id", editing.id);
      if (!error) {
        setMembers((prev) =>
          prev.map((m) => (m.id === editing.id ? ({ ...editing } as Member) : m)),
        );
        setEditing(null);
        success = true;
      } else alert("Feil: " + error.message);
    } else {
      const { data, error } = await supabase.from("team_members").insert(payload).select().single();
      if (!error && data) {
        setMembers((prev) => [...prev, data as Member].sort((a, b) => a.sort_order - b.sort_order));
        setEditing(null);
        success = true;
      } else if (error) alert("Feil: " + error.message);
    }
    if (success) await revalidatePublicSite();
    setSaving(false);
  }

  async function remove(id: string) {
    if (!confirm("Slette denne ansatte?")) return;
    const { error } = await supabase.from("team_members").delete().eq("id", id);
    if (!error) {
      setMembers((prev) => prev.filter((m) => m.id !== id));
      await revalidatePublicSite();
    } else alert("Feil: " + error.message);
  }

  async function move(id: string, dir: -1 | 1) {
    const idx = members.findIndex((m) => m.id === id);
    if (idx < 0 || idx + dir < 0 || idx + dir >= members.length) return;
    const a = members[idx];
    const b = members[idx + dir];
    await Promise.all([
      supabase.from("team_members").update({ sort_order: b.sort_order }).eq("id", a.id),
      supabase.from("team_members").update({ sort_order: a.sort_order }).eq("id", b.id),
    ]);
    const swapped = [...members];
    swapped[idx] = { ...a, sort_order: b.sort_order };
    swapped[idx + dir] = { ...b, sort_order: a.sort_order };
    setMembers(swapped.sort((x, y) => x.sort_order - y.sort_order));
    await revalidatePublicSite();
  }

  return (
    <>
      <div className="sticky top-0 z-10 flex h-14 shrink-0 items-center justify-between border-b border-[#e5e5e5] bg-white px-6">
        <h1 className="text-base font-semibold text-[#171717]">Team</h1>
        <button onClick={newMember} className="rounded-full bg-[#dc2626] px-5 py-2 text-sm font-semibold text-white hover:bg-[#b91c1c]">
          Ny ansatt
        </button>
      </div>

      <div className="flex-1 overflow-y-auto p-6 lg:p-8">
        <div className="mx-auto max-w-3xl space-y-3">
          {loading ? (
            <div className="flex h-40 items-center justify-center"><span className="text-sm text-[#a3a3a3]">Laster…</span></div>
          ) : members.length === 0 && !editing ? (
            <div className="flex h-40 items-center justify-center rounded-2xl border border-dashed border-[#e5e5e5] bg-white">
              <p className="text-sm text-[#a3a3a3]">Ingen ansatte enda. Trykk «Ny ansatt» for å legge til.</p>
            </div>
          ) : (
            members.map((m, i) => (
              <div key={m.id} className="flex items-center gap-4 rounded-xl border border-[#e5e5e5] bg-white p-4">
                <div className="h-12 w-12 shrink-0 overflow-hidden rounded-full bg-[#fafafa]">
                  {m.photo_url ? (
                    <Image src={m.photo_url} alt={m.name} width={48} height={48} className="h-full w-full object-cover" unoptimized />
                  ) : (
                    <div className="flex h-full w-full items-center justify-center text-sm text-[#a3a3a3]">
                      {m.name.charAt(0)}
                    </div>
                  )}
                </div>
                <div className="flex-1">
                  <p className="text-sm font-semibold text-[#171717]">{m.name}</p>
                  <p className="text-xs text-[#737373]">{m.role}</p>
                  <p className="mt-0.5 text-xs text-[#a3a3a3]">{m.phone} · {m.email}</p>
                </div>
                <div className="flex flex-col gap-1">
                  <button onClick={() => move(m.id, -1)} disabled={i === 0} className="rounded p-1 text-xs text-[#a3a3a3] hover:bg-[#f5f5f5] disabled:opacity-30">▲</button>
                  <button onClick={() => move(m.id, 1)} disabled={i === members.length - 1} className="rounded p-1 text-xs text-[#a3a3a3] hover:bg-[#f5f5f5] disabled:opacity-30">▼</button>
                </div>
                <button onClick={() => setEditing(m)} className="rounded-md border border-[#e5e5e5] px-3 py-1.5 text-xs hover:bg-[#f5f5f5]">Rediger</button>
                <button onClick={() => remove(m.id)} className="rounded-md border border-[#e5e5e5] px-3 py-1.5 text-xs text-[#dc2626] hover:bg-red-50">Slett</button>
              </div>
            ))
          )}
        </div>
      </div>

      {editing && site && (
        <div className="fixed inset-0 z-[200] flex items-center justify-center bg-black/50 p-4" onClick={() => setEditing(null)}>
          <div className="flex max-h-[90vh] w-full max-w-lg flex-col overflow-hidden rounded-2xl bg-white shadow-2xl" onClick={(e) => e.stopPropagation()}>
            <div className="flex shrink-0 items-center justify-between border-b border-[#e5e5e5] px-6 py-4">
              <h2 className="text-lg font-semibold text-[#171717]">{editing.id ? "Rediger ansatt" : "Ny ansatt"}</h2>
              <button onClick={() => setEditing(null)} className="text-sm text-[#737373]">Avbryt</button>
            </div>
            <div className="flex-1 overflow-y-auto p-6 space-y-4">
              <MediaPicker value={editing.photo_url} onChange={(url) => setEditing({ ...editing, photo_url: url })} siteId={site.id} defaultCategory="team" label="Portrettbilde" />
              <FieldText label="Navn" value={editing.name} onChange={(v) => setEditing({ ...editing, name: v })} />
              <FieldText label="Rolle" value={editing.role} onChange={(v) => setEditing({ ...editing, role: v })} placeholder="F.eks. Salg & rådgivning" />
              <FieldText label="Telefon" value={editing.phone} onChange={(v) => setEditing({ ...editing, phone: v })} placeholder="450 07 322" />
              <FieldText label="E-post" value={editing.email} onChange={(v) => setEditing({ ...editing, email: v })} placeholder="agh@reolconsult.no" />
            </div>
            <div className="flex shrink-0 justify-end gap-3 border-t border-[#e5e5e5] px-6 py-4">
              <button onClick={() => setEditing(null)} className="rounded-full border border-[#e5e5e5] px-5 py-2 text-sm text-[#737373] hover:bg-[#f5f5f5]">Avbryt</button>
              <button onClick={save} disabled={saving || !editing.name} className="rounded-full bg-[#dc2626] px-5 py-2 text-sm font-semibold text-white hover:bg-[#b91c1c] disabled:opacity-50">{saving ? "Lagrer..." : "Lagre"}</button>
            </div>
          </div>
        </div>
      )}
    </>
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
