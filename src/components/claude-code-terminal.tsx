"use client";

import * as React from "react";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";

const EASE = [0.16, 1, 0.3, 1] as const;

/* ─── Typed-question hook ───────────────────────────────────────
   Shared by every "@jarvis" demo window (Claude Code, Slack, ...). */

/** ms per character — exported so callers can predict typing duration
    (e.g. to time an auto-rotating sequence of demos). */
export const TYPE_SPEED_MS = 24;

export function useTypedQuestion(text: string, active: boolean, startDelay = 600) {
  const reduce = useReducedMotion();
  const [count, setCount] = React.useState(0);
  const done = count >= text.length;

  React.useEffect(() => {
    if (!active) return;
    if (reduce) {
      setCount(text.length);
      return;
    }
    setCount(0);
    const speed = TYPE_SPEED_MS;
    let interval: ReturnType<typeof setInterval> | undefined;
    const delay = setTimeout(() => {
      const start = performance.now();
      interval = setInterval(() => {
        const next = Math.min(
          Math.floor((performance.now() - start) / speed),
          text.length,
        );
        setCount(next);
        if (next >= text.length && interval) clearInterval(interval);
      }, speed);
    }, startDelay);
    return () => {
      clearTimeout(delay);
      if (interval) clearInterval(interval);
    };
  }, [active, text, reduce, startDelay]);

  return { count, done };
}

/** Renders the typed question with the leading @mention colored. */
export function TypedMention({
  text,
  count,
  mentionClass,
  mention = "@jarvis",
}: {
  text: string;
  count: number;
  mentionClass: string;
  mention?: string;
}) {
  const mentionLen = mention.length;
  const typedMention = text.slice(0, Math.min(count, mentionLen));
  const typedRest = count > mentionLen ? text.slice(mentionLen, count) : "";
  return (
    <>
      <span className={mentionClass}>{typedMention}</span>
      {typedRest}
    </>
  );
}

/** Reveal phases (answer, then sources) shared by every demo window. */
export function useRevealPhases(
  questionDone: boolean,
  active: boolean,
  answerDelay = 650,
  sourcesDelay = 1250,
) {
  const reduce = useReducedMotion();
  const [answerVisible, setAnswerVisible] = React.useState(false);
  const [sourcesVisible, setSourcesVisible] = React.useState(false);

  React.useEffect(() => {
    if (!active || !questionDone) return;
    if (reduce) {
      setAnswerVisible(true);
      setSourcesVisible(true);
      return;
    }
    const t1 = setTimeout(() => setAnswerVisible(true), answerDelay);
    const t2 = setTimeout(() => setSourcesVisible(true), sourcesDelay);
    return () => {
      clearTimeout(t1);
      clearTimeout(t2);
    };
  }, [questionDone, active, reduce, answerDelay, sourcesDelay]);

  return { answerVisible, sourcesVisible };
}

/* ─── Claude spark — Claude.com's own sprite animation (60ms/frame),
   extracted from claude.com and trimmed to 72 frames (star shapes removed). */
const SPARK_FRAMES = 72;

export function ClaudeSpark({ size = 28, className }: { size?: number; className?: string }) {
  return (
    <span
      aria-hidden
      className={"inline-block shrink-0 overflow-hidden " + (className ?? "")}
      style={{ width: size, height: size }}
    >
      <style>{`
        @keyframes cc-spark-spin {
          0% { transform: translateY(0); }
          to { transform: translateY(calc(-100% * 71 / 72)); }
        }
        .cc-spark-strip { animation: cc-spark-spin 4320ms steps(72, jump-none) infinite; }
        @media (prefers-reduced-motion: reduce) {
          .cc-spark-strip { animation: none; }
        }
      `}</style>
      <span
        className="cc-spark-strip block"
        style={{
          width: size,
          height: size * SPARK_FRAMES,
          background: "#D97757",
          maskImage: 'url("/claude-spark-strip.webp")',
          WebkitMaskImage: 'url("/claude-spark-strip.webp")',
          maskSize: "100% 100%",
          WebkitMaskSize: "100% 100%",
          transform: `translateY(${-100 * (4 / SPARK_FRAMES)}%)`,
        }}
      />
    </span>
  );
}

/* ─── Full terminal window ──────────────────────────────────────
   Reusable "@jarvis in Claude Code" demo: title bar, typed prompt,
   thinking spinner, answer, source chips. Drive it with any
   question/answer/sources to tell a different story per section. */

export type ClaudeCodeSource = { icon: string; label: string };

/** Just the prompt/thinking/answer/sources — no chrome. Safe to remount
    (via a `key` on the caller) without touching the terminal window
    around it. */
function ClaudeCodeContent({
  question,
  answer,
  sources,
  active,
  startDelay,
  answerDelay,
  sourcesDelay,
}: {
  question: string;
  answer: React.ReactNode;
  sources: ClaudeCodeSource[];
  active: boolean;
  startDelay: number;
  answerDelay: number;
  sourcesDelay: number;
}) {
  const { count, done } = useTypedQuestion(question, active, startDelay);
  const { answerVisible, sourcesVisible } = useRevealPhases(done, active, answerDelay, sourcesDelay);

  return (
    <>
      <div className="text-white/90">
        <span className="mr-2 select-none text-white/35">❯</span>
        <TypedMention text={question} count={count} mentionClass="text-signal-violet" />
        {!done && active && (
          <span aria-hidden className="cursor-blink select-none text-white/70">▍</span>
        )}
      </div>

      {/* Claude Code thinking spinner — the Claude spark */}
      {done && !answerVisible && (
        <div className="mt-5 flex items-center gap-3 text-white/50" aria-hidden>
          <ClaudeSpark size={28} />
          <span>Thinking…</span>
        </div>
      )}

      <div
        className="mt-5 flex gap-2.5 text-white/85"
        style={{
          opacity: answerVisible ? 1 : 0,
          transform: answerVisible ? "translateY(0)" : "translateY(8px)",
          transition: "opacity 420ms cubic-bezier(0.16,1,0.3,1), transform 420ms cubic-bezier(0.16,1,0.3,1)",
        }}
      >
        <span className="select-none text-mint-pulse" aria-hidden>⏺</span>
        <p>{answer}</p>
      </div>

      <div
        className="mt-5 flex flex-wrap gap-2 pl-[22px]"
        style={{
          opacity: sourcesVisible ? 1 : 0,
          transform: sourcesVisible ? "translateY(0)" : "translateY(6px)",
          transition: "opacity 380ms cubic-bezier(0.16,1,0.3,1), transform 380ms cubic-bezier(0.16,1,0.3,1)",
        }}
      >
        {sources.map((s) => (
          <span
            key={s.label}
            className="inline-flex items-center gap-1.5 rounded-md border border-white/10 bg-white/[0.06] px-2.5 py-1 text-[11px] tracking-[-0.1px] text-white/65"
          >
            <span aria-hidden>{s.icon}</span>
            {s.label}
          </span>
        ))}
      </div>
    </>
  );
}

export function ClaudeCodeTerminal({
  question,
  answer,
  sources,
  active,
  startDelay = 600,
  answerDelay = 2800,
  sourcesDelay = 3450,
  minHeight = 248,
  height,
  contentKey,
}: {
  question: string;
  answer: React.ReactNode;
  sources: ClaudeCodeSource[];
  active: boolean;
  startDelay?: number;
  answerDelay?: number;
  sourcesDelay?: number;
  /** Body min-height — lets short content sit in a tall card. */
  minHeight?: number;
  /** Body fixed height — use when swapping content in place (e.g. a
      rotating demo) so the card never resizes between variants. Takes
      precedence over minHeight when set. */
  height?: number;
  /** Identifies the current question/answer/sources set. Pass a value
      that changes (e.g. a rotating index) to crossfade to new content
      in place — the window chrome around it never remounts or flashes.
      Defaults to `question`, which is fine for a single static demo. */
  contentKey?: React.Key;
}) {
  const reduce = useReducedMotion();

  return (
    <div
      className="overflow-hidden rounded-[12px] bg-coal-ink"
      style={{ boxShadow: "rgba(95,99,106,0.12) 0px 0px 0px 1px, rgba(43,43,48,0.1) 0px 1px 4px 0px" }}
    >
      {/* Title bar — static, never remounts */}
      <div className="relative flex h-10 items-center border-b border-white/10 px-4">
        <div className="flex items-center gap-2" aria-hidden>
          <span className="h-3 w-3 rounded-full bg-[#ff5f57]" />
          <span className="h-3 w-3 rounded-full bg-[#febc2e]" />
          <span className="h-3 w-3 rounded-full bg-[#28c840]" />
        </div>
        <span className="absolute left-1/2 -translate-x-1/2 font-mono text-[11px] text-white/40">
          Claude Code
        </span>
      </div>

      {/* Terminal body — fixed-size, static container; only its content crossfades */}
      <div
        className="relative overflow-hidden p-6 font-mono text-[13px] leading-[1.7]"
        style={height ? { height } : { minHeight }}
      >
        <AnimatePresence mode="popLayout" initial={false}>
          <motion.div
            key={contentKey ?? question}
            initial={reduce ? false : { opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={reduce ? undefined : { opacity: 0, y: -8 }}
            transition={{ duration: 0.35, ease: EASE }}
          >
            <ClaudeCodeContent
              question={question}
              answer={answer}
              sources={sources}
              active={active}
              startDelay={startDelay}
              answerDelay={answerDelay}
              sourcesDelay={sourcesDelay}
            />
          </motion.div>
        </AnimatePresence>
      </div>
    </div>
  );
}
