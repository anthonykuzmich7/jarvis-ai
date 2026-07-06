"use client";

import * as React from "react";
import { motion, useInView, useReducedMotion } from "framer-motion";

const EASE = [0.16, 1, 0.3, 1] as const;

/* ── Real brand marks (inline SVG, simplified to essentials) ──── */

function SlackMark({ className }: { className?: string }) {
  // Slack pinwheel: 4 colored rounded bars
  return (
    <svg viewBox="0 0 24 24" fill="none" aria-hidden className={className}>
      <rect x="3.5"  y="8.75"  width="5.75" height="2.5" rx="1.25" fill="#E01E5A" />
      <rect x="8.75" y="3.5"   width="2.5"  height="5.75" rx="1.25" fill="#E01E5A" />
      <rect x="14.75" y="8.75" width="5.75" height="2.5"  rx="1.25" fill="#36C5F0" />
      <rect x="12.75" y="3.5"  width="2.5"  height="5.75" rx="1.25" fill="#2EB67D" />
      <rect x="3.5"  y="12.75" width="5.75" height="2.5"  rx="1.25" fill="#ECB22E" />
      <rect x="8.75" y="14.75" width="2.5"  height="5.75" rx="1.25" fill="#ECB22E" />
      <rect x="14.75" y="12.75" width="5.75" height="2.5" rx="1.25" fill="#2EB67D" />
      <rect x="12.75" y="14.75" width="2.5"  height="5.75" rx="1.25" fill="#36C5F0" />
    </svg>
  );
}

function ZoomMark({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="none" aria-hidden className={className}>
      <rect x="2"   y="7"  width="13" height="10" rx="2.5" fill="#2D8CFF" />
      <path d="M15.5 10.2L22 7.5v9l-6.5-2.7V10.2z" fill="#2D8CFF" />
    </svg>
  );
}

function NotionMark({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="none" aria-hidden className={className}>
      <path
        d="M7 7v10M7 7l10 10V7"
        stroke="#1c1a17"
        strokeWidth="2.3"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

function GitHubMark({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="#1c1a17" aria-hidden className={className}>
      <path
        fillRule="evenodd"
        clipRule="evenodd"
        d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.531 1.032 1.531 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z"
      />
    </svg>
  );
}

function JiraMark({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="none" aria-hidden className={className}>
      <path d="M12 3.5L20.5 12L12 20.5L3.5 12L12 3.5z" fill="#DBEAFE" />
      <path d="M12 3.5L20.5 12L12 20.5" fill="#2684FF" />
      <path
        d="M12 8.5l4 3.5-4 3.5"
        stroke="white"
        strokeWidth="1.9"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

const TOOLS = [
  { id: "slack",  label: "Slack",  Mark: SlackMark  },
  { id: "zoom",   label: "Zoom",   Mark: ZoomMark   },
  { id: "notion", label: "Notion", Mark: NotionMark },
  { id: "github", label: "GitHub", Mark: GitHubMark },
  { id: "jira",   label: "Jira",   Mark: JiraMark   },
] as const;

const CONTEXT_ROWS = [
  { label: "Slack messages & decisions", value: "Live sync",   delay: 0    },
  { label: "Zoom meeting transcripts",   value: "Indexed",     delay: 0.10 },
  { label: "GitHub docs & PRs",          value: "Available",   delay: 0.20 },
  { label: "Team knowledge",             value: "From Jarvis", delay: 0.30 },
] as const;

const CHIPS = ["Slack", "Zoom", "Notion", "GitHub", "Jira"] as const;

/* Horizontal bar width = center-to-center of 5 icons at gap-6 (24px) and w-[52px]:
   4 × (52 + 24) = 304px */
const H_BAR_W = 304;

function Check({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 16 16" fill="none" aria-hidden className={className}>
      <path d="M3.5 8.5l3 3 6-6" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

function ContextDiagram({ live }: { live: boolean }) {
  const reduce = useReducedMotion();
  const on = live || !!reduce;

  return (
    <div className="mx-auto flex max-w-xl flex-col items-center">

      {/* ── Tool icons ────────────────────────────────────────── */}
      <div className="flex gap-6">
        {TOOLS.map(({ id, label, Mark }, i) => (
          <motion.div
            key={id}
            className="flex flex-col items-center"
            initial={reduce ? false : { opacity: 0, y: -14 }}
            animate={on ? { opacity: 1, y: 0 } : undefined}
            transition={{ duration: 0.45, ease: EASE, delay: i * 0.07 }}
          >
            <div
              className="flex h-[52px] w-[52px] items-center justify-center rounded-full border border-ash bg-white shadow-[rgba(95,99,106,0.08)_0px_0px_0px_1px,rgba(43,43,48,0.06)_0px_4px_12px_0px]"
              title={label}
            >
              <Mark className="h-[26px] w-[26px]" />
            </div>
            {/* Drop line */}
            <motion.div
              className="w-px bg-fossil"
              style={{ height: 22, transformOrigin: "top" }}
              initial={reduce ? false : { scaleY: 0 }}
              animate={on ? { scaleY: 1 } : undefined}
              transition={{ duration: 0.22, ease: EASE, delay: 0.42 + i * 0.04 }}
            />
          </motion.div>
        ))}
      </div>

      {/* ── Horizontal connector ───────────────────────────────── */}
      <motion.div
        className="h-px bg-fossil"
        style={{ width: H_BAR_W, transformOrigin: "center" }}
        initial={reduce ? false : { scaleX: 0 }}
        animate={on ? { scaleX: 1 } : undefined}
        transition={{ duration: 0.36, ease: EASE, delay: 0.63 }}
      />

      {/* ── Trunk to pill ─────────────────────────────────────── */}
      <motion.div
        className="w-px bg-fossil"
        style={{ height: 22, transformOrigin: "top" }}
        initial={reduce ? false : { scaleY: 0 }}
        animate={on ? { scaleY: 1 } : undefined}
        transition={{ duration: 0.2, ease: EASE, delay: 0.77 }}
      />

      {/* ── Query pill ────────────────────────────────────────── */}
      <motion.div
        className="flex items-center gap-2.5 rounded-full border border-ash bg-white px-4 py-2 shadow-[rgba(95,99,106,0.08)_0px_0px_0px_1px,rgba(43,43,48,0.06)_0px_4px_14px_0px]"
        initial={reduce ? false : { opacity: 0, scale: 0.88 }}
        animate={on ? { opacity: 1, scale: 1 } : undefined}
        transition={{ duration: 0.38, ease: EASE, delay: 0.86 }}
      >
        <motion.span
          className="h-[7px] w-[7px] rounded-full bg-signal-violet"
          animate={on && !reduce ? { opacity: [1, 0.18, 1] } : undefined}
          transition={{ duration: 1.9, repeat: Infinity, ease: "easeInOut" }}
        />
        <span className="text-[13px] font-medium text-foreground">
          Context query received
        </span>
      </motion.div>

      {/* ── Trunk to card ─────────────────────────────────────── */}
      <motion.div
        className="w-px bg-fossil"
        style={{ height: 22, transformOrigin: "top" }}
        initial={reduce ? false : { scaleY: 0 }}
        animate={on ? { scaleY: 1 } : undefined}
        transition={{ duration: 0.2, ease: EASE, delay: 1.05 }}
      />

      {/* ── Company context card ──────────────────────────────── */}
      <motion.div
        className="w-full overflow-hidden rounded-xl border border-ash bg-white shadow-[rgba(95,99,106,0.08)_0px_0px_0px_1px,rgba(43,43,48,0.08)_0px_8px_32px_0px]"
        initial={reduce ? false : { opacity: 0, y: 14 }}
        animate={on ? { opacity: 1, y: 0 } : undefined}
        transition={{ duration: 0.5, ease: EASE, delay: 1.14 }}
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
            transition={{ duration: 0.3, ease: EASE, delay: 1.3 }}
          >
            <motion.span
              className="h-[6px] w-[6px] rounded-full bg-mint-pulse"
              animate={on && !reduce ? { opacity: [1, 0.25, 1] } : undefined}
              transition={{ duration: 2.2, repeat: Infinity, ease: "easeInOut" }}
            />
            Live
          </motion.span>
        </div>

        {/* Data rows */}
        <div className="divide-y divide-ash/50 px-6">
          {CONTEXT_ROWS.map(({ label, value, delay }) => (
            <motion.div
              key={label}
              className="flex items-center justify-between py-[14px]"
              initial={reduce ? false : { opacity: 0, x: -8 }}
              animate={on ? { opacity: 1, x: 0 } : undefined}
              transition={{ duration: 0.34, ease: EASE, delay: 1.44 + delay }}
            >
              <span className="text-[13.5px] text-muted-foreground">{label}</span>
              <span className="flex items-center gap-1.5 text-[13.5px] font-semibold text-mint-pulse">
                <Check className="h-4 w-4" />
                {value}
              </span>
            </motion.div>
          ))}
        </div>

        {/* Integration chips */}
        <motion.div
          className="flex flex-wrap gap-2 border-t border-ash/50 px-6 py-4"
          initial={reduce ? false : { opacity: 0 }}
          animate={on ? { opacity: 1 } : undefined}
          transition={{ duration: 0.34, ease: EASE, delay: 1.94 }}
        >
          {CHIPS.map((name) => (
            <span
              key={name}
              className="rounded-full border border-ash bg-parchment px-3 py-1 text-[11px] font-medium text-graphite"
            >
              {name}
            </span>
          ))}
        </motion.div>
      </motion.div>
    </div>
  );
}

export function MeetJarvis() {
  const ref = React.useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true, amount: 0.18 });

  return (
    <section id="meet-jarvis" className="relative overflow-hidden bg-ledger-white">
      {/* Faint violet center glow — technology atmosphere */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 [background:radial-gradient(ellipse_60%_55%_at_50%_52%,rgba(119,126,255,0.05)_0%,transparent_100%)]"
      />

      <div ref={ref} className="relative mx-auto max-w-6xl px-6 py-20 sm:py-28">
        <div className="mx-auto max-w-2xl text-center">
          <h2 className="text-balance font-display text-3xl font-semibold leading-[1.15] tracking-[-0.64px] text-foreground sm:text-4xl">
            The context layer your AI was missing
          </h2>
          <p className="mt-5 text-pretty text-lg leading-relaxed text-muted-foreground">
            Connect Jarvis to your tools once. He reads Slack, indexes Zoom transcripts,
            and syncs your docs — so every AI query gets real company context, instantly.
          </p>
        </div>

        <div className="mt-14 sm:mt-20">
          <ContextDiagram live={inView} />
        </div>
      </div>
    </section>
  );
}
