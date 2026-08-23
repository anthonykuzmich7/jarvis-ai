import type { MetadataRoute } from "next";
import { url } from "@/lib/site";
import { contentPages } from "@/lib/content/pages";
import { posts } from "@/lib/content/posts";

/*
  Generated from the same registries the pages themselves read, so a new page
  cannot be shipped without appearing here. That failure mode is silent and
  expensive: an unlisted page is simply never crawled, and nothing in the build
  complains.

  /compare stays out deliberately — it is disallowed in robots.ts and carries
  its own noindex.
*/

export default function sitemap(): MetadataRoute.Sitemap {
  const now = new Date();

  return [
    {
      url: url("/"),
      lastModified: now,
      changeFrequency: "weekly",
      priority: 1,
    },
    ...contentPages.map((page) => ({
      url: url(page.path),
      lastModified: now,
      changeFrequency: "monthly" as const,
      priority: page.priority,
    })),
    ...posts.map((post) => ({
      url: url(`/blog/${post.slug}`),
      /* The post's own date, not the build time. Stamping every article with
         today's date on every deploy is a reliable way to teach Google that
         your lastmod values mean nothing. */
      lastModified: new Date(post.published),
      changeFrequency: "yearly" as const,
      priority: 0.6,
    })),
  ];
}
