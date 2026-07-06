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
  SlackIcon,
  ClockIcon,
  UsersIcon,
} from "@/components/icons";

/*
  "What it does" — an interactive "watch him work" showcase. The three jobs are
  a selectable, auto-advancing list; the stage on the right plays a bespoke
  monochrome demo for the active job (granting access, answering a who-owns-this
  question with sources, assembling your personal context into an AI tool).
  Interaction-driven to contrast the scroll-driven timeline and node diagram.
  Transform/opacity only; full reduced-motion fallback (no auto-advance).
*/

const EASE = [0.16, 1, 0.3, 1] as const;
const CYCLE_MS = 5200;

/* ---- Stage demos ------------------------------------------------------- */

function StageFrame({
  status,
  children,
}: {
  status: string;
  children: React.ReactNode;
}) {
  return (
    <div className="flex h-full flex-col">
      <div className="flex items-center gap-2 border-b border-ash bg-parchment/40 px-5 py-3">
        <span className="relative flex h-2 w-2">
          <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-mint-pulse/50" />
          <span className="relative inline-flex h-2 w-2 rounded-full bg-mint-pulse" />
        </span>
        <span className="text-[11px] font-medium tracking-[-0.1px] text-graphite">
          {status}
        </span>
      </div>
      <div className="flex-1 px-5 py-5">{children}</div>
    </div>
  );
}

function AccessDemo({ reduce }: { reduce: boolean | null }) {
  const systems = ["AWS", "GitHub", "Okta", "GitLab", "Slack"];
  return (
    <StageFrame status="onboarding @new-hire">
      <div className="space-y-2">
        {systems.map((s, i) => {
          const delay = 0.15 + i * 0.32;
          return (
            <motion.div
              key={s}
              className="flex items-center justify-between rounded-lg border border-border bg-background px-3.5 py-2.5"
              initial={reduce ? false : { opacity: 0, x: -12 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.4, ease: EASE, delay: reduce ? 0 : delay }}
            >
              <span className="text-sm font-medium text-foreground">{s}</span>
              <motion.span
                className="inline-flex items-center gap-1.5 font-mono text-[11px] font-medium uppercase tracking-wider text-foreground"
                initial={reduce ? false : { opacity: 0, scale: 0.7 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{
                  duration: 0.3,
                  ease: EASE,
                  delay: reduce ? 0 : delay + 0.28,
                }}
              >
                <CheckIcon className="h-3.5 w-3.5" />
                granted
              </motion.span>
            </motion.div>
          );
        })}
      </div>
    </StageFrame>
  );
}

function KnowledgeDemo({ reduce }: { reduce: boolean | null }) {
  return (
    <StageFrame status="answering · cited">
      <div className="space-y-3">
        <motion.div
          className="ml-auto w-fit max-w-[80%] rounded-2xl rounded-tr-sm bg-foreground px-3.5 py-2 text-sm text-background"
          initial={reduce ? false : { opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, ease: EASE, delay: reduce ? 0 : 0.1 }}
        >
          Who owns billing?
        </motion.div>

        <motion.div
          className="font-mono text-[11px] uppercase tracking-wider text-muted-foreground"
          initial={reduce ? false : { opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.3, delay: reduce ? 0 : 0.7 }}
        >
          checking confluence, code, people…
        </motion.div>

        <motion.div
          className="w-fit max-w-[88%] rounded-2xl rounded-tl-sm border border-border bg-background px-3.5 py-2.5 text-sm text-foreground"
          initial={reduce ? false : { opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.45, ease: EASE, delay: reduce ? 0 : 1.7 }}
        >
          Maria owns billing. She built that part, ping her in{" "}
          <span className="font-medium">#payments</span>.
        </motion.div>

        <motion.div
          className="flex flex-wrap gap-1.5"
          initial={reduce ? false : { opacity: 0, y: 6 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, ease: EASE, delay: reduce ? 0 : 2.1 }}
        >
          {["Confluence", "Codebase", "Org chart"].map((src) => (
            <span
              key={src}
              className="rounded-full border border-border bg-card px-2.5 py-1 font-mono text-[10px] uppercase tracking-wider text-muted-foreground"
            >
              {src}
            </span>
          ))}
        </motion.div>
      </div>
    </StageFrame>
  );
}

function ContextDemo({ reduce }: { reduce: boolean | null }) {
  const sources = [
    { icon: SlackIcon, label: "Slack threads" },
    { icon: ClockIcon, label: "Meetings · Meet, Zoom" },
    { icon: UsersIcon, label: "Contacts" },
  ];
  return (
    <StageFrame status="MCP · context sync">
      <div className="flex h-full flex-col justify-between gap-4">
        <div className="space-y-2">
          {sources.map((s, i) => (
            <motion.div
              key={s.label}
              className="flex items-center gap-3 rounded-lg border border-border bg-background px-3.5 py-2.5"
              initial={reduce ? false : { opacity: 0, x: 12 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{
                duration: 0.4,
                ease: EASE,
                delay: reduce ? 0 : 0.2 + i * 0.35,
              }}
            >
              <span className="flex h-7 w-7 items-center justify-center rounded-md bg-foreground/5 text-foreground">
                <s.icon className="h-4 w-4" />
              </span>
              <span className="text-sm font-medium text-foreground">
                {s.label}
              </span>
              <motion.span
                className="ml-auto"
                initial={reduce ? false : { opacity: 0, scale: 0.6 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{
                  duration: 0.3,
                  ease: EASE,
                  delay: reduce ? 0 : 0.45 + i * 0.35,
                }}
              >
                <CheckIcon className="h-4 w-4 text-foreground" />
              </motion.span>
            </motion.div>
          ))}
        </div>

        <motion.div
          className="flex items-center gap-2 rounded-lg bg-foreground px-3.5 py-3 text-background"
          initial={reduce ? false : { opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.45, ease: EASE, delay: reduce ? 0 : 1.5 }}
        >
          <CheckIcon className="h-4 w-4" />
          <span className="text-sm font-medium">
            Ready in Claude Code before you ask
          </span>
        </motion.div>
      </div>
    </StageFrame>
  );
}

/* ---- Jobs -------------------------------------------------------------- */

const jobs = [
  {
    n: "01",
    icon: KeyIcon,
    lead: "Onboarding & self-serve access",
    title: "Gets you in the door",
    body: "Jarvis grants the access a new hire needs himself, no IT specialist in the loop, and answers the how-do-I and who-do-I-ask questions from day one.",
    Demo: AccessDemo,
  },
  {
    n: "02",
    icon: CompassIcon,
    lead: "Company knowledge & context",
    title: "Knows how the company runs",
    body: "Wired into Confluence and your stack, he knows the product, the code, and who owns what, so he can point you straight to the person who built it.",
    Demo: KnowledgeDemo,
  },
  {
    n: "03",
    icon: BrainIcon,
    lead: "Your personal work context",
    title: "Carries your context",
    body: "Your Slack, meetings, and contacts travel with you. Connect your AI tools over MCP and they already know what you're working on.",
    Demo: ContextDemo,
  },
];

export function FeatureShowcase() {
  const reduce = useReducedMotion();
  const [active, setActive] = React.useState(0);
  const ActiveDemo = jobs[active].Demo;

  return (
    <section
      id="features"
      className="scroll-mt-24 bg-background"
    >
      <div className="mx-auto max-w-6xl px-6 py-20 sm:py-28">
        <div className="grid items-start gap-12 lg:grid-cols-[0.92fr_1.08fr] lg:gap-16">
          {/* Left: framing + selectable jobs. */}
          <div>
            <h2 className="font-display text-3xl font-medium leading-[1.2] tracking-[-0.64px] text-foreground sm:text-4xl text-balance">
              One teammate, three jobs
            </h2>
            <p className="mt-4 max-w-md text-lg leading-[1.4] tracking-[-0.18px] text-muted-foreground text-pretty">
              He gets people in the door, then keeps helping them do the work.
            </p>

            <div className="mt-10 flex flex-col">
              {jobs.map((job, i) => {
                const isActive = i === active;
                const tintColors = [
                  "bg-sky-blush/40 text-signal-violet",
                  "bg-deep-violet/10 text-deep-violet",
                  "bg-emerald-tag/15 text-mint-pulse",
                ];
                return (
                  <button
                    key={job.n}
                    type="button"
                    onClick={() => setActive(i)}
                    aria-pressed={isActive}
                    className="group relative border-t border-stone/15 py-5 text-left last:border-b"
                  >
                    <div className="flex items-baseline gap-4">
                      {/* Icon tile replaces numbered marker */}
                      <span
                        className={
                          "flex h-8 w-8 shrink-0 items-center justify-center rounded-2xl transition-colors " +
                          (isActive
                            ? tintColors[i]
                            : "bg-ash text-muted-foreground/50 group-hover:bg-sky-blush/30 group-hover:text-muted-foreground")
                        }
                      >
                        <job.icon className="h-4 w-4" />
                      </span>
                      <div className="flex-1">
                        <h3
                          className={
                            "text-lg font-medium tracking-[-0.18px] transition-colors sm:text-xl " +
                            (isActive
                              ? "text-foreground"
                              : "text-muted-foreground group-hover:text-foreground")
                          }
                        >
                          {job.title}
                        </h3>
                        {isActive ? (
                          <motion.p
                            className="mt-2 text-sm leading-relaxed tracking-[-0.14px] text-muted-foreground"
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

          {/* Right: the live stage. */}
          <div className="relative h-[360px] overflow-hidden rounded-[32px] border border-stone/20 bg-card shadow-[rgba(4,69,144,0.08)_0px_14px_20px_4px] sm:h-[400px]">
            <AnimatePresence mode="wait">
              <motion.div
                key={active}
                className="absolute inset-0"
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
    </section>
  );
}
