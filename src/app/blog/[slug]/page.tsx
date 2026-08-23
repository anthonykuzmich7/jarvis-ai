import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ContentShell } from "@/components/site-shell";
import { CtaBand, Note } from "@/components/content/primitives";
import {
  type Block,
  findPost,
  posts,
  readingMinutes,
  wordCount,
} from "@/lib/content/posts";
import { SITE_NAME, url } from "@/lib/site";
import {
  breadcrumbJsonLd,
  jsonLdString,
} from "@/lib/structured-data";
import { SITE_URL } from "@/lib/site";

type Props = { params: Promise<{ slug: string }> };

export function generateStaticParams() {
  return posts.map((post) => ({ slug: post.slug }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const post = findPost(slug);
  if (!post) return {};
  return {
    title: post.title,
    description: post.description,
    alternates: { canonical: `/blog/${post.slug}` },
    openGraph: {
      title: post.title,
      description: post.description,
      url: `/blog/${post.slug}`,
      type: "article",
      publishedTime: post.published,
    },
  };
}

/* One renderer per block kind. A switch rather than a lookup object so a new
   block type is a type error here until it is handled. */
function BlockView({ block }: { block: Block }) {
  switch (block.kind) {
    case "h2":
      return (
        <h2 className="mb-3 mt-10 font-display text-[22px] font-bold leading-[1.2] tracking-[-0.6px] text-coal-ink sm:text-[26px] sm:tracking-[-0.8px]">
          {block.text}
        </h2>
      );
    case "h3":
      return (
        <h3 className="mb-2 mt-7 font-display text-[16.5px] font-semibold leading-[1.3] tracking-[-0.3px] text-coal-ink">
          {block.text}
        </h3>
      );
    case "p":
      return (
        <p className="mb-4 text-[16px] leading-[1.7] tracking-[-0.12px] text-slate-mid">
          {block.text}
        </p>
      );
    case "ul":
      return (
        <ul className="mb-5 space-y-2 pl-1">
          {block.items.map((item) => (
            <li
              key={item}
              className="flex gap-3 text-[15.5px] leading-[1.65] tracking-[-0.1px] text-slate-mid"
            >
              <span aria-hidden className="mt-[9px] h-1 w-1 shrink-0 rounded-full bg-fossil" />
              <span>{item}</span>
            </li>
          ))}
        </ul>
      );
    case "code":
      return (
        <div className="mb-6 mt-5 overflow-x-auto rounded-[12px] border border-ash bg-coal-ink px-5 py-4">
          <pre className="font-mono text-[12.5px] leading-[1.75] text-white/80">
            {block.lines.join("\n")}
          </pre>
        </div>
      );
    case "note":
      return (
        <div className="my-7">
          <Note label={block.label}>
            <p>{block.text}</p>
          </Note>
        </div>
      );
  }
}

export default async function PostPage({ params }: Props) {
  const { slug } = await params;
  const post = findPost(slug);
  if (!post) notFound();

  const others = posts.filter((p) => p.slug !== post.slug);

  const articleJsonLd = {
    "@context": "https://schema.org",
    "@type": "BlogPosting",
    "@id": `${SITE_URL}/blog/${post.slug}#article`,
    headline: post.title,
    description: post.description,
    url: url(`/blog/${post.slug}`),
    datePublished: post.published,
    dateModified: post.published,
    wordCount: wordCount(post),
    inLanguage: "en",
    author: { "@type": "Organization", name: SITE_NAME, url: url("/") },
    publisher: { "@id": `${SITE_URL}/#organization` },
    mainEntityOfPage: { "@type": "WebPage", "@id": url(`/blog/${post.slug}`) },
  };

  return (
    <ContentShell>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: jsonLdString(articleJsonLd) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: jsonLdString(
            breadcrumbJsonLd([
              { name: "Home", path: "/" },
              { name: "Writing", path: "/blog" },
              { name: post.title, path: `/blog/${post.slug}` },
            ]),
          ),
        }}
      />

      <article className="mx-auto w-full max-w-6xl px-5 py-8 sm:px-6 sm:py-12">
        <div className="max-w-[68ch]">
          <Link
            href="/blog"
            className="text-[13px] font-medium text-graphite transition-colors hover:text-coal-ink"
          >
            ← Writing
          </Link>

          <h1 className="mt-6 font-display text-[30px] font-bold leading-[1.08] tracking-[-1px] text-coal-ink text-balance sm:text-[40px] sm:tracking-[-1.4px]">
            {post.title}
          </h1>

          <div className="mt-4 flex items-center gap-3 text-[12.5px] text-stone">
            <time dateTime={post.published}>
              {new Date(post.published).toLocaleDateString("en-GB", {
                day: "numeric",
                month: "long",
                year: "numeric",
              })}
            </time>
            <span aria-hidden>·</span>
            <span>{readingMinutes(post)} min read</span>
          </div>

          <div className="mt-9">
            {post.body.map((block, i) => (
              <BlockView key={i} block={block} />
            ))}
          </div>
        </div>
      </article>

      {others.length > 0 && (
        <section className="mx-auto w-full max-w-6xl px-5 pb-4 sm:px-6">
          <div className="max-w-[68ch] border-t border-ash pt-7">
            <p className="text-[11px] font-semibold uppercase tracking-[0.1em] text-stone">
              Read next
            </p>
            {others.map((other) => (
              <Link
                key={other.slug}
                href={`/blog/${other.slug}`}
                className="mt-4 block"
              >
                <p className="font-display text-[18px] font-semibold leading-[1.25] tracking-[-0.4px] text-coal-ink transition-colors hover:text-graphite">
                  {other.title}
                </p>
                <p className="mt-1.5 text-[14.5px] leading-[1.6] text-slate-mid">
                  {other.description}
                </p>
              </Link>
            ))}
          </div>
        </section>
      )}

      <CtaBand />
    </ContentShell>
  );
}
