"use client";

import * as React from "react";
import {
  motion,
  AnimatePresence,
  useReducedMotion,
} from "framer-motion";
import {
  KeyIcon,
  CompassIcon,
  BrainIcon,
  CheckIcon,
} from "@/components/icons";

const EASE = [0.16, 1, 0.3, 1] as const;
const CYCLE_MS = 5200;

/* ---- Brand marks ------------------------------------------------------- */

function SlackMark({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 2447.6 2452.5" className={className} aria-hidden>
      <g clipRule="evenodd" fillRule="evenodd">
        <path d="m897.4 0c-135.3.1-244.8 109.9-244.7 245.2-.1 135.3 109.5 245.1 244.8 245.2h244.8v-245.1c.1-135.3-109.5-245.1-244.9-245.3.1 0 .1 0 0 0m0 654h-652.6c-135.3.1-244.9 109.9-244.8 245.2-.2 135.3 109.4 245.1 244.7 245.3h652.7c135.3-.1 244.9-109.9 244.8-245.2.1-135.4-109.5-245.2-244.8-245.3z" fill="#36c5f0"/>
        <path d="m2447.6 899.2c.1-135.3-109.5-245.1-244.8-245.2-135.3.1-244.9 109.9-244.8 245.2v245.3h244.8c135.3-.1 244.9-109.9 244.8-245.3zm-652.7 0v-654c.1-135.2-109.4-245-244.7-245.2-135.3.1-244.9 109.9-244.8 245.2v654c-.2 135.3 109.4 245.1 244.7 245.3 135.3-.1 244.9-109.9 244.8-245.3z" fill="#2eb67d"/>
        <path d="m1550.1 2452.5c135.3-.1 244.9-109.9 244.8-245.2.1-135.3-109.5-245.1-244.8-245.2h-244.8v245.2c-.1 135.2 109.5 245 244.8 245.2zm0-654.1h652.7c135.3-.1 244.9-109.9 244.8-245.2.2-135.3-109.4-245.1-244.7-245.3h-652.7c-135.3.1-244.9 109.9-244.8 245.2-.1 135.4 109.4 245.2 244.7 245.3z" fill="#ecb22e"/>
        <path d="m0 1553.2c-.1 135.3 109.5 245.1 244.8 245.2 135.3-.1 244.9-109.9 244.8-245.2v-245.2h-244.8c-135.3.1-244.9 109.9-244.8 245.2zm652.7 0v654c-.2 135.3 109.4 245.1 244.7 245.3 135.3-.1 244.9-109.9 244.8-245.2v-653.9c.2-135.3-109.4-245.1-244.7-245.3-135.4 0-244.9 109.8-244.8 245.1 0 0 0 .1 0 0" fill="#e01e5a"/>
      </g>
    </svg>
  );
}

function GitHubMark({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="#181717" className={className} aria-hidden>
      <path d="M12 .297c-6.63 0-12 5.373-12 12 0 5.303 3.438 9.8 8.205 11.385.6.113.82-.258.82-.577 0-.285-.01-1.04-.015-2.04-3.338.724-4.042-1.61-4.042-1.61C4.422 18.07 3.633 17.7 3.633 17.7c-1.087-.744.084-.729.084-.729 1.205.084 1.838 1.236 1.838 1.236 1.07 1.835 2.809 1.305 3.495.998.108-.776.417-1.305.76-1.605-2.665-.3-5.466-1.332-5.466-5.93 0-1.31.465-2.38 1.235-3.22-.135-.303-.54-1.523.105-3.176 0 0 1.005-.322 3.3 1.23.96-.267 1.98-.399 3-.405 1.02.006 2.04.138 3 .405 2.28-1.552 3.285-1.23 3.285-1.23.645 1.653.24 2.873.12 3.176.765.84 1.23 1.91 1.23 3.22 0 4.61-2.805 5.625-5.475 5.92.42.36.81 1.096.81 2.22 0 1.606-.015 2.896-.015 3.286 0 .315.21.69.825.57C20.565 22.092 24 17.592 24 12.297c0-6.627-5.373-12-12-12" />
    </svg>
  );
}

/* Zoom — official blue "Z" block mark */
function ZoomMark({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 256 256" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden className={className}>
      <path
        fill="#0B5CFF"
        d="M204.032 207.872H75.008c-8.448 0-16.64-4.608-20.48-12.032-4.608-8.704-2.816-19.2 4.096-26.112l89.856-89.856H83.968c-17.664 0-32-14.336-32-32h118.784c8.448 0 16.64 4.608 20.48 12.032 4.608 8.704 2.816 19.2-4.096 26.112l-89.6 90.112h74.496c17.664 0 32 14.08 32 31.744Z"
      />
    </svg>
  );
}

/* Confluence — double boomerang in Atlassian blue */
function ConfluenceMark({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 32 32" className={className} aria-hidden>
      <defs>
        <linearGradient id="conf-g1" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#0052CC" />
          <stop offset="100%" stopColor="#2684FF" />
        </linearGradient>
      </defs>
      <path
        d="M3.5 20.5C3.1 21.2 2.6 22 2.3 22.5c-.3.5-.1 1.1.4 1.4l5.3 3c.5.3 1.1.1 1.4-.4.4-.7 1.1-1.9 1.8-3C12.5 21.4 14.2 21 16 21c1.8 0 3.5.4 5 2.8.3.5.9.6 1.4.4l5.3-3c.5-.3.6-.9.3-1.4-.7-1.1-2.3-3.7-5.8-5.4-1.8-.9-3.6-.7-5.4 0C14.5 15 9 17.3 3.5 20.5z"
        fill="url(#conf-g1)"
      />
      <path
        d="M28.5 11.5C28.9 10.8 29.4 10 29.7 9.5c.3-.5.1-1.1-.4-1.4l-5.3-3c-.5-.3-1.1-.1-1.4.4-.4.7-1.1 1.9-1.8 3C19.5 10.6 17.8 11 16 11c-1.8 0-3.5-.4-5-2.8-.3-.5-.9-.6-1.4-.4l-5.3 3c-.5.3-.6.9-.3 1.4.7 1.1 2.3 3.7 5.8 5.4 1.8.9 3.6.7 5.4 0C17.5 17 23 14.7 28.5 11.5z"
        fill="url(#conf-g1)"
      />
    </svg>
  );
}

/* AWS — orange wordmark + smile arrow */
function AWSMark({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 40 24" className={className} aria-hidden>
      <text x="20" y="11" textAnchor="middle" dominantBaseline="middle"
        fontSize="13" fontWeight="800" fontFamily="'Arial Black',Arial,sans-serif"
        fill="#FF9900" letterSpacing="-0.5">aws</text>
      <path d="M6 19 Q20 25 34 19" fill="none" stroke="#FF9900" strokeWidth="2.2" strokeLinecap="round"/>
      <path d="M31 17 L34 19 L31 21" fill="none" stroke="#FF9900" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round"/>
    </svg>
  );
}

/* Okta — blue circle with white ring */
function OktaMark({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 32 32" className={className} aria-hidden>
      <circle cx="16" cy="16" r="16" fill="#007DC1" />
      <circle cx="16" cy="16" r="7.5" fill="none" stroke="white" strokeWidth="3.5" />
    </svg>
  );
}

/* GitLab — orange fox mark */
function GitLabMark({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 380 380" className={className} aria-hidden>
      <path
        d="M282.83 170.73l-.27-.69-26.14-68.22a6.81 6.81 0 0 0-2.58-3.03 7 7 0 0 0-8.5.59 7 7 0 0 0-2.13 3.46l-17.65 54H154.43l-17.65-54a6.86 6.86 0 0 0-2.13-3.46 7 7 0 0 0-8.5-.59 6.81 6.81 0 0 0-2.58 3.03L97.44 170l-.27.69a48.34 48.34 0 0 0 16 55.89l.09.07.24.17 39.54 29.61 19.56 14.82 11.93 9a8.07 8.07 0 0 0 9.9 0l11.93-9 19.56-14.82 39.84-29.78.1-.08a48.35 48.35 0 0 0 16.07-55.87z"
        fill="#FC6D26"
      />
    </svg>
  );
}

/* ---- Logo badge wrapper ------------------------------------------------ */

function LogoBadge({
  Mark,
  pad = "p-[5px]",
  size = "h-8 w-8",
}: {
  Mark: (props: { className?: string }) => React.JSX.Element;
  pad?: string;
  size?: string;
}) {
  return (
    <div
      className={`flex shrink-0 items-center justify-center overflow-hidden rounded-lg border border-ash bg-white ${size} ${pad}`}
      style={{ boxShadow: "0 1px 4px rgba(43,43,48,0.09), 0 0 0 1px rgba(95,99,106,0.06)" }}
    >
      <Mark className="h-full w-full" />
    </div>
  );
}

/* ---- Context demo (01) ------------------------------------------------- */

const CTX_SOURCES = [
  { Mark: SlackMark, pad: "p-[5px]", label: "Slack messages",   meta: "138 threads · decisions" },
  { Mark: ZoomMark,  pad: "p-[5px]", label: "Meetings",          meta: "This week · transcripts" },
  { Mark: GitHubMark,pad: "p-[4px]", label: "Codebase activity", meta: "PRs · code reviews"      },
] as const;

function ContextDemo({ reduce }: { reduce: boolean | null }) {
  return (
    <div className="flex h-full flex-col justify-between">
      <div className="space-y-2.5">
        {CTX_SOURCES.map((s, i) => (
          <motion.div
            key={s.label}
            className="flex items-center gap-3 rounded-xl border border-ash bg-white px-3.5 py-2.5"
            style={{ boxShadow: "0 1px 4px rgba(43,43,48,0.06)" }}
            initial={reduce ? false : { opacity: 0, x: -14 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.38, ease: EASE, delay: reduce ? 0 : 0.15 + i * 0.3 }}
          >
            <LogoBadge Mark={s.Mark} pad={s.pad} />
            <div className="flex-1 min-w-0">
              <p className="text-[13px] font-semibold text-coal-ink">{s.label}</p>
              <p className="text-[11px] text-slate-mid">{s.meta}</p>
            </div>
            <motion.div
              className="flex shrink-0 items-center gap-1 rounded-full bg-mint-pulse/10 px-2.5 py-1"
              initial={reduce ? false : { opacity: 0, scale: 0.75 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.25, ease: EASE, delay: reduce ? 0 : 0.38 + i * 0.3 }}
            >
              <CheckIcon className="h-3 w-3 text-mint-pulse" />
              <span className="text-[10px] font-semibold text-mint-pulse">Synced</span>
            </motion.div>
          </motion.div>
        ))}
      </div>

      {/* Context synced — white bg, no green tint */}
      <motion.div
        className="mt-4 rounded-xl border border-ash bg-white px-4 py-3"
        style={{ boxShadow: "0 1px 4px rgba(43,43,48,0.06)" }}
        initial={reduce ? false : { opacity: 0, y: 8 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4, ease: EASE, delay: reduce ? 0 : 0.15 + CTX_SOURCES.length * 0.3 + 0.2 }}
      >
        <div className="flex items-center gap-2">
          <CheckIcon className="h-3.5 w-3.5 text-mint-pulse" />
          <span className="text-[12px] font-semibold text-mint-pulse">Context synced</span>
        </div>
        <p className="mt-0.5 text-[11px] text-slate-mid">Ready in Claude Code before you ask</p>
      </motion.div>
    </div>
  );
}

/* ---- Knowledge demo (02) ----------------------------------------------- */

const KNOW_SOURCES = [
  { Mark: ConfluenceMark, pad: "p-[3px]", label: "Confluence" },
  { Mark: GitHubMark,     pad: "p-[4px]", label: "Codebase"   },
] as const;

function KnowledgeDemo({ reduce }: { reduce: boolean | null }) {
  return (
    <div className="space-y-4">
      {/* User query */}
      <motion.div
        className="ml-auto w-fit max-w-[80%] rounded-2xl rounded-tr-sm bg-coal-ink px-4 py-3 text-[14px] font-medium text-white"
        style={{ boxShadow: "0 2px 8px rgba(28,26,23,0.22)" }}
        initial={reduce ? false : { opacity: 0, y: 8 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4, ease: EASE, delay: reduce ? 0 : 0.1 }}
      >
        Who owns billing?
      </motion.div>

      {/* Source chips with logo + scan-fill */}
      <motion.div
        className="flex items-center gap-2.5 flex-wrap"
        initial={reduce ? false : { opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.2, delay: reduce ? 0 : 0.65 }}
      >
        <span className="text-[12px] text-slate-mid">Checking</span>
        {KNOW_SOURCES.map((s, i) => (
          <div
            key={s.label}
            className="relative flex items-center gap-2 overflow-hidden rounded-xl border border-ash bg-white px-3 py-2"
            style={{ boxShadow: "0 1px 4px rgba(43,43,48,0.08)" }}
          >
            <motion.span
              className="absolute inset-0 origin-left bg-signal-violet/6"
              initial={reduce ? false : { scaleX: 0 }}
              animate={{ scaleX: 1 }}
              transition={{ duration: 0.55, ease: "linear", delay: reduce ? 0 : 0.75 + i * 0.45 }}
            />
            <div className={`relative flex h-6 w-6 shrink-0 items-center justify-center ${s.pad}`}>
              <s.Mark className="h-full w-full" />
            </div>
            <span className="relative text-[13px] font-semibold text-graphite">{s.label}</span>
            <span className="relative text-[11px] font-bold text-signal-violet">[{i + 1}]</span>
          </div>
        ))}
      </motion.div>

      {/* Answer bubble */}
      <motion.div
        className="w-fit max-w-[92%] rounded-2xl rounded-tl-sm border border-ash bg-white px-4 py-3 text-[14px] leading-relaxed text-coal-ink"
        style={{ boxShadow: "0 1px 8px rgba(43,43,48,0.07)" }}
        initial={reduce ? false : { opacity: 0, y: 8 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.45, ease: EASE, delay: reduce ? 0 : 2.2 }}
      >
        Maria owns billing. She built that part, ping her in{" "}
        <span className="font-semibold">#payments</span>.{" "}
        <span className="text-[12px] font-semibold text-signal-violet">[1][2]</span>
      </motion.div>

      {/* Proposed action — Jarvis surfaces a next step, not just an answer */}
      <motion.div
        className="rounded-xl border border-ash bg-white px-4 py-3"
        style={{ boxShadow: "0 1px 6px rgba(43,43,48,0.07)" }}
        initial={reduce ? false : { opacity: 0, y: 8 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4, ease: EASE, delay: reduce ? 0 : 3.05 }}
      >
        <span className="text-[10px] font-semibold uppercase tracking-[0.08em] text-signal-violet">
          Proposed action
        </span>
        <p className="mt-1 text-[13px] font-semibold leading-snug text-coal-ink">
          Draft an intro to Maria in #payments
        </p>
        <div className="mt-1.5 flex items-center gap-1.5">
          <ConfluenceMark className="h-3.5 w-3.5 shrink-0" />
          <span className="text-[11px] text-slate-mid">Confluence · Billing ownership doc</span>
          <span className="text-[11px] font-bold text-signal-violet">[1]</span>
        </div>
        <div className="mt-2.5 flex items-center gap-2">
          <span className="flex items-center gap-1 rounded-full bg-coal-ink px-3 py-1 text-[11px] font-semibold text-white">
            <CheckIcon className="h-3 w-3" />
            Approve
          </span>
          <span className="rounded-full border border-ash px-3 py-1 text-[11px] font-medium text-coal-ink/70">
            Edit
          </span>
        </div>
      </motion.div>
    </div>
  );
}

/* ---- Access demo (03) -------------------------------------------------- */

const ACCESS_SYSTEMS = [
  { Mark: AWSMark,    pad: "p-[5px]", label: "AWS"    },
  { Mark: GitHubMark, pad: "p-[4px]", label: "GitHub" },
  { Mark: OktaMark,   pad: "p-[4px]", label: "Okta"   },
  { Mark: SlackMark,  pad: "p-[5px]", label: "Slack"  },
  { Mark: GitLabMark, pad: "p-[4px]", label: "GitLab" },
] as const;

function AccessDemo({ reduce }: { reduce: boolean | null }) {
  return (
    <div className="flex h-full flex-col gap-3">
      {/* Timeline strip */}
      <motion.div
        className="flex items-center gap-3 rounded-xl border border-ash bg-white px-3.5 py-2.5"
        style={{ boxShadow: "0 1px 4px rgba(43,43,48,0.06)" }}
        initial={reduce ? false : { opacity: 0, y: -6 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.35, ease: EASE, delay: reduce ? 0 : 0.1 }}
      >
        <span className="text-[11px] font-medium text-stone line-through">Typical: 1–3 weeks</span>
        <span className="text-fossil">→</span>
        <span className="flex items-center gap-1.5 text-[11px] font-semibold text-coal-ink">
          <span className="h-1.5 w-1.5 rounded-full bg-smolder" />
          Today
        </span>
      </motion.div>

      {/* Access rows with logos */}
      <div className="space-y-1.5">
        {ACCESS_SYSTEMS.map((s, i) => {
          const delay = 0.28 + i * 0.22;
          return (
            <motion.div
              key={s.label}
              className="flex items-center gap-3 rounded-xl border border-ash bg-white px-3.5 py-2"
              style={{ boxShadow: "0 1px 3px rgba(43,43,48,0.05)" }}
              initial={reduce ? false : { opacity: 0, x: -12 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.35, ease: EASE, delay: reduce ? 0 : delay }}
            >
              <LogoBadge Mark={s.Mark} pad={s.pad} size="h-6 w-6" />
              <span className="flex-1 text-[13px] font-medium text-coal-ink">{s.label}</span>
              <motion.div
                className="flex items-center gap-1 rounded-full bg-mint-pulse/10 px-2.5 py-0.5"
                initial={reduce ? false : { opacity: 0, scale: 0.7 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.22, ease: EASE, delay: reduce ? 0 : delay + 0.18 }}
              >
                <CheckIcon className="h-3 w-3 text-mint-pulse" />
                <span className="text-[10px] font-semibold text-mint-pulse">granted</span>
              </motion.div>
            </motion.div>
          );
        })}
      </div>

      {/* Stat line */}
      <motion.p
        className="mt-auto text-[12px] font-semibold text-coal-ink"
        initial={reduce ? false : { opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{
          duration: 0.4,
          delay: reduce ? 0 : 0.28 + ACCESS_SYSTEMS.length * 0.22 + 0.3,
        }}
      >
        5 systems · 0 tickets · 18 min
      </motion.p>
    </div>
  );
}

/* ---- Jobs -------------------------------------------------------------- */

const jobs = [
  {
    n: "01",
    icon: BrainIcon,
    lead: "Personal context",
    title: "Carries your context",
    status: "MCP · Building context",
    body: "Your Slack, meetings, and contacts travel with you. Connect your AI tools over MCP and they already know what you're working on.",
    Demo: ContextDemo,
  },
  {
    n: "02",
    icon: CompassIcon,
    lead: "Company knowledge",
    title: "Knows how your company works",
    status: "Answering · Proposing action",
    body: "Wired into Confluence and your stack, he knows the product, the code, and who owns what — so he can point you straight to the person who built it.",
    Demo: KnowledgeDemo,
  },
  {
    n: "03",
    icon: KeyIcon,
    lead: "Onboarding",
    title: "Productive from day one",
    status: "Onboarding @new-hire",
    body: "Jarvis provisions your access, answers your how-do-I questions, and surfaces the right contacts before you even have to ask.",
    Demo: AccessDemo,
  },
];

/* ---- Section ----------------------------------------------------------- */

export function FeatureShowcase() {
  const reduce = useReducedMotion();
  const [active, setActive] = React.useState(0);
  const ActiveDemo = jobs[active].Demo;

  return (
    <section id="features" className="scroll-mt-24 bg-background">
      <div className="mx-auto w-full max-w-6xl px-6 py-24 sm:py-32">
        <div className="grid items-center gap-12 lg:grid-cols-[0.92fr_1.08fr] lg:gap-16">

          {/* Left: heading + selectable job list */}
          <div>
            <h2 className="font-display text-3xl font-bold leading-[1.13] tracking-[-0.96px] text-coal-ink sm:text-4xl text-balance">
              One teammate, three jobs
            </h2>
            <p className="mt-4 max-w-md text-[15px] leading-relaxed tracking-[-0.15px] text-slate-mid text-pretty">
              He knows your company, carries your context, and gets you productive from day one.
            </p>

            {/* Job list — border-b on every item, not just last */}
            <div className="mt-10 flex flex-col border-t border-ash">
              {jobs.map((job, i) => {
                const isActive = i === active;
                return (
                  <button
                    key={job.n}
                    type="button"
                    onClick={() => setActive(i)}
                    aria-pressed={isActive}
                    className="group relative border-b border-ash py-5 text-left"
                  >
                    <div className="flex items-start gap-4">
                      <span
                        className={
                          "mt-0.5 flex h-8 w-8 shrink-0 items-center justify-center rounded-lg transition-colors " +
                          (isActive
                            ? "bg-coal-ink text-white"
                            : "bg-ash text-graphite group-hover:bg-coal-ink/8 group-hover:text-coal-ink")
                        }
                      >
                        <job.icon className="h-4 w-4" />
                      </span>
                      <div className="flex-1">
                        <p className="text-[10px] font-semibold uppercase tracking-[0.08em] text-graphite">
                          {job.lead}
                        </p>
                        <h3
                          className={
                            "mt-0.5 text-[17px] font-semibold tracking-[-0.2px] transition-colors " +
                            (isActive
                              ? "text-coal-ink"
                              : "text-slate-mid group-hover:text-coal-ink")
                          }
                        >
                          {job.title}
                        </h3>
                        {isActive ? (
                          <motion.p
                            className="mt-2 text-sm leading-relaxed tracking-[-0.14px] text-slate-mid"
                            initial={reduce ? false : { opacity: 0, y: -4 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.4, ease: EASE }}
                          >
                            {job.body}
                          </motion.p>
                        ) : null}
                      </div>
                    </div>

                    {/* Auto-advance progress line */}
                    {isActive && !reduce ? (
                      <motion.span
                        key={`progress-${active}`}
                        aria-hidden
                        className="absolute bottom-[-1px] left-0 h-px w-full origin-left bg-coal-ink"
                        initial={{ scaleX: 0 }}
                        animate={{ scaleX: 1 }}
                        transition={{ duration: CYCLE_MS / 1000, ease: "linear" }}
                        onAnimationComplete={() =>
                          setActive((a) => (a + 1) % jobs.length)
                        }
                      />
                    ) : null}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Right: live stage — gradient background */}
          <div
            className="relative flex h-[360px] flex-col overflow-hidden rounded-[20px] border border-white/60 sm:h-[420px]"
            style={{
              background: "linear-gradient(170deg, rgb(189, 216, 255) 0%, rgb(255, 234, 214) 100%)",
              boxShadow: "rgba(95,99,106,0.10) 0px 0px 0px 1px, rgba(43,43,48,0.12) 0px 4px 20px 0px",
            }}
          >
            {/* Static status bar — always mounted, text updates instantly */}
            <div className="flex shrink-0 items-center gap-2 border-b border-white/50 bg-white px-5 py-3">
              <span className="relative flex h-2 w-2">
                <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-mint-pulse/50" />
                <span className="relative inline-flex h-2 w-2 rounded-full bg-mint-pulse" />
              </span>
              <span className="text-[11px] font-semibold uppercase tracking-[0.08em] text-graphite">
                {jobs[active].status}
              </span>
            </div>

            {/* Animated demo content */}
            <div className="relative flex-1 overflow-hidden">
              <AnimatePresence mode="wait">
                <motion.div
                  key={active}
                  className="absolute inset-0 px-5 py-5"
                  initial={reduce ? false : { opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={reduce ? undefined : { opacity: 0, y: -10 }}
                  transition={{ duration: 0.35, ease: EASE }}
                >
                  <ActiveDemo reduce={reduce} />
                </motion.div>
              </AnimatePresence>
            </div>
          </div>

        </div>
      </div>
    </section>
  );
}
