"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { supabase } from "@/lib/supabase";
import { getCurrentSite, type Site } from "@/lib/site";
import { revalidatePublicSite } from "@/app/actions/revalidate";

type PostRow = {
  id: string;
  slug: string;
  title: string;
  excerpt: string;
  status: "draft" | "published";
  published_at: string | null;
  updated_at: string;
};

export default function BloggListPage() {
  const [, setSite] = useState<Site | null>(null);
  const [posts, setPosts] = useState<PostRow[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let cancelled = false;
    (async () => {
      const s = await getCurrentSite();
      if (!s || cancelled) return;
      setSite(s);
      const { data } = await supabase
        .from("blog_posts")
        .select("id, slug, title, excerpt, status, published_at, updated_at")
        .eq("site_id", s.id)
        .order("updated_at", { ascending: false });
      if (!cancelled) {
        setPosts((data ?? []) as PostRow[]);
        setLoading(false);
      }
    })();
    return () => { cancelled = true; };
  }, []);

  async function remove(id: string) {
    if (!confirm("Slette dette innlegget?")) return;
    const { error } = await supabase.from("blog_posts").delete().eq("id", id);
    if (!error) {
      setPosts((prev) => prev.filter((p) => p.id !== id));
      await revalidatePublicSite();
    }
  }

  return (
    <>
      <div className="sticky top-0 z-10 flex h-14 shrink-0 items-center justify-between border-b border-[#e5e5e5] bg-white px-6">
        <h1 className="text-base font-semibold">Blogg</h1>
        <Link href="/admin/blogg/ny" className="rounded-full bg-[#dc2626] px-5 py-2 text-sm font-semibold text-white hover:bg-[#b91c1c]">Nytt innlegg</Link>
      </div>

      <div className="flex-1 overflow-y-auto p-6 lg:p-8">
        <div className="mx-auto max-w-3xl space-y-3">
          {loading ? (
            <div className="flex h-40 items-center justify-center"><span className="text-sm text-[#a3a3a3]">Laster…</span></div>
          ) : posts.length === 0 ? (
            <div className="flex h-40 items-center justify-center rounded-2xl border border-dashed border-[#e5e5e5] bg-white">
              <p className="text-sm text-[#a3a3a3]">Ingen innlegg enda.</p>
            </div>
          ) : posts.map((p) => (
            <div key={p.id} className="rounded-xl border border-[#e5e5e5] bg-white p-4">
              <div className="flex items-start justify-between gap-4">
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2">
                    <p className="truncate text-sm font-semibold">{p.title || <span className="italic text-[#a3a3a3]">Uten tittel</span>}</p>
                    <span className={`rounded-full px-2 py-0.5 text-[10px] font-medium ${p.status === "published" ? "bg-emerald-50 text-emerald-700" : "bg-[#e5e5e5] text-[#737373]"}`}>
                      {p.status === "published" ? "Publisert" : "Utkast"}
                    </span>
                  </div>
                  <p className="mt-0.5 text-xs text-[#a3a3a3]">/{p.slug || "uten-slug"}</p>
                  {p.excerpt && <p className="mt-2 line-clamp-2 text-xs text-[#737373]">{p.excerpt}</p>}
                </div>
                <div className="flex shrink-0 items-center gap-2">
                  <Link href={`/admin/blogg/${p.id}`} className="rounded-md border border-[#e5e5e5] px-3 py-1.5 text-xs hover:bg-[#f5f5f5]">Rediger</Link>
                  <button onClick={() => remove(p.id)} className="rounded-md border border-[#e5e5e5] px-3 py-1.5 text-xs text-[#dc2626] hover:bg-red-50">Slett</button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </>
  );
}
