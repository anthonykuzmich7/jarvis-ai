/*
  The route registry.

  Every content page is declared once, here, and three things read it: the
  sitemap, the footer's link block, and each page's own metadata. The reason to
  centralise is not tidiness — it is that the three drift silently. A page added
  to the app but missing from the sitemap simply never gets crawled, and nothing
  in the build fails to tell you.
*/

export type ContentPage = {
  /** Path, leading slash, no trailing slash. */
  path: string;
  /** Footer link text. Short — this is a nav label, not a title. */
  nav: string;
  /** <title>. By default the root layout's template appends " — Jarvis";
      set `absoluteTitle` when the title already carries the brand, or the
      result reads "Jarvis vs Granola — Jarvis" and overruns the ~60 characters
      Google renders before truncating. */
  title: string;
  absoluteTitle?: boolean;
  /** <meta name="description">. Aim for 140–155 characters. */
  description: string;
  /** Sitemap weighting relative to the homepage's 1. */
  priority: number;
};

/* Ordered by the return they are expected to pay back, which is also a
   defensible order to show them in the footer. */
export const contentPages: ContentPage[] = [
  {
    path: "/mcp",
    nav: "MCP server",
    title: "Jarvis MCP Server — Your Work Context in Claude",
    absoluteTitle: true,
    description:
      "Jarvis exposes your Slack, Gmail, and meeting notes to Claude and any MCP client as a local context server. Stop pasting background into every prompt.",
    priority: 0.9,
  },
  {
    path: "/ai-context-management",
    nav: "AI context management",
    title: "AI Context Management for the Work You Actually Do",
    description:
      "Most context tooling governs enterprise data warehouses. Jarvis manages the context one person carries — their threads, decisions, and meetings — and serves it to their AI tools.",
    priority: 0.8,
  },
  {
    path: "/meeting-assistant",
    nav: "Meeting assistant",
    title: "AI Meeting Assistant That Remembers Your Whole Week",
    description:
      "Jarvis captures your calls, then files them beside the Slack threads and email that explain them — so a meeting is one source in your context, not an orphaned transcript.",
    priority: 0.8,
  },
  {
    path: "/vs/granola",
    nav: "Jarvis vs Granola",
    title: "Jarvis vs Granola: Notetaker or Context Layer?",
    absoluteTitle: true,
    description:
      "Granola is a very good notetaker. Jarvis is a context layer that reads your notes and your Slack and your email. An honest comparison of two different jobs.",
    priority: 0.7,
  },
  {
    path: "/vs/otter",
    nav: "Jarvis vs Otter",
    title: "Jarvis vs Otter.ai: Transcripts or Context?",
    absoluteTitle: true,
    description:
      "Otter transcribes meetings with a bot in the call. Jarvis answers questions across your meetings, Slack, and email. Where each one fits, without the feature-table theatre.",
    priority: 0.7,
  },
  {
    path: "/vs/fathom",
    nav: "Jarvis vs Fathom",
    title: "Jarvis vs Fathom: Call Summaries or Context?",
    absoluteTitle: true,
    description:
      "Fathom gives you fast, free, accurate call summaries. Jarvis gives you a searchable memory across every source you work in. A straight comparison of the trade-off.",
    priority: 0.7,
  },
  {
    path: "/blog",
    nav: "Writing",
    title: "Writing on Context, MCP, and AI Memory",
    description:
      "Notes on context engineering, MCP, and why your AI tools keep forgetting what you told them yesterday.",
    priority: 0.6,
  },
];

/** Feeds Next's `metadata.title`. Returns the `{ absolute }` form for titles
    that already name the brand, so the layout template does not append it
    twice. */
export const metaTitle = (page: ContentPage) =>
  page.absoluteTitle ? { absolute: page.title } : page.title;

export const findPage = (path: string) => {
  const page = contentPages.find((p) => p.path === path);
  if (!page) throw new Error(`No content page registered for "${path}"`);
  return page;
};

/*
  The legal documents.

  Kept out of `contentPages` on purpose. That array is the footer's "Explore"
  grid, and a privacy policy sitting between "MCP server" and "Writing" reads as
  something we are marketing. These live in the footer's bottom bar instead,
  where a reader already looks for them, and they carry their own low sitemap
  priority: they must be crawlable, because Google's OAuth reviewers fetch them,
  but they are not pages we compete on.
*/
export const legalPages: ContentPage[] = [
  {
    path: "/privacy",
    nav: "Privacy",
    title: "Privacy Policy",
    description:
      "What Jarvis reads, where it is stored, and who else sees it. Your Gmail and calendar data stays on your own Mac. Written for the people who use Jarvis, not for lawyers.",
    priority: 0.3,
  },
  {
    path: "/terms",
    nav: "Terms",
    title: "Terms of Service",
    description:
      "The terms you agree to when you use Jarvis: what we provide, what we do not promise, what you are responsible for, and how either side ends it.",
    priority: 0.3,
  },
];

export const findLegalPage = (path: string) => {
  const page = legalPages.find((p) => p.path === path);
  if (!page) throw new Error(`No legal page registered for "${path}"`);
  return page;
};
