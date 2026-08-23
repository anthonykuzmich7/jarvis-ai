"use client";

import * as React from "react";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import { BrandMark, type BrandName } from "@/components/brand-marks";

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

/** Renders the typed question with the leading @mention colored.

    Only colors when the text actually opens with the mention. It used to
    color the first `mention.length` characters unconditionally, which is
    invisible for the Slack demos (their questions all start with "@jarvis")
    but wrong everywhere else: a terminal prompt reading "what should I
    clarify with David before our 1:1?" came out with "what sh" — its first
    seven characters, the length of "@jarvis" — tinted accent. */
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
  const mentionLen = text.startsWith(mention) ? mention.length : 0;
  const typedMention = text.slice(0, Math.min(count, mentionLen));
  const typedRest = count > mentionLen ? text.slice(mentionLen, count) : "";
  return (
    <>
      {typedMention ? <span className={mentionClass}>{typedMention}</span> : null}
      {typedRest}
    </>
  );
}

/** Reveal phases shared by every demo window: the MCP tool call, its result,
    then the answer and its sources.

    `toolDelay` and `toolResultDelay` are optional and default to off, so a
    caller that passes no tool descriptor behaves exactly as before. */
export function useRevealPhases(
  questionDone: boolean,
  active: boolean,
  answerDelay = 650,
  sourcesDelay = 1250,
  toolDelay?: number,
  toolResultDelay?: number,
) {
  const reduce = useReducedMotion();
  const [answerVisible, setAnswerVisible] = React.useState(false);
  const [sourcesVisible, setSourcesVisible] = React.useState(false);
  const [toolVisible, setToolVisible] = React.useState(false);
  const [toolResultVisible, setToolResultVisible] = React.useState(false);

  React.useEffect(() => {
    if (!active || !questionDone) return;
    if (reduce) {
      setToolVisible(true);
      setToolResultVisible(true);
      setAnswerVisible(true);
      setSourcesVisible(true);
      return;
    }
    const timers = [
      setTimeout(() => setAnswerVisible(true), answerDelay),
      setTimeout(() => setSourcesVisible(true), sourcesDelay),
    ];
    if (toolDelay != null) {
      timers.push(setTimeout(() => setToolVisible(true), toolDelay));
    }
    if (toolResultDelay != null) {
      timers.push(setTimeout(() => setToolResultVisible(true), toolResultDelay));
    }
    return () => timers.forEach(clearTimeout);
  }, [
    questionDone,
    active,
    reduce,
    answerDelay,
    sourcesDelay,
    toolDelay,
    toolResultDelay,
  ]);

  return { answerVisible, sourcesVisible, toolVisible, toolResultVisible };
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

/** One MCP tool call, rendered the way Claude Code renders any other tool.
    Jarvis reaches Claude over MCP, so the retrieval step is a tool call and
    showing it is what makes the wiring legible rather than magical. */
export type ClaudeCodeTool = {
  /** Displayed as Claude Code displays an MCP tool: `server - tool`. */
  name: string;
  /** The call's arguments, rendered dim inside parentheses. */
  args: string;
  /** The `⎿` result line under the call. */
  result: string;
};

export type ClaudeCodeSource = {
  label: string;
  /** Real source mark. Preferred. */
  mark?: BrandName;
  /** Legacy emoji, for callers that predate `mark`. */
  icon?: string;
};

/** Just the prompt/thinking/answer/sources — no chrome. Safe to remount
    (via a `key` on the caller) without touching the terminal window
    around it. */
function ClaudeCodeContent({
  question,
  answer,
  sources,
  tool,
  active,
  startDelay,
  answerDelay,
  sourcesDelay,
  toolDelay,
  toolResultDelay,
}: {
  question: string;
  answer: React.ReactNode;
  sources: ClaudeCodeSource[];
  tool?: ClaudeCodeTool;
  active: boolean;
  startDelay: number;
  answerDelay: number;
  sourcesDelay: number;
  toolDelay?: number;
  toolResultDelay?: number;
}) {
  const { count, done } = useTypedQuestion(question, active, startDelay);
  const { answerVisible, sourcesVisible, toolVisible, toolResultVisible } =
    useRevealPhases(done, active, answerDelay, sourcesDelay, toolDelay, toolResultDelay);

  return (
    <>
      <div className="text-white/90">
        <span className="mr-2 select-none text-white/35">❯</span>
        <TypedMention text={question} count={count} mentionClass="text-signal-violet" />
        {!done && active && (
          <span aria-hidden className="cursor-blink select-none text-white/70">▍</span>
        )}
      </div>

      {/* Jarvis, not Claude, and not a bare "Thinking…".

          Claude is the surface you typed into, but the work in this beat is
          Jarvis searching the local store over MCP, which is the whole claim
          the page is making. Showing the Claude spark here credited the wrong
          party for the one thing Jarvis does.

          Three words, not a description of the mechanism. "Jarvis is searching
          your context" was tried and is worse: the sentence takes longer to
          read than the beat lasts, and the mark plus the name already say who
          is working. The source chips explain what it searched, a moment
          later, with evidence.

          The mark is `paper` tone because this is the terminal, the one dark
          surface on the page — the film inverts the mark inside `.hw-term` for
          exactly the same reason. */}
      {/* Claude Code thinking spinner — the Claude spark. It yields to the
          tool call the moment that lands, the way the real client does: you
          think, then you call something. */}
      {done && !toolVisible && !answerVisible && (
        <div className="mt-5 flex items-center gap-3 text-white/50" aria-hidden>
          <ClaudeSpark size={28} />
          <span>Thinking…</span>
        </div>
      )}

      {/* The MCP call. Same glyphs Claude Code uses for any tool: a filled
          dot for the call, `⎿` for what came back. */}
      {tool ? (
        <>
        <style>{`
          @keyframes cc-tool-pulse {
            0%, 100% { opacity: 1; }
            50%      { opacity: 0.28; }
          }
          .cc-tool-pulse { animation: cc-tool-pulse 1s ease-in-out infinite; }
          @media (prefers-reduced-motion: reduce) {
            .cc-tool-pulse { animation: none; opacity: 0.6; }
          }
        `}</style>
        <div
          className="mt-5"
          style={{
            opacity: toolVisible ? 1 : 0,
            transform: toolVisible ? "translateY(0)" : "translateY(6px)",
            transition:
              "opacity 380ms cubic-bezier(0.16,1,0.3,1), transform 380ms cubic-bezier(0.16,1,0.3,1)",
          }}
        >
          <div className="flex gap-2.5">
            {/* Grey, not mint. Mint is the marker on Claude's own reply below;
                a tool call is not the assistant speaking, and colouring both
                the same made the retrieval look like a second answer. It
                pulses only while the call is in flight, and settles the moment
                the `⎿` result lands, so the motion means "waiting on this"
                rather than decorating a finished line. */}
            <span
              className={
                "select-none text-white/45" +
                (toolResultVisible ? "" : " cc-tool-pulse")
              }
              aria-hidden
            >
              ⏺
            </span>
            <p className="text-white/85">
              {tool.name}
              <span className="text-white/40">({tool.args})</span>
            </p>
          </div>
          <div
            className="mt-1 flex gap-2 pl-[22px] text-white/40"
            style={{
              opacity: toolResultVisible ? 1 : 0,
              transition: "opacity 320ms cubic-bezier(0.16,1,0.3,1)",
            }}
          >
            <span className="select-none" aria-hidden>⎿</span>
            <span>{tool.result}</span>
          </div>
        </div>
        </>
      ) : null}

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
            {s.mark ? (
              <BrandMark name={s.mark} size={12} />
            ) : s.icon ? (
              <span aria-hidden>{s.icon}</span>
            ) : null}
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
  tool,
  active,
  startDelay = 600,
  answerDelay = 2800,
  sourcesDelay = 3450,
  toolDelay,
  toolResultDelay,
  minHeight = 248,
  height,
  mobileHeight,
  narrowHeight,
  contentKey,
}: {
  question: string;
  answer: React.ReactNode;
  sources: ClaudeCodeSource[];
  /** Omit for the plain question/answer shape. Supplying it adds the MCP
      tool-call beat between the spinner and the answer. */
  tool?: ClaudeCodeTool;
  active: boolean;
  startDelay?: number;
  answerDelay?: number;
  sourcesDelay?: number;
  toolDelay?: number;
  toolResultDelay?: number;
  /** Body min-height — lets short content sit in a tall card. */
  minHeight?: number;
  /** Body fixed height — use when swapping content in place (e.g. a
      rotating demo) so the card never resizes between variants. Takes
      precedence over minHeight when set. */
  height?: number;
  /** Body fixed height from 360px up to `sm`. The same answer needs
      roughly twice the lines in a 300px-wide column as it does in a
      600px one, so a single number clips the source chips off the
      bottom on a phone. Applied as a CSS variable rather than a
      measured breakpoint so the server and the client render the same
      markup. */
  mobileHeight?: number;
  /** Body fixed height below 360px, where the question, the tool call
      and the answer each pick up another line. Defaults to
      `mobileHeight`, so a caller that does not care can ignore it. */
  narrowHeight?: number;
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
        className={
          "relative overflow-hidden p-5 font-mono text-[12.5px] leading-[1.65] sm:p-6 sm:text-[13px] sm:leading-[1.7] " +
          (height
            ? "h-[var(--cc-h-xs)] min-[360px]:h-[var(--cc-h-sm)] sm:h-[var(--cc-h)]"
            : "min-h-[var(--cc-h-xs)] min-[360px]:min-h-[var(--cc-h-sm)] sm:min-h-[var(--cc-h)]")
        }
        style={
          {
            "--cc-h": `${height ?? minHeight}px`,
            "--cc-h-sm": `${mobileHeight ?? height ?? minHeight}px`,
            "--cc-h-xs": `${narrowHeight ?? mobileHeight ?? height ?? minHeight}px`,
          } as React.CSSProperties
        }
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
              tool={tool}
              active={active}
              startDelay={startDelay}
              answerDelay={answerDelay}
              sourcesDelay={sourcesDelay}
              toolDelay={toolDelay}
              toolResultDelay={toolResultDelay}
            />
          </motion.div>
        </AnimatePresence>
      </div>
    </div>
  );
}
