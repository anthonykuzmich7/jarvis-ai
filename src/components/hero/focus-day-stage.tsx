"use client";

import * as React from "react";
import { motion, useReducedMotion } from "framer-motion";
import { JarvisMark } from "@/components/jarvis-mark";
import { ColorBrandMark } from "@/components/brand-marks";
import { Video } from "lucide-react";

/*
  Focus — the hero's first capability, and the newest one.

  Jarvis reads everything overnight and hands you the day: one sentence
  saying what to start with and who is waiting, then the hours it put that
  work in, around the meetings you cannot move.

  ── The card ─────────────────────────────────────────────────────────

  Paper, not a window. The site's own light card, the same object
  `FeatureShowcase`'s morning briefing and `MissionControl`'s context card
  are built from. Jarvis's own output is a document; only the tools it plugs
  into (a terminal, a video call) are dark, which is why the other two hero
  tabs are and this one is not.

  An agenda, not a scale drawing. The day was drawn to scale for a while —
  every entry as tall as the hours it took — and a two-hour review next to
  a one-hour 1:1 read as one big card and one small one, with a hand of
  empty paper between them. That is honest and it is also a mess to scan.
  Now it is a uniform list: one row per entry, every row the same height,
  hairline-divided the way the FAQ and the overlay section divide theirs.
  The rows are still in clock order and each still prints its start time, so
  the sequence of the day survives; the drawing-to-scale did not.

  Three columns, and the left two are fixed so the whole list aligns down a
  single edge: a start time in the mono face, then a short rail in the
  entry's colour, then everything the entry says.

  The rail is the one place a colour is allowed. A meeting's rail is the
  calendar's periwinkle — Signal Violet, the hour is quoted from a calendar
  Jarvis could not move — and a task's rail is ink at low strength, because
  Jarvis placed it and it can still move. Both brighten under the pointer.

  A small kind label — "Task" or "Meeting" — sits over every title, in the
  rail's own colour, the fastest answer to "what kind of hour is this" for
  someone scanning before they read. Anything running longer than an hour
  says so beside the label ("Task · 2h"); the row height no longer carries
  that, so a word does.

  The mark says what, never who. A meeting carries the video tool it will
  open in (Google Meet's mark, today) and work carries the tool Jarvis read
  it out of. It sits right beside the title, not floated to the card's far
  edge.

  Hover offers the way in at the row's right edge — Join a meeting, open the
  tool a task came from. It parks out there rather than beside the title,
  where it kept nudging the title sideways as it faded in. Nothing at rest.

  ── The motion ───────────────────────────────────────────────────────

  Three movements, and each one says something:

    1. Jarvis speaks.   The mark, the title, the date and the sentence
                        arrive as one object.
    2. The day opens.   The agenda fades in under the sentence.
    3. The day fills.   Your calendar, then Jarvis's work between it.

  That is the whole product in three beats, and the last two are the claim:
  Jarvis fitted work into a day that already existed. Reversed or
  interleaved, the card would say it invented one.

  There was a fourth beat between the first and the second: three smolder
  underlines drawing at once under the named work. They are still here, but
  they are drawn by the READER now, one at a time, on hover. Standing by
  default they marked every task the moment the card opened, which is a lot
  of accent spent saying what the bold weight already said. On hover the
  same rule earns its colour: it answers one question, asked by one person,
  about one phrase.

  Hovering a phrase also lights its row in the agenda below, and hovering a
  row draws the underline back up in the sentence. The link runs both ways
  because the claim runs both ways: the sentence is the day, sorted. A row
  lights three ways at once — a faint wash behind it, its rail brightening,
  an ink underline under its title — none of them a border, so a hovered
  row never boxes itself. Meetings light too, so a row that ignored the
  pointer on a card where every other one answers it does not read as
  broken.

  The two ends of that link do not share a colour. The sentence keeps
  smolder, the same rule the hero headline strikes under its own word; the
  day's echo of it is ink, a quieter rule for a quieter part of the card.

  Everything else that used to move has been cut, because "more animation"
  and "more legible" stopped pointing the same way a long way back. What
  went, and why:

  Four flying ghost texts. Each task name detached from the sentence and
  flew down into its hour, shrinking as it went, and the split review flew
  twice. It was the cleverest thing here and the worst: four texts crossing
  the card at once is the reader's whole attention spent on a connection the
  COPY already makes, since the row says the same words the sentence does.
  A demo-reel stunt dressed as an argument.

  A stagger on every list. Seven sentence fragments 50ms apart, hour rules
  drawing one after another, rows arriving one by one. Each was defensible
  alone; together the card never stopped moving for three seconds. A drip
  feed also says the plan is being computed while you watch, when the point
  is that it was finished before you sat down. The agenda now arrives in two
  gestures, not ten: the meetings, then the work between them.

  ── The palette ──────────────────────────────────────────────────────

  Smolder means "this is what you are pointing at" exactly once on the card:
  the underline a hovered phrase draws in the sentence, the same rule the
  hero headline strikes under its own word. It never appears in the agenda
  below.

  Signal Violet is the one deliberate exception to "every word on the card
  is ink or grey": the rail beside a meeting and the "Meeting" label above
  it. Panxo reserves the hue for machine-classification, which is exactly
  the job here — Jarvis marking the hours your calendar already owns.
  Nothing periwinkle on the card responds to a click.

    coal-ink       what Jarvis is telling you to do, the Join pill, a
                   hovered title's underline, an entry's title
    graphite       why a meeting is where it is
    slate-mid      why a task is where it is
    stone          the start times down the left, the "Task" label
    signal-violet  a meeting's rail and its "Meeting" label
    ink low-alpha  a task's rail

  The only other colour is the real product logos (GitHub, Linear, Slack,
  Google Meet), which are coloured because they are logos.

  Copy is the app's own demo state (jarvis-ai-core,
  `Sources/JarvisGuideApp/TodayUI/TodayContent.swift`), so the app, the film
  and this card never disagree about what the day looks like.
*/

const EASE = [0.16, 1, 0.3, 1] as const;

/** The site's shared light-card shadow, from `FeatureShowcase`. */
const CARD_SHADOW =
  "rgba(95,99,106,0.10) 0px 0px 0px 1px, rgba(43,43,48,0.12) 0px 4px 20px 0px";

/** The rail colours — the one place a hue is allowed on the card.

    Signal Violet, #777eff, for a meeting: Panxo gives that token one job,
    it signals machine classification rather than human action, which is
    exactly the job here — Jarvis marking the hours your calendar already
    owns. Ink at low strength for a task, because Jarvis placed it and it
    can still move. Both brighten under the pointer. */
const MEETING_RAIL = "rgba(119,126,255,0.85)";
const MEETING_RAIL_LIT = "#777eff";
const TASK_RAIL = "rgba(28,26,23,0.32)";
const TASK_RAIL_LIT = "rgba(28,26,23,0.6)";
/** The wash a hovered row lays down behind itself, the echo of the
    underline a hovered phrase draws in the sentence. */
const MEETING_WASH = "rgba(119,126,255,0.07)";
const TASK_WASH = "rgba(28,26,23,0.04)";

/* ── Beats, in ms after mount ─────────────────────────────────────

   Four, and no stagger inside any of them. The whole sequence is spent in
   about two seconds, which is roughly a third of what it cost when every
   list on the card had a cascade of its own. */

/** The sentence has been readable for a beat; the card grows into the day. */
const OPEN_AT = 1250;
/** Your calendar, once the hours it sits in have been ruled. */
const CAL_AT = OPEN_AT + 340;
/** Then the work, in the gaps left between. */
const WORK_AT = OPEN_AT + 640;

/* ── The day ─────────────────────────────────────────────────────── */

type Source = "slack" | "gmail" | "linear" | "github";

type Row = {
  kind: "task" | "event";
  id: string;
  /** When it starts, and how long it runs. Halves are allowed: a
      thirty-minute 1:1 is a real thing, and drawing it a full hour tall
      would be the first lie on the card. */
  at: number;
  hours: number;
  title: string;
  /** Dropped on anything shorter than an hour, which has no room for it —
      the same call Calendar makes in a half-height slot. */
  note?: string;
  source?: Source;
};

/** What a task's hover offers, by where Jarvis read the work out of. The
    verb is the second half of the classifier: a meeting is something you
    join, work is something you open. */
const VERB: Record<Source, string> = {
  github: "Open PR",
  linear: "Open issue",
  slack: "Open thread",
  gmail: "Open email",
};

const ROWS: Row[] = [
  {
    kind: "task",
    id: "pr",
    at: 8,
    hours: 2,
    title: "Review Tom’s payments PR",
    note: "three days old, and the release is behind it",
    source: "github",
  },
  {
    kind: "event",
    id: "1on1",
    at: 10,
    hours: 1,
    title: "1:1 with David Park",
    note: "weekly, and he owes leadership a number",
  },
  {
    kind: "task",
    id: "demo",
    at: 11,
    hours: 1,
    title: "Prepare Friday’s demo",
    note: "the payments flow, end to end",
    source: "linear",
  },
  {
    kind: "event",
    id: "sync",
    at: 13,
    hours: 1,
    title: "Launch sync",
    note: "the whole team, no agenda yet",
  },
  {
    kind: "task",
    id: "sign",
    at: 14,
    hours: 1,
    title: "Sign off Sarah’s redesign",
    note: "last, nobody blocked behind it",
    source: "slack",
  },
];

/* The sentence, as steps: an optional lead-in, one bold task phrase, and
   the connective that follows it. Each phrase gets the headline's underline
   and lights its hour in the agenda.

   `trailMobile` is a shorter connective used below `sm`. On the phone the
   sentence collapses to a plain sequence — "Start with X, then Y and Z" —
   so the word "then" lands once, not twice, and the "who's waiting" clause
   (desktop-only) is dropped: at 360–390px nothing short of dropping it
   keeps the sentence under four lines. Each phrase is also glued to its
   own trailing connective (`whitespace-nowrap`) below `sm`, so a wrapped
   line begins with a bold phrase and never with a stray ", then". */
type Step = {
  lead?: string;
  task: string;
  phrase: string;
  trail: string;
  trailMobile?: string;
};

/* Trails carry NO trailing space — the break-here space is rendered
   separately, outside the `whitespace-nowrap` wrapper, or it would be
   trapped as non-breaking and the whole sentence would refuse to wrap. */
const STEPS: Step[] = [
  {
    lead: "Start with ",
    task: "pr",
    phrase: "review Tom’s payments PR",
    trail: ". Tom, David and Sarah are all waiting on it. Then",
    trailMobile: ", then",
  },
  {
    task: "demo",
    phrase: "prepare Friday’s demo",
    trail: ", then",
    trailMobile: " and",
  },
  { task: "sign", phrase: "sign off Sarah’s redesign", trail: "." },
];

/* ── Clock ───────────────────────────────────────────────────────
   The page is prerendered, so a date baked at build time is the wrong date
   by the time anyone reads it. Same server/client split the meeting stage
   uses for its dates: a stable seed on the server, the real value after
   hydration, both from a referentially stable snapshot. */

const SEED_DATE = "Thursday, 29 August";

let liveDate: string | null = null;
const noopSubscribe = () => () => {};
const getSeedDate = () => SEED_DATE;

function getLiveDate() {
  if (!liveDate) {
    const d = new Date();
    const weekday = d.toLocaleDateString("en-GB", { weekday: "long" });
    const month = d.toLocaleDateString("en-GB", { month: "long" });
    liveDate = `${weekday}, ${d.getDate()} ${month}`;
  }
  return liveDate;
}

function useToday() {
  return React.useSyncExternalStore(noopSubscribe, getLiveDate, getSeedDate);
}

/** True where the primary pointer cannot hover — a phone. The sentence↔
    agenda link is wired to hover on a mouse and to tap here, because a
    phone's synthetic mouseenter/leave around a tap would light the row and
    clear it again in the same gesture. Starts false so server and first
    client paint agree; corrects after mount, before any interaction. */
function useCoarsePointer() {
  const [coarse, setCoarse] = React.useState(false);
  React.useEffect(() => {
    const mq = window.matchMedia("(hover: none)");
    const sync = () => setCoarse(mq.matches);
    sync();
    mq.addEventListener("change", sync);
    return () => mq.removeEventListener("change", sync);
  }, []);
  return coarse;
}

const hhmm = (hour: number) => `${String(hour).padStart(2, "0")}:00`;

/* ── Marks ───────────────────────────────────────────────────────
   Bare, at 14px, in their own colours. An earlier pass put each one in a
   bordered white tile, which is a box drawn on a card to lift a logo off a
   ground it was already legible on.

   Linear's path is copied verbatim from Simple Icons (CC0-1.0), as
   `brand-marks.tsx` does for the same mark, and filled with Linear's own
   #5E6AD2 rather than `currentColor`. */
const GITHUB_PATH =
  "M12 .297c-6.63 0-12 5.373-12 12 0 5.303 3.438 9.8 8.205 11.385.6.113.82-.258.82-.577 0-.285-.01-1.04-.015-2.04-3.338.724-4.042-1.61-4.042-1.61C4.422 18.07 3.633 17.7 3.633 17.7c-1.087-.744.084-.729.084-.729 1.205.084 1.838 1.236 1.838 1.236 1.07 1.835 2.809 1.305 3.495.998.108-.776.417-1.305.76-1.605-2.665-.3-5.466-1.332-5.466-5.93 0-1.31.465-2.38 1.235-3.22-.135-.303-.54-1.523.105-3.176 0 0 1.005-.322 3.3 1.23.96-.267 1.98-.399 3-.405 1.02.006 2.04.138 3 .405 2.28-1.552 3.285-1.23 3.285-1.23.645 1.653.24 2.873.12 3.176.765.84 1.23 1.91 1.23 3.22 0 4.61-2.805 5.625-5.475 5.92.42.36.81 1.096.81 2.22 0 1.606-.015 2.896-.015 3.286 0 .315.21.69.825.57C20.565 22.092 24 17.592 24 12.297c0-6.627-5.373-12-12-12";

const LINEAR_PATH =
  "M2.886 4.18A11.982 11.982 0 0 1 11.99 0C18.624 0 24 5.376 24 12.009c0 3.64-1.62 6.903-4.18 9.105L2.887 4.18ZM1.817 5.626l16.556 16.556c-.524.33-1.075.62-1.65.866L.951 7.277c.247-.575.537-1.126.866-1.65ZM.322 9.163l14.515 14.515c-.71.172-1.443.282-2.195.322L0 11.358a12 12 0 0 1 .322-2.195Zm-.17 4.862 9.823 9.824a12.02 12.02 0 0 1-9.824-9.824Z";

function SourceMark({ name }: { name: Source }) {
  if (name === "slack") return <ColorBrandMark name="slack" className="h-full w-full" />;
  if (name === "github") {
    return (
      <svg viewBox="0 0 24 24" fill="#181717" aria-hidden className="h-full w-full">
        <path d={GITHUB_PATH} />
      </svg>
    );
  }
  if (name === "gmail") {
    return (
      // eslint-disable-next-line @next/next/no-img-element
      <img
        src="/Gmail_icon_(2020).svg.webp"
        alt=""
        aria-hidden
        className="h-full w-full object-contain"
      />
    );
  }
  return (
    <svg viewBox="0 0 24 24" fill="#5E6AD2" aria-hidden className="h-full w-full">
      <path d={LINEAR_PATH} />
    </svg>
  );
}

/** A meeting's mark: the video tool it opens in, not who is in the room.
    Attendee initials sat here for a while; a name nobody visiting the site
    recognises answered a question this card was never trying to ask.

    Same artwork as `scrub-hero.tsx`'s `GoogleMeetIcon`, copied rather than
    imported because that component isn't exported for reuse and this is
    four short paths. Google Meet is a trademark of Google, used here to
    depict integration, same note `brand-marks.tsx` carries for its marks. */
function MeetMark() {
  return (
    <svg viewBox="0 0 622 512" aria-hidden className="h-full w-full">
      <path d="M351.419 255.568L411.978 324.79L493.418 376.827L507.584 256.005L493.418 137.908L410.418 183.621L351.419 255.568Z" fill="#00832D" />
      <path d="M0.00283051 365.583V468.541C0.00283051 492.049 19.0851 511.136 42.5983 511.136H145.556L166.876 433.344L145.556 365.583L74.9198 344.263L0.00283051 365.583Z" fill="#0066DA" />
      <path d="M145.556 0L0.00283051 145.554L74.9247 166.822L145.556 145.554L166.488 78.7145L145.556 0Z" fill="#E94235" />
      <path d="M0.00526047 365.629H145.556V145.551H0.00526047V365.629Z" fill="#2684FC" />
      <path d="M586.398 61.6293L493.416 137.91V376.827L586.782 453.404C600.758 464.352 621.204 454.374 621.204 436.607V78.0861C621.204 60.1224 600.271 50.193 586.396 61.6317" fill="#00AC47" />
      <path d="M351.419 255.568V365.583H145.556V511.136H450.825C474.338 511.136 493.418 492.049 493.418 468.541V376.827L351.419 255.568Z" fill="#00AC47" />
      <path d="M450.825 0H145.556V145.554H351.419V255.568L493.42 137.905V42.5979C493.42 19.0847 474.338 0 450.825 0" fill="#FFBA00" />
    </svg>
  );
}

/* ── The mark, awake ─────────────────────────────────────────────

   The disc is a face and the two bars are its eyes, which the mark has
   always implied and never once used. It uses it here for the length of
   one card:

     it thinks   — while the sentence is the only thing on the paper, the
                   mark reads left, reads right, blinks, and looks down at
                   the hours a beat before they open. That is the claim of
                   the card acted out rather than stated: the day was
                   worked out before you sat down, and you are watching the
                   last second of it.

     it watches  — after that, the eyes go wherever the pointer is, for as
                   long as the pointer is on the card. The rest of the card
                   already answers the reader (a phrase underlines, an hour
                   lights); this is the same rule applied to the only thing
                   on the paper that is supposed to be alive.

   The pointer always wins. Once the reader has moved inside the card the
   script is abandoned mid-glance and never resumes, because a mark that
   went back to performing after being looked at would read as a loop.

   None of it runs under reduced motion, where the mark is simply still. */

/** How far the bars travel, in MARK units — hundredths of the disc. The
    pair spans 36 wide and 24 tall on a 100 disc, so at 12 and 10 the far
    corner still sits ~12 units inside the rim: a glance, never a wander. */
const GAZE = { x: 12, y: 10 } as const;

/** How far the pointer has to be, in CSS pixels, for a full glance. Wider
    than it is tall because the card is: the pointer spends its whole life
    below the mark and rarely far to either side. */
const REACH = { x: 250, y: 200 } as const;

/** The thinking, in ms after mount. It has to be finished by OPEN_AT, when
    the day starts growing and the reader's eye leaves the mark for good. */
const THINK: { at: number; x: number; y: number; blink?: boolean }[] = [
  { at: 420, x: -GAZE.x, y: 1 },
  { at: 760, x: GAZE.x, y: 1 },
  { at: 1020, x: 0, y: 0, blink: true },
  { at: 1180, x: 0, y: GAZE.y },
  { at: 2000, x: 0, y: 0 },
];

/** How long the bars stay shut. Long enough to see, short enough that it
    reads as a blink rather than as the mark switching off. */
const BLINK_MS = 110;

function LookingMark({
  areaRef,
  active,
}: {
  /** The card. The pointer is tracked over this whole box, not over the
      mark, because the question the mark is answering is "where are you on
      my day", not "are you on me". */
  areaRef: React.RefObject<HTMLDivElement | null>;
  active: boolean;
}) {
  const reduce = useReducedMotion();
  const markRef = React.useRef<HTMLSpanElement>(null);
  const [look, setLook] = React.useState({ x: 0, y: 0 });
  const [blink, setBlink] = React.useState(false);
  /** Set the first time the pointer moves on the card, and never unset. */
  const watched = React.useRef(false);

  /* The script. */
  React.useEffect(() => {
    if (!active || reduce) return;
    const timers: ReturnType<typeof setTimeout>[] = [];
    for (const beat of THINK) {
      timers.push(
        setTimeout(() => {
          if (watched.current) return;
          setLook({ x: beat.x, y: beat.y });
          if (!beat.blink) return;
          setBlink(true);
          timers.push(setTimeout(() => setBlink(false), BLINK_MS));
        }, beat.at),
      );
    }
    return () => timers.forEach(clearTimeout);
  }, [active, reduce]);

  /* The pointer. Listened for on the card rather than handled in React, so
     a mouse crossing the day re-renders the mark and nothing else — the
     day below it is five absolutely-positioned rows that have no reason to
     re-render sixty times a second. One frame's worth of moves is
     collapsed into one measurement. */
  React.useEffect(() => {
    const area = areaRef.current;
    if (!area || reduce) return;

    let frame = 0;
    let at: { x: number; y: number } | null = null;

    const apply = () => {
      frame = 0;
      const el = markRef.current;
      if (!at || !el) return;
      const r = el.getBoundingClientRect();
      const dx = at.x - (r.left + r.width / 2);
      const dy = at.y - (r.top + r.height / 2);
      const unit = (v: number, over: number) =>
        Math.max(-1, Math.min(1, v / over));
      setLook({
        x: unit(dx, REACH.x) * GAZE.x,
        y: unit(dy, REACH.y) * GAZE.y,
      });
    };

    const move = (e: PointerEvent) => {
      watched.current = true;
      at = { x: e.clientX, y: e.clientY };
      if (!frame) frame = requestAnimationFrame(apply);
    };
    /* Back to centre, not back to the script: the mark is done performing
       once it has been looked at. */
    const leave = () => {
      at = null;
      if (frame) cancelAnimationFrame(frame);
      frame = 0;
      setLook({ x: 0, y: 0 });
    };

    area.addEventListener("pointermove", move);
    area.addEventListener("pointerleave", leave);
    return () => {
      area.removeEventListener("pointermove", move);
      area.removeEventListener("pointerleave", leave);
      if (frame) cancelAnimationFrame(frame);
    };
  }, [areaRef, reduce]);

  return (
    <span ref={markRef} className="relative flex h-6 w-6 sm:h-7 sm:w-7">
      <JarvisMark
        className="h-6 w-6 sm:h-7 sm:w-7"
        look={reduce ? undefined : look}
        blink={blink}
      />
    </span>
  );
}

/* ── Stage ───────────────────────────────────────────────────────── */

export function FocusDayStage({
  active,
}: {
  /** Gates every timer. The hero swaps tabs by remounting, so the sequence
      restarts on its own; the flag is here for a caller that keeps the
      stage mounted but hidden. */
  active: boolean;
}) {
  const reduce = useReducedMotion();
  const date = useToday();
  const coarse = useCoarsePointer();
  /** The box the mark watches for a pointer. */
  const cardRef = React.useRef<HTMLDivElement>(null);

  /* Three flags, one per beat after the first. Derived under reduced
     motion so the very first paint is already the finished card. */
  /* Which piece of named work the reader is pointing at, by row id. Set
     from either end: the phrase in the sentence, or the hour in the day —
     by hover on a mouse, by tap on a phone. */
  const [lit, setLit] = React.useState<string | null>(null);

  /* One id's worth of link, wired to the pointer the device actually has.
     On a mouse: light while hovering, dark on leave. On a phone: tap to
     pin, tap the same target again (or another) to move or clear it. */
  const linkProps = React.useCallback(
    (id: string | null) =>
      coarse
        ? {
            onClick: () => setLit((cur) => (cur === id ? null : id)),
            style: { cursor: "pointer" as const },
          }
        : {
            onMouseEnter: () => setLit(id),
            onMouseLeave: () => setLit(null),
          },
    [coarse],
  );

  const [opened, setOpened] = React.useState(false);
  const [calIn, setCalIn] = React.useState(false);
  const [workIn, setWorkIn] = React.useState(false);
  const open = opened || Boolean(reduce);
  const calShown = calIn || Boolean(reduce);
  const workShown = workIn || Boolean(reduce);

  React.useEffect(() => {
    if (!active || reduce) return;
    const timers = [
      setTimeout(() => setOpened(true), OPEN_AT),
      setTimeout(() => setCalIn(true), CAL_AT),
      setTimeout(() => setWorkIn(true), WORK_AT),
    ];
    return () => timers.forEach(clearTimeout);
  }, [active, reduce]);

  return (
    /* `relative` because the flight layer is positioned against this box and
       the card sits at the top of it, so a card-relative measurement lands
       correctly with no second origin to reconcile. */
    <div className="relative h-full">
      {/* Content-height, NOT the height of the slot. The card has to be the
          size of what it is showing, because what it is showing changes: it
          opens as a sentence and grows into a day, and a card pinned to the
          slot would sit as a tall empty sheet for the first beat and a band
          of dead paper under the last hour for the rest. */}
      <div
        ref={cardRef}
        className="relative overflow-hidden rounded-[20px] border border-ash bg-white px-5 py-5 sm:px-7 sm:py-6"
        style={{ boxShadow: CARD_SHADOW }}
      >
        {/* Jarvis, centred, and awake.

            The mark used to sit in the corner beside the date, which read
            as a favicon on a document. Centred it is the thing the card
            opens on, and it is the only element here that never stops
            moving: one slow breath, slower and shallower than resting human
            breathing, which is enough to say the thing is running without
            ever asking to be watched. It is deliberately the only loop on
            the card. */}
        <div className="relative flex h-6 items-center justify-center sm:h-7">
          <motion.div
            className="relative flex h-6 w-6 items-center justify-center sm:h-7 sm:w-7"
            initial={reduce ? false : { opacity: 0, scale: 0.6 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={
              reduce
                ? { duration: 0.2 }
                : { type: "spring", stiffness: 420, damping: 16 }
            }
          >
            {reduce ? null : (
              <motion.span
                aria-hidden
                className="absolute h-6 w-6 rounded-full sm:h-7 sm:w-7"
                style={{ background: "rgba(28,26,23,0.14)", filter: "blur(7px)" }}
                animate={{ scale: [1, 1.24, 1], opacity: [0.4, 0.1, 0.4] }}
                transition={{ duration: 3.8, repeat: Infinity, ease: "easeInOut" }}
              />
            )}
            <LookingMark areaRef={cardRef} active={active} />
          </motion.div>
        </div>

        {/* The card's dateline: label then date, joined on one line by a
            hairline middot rather than pushed to opposite margins. "Today's
            focus" is the eyebrow — the site's section-title treatment,
            semibold, uppercase, tracked — set in ink rather than the
            eyebrow's usual smolder, because the sentence right below carries
            the one orange underline this part of the card is allowed. The
            date rides behind the middot as a quiet tail: context for the
            sentence, not a second headline competing from the far edge. It
            is the demo's own, resolved after hydration so a prerendered page
            is never stale. */}
        <motion.div
          className="mt-3 flex flex-wrap items-baseline gap-x-1.5 sm:mt-4"
          initial={reduce ? false : { opacity: 0, y: 4 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.06, ease: EASE }}
        >
          <p className="text-[11px] font-semibold uppercase tracking-[0.1em] text-coal-ink">
            Today&rsquo;s focus
          </p>
          <span aria-hidden className="text-[11px] leading-none text-fossil">
            &middot;
          </span>
          <p className="text-[11px] text-stone">{date}</p>
        </motion.div>

        {/* Beat one. The sentence arrives as ONE object — it used to fade
            up in seven pieces fifty milliseconds apart, which is a
            typewriter impression of something Jarvis knew before you sat
            down.

            The named work is bold and nothing else. Its underline is drawn
            when the reader points at it — hover on a mouse, tap on a phone —
            in the accent the hero headline underlines its own word in, and
            the same gesture lights the hour that work sits in. */}
        <motion.p
          className="mt-2 text-[13.5px] leading-[1.5] tracking-[-0.12px] sm:text-[16px] sm:leading-[1.55]"
          initial={reduce ? false : { opacity: 0, y: 5 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.55, delay: 0.14, ease: EASE }}
        >
          {STEPS.map((step, i) => (
            <React.Fragment key={i}>
              {step.lead ? (
                <span className="text-slate-mid">{step.lead}</span>
              ) : null}
              {/* Phrase + its connective, unbreakable on a phone so a
                  wrapped line opens with the bold phrase, never a comma. */}
              <span className="whitespace-nowrap sm:whitespace-normal">
                <span
                  className="relative inline-block font-semibold text-coal-ink"
                  {...linkProps(step.task)}
                >
                  {step.phrase}
                  <motion.span
                    aria-hidden
                    className="absolute bottom-[-1px] left-0 block h-[2px] w-full origin-left rounded-full bg-smolder"
                    initial={false}
                    animate={{ scaleX: lit === step.task ? 1 : 0 }}
                    transition={
                      reduce ? { duration: 0 } : { duration: 0.34, ease: EASE }
                    }
                  />
                </span>
                {step.trailMobile ? (
                  <>
                    <span className="text-slate-mid sm:hidden">
                      {step.trailMobile}
                    </span>
                    <span className="hidden text-slate-mid sm:inline">
                      {step.trail}
                    </span>
                  </>
                ) : (
                  <span className="text-slate-mid">{step.trail}</span>
                )}
              </span>
              {/* The break-here space, kept out of the nowrap wrapper. */}
              {i < STEPS.length - 1 ? " " : null}
            </React.Fragment>
          ))}
        </motion.p>

        {/* Beat three, then four. The agenda fades in under the sentence,
            and its rows fill in two gestures: the meetings first (your
            calendar), then the work Jarvis fitted between them.

            One uniform list — every row the same height, hairline-divided
            the way the FAQ divides its questions. Three columns, the left
            two fixed so the whole thing aligns down one edge: start time,
            colour rail, content. The list used to be drawn to scale, every
            entry as tall as its hours, which made a two-hour task and a
            one-hour meeting read as a big card and a small one. */}
        <motion.div
          className="mt-3 divide-y divide-ash sm:mt-4"
          initial={reduce ? false : { opacity: 0, y: 6 }}
          animate={{ opacity: open ? 1 : 0, y: open ? 0 : 6 }}
          transition={{ duration: reduce ? 0.2 : 0.5, ease: EASE }}
          aria-hidden={!open}
        >
          {ROWS.map((row) => {
            const isTask = row.kind === "task";
            const shown = isTask ? workShown : calShown;
            const isLit = lit === row.id;
            const rail = isTask
              ? isLit
                ? TASK_RAIL_LIT
                : TASK_RAIL
              : isLit
                ? MEETING_RAIL_LIT
                : MEETING_RAIL;

            return (
              <motion.div
                key={row.id}
                className="relative flex items-start gap-2.5 py-2 sm:gap-3 sm:py-2.5"
                {...linkProps(row.id)}
                initial={reduce ? false : { opacity: 0, y: 6 }}
                animate={{ opacity: shown ? 1 : 0, y: shown ? 0 : 6 }}
                transition={{ duration: reduce ? 0.2 : 0.42, ease: EASE }}
              >
                {/* A hovered row lights the way a hovered phrase does — a
                    faint wash behind it, no border. */}
                <span
                  aria-hidden
                  className="pointer-events-none absolute inset-y-[1px] -left-2 -right-2 rounded-lg"
                  style={{
                    background: isLit
                      ? isTask
                        ? TASK_WASH
                        : MEETING_WASH
                      : "transparent",
                    transition: reduce ? "none" : "background 180ms ease",
                  }}
                />

                {/* Start time — fixed column, mono, aligned to the label. */}
                <span className="relative w-8 shrink-0 pt-[1px] text-right font-mono text-[9.5px] leading-none text-stone sm:w-9 sm:text-[10px]">
                  {hhmm(row.at)}
                </span>

                {/* Colour rail — meeting vs task, the one hue on the card. */}
                <span
                  aria-hidden
                  className="relative mb-[1px] mt-[1px] w-[3px] shrink-0 self-stretch rounded-full"
                  style={{
                    background: rail,
                    transition: reduce ? "none" : "background 180ms ease",
                  }}
                />

                {/* Content. From `sm` up it holds a constant right inset so
                    the hover pill can park at the row's edge without ever
                    landing on top of a note — reserved always, so nothing
                    reflows on hover. On a phone the pill is hidden and the
                    inset would just crush the title, so it is dropped. */}
                <div className="relative flex min-w-0 flex-1 flex-col pr-0 sm:pr-24">
                  <span className="flex items-center gap-1.5 leading-none">
                    <span
                      className="text-[9px] font-bold uppercase tracking-[0.08em]"
                      style={{
                        color: isTask
                          ? "var(--color-stone)"
                          : "var(--color-signal-violet)",
                      }}
                    >
                      {isTask ? "Task" : "Meeting"}
                    </span>
                    {row.hours > 1 ? (
                      <span className="text-[9px] font-medium tracking-[0.03em] text-stone">
                        &middot; {row.hours}h
                      </span>
                    ) : null}
                  </span>

                  <span className="mt-[4px] flex items-center gap-1.5 sm:gap-2">
                    {/* No hover underline on the title here — that rule
                        belongs to the sentence above the agenda, where a
                        hovered phrase strikes smolder the way the hero
                        headline does. Down in the rows the wash and the rail
                        brightening are the hover feedback; a second mark
                        under every title was one too many. */}
                    <span
                      className={
                        "inline-block max-w-full truncate text-[13px] leading-[1.3] sm:text-[14px] sm:leading-[1.25] " +
                        (isTask ? "font-medium" : "font-semibold")
                      }
                      style={{ color: "var(--color-coal-ink)" }}
                    >
                      {row.title}
                    </span>

                    <span className="h-3 w-3 shrink-0 translate-y-[0.5px] opacity-90 sm:h-[14px] sm:w-[14px]">
                      {isTask ? (
                        row.source ? <SourceMark name={row.source} /> : null
                      ) : (
                        <MeetMark />
                      )}
                    </span>
                  </span>

                  {row.note ? (
                    <span
                      className="mt-[3px] truncate text-[11.5px] leading-[1.3] sm:text-[12px]"
                      style={{
                        color: isTask
                          ? "var(--color-slate-mid)"
                          : "var(--color-graphite)",
                      }}
                    >
                      {row.note}
                    </span>
                  ) : null}
                </div>

                {/* Nothing at rest; on hover the way in fades in at the
                    row's right edge, parked clear of the title instead of
                    tucked against it. Centred on the row, out of flow, so it
                    never shifts a word. */}
                <span
                  aria-hidden
                  className={
                    "pointer-events-none absolute right-2 top-1/2 hidden -translate-y-1/2 items-center gap-1 whitespace-nowrap rounded-full px-2 py-[2px] text-[10.5px] font-semibold sm:flex " +
                    (isTask
                      ? "border border-ash bg-white text-graphite"
                      : "bg-coal-ink text-white")
                  }
                  style={{
                    opacity: isLit ? 1 : 0,
                    transition: reduce ? "none" : "opacity 160ms ease",
                  }}
                >
                  {isTask ? (
                    row.source ? VERB[row.source] : null
                  ) : (
                    <>
                      <Video className="h-3 w-3" strokeWidth={2.25} aria-hidden />
                      Join
                    </>
                  )}
                </span>
              </motion.div>
            );
          })}
        </motion.div>
      </div>
    </div>
  );
}
