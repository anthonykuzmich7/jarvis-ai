# Landing page — hero positioning, trust section, CTA placement

**Status:** proposed
**Date:** 2026-07-20
**Scope:** first sub-project of the landing-page revamp (see full audit below). Covers the hero copy rewrite, a new trust section, and one CTA-placement fix. Does not cover the action-item demo, mobile problem-section parity, the Orbit/Overlay section merge, dead-code cleanup, or FAQ trimming — those are separate follow-up specs.

## Background

A landing-page audit ran earlier today: 7 parallel research agents (a codebase inventory plus B2B SaaS / AI-positioning / B2C research, and a marketing pass on messaging, competitive positioning, and waitlist-conversion tactics). Full writeup: https://claude.ai/code/artifact/a4bbf100-d074-408f-b3a5-4d4f8cd14ef9

Its top finding: the current hero (`src/components/scrub-hero.tsx`) never states what category Jarvis is, and never surfaces its most defensible differentiator — that Jarvis proposes action items, not just answers questions.

**Note on `docs/vision.md` and related docs:** `docs/vision.md`, `problem.md`, `features.md`, `customers.md`, `landing-page.md`, and `open-questions.md` (last touched 2026-06-14) describe an earlier direction — a "chief of staff" onboarding-wedge product with agentic actions (books calls, drafts intros), a screen-guided setup moment, and a C-level-only buyer (COO/CTO/CRO). The live site (touched as recently as 2026-07-19) has moved on from that: a general cross-tool AI context/action-item layer, sold B2B but used individually, no onboarding-wedge or screen-pointing framing anywhere. Confirmed with the user 2026-07-20: **the live site and this spec are the current direction; those docs are stale** and should be updated separately (not part of this spec).

## Decision process for the hero direction

Three headline candidates were drafted against the audit's findings:

- **A — Outcome + category:** "The AI context layer that knows what happened at your company — and what you should do next."
- **B — Named & concrete:** "Slack threads. Meeting notes. Code reviews. Jarvis turns all of it into three things you should do today."
- **C — Action-forward:** "Your AI tools finally know what happened. Jarvis tells you what to do about it."

Four specialist passes (brand consistency, a two-persona walkthrough — a skeptical senior engineer and an anxious VP of IT, a copywriting pass, and a growth/conversion pass) were run against these. Direction A was ruled out by three of the four independently (unexplained category jargon, reads as "platform IT deploys" rather than "tool people reach for"). B and C split the remaining opinion; the deciding factors: B is the only direction that puts the action-items differentiator directly in the headline, it wins the harder-won skeptical-engineer persona, and it ranks first on the growth-conversion read (concreteness + a quantified curiosity gap: "three things you should do today").

The persona walkthrough surfaced a real, unresolvable-by-wording conflict: the anxious IT-buyer persona preferred the softer, more contained direction A, while the skeptical engineer preferred B. The conclusion — confirmed independently by the growth-conversion pass — is that this isn't a headline problem, it's a **sequencing** problem: ship the concrete headline, and put permission/oversight reassurance in the very next section, not hedged into the hero sentence itself.

## Decision

Ship **direction B**, with copy finalized as follows.

## 1. Hero copy — `src/components/scrub-hero.tsx`

Replace the current headline, subhead, and add a new trust micro-line under the CTA. The CTA button label stays **"Get early access"** (unchanged) — a bolder action-forward CTA was considered and rejected, since there's no live product yet and a CTA promising immediate output would create an expectation/reality gap at the point of signup.

- **Headline:** "Slack threads. Meeting notes. Code reviews. Jarvis turns all of it into three things you should do today."
- **Subhead:** "Reads everything you're already cleared to see, syncs it locally, and hands your AI — and you — the context to act on it now."
- **CTA:** "Get early access" (unchanged, links to `#waitlist`)
- **New trust micro-line**, directly under the CTA button: "Synced locally, scoped to what you can already see — nothing new to approve, nothing sent anywhere else."

The scrub-video interaction and floating tool-icon badges are unchanged.

## 2. New trust section

**Purpose:** resolve the anxious-buyer objection through page sequencing rather than hedged hero copy — the persona walkthrough's central finding.

**Placement:** a new section between `StrugglesSection` (`id="problem"`) and `OrbitSyncJarvis` (`id="product"`), on both the desktop (`src/app/page.tsx`) and mobile (`src/components/mobile/mobile-layout.tsx`) layouts. This is immediately after the pain/demo section and before the mechanism section — the earliest point an anxious reader who just felt the pain needs reassurance before continuing.

**Content** — three short, plain-language pillars, no compliance jargon (nothing to substantiate like "SOC 2" yet at this stage):

1. **Permission-scoped access** — "Jarvis only sees what you already have access to. No new permissions, no expanded reach."
2. **Local sync** — "Your context stays synced locally, on your device. Nothing leaves without you knowing."
3. **Human-approved next steps** — "Jarvis proposes what to do next. You decide what happens — nothing executes without your review."

**Visual treatment:** a lightweight, low-height section — a three-column row (stacked on mobile) of short statements, each with a small icon, no new heavy imagery or animation. Follows the Panxo design tokens already in use (`docs/design/panxo.md`) — Ledger White/Parchment background, Coal Ink text, Ash hairline borders. This is a supporting/reassurance beat, not a hero moment, so it should read as calm and quick to scan, not compete visually with the sections around it.

**New file:** `src/components/trust-section.tsx`.

## 3. CTA-placement fix

Insert one lightweight CTA — a text link or ghost button, not a full form, labeled "Get early access" and linking to `#waitlist` — at the boundary right after `OrbitSyncJarvis`, before `JarvisOverlaySection`. This is the first point in the page where the mechanism ("connect once, tag anywhere") is fully explained, and currently the page runs five sections with no inline CTA before the reader reaches the bottom waitlist form. This does not replace or change the persistent nav CTA.

## Files touched

- `src/components/scrub-hero.tsx` — copy edit only
- `src/components/trust-section.tsx` — new component
- `src/app/page.tsx` — insert `TrustSection` after `StrugglesSection`; insert inline CTA after `OrbitSyncJarvis`
- `src/components/mobile/mobile-layout.tsx` — insert the trust content at the equivalent point (between the mobile problem section and the mobile context-layer section). Existing mobile sections in this file are separate `Mobile*`-prefixed components rather than shared with desktop, so this may be `TrustSection` reused directly if it's responsive, or a thin `MobileTrustSection` following that existing naming convention — implementation detail to settle during the build, but the three pillars' content and copy must be identical on both layouts.

## Explicitly not doing in this pass

- Merging `OrbitSyncJarvis` and `JarvisOverlaySection` into one mechanism section (flagged in the audit as a good idea, but a larger structural change than this spec's scope)
- The action-item demo/proof moment (audit's other "fix now" item — needs its own design pass on what the demo actually shows)
- Fixing mobile's divergent, unbranded problem-section narrative
- Dead-code cleanup (`jarvis-hero.tsx`, `meet-jarvis.tsx`, `problem-section.tsx`, `problem-timeline.tsx`, `team-spotlight.tsx`, `mission-control-jarvis.tsx`)
- Trimming the FAQ now that trust content appears earlier
- Updating `docs/vision.md` and related stale docs

## Verification

- Run the dev server and view the hero, new trust section, and new inline CTA on both desktop and mobile viewports.
- Confirm the trust section and inline CTA both use existing Panxo tokens (no new colors/shadows introduced).
- Confirm the inline CTA and hero CTA both scroll to `#waitlist` and the waitlist form still submits correctly (no regression).
- Read the full page top-to-bottom once to confirm the new section doesn't create an abrupt tone shift between `StrugglesSection` and `OrbitSyncJarvis`.
