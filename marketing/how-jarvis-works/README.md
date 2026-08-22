# "How Jarvis works" — the film

A 33.3s product film. One story, not a feature tour: nobody can hold what is
spread across every tool, so Jarvis does. Context gathers, you ask one question
and get a cited answer, and at 11:00 a 1:1 starts that Jarvis records, briefs
and hands you a checklist for.

Authored 2026-08-21 in [HyperFrames](https://hyperframes.heygen.com) (HTML → MP4).

## The shipped edit

Authoritative beat sheet, read off the composition. If this and the prose in
`plan.md` ever disagree, this wins.

| Act | Window | What happens | Copy on screen |
|---|---|---|---|
| **1** | 0.00 - 5.45 | Five app windows fill with messages, real app icons in the title bars, red unread counts popping in (24, 18, 7, 12, 3). The stack drifts up while dropped context chips tumble down the gutters. Date ticks Aug 14 to Aug 21. | `You can't remember everything.` (word by word) / `It's spread across every tool.` |
| **2** | 5.06 - 12.40 | A MacBook. Four sources land as tiles, threads draw neutral into the mark. **8.74: the first accent in the film** - threads ignite, light sweeps the glass, the mark wakes, blinks, glances left at the sources then right along the thread out to Claude Code. | `Jarvis remembers all of it.` / `Nothing leaves your Mac.` |
| **3** | 12.30 - 20.75 | Claude Code terminal. `what did I miss on the payments bug?` types out. The mark appears and searches - left, right, finds it, blinks - then `Jarvis · local` ignites and the answer resolves with a citation chip. | `Tom's fix is in review - not shipped. It double-charged 3 customers.` / `↳ #eng · 3 days ago` / `You didn't read the week. It did.` |
| **4** | 20.65 - 30.47 | 11:00, a 1:1 with David Park, recording with a ticking clock. The call transcribes itself. The briefing flies in: **While you were out** (three dated markers) then **What to clarify** (three checkboxes, the high-priority one in accent). | `You know nothing.` then `Now you do.` |
| **5** | 30.20 - 33.30 | The mark scales in, blinks, opens wide. | `You walked in cold.` / `Jarvis didn't.` / `jarvis_` |

**Total: 33.3s, 1920x1080, 30fps.** Sources shown: Slack, Gmail, Telegram, Meetings.
Every string in Act 4 is lifted from the app's `MeetingAssist/MeetingAssistContent.swift`.

## What ships where

| Artefact | Path | Use |
|---|---|---|
| **Live-DOM film** | `src/components/how-jarvis-works.tsx` | **The page.** Real text, ~0 bytes of media, re-flows |
| White MP4 | `public/how-jarvis-works.mp4` | Social / OG / anywhere a real video file is what the platform wants |
| White poster | `public/how-jarvis-works.jpg` | `poster=` attribute, OG image |
| Black MP4 | `public/how-jarvis-works-ink.mp4` | Same edit on the app's native near-black |
| Black poster | `public/how-jarvis-works-ink.jpg` | |
| Authoring source | `marketing/how-jarvis-works/composition/` | Re-render the MP4s |

**Prefer the component on the page.** The MP4 is 2.5 MB and 720p-ish type; the
component is vector text at the device's own resolution and costs no download.
This is the same call `demo-section.tsx` documents for the earlier film.

## Embedding

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

## Re-rendering the MP4s

```bash
cd marketing/how-jarvis-works/composition
npx hyperframes check                                              # the gate
npx hyperframes render --quality high --output ../../../public/how-jarvis-works.mp4
npx hyperframes render --quality high --variables '{"theme":"ink"}' \
  --output ../../../public/how-jarvis-works-ink.mp4
```

Then re-cut the posters (the frame where the briefing has fully landed) and
re-attach them as cover art:

```bash
cd ../../..
ffmpeg -ss 25.4 -i public/how-jarvis-works.mp4 -frames:v 1 -q:v 2 public/how-jarvis-works.jpg -y
ffmpeg -i public/how-jarvis-works.mp4 -i public/how-jarvis-works.jpg -map 0 -map 1 \
  -c copy -c:v:1 mjpeg -disposition:v:1 attached_pic /tmp/x.mp4 -y && mv /tmp/x.mp4 public/how-jarvis-works.mp4
```

> `hyperframes check` has **no `--variables` flag**. To gate the ink theme, flip
> `"default":"paper"` → `"ink"` in the `data-composition-variables` attribute at
> the top of `index.html`, run `check`, then flip it back.

## Keeping the two in sync

`index.html` (the render source) and `how-jarvis-works.tsx` (the page) are the
**same edit, twice** — same 1920×1080 coordinates, same absolute-second timings,
same tokens. Change one and you must change the other, or the site and the social
cut drift apart. The token pair is copied from `context-demo.tsx:260-298`; all
three files share it.

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
- **Every string is real product material**, lifted from the app's
  `MeetingAssist/MeetingAssistContent.swift`. Meeting Assist is a hard-coded demo
  in the app today; the film shows it exactly as it renders, which is the honest
  bound. Do not invent a claim to fill a beat.

## Provenance

Plan: `plan.md` · Handoff: `composition-brief.md` · Captions: `share-copy.txt`,
`share-copy-variants.md`. Original run: `jarvis-ai-core/brag-output-2026-08-21/`.
