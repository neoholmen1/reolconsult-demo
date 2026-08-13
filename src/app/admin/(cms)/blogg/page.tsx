"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { PenLine, Plus, Pencil, Trash2 } from "lucide-react";
import { supabase } from "@/lib/supabase";
import { getCurrentSite, type Site } from "@/lib/site";
import { revalidatePublicSite } from "@/app/actions/revalidate";
import PageHeader from "@/components/admin/PageHeader";
import EmptyState from "@/components/admin/EmptyState";
import IconButton from "@/components/admin/IconButton";

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
      <PageHeader
        title="Blogg"
        subtitle="Innlegg som er publisert vises på /blogg"
        right={
          <Link
            href="/admin/blogg/ny"
            className="inline-flex items-center gap-1.5 rounded-full bg-[#171717] px-4 py-2 text-[12.5px] font-semibold text-white shadow-[0_1px_2px_rgba(0,0,0,0.08)] transition duration-150 hover:bg-[#000] hover:shadow-[0_4px_12px_rgba(0,0,0,0.12)]"
          >
            <Plus className="h-3.5 w-3.5" strokeWidth={2.25} /> Nytt innlegg
          </Link>
        }
      />

      <div className="flex-1 overflow-y-auto bg-[#fafaf9] p-8 lg:p-10">
        <div className="mx-auto max-w-3xl">
          {loading ? (
            <div className="flex h-40 items-center justify-center"><span className="text-[13px] text-[#a3a3a3]">Laster…</span></div>
          ) : posts.length === 0 ? (
            <EmptyState
              icon={PenLine}
              title="Ingen blogginnlegg ennå"
              description="Skriv ditt første innlegg om f.eks. nye produkter, leveranser eller bransjenyheter. Du kan lagre som utkast og publisere når du er klar."
              actionLabel="Skriv første innlegg"
              actionHref="/admin/blogg/ny"
            />
          ) : (
            <div className="overflow-hidden rounded-xl border border-[#ececec] bg-white">
              {posts.map((p, i) => (
                <div
                  key={p.id}
                  className={`group flex items-start gap-4 px-5 py-4 transition-colors duration-150 hover:bg-[#fafaf9] ${
                    i < posts.length - 1 ? "border-b border-[#f5f5f4]" : ""
                  }`}
                >
                  <Link href={`/admin/blogg/${p.id}`} className="flex-1 min-w-0">
                    <div className="flex items-center gap-2">
                      <p className="truncate text-[14px] font-semibold tracking-tight text-[#171717]">
                        {p.title || <span className="italic text-[#a3a3a3]">Uten tittel</span>}
                      </p>
                      <span
                        className={`shrink-0 rounded-full px-2 py-0.5 text-[10px] font-medium ${
                          p.status === "published"
                            ? "bg-emerald-50 text-emerald-700"
                            : "bg-[#f5f5f4] text-[#737373]"
                        }`}
                      >
                        {p.status === "published" ? "Publisert" : "Utkast"}
                      </span>
                    </div>
                    <p className="mt-0.5 text-[11.5px] font-mono text-[#a3a3a3]">/{p.slug || "uten-slug"}</p>
                    {p.excerpt && (
                      <p className="mt-2 line-clamp-2 text-[12.5px] leading-relaxed text-[#737373]">{p.excerpt}</p>
                    )}
                  </Link>
                  <div className="flex items-center gap-0.5 opacity-0 transition-opacity duration-150 group-hover:opacity-100">
                    <Link
                      href={`/admin/blogg/${p.id}`}
                      title="Rediger"
                      aria-label="Rediger"
                      className="flex h-8 w-8 items-center justify-center rounded-lg text-[#a3a3a3] transition duration-150 hover:bg-[#f5f5f4] hover:text-[#171717]"
                    >
                      <Pencil className="h-4 w-4" strokeWidth={1.75} />
                    </Link>
                    <IconButton icon={Trash2} label="Slett" variant="danger" onClick={() => remove(p.id)} />
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </>
  );
}
