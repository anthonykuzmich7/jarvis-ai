"use client";

import * as React from "react";
import { useCallback, useEffect, useRef } from "react";
import { motion, useReducedMotion } from "framer-motion";

/*
  Context Hero — "Asked once."

  The headline is "Stop repeating yourself", so the visual makes repetition
  literal: every question a new hire asks sits as a stack of faded echoes of
  itself. A context lens tracks the cursor; inside it the echoes collapse into
  the one crisp chip and a hairline beam runs back to the lens.

  Replaces the previous ScrubHero, which gated first paint on a 19.9 MB 4K mp4
  and seeked it on every mousemove. This ships zero image bytes: all DOM plus a
  single rAF loop that writes transform/opacity straight to refs, so nothing
  here re-renders React on pointer move.
*/

const EASE = [0.16, 1, 0.3, 1] as const;

/* ─── Brand marks (real logos, trimmed to the ones the chips cite) ───── */

type MarkProps = { className?: string };

function SlackMark({ className }: MarkProps) {
  return (
    <svg viewBox="0 0 2447.6 2452.5" aria-hidden className={className}>
      <g clipRule="evenodd" fillRule="evenodd">
        <path d="m897.4 0c-135.3.1-244.8 109.9-244.7 245.2-.1 135.3 109.5 245.1 244.8 245.2h244.8v-245.1c.1-135.3-109.5-245.1-244.9-245.3.1 0 .1 0 0 0m0 654h-652.6c-135.3.1-244.9 109.9-244.8 245.2-.2 135.3 109.4 245.1 244.7 245.3h652.7c135.3-.1 244.9-109.9 244.8-245.2.1-135.4-109.5-245.2-244.8-245.3z" fill="#36c5f0" />
        <path d="m2447.6 899.2c.1-135.3-109.5-245.1-244.8-245.2-135.3.1-244.9 109.9-244.8 245.2v245.3h244.8c135.3-.1 244.9-109.9 244.8-245.3zm-652.7 0v-654c.1-135.2-109.4-245-244.7-245.2-135.3.1-244.9 109.9-244.8 245.2v654c-.2 135.3 109.4 245.1 244.7 245.3 135.3-.1 244.9-109.9 244.8-245.3z" fill="#2eb67d" />
        <path d="m1550.1 2452.5c135.3-.1 244.9-109.9 244.8-245.2.1-135.3-109.5-245.1-244.8-245.2h-244.8v245.2c-.1 135.2 109.5 245 244.8 245.2zm0-654.1h652.7c135.3-.1 244.9-109.9 244.8-245.2.2-135.3-109.4-245.1-244.7-245.3h-652.7c-135.3.1-244.9 109.9-244.8 245.2-.1 135.4 109.4 245.2 244.7 245.3z" fill="#ecb22e" />
        <path d="m0 1553.2c-.1 135.3 109.5 245.1 244.8 245.2 135.3-.1 244.9-109.9 244.8-245.2v-245.2h-244.8c-135.3.1-244.9 109.9-244.8 245.2zm652.7 0v654c-.2 135.3 109.4 245.1 244.7 245.3 135.3-.1 244.9-109.9 244.8-245.2v-653.9c.2-135.3-109.4-245.1-244.7-245.3-135.4 0-244.9 109.8-244.8 245.1 0 0 0 .1 0 0" fill="#e01e5a" />
      </g>
    </svg>
  );
}

function GitHubMark({ className }: MarkProps) {
  return (
    <svg viewBox="0 0 24 24" fill="#181717" aria-hidden className={className}>
      <path d="M12 .297c-6.63 0-12 5.373-12 12 0 5.303 3.438 9.8 8.205 11.385.6.113.82-.258.82-.577 0-.285-.01-1.04-.015-2.04-3.338.724-4.042-1.61-4.042-1.61C4.422 18.07 3.633 17.7 3.633 17.7c-1.087-.744.084-.729.084-.729 1.205.084 1.838 1.236 1.838 1.236 1.07 1.835 2.809 1.305 3.495.998.108-.776.417-1.305.76-1.605-2.665-.3-5.466-1.332-5.466-5.93 0-1.31.465-2.38 1.235-3.22-.135-.303-.54-1.523.105-3.176 0 0 1.005-.322 3.3 1.23.96-.267 1.98-.399 3-.405 1.02.006 2.04.138 3 .405 2.28-1.552 3.285-1.23 3.285-1.23.645 1.653.24 2.873.12 3.176.765.84 1.23 1.91 1.23 3.22 0 4.61-2.805 5.625-5.475 5.92.42.36.81 1.096.81 2.22 0 1.606-.015 2.896-.015 3.286 0 .315.21.69.825.57C20.565 22.092 24 17.592 24 12.297c0-6.627-5.373-12-12-12" />
    </svg>
  );
}

function JiraMark({ className }: MarkProps) {
  return (
    <svg viewBox="0 -30.632 255.324 285.956" aria-hidden className={className}>
      <defs>
        <linearGradient id="ch-jira-base">
          <stop offset=".18" stopColor="#0052cc" />
          <stop offset="1" stopColor="#2684ff" />
        </linearGradient>
        <linearGradient id="ch-jira-b" x1="98.031%" x2="58.888%" href="#ch-jira-base" y1=".161%" y2="40.766%" />
        <linearGradient id="ch-jira-c" x1="100.665%" x2="55.402%" href="#ch-jira-base" y1=".455%" y2="44.727%" />
      </defs>
      <path d="M244.658 0H121.707a55.502 55.502 0 0 0 55.502 55.502h22.649V77.37c.02 30.625 24.841 55.447 55.466 55.467V10.666C255.324 4.777 250.55 0 244.658 0z" fill="#2684ff" />
      <path d="M183.822 61.262H60.872c.019 30.625 24.84 55.447 55.466 55.467h22.649v21.938c.039 30.625 24.877 55.43 55.502 55.43V71.93c0-5.891-4.776-10.667-10.667-10.667z" fill="url(#ch-jira-b)" />
      <path d="M122.951 122.489H0c0 30.653 24.85 55.502 55.502 55.502h22.72v21.867c.02 30.597 24.798 55.408 55.396 55.466V133.156c0-5.891-4.776-10.667-10.667-10.667z" fill="url(#ch-jira-c)" />
    </svg>
  );
}

function NotionMark({ className }: MarkProps) {
  return (
    <svg viewBox="0 0 24 24" fill="none" aria-hidden className={className}>
      <rect width="24" height="24" rx="5" fill="#0F0F0F" />
      <path d="M8 16.5V7.5l8 9V7.5" stroke="#fff" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

function LinearMark({ className }: MarkProps) {
  return (
    <svg viewBox="0 0 100 100" fill="none" aria-hidden className={className}>
      <rect width="100" height="100" rx="22" fill="#5E6AD2" />
      <path d="M20 62.5 37.5 80A31 31 0 0 1 20 62.5ZM18.2 53.4 46.6 81.8a30.9 30.9 0 0 1-6.6-1.8L20 60.1a30.9 30.9 0 0 1-1.8-6.7ZM19.3 44.7l36 36a30.7 30.7 0 0 1-4.8 1.2L18.1 49.5a30.7 30.7 0 0 1 1.2-4.8ZM22.9 37.6 62.4 77a30.8 30.8 0 0 1-3.6 2L20.9 41.2a30.8 30.8 0 0 1 2-3.6ZM28 31.7l40.3 40.2a30.7 30.7 0 0 1-2.8 2.2L25.8 34.5a30.7 30.7 0 0 1 2.2-2.8ZM34.6 27.2l38.2 38.2a30.7 30.7 0 0 1-2.4 3L31.6 29.6a30.7 30.7 0 0 1 3-2.4ZM42.5 24.1l33.4 33.4a30.7 30.7 0 0 1-2 3.6L38.9 26.1a30.7 30.7 0 0 1 3.6-2ZM51.4 22.5l26.1 26.1a30.9 30.9 0 0 1-1.8 6.7L44.7 24.3a30.9 30.9 0 0 1 6.7-1.8ZM59.6 22A31 31 0 0 1 78 40.4L40.4 78A31 31 0 0 1 22 59.6L59.6 22Z" fill="#fff" />
    </svg>
  );
}

function ConfluenceMark({ className }: MarkProps) {
  return (
    <svg viewBox="0 0 32 32" fill="none" aria-hidden className={className}>
      <defs>
        <linearGradient id="ch-conf-a" x1="27.4" y1="25.5" x2="14.9" y2="18.3" gradientUnits="userSpaceOnUse">
          <stop offset=".18" stopColor="#0052CC" />
          <stop offset="1" stopColor="#2684FF" />
        </linearGradient>
        <linearGradient id="ch-conf-b" x1="4.6" y1="6.5" x2="17.1" y2="13.7" gradientUnits="userSpaceOnUse">
          <stop offset=".18" stopColor="#0052CC" />
          <stop offset="1" stopColor="#2684FF" />
        </linearGradient>
      </defs>
      <path fill="url(#ch-conf-a)" d="M4.7 23.6c-.3.5-.6 1-.9 1.4-.2.4-.1.9.3 1.2l5.9 3.6c.4.3 1 .1 1.2-.3.2-.4.5-.9.8-1.4 2.4-3.9 4.8-3.4 9.2-1.3l5.8 2.8c.4.2 1 0 1.2-.4l2.8-6.4c.2-.4 0-1-.4-1.2-1.2-.6-3.7-1.7-5.9-2.8-7.9-3.8-14.6-3.6-19 4z" />
      <path fill="url(#ch-conf-b)" d="M27.3 8.4c.3-.5.6-1 .9-1.4.2-.4.1-.9-.3-1.2L22 2.2c-.4-.3-1-.2-1.2.3-.2.4-.5.9-.8 1.4-2.4 3.9-4.8 3.4-9.2 1.3L5 2.3c-.4-.2-1 0-1.2.4L1 9.2c-.2.4 0 1 .4 1.2 1.2.6 3.7 1.7 5.9 2.8 8 3.8 14.7 3.5 19-4z" />
    </svg>
  );
}

/* ─── The questions, and where their stacks sit in the field ─────────── */

type Cluster = {
  id: string;
  text: string;
  Mark: (p: MarkProps) => React.ReactElement;
  left: number; // percent of field width
  top: number; // percent of field height
  phase: number; // drift phase offset, keeps the field from pulsing in unison
};

const CLUSTERS: Cluster[] = [
  { id: "staging", text: "Where is the staging env?", Mark: GitHubMark, left: 0, top: 1, phase: 0.0 },
  { id: "billing", text: "Who owns billing?", Mark: SlackMark, left: 43, top: 13, phase: 1.7 },
  { id: "access", text: "How do I get Jira access?", Mark: JiraMark, left: 4, top: 27, phase: 3.1 },
  { id: "deploy", text: "What is the deploy process?", Mark: GitHubMark, left: 45, top: 39, phase: 4.4 },
  { id: "doc", text: "Which doc is current?", Mark: NotionMark, left: 1, top: 51, phase: 2.2 },
  { id: "review", text: "Who reviews design specs?", Mark: LinearMark, left: 42, top: 63, phase: 5.3 },
  { id: "oncall", text: "Who is on call this week?", Mark: SlackMark, left: 6, top: 75, phase: 0.9 },
  { id: "runbook", text: "Where is the runbook?", Mark: ConfluenceMark, left: 44, top: 88, phase: 3.8 },
];

const ECHOES = 2; // faded copies stacked behind each primary chip
const LENS = 560; // px, diameter of the context lens
const RADIUS = 235; // px, how close the lens must get before a stack resolves

type ClusterNodes = {
  primary: HTMLDivElement | null;
  echoes: (HTMLDivElement | null)[];
  glow: HTMLDivElement | null;
  bar: HTMLDivElement | null;
  line: SVGLineElement | null;
};

export function ContextHero() {
  const reduce = useReducedMotion();

  const sectionRef = useRef<HTMLElement | null>(null);
  const fieldRef = useRef<HTMLDivElement | null>(null);
  const lensRef = useRef<HTMLDivElement | null>(null);

  const nodesRef = useRef<ClusterNodes[]>(
    CLUSTERS.map(() => ({ primary: null, echoes: [], glow: null, bar: null, line: null })),
  );
  // Cluster centres in field-local px. Recomputed on resize, never per frame,
  // so the loop below never triggers layout.
  const geomRef = useRef<{ cx: number; cy: number }[]>([]);
  const sizeRef = useRef({ w: 0, h: 0 });

  const pointerRef = useRef({ x: 0, y: 0 });
  const hasPointerRef = useRef(false);
  const rafRef = useRef<number | null>(null);

  const measure = useCallback(() => {
    const field = fieldRef.current;
    if (!field) return;
    sizeRef.current = { w: field.clientWidth, h: field.clientHeight };
    geomRef.current = nodesRef.current.map((n) => {
      const el = n.primary;
      if (!el) return { cx: 0, cy: 0 };
      const wrap = el.parentElement as HTMLElement | null;
      const ox = wrap ? wrap.offsetLeft : 0;
      const oy = wrap ? wrap.offsetTop : 0;
      return { cx: ox + el.offsetWidth / 2, cy: oy + el.offsetHeight / 2 };
    });
  }, []);

  useEffect(() => {
    const field = fieldRef.current;
    if (!field) return;

    measure();
    const ro = new ResizeObserver(measure);
    ro.observe(field);

    // Reduced motion: park every stack in its resolved state and skip the loop.
    if (reduce) {
      nodesRef.current.forEach((n) => {
        if (n.primary) {
          n.primary.style.opacity = "1";
          n.primary.style.transform = "translate3d(0,0,0)";
        }
        n.echoes.forEach((e) => {
          if (e) e.style.opacity = "0";
        });
        if (n.glow) {
          n.glow.style.opacity = "1";
          n.glow.style.transform = "translate3d(0,0,0)";
        }
        if (n.bar) n.bar.style.transform = "scaleY(1)";
        if (n.line) n.line.style.opacity = "0";
      });
      return () => ro.disconnect();
    }

    const onPointerMove = (e: PointerEvent) => {
      const rect = field.getBoundingClientRect();
      pointerRef.current = { x: e.clientX - rect.left, y: e.clientY - rect.top };
      hasPointerRef.current = true;
    };
    const onPointerLeave = () => {
      hasPointerRef.current = false;
    };

    const section = sectionRef.current;
    section?.addEventListener("pointermove", onPointerMove);
    section?.addEventListener("pointerleave", onPointerLeave);

    const start = performance.now();

    const frame = (now: number) => {
      const t = (now - start) / 1000;
      const { w, h } = sizeRef.current;

      // Before the pointer arrives (and after it leaves) the lens traces its
      // own path so the resolve mechanic demonstrates itself on load.
      let px: number;
      let py: number;
      if (hasPointerRef.current) {
        px = pointerRef.current.x;
        py = pointerRef.current.y;
      } else {
        px = w * (0.5 + 0.33 * Math.sin(t * 0.31));
        py = h * (0.5 + 0.34 * Math.sin(t * 0.21 + 1.2));
      }

      const lens = lensRef.current;
      if (lens) {
        lens.style.transform = `translate3d(${px - LENS / 2}px, ${py - LENS / 2}px, 0)`;
      }

      for (let i = 0; i < CLUSTERS.length; i++) {
        const n = nodesRef.current[i];
        const g = geomRef.current[i];
        if (!g) continue;

        const c = CLUSTERS[i];
        // Idle drift, unique phase per stack.
        const dx = Math.sin(t * 0.34 + c.phase) * 7;
        const dy = Math.cos(t * 0.27 + c.phase) * 5;

        const dist = Math.hypot(px - g.cx, py - g.cy);
        const raw = Math.max(0, 1 - dist / RADIUS);
        const k = raw * raw * (3 - 2 * raw); // smoothstep

        const primaryT = `translate3d(${dx}px, ${dy - 4 * k}px, 0) scale(${1 + 0.04 * k})`;
        if (n.primary) {
          n.primary.style.transform = primaryT;
          n.primary.style.opacity = `${0.5 + 0.5 * k}`;
        }
        if (n.glow) {
          n.glow.style.transform = primaryT;
          n.glow.style.opacity = `${k}`;
        }
        for (let j = 0; j < n.echoes.length; j++) {
          const el = n.echoes[j];
          if (!el) continue;
          const step = j + 1;
          const spread = 1 - k; // collapse into the primary as the lens closes in
          const ox = dx + step * 9 * spread;
          const oy = dy + step * 10 * spread;
          const rot = (step % 2 === 0 ? -1.4 : 1.7) * spread;
          el.style.transform = `translate3d(${ox}px, ${oy}px, 0) rotate(${rot}deg)`;
          el.style.opacity = `${(0.86 - step * 0.26) * spread}`;
        }
        if (n.bar) n.bar.style.transform = `scaleY(${k})`;
        if (n.line) {
          if (k > 0.02) {
            n.line.setAttribute("x1", `${px}`);
            n.line.setAttribute("y1", `${py}`);
            n.line.setAttribute("x2", `${g.cx + dx}`);
            n.line.setAttribute("y2", `${g.cy + dy}`);
            n.line.style.opacity = `${k * 0.6}`;
          } else {
            n.line.style.opacity = "0";
          }
        }
      }

      rafRef.current = requestAnimationFrame(frame);
    };

    rafRef.current = requestAnimationFrame(frame);

    return () => {
      ro.disconnect();
      section?.removeEventListener("pointermove", onPointerMove);
      section?.removeEventListener("pointerleave", onPointerLeave);
      if (rafRef.current) cancelAnimationFrame(rafRef.current);
    };
  }, [measure, reduce]);

  return (
    <section
      id="home"
      ref={sectionRef}
      className="relative min-h-[100dvh] w-full scroll-mt-16 overflow-hidden bg-ledger-white"
    >
      {/* Warm paper wash, keeps the field from floating on flat white. */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0"
        style={{
          background:
            "radial-gradient(120% 80% at 78% 32%, rgba(247,243,235,0.9) 0%, rgba(250,250,250,0) 62%)",
        }}
      />

      <div className="relative mx-auto grid min-h-[100dvh] max-w-[1400px] grid-cols-1 items-center gap-10 px-6 pt-24 pb-12 lg:grid-cols-12 lg:gap-8 lg:pb-16">
        {/* ── Copy ─────────────────────────────────────────────── */}
        <div className="relative z-20 lg:col-span-5">
          <motion.h1
            initial={reduce ? false : { opacity: 0, y: 22 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.85, ease: EASE }}
            className="font-display text-[46px] font-semibold leading-[1.0] tracking-[-0.03em] text-coal-ink lg:text-[54px] xl:text-[64px]"
          >
            Stop repeating yourself.
          </motion.h1>

          <motion.p
            initial={reduce ? false : { opacity: 0, y: 18 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.85, delay: 0.1, ease: EASE }}
            className="mt-6 max-w-[46ch] text-[17px] leading-[1.55] tracking-[-0.16px] text-slate-mid text-pretty"
          >
            To your AI, and to your team. Jarvis holds your context and hands it
            to whoever asks.
          </motion.p>

          <motion.div
            initial={reduce ? false : { opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.85, delay: 0.2, ease: EASE }}
            className="mt-9"
          >
            <a
              href="#waitlist"
              className="cta-shine relative inline-flex cursor-pointer items-center overflow-hidden whitespace-nowrap rounded-full bg-coal-ink px-7 py-3.5 text-sm font-semibold leading-none tracking-[-0.14px] text-white transition-colors hover:bg-graphite active:scale-[0.98]"
            >
              Get early access
            </a>
          </motion.div>
        </div>

        {/* ── The field ────────────────────────────────────────── */}
        <div className="relative z-10 lg:col-span-7">
          <div
            ref={fieldRef}
            aria-hidden
            className="relative h-[340px] w-full lg:h-[660px]"
          >
            {/* Context lens */}
            <div
              ref={lensRef}
              className="pointer-events-none absolute left-0 top-0 -z-10 rounded-full will-change-transform"
              style={{
                width: LENS,
                height: LENS,
                background:
                  "radial-gradient(circle at center, rgba(189,216,255,0.42) 0%, rgba(247,243,235,0.34) 40%, rgba(250,250,250,0) 68%)",
              }}
            />

            {/* Beams from the lens to whatever it has resolved */}
            <svg className="pointer-events-none absolute inset-0 h-full w-full overflow-visible">
              {CLUSTERS.map((c, i) => (
                <line
                  key={c.id}
                  ref={(el) => {
                    nodesRef.current[i].line = el;
                  }}
                  stroke="#ff6020"
                  strokeWidth="1.25"
                  strokeLinecap="round"
                  style={{ opacity: 0 }}
                />
              ))}
            </svg>

            {CLUSTERS.map((c, i) => {
              const Mark = c.Mark;
              return (
                <motion.div
                  key={c.id}
                  initial={reduce ? false : { opacity: 0, y: 24 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.9, delay: 0.25 + i * 0.07, ease: EASE }}
                  className="absolute"
                  style={{ left: `${c.left}%`, top: `${c.top}%` }}
                >
                  {/* Echoes are blank silhouettes of the primary, never repeated
                      text. Overlapping legible copies read as a smear; a stack of
                      identical cards reads as "asked over and over" at a glance. */}
                  {Array.from({ length: ECHOES }).map((_, j) => (
                    <div
                      key={j}
                      ref={(el) => {
                        nodesRef.current[i].echoes[j] = el;
                      }}
                      aria-hidden
                      className="absolute inset-0 rounded-[10px] bg-white will-change-transform"
                      style={{
                        opacity: 0,
                        border: "1px solid rgba(28,26,23,0.085)",
                        boxShadow: "0 1px 3px rgba(28,26,23,0.05)",
                      }}
                    />
                  ))}

                  {/* Lit state, opacity driven by the lens so no shadow animates. */}
                  <div
                    ref={(el) => {
                      nodesRef.current[i].glow = el;
                    }}
                    aria-hidden
                    className="pointer-events-none absolute left-0 top-0 h-full w-full rounded-[10px] will-change-transform"
                    style={{
                      opacity: 0,
                      boxShadow:
                        "0 14px 40px -10px rgba(255,96,32,0.34), 0 2px 8px rgba(28,26,23,0.08)",
                    }}
                  />

                  <div
                    ref={(el) => {
                      nodesRef.current[i].primary = el;
                    }}
                    className="relative flex items-center gap-2.5 overflow-hidden whitespace-nowrap rounded-[10px] border border-ash bg-white px-4 py-3 will-change-transform"
                    style={{
                      opacity: 0.5,
                      boxShadow:
                        "0 1px 2px rgba(28,26,23,0.05), 0 10px 28px -14px rgba(28,26,23,0.35)",
                    }}
                  >
                    {/* Resolve rule, grows from the centre as the lens lands. */}
                    <div
                      ref={(el) => {
                        nodesRef.current[i].bar = el;
                      }}
                      className="absolute left-0 top-0 h-full w-[2.5px] bg-smolder will-change-transform"
                      style={{ transform: "scaleY(0)" }}
                    />
                    <Mark className="h-[19px] w-[19px] shrink-0" />
                    <span className="text-[14.5px] font-medium leading-none tracking-[-0.16px] text-coal-ink">
                      {c.text}
                    </span>
                  </div>
                </motion.div>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
}
