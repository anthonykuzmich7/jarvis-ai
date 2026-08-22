# Brag Plan: Jarvis — "How Jarvis works"

> **Status note.** This is the ORIGINAL plan, kept for provenance. The shipped
> film diverged through several rounds of direction: the opening is now about
> context being spread across tools rather than a week away, the fourth source
> is Meetings rather than Calendar, Act 2 ends at a Claude Code mark, Act 4
> gained recording plus a transcript plus a "what to clarify" checklist and lost
> its climax banner, and the runtime is 33.3s. **For what actually shipped, read
> the beat sheet in `README.md`.**


> Run: 2026-08-21. Second `/brag` on this project. The first run (`brag-output/`)
> made the *Claude Code / MCP* argument in 22.5s and shipped twice — as
> `public/jarvis-demo.mp4` and, better, as live DOM in
> `jarvis-ai/src/components/context-demo.tsx`. **This run is a different film**:
> the product-level "how it works", covering context → answers → meetings.
> It reuses that run's brand system and its paper/ink token contract verbatim.

## What is this app?

Jarvis is an AI teammate that continuously reads your Slack, Gmail, Telegram and
calendar into a private on-device index, answers questions from it instantly, and
— when a call starts — hands you a briefing of everything you missed before
anyone asks you about it.

## The angle

The user asked for four things: it collects context, it answers fast, it assists
in meetings, and it tells you what's going on **even when you know nothing**.

Four claims in a feature tour proves none of them. So all four are delivered as
**one scenario, with a clock running through it** — and it happens to be a
scenario the product already owns, hard-coded and product-approved
(`MeetingAssist/MeetingAssistContent.swift`):

> **You can't remember everything. At 11:00 you have a 1:1 with your manager.**

That single premise makes each capability a *consequence* of the last, not a
bullet:

| The user's ask | Where it lands | Why it's earned |
|---|---|---|
| Collects all the context | Act 1 | The week happens without you — Jarvis is the only thing reading it |
| Answers faster / more efficiently | Act 2 | You ask one question and get the specific answer, cited |
| Assists you in meetings | Act 3 | 11:00 hits and the briefing arrives on its own |
| Tells you what's going on even if you know nothing | Act 3 climax | "David will ask: *Is the payments bug fixed?*" |

**Specific to this project and no other.** Every value on screen is real product
material, not invented for the film:

- The week's events are `MeetingAssistContent.missed` verbatim — checkout bug /
  double-charged 3 customers / Tom's fix in review; signup redesign on staging;
  launch date owed. Their date labels are **live-computed** in the app
  (`MissedItem.dateLabel`), so the film uses the same relative labelling.
- The climax line is `MeetingAssistContent.blockers[0]`, `.high` priority.
- The meeting is `1:1 · David Park`, the app's own `meetingTitle`.
- The colour system is `Theme.swift` (ink) and the Panxo tokens from
  `jarvis-ai/src/app/globals.css` (paper) — the exact pair `context-demo.tsx`
  already ships.

## Hook (first 2-3 seconds)

No product. No logo. Five windows quietly filling with messages you are not
reading, a date label ticking forward, and context chips already spilling out
of the pile. Then two flat lines:

> **You can't remember everything.**
> **It's spread across every tool.**

That earns the next 28 seconds because it is the viewer's actual fear, stated
before anything is sold to them.

## Key moments (the middle)

- **The chrome falls away.** Five windows collapse; their content compresses into
  four source tiles that thread into the pause-disc mark. The **first accent pixel
  in the film** lands on that thread. This is "collects all the context," shown as
  a physical action instead of an integrations logo wall.
- **The thread ends at your agent.** Sources → Jarvis → Claude Code, all of it
  inside one MacBook. `The index never leaves your Mac.`
- **The question, answered from the week.** `what did I miss on the payments bug?`
  types out; `● Jarvis · local` ignites; the reply resolves *specific*, with the
  citation chip `↳ #eng · 3 days ago`. → **You didn't read the week. It did.**
- **11:00.** The call window opens on `1:1 · David Park` and it is EMPTY — you have
  nothing. Two seconds of that, on purpose.
- **The briefing flies in from the edge** (the app's real disperse-mode island
  vocabulary) and the week you missed lands as a timeline, one marker at a time.
- **The climax is a question, not a feature.** The blocker chip:
  **`David will ask — Is the payments bug fixed?`** That is the whole product in
  one line: it doesn't just tell you what happened, it tells you what you're about
  to be asked.

## Outro / punchline

Everything collapses inward. The mark scales in and the eye-bars blink once, then
open wide — the app's own character rig (`OwlMark` / `jarvis-mark.tsx`). Then:

> **You walked in cold.**
> **Jarvis didn't.**

Then the wordmark `jarvis_`. **No URL** — the site has no confirmed public domain
(`.vercel/project.json` is a preview project, `hello@jarvis.ai` in the FAQ is a
placeholder). Don't put a link on screen we can't stand behind.

## User flow worth showing

Entry → key action → result, all three from the real product, and all three are
the centrepiece scenes (2, 3, 4):

1. **Entry** — sources connect and index continuously in the background; the Hub's
   own source tiles (Slack / Gmail / Telegram / Meetings) go connected.
2. **Key action** — ask one question against the indexed week.
3. **Result** — a cited, specific answer; and at 11:00, an unrequested briefing
   that names the question your manager is about to ask.

> **Fidelity note.** This is recreated UI in HTML, not screen footage. Every
> string is lifted from `MeetingAssistContent.swift` or the missed-items table, so
> nothing on screen is a claim the product doesn't make. **Meeting Assist is a
> hard-coded demo in the app today** (CLAUDE.md, "Meeting Assist — Jarvis on the
> call") — the film shows it exactly as it renders, which is the honest bound. If
> the citation chip is ever re-cut as real footage, run
> `jarvis context "payments bug" --top-k 5` first and confirm the top hit.

## Tone

- **Preset:** `polished`
- **Creative direction:** quiet competence — a briefing, not a pitch. The calm of
  someone who is not panicking because they don't have to.
- **Interpretation:** Long holds, few scenes, one idea per scene. Restraint is the
  argument: a product that claims to reduce your anxiety cannot be sold with an
  anxious edit. No zooms for their own sake, no whip pans, no stat cards. Motion is
  causal — things move because something moved them. This matches PRODUCT.md's
  explicit anti-reference ("hype AI startup, glowing gradients, screaming hero
  metrics").

## Format: landscape — 1920x1080
## Duration: 31s

> **Deliberate overrun of the skill's 15-25s law.** The user chose the three-act
> shape over a 20s cut. Three acts at ~7-9s each is the floor for this story: the
> meeting act alone carries a timeline that has to be *read*, and compressing it
> is exactly the failure mode the reading-time rule warns about. 31s is the
> shortest version of this film that still lands.

## Visual identity (from the project)

Two themes, one composition. **These tokens are not invented — they are copied
from `context-demo.tsx` lines 260-298, so the new film and the film already on the
site are the same object.**

| Token | `ink` (black) | `paper` (white) |
|---|---|---|
| Ground | `#0A0A0B` | `#FAFAFA` (in the component: transparent, page shows through) |
| Text | `#F4F4F5` | `#1C1A17` Coal Ink |
| Text 2 | `#A1A1AA` | `#5A5957` Graphite |
| Surface / window | `#141416` | `#1C1A17` (only the terminal is dark) |
| Row / elevated | `#1A1A1E` | `rgba(255,255,255,.05)` |
| **Accent** | `#6366F1` indigo | `#777EFF` Signal Violet |
| Accent text | `#818CF8` | `#9BA0FF` |
| Accent tint | `rgba(99,102,241,.16)` | `rgba(119,126,255,.14)` |
| Tile | `#141416` | `#FFFFFF` |
| Hairline | `rgba(255,255,255,.09)` | `#F1F1F1` Ash |
| Disc / eye | paper disc, ink eyes | ink disc, paper eyes |

- **Display font:** SF Pro Display for the rendered MP4s (matches the macOS app and
  what the first film rendered with); the React component uses the site's own
  `--font-geist-sans` / `--font-inter`. Same precedent `context-demo.tsx` set.
- **Body/mono font:** SF Mono → `--font-geist-mono` in the component.
- **Strongest visual element:** the pause-disc mark whose two pills double as eyes.
  It is the only character in the film and the only thing that blinks.
- **Grain is mandatory.** Depth tiers on the ink theme differ by 4-6 RGB points on
  large flat near-black fields — exactly where 8-bit H.264 bands. Carried over from
  the first composition.

### Accent discipline (load-bearing)
**Zero accent pixels before Scene 2's thread.** The accent's force is proportional
to the drought before it. Window traffic-lights stay monochrome in the ink theme
for the same reason; the "you are absent" week is entirely greyscale.

## Share copy (draft)

You can't remember everything. Jarvis wasn't — it read your Slack, Gmail and calendar the
whole time, and when your 1:1 started it told you what your manager was about to ask.

## Audio direction

- **Role:** sparse professional accents over a low bed. The bed is *presence*, not
  a hook — this is a film about calm.
- **Music:** `happy-beats-business-moves-vol-12-by-ende-dot-app.mp3` (109.96 BPM).
  Chosen over vol-9 because its strong cues at 8.74 / 13.11 / 17.47 / 18.56 / 22.93
  sit close to this storyboard's act boundaries. It is an upbeat corporate bed, so
  it must be **held down** — see restraint rule.
- **Music treatment:** start at 0.0 at low gain (~0.16), lift a step at the Scene 2
  thread and again at 11:00, **duck under the typing in Scene 3**, and fade to
  silence across the last 1.2s so the outro lines land dry.
- **Music cue guidance:** the bundled preset's planning window stops at 25.0s and
  this film runs 31s. Beat period is 0.5456s — extend the grid, or re-derive the
  full track with `npx hyperframes beats` at composition time. Targets:
  - Act 1 → Act 2 turn: **8.74s** (strong, 0.99)
  - The citation chip: **17.47s** or **18.56s** (both 0.99)
  - The "David will ask" climax: **~25.7s** (extrapolated; verify against a
    re-derived grid before pinning)
  - Sequential reveals (message rows in Act 1, timeline markers in Act 4) run on the
    **beat grid at 0.545s spacing**, which is exactly the tempo — a free rhythm.
- **Audio-reactive treatment:** none. Reactive glow would fight the accent-drought
  rule and read as the hype-AI aesthetic PRODUCT.md bans.
- **SFX posture:** sparse and motion-matched. Roughly: soft row-arrival ticks
  accelerating in Act 1; one dry impact when the chrome collapses; keyboard ticks on
  the typed query; one bell on the citation chip; one soft whoosh as the briefing
  panel flies in; one clean, low hit on the "David will ask" chip. Nothing else.
- **Audio-coupled moments:** the accelerating message pile-up (Act 1), the typed
  query (Act 3), the timeline markers arriving one by one (Act 4), the blocker chip
  landing (Act 4 climax).
- **Restraint rule:** the music must never carry a moment on its own, must never
  swell into a "reveal", and must be fully out before the final two lines. If a beat
  and a readable line disagree, **the line wins** — no reveal moves off its reading
  floor to hit a cue.

## Storyboard

### Scene 1 — The week you missed — 5.0s (0.0 → 5.0)
Five app windows in a loose stack, each with its real app icon, brand-tinted
avatars, and a red unread badge that pops in as the pile grows: Slack #eng,
Gmail Inbox, Calendar, a Notion-style doc, Slack DMs. Message rows arrive inside
them, slowly at first then piling up. A date label top-right ticks across the week.
**The stack drifts UP ~20px across the act while dropped context chips fall DOWN
through the gutters** — opposing vectors; it is getting away from you.
The headline lands a word at a time from 1.64s, with `everything.` on its own beat
out of a small overshoot. At 3.27s: `It's spread across every tool.`
Reading floor: line 1 settled by 2.72s, line 2 by 3.72s — both hold to the cut.
No cursor: a frozen one meant "you are absent", which was the *old* premise.
Sequential/interaction: yes — ~9 message rows arrive one by one across the five
windows, spacing tightening from ~0.55s to ~0.2s (beat grid, then sub-beat).
Audio intent: a room you're not in. Low bed enters under the first rows; the ticks
accelerate into a light pile-up that becomes uncomfortable right before the cut.
Audio-coupled idea: per-row arrival ticks, accelerating.
Music: low, present, no hook.
Transition mood: hard cut → Scene 2.

### Scene 2 — It was all being read — 7.4s (4.6 → 12.0)
The windows' chrome dissolves (title bars, tabs, sidebars go first — the app taught
this grammar on disposables in the Remotion film; same idea). Each window's content
compresses into one source tile: **Slack, Gmail, Telegram, Meetings**, landing one
at a time. A thread draws from each tile into the pause-disc mark at centre — **the
first accent in the film**. Camera settles back to reveal a laptop outline around
the whole thing; the thread carries on into the Claude Code mark, still inside the machine.
Captions: `Jarvis remembers all of it.` then, small and quiet,
`The index never leaves your Mac.`
Reading floor: line 1 ≈ 1.5s, line 2 ≈ 1.8s. Both hold ≥ 2.0s.
Sequential/interaction: yes — 4 source tiles land one by one on the beat grid
(~0.55s apart), each drawing its thread behind it as it goes.
Audio intent: relief. The pile-up resolves into one object.
Audio-coupled idea: one dry impact on the chrome collapse; a soft tick per tile;
nothing on the thread — it should feel silent and inevitable.
Music: steps up one notch at the first thread.
Transition mood: clean, soft → Scene 3.

### Scene 3 — One question — 7.4s (11.6 → 19.0)
A single terminal window, centred, dark in both themes. The query types out at real
speed: `what did I miss on the payments bug?` A beat of nothing. Then
`● Jarvis · local` ignites in the accent, and the reply resolves — specific, not
hedged:
`Tom's fix is in review — not shipped. It double-charged 3 customers.`
Then the citation chip lands under it: `↳ #eng · 3 days ago`.
Caption after the chip: `You didn't read the week. It did.`
Reading floor: the reply is 11 words ≈ 3.3s settled — it holds to the cut. Caption
≈ 1.9s.
Sequential/interaction: yes — simulated typing character by character, then a
deliberate 0.4s pause before the status dot ignites, then the reply, then the chip.
Audio intent: precision. Dry, close, no reverb.
Audio-coupled idea: keyboard ticks on the typed query (music ducks under them); one
soft bell on the citation chip — the only bright sound in the film so far.
Music: ducked under the typing, back up as the reply resolves.
Transition mood: hard cut → Scene 4.

### Scene 4 — 11:00 — 9.4s (18.6 → 28.0)
A call window: `1:1 · David Park`, two participant tiles, a clock reading `11:00`.
It holds **empty** for a beat with one small caption: `You know nothing.`
Then the Jarvis briefing island flies in from the screen edge (the app's real
disperse-mode motion) and the week lands as a timeline, marker by marker:
- `Aug 18 — Checkout bug halted the release`
- `Aug 20 — Signup redesign on staging`
- `Today — Launch date owed`
(dates rendered relative to the render date, mirroring `MissedItem.dateLabel`;
headlines are the real `missed` table, detail lines omitted for reading time)
The full set **holds ~1.8s**. Then everything else dims and the climax chip lands
in the accent:
**`David will ask — Is the payments bug fixed?`**
It holds ~2.2s. Nothing else moves.
Reading floor: caption ≈ 1.2s; three markers ≈ 1.3s each but revealed 0.55s apart
then held as a set for 1.8s (the skill's sequential-text pattern — reveal fast, hold
the set); climax chip 7 words ≈ 2.1s, held 2.2s.
Sequential/interaction: yes — panel flies in, then 3 timeline markers arrive one by
one on the beat grid, then the blocker chip lands as a separate, isolated event.
Audio intent: arrival, then stillness. The chip is the quietest loud moment in the
film.
Audio-coupled idea: one soft whoosh on the panel entry; a tick per timeline marker;
one clean low hit on the blocker chip, then **silence under it**.
Music: last step up as the panel arrives; begins its fade as the chip lands.
Transition mood: soft, everything collapses inward → Scene 5.

### Scene 5 — Outro — 3.4s (27.6 → 31.0)
The call and the panel close inward toward centre. The pause-disc mark scales in,
blinks once, then opens wide. Two lines, one after the other:
> `You walked in cold.`
> `Jarvis didn't.`
Then the wordmark `jarvis_` with its blinking cursor, small, and hold on stillness.
Reading floor: 1.2s each, both clear.
Sequential/interaction: the blink is the only motion. No confetti, no scale-bounce.
Audio intent: dry. Music is already out; the last 1.4s is silent except the room.
Audio-coupled idea: none — deliberately. Silence is the last beat.
Music: faded to zero by 29.8s.
Transition mood: end.

**Music mood for this video:** low, warm, corporate-restrained — held under the
film at all times and out entirely for the last two lines.
**Audio summary:** an accelerating pile-up of things you're not reading resolves
into one calm object, sharpens to a single dry keystroke-and-bell exchange, arrives
once more at 11:00, and then gets out of the way so the last two lines land in
silence.

## Deliverables for this run

| # | Artefact | Path |
|---|---|---|
| 1 | White (paper) film, landscape | `brag.mp4` (+ `brag.jpg` poster, baked as frame 0) |
| 2 | Black (ink) film, landscape | `brag-ink.mp4` (+ `brag-ink.jpg`) |
| 3 | Embeddable React component, `theme="paper" \| "ink"` | `jarvis-ai/src/components/how-jarvis-works.tsx` |
| 4 | Share copy | `share-copy.txt` |

The MP4s and the component are the **same edit**, authored once in HyperFrames and
ported the way `context-demo.tsx` was: one CSS cycle keyed off absolute seconds, no
animation library, no JS clock, `animation-play-state` toggled by a scroll observer.
