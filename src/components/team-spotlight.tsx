"use client";

import * as React from "react";
import { motion, AnimatePresence, useReducedMotion } from "framer-motion";
import { ArrowRightIcon } from "@/components/icons";

/*
  "For your team" — a persona spotlight. The four buyers from customers.md sit in
  a selector with a sliding indicator; hovering or clicking one spotlights how
  their pain turns into their win while the others dim back. Selection-driven
  (no auto-advance) to stay distinct from the "What it does" showcase. The
  sliding pill rides framer's transform-based layout animation; content
  crossfades. Reduced-motion safe.
*/

const EASE = [0.16, 1, 0.3, 1] as const;

type Persona = {
  role: string;
  who: string;
  feels: string;
  gets: string;
  primary?: boolean;
};

const personas: Persona[] = [
  {
    role: "People & HR",
    who: "CPO, HR partners",
    primary: true,
    feels: "A slow, scrambled first two weeks for every new hire.",
    gets: "A smooth day one they own.",
  },
  {
    role: "Engineering managers",
    who: "Heads of Eng",
    feels: "Engineers hired to ship, then blocked for a whole sprint.",
    gets: "Time to first commit, measured in hours.",
  },
  {
    role: "IT & DevOps",
    who: "Platform, IT managers",
    feels: "A week lost to access requests and the same questions.",
    gets: "Access self-serves. Their time comes back.",
  },
  {
    role: "Leadership",
    who: "Founders, CEO",
    feels: "Every slow start, multiplied across every hire.",
    gets: "Onboarding cost that finally goes down.",
  },
];

export function TeamSpotlight() {
  const reduce = useReducedMotion();
  const [active, setActive] = React.useState(0);
  const p = personas[active];

  return (
    <section id="team" className="scroll-mt-24 border-t border-border">
      <div className="mx-auto max-w-6xl px-6 py-20 sm:py-28">
        <div className="mx-auto max-w-2xl text-center">
          <span className="font-mono text-xs font-semibold uppercase tracking-[0.2em] text-muted-foreground">
            For your team
          </span>
          <h2 className="mt-4 text-3xl font-bold tracking-tight text-foreground sm:text-4xl text-balance">
            Built for everyone onboarding touches
          </h2>
          <p className="mt-4 text-lg text-muted-foreground text-pretty">
            Different people feel the pain differently. Jarvis answers to all of
            them.
          </p>
        </div>

        {/* Persona selector with a sliding indicator. */}
        <div className="mt-12 flex flex-wrap justify-center gap-1.5">
          {personas.map((per, i) => {
            const isActive = i === active;
            return (
              <button
                key={per.role}
                type="button"
                onMouseEnter={() => setActive(i)}
                onFocus={() => setActive(i)}
                onClick={() => setActive(i)}
                aria-pressed={isActive}
                className="relative rounded-full px-4 py-2 text-sm font-medium outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
              >
                {isActive ? (
                  <motion.span
                    layoutId="team-spotlight-pill"
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
                    "relative z-10 flex items-center gap-2 transition-colors " +
                    (isActive
                      ? "text-background"
                      : "text-muted-foreground hover:text-foreground")
                  }
                >
                  <span
                    className={
                      "h-1.5 w-1.5 rounded-full transition-colors " +
                      (isActive ? "bg-background" : "bg-foreground/30")
                    }
                  />
                  {per.role}
                </span>
              </button>
            );
          })}
        </div>

        {/* Spotlight panel. */}
        <div className="relative mx-auto mt-8 min-h-[280px] max-w-3xl overflow-hidden rounded-3xl border border-border bg-card px-7 py-9 shadow-xl shadow-foreground/5 sm:min-h-[260px] sm:px-12 sm:py-12">
          <AnimatePresence mode="wait">
            <motion.div
              key={active}
              initial={reduce ? false : { opacity: 0, y: 14 }}
              animate={{ opacity: 1, y: 0 }}
              exit={reduce ? undefined : { opacity: 0, y: -14 }}
              transition={{ duration: 0.4, ease: EASE }}
            >
              <div className="flex flex-wrap items-center gap-x-3 gap-y-2">
                <span className="text-base font-semibold text-foreground">
                  {p.role}
                </span>
                <span className="text-sm text-muted-foreground">{p.who}</span>
                {p.primary ? (
                  <span className="rounded-full border border-border bg-muted px-2.5 py-0.5 font-mono text-[10px] uppercase tracking-wider text-muted-foreground">
                    where it lands first
                  </span>
                ) : null}
              </div>

              <p className="mt-7 font-mono text-[11px] uppercase tracking-wider text-muted-foreground">
                What they feel
              </p>
              <p className="mt-2 text-xl leading-snug text-muted-foreground text-pretty sm:text-2xl">
                {p.feels}
              </p>

              <motion.div
                className="mt-7 flex items-start gap-3"
                initial={reduce ? false : { opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4, ease: EASE, delay: reduce ? 0 : 0.18 }}
              >
                <span className="mt-1 flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-foreground text-background">
                  <ArrowRightIcon className="h-4 w-4" />
                </span>
                <div>
                  <p className="font-mono text-[11px] uppercase tracking-wider text-muted-foreground">
                    With Jarvis
                  </p>
                  <p className="mt-1 text-2xl font-semibold leading-tight tracking-tight text-foreground text-balance sm:text-[1.75rem]">
                    {p.gets}
                  </p>
                </div>
              </motion.div>
            </motion.div>
          </AnimatePresence>
        </div>
      </div>
    </section>
  );
}
