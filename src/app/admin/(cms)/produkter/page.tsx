"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import {
  Package,
  Plus,
  Warehouse,
  ShoppingBag,
  Briefcase,
  Wrench,
  Shirt,
  GraduationCap,
  LayoutGrid,
  FolderOpen,
  Pencil,
  Trash2,
  Database,
  type LucideIcon,
} from "lucide-react";
import { supabase } from "@/lib/supabase";
import { getCurrentSite, type Site } from "@/lib/site";
import { revalidatePublicSite } from "@/app/actions/revalidate";
import PageHeader from "@/components/admin/PageHeader";
import EmptyState from "@/components/admin/EmptyState";
import IconButton from "@/components/admin/IconButton";
import KategorierModal from "./KategorierModal";

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

const CATEGORY_ICONS: Record<string, LucideIcon> = {
  lager: Warehouse,
  butikk: ShoppingBag,
  kontor: Briefcase,
  verksted: Wrench,
  garderobe: Shirt,
  skole: GraduationCap,
};

export default function ProdukterListPage() {
  const [site, setSite] = useState<Site | null>(null);
  const [products, setProducts] = useState<ProductRow[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [filter, setFilter] = useState<string>("all");
  const [loading, setLoading] = useState(true);
  const [showCategories, setShowCategories] = useState(false);

  async function loadCategories(siteId: string) {
    const { data } = await supabase
      .from("categories")
      .select("slug, title")
      .eq("site_id", siteId)
      .order("sort_order");
    setCategories((data ?? []) as Category[]);
  }

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
    if (!confirm("Slette dette produktet? Det kan ikke angres.")) return;
    const { error } = await supabase.from("products").delete().eq("id", id);
    if (!error) {
      setProducts((prev) => prev.filter((p) => p.id !== id));
      await revalidatePublicSite();
    } else alert("Feil: " + error.message);
  }

  return (
    <>
      <PageHeader
        title="Produkter"
        subtitle={`${products.length} ${products.length === 1 ? "produkt" : "produkter"} totalt`}
        right={
          <>
            {products.length === 0 && (
              <Link
                href="/admin/import-produkter"
                className="inline-flex items-center gap-1.5 rounded-full border border-[#dc2626] bg-white px-3.5 py-2 text-[12.5px] font-medium text-[#dc2626] transition duration-150 hover:bg-rose-50"
              >
                <Database className="h-3.5 w-3.5" strokeWidth={1.75} />
                Importer fra kode
              </Link>
            )}
            <button
              onClick={() => setShowCategories(true)}
              className="inline-flex items-center gap-1.5 rounded-full border border-[#ececec] bg-white px-3.5 py-2 text-[12.5px] font-medium text-[#525252] transition duration-150 hover:border-[#d4d4d4] hover:bg-[#fafaf9] hover:text-[#171717]"
            >
              <FolderOpen className="h-3.5 w-3.5" strokeWidth={1.75} />
              Rediger kategorier
            </button>
            <Link
              href="/admin/produkter/ny"
              className="inline-flex items-center gap-1.5 rounded-full bg-[#171717] px-4 py-2 text-[12.5px] font-semibold text-white shadow-[0_1px_2px_rgba(0,0,0,0.08)] transition duration-150 hover:bg-[#000] hover:shadow-[0_4px_12px_rgba(0,0,0,0.12)]"
            >
              <Plus className="h-3.5 w-3.5" strokeWidth={2.25} />
              Nytt produkt
            </Link>
          </>
        }
      />

      <div className="flex-1 overflow-y-auto bg-[#fafaf9] p-8 lg:p-10">
        <div className="mx-auto max-w-4xl space-y-5">
          <div className="flex flex-wrap gap-1.5">
            <FilterTab
              icon={LayoutGrid}
              label="Alle"
              count={products.length}
              active={filter === "all"}
              onClick={() => setFilter("all")}
            />
            {categories.map((c) => {
              const Icon = CATEGORY_ICONS[c.slug] ?? Package;
              return (
                <FilterTab
                  key={c.slug}
                  icon={Icon}
                  label={c.title}
                  count={products.filter((p) => p.category_slug === c.slug).length}
                  active={filter === c.slug}
                  onClick={() => setFilter(c.slug)}
                />
              );
            })}
          </div>

          {loading ? (
            <div className="flex h-40 items-center justify-center">
              <span className="text-[13px] text-[#a3a3a3]">Laster…</span>
            </div>
          ) : visible.length === 0 ? (
            <EmptyState
              icon={Package}
              title={
                filter === "all"
                  ? "Ingen produkter ennå"
                  : `Ingen produkter i ${categories.find((c) => c.slug === filter)?.title ?? filter}`
              }
              description={
                filter === "all"
                  ? "Reol-Consult har 28 produkter definert i koden — bruk «Importer fra kode»-knappen øverst for å migrere alle på en gang. Eller legg til ett-og-ett manuelt."
                  : "Legg til et produkt i denne kategorien, eller bytt til en annen kategori for å se produkter der."
              }
              actionLabel="Legg til ditt første produkt"
              actionHref="/admin/produkter/ny"
            />
          ) : (
            <div className="overflow-hidden rounded-xl border border-[#ececec] bg-white">
              {visible.map((p, i) => (
                <div
                  key={p.id}
                  className={`group flex items-center gap-4 px-4 py-3.5 transition-colors duration-150 hover:bg-[#fafaf9] ${
                    i < visible.length - 1 ? "border-b border-[#f5f5f4]" : ""
                  }`}
                >
                  <Link
                    href={`/admin/produkter/${p.id}`}
                    className="flex flex-1 items-center gap-4 min-w-0"
                  >
                    <div className="relative h-14 w-20 shrink-0 overflow-hidden rounded-lg bg-[#fafaf9] ring-1 ring-[#ececec]">
                      {p.hero_image_url ? (
                        <Image src={p.hero_image_url} alt="" fill sizes="80px" className="object-cover" unoptimized />
                      ) : (
                        <div className="flex h-full w-full items-center justify-center text-[#d4d4d4]">
                          <Package className="h-5 w-5" strokeWidth={1.5} />
                        </div>
                      )}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2">
                        <p className="truncate text-[13.5px] font-semibold text-[#171717]">{p.title}</p>
                        {!p.published && (
                          <span className="rounded-full bg-[#f5f5f4] px-2 py-0.5 text-[10px] font-medium text-[#737373]">
                            Skjult
                          </span>
                        )}
                      </div>
                      <p className="mt-0.5 text-[11.5px] text-[#a3a3a3]">
                        {categories.find((c) => c.slug === p.category_slug)?.title ?? p.category_slug}
                        <span className="text-[#d4d4d4]"> · </span>
                        <span className="font-mono">/{p.slug}</span>
                      </p>
                      {p.price_from != null && (
                        <p className="mt-0.5 text-[11.5px] text-[#737373]">Fra {p.price_from} kr eks. mva {p.price_unit}</p>
                      )}
                    </div>
                  </Link>
                  <div className="flex items-center gap-0.5 opacity-0 transition-opacity duration-150 group-hover:opacity-100">
                    <Link
                      href={`/admin/produkter/${p.id}`}
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

      {showCategories && site && (
        <KategorierModal
          siteId={site.id}
          onClose={() => setShowCategories(false)}
          onChanged={() => loadCategories(site.id)}
        />
      )}
    </>
  );
}

function FilterTab({
  icon: Icon,
  label,
  count,
  active,
  onClick,
}: {
  icon: LucideIcon;
  label: string;
  count: number;
  active: boolean;
  onClick: () => void;
}) {
  return (
    <button
      onClick={onClick}
      className={`inline-flex items-center gap-1.5 rounded-full border px-3.5 py-1.5 text-[12px] font-medium transition duration-150 ${
        active
          ? "border-[#171717] bg-[#171717] text-white shadow-[0_1px_2px_rgba(0,0,0,0.08)]"
          : "border-[#ececec] bg-white text-[#525252] hover:border-[#d4d4d4] hover:text-[#171717]"
      }`}
    >
      <Icon className="h-3.5 w-3.5" strokeWidth={1.75} />
      {label}
      <span
        className={`rounded-full px-1.5 text-[10px] ${
          active ? "bg-white/20 text-white" : "bg-[#f5f5f4] text-[#737373]"
        }`}
      >
        {count}
      </span>
    </button>
  );
}
