# PostHog setup

Product analytics for the landing page: autocapture, pageviews, heatmaps and
scroll depth, plus a short list of hand-named funnel events. Session replay is
deliberately off.

PostHog replaced Vercel Analytics — `@vercel/analytics` is uninstalled and the
`<Analytics />` tag is gone from the root layout.

## 1. Create the project

Straight from PostHog, not through the Vercel Marketplace. The marketplace
install fails at the terms step with `Missing billingPlanId for
installation-only plan integration` — a bug on Vercel's side, not a paywall —
and it buys nothing here except auto-injected env vars, which is one variable.

1. Sign up at **https://eu.posthog.com/signup**. The EU host matters: it is what
   the reverse-proxy destinations in `next.config.ts` point at, and a US project
   would send events to a host that rewrite never reaches.
2. The free tier covers 1M events/month, which is far more than a pre-launch
   landing page produces. No card required.
3. Copy the project API key from **Settings → Project → Project API key**. It
   starts with `phc_`.

The project API key is a write-only ingestion token. Exposing it in the client
bundle is how PostHog is designed to work; it cannot read your data. That is
why it is safe as a `NEXT_PUBLIC_` variable.

## 2. Put the key on Vercel

```bash
vercel env add POSTHOG_KEY production --scope anthonykuzmich7s-projects
vercel env add POSTHOG_KEY preview --scope anthonykuzmich7s-projects
```

`POSTHOG_KEY`, not `NEXT_PUBLIC_POSTHOG_KEY`. The key still has to reach the
browser — nothing about PostHog works otherwise — but it gets there as a prop
from the server layout rather than by Next inlining a `NEXT_PUBLIC_` variable
into the bundle. That keeps the variable a plain secret on Vercel, which is
what the CLI steers you towards, and avoids a second copy of the same value
under a second name.

To be clear about what that is and is not: the token ends up in the page source
either way. It is a write-only ingestion token, it cannot read your data, and
PostHog is designed around it being public. The server-side read is about
keeping one variable, not about hiding it.

Then redeploy. The value is read at build time for these statically prerendered
pages, so an existing deployment will not pick the key up on its own.

## 3. Local development

Paste the same key into `.env.local`. Leave it blank and PostHog never
initialises —
no console noise, no events, nothing to clean up later. That is the intended
state for forks and for anyone who does not need analytics locally.

Every event carries an `environment` property (`production`, `preview`, or
`development`), so preview and localhost traffic is one filter away from being
excluded on any dashboard.

## 4. What gets captured

**Automatically** — clicks, form submits, route changes (`$pageview` on history
change, which is what App Router navigation is), click maps and scroll depth.

**By name**, in `src/lib/analytics.ts`:

| Event | Fired from | Properties |
| --- | --- | --- |
| `waitlist_submitted` | `waitlist-form.tsx`, on press | role, page, referrer, utm_* |
| `waitlist_signup` | on a saved lead | same |
| `waitlist_error` | on a failed save | same, plus `message` |
| `film_opened` | "Watch how it works" | — |
| `hero_tab_selected` | the three hero tabs | `tab`, `index` |
| `nav_cta_clicked` | "Get early access" in the nav | `label`, `placement` |

On a successful signup the visitor is identified by email, which stitches their
earlier anonymous events onto the lead. `person_profiles` stays on
`identified_only`, so visitors who never sign up cost nothing and stay
anonymous.

The attribution properties are the same first-touch snapshot that already
reaches the Google Sheet (`src/lib/attribution.ts`), so a PostHog funnel and a
sheet row agree about where a lead came from.

## 5. The reverse proxy

`next.config.ts` rewrites `/ingest/*` to PostHog's EU hosts, and the SDK is
pointed at `/ingest` rather than at posthog.com. Analytics served from a
third-party domain is blocked for a meaningful share of an engineering
audience; a first-party path is not. `skipTrailingSlashRedirect: true` is
required alongside it — without it Next answers some of PostHog's API calls
with a 308 the SDK does not follow.

If you ever move regions, the rewrite destinations are the thing to change, and
`ui_host` in `src/components/posthog-provider.tsx` alongside them.

## 6. Session replay

On, with every input masked (`maskAllInputs: true`). Replay records that a field
was filled, never what was typed into it, so no waitlist email ever reaches
PostHog through a recording.

Free up to 5,000 recordings a month, then $0.005 each falling to $0.0035 above
15,000. This site does not come close, so no sampling is configured — every
session is recorded. If traffic grows past the free allowance, add a sample rate
rather than turning it off:

```ts
session_recording: { maskAllInputs: true, sampleRate: 0.25 },
```

A billing limit in PostHog (Settings → Billing) is the belt-and-braces version:
it caps spend even if traffic spikes overnight.

Two caveats worth carrying forward:

- The masking option set in `posthog.init` **overrides** the project's "Privacy
  and masking" dashboard setting. Change it here, in code, not there.
- rrweb records `hidden` inputs **unmasked**. The only one on the page today
  carries the role dropdown's value, which is not sensitive. If a hidden field
  ever holds something that is, wrap it in an element with `ph-no-capture`.

Replay is also the part of this setup a privacy regulator would look at hardest.
Masked inputs and no consent banner is a defensible position for a landing page,
not a settled one — revisit it if the site starts collecting more than an email.

## 7. Keeping your own traffic out

You load this site more than any visitor does, and nearly all of it is
anonymous — you never fill in your own waitlist. A rule about email addresses
can therefore never catch it, because there is no person to attach an address
to. The flag is the answer.

Visit any page once per browser with the parameter:

```
https://www.jarviscontext.com/?internal=1
```

That registers `$internal_or_test_user: true` as a **super property**, persisted
in localStorage, so every later event from that browser carries it — anonymous
pageviews included. It also sets the matching person property, which is what
PostHog's stock **Internal / Test users** cohort matches on. `?internal=0`
clears both.

The parameter is stripped from the URL immediately, so it cannot ride along in
a link you copy out of the address bar. A shared link that silently marks the
recipient as internal would quietly delete real visitors from every report.

Do it once on each browser and device you browse from. It survives until the
site's localStorage is cleared.

### The PostHog side

In **Settings → Product analytics → Filter out internal and test users**, the
stock chip `User not in Internal / Test users` is all you need — the cohort
matches the person property the flag sets.

Two traps in that screen:

- The filters are **inclusive**. `Email address = someone@example.com` shows you
  *only* that person, which is the opposite of filtering them out. Exclusive
  operators (`does not equal`, `does not contain`) or the cohort's `not in` are
  what you want.
- Turning on **Enable this filter on all new insights**, and clicking **Turn on
  for existing insights**, is what actually applies any of it. The toggle alone
  does nothing if no rule matches.

Filtering is analysis-only: the events are still ingested, and the **Activity
tab keeps showing them**. Judge whether it works on an insight or the Web
Analytics dashboard, never on Activity.
