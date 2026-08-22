# Paste-me prompt

Copy everything below the line into a fresh Claude Code session opened in
`~/PetProjects/jarvis-ai`.

---

I have a finished 33.3s product film to put on the landing page. **The film is
done. Do not rebuild, re-render, restyle or re-time it.** Your only job is to
place it on the page well.

## What already exists in this repo

- `src/components/how-jarvis-works.tsx` — the film as live DOM. Props:
  `theme?: "paper" | "ink"` (default `paper`), `className?`. Fills its
  container's width, locks 16:9, animates only while on screen, holds a static
  payoff frame under `prefers-reduced-motion`. Typechecks and lints clean.
- `public/how-jarvis-works.mp4` + `.jpg` (white, 3.4 MB) and
  `public/how-jarvis-works-ink.mp4` + `.jpg` (black, 4.6 MB) — the social / OG cut.
- `public/logos/` — slack, gmail, telegram, meetings, claude. The component
  loads these at runtime; do not move or rename them.
- `marketing/how-jarvis-works/README.md` — **read this first.** It has the
  authoritative beat sheet, the re-render commands, and the rules that are
  load-bearing.

## What the film says

Nobody can hold what is spread across every tool, so Jarvis does. Five apps
overflow while you are not reading them, Jarvis indexes all of it on your Mac and
hands it to Claude Code, you ask one question and get a cited answer, and at
11:00 a 1:1 starts that Jarvis records, transcribes, and briefs you on, including
the three things you have to clarify before you hang up. It ends on
"You walked in cold. / Jarvis didn't."

## The task

Add it to the landing page as its own section.

1. **Use the component, not the MP4.** The MP4 is 3.4 MB of compressed type; the
   component is real vector text at the device's resolution and costs no
   download. `src/components/demo-section.tsx` documents this exact decision for
   the earlier film. Read its header comment before you argue with it.

2. **Use `theme="paper"`.** The page is ledger white (`#FBFEFD` on `<main>`) and
   the theme is deliberately locked. A section that flips to dark mid-scroll is
   the specific thing the previous film had to be rebuilt to avoid. `paper`
   leaves its own ground transparent so the page shows through.

3. **Where it goes: between `<StrugglesSection />` and `<FeatureShowcase />` in
   `src/app/page.tsx`.** The page runs TypeHero → OrbitSyncJarvis →
   JarvisOverlaySection → StrugglesSection → FeatureShowcase → OutcomesSwitch →
   FAQ → Waitlist. Struggles states the pain, the film shows the product working
   end to end, FeatureShowcase then breaks it into parts. Problem, then how it
   works, then features. If you think a different slot is better, say why and ask
   before moving it.

4. **Wrap it in a section that matches the page.** Follow the shape of
   `demo-section.tsx`: `bg-ledger-white`, `mx-auto max-w-[1180px] px-6 py-20
   sm:py-28`, a `font-display` h2 in coal ink, and a framer-motion `whileInView`
   reveal with `EASE = [0.16, 1, 0.3, 1]` and `viewport={{ once: true }}`.
   Do NOT put the film in a card, border or shadow frame. Its ground IS the page.

5. **Heading.** Draft 2-3 options in the site's voice (see `PRODUCT.md`: warm,
   direct, problem-first, no hype-AI language) and pick one. Register to aim for:
   "Watch Jarvis answer from your team's memory." from `demo-section.tsx`. Do not
   restate the film's own captions, and do not add an eyebrow above it.

6. **Mobile.** `src/components/mobile/mobile-layout.tsx` is a separate tree. Read
   it, then either add the film there too or deliberately leave it out. Tell me
   which and why. A 16:9 film at phone width is small; if you include it, check
   it actually reads.

7. **Nav.** If you add a nav entry, `src/components/site-nav.tsx` and the mobile
   pill nav both need it. Only do this if the section earns a slot.

## Constraints

- **Do not edit `src/components/how-jarvis-works.tsx`** except to fix a real bug.
  Its timings, coordinates and tokens mirror the render source at
  `marketing/how-jarvis-works/composition/index.html` line for line. Change one
  without the other and the page and the social cut drift apart.
- Do not touch `context-demo.tsx`, `demo-section.tsx`, or any other section's
  copy or layout.
- Do not add an animation library. The film is pure CSS by design.
- Do not "tidy" the component's ids. `w-w1..w-w5` (Act 1 windows) and the Act 2
  ids are deliberately distinct; a collision silently zeroes elements.

## Verify before you tell me it is done

```
npx tsc --noEmit
npx eslint src
npm run dev
```

Then actually look at it in a browser at desktop AND phone width, scrolled into
place, and confirm: the film scales to its container (it must NOT overflow), the
type is readable, the section's rhythm matches its neighbours, and the loop
restarts cleanly. Show me a screenshot. Report honestly if anything looks off.

## Optional, only if I say yes

The MP4 and poster are unused until someone wires them up. If you want them
working as the OG / social card, ask me first, then set `openGraph.videos` and
`openGraph.images` in `src/app/layout.tsx` metadata. Do not do this unprompted.
