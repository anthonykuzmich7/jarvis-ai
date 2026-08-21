"use client";

import * as React from "react";
import { markBars, MARK_INK, MARK_PAPER } from "@/components/jarvis-mark";

/*
  The Jarvis demo film, as live DOM instead of an MP4.

  Same 22.5s edit as `public/jarvis-demo.mp4` (authored in HyperFrames over in
  jarvis-ai-core, `brag-output/`), rebuilt here so the type is real text at the
  device's own resolution instead of 720p H.264 — no banding on the flat fields,
  no 500 KB download, and it re-flows with the page.

  Two background styles, per the `theme` prop:

    paper  (default) — the film's ground IS the page. No card, no border, no
                       shadow: captions are coal ink on ledger white and only
                       the terminal is dark, which is already this site's demo
                       vocabulary (see `claude-code-terminal.tsx`). Nothing
                       flips the page theme mid-scroll.
    ink              — the film's native look from the macOS app: near-black
                       ground, one indigo. Use on a dark surface.

  Timing is the storyboard, verbatim. Everything is one 22.5s CSS cycle keyed
  off absolute seconds, so there is no JS clock to drift and no animation
  library — the scroll observer only toggles `animation-play-state`.
*/

const CYCLE = 22.5;

/** Absolute seconds → a keyframe percentage of the cycle. */
const p = (t: number) => `${((t / CYCLE) * 100).toFixed(4)}%`;

type Beat = {
  /** Element id, also the keyframe name. */
  id: string;
  /** When it arrives. */
  in: number;
  /** Arrival duration. */
  dur?: number;
  /** When it leaves. Omit to hold to the end of the cycle. */
  out?: number;
  outDur?: number;
  /** Transform it arrives from (and leaves back to, unless `exit` differs). */
  from?: string;
  /** Transform it rests at. */
  rest?: string;
  /** Transform it leaves to. */
  exit?: string;
  ease?: string;
};

/* Two easing families, assigned by meaning — ARRIVE for anything that arrives
   and stays, CONSUME for anything pulled in or departing. Same contract as the
   film. */
const ARRIVE = "cubic-bezier(0.16, 1, 0.3, 1)";
const CONSUME = "cubic-bezier(0.65, 0, 0.35, 1)";

const END_FADE = 21.9; // everything clears before the loop restarts

function keyframes(b: Beat): string {
  const dur = b.dur ?? 0.45;
  const outDur = b.outDur ?? 0.4;
  const from = b.from ?? "none";
  const rest = b.rest ?? "none";
  // Departing elements fade in place by default. Sliding back out along the
  // vector they arrived on reads as a rewind, not an exit.
  const exit = b.exit ?? rest;
  const out = b.out ?? END_FADE;
  const settled = b.in + dur;
  const gone = Math.min(out + outDur, CYCLE);

  return `@keyframes ${b.id} {
  0%, ${p(b.in)} { opacity: 0; transform: ${from}; }
  ${p(settled)}, ${p(out)} { opacity: 1; transform: ${rest}; }
  ${p(gone)}, 100% { opacity: 0; transform: ${exit}; }
}`;
}

function rule(b: Beat): string {
  return `#${b.id} { opacity: 0; animation: ${b.id} ${CYCLE}s ${b.ease ?? ARRIVE} infinite; }`;
}

/* ── The edit ──────────────────────────────────────────────────────────────
   Scene 1  0.00–4.39   Manual retrieval. / For a machine.
   Scene 2  4.39–8.19   the query types out, the reply comes back hedged
   Scene 3  8.19–13.11  HARD CUT — same window, same question, Jarvis answers
   Scene 4  13.11–17.47 pull back: sources → mark → agent, inside the machine
   Scene 5  17.47–22.50 the lockup
   ------------------------------------------------------------------------ */

const BEATS: Beat[] = [
  // ── Scene 1 ──
  { id: "d-win", in: 0.1, dur: 0.7, out: 17.47, outDur: 0.6, from: "translateY(18px)" },
  { id: "d-caret", in: 0.3, dur: 0.4, out: 4.39, outDur: 0.35 },
  { id: "d-f1", in: 1.09, dur: 0.42, out: 4.39, outDur: 0.35, from: "translateX(-760px)" },
  { id: "d-f2", in: 2.19, dur: 0.36, out: 4.39, outDur: 0.35, from: "translateX(-760px)" },
  { id: "d-f3", in: 2.73, dur: 0.3, out: 4.39, outDur: 0.35, from: "translateX(-760px)" },
  { id: "d-l1", in: 0.55, dur: 0.5, out: 4.39, outDur: 0.4, from: "translateY(20px)" },
  { id: "d-l2", in: 3.27, dur: 0.45, out: 4.39, outDur: 0.4, from: "translateY(20px)" },

  // ── Scene 2 ── the question line stays put all the way into scene 3.
  { id: "d-q", in: 4.5, dur: 0.3, out: 17.47, outDur: 0.6 },
  { id: "d-hedge", in: 6.35, dur: 0.35, out: 8.19, outDur: 0.02, from: "translateY(14px)" },
  { id: "d-l3", in: 6.9, dur: 0.3, out: 8.19, outDur: 0.02, from: "translateY(18px)" },

  // ── Scene 3 ── the hard cut. Nothing else moves: that is what makes it read.
  { id: "d-status", in: 8.74, dur: 0.34, out: 17.47, outDur: 0.6, from: "translateX(-14px)" },
  { id: "d-answer", in: 9.29, dur: 0.38, out: 17.47, outDur: 0.6, from: "translateY(14px)" },
  { id: "d-chip", in: 10.93, dur: 0.4, out: 17.47, outDur: 0.6, from: "translateY(22px) scale(0.94)" },
  { id: "d-l4", in: 11.46, dur: 0.32, out: 13.11, outDur: 0.3, from: "translateY(18px)" },

  // ── Scene 4 ──
  { id: "d-boundary", in: 13.11, dur: 0.7, out: 17.47, outDur: 0.6, ease: CONSUME },
  { id: "d-t1", in: 13.64, dur: 0.4, out: 17.47, outDur: 0.6, from: "translateX(-30px)" },
  { id: "d-t2", in: 14.2, dur: 0.4, out: 17.47, outDur: 0.6, from: "translateX(-30px)" },
  { id: "d-t3", in: 14.73, dur: 0.4, out: 17.47, outDur: 0.6, from: "translateX(-30px)" },
  { id: "d-l5", in: 15.29, dur: 0.35, out: 17.47, outDur: 0.5, from: "translateY(20px)" },

  // ── Scene 5 ──
  { id: "d-head", in: 18.02, dur: 0.5, out: END_FADE, outDur: 0.4, from: "translateY(22px)" },
  { id: "d-cmd", in: 19.66, dur: 0.42, out: END_FADE, outDur: 0.4, from: "translateY(16px)" },
  { id: "d-halo", in: 17.6, dur: 0.7, out: END_FADE, outDur: 0.4, ease: CONSUME },
];

/* One continuous draw: three feeds → the spine → the mark → the agent. */
const THREADS: { id: string; at: number; dur: number; axis: "x" | "y" }[] = [
  { id: "d-h1", at: 14.85, dur: 0.26, axis: "x" },
  { id: "d-h2", at: 14.88, dur: 0.26, axis: "x" },
  { id: "d-h3", at: 14.91, dur: 0.26, axis: "x" },
  { id: "d-v", at: 15.05, dur: 0.22, axis: "y" },
  { id: "d-h4", at: 15.12, dur: 0.2, axis: "x" },
  { id: "d-h5", at: 15.22, dur: 0.2, axis: "x" },
];

function threadCSS(t: { id: string; at: number; dur: number; axis: "x" | "y" }): string {
  const axis = t.axis === "x" ? "scaleX" : "scaleY";
  return `@keyframes ${t.id} {
  0%, ${p(t.at)} { opacity: 0; transform: ${axis}(0); }
  ${p(t.at + 0.06)} { opacity: 1; }
  ${p(t.at + t.dur)}, ${p(17.47)} { opacity: 1; transform: ${axis}(1); }
  ${p(18.07)}, 100% { opacity: 0; transform: ${axis}(1); }
}
#${t.id} { opacity: 0; animation: ${t.id} ${CYCLE}s ${CONSUME} infinite; }`;
}

/* The window is the carrier: it never cuts, it only pulls back. Scale 0.5 with
   a +452/+126 offset lands it exactly where scene 4 wants it. */
const WINDOW_MOVE = `@keyframes d-win-move {
  0%, ${p(13.11)} { transform: none; }
  ${p(13.71)}, 100% { transform: translate(452px, 126px) scale(0.5); }
}`;

/* The mark is the other carrier — one element that travels out of the diagram
   and becomes the lockup, rather than two marks cross-fading. */
const MARK_MOVE = `@keyframes d-mark {
  0%, ${p(13.3)} { opacity: 0; transform: translate(-42px, 191px) scale(0.72); }
  ${p(13.9)}, ${p(17.47)} { opacity: 1; transform: translate(-42px, 191px) scale(0.72); }
  ${p(18.07)}, ${p(END_FADE)} { opacity: 1; transform: none; }
  ${p(END_FADE + 0.4)}, 100% { opacity: 0; transform: none; }
}`;

/* The eye-bars are the entire character rig: blink once, then open wide and
   hold. Never below ~0.7 — the 24x12 pills go square and read as round dots,
   which is a different logo. */
const EYES = `@keyframes d-eyes {
  0%, ${p(18.3)} { transform: scaleY(1); }
  ${p(18.4)} { transform: scaleY(0.08); }
  ${p(18.56)}, ${p(19.1)} { transform: scaleY(1); }
  ${p(19.42)}, 100% { transform: scaleY(1.35); }
}`;

/* Typing: a mask the colour of the terminal slides right in 25 discrete steps.
   The wrap is exactly 25ch, so one step is exactly one character. */
const TYPING = `@keyframes d-type {
  0%, ${p(4.91)} { transform: translateX(0); }
  ${p(6.2)}, 100% { transform: translateX(100%); }
}
@keyframes d-type-caret {
  0%, ${p(4.91)} { opacity: 0; }
  ${p(4.95)}, ${p(6.28)} { opacity: 1; }
  ${p(6.48)}, 100% { opacity: 0; }
}`;

const QUERY = "why did we move off GRDB?"; // 25 characters — see .d-type-wrap

const SOURCES = [
  { id: "d-t1", src: "/logos/slack.png", label: "Slack", top: 350 },
  { id: "d-t2", src: "/logos/gmail.png", label: "Gmail", top: 502 },
  { id: "d-t3", src: "/logos/telegram.png", label: "Telegram", top: 654 },
];

export function ContextDemo({
  theme = "paper",
  className,
}: {
  /** `paper` puts the film on the page's own background. `ink` is the app's
      native near-black. */
  theme?: "paper" | "ink";
  className?: string;
}) {
  const stageRef = React.useRef<HTMLDivElement | null>(null);
  const [running, setRunning] = React.useState(false);

  // Only animate while it is actually on screen.
  React.useEffect(() => {
    const el = stageRef.current;
    if (!el) return;
    const io = new IntersectionObserver(
      (entries) => setRunning(entries[0]?.isIntersecting ?? false),
      { threshold: 0.25 },
    );
    io.observe(el);
    return () => io.disconnect();
  }, []);

  const b = markBars(100);
  const paper = theme === "paper";

  const css = [
    ...BEATS.map(keyframes),
    ...BEATS.map(rule),
    ...THREADS.map(threadCSS),
    WINDOW_MOVE,
    MARK_MOVE,
    EYES,
    TYPING,
  ].join("\n");

  return (
    <div
      ref={stageRef}
      className={`jd-stage ${paper ? "jd-paper" : "jd-ink"} ${className ?? ""}`}
      data-running={running ? "true" : "false"}
      role="img"
      aria-label="A coding agent is asked why the team moved off GRDB. Without Jarvis it answers with a hedge. With Jarvis connected it answers precisely and cites the Slack thread it came from — everything indexed on the user's own Mac."
    >
      <style>{`
${css}

.jd-stage {
  container-type: inline-size;
  position: relative;
  width: 100%;
  aspect-ratio: 16 / 9;
  overflow: hidden;
}
/* Authored at 1920x1080 and scaled to the container, so the composition is
   exact at any width and the type stays vector. */
.jd-film {
  position: absolute;
  top: 0;
  left: 0;
  width: 1920px;
  height: 1080px;
  transform: scale(calc(100cqw / 1920));
  transform-origin: top left;
}

.jd-paper {
  --jd-ground: transparent;      /* the page's own background shows through */
  --jd-text: #1c1a17;            /* Coal Ink */
  --jd-text-2: #5a5957;          /* Graphite */
  --jd-win: #1c1a17;
  --jd-win-line: rgba(255, 255, 255, 0.1);
  --jd-win-text: rgba(255, 255, 255, 0.9);
  --jd-win-text-2: rgba(255, 255, 255, 0.45);
  --jd-row: rgba(255, 255, 255, 0.05);
  --jd-bar: rgba(255, 255, 255, 0.16);
  --jd-bar-dim: rgba(255, 255, 255, 0.09);
  --jd-accent: #777eff;          /* Signal Violet */
  --jd-accent-text: #9ba0ff;
  --jd-accent-tint: rgba(119, 126, 255, 0.14);
  --jd-tile: #ffffff;
  --jd-tile-line: #f1f1f1;
  --jd-edge: rgba(28, 26, 23, 0.14);
  --jd-disc: ${MARK_INK};
  --jd-eye: ${MARK_PAPER};
}
.jd-ink {
  --jd-ground: #0a0a0b;
  --jd-text: #f4f4f5;
  --jd-text-2: #a1a1aa;
  --jd-win: #141416;
  --jd-win-line: rgba(255, 255, 255, 0.09);
  --jd-win-text: #f4f4f5;
  --jd-win-text-2: #a1a1aa;
  --jd-row: #1a1a1e;
  --jd-bar: #34343c;
  --jd-bar-dim: #292930;
  --jd-accent: #6366f1;
  --jd-accent-text: #818cf8;
  --jd-accent-tint: rgba(99, 102, 241, 0.16);
  --jd-tile: #141416;
  --jd-tile-line: rgba(255, 255, 255, 0.09);
  --jd-edge: rgba(255, 255, 255, 0.16);
  --jd-disc: ${MARK_PAPER};
  --jd-eye: ${MARK_INK};
}
.jd-stage { background: var(--jd-ground); }

/* Pause off-screen; the observer flips this. */
.jd-stage[data-running="false"] * { animation-play-state: paused !important; }

/* ── the terminal ── */
#d-win {
  position: absolute;
  left: 280px;
  top: 239px;
  width: 1360px;
  height: 396px;
  border-radius: 12px;
  background: var(--jd-win);
  overflow: hidden;
  box-shadow: rgba(95, 99, 106, 0.12) 0 0 0 1px, rgba(43, 43, 48, 0.1) 0 1px 4px 0;
}
#d-win-move {
  position: absolute;
  left: 0;
  top: 0;
  width: 1920px;
  height: 1080px;
  transform-origin: 960px 437px;
  animation: d-win-move ${CYCLE}s ${CONSUME} infinite;
}
.jd-bar {
  display: flex;
  align-items: center;
  height: 46px;
  padding: 0 18px;
  gap: 9px;
  border-bottom: 1px solid var(--jd-win-line);
  position: relative;
}
.jd-light { width: 13px; height: 13px; border-radius: 50%; }
.jd-title {
  position: absolute;
  left: 50%;
  transform: translateX(-50%);
  font-size: 19px;
  color: var(--jd-win-text-2);
}
/* Groups are absolutely stacked, not flowed: a faded-out flex child still
   occupies space, which would pile all three acts into one column. Act 1's
   caret and act 2/3's question share the same top slot because they are never
   on screen together — the question replaces the caret. */
.jd-body { position: relative; height: 350px; }
.jd-slot { position: absolute; left: 40px; right: 40px; }
.jd-slot--head { top: 34px; }
.jd-slot--reply { top: 103px; }
.jd-line { display: flex; align-items: baseline; gap: 14px; font-size: 34px; line-height: 1.25; color: var(--jd-win-text); }
.jd-prompt { color: var(--jd-win-text-2); }
.d-type-wrap { position: relative; display: inline-block; width: 25ch; white-space: pre; }
#d-type {
  position: absolute;
  left: 0; right: 0; top: -8px; bottom: -8px;
  background: var(--jd-win);
  animation: d-type ${CYCLE}s steps(25) infinite;
}
#d-type-caret {
  position: absolute; left: 0; top: 2px;
  width: 3px; height: 36px;
  background: var(--jd-win-text);
  opacity: 0;
  animation: d-type-caret ${CYCLE}s steps(1) infinite;
}

/* pasted fragments — identified by layout, not logos */
.jd-frag {
  display: flex; align-items: center; gap: 14px;
  height: 62px; padding: 0 18px;
  background: var(--jd-row);
  border: 1px solid var(--jd-win-line);
  border-radius: 8px;
}
.jd-avatar { flex: 0 0 auto; width: 30px; height: 30px; border-radius: 8px; background: var(--jd-bar); }
.jd-stack { display: flex; flex-direction: column; gap: 7px; width: 100%; }
.jd-b { height: 10px; border-radius: 3px; background: var(--jd-bar); }
.jd-b--dim { background: var(--jd-bar-dim); }
.jd-frags { display: flex; flex-direction: column; gap: 14px; }

.jd-reply { display: flex; flex-direction: column; gap: 16px; }
.jd-hedge { font-size: 29px; line-height: 1.35; color: var(--jd-win-text-2); }
.jd-hedge-bars { display: flex; flex-direction: column; gap: 13px; padding-top: 4px; }

.jd-status { display: flex; align-items: center; gap: 13px; }
.jd-dot { width: 15px; height: 15px; border-radius: 50%; background: var(--jd-accent); position: relative; }
.jd-dot::after {
  content: ""; position: absolute; left: 50%; top: 50%;
  width: 68px; height: 68px; margin: -34px 0 0 -34px; border-radius: 50%;
  background: radial-gradient(circle, var(--jd-accent-tint) 0%, transparent 70%);
}
.jd-status-label { font-size: 25px; letter-spacing: 0.05em; color: var(--jd-accent-text); }
.jd-answer { font-size: 30px; line-height: 1.35; color: var(--jd-win-text); }
.jd-chip {
  align-self: flex-start;
  display: inline-flex; align-items: center;
  padding: 12px 20px; border-radius: 8px;
  background: var(--jd-accent-tint);
  border: 1px solid var(--jd-accent);
  font-size: 24px; color: var(--jd-accent-text);
}

/* ── captions, on the page's own ground ── */
.jd-cap {
  position: absolute; left: 0; right: 0;
  text-align: center;
  font-size: 62px; font-weight: 600; letter-spacing: -0.02em;
  color: var(--jd-text);
}
.jd-cap--quiet { color: var(--jd-text-2); font-weight: 500; }

/* ── scene 4 ── */
#d-boundary {
  position: absolute; left: 62px; top: 62px; right: 62px; bottom: 62px;
  border: 1px solid var(--jd-edge);
  border-radius: 20px;
}
.jd-tile {
  position: absolute; left: 232px;
  width: 124px; height: 124px;
  display: grid; place-items: center;
  background: var(--jd-tile);
  border: 1px solid var(--jd-tile-line);
  border-radius: 18px;
}
.jd-tile img { width: 60px; height: 60px; object-fit: contain; }
.jd-thread { position: absolute; background: var(--jd-accent); border-radius: 1px; }

/* ── the mark ── */
#d-mark {
  position: absolute; left: 860px; top: 300px;
  width: 200px; height: 200px;
  transform-origin: top left;
  opacity: 0;
  animation: d-mark ${CYCLE}s ${ARRIVE} infinite;
}
#d-halo {
  position: absolute; left: 50%; top: 50%;
  width: 620px; height: 620px; margin: -310px 0 0 -310px;
  border-radius: 50%;
  background: radial-gradient(circle, var(--jd-accent-tint) 0%, transparent 62%);
}
.jd-eye { transform-box: fill-box; transform-origin: center; animation: d-eyes ${CYCLE}s ${ARRIVE} infinite; }

#d-head { top: 626px; font-size: 60px; }
#d-cmd { position: absolute; left: 0; right: 0; top: 792px; text-align: center; }
#d-cmd span {
  display: inline-block;
  padding: 16px 26px; border-radius: 10px;
  background: var(--jd-win);
  font-size: 25px; color: var(--jd-win-text-2);
}

/* Reduced motion: hold the payoff frame. No cycle, no movement. */
@media (prefers-reduced-motion: reduce) {
  .jd-stage * { animation: none !important; }
  .jd-stage .jd-rm-hide { display: none !important; }
  .jd-stage .jd-rm-show { opacity: 1 !important; transform: none !important; }
}
      `}</style>

      <div className="jd-film font-mono">
        {/* scene 4's machine boundary */}
        <div id="d-boundary" className="jd-rm-hide" />

        {/* ── sources ── */}
        {SOURCES.map((s) => (
          <div key={s.id} id={s.id} className="jd-tile jd-rm-hide" style={{ top: s.top }}>
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={s.src} alt={s.label} />
          </div>
        ))}

        {/* ── threads: tile → spine → mark → agent ── */}
        <div id="d-h1" className="jd-thread jd-rm-hide" style={{ left: 356, top: 411, width: 264, height: 2, transformOrigin: "left center" }} />
        <div id="d-h2" className="jd-thread jd-rm-hide" style={{ left: 356, top: 563, width: 264, height: 2, transformOrigin: "left center" }} />
        <div id="d-h3" className="jd-thread jd-rm-hide" style={{ left: 356, top: 715, width: 264, height: 2, transformOrigin: "left center" }} />
        <div id="d-v" className="jd-thread jd-rm-hide" style={{ left: 619, top: 411, width: 2, height: 306, transformOrigin: "center top" }} />
        <div id="d-h4" className="jd-thread jd-rm-hide" style={{ left: 620, top: 563, width: 198, height: 2, transformOrigin: "left center" }} />
        <div id="d-h5" className="jd-thread jd-rm-hide" style={{ left: 962, top: 563, width: 110, height: 2, transformOrigin: "left center" }} />

        {/* ── the terminal: one window, three acts ── */}
        <div id="d-win-move">
          <div id="d-win" className="jd-rm-show">
            <div className="jd-bar" aria-hidden>
              <span className="jd-light" style={{ background: "#ff5f57" }} />
              <span className="jd-light" style={{ background: "#febc2e" }} />
              <span className="jd-light" style={{ background: "#28c840" }} />
              <span className="jd-title">Claude Code</span>
            </div>

            <div className="jd-body">
              {/* scene 1: the caret and the pasted fragments */}
              <div id="d-caret" className="jd-slot jd-slot--head jd-rm-hide" style={{ fontSize: 30, color: "var(--jd-win-text-2)", lineHeight: 1 }}>
                &gt;
              </div>
              <div className="jd-frags jd-slot jd-rm-hide" style={{ top: 82 }}>
                <div id="d-f1" className="jd-frag">
                  <span className="jd-avatar" />
                  <span className="jd-stack">
                    <span className="jd-b" style={{ width: "32%" }} />
                    <span className="jd-b jd-b--dim" style={{ width: "76%" }} />
                  </span>
                </div>
                <div id="d-f2" className="jd-frag">
                  <span className="jd-stack">
                    <span className="jd-b" style={{ width: "54%" }} />
                    <span className="jd-b jd-b--dim" style={{ width: "88%" }} />
                  </span>
                </div>
                <div id="d-f3" className="jd-frag">
                  <span className="jd-stack">
                    <span className="jd-b jd-b--dim" style={{ width: "91%" }} />
                    <span className="jd-b jd-b--dim" style={{ width: "66%" }} />
                  </span>
                </div>
              </div>

              {/* scenes 2+3: the question, typed once, then answered twice */}
              <div id="d-q" className="jd-line jd-slot jd-slot--head jd-rm-show">
                <span className="jd-prompt">&gt;</span>
                <span className="d-type-wrap">
                  {QUERY}
                  <span id="d-type">
                    <span id="d-type-caret" />
                  </span>
                </span>
              </div>

              <div id="d-hedge" className="jd-reply jd-slot jd-slot--reply jd-rm-hide">
                <div className="jd-hedge">Based on the codebase, it&rsquo;s likely that&hellip;</div>
                <div className="jd-hedge-bars">
                  <span className="jd-b jd-b--dim" style={{ width: "78%" }} />
                  <span className="jd-b jd-b--dim" style={{ width: "64%" }} />
                  <span className="jd-b jd-b--dim" style={{ width: "41%" }} />
                </div>
              </div>

              <div className="jd-reply jd-slot jd-slot--reply">
                <div id="d-status" className="jd-status jd-rm-show">
                  <span className="jd-dot" />
                  <span className="jd-status-label">Jarvis &middot; local</span>
                </div>
                <div id="d-answer" className="jd-answer jd-rm-show">
                  libSQL &mdash; native vector KNN in the same file.
                </div>
                <div id="d-chip" className="jd-chip jd-rm-show">
                  &#8627; from @anton in #eng-decisions
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* ── the mark: one element, from the diagram into the lockup ── */}
        <div id="d-mark" className="jd-rm-hide">
          <div id="d-halo" />
          <svg viewBox="0 0 100 100" width="200" height="200" fill="none" aria-hidden style={{ display: "block", position: "relative" }}>
            <circle cx="50" cy="50" r="50" fill="var(--jd-disc)" />
            <rect className="jd-eye" x={50 + b.leftX} y={50 + b.y} width={b.w} height={b.h} rx={b.corner} fill="var(--jd-eye)" />
            <rect className="jd-eye" x={50 + b.rightX} y={50 + b.y} width={b.w} height={b.h} rx={b.corner} fill="var(--jd-eye)" />
          </svg>
        </div>

        {/* ── captions ── */}
        <div id="d-l1" className="jd-cap jd-cap--quiet jd-rm-hide font-display" style={{ top: 706 }}>
          Manual retrieval.
        </div>
        <div id="d-l2" className="jd-cap jd-rm-hide font-display" style={{ top: 796 }}>
          For a machine.
        </div>
        <div id="d-l3" className="jd-cap jd-rm-hide font-display" style={{ top: 767 }}>
          It&rsquo;s guessing.
        </div>
        <div id="d-l4" className="jd-cap jd-rm-show font-display" style={{ top: 767 }}>
          This one isn&rsquo;t.
        </div>
        <div id="d-l5" className="jd-cap jd-rm-hide font-display" style={{ top: 852, fontSize: 56 }}>
          Everything stays on your Mac.
        </div>

        {/* ── the lockup ── */}
        <div id="d-head" className="jd-cap jd-rm-hide font-display">
          Give your coding agent memory of your company.
        </div>
        <div id="d-cmd" className="jd-rm-hide">
          <span>claude mcp add --transport http jarvis http://127.0.0.1:8765/mcp</span>
        </div>
      </div>
    </div>
  );
}
