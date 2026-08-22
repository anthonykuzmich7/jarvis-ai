# HyperFrames Composition Brief: Jarvis — "How Jarvis works"

> **Status note.** This brief records the handoff as written. The film moved on
> through several rounds of direction. **For what actually shipped, read the beat
> sheet in `README.md`.**


## Objective
A product-level "how it works" film for Jarvis, delivered in two themes from one
composition, plus an embeddable live-DOM port for the marketing site.

## Output
- Composition directory: `brag-output-2026-08-21/composition/`
- Rendered video (paper / white): `brag-output-2026-08-21/brag.mp4`
- Rendered video (ink / black):  `brag-output-2026-08-21/brag-ink.mp4`
- Site embed: `jarvis-ai/src/components/how-jarvis-works.tsx`
- Format: landscape — 1920x1080, 30fps
- Duration: 33.3s

## Source Material
- Project roots: `~/PetProjects/jarvis-ai-core` (the app), `~/PetProjects/jarvis-ai` (the site)
- Primary files read:
  - `Sources/JarvisGuideApp/MeetingAssist/MeetingAssistContent.swift` — every string in Act 4
  - `Sources/JarvisGuideApp/Theme.swift` — the ink token set
  - `jarvis-ai/src/app/globals.css` — the Panxo (paper) token set
  - `jarvis-ai/src/components/context-demo.tsx` — the paper/ink contract and the live-DOM pattern
  - `jarvis-ai/PRODUCT.md` — voice, and the explicit anti-references
  - `remotion/README.md` — the house motion rules (two easing families, accent drought, grain)
- Product name: Jarvis
- Strongest claim: it tells you what your manager is about to ask, before he asks it.
- Key UI to recreate: the Meeting-Assist briefing island ("While you were out" +
  the missed-week timeline + the high-priority blocker), and the local-answer
  terminal with its citation chip.
- Copy that must appear verbatim:
  - `You can't remember everything.` / `It's spread across every tool.`
  - `Jarvis remembers all of it.` / `Nothing leaves your Mac.`
  - `what did I miss on the payments bug?`
  - `Tom's fix is in review — not shipped. It double-charged 3 customers.`
  - `↳ #eng · 3 days ago`
  - `You didn't read the week. It did.`
  - `1:1 · David Park` / `11:00` / `You know nothing.`
  - `Checkout bug halted the release` / `Signup redesign is on staging` / `Launch date owed this week`
  - `David will ask` / `Is the payments bug fixed?`
  - `You walked in cold.` / `Jarvis didn't.` / `jarvis_`

## Creative Direction
- Tone preset: `polished`
- Creative direction: quiet competence — a briefing, not a pitch.
- Interpretation: five scenes, long holds, one idea each. Restraint is the
  argument: a product that claims to reduce your anxiety cannot be sold with an
  anxious edit. Motion is causal — things move because something moved them.
- Angle: four capabilities delivered as ONE scenario with a clock running through
  it. You were out for a week; at 11:00 you have a 1:1 with your manager. Each
  capability is a consequence of the last, not a bullet.
- Hook: five windows filling with messages you are not reading, a date ticking
  across the week, and context chips already falling out of the pile.
- Outro: the mark blinks once, then `You walked in cold. / Jarvis didn't.`
- Avoid:
  - Generic SaaS language
  - Abstract filler visuals
  - The hype-AI aesthetic PRODUCT.md bans (glowing gradients, orbs, screaming metrics)
  - Any URL — the site has no confirmed public domain

## Visual Identity
Two themes from one composition, switched by an `enum` composition variable
(`theme: paper | ink`) read once at init. Tokens copied from
`context-demo.tsx:260-298` so this film and the film already on the site are one
object.

| | ink | paper |
|---|---|---|
| Ground | `#0A0A0B` | `#FAFAFA` (transparent in the component) |
| Text / Text-2 | `#F4F4F5` / `#A1A1AA` | `#1C1A17` / `#5A5957` |
| Accent | `#6366F1` | `#777EFF` (text `#4F55D6` for AA) |
| Surface / window | `#141416` | `#FFFFFF` + shadow |
| Terminal | `#141416` | `#1C1A17` (the only dark surface on paper) |

- Display font: SF Pro Display (renders); site vars in the component.
- Mono: SF Mono (renders); `--font-geist-mono` in the component.
- Strongest visual: the pause-disc mark whose two pills double as eyes — the only
  character in the film and the only thing that blinks.
- **Accent discipline:** zero accent pixels before 8.74s. The threads draw
  NEUTRAL and ignite to accent on the beat. Traffic-lights stay monochrome.

## Storyboard
`brag-output-2026-08-21/brag-plan.md` is the creative contract.

1. The week you missed — 5.45s — five windows fill and overflow, chips fall down the gutters, the headline lands word by word
2. It was all being read — 7.34s — chrome falls away, four tiles thread into the mark, the thread stops at the machine's edge
3. One question — 8.45s — the query types, `● Jarvis · local` ignites, a specific answer with a citation chip
4. 11:00 — 8.37s — an empty call, then the briefing flies in and the missed week lands marker by marker; the climax is the question David is about to ask
5. Outro — 2.82s — the mark blinks, two lines, the wordmark

## Audio
- Audio role: sparse professional accents over a low bed. The bed is presence, not a hook.
- Audio arc: an accelerating pile-up of things you are not reading resolves into
  one calm object, sharpens to a dry keystroke-and-bell exchange, arrives once
  more at 11:00, then gets out of the way so the last two lines land in silence.
- Music: `happy-beats-business-moves-vol-12-by-ende-dot-app.mp3` (109.96 BPM)
- Music treatment: in at 0.15, step to 0.22 at the ignite, **duck to 0.11 under
  the typing**, 0.20 on the answer, 0.24 as the briefing lands, down from the
  climax, and fully out by 29.8s.
- Music cue guidance: bundled preset (`assets/music/cues/…json`). Its planning
  window stops at 25.0s; beat period is 0.5456s, so the grid was extended for
  Acts 4–5. **Beat-locked (±0.15s):** 8.74 (accent ignite, strongCue 0.99),
  13.11 (typing starts, 0.98), 17.47 (citation chip, 0.99), 22.93 (briefing
  arrives, 1.00). **Beat-grid (±0.10s):** Act 1 message rows 0.56→3.82; Act 2
  tiles 6.00 / 6.56 / 7.09 / 7.64; Act 4 timeline markers 23.46 / 24.02 / 24.56.
- Audio-reactive treatment: subtle. Pre-extracted RMS/bass drive three existing
  elements only — the two accent halos and the vignette's depth. Each halo
  carries its own deterministic time gate so the sampler is the sole owner of
  its opacity and never fights a tween. No waveforms, no bars, no strobing. The
  vignette is 0 on paper, so it stays off there.
- Audio-coupled moments: the accelerating row pile-up; the chrome collapse; four
  tile landings; the typed query (8 keypresses, music ducked); the citation bell
  — the only bright sound in the film; the briefing whoosh; three marker ticks;
  one low hit on the climax, then silence under it.
- SFX: 25 cues, all slot-fitted to their real file length. Selection came after
  the animation existed, per the brief contract.
- Restraint rule: the music never carries a moment on its own, never swells into
  a "reveal", and is out before the final two lines. Where a beat and a readable
  line disagreed, the line won.

## Verification
- `npx hyperframes check` — **ok, 0 errors** in BOTH themes (lint / runtime /
  layout / motion / contrast). Layout and contrast return zero findings; the two
  remaining warnings are `composition_file_too_large` (monolithic by choice) and
  one benign runtime note.
  `check` has no `--variables` flag, so the ink pass was run by temporarily
  flipping the declared default and flipping it back.
- Snapshots eyeballed at 2.4 / 3.6 / 4.9 / 9.9 / 10.6 / 18.4 / 25.4 / 27.4 / 30.6s.
- Both renders verified 1920x1080, 33.3s, with an audio stream.
- The site component was verified in a real browser at eight frozen frames across
  both themes, and matches the renders.

## Fidelity note
This is recreated UI in HTML, not screen footage. Every string is lifted from
`MeetingAssistContent.swift`, so nothing on screen is a claim the product does not
make. **Meeting Assist is a hard-coded demo in the app today** (CLAUDE.md) — the
film shows it exactly as it renders, which is the honest bound.
