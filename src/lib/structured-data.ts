/*
  JSON-LD graph for the site.

  Why bother when Google retired FAQ rich results for most sites in 2023: the
  audience for this markup is no longer only the blue-link SERP. AI Overviews,
  ChatGPT Search, Perplexity, and Bing all parse schema.org to decide what a
  product *is* and whether it answers a question. On a domain with no backlinks,
  explicit machine-readable claims are one of the few relevance signals we can
  ship on day one.

  Everything below is a claim we can actually defend. No aggregateRating, no
  fabricated offers, no invented founding date — marking up facts we cannot
  support is what earns a structured-data manual action.
*/

import { SITE_DESCRIPTION, SITE_NAME, SITE_URL, url } from "@/lib/site";
import { faqs } from "@/lib/faqs";

const ORG_ID = `${SITE_URL}/#organization`;
const SITE_ID = `${SITE_URL}/#website`;

const organization = {
  "@type": "Organization",
  "@id": ORG_ID,
  name: SITE_NAME,
  url: url("/"),
  logo: {
    "@type": "ImageObject",
    url: url("/icon.svg"),
  },
  description: SITE_DESCRIPTION,
};

const website = {
  "@type": "WebSite",
  "@id": SITE_ID,
  url: url("/"),
  name: SITE_NAME,
  description: SITE_DESCRIPTION,
  publisher: { "@id": ORG_ID },
  inLanguage: "en",
};

/* `applicationCategory` and `applicationSubCategory` are how an AI crawler
   places us in a category without having to infer it from prose. Jarvis lives
   in Slack and exposes context over MCP, so the operating system is the
   browser and the chat client, not a desktop OS. */
const softwareApplication = {
  "@type": "SoftwareApplication",
  "@id": `${SITE_URL}/#software`,
  name: SITE_NAME,
  url: url("/"),
  applicationCategory: "BusinessApplication",
  applicationSubCategory: "AI context management and meeting assistant",
  operatingSystem: "Web, Slack",
  description: SITE_DESCRIPTION,
  publisher: { "@id": ORG_ID },
  featureList: [
    "Persistent work context across Slack, Gmail, and meetings",
    "Meeting assistant that joins calls and captures decisions",
    "Context exposed to AI tools over MCP",
    "Per-person context kept separate from shared company knowledge",
  ],
};

const faqPage = {
  "@type": "FAQPage",
  "@id": `${SITE_URL}/#faq`,
  mainEntity: faqs.map((f) => ({
    "@type": "Question",
    name: f.q,
    acceptedAnswer: { "@type": "Answer", text: f.a },
  })),
};

/* One @graph rather than four separate <script> tags: it lets the nodes
   reference each other by @id instead of repeating the organization inline in
   every entity. */
export const homeJsonLd = {
  "@context": "https://schema.org",
  "@graph": [organization, website, softwareApplication, faqPage],
};

/** Serialised for `dangerouslySetInnerHTML`. `<` is escaped so a stray angle
    bracket in future copy can never close the script tag early. */
export const jsonLdString = (data: unknown) =>
  JSON.stringify(data).replace(/</g, "\\u003c");

/* ── Per-page schema ─────────────────────────────────────────────── */

/** Breadcrumbs. Google renders these in place of the raw URL in a result, so a
    deep page shows "jarviscontext.com › MCP server" rather than a bare path. */
export const breadcrumbJsonLd = (
  trail: { name: string; path: string }[],
) => ({
  "@context": "https://schema.org",
  "@type": "BreadcrumbList",
  itemListElement: trail.map((crumb, i) => ({
    "@type": "ListItem",
    position: i + 1,
    name: crumb.name,
    item: url(crumb.path),
  })),
});

/** A content page, tied back to the sitewide Organization by @id so the graph
    stays connected instead of re-declaring the publisher on every page. */
export const pageJsonLd = ({
  path,
  title,
  description,
  type = "WebPage",
}: {
  path: string;
  title: string;
  description: string;
  type?: "WebPage" | "TechArticle" | "Article";
}) => ({
  "@context": "https://schema.org",
  "@type": type,
  "@id": `${SITE_URL}${path}#page`,
  url: url(path),
  name: title,
  headline: title,
  description,
  isPartOf: { "@id": SITE_ID },
  publisher: { "@id": ORG_ID },
  inLanguage: "en",
});

/** Comparison pages. Marking the compared product as a named entity is what
    lets an AI answer connect "Jarvis vs Granola" to the Granola it knows. */
export const comparisonJsonLd = ({
  path,
  title,
  description,
  competitor,
}: {
  path: string;
  title: string;
  description: string;
  competitor: { name: string; url: string };
}) => ({
  "@context": "https://schema.org",
  "@type": "WebPage",
  "@id": `${SITE_URL}${path}#page`,
  url: url(path),
  name: title,
  description,
  isPartOf: { "@id": SITE_ID },
  publisher: { "@id": ORG_ID },
  about: [
    { "@id": `${SITE_URL}/#software` },
    {
      "@type": "SoftwareApplication",
      name: competitor.name,
      url: competitor.url,
      applicationCategory: "BusinessApplication",
    },
  ],
  inLanguage: "en",
});
