"use client";

import * as React from "react";
import {
  motion,
  AnimatePresence,
  useReducedMotion,
} from "framer-motion";
import { ChecklistIcon, MicIcon, ArrowRightIcon } from "@/components/icons";

const EASE = [0.16, 1, 0.3, 1] as const;
const CYCLE_MS = 5200;

/* ---- Brand marks --------------------------------------------------------
   Source-app badges for the morning-briefing task rows. */

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

/* Gmail — official icon asset, same as jarvis-overlay-section.tsx */
function GmailMark({ className }: { className?: string }) {
  // eslint-disable-next-line @next/next/no-img-element
  return <img src="/Gmail_icon_(2020).svg.webp" className={`${className ?? ""} object-contain`} alt="" aria-hidden />;
}

/* Jarvis brand mark — exact circular logo used site-wide (page.tsx's JarvisFace) */
function JarvisMark({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 48 48" fill="none" aria-hidden className={className}>
      <circle cx="24" cy="24" r="24" fill="#0E1A43" />
      <ellipse cx="17.9609" cy="20.895" rx="3" ry="7" fill="#C5F4FF" />
      <ellipse cx="29.9609" cy="20.895" rx="3" ry="7" fill="#C5F4FF" />
    </svg>
  );
}

/* ---- Feature 1: Morning briefing mockup ----------------------------------
   Static light card — no fake window chrome. Task copy reuses the same
   fictional world (Acme, Dmitri, PR #212, SSO/Okta) established in
   struggles-section.tsx and orbit-sync-jarvis.tsx for continuity. */

const BRIEFING_TASKS = [
  {
    Mark: SlackMark,
    title: "Follow up with Acme before today's renewal call",
    meta: "#sales · 8:14am",
  },
  {
    Mark: GitHubMark,
    title: "Review PR #212 — Dmitri flagged a schema conflict",
    meta: "auth-service · this morning",
  },
  {
    Mark: GmailMark,
    title: "Confirm SSO timeline with Okta before the board update",
    meta: "Inbox · yesterday, 6:42pm",
  },
] as const;

const CARD_SHADOW = "rgba(95,99,106,0.10) 0px 0px 0px 1px, rgba(43,43,48,0.12) 0px 4px 20px 0px";

function BriefingDemo() {
  return (
    <div
      className="flex h-full w-full flex-col overflow-hidden rounded-[20px] border border-ash bg-white"
      style={{ boxShadow: CARD_SHADOW }}
    >
      {/* Header */}
      <div className="flex items-center gap-3 px-6 pt-6">
        <JarvisMark className="h-9 w-9 shrink-0" />
        <div>
          <p className="text-[16px] font-semibold leading-tight text-coal-ink">
            Here&rsquo;s your top 3 for today
          </p>
          <p className="text-[12px] text-slate-mid">Thursday, July 23</p>
        </div>
      </div>

      {/* Task rows — arrow affordance signals these are clickable */}
      <div className="mt-5 flex-1 space-y-2.5 px-6">
        {BRIEFING_TASKS.map((t) => (
          <div
            key={t.title}
            className="flex items-center gap-3 rounded-xl border border-ash bg-white px-3.5 py-3"
            style={{ boxShadow: "0 1px 4px rgba(43,43,48,0.06)" }}
          >
            <span className="flex h-8 w-8 shrink-0 items-center justify-center overflow-hidden rounded-md border border-ash bg-white p-[5px]">
              <t.Mark className="h-full w-full" />
            </span>
            <div className="min-w-0 flex-1">
              <p className="text-[13px] font-medium leading-snug text-coal-ink">{t.title}</p>
              <p className="mt-0.5 text-[11px] text-slate-mid">{t.meta}</p>
            </div>
            <ArrowRightIcon className="h-4 w-4 shrink-0 text-stone" />
          </div>
        ))}
      </div>

      {/* Footer stat */}
      <div className="px-6 pb-6 pt-3">
        <p className="text-[11px] font-medium text-slate-mid">
          3 priorities from 47 messages, 2 meetings
        </p>
      </div>
    </div>
  );
}

/* ---- Feature 2: Meeting overlay mockup ------------------------------------
   Static light card: an abstracted (non-branded) video-call surface with the
   same "Jarvis · status" pill already used in jarvis-overlay-section.tsx's
   OverlayPanel floating on top — same shape, relabeled for the
   meeting-listening use case. Uses the dark circular logo (not the light
   variant) since it now sits over a colored background rather than a plain
   white card. */

const CALL_TILES = [
  { initials: "A", bg: "#eef1fb", avatar: "#8b93d9" },
  { initials: "D", bg: "#eaf3f6", avatar: "#5fa8bf" },
  { initials: "M", bg: "#f6eef6", avatar: "#b98cc4" },
  { initials: "S", bg: "#f2f2ef", avatar: "#9a9a95" },
] as const;

function OverlayDemo() {
  return (
    <div
      className="relative flex h-full w-full items-center justify-center overflow-hidden rounded-[20px] border border-ash"
      style={{ boxShadow: CARD_SHADOW }}
    >
      {/* Abstracted call surface — generic tiles, not a literal Zoom recreation */}
      <div className="absolute inset-0 grid grid-cols-2 gap-2 bg-white p-4" aria-hidden>
        {CALL_TILES.map((t) => (
          <div key={t.initials} className="flex items-center justify-center rounded-xl" style={{ background: t.bg }}>
            <span
              className="flex h-11 w-11 items-center justify-center rounded-full text-[13px] font-semibold text-white"
              style={{ background: t.avatar }}
            >
              {t.initials}
            </span>
          </div>
        ))}
      </div>

      {/* Status pill — same design as the ⌘J overlay section, relabeled */}
      <div
        className="relative z-10 flex items-center overflow-hidden rounded-full border border-ash bg-white"
        style={{ boxShadow: "0 8px 30px rgba(43,43,48,0.16)" }}
      >
        <div className="flex shrink-0 items-center gap-2.5 border-r border-ash px-5 py-[11px]">
          <JarvisMark className="h-5 w-5" />
          <span className="text-[13px] font-semibold text-coal-ink">Jarvis</span>
        </div>
        <div className="flex h-[42px] items-center gap-2.5 px-5">
          <span className="flex h-5 w-5 shrink-0 items-center justify-center overflow-hidden rounded-[5px] border border-ash bg-white p-[3px]">
            <MicIcon className="h-full w-full text-graphite" />
          </span>
          <span className="whitespace-nowrap text-[13px] text-slate-mid">
            Listening to your meeting&hellip;
          </span>
          <span className="h-[6px] w-[6px] shrink-0 rounded-full bg-signal-violet" />
        </div>
      </div>
    </div>
  );
}

/* ---- Jobs -------------------------------------------------------------- */

const jobs = [
  {
    n: "01",
    icon: ChecklistIcon,
    lead: "Morning briefing",
    title: "Starts your day already prioritized",
    body: "Overnight, Jarvis reads what moved in Slack, your calendar, and your inbox — then hands you three things worth doing today. Not a summary of everything. Just what matters.",
    Demo: BriefingDemo,
  },
  {
    n: "02",
    icon: MicIcon,
    lead: "Meeting overlay",
    title: "Listens in every call, so you don't have to",
    body: "Turn it on before any Zoom, Meet, or call. Jarvis listens quietly in the background and hands you a clean summary and action items the moment you hang up.",
    Demo: OverlayDemo,
  },
] as const;

/* ---- Section ---------------------------------------------------------- */

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
              Everything becomes a to-do list.
            </h2>
            <p className="mt-4 max-w-md text-[15px] leading-relaxed tracking-[-0.15px] text-slate-mid text-pretty">
              Messages while you slept. Meetings while you&rsquo;re in them. Jarvis turns both
              into three things worth doing — not fifty things worth reading.
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

          {/* Right: static mockup — sits directly on the section background,
              no outer gradient frame. Only the switch between the two
              mockups crossfades; each mockup itself is a single static frame. */}
          <div className="relative h-[360px] sm:h-[420px]">
            <AnimatePresence mode="wait">
              <motion.div
                key={active}
                className="absolute inset-0"
                initial={reduce ? false : { opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={reduce ? undefined : { opacity: 0, y: -10 }}
                transition={{ duration: 0.35, ease: EASE }}
              >
                <ActiveDemo />
              </motion.div>
            </AnimatePresence>
          </div>

        </div>
      </div>
    </section>
  );
}
