# HyperFrames Composition Brief: Jarvis — "How Jarvis works" (v2)

Supersedes `brag-output-2026-08-21/`. Same film, three new capabilities, one
day. v1 stays on disk untouched as the 33.3s / dual-theme cut.

## Objective
A product-level "how it works" film for Jarvis that now carries the three
things v1 predates: **Focus** (the day drawing itself), **Meeting Assist with
disperse**, and **Jarvis inside a coding agent** (the local MCP server).

## Output
- Composition directory: `brag-output-2026-08-28/composition/`
- Rendered video (ink / black): `brag-output-2026-08-28/brag-ink.mp4`
- Format: landscape — 1920x1080, 30fps, 36.0s, audio
- **Ink only.** The `theme` variable and the full paper token set are still in
  the composition, but the default flipped to `ink` and the paper pass was not
  re-verified for the three new acts. Rendering paper again means re-checking
  contrast and the Focus/Meeting surfaces, which are dark-only in the app.

## Source Material
- Project root: `~/PetProjects/jarvis-ai-core`
- Primary files read (every string and every colour comes from these):
  - `Sources/JarvisGuideApp/TodayUI/TodayContent.swift` — the whole Focus act:
    the focus sentence, all seven blocks, their reasons, their source marks
  - `Sources/JarvisGuideApp/TodayUI/TodayTimelineView.swift` — the three-column
    lane, the colour law, the band geometry, which hour rules are not drawn
  - `Sources/JarvisGuideApp/TodayUI/TodayBuildChoreography.swift` — the build's
    timing table, reproduced beat for beat
  - `Sources/JarvisGuideApp/TodayUI/TodayReactions.swift` — hover ground 0.075,
    rail rest 0.85 / hot 1.0
  - `Sources/JarvisGuideApp/MeetingAssist/MeetingAssistContent.swift` — Act 5
  - `Sources/JarvisGuideApp/Theme.swift` — the ink token set
  - `CLAUDE.md` — the MCP surface (`search_context`, `127.0.0.1:8765`) and the
    disperse spec (⌘⇧D, response 0.55 / damping 0.74, ~45ms stagger)
- Logos added to `assets/logos/`: `linear.png`, `github.png` (copied from
  `Sources/JarvisGuideApp/Resources/demo-*.png`, the app's own marks).

## The arc — one day, in order
The film is now chronological inside a single day, and each act is a
consequence of the last rather than a bullet.

| # | Act | Window | What it is |
|---|-----|--------|------------|
| 1 | The week you missed | 0.00 → 5.45 | unchanged from v1 |
| 2 | It was all being read | 5.06 → 11.26 | v1, trimmed ~1.1s; the Claude Code node now foreshadows Act 4 |
| 3 | **Focus** | 11.20 → 17.46 | NEW — the day draws itself, then 09:20 lights the hour you are in |
| 4 | **09:00, inside the code** | 17.46 → 23.46 | rebuilt — Claude Code + the Jarvis MCP tool call |
| 5 | **10:00, on the call** | 23.46 → 32.74 | expanded — the briefing, then ⌘⇧D bursts it into islands |
| 6 | Outro | 32.74 → 36.01 | v1, retimed |

## Act 3 — Focus
Not a mock. The geometry, the colour law and the build ORDER are the app's.

- Three columns: hour numerals, the **rail** (the time axis, with equal
  clearance both sides), then the content. One rail width for every block;
  colour is the only variable.
- **Inverted colour law (spec D6b):** the meeting is the loud one. A calendar
  event gets a lit band — square at the head, rounded at the tail, starting at
  the rail and running the day's width — plus a white rail and the brightest
  text. A Jarvis task gets the same-width rail in indigo on bare ground and no
  surface at all. Rest gets nothing: no rail, no plate, no hue.
- **A booked hour has no rules.** The four hour rules a meeting swallows are
  not drawn, not covered.
- Build order = `TodayBuild`: axis (0.10) → hours (0.16, 34ms stagger) → **your
  meetings** (0.48, damped) → **Jarvis's tasks** (0.74, spring with a whisper
  of overshoot) → the reasons (1.02) → rest (1.28) → the now-marker (1.44, the
  only real bounce). ~1.6s total, nothing over 420ms — length from stagger.
- As each task lands, its name in the focus sentence flares AND is picked up
  word by word, left to right (`TodayBuild.liftHeight`, scaled 6→10px for the
  film's 30px type). Prose never moves; only the names do.
- At 15.82 the 09:00 hour lights the way a hover lights it — and **both** halves
  of the split task light at once, an hour apart. The band is 0.115 against the
  hover's 0.075 so a hovered task never looks like a meeting.

## Act 4 — inside the code
Claude Code in `~/checkout`, on PR #412 (the artifact behind the 09:00 block).
The tool line is the real surface: `jarvis · search_context("payments bug")` →
`⎿ 3 results · 127.0.0.1 · nothing left the Mac`. Query and answer are v1's
verbatim strings, so the site copy and the film still agree.

## Act 5 — on the call, then out of the way
v1's briefing, retimed onto the beat grid, with the label renamed to the
required copy **"David will ask"**. Then ⌘⇧D: the hint lands 0.33s before the
burst (the cause), the panel is consumed, the call returns to full strength and
slides to centre, and three islands fly to the screen edges — status top-left,
attendees right, the ask pill bottom-centre — x/y decomposed, 45ms stagger,
`back.out(1.35)`. The faces are never covered, which is the whole feature.

## Seams (vector ledger: `composition/ledger.json`)
The film's current is LEFT; reserved vectors are spent on meaning.

| Seam | Cut | Technique |
|---|---|---|
| read → Focus | 11.20/11.46 | **carrier morph** — the mark itself flies from scene 2 into Focus's title-bar lockup (190px @825,341 → 34px @906.5,91, which is where `JarvisLockupMetrics` puts the disc), landing on the frame the sentence starts |
| Focus → code | 17.46 | zoom-through: the camera drives INTO the 09:00 block and comes out inside the work. Growing on both sides |
| code → call | 23.46 | cut-the-curve LEFT, the current |
| call → outro | 32.74 | inverse zoom-through — arrival, shrinking on both sides |

`node <motion-doctrine>/scripts/seam-gate.mjs verify --ledger ledger.json
--project .` → **PASSED, 0 fail 0 warn across 3 seams** (ledger consistency,
exit still moving, entry mid-flight, measured direction, speed match, zero
overlap, Z-sign scan). The scene-1→2 boundary is v1's crossfade and is not in
the ledger.

Stillness before the climax: 16.06 → 16.66 holds before the push.

## Audio
- Music: `happy-beats-business-moves-vol-12-by-ende-dot-app.mp3` (109.96 BPM,
  beat period 0.5456s). Every new beat lands on that grid.
- Mix: in at 0.15 → 0.22 on the ignite → **0.26 as the day builds** → 0.19 →
  **duck to 0.11 under the typing** → 0.20 on the answer → 0.24 as the briefing
  lands → 0.27 on the burst → 0.12 → out by 33.9.
- 46 SFX cues (was 29), all slot-fitted to their real file length. New: the
  mark landing on the lockup, the axis, two meeting placements, four task
  placements, the now-marker, the push into the hour, the tool call, the tool
  result, the burst, three island docks.
- Audio-reactive: unchanged — RMS/bass drive two halos and the vignette only.
  The scene-2 halo now gates OFF at 10.86 so the sampler never fights the seam.

## Verification
- `npx hyperframes check` — **passed**: 0 errors across lint / runtime / layout
  / motion; contrast 35/35 WCAG AA. Remaining: `composition_file_too_large`
  (monolithic by choice), two `duplicate_media_discovery_risk` notes on repeated
  logos, and two info-level transient overlaps while the islands are in flight
  (marked `data-layout-allow-overlap`).
- CLI bumped 0.8.4 → 0.8.17 (`upgrade --project .`), check re-run green after.
- Snapshots eyeballed at 11.35 / 11.5 / 12.2 / 13.6 / 14.4 / 15.95 / 17.3 /
  17.4 / 17.55 / 17.8 / 18.6 / 21.0 / 22.4 / 25.6 / 28.6 / 30.7 / 30.9 / 34.2s.
- Render verified 1920x1080, 36.0s, with an audio stream.

## Fidelity note
Recreated UI in HTML, not screen footage. Every string is lifted from
`TodayContent.swift` / `MeetingAssistContent.swift` / `CLAUDE.md`, so nothing on
screen is a claim the product does not make. **Focus and Meeting Assist are both
hard-coded demos in the app today** — the film shows them exactly as they
render, which is the honest bound. Two deliberate copy changes from v1: the 1:1
is at **10:00** (the app's own time, and the hour the Focus act hands you into,
where v1 said 11:00), and the briefing's second label is **"David will ask"** (v1: "What to clarify").
