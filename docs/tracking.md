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
| How many people came, and from where? | Vercel Web Analytics |
| Who specifically is interested? | the Google Sheet |
| Which channel produces actual leads? | the Sheet's UTM columns |

## 1. Turn on Web Analytics — one click, and it's yours to make

The code is already deployed (`<Analytics />` in `src/app/layout.tsx`, plus a
`waitlist_signup` event on every successful submission). It records nothing
until you enable it:

> Vercel dashboard → project `jarvis-ai-ahm7` → **Analytics** tab → **Enable**

It's cookieless, so it needs no consent banner. The Hobby tier is free and
covers far more traffic than a pre-launch landing page produces.

## 2. Use tagged links everywhere you post

A plain link tells you almost nothing. Instagram's in-app browser usually strips
the referrer, so untagged Instagram traffic lands in your analytics as
**direct** — indistinguishable from someone typing the URL. Tagged links are the
only reliable way to know Instagram sent them.

Base URL: `https://jarvis-ai-ahm7.vercel.app/`

### Instagram — paste these

**Link in bio** (the one to set now):

```
https://jarvis-ai-ahm7.vercel.app/?utm_source=instagram&utm_medium=social&utm_campaign=bio
```

**Story link sticker:**

```
https://jarvis-ai-ahm7.vercel.app/?utm_source=instagram&utm_medium=social&utm_campaign=story
```

**A specific post or reel** — swap `launch` for the post's own name so you can
tell posts apart:

```
https://jarvis-ai-ahm7.vercel.app/?utm_source=instagram&utm_medium=social&utm_campaign=launch
```

**DMs:**

```
https://jarvis-ai-ahm7.vercel.app/?utm_source=instagram&utm_medium=dm&utm_campaign=outreach
```

### Other channels

| Channel | Link |
| --- | --- |
| LinkedIn profile | `...?utm_source=linkedin&utm_medium=social&utm_campaign=profile` |
| LinkedIn post | `...?utm_source=linkedin&utm_medium=social&utm_campaign=post` |
| X / Twitter bio | `...?utm_source=x&utm_medium=social&utm_campaign=bio` |
| Cold email | `...?utm_source=email&utm_medium=outbound&utm_campaign=<list-name>` |
| Newsletter | `...?utm_source=newsletter&utm_medium=email&utm_campaign=<issue>` |
| Product Hunt | `...?utm_source=producthunt&utm_medium=referral&utm_campaign=launch` |

### Two rules that keep the data usable

1. **Always lowercase.** `Instagram` and `instagram` become two separate rows in
   every report, and they never merge back.
2. **Keep the vocabulary small.** `utm_source` is the platform (instagram,
   linkedin, email). `utm_medium` is the kind of placement (social, dm, email,
   referral). `utm_campaign` is the specific thing you posted. Inventing a new
   word each time makes the report unreadable within a month.

## 3. How attribution survives the visit

UTM params only exist on the URL of the first page someone lands on. If a
visitor arrives from Instagram, browses to `/compare`, and signs up from a clean
URL, the params are long gone.

So `src/lib/attribution.ts` snapshots the source on the first page of the visit
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

**Visits per channel** is the Vercel Analytics referrer/UTM breakdown. Divide
signups by visits and you have conversion per channel: if Instagram sends 400
visits and 2 signups while LinkedIn sends 40 and 6, LinkedIn is the better
channel despite being a tenth of the traffic.

## 5. Test rows

Local dev and preview deploys write to the **same sheet as production**. Rows
from those environments are labelled in the `Source` column
(`landing-waitlist:local`, `landing-waitlist:preview`) so they're easy to spot
and filter out. Real leads are plain `landing-waitlist`.

## Worth doing eventually

A **custom domain** — `jarvis-ai-ahm7.vercel.app` is fine for testing but hurts
trust in an Instagram bio, and a memorable domain is itself a small conversion
gain. Add one under project → Settings → Domains, then update the links above.
