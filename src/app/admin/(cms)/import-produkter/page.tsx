"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { Database, CheckCircle2, AlertCircle, Loader2, ArrowLeft } from "lucide-react";
import { supabase } from "@/lib/supabase";
import { getCurrentSite, type Site } from "@/lib/site";
import { revalidatePublicSite } from "@/app/actions/revalidate";
import { SEED_PRODUCTS } from "@/lib/seed-products";
import PageHeader from "@/components/admin/PageHeader";

type ResultRow = { slug: string; status: "inserted" | "skipped" | "error"; message?: string };

export default function ImportProduktsPage() {
  const [site, setSite] = useState<Site | null>(null);
  const [existingSlugs, setExistingSlugs] = useState<Set<string>>(new Set());
  const [loading, setLoading] = useState(true);
  const [running, setRunning] = useState(false);
  const [results, setResults] = useState<ResultRow[]>([]);
  const [done, setDone] = useState(false);

  async function refreshExisting(siteId: string) {
    const { data } = await supabase
      .from("products")
      .select("slug")
      .eq("site_id", siteId);
    setExistingSlugs(new Set((data ?? []).map((r) => r.slug)));
  }

  useEffect(() => {
    let cancelled = false;
    (async () => {
      const s = await getCurrentSite();
      if (cancelled || !s) return;
      setSite(s);
      await refreshExisting(s.id);
      if (!cancelled) setLoading(false);
    })();
    return () => { cancelled = true; };
  }, []);

  const toImport = SEED_PRODUCTS.filter((p) => !existingSlugs.has(p.slug));

  async function runImport() {
    if (!site) return;
    setRunning(true);
    setDone(false);
    setResults([]);

    const newResults: ResultRow[] = [];
    for (const p of SEED_PRODUCTS) {
      if (existingSlugs.has(p.slug)) {
        newResults.push({ slug: p.slug, status: "skipped", message: "Slug fins allerede" });
        setResults([...newResults]);
        continue;
      }
      const { error } = await supabase.from("products").insert({
        site_id: site.id,
        category_slug: p.category_slug,
        slug: p.slug,
        title: p.title,
        short_description: p.short_description,
        long_description: p.long_description,
        hero_image_url: p.hero_image_url,
        gallery_images: p.gallery_images,
        specs: p.specs,
        variants: [],
        price_from: null,
        price_unit: "",
        sort_order: p.sort_order,
        published: true,
      });
      if (error) {
        newResults.push({ slug: p.slug, status: "error", message: error.message });
      } else {
        newResults.push({ slug: p.slug, status: "inserted" });
      }
      setResults([...newResults]);
    }

    await refreshExisting(site.id);
    await revalidatePublicSite();
    setRunning(false);
    setDone(true);
  }

  const totalSeed = SEED_PRODUCTS.length;
  const insertedCount = results.filter((r) => r.status === "inserted").length;
  const skippedCount = results.filter((r) => r.status === "skipped").length;
  const errorCount = results.filter((r) => r.status === "error").length;

  return (
    <>
      <PageHeader
        title="Importer produkter"
        subtitle="Engangsverktøy som flytter de hardkodede produktene inn i databasen"
        right={
          <Link
            href="/admin/produkter"
            className="inline-flex items-center gap-1.5 rounded-full border border-[#ececec] bg-white px-3.5 py-2 text-[12.5px] font-medium text-[#525252] transition duration-150 hover:border-[#d4d4d4] hover:text-[#171717]"
          >
            <ArrowLeft className="h-3.5 w-3.5" strokeWidth={1.75} />
            Til Produkter
          </Link>
        }
      />

      <div className="flex-1 overflow-y-auto bg-[#fafaf9] p-8 lg:p-10">
        <div className="mx-auto max-w-3xl space-y-5">
          <div className="flex gap-3 rounded-xl border border-[#ececec] bg-white p-5">
            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-[#fef2f2] text-[#dc2626] ring-1 ring-rose-100">
              <Database className="h-5 w-5" strokeWidth={1.75} />
            </div>
            <div className="flex-1">
              <h2 className="text-[15px] font-semibold tracking-tight text-[#171717]">
                {totalSeed} produkter klar til import
              </h2>
              <p className="mt-1 text-[12.5px] leading-relaxed text-[#737373]">
                Disse er hentet fra koden under <span className="font-mono text-[11.5px] text-[#525252]">src/app/produkter/{`{kategori}`}/page.tsx</span>.
                Eksisterende produkter (samme slug) hoppes over — du kan kjøre importen flere ganger uten duplikater.
              </p>
              {!loading && (
                <p className="mt-2.5 text-[12px] text-[#737373]">
                  <span className="font-medium text-[#171717]">{toImport.length}</span> nye •{" "}
                  <span className="font-medium text-[#171717]">{existingSlugs.size}</span> finnes allerede i databasen
                </p>
              )}
            </div>
          </div>

          <div className="rounded-xl border border-[#ececec] bg-white p-5">
            <div className="flex items-center justify-between gap-4">
              <div>
                <h3 className="text-[14px] font-semibold tracking-tight text-[#171717]">Kjør import</h3>
                <p className="mt-0.5 text-[12px] text-[#737373]">
                  Lager rader i <span className="font-mono">products</span>-tabellen for nettstedet ditt.
                </p>
              </div>
              <button
                onClick={runImport}
                disabled={loading || running || toImport.length === 0}
                className="inline-flex items-center gap-1.5 rounded-full bg-[#171717] px-5 py-2.5 text-[13px] font-semibold text-white shadow-[0_1px_2px_rgba(0,0,0,0.08)] transition duration-150 hover:bg-[#000] hover:shadow-[0_4px_12px_rgba(0,0,0,0.15)] disabled:cursor-not-allowed disabled:bg-[#e5e5e4] disabled:text-[#a3a3a3] disabled:shadow-none"
              >
                {running ? (
                  <>
                    <Loader2 className="h-3.5 w-3.5 animate-spin" strokeWidth={2} />
                    Importerer...
                  </>
                ) : toImport.length === 0 ? (
                  "Alt er allerede importert"
                ) : (
                  `Importer ${toImport.length} produkter`
                )}
              </button>
            </div>
          </div>

          {results.length > 0 && (
            <div className="rounded-xl border border-[#ececec] bg-white">
              <div className="flex items-center justify-between gap-4 border-b border-[#ececec] bg-[#fafaf9] px-5 py-3">
                <h3 className="text-[13px] font-semibold tracking-tight text-[#171717]">
                  Resultat
                </h3>
                <div className="flex gap-2 text-[11px]">
                  <span className="rounded-full bg-emerald-50 px-2 py-0.5 font-medium text-emerald-700">
                    {insertedCount} importert
                  </span>
                  {skippedCount > 0 && (
                    <span className="rounded-full bg-[#f5f5f4] px-2 py-0.5 font-medium text-[#737373]">
                      {skippedCount} hoppet over
                    </span>
                  )}
                  {errorCount > 0 && (
                    <span className="rounded-full bg-red-50 px-2 py-0.5 font-medium text-red-700">
                      {errorCount} feilet
                    </span>
                  )}
                </div>
              </div>
              <div className="divide-y divide-[#f5f5f4]">
                {results.map((r) => (
                  <div key={r.slug} className="flex items-center gap-3 px-5 py-2.5">
                    {r.status === "inserted" && (
                      <CheckCircle2 className="h-4 w-4 shrink-0 text-emerald-600" strokeWidth={1.75} />
                    )}
                    {r.status === "skipped" && (
                      <span className="flex h-4 w-4 shrink-0 items-center justify-center rounded-full bg-[#e5e5e4] text-[10px] font-bold text-[#737373]">·</span>
                    )}
                    {r.status === "error" && (
                      <AlertCircle className="h-4 w-4 shrink-0 text-red-600" strokeWidth={1.75} />
                    )}
                    <span className="flex-1 font-mono text-[12px] text-[#525252]">{r.slug}</span>
                    {r.message && (
                      <span className="text-[11.5px] text-[#a3a3a3]">{r.message}</span>
                    )}
                  </div>
                ))}
              </div>
            </div>
          )}

          {done && insertedCount > 0 && (
            <div className="rounded-xl border border-emerald-200 bg-emerald-50 p-5">
              <div className="flex items-center gap-2.5">
                <CheckCircle2 className="h-5 w-5 shrink-0 text-emerald-700" strokeWidth={1.75} />
                <p className="text-[13px] font-semibold text-emerald-900">
                  Ferdig — {insertedCount} {insertedCount === 1 ? "produkt" : "produkter"} importert
                </p>
              </div>
              <p className="mt-2 text-[12.5px] leading-relaxed text-emerald-800">
                Produktene vises nå under <Link href="/admin/produkter" className="underline">Produkter</Link>-fanen og på de offentlige kategori-sidene.
                Public-sidens hardkodede fallback brukes kun hvis databasen er tom.
              </p>
            </div>
          )}
        </div>
      </div>
    </>
  );
}
