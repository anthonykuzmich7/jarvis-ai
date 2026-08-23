import type { Metadata } from "next";
import Link from "next/link";
import { ContentShell } from "@/components/site-shell";
import { CtaBand, PageHero } from "@/components/content/primitives";
import { findPage, metaTitle } from "@/lib/content/pages";
import { posts, readingMinutes } from "@/lib/content/posts";
import {
  breadcrumbJsonLd,
  jsonLdString,
  pageJsonLd,
} from "@/lib/structured-data";
import { url } from "@/lib/site";

const page = findPage("/blog");

export const metadata: Metadata = {
  title: metaTitle(page),
  description: page.description,
  alternates: { canonical: page.path },
  openGraph: {
    title: page.title,
    description: page.description,
    url: page.path,
    type: "website",
  },
};

const dateLabel = (iso: string) =>
  new Date(iso).toLocaleDateString("en-GB", {
    day: "numeric",
    month: "long",
    year: "numeric",
  });

export default function BlogIndex() {
  /* Newest first. Sorted on a copy — `posts` is module state shared with the
     detail route, and sorting it in place would reorder it there too. */
  const ordered = [...posts].sort((a, b) =>
    b.published.localeCompare(a.published),
  );

  return (
    <ContentShell>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: jsonLdString(pageJsonLd(page)),
        }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: jsonLdString(
            breadcrumbJsonLd([
              { name: "Home", path: "/" },
              { name: "Writing", path: page.path },
            ]),
          ),
        }}
      />
      {/* An ItemList of the posts, so a crawler sees the index as a list of
          articles rather than a page of links it has to infer structure from. */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: jsonLdString({
            "@context": "https://schema.org",
            "@type": "ItemList",
            itemListElement: ordered.map((post, i) => ({
              "@type": "ListItem",
              position: i + 1,
              url: url(`/blog/${post.slug}`),
              name: post.title,
            })),
          }),
        }}
      />

      <PageHero
        eyebrow="Writing"
        title="Notes on context"
        standfirst={
          <>
            Why your AI tools keep forgetting what you told them yesterday, and
            what actually fixes it. Written while building Jarvis, so expect a
            bias — but not, we hope, a dishonest one.
          </>
        }
      />

      <section className="mx-auto w-full max-w-6xl px-5 py-6 sm:px-6 sm:py-10">
        <div className="max-w-[72ch] border-t border-ash">
          {ordered.map((post) => (
            <article key={post.slug} className="border-b border-ash py-7">
              <div className="flex items-center gap-3 text-[12px] text-stone">
                <time dateTime={post.published}>
                  {dateLabel(post.published)}
                </time>
                <span aria-hidden>·</span>
                <span>{readingMinutes(post)} min read</span>
              </div>
              <h2 className="mt-2.5 font-display text-[21px] font-bold leading-[1.2] tracking-[-0.5px] text-coal-ink sm:text-[24px] sm:tracking-[-0.6px]">
                <Link
                  href={`/blog/${post.slug}`}
                  className="transition-colors hover:text-graphite"
                >
                  {post.title}
                </Link>
              </h2>
              <p className="mt-2.5 text-[15px] leading-[1.6] tracking-[-0.12px] text-slate-mid">
                {post.description}
              </p>
              <Link
                href={`/blog/${post.slug}`}
                className="mt-3.5 inline-block text-[14px] font-medium text-coal-ink underline underline-offset-2 transition-colors hover:text-graphite"
              >
                Read it
              </Link>
            </article>
          ))}
        </div>
      </section>

      <CtaBand />
    </ContentShell>
  );
}
