import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import ReactMarkdown from "react-markdown";
import AnimateOnScroll from "@/components/AnimateOnScroll";
import { getCurrentSite } from "@/lib/site";
import { supabase } from "@/lib/supabase";

type Post = {
  id: string;
  slug: string;
  title: string;
  excerpt: string;
  body: string;
  cover_image_url: string | null;
  author_name: string;
  published_at: string;
};

async function getPost(siteId: string, slug: string): Promise<Post | null> {
  const { data } = await supabase
    .from("blog_posts")
    .select("*")
    .eq("site_id", siteId)
    .eq("slug", slug)
    .eq("status", "published")
    .maybeSingle();
  return (data as Post | null) ?? null;
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params;
  const site = await getCurrentSite();
  if (!site) return { title: "Innlegg" };
  const post = await getPost(site.id, slug);
  if (!post) return { title: "Innlegg ikke funnet" };
  return {
    title: `${post.title} – Reol-Consult AS`,
    description: post.excerpt,
    openGraph: {
      title: post.title,
      description: post.excerpt,
      images: post.cover_image_url ? [post.cover_image_url] : undefined,
    },
  };
}

export default async function PostPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const site = await getCurrentSite();
  if (!site) return notFound();
  const post = await getPost(site.id, slug);
  if (!post) return notFound();

  return (
    <article>
      {post.cover_image_url && (
        <div className="relative aspect-[16/9] max-h-[500px] w-full overflow-hidden bg-bg-light">
          <Image
            src={post.cover_image_url}
            alt={post.title}
            fill
            sizes="100vw"
            className="object-cover"
            unoptimized
            priority
          />
        </div>
      )}

      <div className="mx-auto max-w-3xl px-4 py-12 sm:px-6 sm:py-16">
        <AnimateOnScroll>
          <Link
            href="/blogg"
            className="inline-flex items-center gap-1.5 text-sm text-text-muted transition-colors hover:text-primary"
          >
            ← Tilbake til bloggen
          </Link>
          <p className="mt-6 text-sm text-text-muted">
            {new Date(post.published_at).toLocaleDateString("nb-NO", {
              day: "numeric",
              month: "long",
              year: "numeric",
            })}
            {post.author_name && ` · ${post.author_name}`}
          </p>
          <h1 className="mt-3 text-3xl font-bold tracking-tight text-primary sm:text-4xl md:text-5xl">
            {post.title}
          </h1>
          {post.excerpt && (
            <p className="mt-6 text-lg leading-relaxed text-text-muted">{post.excerpt}</p>
          )}
        </AnimateOnScroll>

        <AnimateOnScroll delay={0.1}>
          <div className="prose prose-lg mt-12 max-w-none text-text-dark prose-headings:text-primary prose-a:text-accent">
            <ReactMarkdown>{post.body}</ReactMarkdown>
          </div>
        </AnimateOnScroll>
      </div>
    </article>
  );
}
