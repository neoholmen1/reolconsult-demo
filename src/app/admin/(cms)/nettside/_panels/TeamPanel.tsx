"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import { Users, Plus, Pencil, Trash2, ChevronUp, ChevronDown } from "lucide-react";
import { supabase } from "@/lib/supabase";
import { getCurrentSite, type Site } from "@/lib/site";
import MediaPicker from "@/components/admin/MediaPicker";
import { revalidatePublicSite } from "@/app/actions/revalidate";
import EmptyState from "@/components/admin/EmptyState";
import IconButton from "@/components/admin/IconButton";
import Modal, { ModalActions } from "@/components/admin/Modal";
import { FieldText } from "@/components/admin/Field";

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

export default function TeamPanel() {
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
        setMembers((prev) => prev.map((m) => (m.id === editing.id ? ({ ...editing } as Member) : m)));
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
    <div className="mx-auto max-w-3xl space-y-5 p-8 lg:p-12">
      <div className="flex items-center justify-between">
        <p className="text-[13px] text-[#737373]">Ansatte vises på forsiden og kontaktsiden.</p>
        <button
          onClick={newMember}
          className="inline-flex items-center gap-1.5 rounded-full bg-[#171717] px-4 py-2 text-[12.5px] font-semibold text-white shadow-[0_1px_2px_rgba(0,0,0,0.08)] transition duration-150 hover:bg-[#000] hover:shadow-[0_4px_12px_rgba(0,0,0,0.12)]"
        >
          <Plus className="h-3.5 w-3.5" strokeWidth={2.25} /> Ny ansatt
        </button>
      </div>

      {loading ? (
        <div className="flex h-40 items-center justify-center"><span className="text-[13px] text-[#a3a3a3]">Laster…</span></div>
      ) : members.length === 0 && !editing ? (
        <EmptyState
          icon={Users}
          title="Ingen ansatte ennå"
          description="Legg til ansatte med navn, telefon og portrettbilde — de vises automatisk på forsiden og kontaktsiden."
          actionLabel="Legg til første ansatt"
          onAction={newMember}
        />
      ) : (
        <div className="overflow-hidden rounded-xl border border-[#ececec] bg-white">
          {members.map((m, i) => (
            <div
              key={m.id}
              className={`group flex items-center gap-4 px-4 py-3.5 transition-colors duration-150 hover:bg-[#fafaf9] ${
                i < members.length - 1 ? "border-b border-[#f5f5f4]" : ""
              }`}
            >
              <div className="h-11 w-11 shrink-0 overflow-hidden rounded-full bg-[#fafaf9] ring-1 ring-[#ececec]">
                {m.photo_url ? (
                  <Image src={m.photo_url} alt={m.name} width={44} height={44} className="h-full w-full object-cover" unoptimized />
                ) : (
                  <div className="flex h-full w-full items-center justify-center text-[13px] font-medium text-[#a3a3a3]">{m.name.charAt(0)}</div>
                )}
              </div>
              <div className="flex-1 min-w-0">
                <p className="truncate text-[13.5px] font-semibold text-[#171717]">{m.name}</p>
                <p className="mt-0.5 truncate text-[12px] text-[#737373]">
                  {m.role}
                  {m.phone && <span className="text-[#d4d4d4]"> · </span>}
                  {m.phone}
                </p>
              </div>
              <div className="flex items-center gap-1 opacity-0 transition-opacity duration-150 group-hover:opacity-100">
                <IconButton icon={ChevronUp} label="Flytt opp" onClick={() => move(m.id, -1)} />
                <IconButton icon={ChevronDown} label="Flytt ned" onClick={() => move(m.id, 1)} />
                <div className="mx-1 h-4 w-px bg-[#ececec]" />
                <IconButton icon={Pencil} label="Rediger" onClick={() => setEditing(m)} />
                <IconButton icon={Trash2} label="Slett" onClick={() => remove(m.id)} variant="danger" />
              </div>
            </div>
          ))}
        </div>
      )}

      {editing && site && (
        <Modal
          open
          onClose={() => setEditing(null)}
          title={editing.id ? "Rediger ansatt" : "Ny ansatt"}
          description="Vises på forsiden og kontaktsiden."
          footer={
            <ModalActions
              onCancel={() => setEditing(null)}
              onSave={save}
              saving={saving}
              disabled={!editing.name}
            />
          }
        >
          <div className="space-y-5">
            <MediaPicker
              value={editing.photo_url}
              onChange={(url) => setEditing({ ...editing, photo_url: url })}
              siteId={site.id}
              defaultCategory="team"
              label="Portrettbilde"
            />
            <FieldText label="Navn" value={editing.name} onChange={(v) => setEditing({ ...editing, name: v })} />
            <FieldText label="Rolle" value={editing.role} onChange={(v) => setEditing({ ...editing, role: v })} placeholder="F.eks. Salg & rådgivning" />
            <div className="grid grid-cols-2 gap-4">
              <FieldText label="Telefon" value={editing.phone} onChange={(v) => setEditing({ ...editing, phone: v })} placeholder="450 07 322" type="tel" />
              <FieldText label="E-post" value={editing.email} onChange={(v) => setEditing({ ...editing, email: v })} placeholder="agh@reolconsult.no" type="email" />
            </div>
          </div>
        </Modal>
      )}
    </div>
  );
}
