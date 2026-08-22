"use client";

import * as React from "react";
import { markBars, MARK_INK, MARK_PAPER } from "@/components/jarvis-mark";

/*
  "How Jarvis works", as live DOM instead of an MP4.

  Same 31.6s edit as the rendered films (authored in HyperFrames over in
  jarvis-ai-core, `brag-output-2026-08-21/`), rebuilt here so the type is real
  text at the device's own resolution — no banding on the flat fields, no
  2.5 MB download, and it re-flows with the page. Same reason `context-demo.tsx`
  exists; this is its sibling, and the two share a token contract exactly.

  The film is one scenario, not a feature tour: you were out for a week, and at
  11:00 you have a 1:1 with your manager. Context → answer → the meeting.

    Act 1  0.00–5.45   the week happens without you
    Act 2  5.06–12.40  it was all being read, on your Mac
    Act 3  12.30–20.75 one question, answered from the week, cited
    Act 4  20.65–30.47 11:00 — it records, briefs, and tells you what to settle
    Act 5  30.20–33.30 the lockup

  Two background styles, per the `theme` prop:

    paper  (default) — the film's ground IS the page. Coal ink on ledger white;
                       only the terminal is dark, which is already this site's
                       demo vocabulary. Nothing flips the page theme mid-scroll.
    ink              — the film's native look from the macOS app: near-black
                       ground, one indigo. Use on a dark surface.

  Every value on screen is real product material, lifted from
  `MeetingAssist/MeetingAssistContent.swift` in the app repo — the missed-week
  timeline, the meeting title, and the blocker David actually asks about.

  Timing is the storyboard, verbatim. Everything is one 31.6s CSS cycle keyed
  off absolute seconds, so there is no JS clock to drift and no animation
  library — the scroll observer only toggles `animation-play-state`.
*/

const CYCLE = 33.3;

/** Absolute seconds → a keyframe percentage of the cycle. */
const p = (t: number) => `${((t / CYCLE) * 100).toFixed(4)}%`;

/* Two easing families, assigned by meaning — ARRIVE for anything that arrives
   and stays, CONSUME for anything pulled in or departing. Same contract as the
   film. */
const ARRIVE = "cubic-bezier(0.16, 1, 0.3, 1)";
const CONSUME = "cubic-bezier(0.65, 0, 0.35, 1)";

const END_FADE = 32.9; // everything clears before the loop restarts

type Beat = {
  /** Element id, also the keyframe name. */
  id: string;
  in: number;
  dur?: number;
  out?: number;
  outDur?: number;
  from?: string;
  rest?: string;
  exit?: string;
  /** Resting opacity. Back-tier windows sit at 0.72 (contrast collapse). */
  op?: number;
  ease?: string;
};

function keyframes(b: Beat): string {
  const dur = b.dur ?? 0.45;
  const outDur = b.outDur ?? 0.4;
  const from = b.from ?? "none";
  const rest = b.rest ?? "none";
  // Departing elements fade in place by default. Sliding back out along the
  // vector they arrived on reads as a rewind, not an exit.
  const exit = b.exit ?? rest;
  const out = b.out ?? END_FADE;
  const op = b.op ?? 1;
  const settled = b.in + dur;
  const gone = Math.min(out + outDur, CYCLE);

  return `@keyframes ${b.id} {
  0%, ${p(b.in)} { opacity: 0; transform: ${from}; }
  ${p(settled)}, ${p(out)} { opacity: ${op}; transform: ${rest}; }
  ${p(gone)}, 100% { opacity: 0; transform: ${exit}; }
}`;
}

function rule(b: Beat): string {
  return `#${b.id} { opacity: 0; animation: ${b.id} ${CYCLE}s ${b.ease ?? ARRIVE} infinite; }`;
}

const S1_OUT = 5.06;
const S1_OUTDUR = 0.39;
const S2_OUT = 12.05;
const S2_OUTDUR = 0.35;
const S3_OUT = 20.4;
const S3_OUTDUR = 0.35;
const S4_OUT = 30.02;
const S4_OUTDUR = 0.45;

const s1 = (id: string, tin: number, extra: Partial<Beat> = {}): Beat => ({
  id, in: tin, out: S1_OUT, outDur: S1_OUTDUR, ...extra,
});
const s2 = (id: string, tin: number, extra: Partial<Beat> = {}): Beat => ({
  id, in: tin, out: S2_OUT, outDur: S2_OUTDUR, ...extra,
});
const s3 = (id: string, tin: number, extra: Partial<Beat> = {}): Beat => ({
  id, in: tin, out: S3_OUT, outDur: S3_OUTDUR, ...extra,
});
const s4 = (id: string, tin: number, extra: Partial<Beat> = {}): Beat => ({
  id, in: tin, out: S4_OUT, outDur: S4_OUTDUR, ...extra,
});

/* Twelve messages you are not reading, interleaved across all five windows so
   none of them sits visibly empty. On the beat grid (109.96 BPM) to 3.82, then
   sub-beat, so it piles up. */
const ROWS: [string, number][] = [
  ["w-r1", 0.56], ["w-r9", 1.09], ["w-r4", 1.64], ["w-r11", 2.19],
  ["w-r2", 2.73], ["w-r10", 3.27], ["w-r5", 3.82], ["w-r12", 4.1],
  ["w-r7", 4.39], ["w-r3", 4.66], ["w-r6", 4.82], ["w-r8", 4.98],
];

const SOURCES: [string, string, string][] = [
  ["w-t1", "Slack", "/logos/slack.png"],
  ["w-t2", "Gmail", "/logos/gmail.png"],
  ["w-t3", "Telegram", "/logos/telegram.png"],
  ["w-t4", "Meetings", "/logos/meetings.png"],
];

/* One continuous draw: four feeds -> the spine -> the mark, then out to the
   agent. They draw NEUTRAL and only ignite at 8.74 — the accent's force is
   proportional to the drought before it. */
const THREADS: { id: string; at: number; dur: number; axis: "x" | "y" }[] = [
  { id: "w-h1", at: 7.9, dur: 0.26, axis: "x" },
  { id: "w-h2", at: 7.94, dur: 0.26, axis: "x" },
  { id: "w-h3", at: 7.98, dur: 0.26, axis: "x" },
  { id: "w-h4", at: 8.02, dur: 0.26, axis: "x" },
  { id: "w-v", at: 8.2, dur: 0.24, axis: "y" },
  { id: "w-h5", at: 8.4, dur: 0.22, axis: "x" },
  { id: "w-h6", at: 9.83, dur: 0.46, axis: "x" },
];

function threadCSS(t: (typeof THREADS)[number]): string {
  const axis = t.axis === "x" ? "scaleX" : "scaleY";
  const gone = S2_OUT + S2_OUTDUR;
  return `@keyframes ${t.id} {
  0%, ${p(t.at)} { opacity: 0; transform: ${axis}(0); }
  ${p(t.at + 0.06)} { opacity: 1; }
  ${p(t.at + t.dur)}, ${p(S2_OUT)} { opacity: 1; transform: ${axis}(1); }
  ${p(gone)}, 100% { opacity: 0; transform: ${axis}(1); }
}
#${t.id} { opacity: 0; animation: ${t.id} ${CYCLE}s ${CONSUME} infinite, w-ignite ${CYCLE}s linear infinite; }`;
}

/* Light crosses the glass as it wakes. Transform and opacity ride separate
   animations so the pass can ease while the fade stays linear. */
const SHEEN = `@keyframes w-sheen-move {
  0%, ${p(8.7)} { transform: translateX(-120%); }
  ${p(9.85)}, 100% { transform: translateX(320%); }
}
@keyframes w-sheen-fade {
  0%, ${p(8.7)} { opacity: 0; }
  ${p(8.92)}, ${p(9.55)} { opacity: 1; }
  ${p(9.85)}, 100% { opacity: 0; }
}
#w-sheen {
  animation: w-sheen-move ${CYCLE}s cubic-bezier(0.45, 0, 0.55, 1) infinite,
             w-sheen-fade ${CYCLE}s linear infinite;
}`;

/* The first accent pixel in the film. */
const IGNITE = `@keyframes w-ignite {
  0%, ${p(8.74)} { background-color: var(--hw-bar); }
  ${p(9.08)}, 100% { background-color: var(--hw-accent); }
}`;

const BEATS: Beat[] = [
  // ── Act 1 — the week you missed ──
  s1("w-w2", 0, { dur: 0.7, op: 0.72, from: "translateY(16px)" }),
  s1("w-w1", 0.04, { dur: 0.7, op: 0.72, from: "translateY(16px)" }),
  s1("w-w3", 0.08, { dur: 0.7, op: 0.72, from: "translateY(16px)" }),
  s1("w-w4", 0.12, { dur: 0.7, from: "translateY(16px)" }),
  s1("w-w5", 0.16, { dur: 0.7, from: "translateY(16px)" }),
  ...ROWS.map(([id, t]) => s1(id, t, { dur: 0.34, from: "translateX(-22px)" })),
  ...([["w-b1", 2.19], ["w-b2", 2.73], ["w-b4", 3.27], ["w-b5", 3.82], ["w-b3", 4.39]] as [string, number][])
    .map(([id, t]) => s1(id, t, { dur: 0.3, from: "scale(0.6)" })),
  s1("w-wa", 1.64, { dur: 0.42, from: "translateY(26px)" }),
  s1("w-wb", 1.82, { dur: 0.42, from: "translateY(26px)" }),
  s1("w-wc", 2.0, { dur: 0.42, from: "translateY(26px)" }),
  // the last word is the payload: its own beat, out of a small overshoot
  s1("w-wd", 2.22, { dur: 0.5, from: "translateY(26px) scale(1.06)" }),
  s1("w-l2", 3.27, { dur: 0.45, from: "translateY(20px)" }),

  // ── Act 2 — it was all being read ──
  s2("w-boundary", 5.2, { dur: 0.6, ease: CONSUME }),
  s2("w-base", 5.28, { dur: 0.6, ease: CONSUME }),
  s2("w-t1", 6.0, { dur: 0.42, from: "translateX(-28px)" }),
  s2("w-t2", 6.56, { dur: 0.42, from: "translateX(-28px)" }),
  s2("w-t3", 7.09, { dur: 0.42, from: "translateX(-28px)" }),
  s2("w-t4", 7.64, { dur: 0.42, from: "translateX(-28px)" }),
  s2("w-mark2", 8.74, { dur: 0.5, from: "scale(0.9)" }),
  s2("w-halo2", 8.74, { dur: 0.6, op: 0.85, ease: CONSUME }),
  s2("w-l3", 9.29, { dur: 0.44, from: "translateY(20px)" }),
  s2("w-claude", 10.24, { dur: 0.42, from: "scale(0.86)" }),
  s2("w-claude-label", 10.62, { dur: 0.3 }),
  s2("w-l4", 10.37, { dur: 0.42, from: "translateY(18px)" }),

  // ── Act 3 — one question ──
  s3("w-term", 12.3, { dur: 0.42, from: "translateY(12px)" }),
  s3("w-mark3", 14.7, { dur: 0.34, from: "scale(0.85)" }),
  s3("w-live", 15.55, { dur: 0.32, from: "translateX(-12px)" }),
  s3("w-answer", 15.84, { dur: 0.38, from: "translateY(14px)" }),
  s3("w-chip", 17.47, { dur: 0.4, from: "translateY(20px) scale(0.94)" }),
  s3("w-l5", 18.02, { dur: 0.42, from: "translateY(20px)" }),

  // ── Act 4 — 11:00 ──
  { id: "w-l6", in: 21.28, dur: 0.4, out: 22.85, outDur: 0.3, from: "translateY(16px)" },
  s4("w-lbl-a", 23.3, { dur: 0.3 }),
  s4("w-m1", 23.46, { dur: 0.4, from: "translateX(24px)" }),
  s4("w-m2", 24.02, { dur: 0.4, from: "translateX(24px)" }),
  s4("w-m3", 24.56, { dur: 0.4, from: "translateX(24px)" }),
  // It is recording the call, and transcribing it as it goes.
  s4("w-tr1", 24.02, { dur: 0.36, from: "translateY(10px)" }),
  s4("w-tr2", 24.56, { dur: 0.36, from: "translateY(10px)" }),
  s4("w-div", 25.66, { dur: 0.35, ease: CONSUME }),
  s4("w-lbl-b", 25.8, { dur: 0.3 }),
  s4("w-c1", 26.2, { dur: 0.4, from: "translateX(20px)" }),
  s4("w-c2", 26.75, { dur: 0.4, from: "translateX(20px)" }),
  s4("w-c3", 27.29, { dur: 0.4, from: "translateX(20px)" }),
  s4("w-l9", 28.39, { dur: 0.44, from: "translateY(20px)" }),

  // ── Act 5 — the lockup ──
  { id: "w-mark5", in: 30.2, dur: 0.55, from: "scale(0.84)" },
  { id: "w-halo5", in: 30.2, dur: 0.6, op: 0.85, ease: CONSUME },
  { id: "w-l7", in: 30.7, dur: 0.42, from: "translateY(22px)" },
  { id: "w-l8", in: 31.45, dur: 0.38, from: "translateY(20px)" },
  { id: "w-wordmark", in: 32.05, dur: 0.4 },
];

/* The week ticking past, one label at a time in the same slot. */
const DATES: [string, string, number, number][] = [
  ["w-d1", "Aug 14", 0.4, 1.64],
  ["w-d2", "Aug 16", 1.64, 2.73],
  ["w-d3", "Aug 18", 2.73, 3.82],
  ["w-d4", "Aug 20", 3.82, 4.66],
  ["w-d5", "Aug 21", 4.66, S1_OUT],
];

function dateCSS([id, , tin, tout]: [string, string, number, number]): string {
  return `@keyframes ${id} {
  0%, ${p(tin)} { opacity: 0; }
  ${p(tin + 0.22)}, ${p(tout - 0.18)} { opacity: 1; }
  ${p(tout)}, 100% { opacity: 0; }
}
#${id} { opacity: 0; animation: ${id} ${CYCLE}s linear infinite; }`;
}

const TYPING = `@keyframes w-type {
  0%, ${p(13.11)} { transform: translateX(0); }
  ${p(14.53)}, 100% { transform: translateX(100%); }
}
@keyframes w-type-caret {
  0%, ${p(13.05)} { opacity: 0; }
  ${p(13.11)}, ${p(14.6)} { opacity: 1; }
  ${p(14.78)}, 100% { opacity: 0; }
}`;

const QUERY = "what did I miss on the payments bug?"; // 36 characters — see .hw-type-wrap

/* The call and the briefing step back so the climax is the only thing on
   screen. One question, alone, is the whole product. */
/* The call steps back at 26.20 so the briefing is the subject; the briefing
   itself never dims, because it is the thing being demonstrated. */
function panel(id: string, tin: number, from: string, restOpacity = 1): string {
  return `@keyframes ${id} {
  0%, ${p(tin)} { opacity: 0; transform: ${from}; }
  ${p(tin + 0.55)}, ${p(26.2)} { opacity: 1; transform: none; }
  ${p(26.8)}, ${p(S4_OUT)} { opacity: ${restOpacity}; transform: none; }
  ${p(S4_OUT + S4_OUTDUR)}, 100% { opacity: 0; transform: none; }
}
#${id} { opacity: 0; animation: ${id} ${CYCLE}s ${ARRIVE} infinite; }`;
}

const RAIL = `@keyframes w-rail {
  0%, ${p(23.3)} { opacity: 0; transform: scaleY(0); }
  ${p(23.8)}, ${p(S4_OUT)} { opacity: 1; transform: scaleY(1); }
  ${p(S4_OUT + S4_OUTDUR)}, 100% { opacity: 0; transform: scaleY(1); }
}
#w-rail { opacity: 0; animation: w-rail ${CYCLE}s ${CONSUME} infinite; }`;

/* It wakes, looks at what it just connected, then follows the thread out to
   the agent. Causal, not idle — every move is caused by something else on
   screen. Motion performs; it does not breathe. */
/* The clock moving is the proof it is recording. */
const REC = `@keyframes w-rt1 {
  0%, ${p(20.9)} { opacity: 0; }
  ${p(21.2)}, ${p(26.0)} { opacity: 1; }
  ${p(26.2)}, 100% { opacity: 0; }
}
@keyframes w-rt2 {
  0%, ${p(26.2)} { opacity: 0; }
  ${p(26.4)}, 100% { opacity: 1; }
}
#w-rt1 { opacity: 0; animation: w-rt1 ${CYCLE}s linear infinite; }
#w-rt2 { opacity: 0; animation: w-rt2 ${CYCLE}s linear infinite; }`;

const EYES2 = `@keyframes w-eyes2 {
  0%, ${p(9.15)} { transform: translateX(0) scaleY(1); }
  ${p(9.24)} { transform: translateX(0) scaleY(0.08); }
  ${p(9.4)}, ${p(9.5)} { transform: translateX(0) scaleY(1); }
  ${p(9.8)}, ${p(9.95)} { transform: translateX(-3.6px) scaleY(1); }
  ${p(10.35)}, ${p(10.9)} { transform: translateX(3.6px) scaleY(1); }
  ${p(11.24)}, 100% { transform: translateX(0) scaleY(1); }
}`;

/* Retrieval, performed: left, right, then it finds it and blinks. One track,
   because transform is one property. */
const EYES3 = `@keyframes w-eyes3 {
  0%, ${p(14.92)} { transform: translateX(0) scaleY(1); }
  ${p(15.16)} { transform: translateX(-3.6px) scaleY(1); }
  ${p(15.42)} { transform: translateX(3.6px) scaleY(1); }
  ${p(15.54)} { transform: translateX(0) scaleY(0.08); }
  ${p(15.68)}, 100% { transform: translateX(0) scaleY(1); }
}`;

/* The briefing notices you. One blink, nothing else. */
const EYES4 = `@keyframes w-eyes4 {
  0%, ${p(23.35)} { transform: scaleY(1); }
  ${p(23.44)} { transform: scaleY(0.08); }
  ${p(23.6)}, 100% { transform: scaleY(1); }
}`;

/* The eye-bars are the entire character rig: blink once, then open wide and
   hold. Never below ~0.7 — the 12x24 pills go square and read as round dots,
   which is a different logo. */
const EYES = `@keyframes w-eyes {
  0%, ${p(30.6)} { transform: scaleY(1); }
  ${p(30.72)} { transform: scaleY(0.08); }
  ${p(30.88)}, ${p(31.3)} { transform: scaleY(1); }
  ${p(31.6)}, 100% { transform: scaleY(1.35); }
}`;

/* Calendar is NOT in the app's `ContextSource.catalog`. Meetings is a real
   capability, has a real icon, and plants Act 4. */
/* Eight fragments, positioned clear of the headline's text extent. */
const GUTTER: { id: string; x: number; y: number; tint: string; t: number; rot: number; dx: number }[] = [
  { id: "w-g1", x: 96,   y: 512, tint: "#36c5f0", t: 1.9,  rot: 11,  dx: -26 },
  { id: "w-g2", x: 1672, y: 486, tint: "#ea4335", t: 2.19, rot: -13, dx: 22 },
  { id: "w-g3", x: 268,  y: 560, tint: "#2eb67d", t: 2.46, rot: -9,  dx: -18 },
  { id: "w-g4", x: 1500, y: 544, tint: "#4285f4", t: 2.73, rot: 12,  dx: 28 },
  { id: "w-g5", x: 60,   y: 636, tint: "#ecb22e", t: 3.0,  rot: -14, dx: -14 },
  { id: "w-g6", x: 1744, y: 620, tint: "#e01e5a", t: 3.27, rot: 10,  dx: 24 },
  { id: "w-g7", x: 320,  y: 700, tint: "#0ea5e9", t: 3.55, rot: 13,  dx: -22 },
  { id: "w-g8", x: 1560, y: 704, tint: "#fbbc04", t: 3.82, rot: -11, dx: 18 },
];

/* Transform and opacity ride separate animations so the fall can accelerate
   while the fade stays linear. */
function fragCSS(g: (typeof GUTTER)[number]): string {
  return `@keyframes ${g.id}-move {
  0%, ${p(g.t)} { transform: translate(0, 0) rotate(0deg); }
  ${p(g.t + 1.9)}, 100% { transform: translate(${g.dx}px, 470px) rotate(${g.rot}deg); }
}
@keyframes ${g.id}-fade {
  0%, ${p(g.t)} { opacity: 0; }
  ${p(g.t + 0.28)}, ${p(g.t + 1.0)} { opacity: 0.82; }
  ${p(g.t + 1.9)}, 100% { opacity: 0; }
}
#${g.id} {
  opacity: 0;
  animation: ${g.id}-move ${CYCLE}s cubic-bezier(0.4, 0, 1, 1) infinite,
             ${g.id}-fade ${CYCLE}s linear infinite;
}`;
}

/* The film's current: the pile drifts up while the dropped context falls down.
   Opposing vectors — it is getting away from you. */
const STACK = `@keyframes w-stack {
  0% { transform: translateY(0); }
  ${p(5.45)}, 100% { transform: translateY(-20px); }
}
#w-stack { animation: w-stack ${CYCLE}s linear infinite; }`;

type Win = {
  id: string; badge: string; count: string; title: string;
  icon: string; kind: "row" | "evt";
  box: { left: number; top: number; width: number; height: number };
  rows: [string, string, string, string][];
};

/* Act 1's five windows. Real app icons and brand-tinted avatars: the tools are
   alive and you are not. None of these colours is the brand accent — the
   drought that gives 8.74 its force runs untouched. */
const WINDOWS: Win[] = [
  { id: "w-w1", badge: "w-b1", count: "24", title: "Slack — #eng", icon: "/logos/slack.png", kind: "row",
    box: { left: 200, top: 128, width: 520, height: 356 },
    rows: [["w-r1", "42%", "78%", "#36c5f0"], ["w-r2", "58%", "66%", "#2eb67d"], ["w-r3", "35%", "88%", "#ecb22e"]] },
  { id: "w-w2", badge: "w-b2", count: "18", title: "Inbox", icon: "/logos/gmail.png", kind: "row",
    box: { left: 700, top: 100, width: 520, height: 356 },
    rows: [["w-r4", "66%", "84%", "#ea4335"], ["w-r5", "48%", "72%", "#4285f4"], ["w-r6", "61%", "55%", "#fbbc04"]] },
  { id: "w-w3", badge: "w-b3", count: "3", title: "Calendar", icon: "cal", kind: "evt",
    box: { left: 1200, top: 128, width: 520, height: 356 },
    rows: [["w-r7", "52%", "70%", "#4285f4"], ["w-r8", "44%", "62%", "#34a853"]] },
  { id: "w-w4", badge: "w-b4", count: "7", title: "Team status", icon: "doc", kind: "row",
    box: { left: 448, top: 262, width: 520, height: 262 },
    rows: [["w-r9", "70%", "90%", "#0ea5e9"], ["w-r10", "40%", "64%", "#14b8a6"]] },
  { id: "w-w5", badge: "w-b5", count: "12", title: "Slack — DMs", icon: "/logos/slack.png", kind: "row",
    box: { left: 952, top: 262, width: 520, height: 262 },
    rows: [["w-r11", "55%", "76%", "#e01e5a"], ["w-r12", "63%", "58%", "#2eb67d"]] },
];


/* What you have to settle before you hang up. Verbatim from
   MeetingAssistContent.blockers, in the app's own priority order. */
const CLARIFY: { id: string; text: string }[] = [
  { id: "w-c1", text: "Is the payments bug fixed?" },
  { id: "w-c2", text: "What\u2019s the real launch date?" },
  { id: "w-c3", text: "Did the team stay unblocked?" },
];

/* The week you were out. Verbatim from MeetingAssistContent.missed — the app's
   own timeline, headlines only (the detail lines do not fit the reading floor
   of a 1.8s hold). */
const MISSED: { id: string; date: string; node: string; head: string }[] = [
  { id: "w-m1", date: "Aug 18", node: "#f59e0b", head: "Checkout bug halted the release" },
  { id: "w-m2", date: "Aug 20", node: "#34d399", head: "Signup redesign is on staging" },
  { id: "w-m3", date: "Today", node: "var(--hw-accent)", head: "Launch date owed this week" },
];

/** The pause disc. Geometry comes from the shared `markBars`, so every mark on
    the site — hero, orbit, this film — is the same object. */
const MARK_BARS = markBars(100);

function Mark({ size, eyeClass }: { size: number; eyeClass?: string }) {
  const b = MARK_BARS;
  return (
    <svg viewBox="0 0 100 100" width={size} height={size} fill="none" aria-hidden>
      <circle cx="50" cy="50" r="50" fill="var(--hw-disc)" />
      <rect className={eyeClass} x={50 + b.leftX} y={50 + b.y} width={b.w} height={b.h} rx={b.corner} fill="var(--hw-eye)" />
      <rect className={eyeClass} x={50 + b.rightX} y={50 + b.y} width={b.w} height={b.h} rx={b.corner} fill="var(--hw-eye)" />
    </svg>
  );
}

export function HowJarvisWorks({
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
      { threshold: 0.2 },
    );
    io.observe(el);
    return () => io.disconnect();
  }, []);

  // The film is authored at 1920x1080 and scaled to the container with
  // `scale(calc(100cqw / 1920px))` — length/length division, which needs a
  // 2025-era engine. Older ones drop the declaration and the film renders at
  // 1:1 inside its box, so measure and scale directly there.
  React.useEffect(() => {
    const el = stageRef.current;
    if (!el) return;
    if (typeof CSS !== "undefined" && CSS.supports?.("transform", "scale(calc(100cqw / 1920px))")) return;
    const film = el.querySelector<HTMLElement>(".hw-film");
    if (!film) return;
    const ro = new ResizeObserver(() => {
      film.style.transform = `scale(${el.clientWidth / 1920})`;
    });
    ro.observe(el);
    return () => ro.disconnect();
  }, []);

  const paper = theme === "paper";

  const css = [
    ...BEATS.map(keyframes),
    ...BEATS.map(rule),
    ...DATES.map(dateCSS),
    ...GUTTER.map(fragCSS),
    STACK,
    ...THREADS.map(threadCSS),
    IGNITE,
    SHEEN,
    TYPING,
    RAIL,
    EYES,
    EYES2,
    EYES3,
    EYES4,
    REC,
    panel("w-call", 20.65, "translateY(14px)", 0.5),
    panel("w-island", 22.93, "translateX(300px)", 1),
  ].join("\n");

  return (
    <div
      ref={stageRef}
      className={`hw-stage ${paper ? "hw-paper" : "hw-ink"} ${className ?? ""}`}
      data-running={running ? "true" : "false"}
      role="img"
      aria-label="Work is spread across Slack, email, Telegram and your meetings, and nobody can hold all of it. Jarvis indexes every source on your Mac and hands the context to your coding agent, without any of it leaving the machine. You ask what you missed on the payments bug and it answers precisely, citing the thread. At 11:00 a 1:1 with your manager starts; Jarvis records and transcribes the call, and a briefing arrives on its own listing what happened while you were out and the three things you need to clarify before you hang up — starting with whether the payments bug is fixed."
    >
      <style>{`
${css}

.hw-stage {
  container-type: inline-size;
  position: relative;
  width: 100%;
  aspect-ratio: 16 / 9;
  overflow: hidden;
  background: var(--hw-ground);
}
.hw-stage[data-running="false"] * { animation-play-state: paused !important; }

/* Authored at 1920x1080 and scaled to the container, so the composition is
   exact at any width and the type stays vector. */
.hw-film {
  position: absolute;
  top: 0;
  left: 0;
  width: 1920px;
  height: 1080px;
  transform: scale(calc(100cqw / 1920px));
  transform-origin: top left;
  font-family: var(--font-inter), ui-sans-serif, system-ui, sans-serif;
}

/* ── tokens: copied from context-demo.tsx so both films are one object ── */
.hw-paper {
  --hw-ground: transparent;      /* the page's own background shows through */
  --hw-text: #1c1a17;            /* Coal Ink */
  --hw-text-2: #5a5957;          /* Graphite */
  --hw-surface: #ffffff;
  --hw-hairline: #f1f1f1;        /* Ash */
  --hw-hairline-strong: rgba(28, 26, 23, 0.16);
  --hw-bar: rgba(28, 26, 23, 0.28);
  --hw-bar-dim: rgba(28, 26, 23, 0.15);
  --hw-dot: rgba(28, 26, 23, 0.22);
  --hw-accent: #777eff;          /* Signal Violet */
  --hw-accent-text: #4f55d6;     /* darkened for AA on Ledger White */
  --hw-accent-tint: rgba(119, 126, 255, 0.14);
  --hw-win: #ffffff;
  --hw-win-line: #f1f1f1;
  --hw-win-text: #1c1a17;
  --hw-win-text-2: #5a5957;
  --hw-win-row: #fafafa;
  --hw-term: #1c1a17;            /* only the terminal is dark on paper */
  --hw-shadow: 0 10px 34px rgba(28, 26, 23, 0.07);
  --hw-sp-a: #4e63b0;            /* David — MeetingAssistContent.davidColor */
  --hw-sp-b: #3e7c7c;            /* You — MeetingAssistContent.youColor */
  --hw-shell: #e4e3e0;           /* aluminium on ledger white */
  --hw-shell-hi: #f3f2f0;        /* light catches the top edge */
  --hw-shell-lo: #d2d1ce;
  --hw-screen: #f4f5f7;          /* a cool display, not the warm page */
  --hw-screen-line: rgba(28, 26, 23, 0.09);
  --hw-sheen: rgba(119, 126, 255, 0.16);
  --hw-shell-line: rgba(28, 26, 23, 0.16);
  --hw-shell-shadow: 0 26px 60px rgba(28, 26, 23, 0.1);
  --hw-frag-shadow: 0 8px 22px rgba(28, 26, 23, 0.09);
  --hw-disc: ${MARK_INK};
  --hw-eye: ${MARK_PAPER};
}
.hw-ink {
  --hw-ground: #0a0a0b;          /* Theme.bg */
  --hw-text: #f4f4f5;
  --hw-text-2: #a1a1aa;
  --hw-surface: #141416;
  --hw-hairline: rgba(255, 255, 255, 0.09);
  --hw-hairline-strong: rgba(255, 255, 255, 0.16);
  --hw-bar: #34343c;
  --hw-bar-dim: #292930;
  --hw-dot: #3f3f46;
  --hw-accent: #6366f1;          /* Theme.accent */
  --hw-accent-text: #818cf8;
  --hw-accent-tint: rgba(99, 102, 241, 0.16);
  --hw-win: #141416;
  --hw-win-line: rgba(255, 255, 255, 0.09);
  --hw-win-text: #f4f4f5;
  --hw-win-text-2: #a1a1aa;
  --hw-win-row: #1a1a1e;
  --hw-term: #141416;
  --hw-shadow: none;
  --hw-sp-a: #93a6e8;            /* David — lifted for AA on the ink ground */
  --hw-sp-b: #79bcbc;            /* You */
  --hw-shell: #1f1f23;           /* the MacBook body */
  --hw-shell-hi: #2e2e35;        /* light catches the top edge */
  --hw-shell-lo: #131317;
  --hw-screen: #0d0d10;          /* the display is NOT the page ground */
  --hw-screen-line: rgba(255, 255, 255, 0.08);
  --hw-sheen: rgba(129, 140, 248, 0.13);
  --hw-shell-line: rgba(255, 255, 255, 0.14);
  --hw-shell-shadow: none;
  --hw-frag-shadow: none;
  --hw-disc: ${MARK_PAPER};
  --hw-eye: ${MARK_INK};
}
/* On paper the terminal stays dark, so its own ink flips back. */
.hw-paper #w-groove { background: #fafafa; }
.hw-paper .hw-term {
  --hw-disc: #fafafa;
  --hw-eye: #1c1a17;
  --hw-win-line: rgba(255, 255, 255, 0.1);
  --hw-win-text: rgba(255, 255, 255, 0.92);
  --hw-win-text-2: rgba(255, 255, 255, 0.5);
  --hw-bar: rgba(255, 255, 255, 0.18);
  --hw-bar-dim: rgba(255, 255, 255, 0.09);
  --hw-dot: rgba(255, 255, 255, 0.16);
  --hw-accent-text: #9ba0ff;
}

/* ── windows ── */
.hw-win {
  position: absolute;
  background: var(--hw-win);
  border: 1px solid var(--hw-win-line);
  border-radius: 12px;
  overflow: hidden;
  box-shadow: var(--hw-shadow);
}
.hw-bar {
  display: flex; align-items: center; gap: 8px;
  height: 34px; padding: 0 14px;
  border-bottom: 1px solid var(--hw-win-line);
}
.hw-light { width: 9px; height: 9px; border-radius: 50%; background: var(--hw-dot); }
.hw-wlogo { width: 19px; height: 19px; border-radius: 4px; object-fit: contain; flex: none; margin-left: 7px; }
.hw-title { margin-left: 7px; font-size: 15px; color: var(--hw-win-text-2); }
/* Unread piles up while you are not there. Red, not the brand accent — the
   accent drought runs until 8.74. */
.hw-badge {
  min-width: 26px; height: 21px; padding: 0 7px; border-radius: 11px;
  background: #ef4444; color: #ffffff; font-size: 13px; font-weight: 600;
  display: flex; align-items: center; justify-content: center;
  margin-left: auto;
}
.hw-body { padding: 16px 18px; display: flex; flex-direction: column; gap: 13px; }

.hw-row { display: flex; align-items: center; gap: 11px; }
.hw-avatar { width: 26px; height: 26px; border-radius: 50%; background: var(--hw-bar-dim); flex: none; }
.hw-spine { width: 4px; height: 34px; border-radius: 2px; background: var(--hw-bar); flex: none; }
.hw-stack { flex: 1; display: flex; flex-direction: column; gap: 6px; }
.hw-b { height: 8px; border-radius: 4px; background: var(--hw-bar); }
.hw-b--dim { background: var(--hw-bar-dim); }

/* Context falling out of the stack. Not decorative particles — these are
   message chips, tinted by the tool they fell out of, and they drop through the
   GUTTERS so they never cross the headline. */
.hw-frag {
  position: absolute; width: 196px; height: 40px;
  display: flex; align-items: center; gap: 12px; padding: 0 14px;
  background: var(--hw-win); border: 1px solid var(--hw-win-line);
  border-radius: 9px; box-shadow: var(--hw-frag-shadow);
  opacity: 0;
}
.hw-frag > i { width: 17px; height: 17px; border-radius: 50%; flex: none; }
.hw-frag > u { height: 7px; border-radius: 4px; background: var(--hw-bar); flex: 1; }

/* The headline lands a word at a time. */
.hw-cap--words { opacity: 1; }
.hw-cap .w { display: inline-block; opacity: 0; }

/* ── captions ── */
.hw-cap {
  position: absolute; left: 0; right: 0; text-align: center;
  font-size: 54px; font-weight: 600; letter-spacing: -0.022em;
  color: var(--hw-text);
}
.hw-cap--quiet { font-size: 36px; font-weight: 500; color: var(--hw-text-2); letter-spacing: -0.012em; }

/* ── act 1 chrome ── */
#w-date {
  position: absolute; top: 62px; right: 200px; width: 220px; text-align: right;
  font-family: var(--font-geist-mono), ui-monospace, monospace;
  font-size: 26px; letter-spacing: 0.06em; color: var(--hw-text-2);
}
#w-date > span { position: absolute; top: 0; right: 0; }

/* ── act 2 ── */
/* The machine has to read as a MacBook or "Nothing leaves your Mac" is just a
   caption over a rectangle. Shell + inset display + the notch. */
#w-boundary {
  position: absolute; left: 244px; top: 146px; width: 1432px; height: 648px;
  border-radius: 26px;
  background: linear-gradient(180deg, var(--hw-shell-hi) 0%, var(--hw-shell) 38%, var(--hw-shell-lo) 100%);
  border: 1px solid var(--hw-shell-line);
  box-shadow: var(--hw-shell-shadow);
}
/* The hairline light runs along the top of a milled edge. */
#w-edge {
  position: absolute; left: 26px; right: 26px; top: 1px; height: 1px;
  background: var(--hw-shell-hi); opacity: 0.9;
}
#w-screen {
  position: absolute; left: 15px; top: 15px; right: 15px; bottom: 23px;
  border-radius: 14px;
  background: var(--hw-screen);
  border: 1px solid var(--hw-screen-line);
  overflow: hidden;
}
/* One pass of light across the glass, on the ignite. Performed, not idle. */
#w-sheen {
  position: absolute; top: -30%; left: 0; width: 30%; height: 160%;
  background: linear-gradient(100deg, rgba(0, 0, 0, 0) 0%, var(--hw-sheen) 50%, rgba(0, 0, 0, 0) 100%);
  opacity: 0;
}
/* The notch. The single detail that says "MacBook". */
#w-notch {
  position: absolute; left: 50%; top: 15px; width: 208px; height: 28px;
  margin-left: -104px;
  background: var(--hw-shell);
  border: 1px solid var(--hw-shell-line); border-top: none;
  border-radius: 0 0 14px 14px;
}
/* The hinge seam along the bottom of the lid. */
#w-hinge {
  position: absolute; left: 50%; bottom: 8px; width: 132px; height: 5px;
  margin-left: -66px; border-radius: 3px; background: var(--hw-shell-line);
}
#w-base {
  position: absolute; left: 186px; top: 794px; width: 1548px; height: 22px;
  border-radius: 2px 2px 12px 12px;
  background: linear-gradient(180deg, var(--hw-shell-hi) 0%, var(--hw-shell) 55%, var(--hw-shell-lo) 100%);
  border: 1px solid var(--hw-shell-line); border-top: none;
  box-shadow: var(--hw-shell-shadow);
  /* A real front-on deck tapers: wider at the front than at the hinge. */
  clip-path: polygon(1.5% 0%, 98.5% 0%, 100% 100%, 0% 100%);
  overflow: hidden;
}
/* The finger groove on the front edge of the deck. */
#w-groove {
  position: absolute; left: 50%; bottom: 0; width: 196px; height: 12px;
  margin-left: -98px; border-radius: 0 0 12px 12px; background: var(--hw-ground);
}
.hw-tile {
  position: absolute; left: 330px; width: 250px; height: 66px;
  display: flex; align-items: center; gap: 14px; padding: 0 18px;
  background: var(--hw-surface); border: 1px solid var(--hw-hairline);
  border-radius: 14px; box-shadow: var(--hw-frag-shadow);
}
.hw-tile > img { width: 32px; height: 32px; border-radius: 7px; flex: none; object-fit: contain; }
.hw-tile > span { font-size: 22px; font-weight: 500; color: var(--hw-text-2); letter-spacing: -0.01em; }
.hw-thread { position: absolute; border-radius: 1.5px; background: var(--hw-bar); }

#w-mark2 { position: absolute; left: 825px; top: 341px; }
#w-halo2 {
  position: absolute; left: 730px; top: 246px; width: 380px; height: 380px; border-radius: 50%;
  background: radial-gradient(circle, var(--hw-accent-tint) 0%, rgba(0, 0, 0, 0) 66%);
}

#w-claude { position: absolute; left: 1424px; top: 380px; width: 112px; height: 112px; }
#w-claude img { width: 112px; height: 112px; display: block; }
#w-claude-label {
  position: absolute; left: 1330px; top: 512px; width: 300px; text-align: center;
  font-family: var(--font-geist-mono), ui-monospace, monospace;
  font-size: 21px; letter-spacing: 0.04em; color: var(--hw-text-2);
}

/* ── act 3 ── */
#w-term { left: 430px; top: 210px; width: 1060px; height: 520px; background: var(--hw-term); }
#w-term .hw-body { padding: 34px 38px; gap: 0; }
.hw-q {
  display: flex; align-items: baseline; gap: 14px;
  font-family: var(--font-geist-mono), ui-monospace, monospace;
  font-size: 34px; color: var(--hw-win-text);
}
.hw-q > i { color: var(--hw-win-text-2); font-style: normal; }
.hw-type-wrap { position: relative; display: inline-block; width: 36ch; white-space: pre; }
.hw-type-mask {
  position: absolute; top: -6px; bottom: -8px; left: 0; right: 0;
  background: var(--hw-term); display: flex; align-items: center;
  animation: w-type ${CYCLE}s steps(36) infinite;
}
.hw-type-caret {
  width: 16px; height: 38px; background: var(--hw-win-text-2);
  animation: w-type-caret ${CYCLE}s linear infinite;
}
#w-status { display: flex; align-items: center; gap: 16px; margin-top: 40px; }
/* It goes and looks. This fills the hole between "you hit enter" and "the
   answer lands", which was 1.2s of nothing. */
#w-mark3 { width: 58px; height: 58px; flex: none; }
#w-live { display: flex; align-items: center; gap: 13px; }
.hw-dot { position: relative; width: 15px; height: 15px; border-radius: 50%; background: var(--hw-accent); flex: none; }
.hw-dot > b {
  position: absolute; left: -18px; top: -18px; width: 51px; height: 51px; border-radius: 50%;
  background: radial-gradient(circle, var(--hw-accent-tint) 0%, rgba(0, 0, 0, 0) 70%);
}
.hw-status-label {
  font-family: var(--font-geist-mono), ui-monospace, monospace;
  font-size: 24px; letter-spacing: 0.05em; color: var(--hw-accent-text);
}
#w-answer {
  margin-top: 26px; max-width: 900px;
  font-size: 39px; line-height: 1.4; font-weight: 500;
  color: var(--hw-win-text); letter-spacing: -0.012em;
}
#w-chip {
  margin-top: 30px; align-self: flex-start;
  display: inline-flex; align-items: center; gap: 10px;
  padding: 11px 20px; border-radius: 10px;
  background: var(--hw-accent-tint); border: 1px solid var(--hw-accent);
  font-family: var(--font-geist-mono), ui-monospace, monospace;
  font-size: 25px; color: var(--hw-accent-text);
}

/* ── act 4 ── */
#w-call { position: absolute; left: 150px; top: 130px; width: 1000px; height: 730px; }
#w-call .hw-body { padding: 22px; gap: 18px; flex-direction: column; }
#w-seats { display: flex; gap: 18px; height: 480px; }
/* The live transcript. Jarvis is not just briefing you, it is taking the
   minutes — these are MeetingAssistContent.transcript lines. */
#w-tr { display: flex; flex-direction: column; gap: 14px; padding-top: 4px; }
.hw-tr { display: flex; align-items: baseline; gap: 16px; }
.hw-tr > i {
  font-family: var(--font-geist-mono), ui-monospace, monospace; font-style: normal;
  font-size: 17px; color: var(--hw-win-text-2); flex: none; width: 54px;
}
.hw-tr > b { font-size: 19px; font-weight: 600; flex: none; width: 132px; }
.hw-tr > span { font-size: 19px; line-height: 1.35; color: var(--hw-win-text-2); }
#w-rec {
  margin-left: auto; display: flex; align-items: center; gap: 9px;
  font-family: var(--font-geist-mono), ui-monospace, monospace;
  font-size: 15px; letter-spacing: 0.04em; color: var(--hw-win-text-2);
}
#w-rec > i { width: 9px; height: 9px; border-radius: 50%; background: #ef4444; flex: none; }
#w-rec > u { position: relative; width: 48px; height: 19px; text-decoration: none; }
#w-rec > u > span { position: absolute; left: 0; top: 0; }
.hw-ilabel {
  position: absolute; left: 33px;
  font-family: var(--font-geist-mono), ui-monospace, monospace;
  font-size: 17px; letter-spacing: 0.12em; text-transform: uppercase;
  color: var(--hw-text-2);
}
#w-div { position: absolute; left: 33px; right: 33px; top: 396px; height: 1px; background: var(--hw-hairline-strong); }
/* What you have to walk out of the call having settled. Straight from
   MeetingAssistContent.blockers — priority order, high one in accent. */
.hw-clar { position: absolute; left: 33px; width: 500px; display: flex; align-items: flex-start; gap: 18px; }
.hw-clar > i { width: 26px; height: 26px; border-radius: 8px; border: 2px solid var(--hw-hairline-strong); flex: none; margin-top: 1px; }
.hw-clar > span { font-size: 23px; font-weight: 500; line-height: 1.3; color: var(--hw-text); letter-spacing: -0.008em; }
.hw-clar--hi > i { border-color: var(--hw-accent); background: var(--hw-accent-tint); }
.hw-clar--hi > span { color: var(--hw-accent-text); font-weight: 600; }
.hw-seat {
  flex: 1; border-radius: 14px;
  background: var(--hw-win-row); border: 1px solid var(--hw-win-line);
  display: flex; flex-direction: column; align-items: center; justify-content: center; gap: 18px;
}
.hw-seat > i {
  width: 128px; height: 128px; border-radius: 50%;
  display: flex; align-items: center; justify-content: center;
  font-size: 38px; font-weight: 600; color: #ffffff; font-style: normal;
}
.hw-seat > b { font-size: 26px; font-weight: 500; color: var(--hw-win-text); }
.hw-seat > span { font-size: 20px; color: var(--hw-win-text-2); }

#w-island {
  position: absolute; left: 1210px; top: 130px; width: 560px; height: 730px;
  background: var(--hw-surface); border: 1px solid var(--hw-hairline-strong);
  border-radius: 22px; padding: 32px 34px;
}
.hw-island-head { display: flex; align-items: center; gap: 12px; }
.hw-island-head > b { font-size: 30px; font-weight: 600; color: var(--hw-text); letter-spacing: -0.01em; }
#w-rail { position: absolute; left: 41px; top: 150px; width: 2px; height: 214px; background: var(--hw-hairline-strong); transform-origin: center top; }
.hw-mark-row { position: absolute; left: 33px; width: 500px; display: flex; gap: 24px; }
.hw-mark-row > i { width: 16px; height: 16px; border-radius: 50%; margin-top: 7px; flex: none; }
.hw-mark-row b {
  display: block;
  font-family: var(--font-geist-mono), ui-monospace, monospace;
  font-size: 17px; font-weight: 400; letter-spacing: 0.05em;
  text-transform: uppercase; color: var(--hw-text-2);
}
.hw-mark-row span { display: block; font-size: 22px; font-weight: 500; line-height: 1.35; color: var(--hw-text); letter-spacing: -0.008em; }


/* ── act 5 ── */
#w-mark5 { position: absolute; left: 845px; top: 274px; }
#w-halo5 {
  position: absolute; left: 730px; top: 159px; width: 460px; height: 460px; border-radius: 50%;
  background: radial-gradient(circle, var(--hw-accent-tint) 0%, rgba(0, 0, 0, 0) 62%);
}
.hw-eye { transform-origin: 50px 50px; animation: w-eyes ${CYCLE}s ${ARRIVE} infinite; }
.hw-eye2 { transform-origin: 50px 50px; animation: w-eyes2 ${CYCLE}s ${ARRIVE} infinite; }
.hw-eye3 { transform-origin: 50px 50px; animation: w-eyes3 ${CYCLE}s ${ARRIVE} infinite; }
.hw-eye4 { transform-origin: 50px 50px; animation: w-eyes4 ${CYCLE}s ${ARRIVE} infinite; }
#w-wordmark {
  position: absolute; left: 0; right: 0; top: 826px; text-align: center;
  font-family: var(--font-geist-sans), ui-sans-serif, system-ui, sans-serif;
  font-size: 34px; font-weight: 700; letter-spacing: -0.035em; color: var(--hw-text-2);
}

/* Reduced motion: hold the payoff frame — the briefing, and the question it
   hands you. No cycle, no movement. */
@media (prefers-reduced-motion: reduce) {
  .hw-stage * { animation: none !important; }
  .hw-stage .hw-rm-hide { display: none !important; }
  .hw-stage .hw-rm-show { opacity: 1 !important; transform: none !important; }
}
      `}</style>

      <div className="hw-film">
        {/* ══ Act 1 — the week you missed ══ */}
        <div id="w-stack">
        {WINDOWS.map((w) => (
          <div key={w.id} id={w.id} className="hw-win hw-rm-hide" style={w.box}>
            <div className="hw-bar" aria-hidden>
              <span className="hw-light" /><span className="hw-light" /><span className="hw-light" />
              {w.icon === "cal" ? (
                <svg className="hw-wlogo" viewBox="0 0 24 24" fill="none">
                  <rect x="3" y="5" width="18" height="16" rx="3.4" fill="#4285f4" />
                  <rect x="3" y="5" width="18" height="5.4" rx="3.4" fill="#1a73e8" />
                  <rect x="7" y="2.4" width="2.4" height="5" rx="1.2" fill="#9aa0a6" />
                  <rect x="14.6" y="2.4" width="2.4" height="5" rx="1.2" fill="#9aa0a6" />
                  <rect x="6.6" y="12.6" width="4.2" height="4.2" rx="1.1" fill="#ffffff" />
                </svg>
              ) : w.icon === "doc" ? (
                <svg className="hw-wlogo" viewBox="0 0 24 24" fill="none">
                  <rect x="4" y="2.5" width="16" height="19" rx="3" fill="#94a3b8" />
                  <rect x="7.2" y="7" width="9.6" height="1.8" rx="0.9" fill="#ffffff" />
                  <rect x="7.2" y="11" width="9.6" height="1.8" rx="0.9" fill="#ffffff" opacity="0.75" />
                  <rect x="7.2" y="15" width="6" height="1.8" rx="0.9" fill="#ffffff" opacity="0.5" />
                </svg>
              ) : (
                // eslint-disable-next-line @next/next/no-img-element
                <img className="hw-wlogo" src={w.icon} alt="" />
              )}
              <span className="hw-title">{w.title}</span>
              <span className="hw-badge" id={w.badge}>{w.count}</span>
            </div>
            <div className="hw-body">
              {w.rows.map(([id, a, b, tint]) => (
                <div key={id} id={id} className={w.kind === "evt" ? "hw-row" : "hw-row"}>
                  {w.kind === "evt"
                    ? <span className="hw-spine" style={{ background: tint }} />
                    : <span className="hw-avatar" style={{ background: tint }} />}
                  <span className="hw-stack">
                    <span className="hw-b" style={{ width: a }} />
                    <span className="hw-b hw-b--dim" style={{ width: b }} />
                  </span>
                </div>
              ))}
            </div>
          </div>
        ))}
        </div>

        {/* Context falling out of the pile, down the gutters. */}
        {GUTTER.map((g) => (
          <div key={g.id} id={g.id} className="hw-frag hw-rm-hide" style={{ left: g.x, top: g.y }} aria-hidden>
            <i style={{ background: g.tint }} /><u />
          </div>
        ))}

        <div id="w-date" className="hw-rm-hide" aria-hidden>
          {DATES.map(([id, label]) => (
            <span key={id} id={id}>{label}</span>
          ))}
        </div>

        <div id="w-l1" className="hw-cap hw-cap--words hw-rm-hide" style={{ top: 706 }}>
          <span className="w" id="w-wa">You</span> <span className="w" id="w-wb">can&rsquo;t</span> <span className="w" id="w-wc">remember</span> <span className="w" id="w-wd">everything.</span>
        </div>
        <div id="w-l2" className="hw-cap hw-cap--quiet hw-rm-hide" style={{ top: 804 }}>It&rsquo;s spread across every tool.</div>

        {/* ══ Act 2 — it was all being read ══ */}
        <div id="w-boundary" className="hw-rm-hide">
          <div id="w-screen"><div id="w-sheen" /></div>
          <div id="w-edge" />
          <div id="w-notch" />
          <div id="w-hinge" />
        </div>
        <div id="w-base" className="hw-rm-hide"><div id="w-groove" /></div>

        {SOURCES.map(([id, label, src], i) => (
          <div key={id} id={id} className="hw-tile hw-rm-hide" style={{ top: 268 + i * 90 }}>
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={src} alt="" aria-hidden />
            <span>{label}</span>
          </div>
        ))}

        <div id="w-h1" className="hw-thread hw-rm-hide" style={{ left: 580, top: 299, width: 122, height: 3, transformOrigin: "left center" }} />
        <div id="w-h2" className="hw-thread hw-rm-hide" style={{ left: 580, top: 389, width: 122, height: 3, transformOrigin: "left center" }} />
        <div id="w-h3" className="hw-thread hw-rm-hide" style={{ left: 580, top: 479, width: 122, height: 3, transformOrigin: "left center" }} />
        <div id="w-h4" className="hw-thread hw-rm-hide" style={{ left: 580, top: 569, width: 122, height: 3, transformOrigin: "left center" }} />
        <div id="w-v" className="hw-thread hw-rm-hide" style={{ left: 700, top: 299, width: 3, height: 273, transformOrigin: "center top" }} />
        <div id="w-h5" className="hw-thread hw-rm-hide" style={{ left: 700, top: 434, width: 128, height: 3, transformOrigin: "left center" }} />
        <div id="w-h6" className="hw-thread hw-rm-hide" style={{ left: 1015, top: 434, width: 409, height: 3, transformOrigin: "left center" }} />

        <div id="w-halo2" className="hw-rm-hide" />
        <div id="w-mark2" className="hw-rm-hide"><Mark size={190} eyeClass="hw-eye2" /></div>

        {/* eslint-disable-next-line @next/next/no-img-element */}
        <div id="w-claude" className="hw-rm-hide"><img src="/logos/claude.png" alt="" aria-hidden /></div>
        <div id="w-claude-label" className="hw-rm-hide">Claude Code</div>

        <div id="w-l3" className="hw-cap hw-rm-hide" style={{ top: 856 }}>Jarvis remembers all of it.</div>
        <div id="w-l4" className="hw-cap hw-cap--quiet hw-rm-hide" style={{ top: 940 }}>Nothing leaves your Mac.</div>

        {/* ══ Act 3 — one question ══ */}
        <div id="w-term" className="hw-win hw-term hw-rm-hide">
          <div className="hw-bar" aria-hidden>
            <span className="hw-light" /><span className="hw-light" /><span className="hw-light" />
            <span className="hw-title">Claude Code</span>
          </div>
          <div className="hw-body">
            <div className="hw-q">
              <i>&gt;</i>
              <span className="hw-type-wrap">
                {QUERY}
                <span className="hw-type-mask"><span className="hw-type-caret" /></span>
              </span>
            </div>

            <div id="w-status">
              <div id="w-mark3"><Mark size={58} eyeClass="hw-eye3" /></div>
              <div id="w-live">
                <span className="hw-dot"><b /></span>
                <span className="hw-status-label">Jarvis &middot; local</span>
              </div>
            </div>

            <div id="w-answer">Tom&rsquo;s fix is in review &mdash; not shipped. It double-charged 3 customers.</div>
            <div id="w-chip">&#8627; #eng &middot; 3 days ago</div>
          </div>
        </div>

        <div id="w-l5" className="hw-cap hw-rm-hide" style={{ top: 812 }}>You didn&rsquo;t read the week. It did.</div>

        {/* ══ Act 4 — 11:00 ══ */}
        <div id="w-call" className="hw-win hw-rm-show">
          <div className="hw-bar" aria-hidden>
            <span className="hw-light" /><span className="hw-light" /><span className="hw-light" />
            <span className="hw-title">1:1 &middot; David Park</span>
            <span id="w-rec">
              <i />Recording
              <u><span id="w-rt1">02:41</span><span id="w-rt2">07:18</span></u>
            </span>
          </div>
          <div className="hw-body">
            <div id="w-seats">
              <div className="hw-seat">
                <i style={{ background: "#4e63b0" }}>DP</i>
                <b>David Park</b><span>Your manager</span>
              </div>
              <div className="hw-seat">
                <i style={{ background: "#3e7c7c" }}>YOU</i>
                <b>You</b><span>Team lead</span>
              </div>
            </div>
            <div id="w-tr">
              <div className="hw-tr" id="w-tr1">
                <i>11:01</i><b style={{ color: "var(--hw-sp-a)" }}>David Park</b>
                <span>Are we still good on the launch date?</span>
              </div>
              <div className="hw-tr" id="w-tr2">
                <i>11:02</i><b style={{ color: "var(--hw-sp-b)" }}>You</b>
                <span>Contained. I&rsquo;ll get you a firm date today.</span>
              </div>
            </div>
          </div>
        </div>

        <div id="w-island" className="hw-rm-show">
          <div className="hw-island-head">
            <Mark size={38} eyeClass="hw-eye4" />
            <b>Jarvis on the call</b>
          </div>

          <div className="hw-ilabel" id="w-lbl-a" style={{ top: 104 }}>While you were out</div>
          <div id="w-rail" />
          {MISSED.map((m, i) => (
            <div key={m.id} id={m.id} className="hw-mark-row" style={{ top: [144, 216, 288][i] }}>
              <i style={{ background: m.node }} />
              <span>
                <b>{m.date}</b>
                <span>{m.head}</span>
              </span>
            </div>
          ))}

          <div id="w-div" />
          <div className="hw-ilabel" id="w-lbl-b" style={{ top: 428 }}>What to clarify</div>
          {CLARIFY.map((c, i) => (
            <div key={c.id} id={c.id} className={`hw-clar${i === 0 ? " hw-clar--hi" : ""}`} style={{ top: [480, 560, 640][i] }}>
              <i />
              <span>{c.text}</span>
            </div>
          ))}
        </div>

        <div id="w-l6" className="hw-cap hw-cap--quiet hw-rm-hide" style={{ top: 922 }}>You know nothing.</div>
        <div id="w-l9" className="hw-cap hw-rm-show" style={{ top: 916 }}>Now you do.</div>

        {/* ══ Act 5 — the lockup ══ */}
        <div id="w-halo5" className="hw-rm-hide" />
        <div id="w-mark5" className="hw-rm-hide"><Mark size={230} eyeClass="hw-eye" /></div>
        <div id="w-l7" className="hw-cap hw-rm-hide" style={{ top: 582 }}>You walked in cold.</div>
        <div id="w-l8" className="hw-cap hw-rm-hide" style={{ top: 678 }}>Jarvis didn&rsquo;t.</div>
        <div id="w-wordmark" className="hw-rm-hide">jarvis_</div>
      </div>
    </div>
  );
}
