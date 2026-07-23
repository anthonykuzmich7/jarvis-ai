# Feature Showcase Rework — Design Spec

**Date:** 2026-07-23
**Status:** Approved by user, ready for implementation plan

## Goal

Replace the current "One teammate, three jobs" section (`src/components/feature-showcase.tsx`,
rendered as `<FeatureShowcase />` in `src/app/page.tsx`, `id="features"`) with a section that
demonstrates two concrete, not-yet-shipped Jarvis features using **static (non-animated) coded
UI mockups** instead of the current live animated demos.

This closes a gap flagged in a prior landing-page audit (see memory
`project_landing_page_decisions.md`): the "surfaces action items, not just answers"
differentiator was never visually proven anywhere on the page. Both new features resolve to
the same payoff — "action items," reinforcing this as the section's throughline.

Reference screenshots provided by the user (current real Jarvis desktop app, dark theme):
onboarding screen with round "))" avatar mark and tagline "A calm second pair of eyes — guiding
what's new, remembering what matters"; a "Your world" sync screen with CHAT/MAIL connection
cards, a "Use Jarvis in Claude Code" card, and a "Sync all" pill + "Everything stays on your
Mac." footer line. These establish the real app's dark visual language (near-black background,
rounded cards, pill buttons, quiet/calm tone) that the new mockups should evoke without copying
pixel-for-pixel.

## Scope

- Replace all 3 existing jobs (Personal context / Company knowledge / Onboarding) with exactly
  2 new ones: **Morning Briefing** and **Meeting Overlay**.
- Delete the now-unused demo components (`ContextDemo`, `KnowledgeDemo`, `AccessDemo`) and their
  brand-mark SVGs that aren't reused elsewhere in this file.
- Keep the section's existing interaction shell: heading + subhead on the left, a clickable
  vertical job list below it, a single "stage" on the right showing the active job's mockup,
  and the auto-advancing progress-bar-under-active-item behavior (`CYCLE_MS`).
- Remove the outer light gradient "stage" frame (`linear-gradient(170deg, rgb(189,216,255)...)`)
  that currently wraps the demo content — the new mockups are self-contained dark app-window
  screenshots and should sit directly on the section's plain background with a soft shadow, not
  double-framed inside another card.
- Each mockup renders as a **single static frame** — no internal stagger/typing/pulsing
  animation. The only motion retained is the existing crossfade when switching between the 2
  list items (a UI affordance, not decorative motion) and the existing auto-advance progress bar.
- Add 2 new icons to `src/components/icons.tsx` for the job list (a checklist/sunrise mark for
  Morning Briefing, a mic/waveform mark for Meeting Overlay), following the existing lucide-style
  inline-SVG convention (`stroke="currentColor"`, `strokeWidth={1.75}`, 24×24 viewBox).
- Update the mobile equivalent (`MobileFeatures` in `src/components/mobile/mobile-layout.tsx`,
  `id="features-mobile"`) to the same 2-feature copy. Mobile currently renders plain text cards
  with no image/demo at all (unlike desktop) — keep that existing simpler pattern; do not add
  the image mockups to mobile.

## Section copy

- **Heading:** "Everything becomes a to-do list."
- **Subhead:** "Messages while you slept. Meetings while you're in them. Jarvis turns both into
  three things worth doing — not fifty things worth reading."

## Feature 1 — Morning Briefing

- **Lead label:** Morning briefing
- **Title:** Starts your day already prioritized
- **Body:** "Overnight, Jarvis reads what moved in Slack, your calendar, and your inbox — then
  hands you three things worth doing today. Not a summary of everything. Just what matters."
- **Status bar label** (small uppercase text in the mockup's top status strip, matching the
  existing `jobs[active].status` pattern, e.g. current "MCP · Building context"): `Today · 3
  priorities`

### Mockup content

A static dark app-window mimicking the real Jarvis app's visual language:

- Window chrome: rounded ~16px corners, near-black background (`#0e0e11`–`#111114` range,
  matching `PANEL_BG` used in `jarvis-overlay-section.tsx`), 3 traffic-light dots top-left
  (reuse the exact `#ff5f57` / `#febc2e` / `#28c840` colors already used in that file — static,
  non-interactive).
- Header row: small circular Jarvis mark (reuse the "))" eye style already established via
  `JarvisFaceLight`/`JarvisAvatar` patterns elsewhere in the codebase) + "Good morning" + a date
  string.
- Body: 3 stacked task rows. Each row has a small source-app badge (Slack / Zoom / Gmail —
  reuse existing inline brand SVGs already defined in this file or `orbit-sync-jarvis.tsx`), a
  bold one-line task (concrete, specific — continue the existing "Acme HQ" / "#sales" /
  "#api-platform" fictional-but-concrete world already established in `struggles-section.tsx`
  and `orbit-sync-jarvis.tsx` rather than inventing a new fictional company), and a small
  citation line below it (e.g. "From #sales, 8:14am").
- Footer stat line (small, muted): "3 priorities from 47 messages, 2 meetings" — a concrete
  noise-reduction proof point, echoing the existing "5 systems · 0 tickets · 18 min" stat line
  pattern in the current `AccessDemo`.

## Feature 2 — Meeting Overlay

- **Lead label:** Meeting overlay
- **Title:** Listens in every call, so you don't have to
- **Body:** "Turn it on before any Zoom, Meet, or call. Jarvis listens quietly in the background
  and hands you a clean summary and action items the moment you hang up."
- **Status bar label:** `Zoom · Listening`

### Mockup content

- Background: an abstracted, generic video-call surface — muted rounded video tiles with
  initials/avatar circles in neutral tones. Deliberately generic, not a literal recreation of
  Zoom's actual UI/trademark chrome (avoids any trademark concern) — just enough visual context
  to read as "this is happening during a live call."
- Overlaid: the same dark overlay-panel visual language already established in
  `jarvis-overlay-section.tsx`'s `OverlayPanel` (near-black `rgba(17,17,20,0.97)` background,
  `1px solid rgba(255,255,255,0.1)` border, soft multi-layer shadow, traffic-light dots),
  floating in a corner of the call surface.
- Overlay panel contents: Jarvis avatar + "Listening" label with a **static** waveform glyph
  (a few bars of fixed varying height — no animation), 1-2 static caption lines sampled from the
  "call" (short, plausible meeting dialogue), and a small chip at the bottom reading "3 action
  items detected" — intentionally mirroring Feature 1's "→ action items" payoff so both mockups
  visually rhyme.

## Layout & interaction (desktop)

- Left column unchanged in structure: `h2` heading, subhead `p`, then the job list. List now has
  2 entries instead of 3; same active/inactive visual treatment (icon badge fill, title color,
  body reveal on active, bottom progress-bar auto-advance via `CYCLE_MS`).
- Right column: drop the current gradient-background wrapping `div`
  (`rounded-[20px] border ... background: linear-gradient(...)`). Instead, render the active
  job's static mockup directly, sized to roughly the same footprint as today's stage
  (`h-[360px] sm:h-[420px]` equivalent, mockup itself may be intrinsically sized/centered within
  that space rather than stretched), with a soft drop shadow so it reads as a floating
  screenshot against the section's plain background.
- Keep `AnimatePresence`/crossfade for the switch between the two mockups when the user clicks a
  different list item, or when auto-advance fires. No per-element internal animation inside
  either mockup.

## Mobile

- `MobileFeatures`: update the `features` array to the 2 new features' eyebrow/title/body copy
  (same text fields, same card styling already in place — rounded card, border, shadow, reveal
  on scroll). No mockup image added on mobile; text-only cards as today.
- Update the shared heading/subhead in `MobileFeatures` to match the new desktop copy.

## Out of scope

- No changes to `JarvisOverlaySection` itself (only its visual language is reused/referenced).
- No new image/binary assets — everything is coded React/Tailwind, consistent with the rest of
  the page's fake-UI components.
- No changes to the section's `id="features"` anchor or its nav link.
- Not wiring these features to any real functionality — they are marketing mockups for
  features described as "coming soon."
