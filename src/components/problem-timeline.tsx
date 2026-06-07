"use client";

import * as React from "react";
import {
  motion,
  animate,
  useInView,
  useMotionValue,
  useTransform,
  useReducedMotion,
  type Variants,
} from "framer-motion";
import {
  ClockIcon,
  HelpIcon,
  WrenchIcon,
  CheckIcon,
} from "@/components/icons";

/*
  The Problem section, redesigned as "the first two weeks" — a dark, cinematic
  beat in an otherwise light page. A new hire's onboarding plays out as a clock:
  a counter ticks 01 -> 14, a 14-segment bar fills with blocked days, and a
  vertical timeline draws itself downward, revealing each pain in sequence and
  flipping to a bright payoff on day 14. All motion is transform/opacity only
  and collapses gracefully under prefers-reduced-motion.
*/

const EASE_OUT = [0.16, 1, 0.3, 1] as const;
const TOTAL_DAYS = 14;

type Stop = {
  day: number;
  icon: ({ className }: { className?: string }) => React.JSX.Element;
  title: string;
  body: string;
  payoff?: boolean;
};

const stops: Stop[] = [
  {
    day: 1,
    icon: ClockIcon,
    title: "Blocked on arrival",
    body: "Can't run the project, can't deploy, can't open half the tools. The first sprint is half gone before it begins.",
  },
  {
    day: 5,
    icon: HelpIcon,
    title: "Who do I even ask?",
    body: "DevOps? The team lead? The platform team? The process lives in Slack history and people's heads, so every request is a guess.",
  },
  {
    day: 9,
    icon: WrenchIcon,
    title: "IT explains it. Again.",
    body: "Specialists burn real hours hand-granting access and re-walking the same deploy and merge-request steps for every new hire.",
  },
  {
    day: 14,
    icon: CheckIcon,
    title: "First real commit",
    body: "Two weeks in, finally unblocked. Now multiply that by every single person you hire.",
    payoff: true,
  },
];

/* The big number that ticks up to 14 once the section scrolls into view. */
function DayCounter({ start }: { start: boolean }) {
  const prefersReduced = useReducedMotion();
  const count = useMotionValue(prefersReduced ? TOTAL_DAYS : 0);
  const text = useTransform(count, (v) =>
    String(Math.round(v)).padStart(2, "0"),
  );

  React.useEffect(() => {
    if (!start || prefersReduced) return;
    const controls = animate(count, TOTAL_DAYS, {
      duration: 2.4,
      ease: EASE_OUT,
    });
    return () => controls.stop();
  }, [start, prefersReduced, count]);

  return (
    <div className="flex items-end gap-4">
      <span className="text-[11px] font-semibold uppercase tracking-[0.2em] text-white/40 pb-3">
        Day
      </span>
      <motion.span
        aria-hidden
        className="font-mono text-[5.5rem] font-bold leading-[0.85] tracking-tight text-white tabular-nums sm:text-[7rem]"
      >
        {text}
      </motion.span>
      <span className="pb-3 text-2xl font-light text-white/30">/ {TOTAL_DAYS}</span>
    </div>
  );
}

/* Fourteen day-segments. Days 1-13 fill as "blocked"; day 14 is the payoff. */
function BlockedBar({ start }: { start: boolean }) {
  const prefersReduced = useReducedMotion();

  return (
    <div>
      <div className="flex h-12 items-stretch gap-[3px]">
        {Array.from({ length: TOTAL_DAYS }).map((_, i) => {
          const isPayoff = i === TOTAL_DAYS - 1;
          return (
            <motion.span
              key={i}
              className={
                "flex-1 rounded-[3px] " +
                (isPayoff
                  ? "bg-white"
                  : "bg-[repeating-linear-gradient(135deg,rgba(255,255,255,0.16)_0px,rgba(255,255,255,0.16)_2px,transparent_2px,transparent_5px)] ring-1 ring-inset ring-white/10")
              }
              initial={
                prefersReduced ? false : { opacity: 0, scaleY: 0.35 }
              }
              animate={
                start || prefersReduced
                  ? { opacity: isPayoff ? 1 : 0.85, scaleY: 1 }
                  : undefined
              }
              transition={{
                duration: 0.5,
                ease: EASE_OUT,
                delay: prefersReduced ? 0 : i * 0.09,
              }}
              style={{ transformOrigin: "bottom" }}
            />
          );
        })}
      </div>
      <div className="mt-3 flex justify-between font-mono text-[11px] uppercase tracking-wider text-white/40">
        <span>13 days blocked</span>
        <span className="text-white/70">1 day shipping</span>
      </div>
    </div>
  );
}

const listVariants: Variants = {
  hidden: {},
  show: {
    transition: { staggerChildren: 0.16, delayChildren: 0.1 },
  },
};

const stopVariants: Variants = {
  hidden: { opacity: 0, x: 24 },
  show: {
    opacity: 1,
    x: 0,
    transition: { duration: 0.6, ease: EASE_OUT },
  },
};

/* The vertical timeline: a line draws downward, stops reveal in sequence. */
function Timeline() {
  const prefersReduced = useReducedMotion();
  const ref = React.useRef<HTMLOListElement>(null);
  const inView = useInView(ref, { once: true, amount: 0.25 });

  return (
    <ol ref={ref} className="relative">
      {/* The drawing track, behind the nodes. */}
      <span
        aria-hidden
        className="absolute left-[15px] top-3 bottom-3 w-px bg-white/10 sm:left-[19px]"
      />
      <motion.span
        aria-hidden
        className="absolute left-[15px] top-3 bottom-3 w-px origin-top bg-gradient-to-b from-white/70 to-white/15 sm:left-[19px]"
        initial={prefersReduced ? false : { scaleY: 0 }}
        animate={inView || prefersReduced ? { scaleY: 1 } : undefined}
        transition={{ duration: 1.8, ease: EASE_OUT }}
      />

      <motion.div
        variants={listVariants}
        initial={prefersReduced ? false : "hidden"}
        animate={inView || prefersReduced ? "show" : undefined}
      >
        {stops.map((stop) => (
          <motion.li
            key={stop.day}
            variants={stopVariants}
            className="relative flex gap-5 pb-10 last:pb-0 sm:gap-7"
          >
            {/* Node */}
            <span
              className={
                "relative z-10 flex h-8 w-8 shrink-0 items-center justify-center rounded-full sm:h-10 sm:w-10 " +
                (stop.payoff
                  ? "bg-white text-black shadow-[0_0_0_6px_rgba(255,255,255,0.08)]"
                  : "border border-white/15 bg-[#111113] text-white/70")
              }
            >
              <stop.icon className="h-4 w-4 sm:h-[18px] sm:w-[18px]" />
              {stop.payoff && !prefersReduced ? (
                <motion.span
                  aria-hidden
                  className="absolute inset-0 rounded-full ring-1 ring-white/40"
                  initial={{ opacity: 0.6, scale: 1 }}
                  animate={{ opacity: 0, scale: 1.9 }}
                  transition={{
                    duration: 2.2,
                    ease: "easeOut",
                    repeat: Infinity,
                    repeatDelay: 0.4,
                  }}
                />
              ) : null}
            </span>

            {/* Content */}
            <div className="-mt-0.5 pt-px">
              <div className="flex items-center gap-2.5">
                <span
                  className={
                    "font-mono text-xs font-semibold tracking-wider " +
                    (stop.payoff ? "text-white" : "text-white/40")
                  }
                >
                  DAY {String(stop.day).padStart(2, "0")}
                </span>
                {stop.payoff ? (
                  <span className="rounded-full bg-white/10 px-2 py-0.5 font-mono text-[10px] uppercase tracking-wider text-white/70">
                    finally
                  </span>
                ) : (
                  <span className="font-mono text-[10px] uppercase tracking-wider text-white/30">
                    still blocked
                  </span>
                )}
              </div>
              <h3
                className={
                  "mt-1.5 text-lg font-semibold tracking-tight sm:text-xl " +
                  (stop.payoff ? "text-white" : "text-white/90")
                }
              >
                {stop.title}
              </h3>
              <p className="mt-1.5 max-w-md text-sm leading-relaxed text-white/45">
                {stop.body}
              </p>
            </div>
          </motion.li>
        ))}
      </motion.div>
    </ol>
  );
}

export function ProblemTimeline() {
  const ref = React.useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true, amount: 0.3 });

  return (
    <section
      id="problem"
      className="relative scroll-mt-24 overflow-hidden border-t border-white/10 bg-[#0a0a0b] text-white"
    >
      {/* Faint blueprint grid for atmosphere; fades toward the bottom. */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 [mask-image:radial-gradient(120%_80%_at_50%_0%,#000_30%,transparent_75%)] bg-[linear-gradient(rgba(255,255,255,0.03)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.03)_1px,transparent_1px)] bg-[size:56px_56px]"
      />
      <div className="relative mx-auto max-w-6xl px-6 py-24 sm:py-32">
        <div className="grid gap-16 lg:grid-cols-[minmax(0,1fr)_minmax(0,1.05fr)] lg:gap-20">
          {/* Left: the framing + the big animated clock. */}
          <div ref={ref} className="lg:sticky lg:top-28 lg:self-start">
            <span className="font-mono text-xs font-semibold uppercase tracking-[0.2em] text-white/45">
              The problem
            </span>
            <h2 className="mt-5 text-3xl font-bold leading-[1.1] tracking-tight text-balance sm:text-[2.75rem]">
              A new hire&apos;s first two weeks,
              <br className="hidden sm:block" /> spent mostly waiting.
            </h2>
            <p className="mt-5 max-w-md text-base leading-relaxed text-white/50 text-pretty">
              Getting every access can take around two weeks. Until then, people
              sit half-blocked, guessing who to ask while the work piles up.
            </p>

            <div className="mt-12">
              <DayCounter start={inView} />
            </div>
            <div className="mt-8 max-w-md">
              <BlockedBar start={inView} />
            </div>

            <p className="mt-12 max-w-md border-t border-white/10 pt-6 text-sm leading-relaxed text-white/45">
              The new hire loses two weeks. IT loses hours per person. The team
              loses focus to onboarding. Every hire, every time.
            </p>
          </div>

          {/* Right: the day-by-day timeline. */}
          <div className="lg:pt-2">
            <Timeline />
          </div>
        </div>
      </div>
    </section>
  );
}
