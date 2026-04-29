"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useParams, useRouter } from "next/navigation";
import { supabase } from "@/lib/supabase";
import { getCurrentSite, type Site } from "@/lib/site";
import MediaPicker from "@/components/admin/MediaPicker";
import RichTextEditor from "@/components/admin/RichTextEditor";
import SaveBar from "@/components/admin/SaveBar";
import UnsavedChangesGuard from "@/components/admin/UnsavedChangesGuard";
import { revalidatePublicSite } from "@/app/actions/revalidate";

type Post = {
  id: string;
  site_id: string;
  slug: string;
  title: string;
  excerpt: string;
  body: string;
  cover_image_url: string | null;
  author_name: string;
  status: "draft" | "published";
  published_at: string | null;
};

const EMPTY: Post = {
  id: "",
  site_id: "",
  slug: "",
  title: "",
  excerpt: "",
  body: "",
  cover_image_url: null,
  author_name: "",
  status: "draft",
  published_at: null,
};

export default function BloggEditor() {
  const params = useParams<{ id: string }>();
  const router = useRouter();
  const isNew = params.id === "ny";

  const [site, setSite] = useState<Site | null>(null);
  const [post, setPost] = useState<Post>(EMPTY);
  const [loading, setLoading] = useState(true);
  const [dirty, setDirty] = useState(false);
  const [status, setStatus] = useState<"idle" | "saving" | "saved" | "error">("idle");
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;
    (async () => {
      const s = await getCurrentSite();
      if (!s || cancelled) return;
      setSite(s);
      if (isNew) {
        setPost({ ...EMPTY, site_id: s.id });
        setLoading(false);
        return;
      }
      const { data, error } = await supabase.from("blog_posts").select("*").eq("id", params.id).maybeSingle();
      if (!cancelled) {
        if (error || !data) {
          setErrorMessage("Fant ikke innlegget");
          setLoading(false);
          return;
        }
        setPost(data as Post);
        setLoading(false);
      }
    })();
    return () => { cancelled = true; };
  }, [params.id, isNew]);

  function update<K extends keyof Post>(key: K, value: Post[K]) {
    setPost((prev) => ({ ...prev, [key]: value }));
    setDirty(true);
    setStatus("idle");
  }

  async function save(newStatus?: "draft" | "published") {
    if (!site) return;
    if (!post.slug.match(/^[a-z0-9-]+$/)) {
      setStatus("error");
      setErrorMessage("Slug kan kun inneholde små bokstaver, tall og bindestrek.");
      return;
    }
    setStatus("saving");
    setErrorMessage(null);
    const finalStatus = newStatus ?? post.status;
    const payload = {
      site_id: site.id,
      slug: post.slug,
      title: post.title,
      excerpt: post.excerpt,
      body: post.body,
      cover_image_url: post.cover_image_url,
      author_name: post.author_name,
      status: finalStatus,
      published_at: finalStatus === "published" ? (post.published_at ?? new Date().toISOString()) : null,
    };
    if (post.id) {
      const { error } = await supabase.from("blog_posts").update(payload).eq("id", post.id);
      if (error) { setStatus("error"); setErrorMessage(error.message); return; }
      setPost((prev) => ({ ...prev, status: finalStatus, published_at: payload.published_at }));
    } else {
      const { data, error } = await supabase.from("blog_posts").insert(payload).select().single();
      if (error || !data) { setStatus("error"); setErrorMessage(error?.message ?? "Feilet"); return; }
      router.replace(`/admin/blogg/${data.id}`);
    }
    await revalidatePublicSite();
    setDirty(false);
    setStatus("saved");
  }

  if (loading) return <div className="flex flex-1 items-center justify-center"><div className="h-8 w-8 animate-spin rounded-full border-2 border-[#dc2626] border-t-transparent" /></div>;

  return (
    <>
      <UnsavedChangesGuard dirty={dirty} />
      <SaveBar
        title={isNew ? "Nytt innlegg" : post.title || "Innlegg"}
        dirty={dirty}
        status={status}
        onSave={() => save()}
        errorMessage={errorMessage}
        rightContent={
          <>
            <Link href="/admin/blogg" className="rounded-full border border-[#e5e5e5] px-4 py-2 text-sm font-medium text-[#404040] hover:bg-[#f5f5f5]">← Til listen</Link>
            {post.status === "draft" ? (
              <button onClick={() => save("published")} disabled={status === "saving"} className="rounded-full bg-emerald-600 px-4 py-2 text-sm font-medium text-white hover:bg-emerald-700 disabled:opacity-50">Publiser</button>
            ) : (
              <button onClick={() => save("draft")} disabled={status === "saving"} className="rounded-full border border-[#e5e5e5] px-4 py-2 text-sm font-medium text-[#404040] hover:bg-[#f5f5f5]">Avpubliser</button>
            )}
          </>
        }
      />

      <div className="flex-1 overflow-y-auto p-6 lg:p-8">
        <div className="mx-auto max-w-3xl space-y-6">
          <Card title="Grunninfo">
            <div className="space-y-4">
              <FieldText label="Tittel" value={post.title} onChange={(v) => update("title", v)} />
              <FieldText label="Slug (URL-vennlig)" value={post.slug} onChange={(v) => update("slug", v)} placeholder="hvordan-velge-pallreoler" />
              <FieldText label="Forfatter" value={post.author_name} onChange={(v) => update("author_name", v)} />
              <label className="block">
                <span className="text-xs font-medium text-[#737373]">Ingress (kort sammendrag)</span>
                <textarea value={post.excerpt} onChange={(e) => update("excerpt", e.target.value)} rows={2} className="mt-1 w-full rounded-lg border border-[#e5e5e5] bg-[#fafafa] px-3 py-2.5 text-sm focus:border-[#dc2626] focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#dc2626]/20" />
              </label>
              {site && <MediaPicker value={post.cover_image_url} onChange={(url) => update("cover_image_url", url)} siteId={site.id} defaultCategory="blog" label="Forsidebilde" />}
            </div>
          </Card>

          <Card title="Innhold">
            <RichTextEditor value={post.body} onChange={(v) => update("body", v)} height={400} />
          </Card>
        </div>
      </div>
    </>
  );
}

function Card({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <section className="rounded-2xl border border-[#e5e5e5] bg-white p-6">
      <h3 className="text-sm font-semibold text-[#171717]">{title}</h3>
      <div className="mt-4">{children}</div>
    </section>
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
