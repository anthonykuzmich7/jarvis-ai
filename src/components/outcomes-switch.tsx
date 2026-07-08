"use client";

import * as React from "react";
import { motion, useInView, useReducedMotion } from "framer-motion";
import { CheckIcon } from "@/components/icons";

const EASE = [0.16, 1, 0.3, 1] as const;

const stats = [
  {
    label: "Time to first commit",
    metric: "Day 2",
    win: "Sarah pushed her first PR on Tuesday. Jarvis had her context synced and access ready before she even opened her laptop.",
    check: "Jarvis handled it",
  },
  {
    label: "IT access tickets",
    metric: "0",
    win: "12 systems, 18 minutes. Jarvis provisioned everything the moment Sarah's offer was signed — no IT queue, no waiting.",
    check: "Auto-provisioned",
  },
  {
    label: "Senior dev interrupts",
    metric: "Instant",
    win: "Who owns billing? Who built auth? Sarah got her answers without pinging a single senior dev. They didn't even know she'd asked.",
    check: "Always available",
  },
];

export function OutcomesSwitch() {
  const reduce = useReducedMotion();
  const ref = React.useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true, amount: 0.25 });

  return (
    <section className="bg-ledger-white">
      <div className="mx-auto w-full max-w-5xl px-6 py-24 sm:py-32">

        {/* Heading */}
        <div className="mb-12 text-center">
          <h2 className="font-display text-[32px] font-bold leading-[1.13] tracking-[-0.96px] text-coal-ink sm:text-[40px] sm:tracking-[-1.2px]">
            What changes with Jarvis.
          </h2>
        </div>

        {/* Stat grid */}
        <div
          ref={ref}
          className="grid grid-cols-1 gap-px bg-ash sm:grid-cols-3 overflow-hidden rounded-[10px] border border-ash"
          style={{ boxShadow: "rgba(95,99,106,0.08) 0px 0px 0px 1px, rgba(43,43,48,0.1) 0px 1px 4px 0px" }}
        >
          {stats.map((s, i) => (
            <motion.div
              key={s.label}
              className="flex flex-col bg-card px-7 py-7"
              initial={reduce ? false : { opacity: 0, y: 16 }}
              animate={inView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.48, ease: EASE, delay: reduce ? 0 : i * 0.1 }}
            >
              {/* Category label — Inter 400 14px slate-mid per Panxo stat cell spec */}
              <p className="text-[14px] font-normal leading-snug text-slate-mid">
                {s.label}
              </p>

              {/* Metric — Mona Sans 700 (Geist) per Panxo spec */}
              <p className="mt-2 font-display text-[44px] font-bold leading-none tracking-[-1.44px] text-coal-ink sm:text-[52px]">
                {s.metric}
              </p>

              {/* Win copy */}
              <p className="mt-4 flex-1 text-[13px] leading-[1.6] tracking-[-0.1px] text-slate-mid">
                {s.win}
              </p>

              {/* Check badge */}
              <div className="mt-5 flex items-center gap-2">
                <span className="flex h-[18px] w-[18px] shrink-0 items-center justify-center rounded-full bg-mint-pulse">
                  <CheckIcon className="h-2.5 w-2.5 text-white" />
                </span>
                <span className="text-[11px] font-semibold text-mint-pulse">
                  {s.check}
                </span>
              </div>
            </motion.div>
          ))}
        </div>

      </div>
    </section>
  );
}
