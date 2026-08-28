# "How Jarvis works" — the film

A 36.0s product film. One story, not a feature tour: nobody can hold what is
spread across every tool, so Jarvis does — and then it hands you the day, the
answer and the meeting that come out of holding it.

v1 (33.3s, authored 2026-08-21) is superseded. v2 keeps its first two acts and
its outro and adds the three capabilities it predates: **Focus**, **Jarvis
inside a coding agent**, and **Meeting Assist with disperse**. Re-cut
2026-08-28 in [HyperFrames](https://hyperframes.heygen.com) (HTML → MP4).

## The shipped edit

Authoritative beat sheet, read off the composition. If this and the prose in
`plan.md` (which is v1's) ever disagree, this wins.

The film is chronological inside one day now. Each act is a consequence of the
last: the week was read, so the day can be planned; the day starts at 09:00 in
the code; 09:00 hands you into the 10:00 call.

| Act | Window | What happens | Copy on screen |
|---|---|---|---|
| **1** | 0.00 - 5.45 | Five app windows fill with messages, real app icons in the title bars, red unread counts popping in (24, 18, 7, 12, 3). The stack drifts up while dropped context chips tumble down the gutters. Date ticks Aug 14 to Aug 21. | `You can't remember everything.` (word by word) / `It's spread across every tool.` |
| **2** | 5.06 - 11.26 | A MacBook. Four sources land as tiles, threads draw neutral into the mark. **8.74: the first accent in the film** - threads ignite, light sweeps the glass, the mark wakes, blinks, glances left at the sources then right along the thread out to Claude Code. | `Jarvis remembers all of it.` / `Nothing leaves your Mac.` |
| **3** | 11.20 - 17.46 | **Focus.** The mark flies out of Act 2 and lands on the window's own title-bar lockup; the focus sentence arrives on that frame. Then the day draws itself in the app's own order — axis, hours, **your meetings**, **Jarvis's tasks** into the gaps, the reasons, lunch, the now-marker. Each task's name flares and is picked up word by word as its hour lands. At 15.82 the 09:00 hour lights, and **both halves of the split task light at once**. | `Start with Review Tom's checkout fix. Tom, David and Sarah are all waiting on it. Then Pin the launch date, then Sign off Sarah's redesign.` / `It doesn't list your work. It places it.` |
| **4** | 17.46 - 23.46 | **Inside the code.** The camera pushes through the 09:00 block into Claude Code in `~/checkout`, on the PR that block is about. The query types out, the MCP tool call fires and returns from the machine itself, the mark blinks, the answer lands with its citation. | `PR #412 · Retry checkout on gateway timeout` / `what did I miss on the payments bug?` / `jarvis · search_context("payments bug")` / `⎿ 3 results · 127.0.0.1 · nothing left the Mac` / `Tom's fix is in review - not shipped. It double-charged 3 customers.` / `↳ #eng · 3 days ago` / `You didn't read the week. It did.` |
| **5** | 23.46 - 32.74 | **On the call.** 10:00, the 1:1 the Focus act handed you into, recording with a ticking clock and transcribing itself. The briefing flies in: **While you were out** (three dated markers) then **David will ask** (three checkboxes, the high-priority one in accent). Then **⌘⇧D**: the panel bursts into three edge-docked islands and the call comes back to full strength — the briefing stays, the faces stop being covered. | `You know nothing.` then `Now you do.` / `⌘⇧D` |
| **6** | 32.74 - 36.01 | The mark arrives, blinks, opens wide. | `You walked in cold.` / `Jarvis didn't.` / `jarvis_` |

**Total: 36.0s, 1920x1080, 30fps, ink only.** Sources shown: Slack, Gmail,
Telegram, Meetings, Linear, GitHub, Claude Code. Every string in Acts 3-5 is
lifted from the app's `TodayUI/TodayContent.swift`,
`MeetingAssist/MeetingAssistContent.swift` and `CLAUDE.md`.

## Seams

The film's current is LEFT. Reserved vectors are spent on meaning, and the
ledger is data: `composition/ledger.json`.

| Seam | Cut | Technique |
|---|---|---|
| read → Focus | 11.20/11.46 | **carrier morph** — the mark itself flies from Act 2 into Focus's title-bar lockup (190px @825,341 → 34px @906.5,91, which is where the app's `JarvisLockupMetrics` puts the disc). The only thing crossing that cut |
| Focus → code | 17.46 | zoom-through: the camera drives INTO the 09:00 block and comes out inside the work. Growing on both sides |
| code → call | 23.46 | cut-the-curve LEFT, the current |
| call → outro | 32.74 | inverse zoom-through — arrival, shrinking on both sides |

Verified with the motion-doctrine seam gate: **0 fail, 0 warn across 3 seams**
(ledger consistency, exit still moving at the cut, entry mid-flight, measured
direction, entry/exit speed match, zero overlap, Z-sign scan).

```bash
node <motion-doctrine-skill>/scripts/seam-gate.mjs verify \
  --ledger ledger.json --project marketing/how-jarvis-works/composition
```

Stillness before the climax: 16.06 → 16.66 holds before the push into the hour.

## What ships where

| Artefact | Path | Use |
|---|---|---|
| **Black MP4** | `public/how-jarvis-works.mp4` | **The film.** Played by `FilmModal` off the hero's "Watch how it works", and the file to hand any social platform |
| Black poster | `public/how-jarvis-works.jpg` | `poster=` attribute. Cut at 14.6s, the frame where the day has finished drawing |
| Authoring source | `marketing/how-jarvis-works/composition/` | Re-render the MP4 |
| Vector ledger | `marketing/how-jarvis-works/composition/ledger.json` | The seams, as data. Gate input |
| ~~Live-DOM film~~ | `src/components/how-jarvis-works.tsx` | **v1 ONLY, and not mounted anywhere.** See below |

**Ink only.** The `theme` variable and the whole paper token set are still in
`index.html`, but the default flipped to `ink` and the paper pass was not
re-verified for Acts 3-5 — Focus and Meeting Assist are dark-only surfaces in
the app, so a paper cut of them is an invention, not a recording. Rendering
paper again means re-checking contrast and re-deciding those two surfaces
first. The v1 `how-jarvis-works-ink.*` pair was deleted: the main file is now
the ink one, so the suffix meant nothing.

**The live-DOM component is stale.** `src/components/how-jarvis-works.tsx` is
v1's edit — 33.3s, five acts, no Focus, no MCP tool call, no disperse — and it
has no importer. It is dead code that reads as current, which is worse than
missing. Either port it to v2 or delete it; do not mount it as it stands. The
"prefer the component, it is vector text and costs no download" call that used
to live here still holds in principle, and `demo-section.tsx` still documents
it for the other film. It just does not describe anything that ships today.

## Embedding (v1 component — see the warning above)

```tsx
import { HowJarvisWorks } from "@/components/how-jarvis-works";

<HowJarvisWorks theme="paper" />   // ledger-white page (default)
<HowJarvisWorks theme="ink" />     // on a dark surface
```

- Fills its container's width, locks 16:9, scales from a 1920×1080 authoring grid.
- Animates only while on screen (`IntersectionObserver` → `animation-play-state`).
- `prefers-reduced-motion` holds the payoff frame — the briefing and the question
  it hands you. No cycle, no movement.
- One 33.3s CSS cycle keyed off absolute seconds. No JS clock, no animation library.

`paper` leaves its own ground **transparent** so the page shows through — nothing
flips the page theme mid-scroll. Only the terminal is dark, which is already this
site's demo vocabulary.

## Re-rendering the MP4

```bash
cd marketing/how-jarvis-works/composition
npx hyperframes check                       # the gate: lint, runtime, layout, motion, contrast
npx hyperframes render --quality high --output ../../../public/how-jarvis-works.mp4
```

Then re-cut the poster — the frame where the day has finished drawing — and
re-attach it as cover art:

```bash
cd ../../..
ffmpeg -ss 14.6 -i public/how-jarvis-works.mp4 -frames:v 1 -q:v 2 public/how-jarvis-works.jpg -y
ffmpeg -i public/how-jarvis-works.mp4 -i public/how-jarvis-works.jpg -map 0 -map 1 \
  -c copy -c:v:1 mjpeg -disposition:v:1 attached_pic /tmp/x.mp4 -y && mv /tmp/x.mp4 public/how-jarvis-works.mp4
```

Any edit to a scene's first or last ~1s re-opens that seam. Re-run the seam
gate, not just `check` — `check` has no opinion about whether a cut carries.

> `hyperframes check` has **no `--variables` flag**. To gate a theme other than
> the declared default, flip `"default"` in the `data-composition-variables`
> attribute at the top of `index.html`, run `check`, then flip it back.

## Keeping the two in sync

They are **not** in sync any more, deliberately. `index.html` is v2;
`how-jarvis-works.tsx` is v1 and unmounted. The old rule — same 1920×1080
coordinates, same absolute-second timings, same tokens, change one and you must
change the other — applies again the moment the component is ported. Until then
the component is a fossil, not a second copy of the edit.

## Rules that are load-bearing

- **Zero accent pixels before 8.74s.** The threads draw neutral grey and ignite to
  accent on the beat. The accent's force is proportional to the drought before it.
  Window traffic-lights stay monochrome for the same reason.
- **Two easing families, assigned by meaning.** `ARRIVE` for anything that arrives
  and stays, `CONSUME` for anything pulled in or departing.
- **Reading floors are real.** Every line has enough settled time to be read — a
  short label ~0.8s, a sentence ~0.3s/word. The Act 4 timeline reveals on the beat
  grid then **holds as a set** for 1.8s. Do not speed these up; cut copy instead.
- **The eye-bars are the entire character rig.** Never scale below ~0.7 except in
  a blink — the 12×24 pills go square and read as round dots, which is a
  different logo. The mark performs three times and never idles: it **wakes** at
  8.74 and glances from the sources it just connected out to the agent; it
  **searches** at 14.7 — left, right, then finds it and blinks — filling the gap
  between hitting enter and the answer landing; and it **opens wide** on the
  lockup. Every move is **caused by something else on screen**.
- **The mark inverts inside the terminal.** On `paper` the terminal is the one
  dark surface, so `--hw-disc` / `--hw-eye` flip inside `.hw-term` (and `.term`
  in the render source). Miss this and an ink disc lands on ink and disappears.
- **Jarvis never appears in Act 1.** The mark's first appearance at 8.74 is the
  film's reveal, and the accent drought before it is what gives that its force.
  Act 1's argument is the sheer spread of it — five tools overflowing at once.
  Putting the mark on screen there spends the reveal and makes Act 2's "Jarvis
  remembers all of it" a repeat.
- **No cursor in Act 1.** There used to be one, frozen, back when the act opened
  on "you were out for a week" — a still cursor read as you being absent. The
  premise changed to scatter rather than absence, so it stopped meaning anything
  and just sat there as the one motionless thing in a moving frame.
- **Act 1's lower band is carried by opposing vectors, not decoration.** The
  window stack drifts UP ~20px across the act while dropped context chips fall
  DOWN through the gutters — it is getting away from you. The chips are message
  rows tinted by the tool they fell out of, never abstract particles, and they
  sit clear of the headline's text extent so they never cross it.
- **The headline lands a word at a time**, with `everything.` on its own beat out
  of a small overshoot. It is the payload of the line.
- **The display must not be the page ground.** `--hw-screen` is a cool grey on
  paper and a lifted near-black on ink, deliberately *different* from the page.
  Set it to the ground colour and the lid stops reading as a screen and becomes
  a hole in the page — that was the original bug. Tiles then need their own
  shadow to sit on top of it.
- **The machine is lit, not flat.** Shell and deck both carry a vertical
  gradient, a hairline highlight runs the top milled edge, and the deck is a
  real trapezoid (`clip-path`) because a front-on MacBook is wider at the front
  than at the hinge. The **menu bar interrupted by the notch** does more for
  "this is a Mac" than the silhouette does.
- **One pass of light, on the ignite.** The sheen crosses the glass at 8.70–9.85
  as the mark wakes. It is tinted with the accent, not white — a white sheen on
  a light screen is invisible, which is why the first attempt did nothing. It
  fires *on* the ignite, so it does not spend the accent drought.
- **Act 2 is deliberately a plain diagram.** A curved-arc "gravity well" version
  with travelling light packets was built and reverted by product decision: the
  straight tile-and-thread read was preferred. If you rebuild it, the traps that
  cost time last round are recorded below.
- **GSAP `fromTo` renders its from-state immediately.** A from-state of
  `opacity: 0.55` leaks all the way back to frame 0. Use `set` + `to`, or pass
  `immediateRender: false`.
- **CSS keyframes cannot overlap two runs of one property on one element.** GSAP
  hands over between tweens; a keyframe track cannot. Sequence them with a gap so
  the render source and the component behave identically.
- **Ids are global across the whole film.** Act 1's windows own `w-w1..w-w5`. Any
  new Act 2 element must not reuse them: a collision silently applied Act 1's
  `opacity: 0` and the new elements vanished with no error.
- **No menu bar on the display.** One was added and removed: its tint plus its
  bottom hairline read as a grey band across the top of the screen, and the notch
  already does the "this is a Mac" job on its own.
- **Third-party marks** — Slack, Gmail, Telegram and Claude are trademarks of
  their owners, used here to depict integration. Check each owner's brand
  guidelines before publishing this anywhere public.
- **Focus's colour law is inverted, and it is not a style choice.** The MEETING
  is the loud one: a lit band (square at the head, rounded at the tail, starting
  at the rail and running the day's width), a white rail, the brightest text. A
  Jarvis task gets the same-width rail in **indigo** on bare ground and no
  surface at all. Rest gets nothing — no rail, no plate, no hue. A meeting is a
  hard commitment with other people standing in it; a task is Jarvis's
  suggestion and can be re-flowed. One rail width for every block: colour is the
  only variable, because when one variable carries the distinction the column
  reads at a glance and when three do you get a diagram.
- **A booked hour has no rules.** The four hour rules a meeting swallows are
  **not drawn** — not drawn over. Covering them holds everywhere except the
  band's rounded tail, where the radius cuts the corner away and the rule
  reappears in the notch as a hairline pointing at nothing.
- **The band's ground starts at the rail, its text does not.** Leaving that 18px
  strip dark draws a second left edge mid-lane and the band reads as a wide card
  parked next to the axis. It must never run *under* the rail either — blocks
  paint after rails, and a band whose own edge IS the axis is a side-stripe,
  which is what made this screen read as a stack of cards.
- **Focus's build order is the argument.** Axis, then hours, then **your
  commitments**, then the work Jarvis placed around them. That is the colour law
  restated in time. The whole build runs ~1.6s and **no single element exceeds
  420ms** — length comes from stagger, never from slow moves. Meetings land
  damped (a fixed point should feel immovable), tasks settle on a spring with a
  whisper of overshoot (they can still move), and only the live now-marker gets
  real bounce. Nothing enters from `scale(0)`.
- **The task names move; the prose does not.** As each block lands, its name in
  the focus sentence flares and its words lift in turn, left to right — a phrase
  being PICKED UP, running in the direction of reading. Not a shake (the
  system's word for an error) and not a pop (a notification's gesture). The
  surrounding sentence never moves: only `transform` is animated, so nothing
  re-runs layout and the reader never loses their place.
- **A hovered task must never look like a meeting.** The hover ground is a white
  overlay at 0.075 and the band is 0.115, so the meeting stays a step above it
  no matter what is lit. Both halves of a split task light together, an hour
  apart — that is the clearest statement the screen can make that one phrase
  became two hours.
- **The mark is the carrier, not a transition effect.** It flies out of Act 2
  and lands on Focus's lockup at the exact size and position the app's own
  `JarvisLockupMetrics` puts the disc, and the sentence starts on the frame it
  lands. Same object, matched velocity, hard swap at the handover — no
  crossfade, because a crossfade has no carrier at all.
- **Act 4's tool line is the real surface.** `search_context` over the app's
  loopback MCP server on `127.0.0.1:8765`. The locality claim is on screen
  because it is checkable, not because it is a nice line.
- **Disperse is the feature, not a flourish.** The ⌘⇧D hint lands 0.33s before
  the burst — it is the cause, and the burst starts on the same frame. The panel
  is consumed, the call returns to FULL strength and takes the room the panel
  gave back, and the islands dock at the screen edges. The point is that the
  briefing survives and the faces stop being covered; an animation that ends
  with anything over the faces has argued the opposite.
- **Every string is real product material**, lifted from the app's
  `MeetingAssist/MeetingAssistContent.swift`. Meeting Assist is a hard-coded demo
  in the app today; the film shows it exactly as it renders, which is the honest
  bound. Do not invent a claim to fill a beat.

## Provenance

Plan: `plan.md` (v1) · Handoff: `composition-brief.md` (v2) · Captions: `share-copy.txt`,
`share-copy-variants.md`. Runs: v2 `jarvis-ai-core/brag-output-2026-08-28/` · v1 `jarvis-ai-core/brag-output-2026-08-21/`.
