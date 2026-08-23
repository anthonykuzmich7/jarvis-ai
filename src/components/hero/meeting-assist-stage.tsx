"use client";

import * as React from "react";
import { motion, animate, useReducedMotion } from "framer-motion";
import { JarvisMark } from "@/components/jarvis-mark";
import { BrandMark, type BrandName } from "@/components/brand-marks";

/*
  Meeting Assist — the hero's second capability.

  Two tiles and Jarvis over them. Nothing else: no window chrome, no
  laptop, no menu bar. The claim is small enough to make with two objects,
  and every frame drawn around them was competing with it.

  Jarvis arrives as the real nudge window (charcoal pill, white disc mark),
  pulls your context, then opens into a panel of it. That panel is
  deliberately see-through, and the call keeps playing behind the words
  rather than being covered: the argument for this feature is that Jarvis
  sits ON your meeting instead of taking it over. It also really scrolls,
  because there is more context than fits.

  Content is the app's own demo (jarvis-ai-core,
  `Sources/JarvisGuideApp/MeetingAssist/`): a 1:1 with David Park after a
  week away, the "While you were out" timeline, the blockers checklist.
*/

const MORPH = { type: "spring" as const, stiffness: 260, damping: 30 };
const EASE = [0.16, 1, 0.3, 1] as const;

type Phase = "call" | "nudge" | "gather" | "briefing";

const ARC: { phase: Phase; ms: number }[] = [
  { phase: "call", ms: 1200 },
  { phase: "nudge", ms: 1800 },
  { phase: "gather", ms: 1600 },
  { phase: "briefing", ms: 5000 },
];

/* One element grows through every state, so these are the keyframes of the
   morph. `call` is zero-width: Jarvis has not spoken up yet. */
const WIDTH: Record<Phase, string> = {
  call: "0px",
  nudge: "254px",
  gather: "268px",
  briefing: "64%",
};

/* Near-opaque as a pill, matching the real nudge window. Glass once it is
   carrying context, so the call reads through it. */
const TINT: Record<Phase, string> = {
  call: "rgba(26,29,33,0.94)",
  nudge: "rgba(26,29,33,0.94)",
  gather: "rgba(26,29,33,0.94)",
  briefing: "rgba(16,18,21,0.5)",
};

const RADIUS: Record<Phase, number> = {
  call: 999,
  nudge: 999,
  gather: 999,
  briefing: 14,
};

/* ── The call ───────────────────────────────────────────────────────── */

const PARTICIPANTS = [
  { initials: "DP", name: "David Park", tint: "#8b93d9", label: "left-3" },
  { initials: "YO", name: "You", tint: "#5fa8bf", label: "right-3" },
] as const;

function CallSurface({ speaking }: { speaking: number }) {
  return (
    <div aria-hidden className="grid h-full grid-cols-2 gap-3">
      {PARTICIPANTS.map((p, i) => (
        <div
          key={p.initials}
          className="relative overflow-hidden rounded-[12px] bg-[#17181b]"
          style={{ boxShadow: "rgba(43,43,48,0.1) 0px 1px 4px 0px" }}
        >
          {/* A wash of the person's own colour, so the tile reads as a live
              video cell rather than an empty rectangle. */}
          <div
            className="absolute inset-0 opacity-[0.16]"
            style={{
              background: `radial-gradient(120% 90% at 50% 62%, ${p.tint}, transparent 70%)`,
            }}
          />
          <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2">
            <div className="relative">
              <span
                className="flex h-14 w-14 items-center justify-center rounded-full text-[15px] font-semibold text-white"
                style={{ background: p.tint }}
              >
                {p.initials}
              </span>
              {/* The only perpetual motion here, and it earns its place:
                  without it the call reads as a screenshot for the second
                  before Jarvis speaks up. */}
              {speaking === i ? (
                <motion.span
                  className="absolute -inset-2 rounded-full border-2"
                  style={{ borderColor: p.tint }}
                  animate={{ opacity: [0.8, 0.25, 0.8] }}
                  transition={{ duration: 1.6, repeat: Infinity, ease: "easeInOut" }}
                />
              ) : null}
            </div>
          </div>
          <span
            className={`absolute bottom-3 text-[11px] font-medium text-white/45 ${p.label}`}
          >
            {p.name}
          </span>
        </div>
      ))}
    </div>
  );
}

/* ── Context ────────────────────────────────────────────────────────
   Dates are computed from today the way the app computes them from
   `MissedItem.daysAgo`. There is more here than the panel shows at once,
   on purpose. */

const MISSED = [
  { back: 4, text: "Tom's fix went into review" },
  { back: 3, text: "The bug double-charged 3 customers" },
  { back: 2, text: "Launch slipped to Sep 4" },
  { back: 1, text: "Okta confirmed the SSO timeline" },
  { back: 0, text: "Dmitri flagged a schema conflict" },
] as const;

/* The clarifications this hero used to spend a whole tab on. In the app
   they are the blockers checklist, which is where they belong. */
const WILL_ASK = [
  "Is the payments bug actually fixed?",
  "What is the real launch date?",
  "Did the team stay unblocked?",
] as const;

/* The page is prerendered, so a date baked at build time is the wrong date
   by the time anyone reads it. That makes this a real server/client split
   rather than an effect. `getSnapshot` must be referentially stable or
   React re-renders forever, hence the module-level cache. */
const SEED_DATES = ["Aug 18", "Aug 19", "Aug 20", "Aug 21", "Today"];
let liveDates: string[] | null = null;
const noopSubscribe = () => () => {};
const getSeedDates = () => SEED_DATES;

function getLiveDates() {
  if (!liveDates) {
    const now = new Date();
    liveDates = MISSED.map((m) => {
      if (m.back === 0) return "Today";
      const d = new Date(now);
      d.setDate(d.getDate() - m.back);
      return d.toLocaleDateString("en-US", { month: "short", day: "numeric" });
    });
  }
  return liveDates;
}

function useMissedDates() {
  return React.useSyncExternalStore(noopSubscribe, getLiveDates, getSeedDates);
}

function useElapsed(running: boolean) {
  const [s, setS] = React.useState(244);
  React.useEffect(() => {
    if (!running) return;
    const t = setInterval(() => setS((v) => v + 1), 1000);
    return () => clearInterval(t);
  }, [running]);
  return `${String(Math.floor(s / 60)).padStart(2, "0")}:${String(s % 60).padStart(2, "0")}`;
}

/* ── Jarvis ─────────────────────────────────────────────────────────── */

const GATHER_SOURCES: { name: BrandName; x: number; y: number }[] = [
  { name: "slack", x: -108, y: 40 },
  { name: "gmail", x: 106, y: 36 },
  { name: "meetings", x: -64, y: 62 },
  { name: "linear", x: 70, y: 66 },
];

function PillContent({ gathering }: { gathering: boolean }) {
  return (
    <div className="flex h-[38px] items-center gap-2.5 pl-[5px] pr-4">
      <JarvisMark tone="paper" className="h-[28px] w-[28px] shrink-0" />
      <span className="truncate whitespace-nowrap text-[12.5px] font-semibold text-white">
        {gathering ? "Pulling your context" : "Need a hand on this call?"}
      </span>
      {gathering ? (
        <span className="ml-auto shrink-0 font-mono text-[9.5px] text-white/45">12 · 4</span>
      ) : null}
    </div>
  );
}

function PanelContent({
  dates,
  clock,
  scrollRef,
}: {
  dates: string[];
  clock: string;
  scrollRef: React.RefObject<HTMLDivElement | null>;
}) {
  return (
    <div className="w-full">
      <div className="flex items-center gap-2 border-b border-white/10 px-3 py-2">
        <JarvisMark tone="paper" className="h-[20px] w-[20px] shrink-0" />
        <span className="text-[12px] font-semibold text-white">Jarvis</span>
        <span className="ml-auto font-mono text-[10px] text-white/40">{clock}</span>
      </div>

      {/* Really scrollable, and shorter than its content so that reads. A
          mask fades the last row rather than a gradient overlay, which
          would need a solid colour this panel does not have.

          104 is not arbitrary: with the faces centred in their tiles, it
          puts the panel's bottom edge just onto the top of them. Any
          taller and the glass cuts them in half; any shorter and it stops
          touching the call at all, which is the thing it is here to
          show. */}
      <div
        ref={scrollRef}
        className="max-h-[104px] overflow-y-auto overscroll-contain px-3 py-2.5 [mask-image:linear-gradient(to_bottom,black_calc(100%-20px),transparent)] [&::-webkit-scrollbar-thumb]:rounded-full [&::-webkit-scrollbar-thumb]:bg-white/20 [&::-webkit-scrollbar]:w-[3px]"
      >
        <p className="mb-1.5 text-[9px] font-semibold uppercase tracking-[0.1em] text-white/35">
          While you were out
        </p>
        <ul className="space-y-[5px]">
          {MISSED.map((m, i) => (
            <li key={m.text} className="flex gap-2">
              <span className="w-[40px] shrink-0 pt-px text-right font-mono text-[9.5px] text-white/35">
                {dates[i]}
              </span>
              <span className="relative flex-1 border-l border-white/15 pl-2.5 text-[11px] leading-[1.4] text-white/85">
                <span className="absolute -left-[3px] top-[5px] h-[5px] w-[5px] rounded-full bg-signal-violet" />
                {m.text}
              </span>
            </li>
          ))}
        </ul>

        <div className="mt-3 border-t border-white/10 pt-2.5">
          <p className="mb-1.5 text-[9px] font-semibold uppercase tracking-[0.1em] text-white/35">
            David will ask
          </p>
          <ul className="space-y-1.5">
            {WILL_ASK.map((q) => (
              <li key={q} className="flex items-start gap-2">
                {/* Empty boxes. A tick would say these are settled, which
                    is the opposite of what they are. */}
                <span className="mt-[2.5px] h-3 w-3 shrink-0 rounded-[3.5px] border border-white/30" />
                <span className="text-[11px] leading-[1.4] text-white/85">{q}</span>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
}

/* ── Stage ──────────────────────────────────────────────────────────── */

export function MeetingAssistStage({
  active,
  height = 360,
  mobileHeight,
}: {
  /** Gates every timer. The hero swaps tabs by remounting, so the arc
      restarts on its own and needs no rewind; the flag is here for any
      caller that keeps the stage mounted but hidden. */
  active: boolean;
  height?: number;
  /** Height below `sm`. The briefing needs more room in a phone-width
      column for the same reason it needs a wider panel there. */
  mobileHeight?: number;
}) {
  const reduce = useReducedMotion();
  const [step, setStep] = React.useState(0);
  const [speaking, setSpeaking] = React.useState(0);
  const scrollRef = React.useRef<HTMLDivElement>(null);

  /* The open panel is a percentage of the stage, and 64% of a phone is
     about 220px — narrow enough that "While you were out" wraps to three
     lines and the timeline stops reading as a timeline. Measured rather
     than guessed from a breakpoint, because the stage is a grid cell
     whose width does not track the viewport one-to-one. It starts at the
     desktop value and corrects after mount, which is invisible: the
     panel is 0px wide until the arc reaches `briefing`. */
  const stageRef = React.useRef<HTMLDivElement>(null);
  const [narrow, setNarrow] = React.useState(false);
  React.useEffect(() => {
    const el = stageRef.current;
    if (!el) return;
    const ro = new ResizeObserver(([entry]) => {
      setNarrow(entry.contentRect.width < 420);
    });
    ro.observe(el);
    return () => ro.disconnect();
  }, []);

  const dates = useMissedDates();
  const phase: Phase = reduce ? "briefing" : ARC[step].phase;
  const open = phase === "briefing";
  const clock = useElapsed(active && open);

  React.useEffect(() => {
    if (!active || reduce) return;
    const t = setTimeout(() => setStep((s) => (s + 1) % ARC.length), ARC[step].ms);
    return () => clearTimeout(t);
  }, [active, reduce, step]);

  React.useEffect(() => {
    if (!active || reduce) return;
    const t = setInterval(() => setSpeaking((v) => (v + 1) % PARTICIPANTS.length), 2600);
    return () => clearInterval(t);
  }, [active, reduce]);

  /* Show that the panel scrolls by scrolling it, once, on arrival. Any
     real input hands control straight back. */
  React.useEffect(() => {
    if (!open || reduce) return;
    const el = scrollRef.current;
    if (!el) return;
    const max = el.scrollHeight - el.clientHeight;
    if (max <= 4) return;
    const controls = animate(0, max, {
      duration: 1.6,
      delay: 1,
      ease: "easeInOut",
      repeat: 1,
      repeatType: "reverse",
      onUpdate: (v) => {
        el.scrollTop = v;
      },
    });
    const handOver = () => controls.stop();
    el.addEventListener("wheel", handOver, { passive: true });
    el.addEventListener("pointerdown", handOver);
    return () => {
      controls.stop();
      el.removeEventListener("wheel", handOver);
      el.removeEventListener("pointerdown", handOver);
    };
  }, [open, reduce]);

  const width = narrow ? { ...WIDTH, briefing: "92%", nudge: "230px", gather: "244px" } : WIDTH;

  return (
    <div
      ref={stageRef}
      className="relative h-[var(--ms-h-sm)] sm:h-[var(--ms-h)]"
      style={
        {
          "--ms-h": `${height}px`,
          "--ms-h-sm": `${mobileHeight ?? height}px`,
        } as React.CSSProperties
      }
    >
      <CallSurface speaking={reduce ? -1 : speaking} />

      {/* Jarvis, over the call. One element for every state, never
          unmounted, so `layout` animates pill to panel as a continuous
          morph rather than a crossfade between two different objects.
          Tint, radius and shadow are plain styles as well as animation
          targets: an `animate`-only value does not exist until the first
          frame runs, which showed up as a pill with no pill behind it. */}
      <div className="pointer-events-none absolute inset-x-0 top-4 z-20 flex justify-center">
      <motion.div
        layout
        className="pointer-events-auto overflow-hidden backdrop-blur-xl"
        style={{
          backgroundColor: TINT.nudge,
          borderRadius: 999,
          boxShadow: "0 18px 44px rgba(0,0,0,0.42)",
        }}
        animate={{
          width: width[phase],
          backgroundColor: TINT[phase],
          borderRadius: RADIUS[phase],
          opacity: phase === "call" ? 0 : 1,
        }}
        transition={MORPH}
      >
        <motion.div layout="position">
          {/* Keyed but not wrapped in AnimatePresence: the container's
              `layout` morph is the transition, and an exit animation would
              gate the incoming content on the outgoing content finishing. */}
          <motion.div
            key={open ? "panel" : "pill"}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.18, ease: EASE }}
          >
            {open ? (
              <PanelContent dates={dates} clock={clock} scrollRef={scrollRef} />
            ) : (
              <PillContent gathering={phase === "gather"} />
            )}
          </motion.div>
        </motion.div>
      </motion.div>

        {/* Sources converge on the pill. Same marks the citation chips use
            one tab over, so both capabilities visibly draw on the same
            memory. Centred by margin rather than by a translate, because
            framer owns `transform` on these while it animates them. */}
        {phase === "gather"
          ? GATHER_SOURCES.map((s, i) => (
            <motion.span
              key={s.name}
              className="absolute left-1/2 top-[9px] -ml-2.5 z-30 flex h-5 w-5 items-center justify-center rounded-md bg-white text-coal-ink"
              initial={{ opacity: 0, x: s.x, y: s.y, scale: 0.7 }}
              animate={{
                opacity: [0, 1, 1, 0],
                x: 0,
                y: 0,
                scale: [0.7, 1, 1, 0.4],
              }}
              transition={{
                duration: 1.2,
                delay: i * 0.09,
                ease: EASE,
                times: [0, 0.25, 0.7, 1],
              }}
            >
              <BrandMark name={s.name} size={11} />
            </motion.span>
          ))
          : null}
      </div>
    </div>
  );
}
