"use client";

import * as React from "react";
import {
  motion,
  AnimatePresence,
  useInView,
  useReducedMotion,
} from "framer-motion";
import { CheckIcon, ClockIcon } from "@/components/icons";

/*
  "What changes" — a single Today / With Jarvis switch. Flipping it transforms
  each row's state from today's pain to the Jarvis outcome, the status badge
  morphing from a waiting clock to a filled check. It auto-flips once on scroll
  to demonstrate the change, then the visitor can toggle freely. One clean
  switch (distinct from the per-item selectors elsewhere). Transform/opacity
  motion only; reduced-motion safe.
*/

const EASE = [0.16, 1, 0.3, 1] as const;

type Mode = "today" | "jarvis";

const rows = [
  {
    dimension: "Time to productivity",
    today: "New hires wait around two weeks to get unblocked.",
    jarvis: "Day one, not week two.",
  },
  {
    dimension: "IT workload",
    today: "Hours spent hand-granting access and repeating walkthroughs.",
    jarvis: "IT gets its time back.",
  },
  {
    dimension: "Where knowledge lives",
    today: "Locked in senior people's heads and stale docs.",
    jarvis: "In Jarvis, current and always on.",
  },
];

function Switch({
  mode,
  onChange,
  reduce,
}: {
  mode: Mode;
  onChange: (m: Mode) => void;
  reduce: boolean | null;
}) {
  const options: { id: Mode; label: string }[] = [
    { id: "today", label: "Today" },
    { id: "jarvis", label: "With Jarvis" },
  ];
  return (
    <div
      role="tablist"
      aria-label="Compare today with Jarvis"
      className="inline-flex rounded-full border border-border bg-card p-1"
    >
      {options.map((o) => {
        const isOn = mode === o.id;
        return (
          <button
            key={o.id}
            role="tab"
            aria-selected={isOn}
            type="button"
            onClick={() => onChange(o.id)}
            className="relative rounded-full px-5 py-2 text-sm font-medium outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
          >
            {isOn ? (
              <motion.span
                layoutId="outcome-switch-thumb"
                aria-hidden
                className="absolute inset-0 rounded-full bg-foreground"
                transition={
                  reduce
                    ? { duration: 0 }
                    : { type: "spring", stiffness: 420, damping: 34 }
                }
              />
            ) : null}
            <span
              className={
                "relative z-10 transition-colors " +
                (isOn ? "text-background" : "text-muted-foreground hover:text-foreground")
              }
            >
              {o.label}
            </span>
          </button>
        );
      })}
    </div>
  );
}

export function OutcomesSwitch() {
  const reduce = useReducedMotion();
  const ref = React.useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true, amount: 0.4 });
  const [mode, setMode] = React.useState<Mode>("today");
  const touched = React.useRef(false);

  // Reduced motion shows the resolved outcome without animating the flip.
  const activeMode: Mode = reduce ? "jarvis" : mode;

  // Auto-flip once on scroll to demonstrate the change.
  React.useEffect(() => {
    if (!inView || reduce || touched.current) return;
    const t = setTimeout(() => {
      if (!touched.current) setMode("jarvis");
    }, 750);
    return () => clearTimeout(t);
  }, [inView, reduce]);

  const change = (m: Mode) => {
    touched.current = true;
    setMode(m);
  };

  return (
    <section className="border-t border-border bg-muted">
      <div className="mx-auto max-w-5xl px-6 py-20 sm:py-28">
        <div className="flex flex-col items-center text-center">
          <span className="font-mono text-xs font-semibold uppercase tracking-[0.2em] text-muted-foreground">
            What changes
          </span>
          <h2 className="mt-4 text-3xl font-bold tracking-tight text-foreground sm:text-4xl text-balance">
            The outcome we&apos;re after
          </h2>
          <div className="mt-8">
            <Switch mode={activeMode} onChange={change} reduce={reduce} />
          </div>
        </div>

        <div ref={ref} className="mx-auto mt-14 max-w-3xl">
          {rows.map((row, i) => {
            const isJarvis = activeMode === "jarvis";
            const delay = reduce ? 0 : i * 0.07;
            return (
              <div
                key={row.dimension}
                className="flex items-center gap-5 border-t border-border py-7 last:border-b"
              >
                {/* Status badge: waiting clock -> filled check. */}
                <div className="relative h-9 w-9 shrink-0">
                  <AnimatePresence mode="wait" initial={false}>
                    {isJarvis ? (
                      <motion.span
                        key="check"
                        className="absolute inset-0 flex items-center justify-center rounded-full bg-foreground text-background"
                        initial={reduce ? false : { opacity: 0, scale: 0.5 }}
                        animate={{ opacity: 1, scale: 1 }}
                        exit={reduce ? undefined : { opacity: 0, scale: 0.5 }}
                        transition={{ duration: 0.3, ease: EASE, delay }}
                      >
                        <CheckIcon className="h-[18px] w-[18px]" />
                      </motion.span>
                    ) : (
                      <motion.span
                        key="clock"
                        className="absolute inset-0 flex items-center justify-center rounded-full border border-border bg-card text-muted-foreground"
                        initial={reduce ? false : { opacity: 0, scale: 0.5 }}
                        animate={{ opacity: 1, scale: 1 }}
                        exit={reduce ? undefined : { opacity: 0, scale: 0.5 }}
                        transition={{ duration: 0.3, ease: EASE, delay }}
                      >
                        <ClockIcon className="h-[18px] w-[18px]" />
                      </motion.span>
                    )}
                  </AnimatePresence>
                </div>

                <div className="min-w-0 flex-1">
                  <p className="font-mono text-[11px] uppercase tracking-wider text-muted-foreground">
                    {row.dimension}
                  </p>
                  <div className="mt-1.5 overflow-hidden">
                    <AnimatePresence mode="wait">
                      <motion.p
                        key={activeMode}
                        className={
                          "text-lg leading-snug sm:text-xl " +
                          (isJarvis
                            ? "font-semibold text-foreground"
                            : "text-muted-foreground")
                        }
                        initial={reduce ? false : { opacity: 0, y: isJarvis ? 14 : -14 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={reduce ? undefined : { opacity: 0, y: isJarvis ? -14 : 14 }}
                        transition={{ duration: 0.38, ease: EASE, delay }}
                      >
                        {isJarvis ? row.jarvis : row.today}
                      </motion.p>
                    </AnimatePresence>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
