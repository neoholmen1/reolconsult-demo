"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { supabase } from "@/lib/supabase";
import { getCurrentSite, type Site } from "@/lib/site";
import { revalidatePublicSite } from "@/app/actions/revalidate";

type ProductRow = {
  id: string;
  slug: string;
  title: string;
  category_slug: string;
  hero_image_url: string | null;
  price_from: number | null;
  price_unit: string;
  published: boolean;
  sort_order: number;
};

type Category = { slug: string; title: string };

export default function ProdukterListPage() {
  const [site, setSite] = useState<Site | null>(null);
  const [products, setProducts] = useState<ProductRow[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [filter, setFilter] = useState<string>("all");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let cancelled = false;
    (async () => {
      const s = await getCurrentSite();
      if (!s || cancelled) return;
      setSite(s);
      const [p, c] = await Promise.all([
        supabase.from("products").select("id, slug, title, category_slug, hero_image_url, price_from, price_unit, published, sort_order").eq("site_id", s.id).order("category_slug").order("sort_order"),
        supabase.from("categories").select("slug, title").eq("site_id", s.id).order("sort_order"),
      ]);
      if (!cancelled) {
        setProducts((p.data ?? []) as ProductRow[]);
        setCategories((c.data ?? []) as Category[]);
        setLoading(false);
      }
    })();
    return () => { cancelled = true; };
  }, []);

  const visible = filter === "all" ? products : products.filter((p) => p.category_slug === filter);

  async function remove(id: string) {
    if (!confirm("Slette dette produktet?")) return;
    const { error } = await supabase.from("products").delete().eq("id", id);
    if (!error) {
      setProducts((prev) => prev.filter((p) => p.id !== id));
      await revalidatePublicSite();
    } else alert("Feil: " + error.message);
  }

  return (
    <>
      <div className="sticky top-0 z-10 flex h-14 shrink-0 items-center justify-between border-b border-[#e5e5e5] bg-white px-6">
        <h1 className="text-base font-semibold">Produkter</h1>
        <Link href="/admin/produkter/ny" className="rounded-full bg-[#dc2626] px-5 py-2 text-sm font-semibold text-white hover:bg-[#b91c1c]">Nytt produkt</Link>
      </div>

      <div className="flex-1 overflow-y-auto p-6 lg:p-8">
        <div className="mx-auto max-w-4xl space-y-4">
          {/* Filter */}
          <div className="flex flex-wrap gap-1.5">
            <button onClick={() => setFilter("all")} className={`rounded-full px-3 py-1.5 text-xs font-medium ${filter === "all" ? "bg-[#171717] text-white" : "bg-white text-[#404040] hover:bg-[#f5f5f5]"}`}>Alle ({products.length})</button>
            {categories.map((c) => (
              <button key={c.slug} onClick={() => setFilter(c.slug)} className={`rounded-full px-3 py-1.5 text-xs font-medium ${filter === c.slug ? "bg-[#171717] text-white" : "bg-white text-[#404040] hover:bg-[#f5f5f5]"}`}>{c.title} ({products.filter((p) => p.category_slug === c.slug).length})</button>
            ))}
          </div>

          {loading ? (
            <div className="flex h-40 items-center justify-center"><span className="text-sm text-[#a3a3a3]">Laster…</span></div>
          ) : visible.length === 0 ? (
            <div className="flex h-40 items-center justify-center rounded-2xl border border-dashed border-[#e5e5e5] bg-white">
              <p className="text-sm text-[#a3a3a3]">Ingen produkter i denne kategorien.</p>
            </div>
          ) : (
            <div className="space-y-2">
              {visible.map((p) => (
                <div key={p.id} className="flex items-center gap-4 rounded-xl border border-[#e5e5e5] bg-white p-4">
                  <div className="relative h-14 w-20 shrink-0 overflow-hidden rounded-lg bg-[#fafafa]">
                    {p.hero_image_url && <Image src={p.hero_image_url} alt="" fill sizes="80px" className="object-cover" unoptimized />}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2">
                      <p className="truncate text-sm font-semibold">{p.title}</p>
                      {!p.published && <span className="rounded-full bg-[#e5e5e5] px-2 py-0.5 text-[10px] text-[#737373]">Skjult</span>}
                    </div>
                    <p className="text-xs text-[#a3a3a3]">{categories.find((c) => c.slug === p.category_slug)?.title ?? p.category_slug} · /{p.slug}</p>
                    {p.price_from != null && <p className="mt-0.5 text-xs text-[#737373]">Fra {p.price_from} kr {p.price_unit}</p>}
                  </div>
                  <Link href={`/admin/produkter/${p.id}`} className="rounded-md border border-[#e5e5e5] px-3 py-1.5 text-xs hover:bg-[#f5f5f5]">Rediger</Link>
                  <button onClick={() => remove(p.id)} className="rounded-md border border-[#e5e5e5] px-3 py-1.5 text-xs text-[#dc2626] hover:bg-red-50">Slett</button>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </>
  );
}
