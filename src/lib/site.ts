/*
  One source of truth for every absolute URL the SEO layer needs: metadataBase,
  canonicals, the sitemap, robots.txt, and JSON-LD.

  The host matters more than it looks. `jarviscontext.com` 308-redirects to
  `www.jarviscontext.com` at the Vercel edge, so www is the canonical host —
  and the old `jarvis-ai-ahm7.vercel.app` deployment URL still serves the same
  HTML. Three hostnames, one site: without a canonical pointing at exactly one
  of them, Google splits the ranking signals across all three and none of them
  wins. Every URL below is built from SITE_URL for that reason.

  NEXT_PUBLIC_SITE_URL exists so a fork or a staging host can override it; the
  default is production, because a canonical must never point at a preview.
*/

export const SITE_URL = (
  process.env.NEXT_PUBLIC_SITE_URL ?? "https://www.jarviscontext.com"
).replace(/\/+$/, "");

export const SITE_NAME = "Jarvis";

/* ~52 chars. Front-loads the two phrases we actually compete for — "AI context
   management" and "meeting assistant" — because on a domain with no authority
   yet, the title tag is the strongest on-page relevance signal we own. */
export const SITE_TITLE =
  "Jarvis — AI Context Management and Meeting Assistant";

/* ~150 chars, which is what Google renders before truncating. Names the real
   surfaces (Slack, Gmail, meetings, Claude) rather than adjectives: those are
   the words people actually search alongside the category. */
export const SITE_DESCRIPTION =
  "Jarvis remembers your work context across Slack, Gmail, and meetings — then carries it into Claude and every AI tool you use. Stop repeating yourself.";

/* Shown on social cards, where the pitch beats the keyword. */
export const SOCIAL_DESCRIPTION =
  "Your context, everywhere you work. Jarvis listens in meetings, remembers what your team decided, and hands it to your AI tools — so you never brief them twice.";

export const url = (path = "/") => new URL(path, `${SITE_URL}/`).toString();
