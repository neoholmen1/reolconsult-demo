import type { Metadata } from "next";
import Link from "next/link";
import Image from "next/image";
import AnimateOnScroll from "@/components/AnimateOnScroll";
import { getCurrentSite } from "@/lib/site";
import { supabase } from "@/lib/supabase";

export const metadata: Metadata = {
  title: "Blogg – Reol-Consult AS",
  description:
    "Tips, råd og nyheter om innredning til lager, butikk, kontor og verksted fra Reol-Consult AS.",
  openGraph: {
    title: "Blogg – Reol-Consult AS",
    description:
      "Tips, råd og nyheter om innredning fra Reol-Consult AS.",
    type: "website",
    url: "https://reolconsult.no/blogg",
  },
};

type Post = {
  id: string;
  slug: string;
  title: string;
  excerpt: string;
  cover_image_url: string | null;
  author_name: string;
  published_at: string;
};

async function getPosts(siteId: string): Promise<Post[]> {
  const { data } = await supabase
    .from("blog_posts")
    .select("id, slug, title, excerpt, cover_image_url, author_name, published_at")
    .eq("site_id", siteId)
    .eq("status", "published")
    .order("published_at", { ascending: false });
  return (data ?? []) as Post[];
}

export default async function BloggPage() {
  const site = await getCurrentSite();
  const posts = site ? await getPosts(site.id) : [];

  return (
    <div>
      <section className="bg-bg-light pt-8 pb-16 sm:pt-20 sm:pb-24">
        <div className="mx-auto max-w-6xl px-4 sm:px-6">
          <AnimateOnScroll>
            <p className="inline-flex items-center gap-2.5 text-xs font-semibold uppercase tracking-[0.22em] text-accent">
              <span className="h-px w-7 bg-accent/50" />
              Blogg
            </p>
            <h1 className="mt-5 font-display text-4xl font-semibold leading-[1.05] tracking-[-0.02em] text-primary sm:text-5xl md:text-6xl">
              Tips, råd og nyheter
            </h1>
          </AnimateOnScroll>
        </div>
      </section>

      <section className="bg-surface-warm py-16 sm:py-24">
        <div className="mx-auto max-w-6xl px-4 sm:px-6">
          {posts.length === 0 ? (
            <AnimateOnScroll>
              <div className="mx-auto flex max-w-md flex-col items-center rounded-3xl border border-dashed border-border bg-surface px-6 py-16 text-center shadow-[var(--shadow-soft)]">
                <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-accent/10 text-accent">
                  <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.6}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M16.862 4.487l1.687-1.688a1.875 1.875 0 112.652 2.652L10.582 16.07a4.5 4.5 0 01-1.897 1.13L6 18l.8-2.685a4.5 4.5 0 011.13-1.897l8.932-8.931zm0 0L19.5 7.125M18 14v4.75A2.25 2.25 0 0115.75 21H5.25A2.25 2.25 0 013 18.75V8.25A2.25 2.25 0 015.25 6H10" />
                  </svg>
                </div>
                <h2 className="mt-5 font-display text-xl font-semibold tracking-[-0.02em] text-primary">Ingen innlegg ennå</h2>
                <p className="mt-2 text-sm leading-relaxed text-text-muted">
                  Vi jobber med å publisere våre første artikler om innredning, leveranser og bransjenyheter.
                  Sjekk innom igjen snart, eller ta kontakt om du har spørsmål.
                </p>
                <Link
                  href="/kontakt"
                  className="mt-6 inline-flex items-center gap-1.5 rounded-full border border-primary/20 px-5 py-2 text-sm font-medium text-primary transition duration-200 hover:border-primary/40 hover:bg-primary/5"
                >
                  Kontakt oss
                </Link>
              </div>
            </AnimateOnScroll>
          ) : (
            <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {posts.map((post) => (
                <AnimateOnScroll key={post.id}>
                  <Link
                    href={`/blogg/${post.slug}`}
                    className="group flex h-full flex-col overflow-hidden rounded-3xl border border-border bg-surface shadow-[var(--shadow-soft)] transition duration-200 hover:-translate-y-1 hover:shadow-[var(--shadow-lift)]"
                  >
                    {post.cover_image_url && (
                      <div className="relative aspect-[16/10] overflow-hidden bg-bg-light">
                        <Image
                          src={post.cover_image_url}
                          alt={post.title}
                          fill
                          sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                          className="object-cover transition-transform duration-500 group-hover:scale-[1.03]"
                          unoptimized
                        />
                      </div>
                    )}
                    <div className="flex flex-1 flex-col p-6">
                      <p className="text-xs text-text-muted">
                        {new Date(post.published_at).toLocaleDateString("nb-NO", {
                          day: "numeric",
                          month: "long",
                          year: "numeric",
                        })}
                        {post.author_name && ` · ${post.author_name}`}
                      </p>
                      <h2 className="mt-2 font-display text-lg font-semibold tracking-[-0.02em] text-primary">{post.title}</h2>
                      {post.excerpt && (
                        <p className="mt-2 line-clamp-3 text-sm leading-relaxed text-text-muted">
                          {post.excerpt}
                        </p>
                      )}
                    </div>
                  </Link>
                </AnimateOnScroll>
              ))}
            </div>
          )}
        </div>
      </section>
    </div>
  );
}
