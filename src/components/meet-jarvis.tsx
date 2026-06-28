"use client";

import * as React from "react";
import { motion, useInView, useReducedMotion } from "framer-motion";
import { SlackIcon, UsersIcon, PlugIcon } from "@/components/icons";

/*
  "Meet Jarvis" — the bright arrival beat after the dark problem timeline.
  Visualizes the core metaphor from vision.md: one body you plug in once, that
  then shows up across three surfaces. A central Jarvis core radiates hairline
  wires to three surface nodes (Slack, a real account, MCP); pulses travel
  outward along the wires and a ring breathes from the core so it reads as a
  living presence, not a static diagram. Transform/opacity/pathLength only.
*/

const EASE = [0.16, 1, 0.3, 1] as const;

// Coordinates live in a 400x400 SVG space. Nodes form a triangle around the core.
const CORE = { x: 200, y: 200 };
const NODES = [
  {
    id: "slack",
    x: 200,
    y: 50,
    left: "50%",
    top: "12.5%",
    icon: SlackIcon,
    label: "As a Slack user",
    sub: "DM him like any teammate.",
  },
  {
    id: "account",
    x: 84,
    y: 330,
    left: "21%",
    top: "82.5%",
    icon: UsersIcon,
    label: "A real account",
    sub: "A member of your systems.",
  },
  {
    id: "mcp",
    x: 316,
    y: 330,
    left: "79%",
    top: "82.5%",
    icon: PlugIcon,
    label: "Over MCP",
    sub: "Inside tools like Claude Code.",
  },
] as const;

function JMark({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="none" aria-hidden className={className}>
      <path
        d="M12 6v7.5a2.5 2.5 0 1 1-2.5-2.5"
        stroke="currentColor"
        strokeWidth="1.9"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <circle cx="15.5" cy="8" r="1.3" fill="currentColor" />
    </svg>
  );
}

function ConnectedBody() {
  const stageRef = React.useRef<HTMLDivElement>(null);
  const inView = useInView(stageRef, { once: true, amount: 0.4 });
  const reduce = useReducedMotion();
  const on = inView || reduce;

  return (
    <div
      ref={stageRef}
      className="relative mx-auto aspect-square w-full max-w-[480px]"
    >
      {/* Soft glow giving the core presence on the white surface. */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 [background:radial-gradient(circle_at_50%_52%,rgba(0,0,0,0.07),transparent_62%)]"
      />

      <svg
        viewBox="0 0 400 400"
        className="absolute inset-0 h-full w-full overflow-visible"
      >
        {/* Concentric radar rings for depth. */}
        {[64, 116, 168].map((r) => (
          <circle
            key={r}
            cx={CORE.x}
            cy={CORE.y}
            r={r}
            fill="none"
            stroke="currentColor"
            className="text-foreground/[0.05]"
          />
        ))}

        {/* Breathing ring pulsing out of the core. */}
        {!reduce ? (
          <motion.circle
            cx={CORE.x}
            cy={CORE.y}
            r={46}
            fill="none"
            stroke="currentColor"
            strokeWidth={1.25}
            className="text-foreground/25"
            style={{ transformBox: "fill-box", transformOrigin: "center" }}
            initial={{ scale: 1, opacity: 0.5 }}
            animate={{ scale: [1, 2.2], opacity: [0.5, 0] }}
            transition={{ duration: 2.8, repeat: Infinity, ease: "easeOut" }}
          />
        ) : null}

        {/* Connection wires drawing out from the core on scroll. */}
        {NODES.map((n, i) => (
          <motion.line
            key={n.id}
            x1={CORE.x}
            y1={CORE.y}
            x2={n.x}
            y2={n.y}
            stroke="currentColor"
            strokeWidth={1.5}
            strokeLinecap="round"
            className="text-foreground/20"
            initial={reduce ? false : { pathLength: 0 }}
            animate={on ? { pathLength: 1 } : undefined}
            transition={{ duration: 0.9, ease: EASE, delay: 0.2 + i * 0.12 }}
          />
        ))}

        {/* Pulses traveling outward along each wire. */}
        {!reduce && inView
          ? NODES.map((n, i) => (
              <motion.circle
                key={n.id + "-pulse"}
                r={3.75}
                fill="currentColor"
                className="text-foreground"
                initial={{ cx: CORE.x, cy: CORE.y, opacity: 0 }}
                animate={{
                  cx: [CORE.x, n.x],
                  cy: [CORE.y, n.y],
                  opacity: [0, 1, 1, 0],
                }}
                transition={{
                  duration: 2,
                  repeat: Infinity,
                  ease: "easeInOut",
                  delay: 1.1 + i * 0.55,
                  repeatDelay: 0.6,
                }}
              />
            ))
          : null}
      </svg>

      {/* Core. */}
      <motion.div
        className="absolute left-1/2 flex h-[80px] w-[80px] -translate-x-1/2 -translate-y-1/2 items-center justify-center rounded-[24px] bg-pressed-charcoal text-white shadow-[rgba(4,69,144,0.12)_0px_24px_40px_4px] sm:h-[92px] sm:w-[92px] sm:rounded-[26px]"
        style={{ top: `${(CORE.y / 400) * 100}%` }}
        initial={reduce ? false : { scale: 0.55, opacity: 0 }}
        animate={on ? { scale: 1, opacity: 1 } : undefined}
        transition={{ duration: 0.7, ease: EASE, delay: 0.1 }}
      >
        <JMark className="h-11 w-11 sm:h-12 sm:w-12" />
        <span className="absolute -bottom-6 left-1/2 -translate-x-1/2 text-[10px] font-medium tracking-[-0.1px] text-fog sm:text-[11px]">
          Jarvis
        </span>
      </motion.div>

      {/* Surface nodes. */}
      {NODES.map((n, i) => (
        <motion.div
          key={n.id}
          className="absolute w-[126px] -translate-x-1/2 -translate-y-1/2 sm:w-[152px]"
          style={{ left: n.left, top: n.top }}
          initial={reduce ? false : { opacity: 0, scale: 0.82 }}
          animate={on ? { opacity: 1, scale: 1 } : undefined}
          transition={{ duration: 0.6, ease: EASE, delay: 0.7 + i * 0.13 }}
        >
          <motion.div
            whileHover={reduce ? undefined : { y: -3 }}
            transition={{ duration: 0.3, ease: EASE }}
            className="flex flex-col items-center gap-1.5 rounded-[32px] border border-stone/20 bg-paper-white/90 px-3 py-3.5 text-center shadow-[rgba(4,69,144,0.08)_0px_14px_20px_4px] backdrop-blur-sm sm:gap-2 sm:px-4 sm:py-4"
          >
            <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-foreground/5 text-foreground sm:h-10 sm:w-10">
              <n.icon className="h-[18px] w-[18px] sm:h-5 sm:w-5" />
            </span>
            <span className="text-[13px] font-semibold text-foreground sm:text-sm">
              {n.label}
            </span>
            <span className="text-[11px] leading-snug text-muted-foreground sm:text-xs">
              {n.sub}
            </span>
          </motion.div>
        </motion.div>
      ))}
    </div>
  );
}

export function MeetJarvis() {
  return (
    <section className="relative overflow-hidden bg-card">
      <div className="mx-auto max-w-6xl px-6 py-20 sm:py-28">
        <div className="mx-auto max-w-2xl text-center">
          <h2 className="font-display text-3xl font-medium leading-[1.2] tracking-[-0.64px] text-foreground sm:text-4xl text-balance">
            A teammate, not another chatbot
          </h2>
          <p className="mt-5 text-lg leading-[1.4] tracking-[-0.18px] text-muted-foreground text-pretty">
            Plug his body into your company once. The same Jarvis then shows up
            wherever your people already work, available instantly and already
            holding the context.
          </p>
        </div>

        <div className="mt-14 sm:mt-20">
          <ConnectedBody />
        </div>
      </div>
    </section>
  );
}
