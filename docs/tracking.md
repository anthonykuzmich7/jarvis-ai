# Traffic tracking & campaign links

How to know who visits the site and where they came from.

## What this can and can't tell you

**It can tell you:** how many people visited, which pages, which country, which
device, and — the important part — **which channel sent them**. Instagram vs
LinkedIn vs direct, broken down by campaign, and how many of each turned into
waitlist signups.

**It can't tell you** which *individual people* visited. Anonymous visitors stay
anonymous; nothing legitimate identifies them by name. You only learn someone's
identity when they hand it to you by joining the waitlist. So the model is:

| Question | Where to look |
| --- | --- |
| How many people came, and from where? | PostHog |
| What they did on the page — clicks, scroll depth, tabs, the film | PostHog |
| Who specifically is interested? | the Google Sheet |
| Which channel produces actual leads? | PostHog funnels, or the Sheet's UTM columns |

## 1. PostHog

Analytics runs on PostHog (EU cloud), wired up in
`src/components/posthog-provider.tsx`. It captures every click, form submit and
route change on its own, plus click maps and scroll depth, plus a short list of
named funnel events — `waitlist_submitted`, `waitlist_signup`,
`waitlist_error`, `film_opened`, `hero_tab_selected`, `nav_cta_clicked`.

Your own visits should not be in any of these numbers: load the site once per
browser with `?internal=1` and every event from it is flagged for exclusion.
See [docs/posthog-setup.md](./posthog-setup.md#7-keeping-your-own-traffic-out).

Session replay is on, with every input masked — recordings show that the
waitlist field was filled, never what was typed into it. Free up to 5,000
recordings a month, which this site does not come close to.

Provisioning, the env vars, and the reverse proxy that keeps ad blockers from
eating the traffic are all in **[docs/posthog-setup.md](./posthog-setup.md)**.
Nothing records until `POSTHOG_KEY` is set.

This replaced Vercel Web Analytics, which is uninstalled.

## 2. Use tagged links everywhere you post

A plain link tells you almost nothing. Instagram's in-app browser usually strips
the referrer, so untagged Instagram traffic lands in your analytics as
**direct** — indistinguishable from someone typing the URL. Tagged links are the
only reliable way to know Instagram sent them.

Base URL: `https://www.jarviscontext.com/`

### Instagram — paste these

`utm_source=ig`, not `instagram`. Both are fine in the abstract; what is not
fine is using each of them once, because they become two rows that never merge.
`ig` is what the live links already carry, so `ig` is the house spelling.

The placement lives in `utm_content`, not in `utm_campaign`. Campaign is *what
you are promoting* and stays stable across a push; content is *which slot the
click came from*. Keeping them separate is what lets you ask "did the reel or
the bio do the work" without splitting the campaign in two.

**Link in bio:**

```
https://www.jarviscontext.com/?utm_source=ig&utm_medium=social&utm_campaign=waitlist&utm_content=bio
```

**Story link sticker:**

```
https://www.jarviscontext.com/?utm_source=ig&utm_medium=social&utm_campaign=waitlist&utm_content=story
```

**A specific post or reel** — name the post, so posts are tellable apart:

```
https://www.jarviscontext.com/?utm_source=ig&utm_medium=social&utm_campaign=waitlist&utm_content=reel-focus-day
```

**DMs:**

```
https://www.jarviscontext.com/?utm_source=ig&utm_medium=dm&utm_campaign=waitlist&utm_content=outreach
```

Instagram adds its own `igsh` parameter to shared links and strips the referrer
on every outbound tap. It does **not** add `utm_*` — anything you see in those
columns is a link you tagged yourself.

### Other channels

| Channel | Link |
| --- | --- |
| LinkedIn profile | `...?utm_source=linkedin&utm_medium=social&utm_campaign=waitlist&utm_content=profile` |
| LinkedIn post | `...?utm_source=linkedin&utm_medium=social&utm_campaign=waitlist&utm_content=post` |
| X / Twitter bio | `...?utm_source=x&utm_medium=social&utm_campaign=waitlist&utm_content=bio` |
| Cold email | `...?utm_source=email&utm_medium=outbound&utm_campaign=<list-name>` |
| Newsletter | `...?utm_source=newsletter&utm_medium=email&utm_campaign=<issue>` |
| Product Hunt | `...?utm_source=producthunt&utm_medium=referral&utm_campaign=launch` |

### Two rules that keep the data usable

1. **Always lowercase.** `Instagram` and `instagram` become two separate rows in
   every report, and they never merge back.
2. **Keep the vocabulary small.** `utm_source` is the platform (ig, linkedin,
   email). `utm_medium` is the kind of placement (social, dm, email, referral).
   `utm_campaign` is what you are promoting, and should barely change.
   `utm_content` is the individual slot the click came from — `bio`, `story`,
   a named reel. Inventing a new word each time makes the report unreadable
   within a month.

## 3. How attribution survives the visit

UTM params only exist on the URL of the first page someone lands on. If a
visitor arrives from Instagram, browses to `/compare`, and signs up from a clean
URL, the params are long gone.

All four `utm_*` params are captured, plus the referrer. So
`src/lib/attribution.ts` snapshots the source on the first page of the visit
and keeps it in `sessionStorage` for the rest of the session. **First touch
wins** — later internal navigation never overwrites the original source, so the
Sheet credits Instagram rather than recording direct traffic.

It's `sessionStorage`, not `localStorage`: the snapshot dies with the tab rather
than following someone across days. That covers the browse-then-signup flow,
which is where nearly all signups happen, while staying well clear of needing a
consent banner.

If a visitor blocks storage, it falls back to reading the live URL — the same
behaviour as before, never an error.

## 4. Reading the results

**Which channel actually produces leads** is a pivot on the Sheet's `UTM Source`
column — that's your real answer, since it counts signups rather than clicks.

**Visits per channel** is PostHog's referrer / UTM breakdown. Divide signups by
visits and you have conversion per channel: if Instagram sends 400 visits and 2
signups while LinkedIn sends 40 and 6, LinkedIn is the better channel despite
being a tenth of the traffic.

PostHog can do that division for you: build a funnel from `$pageview` to
`waitlist_signup` and break it down by `utm_source`. The named events carry the
same first-touch attribution the Sheet gets, so the two agree.

## 5. Test rows

Local dev and preview deploys write to the **same sheet as production**. Rows
from those environments are labelled in the `Source` column
(`landing-waitlist:local`, `landing-waitlist:preview`) so they're easy to spot
and filter out. Real leads are plain `landing-waitlist`.

## The canonical host

`www.jarviscontext.com`, not the apex and not the `.vercel.app` URL. The apex
308-redirects to www at the Vercel edge, and the old deployment URL still serves
the same HTML — see `src/lib/site.ts`. Always post the www form: a redirect hop
costs nothing in analytics terms but loses the query string on some in-app
browsers, and UTM params are the whole point of a tagged link.
