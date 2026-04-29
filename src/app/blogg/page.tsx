import Link from "next/link";
import Image from "next/image";
import AnimateOnScroll from "@/components/AnimateOnScroll";
import { getCurrentSite } from "@/lib/site";
import { supabase } from "@/lib/supabase";

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
            <span className="text-sm font-semibold uppercase tracking-[0.2em] text-accent">
              Blogg
            </span>
            <h1 className="mt-4 text-3xl font-bold leading-tight tracking-tight text-primary sm:text-4xl md:text-5xl">
              Tips, råd og nyheter
            </h1>
          </AnimateOnScroll>
        </div>
      </section>

      <section className="bg-white py-16 sm:py-24">
        <div className="mx-auto max-w-6xl px-4 sm:px-6">
          {posts.length === 0 ? (
            <p className="text-center text-text-muted">Ingen blogginnlegg er publisert ennå.</p>
          ) : (
            <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {posts.map((post) => (
                <AnimateOnScroll key={post.id}>
                  <Link
                    href={`/blogg/${post.slug}`}
                    className="group flex h-full flex-col overflow-hidden rounded-2xl border border-border bg-white transition-all hover:-translate-y-0.5 hover:shadow-[0_20px_50px_rgba(0,0,0,0.08)]"
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
                      <h2 className="mt-2 text-lg font-semibold text-primary">{post.title}</h2>
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
