"use client";

import * as React from "react";
import { motion, useInView, useReducedMotion } from "framer-motion";

const EASE = [0.16, 1, 0.3, 1] as const;

const LOG_LINES = [
  { tag: "slack",  color: "#E01E5A", msg: "Connected — syncing #engineering",  delay: 0.5  },
  { tag: "zoom",   color: "#2D8CFF", msg: "Q3 planning call indexed",           delay: 1.1  },
  { tag: "github", color: "#6e40c9", msg: "47 PRs scanned, 8 authors mapped",  delay: 1.7  },
  { tag: "notion", color: "#969594", msg: "12 runbooks loaded",                 delay: 2.3  },
  { tag: "jira",   color: "#2684FF", msg: "8 sprint boards active",             delay: 2.9  },
] as const;

const CARD_ROWS = [
  { label: "Slack messages & decisions", value: "Live sync",   delay: 3.6  },
  { label: "Zoom meeting transcripts",   value: "Indexed",     delay: 3.72 },
  { label: "GitHub docs & PRs",          value: "Available",   delay: 3.84 },
  { label: "Team knowledge",             value: "From Jarvis", delay: 3.96 },
] as const;

const CHIPS = ["Slack", "Zoom", "Notion", "GitHub", "Jira"] as const;

function Check({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 16 16" fill="none" aria-hidden className={className}>
      <path d="M3.5 8.5l3 3 6-6" stroke="currentColor" strokeWidth="1.8"
        strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

export function MissionControlJarvis() {
  const ref = React.useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true, amount: 0.15 });
  const reduce = useReducedMotion();
  const on = inView || !!reduce;

  return (
    <section className="bg-ledger-white">
      <div ref={ref} className="mx-auto max-w-6xl px-6 py-20 sm:py-28">

        {/* Heading */}
        <div className="mx-auto max-w-2xl text-center">
          <h2 className="text-balance font-display text-3xl font-semibold leading-[1.15] tracking-[-0.64px] text-foreground sm:text-4xl">
            The context layer your AI was missing
          </h2>
          <p className="mt-4 text-pretty text-lg leading-relaxed text-muted-foreground">
            Connect Jarvis to your stack once. Every query gets real company context — live.
          </p>
        </div>

        {/* Dual-panel */}
        <motion.div
          className="mx-auto mt-14 grid max-w-4xl overflow-hidden rounded-2xl border border-ash shadow-[0_20px_80px_rgba(43,43,48,0.12)] sm:grid-cols-2"
          initial={reduce ? false : { opacity: 0, y: 28 }}
          animate={on ? { opacity: 1, y: 0 } : undefined}
          transition={{ duration: 0.6, ease: EASE }}
        >

          {/* ── LEFT: Terminal ─────────────────────────────────── */}
          <div className="flex flex-col bg-coal-ink p-6 font-mono text-[13px]">

            {/* Window chrome */}
            <div className="mb-6 flex items-center gap-2">
              <span className="h-3 w-3 rounded-full bg-white/12" />
              <span className="h-3 w-3 rounded-full bg-white/12" />
              <span className="h-3 w-3 rounded-full bg-white/12" />
              <span className="ml-4 text-[10px] font-semibold uppercase tracking-[0.18em] text-white/25">
                jarvis sync
              </span>
            </div>

            {/* Source tags */}
            <div className="mb-6 flex flex-wrap gap-1.5">
              {LOG_LINES.map(({ tag, color }) => (
                <span
                  key={tag}
                  className="rounded px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider"
                  style={{ backgroundColor: color + "22", color }}
                >
                  {tag}
                </span>
              ))}
            </div>

            {/* Log lines */}
            <div className="flex-1 space-y-[11px]">
              {LOG_LINES.map(({ tag, color, msg, delay }) => (
                <motion.div
                  key={tag}
                  className="flex items-center gap-0"
                  initial={reduce ? false : { opacity: 0, x: -10 }}
                  animate={on ? { opacity: 1, x: 0 } : undefined}
                  transition={{ duration: 0.3, ease: EASE, delay }}
                >
                  <span className="text-white/25">[</span>
                  <span className="w-14 shrink-0 text-center text-[11px] font-bold" style={{ color }}>
                    {tag}
                  </span>
                  <span className="text-white/25">]</span>
                  <span className="ml-3 text-white/60">{msg}</span>
                  <motion.span
                    className="ml-auto shrink-0 text-[11px] font-bold text-mint-pulse"
                    initial={reduce ? false : { opacity: 0 }}
                    animate={on ? { opacity: 1 } : undefined}
                    transition={{ duration: 0.2, ease: EASE, delay: delay + 0.25 }}
                  >
                    ✓
                  </motion.span>
                </motion.div>
              ))}
            </div>

            {/* Ready prompt */}
            <motion.div
              className="mt-6 flex items-center gap-2 border-t border-white/8 pt-5"
              initial={reduce ? false : { opacity: 0 }}
              animate={on ? { opacity: 1 } : undefined}
              transition={{ duration: 0.4, ease: EASE, delay: 3.3 }}
            >
              <span className="text-signal-violet">›</span>
              <span className="text-white/50">context ready —</span>
              <span className="font-semibold text-signal-violet">4 queries waiting</span>
              <motion.span
                className="ml-0.5 font-bold text-signal-violet"
                animate={on && !reduce ? { opacity: [1, 0, 1] } : undefined}
                transition={{ duration: 0.85, repeat: Infinity, ease: "linear" }}
              >
                _
              </motion.span>
            </motion.div>
          </div>

          {/* ── RIGHT: Context card ────────────────────────────── */}
          <motion.div
            className="flex flex-col bg-white"
            initial={reduce ? false : { opacity: 0 }}
            animate={on ? { opacity: 1 } : undefined}
            transition={{ duration: 0.55, ease: EASE, delay: 3.35 }}
          >
            {/* Header */}
            <div className="flex items-center justify-between border-b border-ash px-6 py-4">
              <span className="text-[11px] font-bold uppercase tracking-[0.1em] text-foreground">
                Company Context
              </span>
              <motion.span
                className="flex items-center gap-1.5 rounded-full bg-mint-pulse/10 px-3 py-1 text-[11px] font-semibold text-mint-pulse"
                initial={reduce ? false : { opacity: 0 }}
                animate={on ? { opacity: 1 } : undefined}
                transition={{ duration: 0.3, delay: 3.6 }}
              >
                <motion.span
                  className="h-[6px] w-[6px] rounded-full bg-mint-pulse"
                  animate={on && !reduce ? { opacity: [1, 0.2, 1] } : undefined}
                  transition={{ duration: 2.1, repeat: Infinity }}
                />
                Live
              </motion.span>
            </div>

            {/* Rows */}
            <div className="flex-1 divide-y divide-ash/50 px-6">
              {CARD_ROWS.map(({ label, value, delay }) => (
                <motion.div
                  key={label}
                  className="flex items-center justify-between py-[14px]"
                  initial={reduce ? false : { opacity: 0, x: 10 }}
                  animate={on ? { opacity: 1, x: 0 } : undefined}
                  transition={{ duration: 0.34, ease: EASE, delay }}
                >
                  <span className="text-[13px] text-muted-foreground">{label}</span>
                  <span className="flex items-center gap-1.5 text-[13px] font-semibold text-mint-pulse">
                    <Check className="h-4 w-4" />
                    {value}
                  </span>
                </motion.div>
              ))}
            </div>

            {/* Chips */}
            <motion.div
              className="flex flex-wrap gap-2 border-t border-ash/50 px-6 py-4"
              initial={reduce ? false : { opacity: 0 }}
              animate={on ? { opacity: 1 } : undefined}
              transition={{ duration: 0.3, delay: 4.1 }}
            >
              {CHIPS.map(name => (
                <span key={name} className="rounded-full border border-ash bg-parchment px-3 py-1 text-[11px] font-medium text-graphite">
                  {name}
                </span>
              ))}
            </motion.div>
          </motion.div>

        </motion.div>
      </div>
    </section>
  );
}
