import type { MetadataRoute } from "next";
import { SITE_URL, url } from "@/lib/site";

/*
  There was no robots.txt at all — /robots.txt returned Next's 404 page. That is
  not fatal (crawlers assume "allow everything" when it 404s), but it also means
  nothing pointed at a sitemap and nothing kept crawlers out of the internal
  pages.

  /compare is a design scratch page — "Meet Jarvis — Layout Comparison" with two
  candidate layouts stacked for review. It is publicly reachable and was fully
  indexable. A thin internal page competing with the homepage for the same brand
  terms is exactly the kind of result you do not want surfacing for "jarvis
  context".

  AI crawlers (GPTBot, ClaudeBot, PerplexityBot, Google-Extended) are covered by
  the `*` allow and are deliberately left welcome: for a product in this
  category, being citable inside an AI answer is worth more than a blue link.
*/

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      {
        userAgent: "*",
        allow: "/",
        disallow: ["/compare"],
      },
    ],
    sitemap: url("/sitemap.xml"),
    host: SITE_URL,
  };
}
