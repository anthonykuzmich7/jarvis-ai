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

  The day is drawn to scale: the hours down the left, and every entry as
  tall as the time it actually takes. A two-hour review is twice a one-hour
  one, a thirty-minute 1:1 is half of it and drops its second line because
  there is no room for one, and the hours nobody has taken are simply empty.
  That is the whole reason the day has a shape.

  No hour rules. They were there until every entry became an outlined block,
  at which point the card was drawing its structure twice over: a grid
  saying where the hours are, and a set of boxes saying the same thing again
  and more precisely.

  Rows were one hour each for a long time, which made the card a stack of
  identical bands alternating task, meeting, task, meeting — a diagram of a
  day rather than anybody's actual Thursday.

  Every entry is an outlined block running the exact length of the thing.
  The outline is not decoration: it is the only thing on the card that says
  how long something takes, and everything inside a block is centred against
  it — title and reason as one group, the mark against the same middle.

  A meeting is filled and the work Jarvis placed is not, and that alone is
  what tells the two apart: the day's shape is countable before a word of it
  is read, which is the one thing the card could not do while every entry
  was the same object.

  The fill is periwinkle, and it is the calendar's colour rather than the
  card's. Signal Violet at seven per cent, edged a step deeper, so a booked
  hour reads as a card lifted out of your calendar and quoted here — which
  is precisely what it is. Jarvis's own work stays on the card's own paper
  because Jarvis wrote it. The type on both is the same ink, because the
  card is speaking in one voice about two kinds of hour.

  A fill was rejected here once on the grounds that a tint reads as a
  different KIND of paper when the point is that it is the same paper. That
  objection was answered for a while with warmth, and the answer was wrong:
  #efeae0 had so little chroma that it did not read as another surface at
  all, it read as this one, dirty. The right answer is to agree with the
  objection. A meeting IS from somewhere else.

  Not a hatch: strokes across a calendar block mean CANCELLED in every
  calendar anyone has used. Not a permanent smolder outline either — that
  was tried, and it left two blocks burning under a sentence that is the
  card's actual argument. Nor a bar beside the block: a rail in the margin
  never once rendered, because the margin it sat in is outside the
  overflow-hidden wrapper that animates the day open. Everything that marks
  a block paints inside it, where nothing can clip it.

  Two colours, and they never mean the same kind of thing. Periwinkle is a
  SOURCE — this hour came from your calendar — and it is permanent, because
  where an hour came from does not change. Smolder is ATTENTION — you are
  pointing at this — and it is never permanent. Every block, filled or not,
  keeps a 1.5-point outline that goes to smolder while the reader is on it,
  and orange over violet is far enough apart that the ring reads instantly
  without the fill having to get out of its way.

  A block is three columns, and the two on the right are fixed: 96 points of
  meta, 68 of mark, both right-aligned. A logo, a stack of two faces and a
  stack of four therefore end on one line. Before that they sat wherever the
  title stopped pushing them, and the day had a ragged right edge.

  The clock and the button share one box. A meeting prints its hours at rest
  and turns them into Join while the reader is on it, so the hour you can
  attend becomes the way to attend it, and nothing in the block moves
  between the two states. Work prints no clock, because Jarvis placed it and
  it can move; the empty slot says that as clearly as the printed one says
  the opposite, and it fills with the way into the tool instead.

  The mark says who, or what. A meeting carries the people in it, work
  carries the tool it came out of. The calendar glyph is gone: it named a
  category the fill already names, where faces answer a question the card
  could not answer at all — which of these hours costs six other people
  theirs.

  Blocks are flush with their own hours and therefore with each other: a
  review that ends at ten and a 1:1 that starts at ten share one edge,
  because the day has no gap there.

  ── The motion ───────────────────────────────────────────────────────

  Three movements, and each one says something:

    1. Jarvis speaks.   The mark, the title, the date and the sentence
                        arrive as one object.
    2. The day opens.   The card grows and the empty hours are ruled.
    3. The day fills.   Your calendar, then Jarvis's work in the gaps.

  That is the whole product in three beats, and the last two are the claim:
  Jarvis fitted work into a day that already existed. Reversed or
  interleaved, the card would say it invented one.

  There was a fourth beat between the first and the second: three smolder
  underlines drawing at once under the named work. They are still here, but
  they are drawn by the READER now, one at a time, on hover. Standing by
  default they marked every task the moment the card opened, which is a lot
  of accent spent saying what the bold weight already said, and it left the
  card with four orange elements before the day had even appeared. On hover
  the same rule earns its colour: it answers one question, asked by one
  person, about one phrase.

  Hovering a phrase also lights its hour in the day below, and hovering an
  hour draws the underline back up in the sentence. The link runs both ways
  because the claim runs both ways: the sentence is the day, sorted. Meetings
  light too, since the outline means attention rather than category, and a
  block that ignored the pointer on a card where every other block answers it
  would read as broken rather than as different.

  Everything else that used to move has been cut, because "more animation"
  and "more legible" stopped pointing the same way a long way back. What
  went, and why:

  Four flying ghost texts. Each task name detached from the sentence and
  flew down into its hour, shrinking as it went, and the split review flew
  twice. It was the cleverest thing here and the worst: four texts crossing
  the card at once is the reader's whole attention spent on a connection the
  COPY already makes, since the row says the same words the sentence does.
  A demo-reel stunt dressed as an argument.

  A stagger on every list. Seven sentence fragments 50ms apart, eight hour
  rules drawing one after another, rows arriving one by one. Each was
  defensible alone; together the card never stopped moving for three
  seconds. A drip feed also says the plan is being computed while you watch,
  when the point is that it was finished before you sat down.

  A timer inside every row. Bar, title, line and mark each had their own
  beat, so an hour assembled itself in front of the reader instead of simply
  being there. A row is one object and arrives as one.

  ── The palette ──────────────────────────────────────────────────────

  One accent, smolder, and it only ever means "this is what you are pointing
  at": the underline a hovered phrase draws — the same rule the hero headline
  strikes under its own word — and the outline around the hour that phrase
  belongs to. Nothing on the card is orange until somebody asks.

  Every word on the card is ink or grey. Periwinkle is a SURFACE colour and
  never a type colour, which is the whole of what keeps two tinted blocks
  from outranking the sentence above them:

    coal-ink       what Jarvis is telling you to do, the Join pill, and the
                   title of an hour your calendar owns
    graphite       why a meeting is where it is
    slate-mid      why a task is where it is
    stone          the hours down the left margin, and a meeting's clock
    booked-fill    an hour your calendar already owns, as a surface
    booked-edge    its edge, and the ring around every face in it

  The only other colour is the real product logos, which are coloured
  because they are logos.

  Copy is the app's own demo state (jarvis-ai-core,
  `Sources/JarvisGuideApp/TodayUI/TodayContent.swift`), so the app, the film
  and this card never disagree about what the day looks like. The attendees
  are the only thing here the demo state does not carry: they are the people
  the copy already names — David for the 1:1, Tom and Sarah in the sync.
*/

const EASE = [0.16, 1, 0.3, 1] as const;

/** The site's shared light-card shadow, from `FeatureShowcase`. */
const CARD_SHADOW =
  "rgba(95,99,106,0.10) 0px 0px 0px 1px, rgba(43,43,48,0.12) 0px 4px 20px 0px";

const DAY_START = 8;
const DAY_END = 15;
const HOURS = DAY_END - DAY_START;

/** One hour, in pixels. The only vertical measurement the day has: a row is
    its duration times this, so nothing on the card can lie about how long
    anything takes.

    44 is set by the shortest thing on the day. An hour has to hold a title
    and a reason inside its own outline, which is 33 points of text plus the
    room to sit in.

    Nothing here runs under an hour any more. A 30-minute 1:1 was tried and
    read as a floating strip rather than as half an hour, because at this
    scale half an hour is 22 points: one line of text, its outline, and no
    way to tell "short" from "clipped". The `compact` path below survives in
    case a shorter thing is ever right, but the day no longer uses it.

    Rows used to be one hour each, always, which made the day a stack of
    identical bands alternating task, meeting, task, meeting. That reads as
    a diagram of a day rather than as anybody's actual Thursday. */
const ROW = 44;
const TRACK = HOURS * ROW;
/** Room above the first hour rule for its numeral, which straddles the line
    the way an hour label does in Calendar. */
const PAD = 8;

/* The hour numerals take the mono face, because they are a column of
   numbers. Everything else on the card is the site's sans. */
const LANE = { time: 40, content: 56 } as const;

/** The calendar's own colour, and the whole of what marks an hour you
    cannot move.

    Signal Violet, #777eff, laid down at about seven per cent, with the two
    strengths of itself the block needs in order to set type. Panxo gives
    that token one job — it signals machine intelligence rather than human
    action — and a meeting is the opposite of that, so the borrowing is of
    the hue and not the meaning.

    A booked hour is a card from somewhere else, quoted into this document.
    Two things say it: a pale fill, and an edge one step deeper than the
    fill. Nothing else.

    The title said it too for one pass — violet rather than ink, which is
    what the calendar apps this is borrowed from do, and what makes their
    blocks read as objects with a colour of their own rather than as ink
    laid on a coloured rectangle. It is the better idea and the wrong one
    here. Those apps give a block the whole screen; this card gives it
    forty-four points under a sentence that is the card's actual argument,
    and coloured type at that size does not read as a quotation, it reads as
    a highlight. Two meetings in violet took the eye before the sentence
    did.

    So the colour stops at the edge of the type. Every word on this card is
    ink or grey; only surfaces are allowed a hue.

    The fill carries a faint top-to-bottom gradient. It is most of why the
    block reads as soft rather than flat, and it is the only gradient
    anywhere on the card.

    What was here before was #efeae0: parchment with the light knocked out
    of it, and a value belonging to no token. The objection to it is not
    that it was warm. It is that at that chroma a fill does not read as a
    different SURFACE, it reads as the same surface, dirty. */
const BOOKED_FILL = "linear-gradient(180deg,#f4f5fe 0%,#eceefb 100%)";
const BOOKED_EDGE = "#d9dcf7";

/** Top of an hour inside the day. */
const yOf = (hour: number) => (hour - DAY_START) * ROW + PAD;

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
  /** Who is in the room, as initials, on a meeting. The last entry may be
      an overflow count — "+4" — which is the point of the stack: Launch
      sync costing seven people an hour is the reason that hour is worth
      protecting, and no glyph can say it. */
  people?: string[];
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
    people: ["DP"],
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
    people: ["TM", "SA", "DP", "+4"],
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

/* The sentence, in segments. A segment with a `task` is work Jarvis is
   proposing: it gets the headline's underline, and it is the thing that
   flies down into the day. */
type Segment = { text: string; task?: string };

const SENTENCE: Segment[] = [
  { text: "Start with " },
  { text: "review Tom’s payments PR", task: "pr" },
  { text: ". Tom, David and Sarah are all waiting on it. Then " },
  { text: "prepare Friday’s demo", task: "demo" },
  { text: ", then " },
  { text: "sign off Sarah’s redesign", task: "sign" },
  { text: "." },
];

/** Every hour rule, 09:00 through 16:00 inclusive, so the last one closes
    the column instead of leaving it cut off. */
const HOUR_LINES = Array.from({ length: HOURS + 1 }, (_, i) => DAY_START + i);

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

/** The people in the room, as initials on the booked surface.

    White discs ringed in the block's own edge, so the stack overlaps
    cleanly and the ring is the one line already drawn around everything
    else in the block rather than a second idea. Initials are ink like every
    other word here; the overflow count reads a step quieter, because it is
    a number rather than a person. */
function Faces({ names }: { names: string[] }) {
  return (
    <span className="flex items-center">
      {names.map((name, i) => (
        <span
          key={name}
          className="flex h-[19px] w-[19px] items-center justify-center rounded-full border-[1.5px] bg-white text-[8.5px] font-semibold"
          style={{
            /* Three points, not six. A photo can be half-covered and still
               read; two letters cannot, and at six the disc in front ate the
               last character of the one behind it. */
            marginLeft: i === 0 ? 0 : -3,
            borderColor: BOOKED_EDGE,
            color: name.startsWith("+")
              ? "var(--color-stone)"
              : "var(--color-coal-ink)",
          }}
        >
          {name}
        </span>
      ))}
    </span>
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
    <span ref={markRef} className="relative flex h-7 w-7">
      <JarvisMark
        className="h-7 w-7"
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
  /** The box the mark watches for a pointer. */
  const cardRef = React.useRef<HTMLDivElement>(null);

  /* Three flags, one per beat after the first. Derived under reduced
     motion so the very first paint is already the finished card. */
  /* Which piece of named work the reader is pointing at, by row id. Set
     from either end: the phrase in the sentence, or the hour in the day.
     Null on a touch device, which has no hover and therefore just gets the
     card at rest. */
  const [lit, setLit] = React.useState<string | null>(null);

  const [opened, setOpened] = React.useState(false);
  const [calIn, setCalIn] = React.useState(false);
  const [workIn, setWorkIn] = React.useState(false);
  const open = opened || Boolean(reduce);
  const litRow = ROWS.find((r) => r.id === lit) ?? null;
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
        className="relative overflow-hidden rounded-[20px] border border-ash bg-white px-6 py-6 sm:px-7"
        style={{ boxShadow: CARD_SHADOW }}
      >
        {/* Jarvis, centred, and awake.

            The mark used to sit in the corner beside the date, which read
            as a favicon on a document. Centred it is the thing the card
            opens on, and it is the only element here that never stops
            moving: one slow breath, slower and shallower than resting human
            breathing, which is enough to say the thing is running without
            ever asking to be watched. It is deliberately the only loop on
            the card.

            The date keeps the corner. Absolutely placed, so the mark is
            centred against the CARD rather than against the space left
            over beside a date of unpredictable width. */}
        <div className="relative flex h-7 items-center justify-center">
          <motion.div
            className="relative flex h-7 w-7 items-center justify-center"
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
                className="absolute h-7 w-7 rounded-full"
                style={{ background: "rgba(28,26,23,0.14)", filter: "blur(7px)" }}
                animate={{ scale: [1, 1.24, 1], opacity: [0.4, 0.1, 0.4] }}
                transition={{ duration: 3.8, repeat: Infinity, ease: "easeInOut" }}
              />
            )}
            <LookingMark areaRef={cardRef} active={active} />
          </motion.div>
          <motion.span
            className="absolute right-0 text-[12px] text-slate-mid"
            initial={reduce ? false : { opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5, delay: 0.06, ease: EASE }}
          >
            {date}
          </motion.span>
        </div>

        {/* What the card is, in the site's own section-title treatment:
            semibold, uppercase, tracked, smolder. The same eyebrow
            `content/primitives.tsx` and the comparison pages set their
            headings in, so the hero is titled the way every other section
            on the site is.

            In ink rather than the eyebrow's usual smolder: the sentence
            directly under it carries three orange underlines and the day
            below that carries two orange outlines, so a fourth orange
            element on the line between them left the accent meaning
            nothing in particular. Uppercase, tracked and semibold is already enough
            to read as a heading; it does not need the colour as well. */}
        <motion.p
          className="mt-4 text-[11px] font-semibold uppercase tracking-[0.1em] text-coal-ink"
          initial={reduce ? false : { opacity: 0, y: 4 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.06, ease: EASE }}
        >
          Today&rsquo;s focus
        </motion.p>

        {/* Beat one. The sentence arrives as ONE object — it used to fade
            up in seven pieces fifty milliseconds apart, which is a
            typewriter impression of something Jarvis knew before you sat
            down.

            The named work is bold and nothing else. Its underline is drawn
            on hover, in the accent the hero headline underlines its own
            word in, and hovering it lights the hour that work sits in. */}
        <motion.p
          className="mt-2 text-[15.5px] leading-[1.55] tracking-[-0.12px] sm:text-[16px]"
          initial={reduce ? false : { opacity: 0, y: 5 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.55, delay: 0.14, ease: EASE }}
        >
          {SENTENCE.map((seg, i) =>
            seg.task ? (
              <span
                key={i}
                className="relative inline-block font-semibold text-coal-ink"
                onMouseEnter={() => setLit(seg.task ?? null)}
                onMouseLeave={() => setLit(null)}
              >
                {seg.text}
                <motion.span
                  aria-hidden
                  className="absolute bottom-[-1px] left-0 block h-[2px] w-full origin-left rounded-full bg-smolder"
                  initial={false}
                  animate={{ scaleX: lit === seg.task ? 1 : 0 }}
                  transition={reduce ? { duration: 0 } : { duration: 0.34, ease: EASE }}
                />
              </span>
            ) : (
              <span key={i} className="text-slate-mid">
                {seg.text}
              </span>
            ),
          )}
        </motion.p>

        {/* Beat three. The card grows and the hours appear, as one
            movement.

            Numerals only. A hairline ran beside each of them until every
            entry became an outlined block, at which point the card was
            drawing its structure twice: a grid saying where the hours are
            and a set of boxes saying the same thing again, more precisely.
            The times down the left are enough to place a block, and the
            block's own outline is enough to size it. */}
        <motion.div
          className="overflow-hidden"
          initial={{ height: 0 }}
          animate={{ height: open ? TRACK + PAD + 40 : 0 }}
          transition={
            reduce
              ? { duration: 0.2, ease: EASE }
              : { type: "spring", stiffness: 160, damping: 24 }
          }
          aria-hidden={!open}
        >
          <div className="relative" style={{ height: TRACK + PAD + 16, marginTop: 24 }}>
            <motion.div
              initial={reduce ? false : { opacity: 0 }}
              animate={{ opacity: open ? 1 : 0 }}
              transition={{ duration: reduce ? 0.2 : 0.4, delay: reduce ? 0 : 0.1, ease: EASE }}
            >
              {HOUR_LINES.map((hour) => (
                <span
                  key={hour}
                  /* The hours a lit row actually occupies go to ink, so the
                     highlight reaches the column that measures the day and
                     not just the box sitting in it. A two-hour review lights
                     both of its numerals. */
                  className={
                    "absolute font-mono text-[10.5px] " +
                    (litRow && hour >= litRow.at && hour <= litRow.at + litRow.hours
                      ? "text-coal-ink"
                      : "text-stone")
                  }
                  style={{
                    left: 0,
                    width: LANE.time,
                    top: yOf(hour) - 7,
                    textAlign: "right",
                  }}
                >
                  {hhmm(hour)}
                </span>
              ))}
            </motion.div>

            {/* Beat four, in two halves. Your calendar, then the work in
                the gaps it left. Each half is one movement over its whole
                group: a row is one object, a group is one gesture, and
                nothing inside either has a timer of its own. */}
            {ROWS.map((row) => {
              const isTask = row.kind === "task";
              const shown = isTask ? workShown : calShown;
              /* Anything under an hour carries its title and nothing else.
                 There is no room for a second line in half a row, and
                 squeezing one in would be the card pretending a 30-minute
                 1:1 is as substantial as a two-hour review. */
              const compact = row.hours < 1;

              return (
                <motion.div
                  key={row.id}
                  className="absolute right-0"
                  style={{
                    left: LANE.content,
                    top: yOf(row.at),
                    height: row.hours * ROW,
                  }}
                  onMouseEnter={() => setLit(row.id)}
                  onMouseLeave={() => setLit(null)}
                  initial={reduce ? false : { opacity: 0, y: 4 }}
                  animate={{ opacity: shown ? 1 : 0, y: shown ? 0 : 4 }}
                  transition={{ duration: reduce ? 0.2 : 0.42, ease: EASE }}
                >
                  {/* The block. An outline on solid paper, running the exact
                      length of the thing, and the only thing on the card
                      that says how long something takes.

                      Everything in it is centred against the BLOCK, not
                      stacked at its top: title and reason as one group, the
                      mark on its own against the same middle. A two-hour
                      review used to set its text at the top, which was the
                      right answer while hour rules crossed the card and the
                      wrong one now that the outline draws the extent — top
                      alignment just left an hour of blank paper hanging
                      under the title.

                      It fills its hours exactly: top and bottom flush with
                      the time it runs, so a review that ends at ten and a
                      1:1 that starts at ten share one edge. There was two
                      points of air between every block, which put a visible
                      gap where the day has none.

                      A meeting is filled and a task is not, and that alone
                      is what tells the two apart: your calendar's periwinkle
                      against the card's own paper, so the day's shape can be
                      counted before a word of it has been read. The fill and
                      its edge are the whole of it — the type in a booked hour
                      is the same ink as the type in a task, because a tint
                      under forty-four points of text is a surface, and tinted
                      text at that size is a highlighter.

                      Both keep the same 1.5-point outline, at rest and lit,
                      so the border only ever changes COLOUR. At ash 1 and
                      smolder 1.5 the block's inside would shrink half a point
                      on hover and nudge the text, which is a twitch on a card
                      that is otherwise still. A filled block is outlined in
                      its own fill for the same reason: the ring has to exist
                      in order to change.

                      Smolder is still spent on attention and never on
                      category. A standing orange outline on the two meetings
                      was tried and marked them permanently, which is a lot of
                      colour to leave burning on a card whose whole argument
                      is the sentence above the day. The fill is allowed to be
                      permanent because it says where an hour came FROM, which
                      never changes; the ring says where the reader is, which
                      changes constantly. Orange over violet keeps them apart
                      without either one having to shout.

                      Inside the block, not beside it. An earlier marker was
                      a 3-point bar in the right-hand margin at right:-9, and
                      it never rendered once: the margin is outside the
                      overflow-hidden wrapper that animates the day open, so
                      the bar was clipped on every paint. */}
                  <div
                    /* Two fixed columns on the right, both right-aligned, so
                       a 15-point logo and a stack of four faces end on the
                       same line — the alternative is a mark that sits
                       wherever the title stopped pushing it, which gave the
                       day a ragged right edge. 96 is set by the widest thing
                       that goes in the meta slot, "13:00–14:00" in mono.

                       The meta column is gone below `sm`. A phone has no
                       hover, so the slot could only ever hold the clock, and
                       96 points spent on it left the titles truncated to two
                       characters. The mark goes to `auto` there for the same
                       reason — it still ends flush with the right padding,
                       because it is the last column. The values are literal
                       because Tailwind scans for class names and cannot see
                       a template. */
                    className="absolute inset-x-0 grid grid-cols-[minmax(0,1fr)_auto] items-center gap-x-3 rounded-[6px] border-[1.5px] px-3 transition-colors duration-200 sm:grid-cols-[minmax(0,1fr)_96px_68px]"
                    style={{
                      top: 0,
                      bottom: 0,
                      background: isTask ? "#ffffff" : BOOKED_FILL,
                      borderColor:
                        lit === row.id
                          ? "var(--color-smolder)"
                          : isTask
                            ? "var(--color-ash)"
                            : BOOKED_EDGE,
                    }}
                  >
                    <span className="flex min-w-0 flex-col justify-center">
                      <span
                        className={
                          "truncate leading-[1.25] " +
                          (compact ? "text-[13px] " : "text-[14px] ") +
                          (isTask ? "font-medium" : "font-semibold")
                        }
                        style={{ color: "var(--color-coal-ink)" }}
                      >
                        {row.title}
                      </span>
                      {row.note && !compact ? (
                        <span
                          className="mt-[2px] truncate text-[12px] leading-[1.25]"
                          style={{
                            color: isTask
                              ? "var(--color-slate-mid)"
                              : "var(--color-graphite)",
                          }}
                        >
                          {row.note}
                        </span>
                      ) : null}
                    </span>

                    {/* The clock and the button, one on top of the other in
                        one fixed box. A meeting prints the hours it owns and
                        turns them into Join while the reader is on it, so the
                        hour you can attend becomes the way to attend it and
                        nothing in the block moves between the two states.

                        Work prints no clock, because Jarvis placed it and it
                        can move; the empty slot says that as plainly as the
                        printed one says the opposite, and it fills with the
                        way into the tool the work came out of. */}
                    <span className="relative hidden h-6 sm:block">
                      {isTask ? null : (
                        <span
                          className="absolute top-1/2 right-0 -translate-y-1/2 font-mono text-[10.5px] tabular-nums transition-opacity"
                          style={{
                            color: "var(--color-stone)",
                            opacity: lit === row.id ? 0 : 1,
                            transitionDuration: reduce ? "0ms" : "180ms",
                          }}
                        >
                          {`${hhmm(row.at)}–${hhmm(row.at + row.hours)}`}
                        </span>
                      )}
                      <span
                        aria-hidden
                        className={
                          "absolute top-1/2 right-0 flex -translate-y-1/2 cursor-pointer items-center gap-1.5 rounded-full px-2.5 py-1 text-[11.5px] font-semibold whitespace-nowrap transition-opacity " +
                          (isTask
                            ? "border border-ash bg-white text-graphite"
                            : "bg-coal-ink text-white")
                        }
                        style={{
                          opacity: lit === row.id ? 1 : 0,
                          transitionDuration: reduce ? "0ms" : "200ms",
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
                    </span>

                    {/* Who, or what. A meeting carries the people in it; work
                        carries the tool Jarvis read it out of, in that tool's
                        own colours. The calendar glyph that used to sit here
                        named a category the fill already names, where faces
                        answer a question the card could not answer at all —
                        which of these hours costs six other people theirs.

                        Right-aligned inside a fixed column, so a 15-point
                        logo and a stack of four faces end on one line. */}
                    <span className="flex items-center justify-end">
                      {row.source ? (
                        <span className="h-[15px] w-[15px]">
                          <SourceMark name={row.source} />
                        </span>
                      ) : row.people ? (
                        <Faces names={row.people} />
                      ) : null}
                    </span>
                  </div>
                </motion.div>
              );
            })}
          </div>
        </motion.div>
      </div>
    </div>
  );
}
