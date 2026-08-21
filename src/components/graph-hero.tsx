"use client";

import * as React from "react";
import { useCallback, useEffect, useRef } from "react";
import { motion, useReducedMotion } from "framer-motion";
import { markBars, MARK_INK, MARK_PAPER } from "@/components/jarvis-mark";

/*
  Graph Hero — "Your context, assembled."

  The right half draws itself: a mesh of the things Jarvis holds for you, with
  the tools you work in anchoring the edges. Every hairline is one continuous
  SVG path with pathLength normalised to 1, so a single stroke-dashoffset sweep
  draws all edges in sequence. Once assembled, the mesh drifts and leans toward
  the cursor with distance falloff, and pulses of context travel the edges.

  Deliberately a sprawling mesh with no single hub, so it does not restate the
  tidy orbit in the section below. Ships zero image bytes.
*/

const EASE = [0.16, 1, 0.3, 1] as const;
const ASSEMBLY_S = 2.2; // seconds for the draw-in
const WARP_RADIUS = 155; // px of cursor influence
const WARP_PULL = 11; // px max lean toward the cursor, kept low so the web stays legible
const FLOWS = 5;
const RIPPLES = 3;
const TRAIL = 3; // head plus two tail dots, so context reads as flowing in
const TRAIL_GAP = 0.085; // spacing between trail dots, in segment units
const FLOW_START = ASSEMBLY_S + 0.4; // Jarvis lands, then starts pulling

/* ─── Brand marks ────────────────────────────────────────────────────── */

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
        <linearGradient id="gh-jira-base">
          <stop offset=".18" stopColor="#0052cc" />
          <stop offset="1" stopColor="#2684ff" />
        </linearGradient>
        <linearGradient id="gh-jira-b" x1="98.031%" x2="58.888%" href="#gh-jira-base" y1=".161%" y2="40.766%" />
        <linearGradient id="gh-jira-c" x1="100.665%" x2="55.402%" href="#gh-jira-base" y1=".455%" y2="44.727%" />
      </defs>
      <path d="M244.658 0H121.707a55.502 55.502 0 0 0 55.502 55.502h22.649V77.37c.02 30.625 24.841 55.447 55.466 55.467V10.666C255.324 4.777 250.55 0 244.658 0z" fill="#2684ff" />
      <path d="M183.822 61.262H60.872c.019 30.625 24.84 55.447 55.466 55.467h22.649v21.938c.039 30.625 24.877 55.43 55.502 55.43V71.93c0-5.891-4.776-10.667-10.667-10.667z" fill="url(#gh-jira-b)" />
      <path d="M122.951 122.489H0c0 30.653 24.85 55.502 55.502 55.502h22.72v21.867c.02 30.597 24.798 55.408 55.396 55.466V133.156c0-5.891-4.776-10.667-10.667-10.667z" fill="url(#gh-jira-c)" />
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
        <linearGradient id="gh-conf-a" x1="27.4" y1="25.5" x2="14.9" y2="18.3" gradientUnits="userSpaceOnUse">
          <stop offset=".18" stopColor="#0052CC" />
          <stop offset="1" stopColor="#2684FF" />
        </linearGradient>
        <linearGradient id="gh-conf-b" x1="4.6" y1="6.5" x2="17.1" y2="13.7" gradientUnits="userSpaceOnUse">
          <stop offset=".18" stopColor="#0052CC" />
          <stop offset="1" stopColor="#2684FF" />
        </linearGradient>
      </defs>
      <path fill="url(#gh-conf-a)" d="M4.7 23.6c-.3.5-.6 1-.9 1.4-.2.4-.1.9.3 1.2l5.9 3.6c.4.3 1 .1 1.2-.3.2-.4.5-.9.8-1.4 2.4-3.9 4.8-3.4 9.2-1.3l5.8 2.8c.4.2 1 0 1.2-.4l2.8-6.4c.2-.4 0-1-.4-1.2-1.2-.6-3.7-1.7-5.9-2.8-7.9-3.8-14.6-3.6-19 4z" />
      <path fill="url(#gh-conf-b)" d="M27.3 8.4c.3-.5.6-1 .9-1.4.2-.4.1-.9-.3-1.2L22 2.2c-.4-.3-1-.2-1.2.3-.2.4-.5.9-.8 1.4-2.4 3.9-4.8 3.4-9.2 1.3L5 2.3c-.4-.2-1 0-1.2.4L1 9.2c-.2.4 0 1 .4 1.2 1.2.6 3.7 1.7 5.9 2.8 8 3.8 14.7 3.5 19-4z" />
    </svg>
  );
}

/* ─── Graph ──────────────────────────────────────────────────────────── */

type GraphNode = {
  id: string;
  kind: "tool" | "ctx" | "jarvis";
  angle: number; // radians around the hub
  ring: number; // 0 at the hub, 1 at the rim
  label?: string;
  Mark?: (p: MarkProps) => React.ReactElement;
};

const JARVIS_R = 30; // px radius of the hub
// Pause bars at the canonical proportions for a disc of this diameter.
const HUB_BARS = markBars(JARVIS_R * 2);
// Glance: the core app offsets the bars by 0.07 * size (Mark.swift
// `glanceOffset`). Horizontal is the canonical axis; a half-strength vertical
// component is added here so the hub reads as looking AT the cursor in 2D.
const GLANCE_X = 0.07 * JARVIS_R * 2;
const GLANCE_Y = 0.035 * JARVIS_R * 2;
// Blink: same shape as Mark.swift's scheduleBlink — collapse to a 0.06 sliver
// and back, 90 ms each way — on a roughly ten second cadence.
const BLINK_MS = 180;
const BLINK_SLIVER = 0.06;
const BLINK_MIN_MS = 8000;
const BLINK_JITTER_MS = 5000;
const SPOKES = 10;
const RINGS = [0.3, 0.55, 0.78, 1.0];
const DOT_R = 3.6; // every context node is the same small dot

// Six of the ten spokes end in a tool you actually work in.
const TOOL_AT: Record<number, { label: string; Mark: (p: MarkProps) => React.ReactElement }> = {
  0: { label: "GitHub", Mark: GitHubMark },
  2: { label: "Jira", Mark: JiraMark },
  4: { label: "Confluence", Mark: ConfluenceMark },
  5: { label: "Linear", Mark: LinearMark },
  7: { label: "Notion", Mark: NotionMark },
  9: { label: "Slack", Mark: SlackMark },
};

// A real orb web is structured but hand-made: the radials are not evenly
// spaced, the spiral drifts outward instead of closing into concentric
// circles, and the hub sits a little off centre. Perfect symmetry reads as a
// radar chart. These are deterministic so the layout is stable and tunable,
// not re-rolled on every load.
const ANGLE_JITTER = 0.46; // fraction of the half-gap each spoke may drift
const RADIUS_JITTER = 0.13; // per-node wobble on its ring radius
const SPIRAL = 0.09; // how far the spiral creeps outward over one full turn

/** Stable pseudo-random in -1..1 from an integer seed. */
function wobble(seed: number): number {
  const x = Math.sin(seed * 12.9898 + 78.233) * 43758.5453;
  return (x - Math.floor(x)) * 2 - 1;
}

const SPOKE_ANGLE: number[] = Array.from({ length: SPOKES }, (_, s) => {
  const even = -Math.PI / 2 + (s * 2 * Math.PI) / SPOKES;
  // Half the spacing is the most a spoke could drift before colliding.
  return even + wobble(s) * ANGLE_JITTER * (Math.PI / SPOKES);
});

const NODES: GraphNode[] = (() => {
  // Jarvis is the hub, nudged just off dead centre the way a spider builds it.
  const out: GraphNode[] = [
    { id: "jarvis", kind: "jarvis", angle: -Math.PI * 0.62, ring: 0.075 },
  ];
  for (let s = 0; s < SPOKES; s++) {
    const angle = SPOKE_ANGLE[s];
    for (let r = 0; r < RINGS.length; r++) {
      const tool = r === RINGS.length - 1 ? TOOL_AT[s] : undefined;
      const spiral = 1 + SPIRAL * (s / SPOKES);
      const ring = RINGS[r] * spiral * (1 + wobble(s * 7 + r * 13) * RADIUS_JITTER);
      out.push({
        id: `s${s}r${r}`,
        kind: tool ? "tool" : "ctx",
        angle,
        ring,
        label: tool?.label,
        Mark: tool?.Mark,
      });
    }
  }
  // Renormalise so the widest node lands exactly on the rim, otherwise the
  // jitter would push the outer tools past the edge of the field.
  const maxRing = Math.max(...out.map((n) => n.ring));
  for (const n of out) n.ring /= maxRing;
  return out;
})();

const INDEX: Record<string, number> = Object.fromEntries(
  NODES.map((n, i) => [n.id, i]),
);

type EdgeKind = "spoke" | "ring";
const EDGE_KIND: EdgeKind[] = [];
// How far each ring segment bows outward. Spokes get 0 (dead straight). With
// uneven spacing every segment needs its own value, from its own angular gap.
const EDGE_BOW: number[] = [];
// Radials first, then the spiral from the inside out. A spider builds a web in
// that order, and it makes the draw-in read as construction.
const EDGES: [string, string][] = (() => {
  const out: [string, string][] = [];
  for (let s = 0; s < SPOKES; s++) {
    out.push(["jarvis", `s${s}r0`]);
    EDGE_KIND.push("spoke");
    EDGE_BOW.push(0);
    for (let r = 0; r < RINGS.length - 1; r++) {
      out.push([`s${s}r${r}`, `s${s}r${r + 1}`]);
      EDGE_KIND.push("spoke");
      EDGE_BOW.push(0);
    }
  }
  for (let r = 0; r < RINGS.length; r++) {
    for (let s = 0; s < SPOKES; s++) {
      const next = (s + 1) % SPOKES;
      out.push([`s${s}r${r}`, `s${next}r${r}`]);
      EDGE_KIND.push("ring");
      // Chord midpoint sits at R*cos(t), the arc's control point at R/cos(t),
      // so pushing the midpoint out by tan(t)^2 turns the chord into the arc.
      let gap = SPOKE_ANGLE[next] - SPOKE_ANGLE[s];
      if (gap <= 0) gap += 2 * Math.PI;
      EDGE_BOW.push(Math.tan(gap / 2) ** 2);
    }
  }
  return out;
})();

const EDGE_OF = new Map<string, number>();
EDGES.forEach(([a, b], i) => {
  EDGE_OF.set(`${a}|${b}`, i);
  EDGE_OF.set(`${b}|${a}`, i);
});

// Breadth-first from Jarvis gives every node its next hop inward, so context
// visibly travels down a spoke into the hub instead of drifting at random.
const NEXT_HOP: Record<string, string> = (() => {
  const adj: Record<string, string[]> = {};
  EDGES.forEach(([a, b]) => {
    (adj[a] ||= []).push(b);
    (adj[b] ||= []).push(a);
  });
  const next: Record<string, string> = {};
  const seen = new Set(["jarvis"]);
  let frontier = ["jarvis"];
  while (frontier.length) {
    const nextFrontier: string[] = [];
    for (const node of frontier) {
      for (const nb of adj[node] ?? []) {
        if (seen.has(nb)) continue;
        seen.add(nb);
        next[nb] = node;
        nextFrontier.push(nb);
      }
    }
    frontier = nextFrontier;
  }
  return next;
})();

function routeToJarvis(from: string): string[] {
  const path = [from];
  let cur = from;
  while (cur !== "jarvis" && NEXT_HOP[cur]) {
    cur = NEXT_HOP[cur];
    path.push(cur);
  }
  return path;
}

// Context enters at the rim and is drawn all the way in.
const ROUTES = Array.from({ length: SPOKES }, (_, s) =>
  routeToJarvis(`s${s}r${RINGS.length - 1}`),
);

const TOOLS = NODES.filter((n) => n.kind === "tool");
const CTX = NODES.filter((n) => n.kind === "ctx");
const JARVIS = INDEX["jarvis"];

// When the sweep first reaches each node, as a fraction of the assembly.
const NODE_DELAY: number[] = (() => {
  const d = NODES.map(() => 1);
  d[JARVIS] = 0; // the hub is there first; the web grows out of it
  EDGES.forEach(([a, b], i) => {
    const f = i / EDGES.length;
    d[INDEX[a]] = Math.min(d[INDEX[a]], f);
    d[INDEX[b]] = Math.min(d[INDEX[b]], f);
  });
  return d;
})();

const smoothstep = (v: number) => v * v * (3 - 2 * v);

type Pt = { x: number; y: number };
function control(a: Pt, b: Pt, i: number, cx: number, cy: number): Pt {
  const mx = (a.x + b.x) / 2;
  const my = (a.y + b.y) / 2;
  const bow = EDGE_BOW[i];
  if (!bow) return { x: mx, y: my };
  return { x: mx + (mx - cx) * bow, y: my + (my - cy) * bow };
}

export function GraphHero() {
  const reduce = useReducedMotion();

  const sectionRef = useRef<HTMLElement | null>(null);
  const fieldRef = useRef<HTMLDivElement | null>(null);
  const pathRef = useRef<SVGPathElement | null>(null);
  const hotRef = useRef<SVGPathElement | null>(null);
  const toolRefs = useRef<(HTMLDivElement | null)[]>([]);
  const dotRefs = useRef<(SVGCircleElement | null)[]>([]);
  const pulseRefs = useRef<(SVGCircleElement | null)[]>([]);
  const jarvisRef = useRef<SVGGElement | null>(null);
  const hubBarLRef = useRef<SVGRectElement | null>(null);
  const hubBarRRef = useRef<SVGRectElement | null>(null);
  const glanceRef = useRef({ x: 0, y: 0 });
  const blinkStartRef = useRef<number | null>(null);
  const nextBlinkRef = useRef(BLINK_MIN_MS);
  const rippleRefs = useRef<(SVGCircleElement | null)[]>([]);

  // Base positions in px, recomputed only on resize.
  const baseRef = useRef<{ x: number; y: number }[]>([]);
  const centerRef = useRef({ cx: 0, cy: 0 });
  const radiusRef = useRef({ rx: 1, ry: 1 });
  const posRef = useRef<{ x: number; y: number }[]>(NODES.map(() => ({ x: 0, y: 0 })));
  const heatRef = useRef<number[]>(NODES.map(() => 0));
  const pointerRef = useRef({ x: 0, y: 0 });
  const hasPointerRef = useRef(false);
  const rafRef = useRef<number | null>(null);
  // Each flow carries context from a tool, hop by hop, into Jarvis.
  const flowRef = useRef(
    Array.from({ length: FLOWS }, (_, i) => ({
      route: ROUTES[i % ROUTES.length],
      seg: 0,
      t: 0,
      speed: 0.42 + (i % 3) * 0.09,
      wait: i * 0.85,
    })),
  );
  const rippleState = useRef(
    Array.from({ length: RIPPLES }, () => ({ t: 1 })),
  );
  const nextRipple = useRef(0);

  const measure = useCallback(() => {
    const field = fieldRef.current;
    if (!field) return;
    const w = field.clientWidth;
    const h = field.clientHeight;
    const cx = w / 2;
    const cy = h / 2;
    centerRef.current = { cx, cy };
    // Mildly elliptical so the web fills a landscape field, still symmetric.
    const rx = w * 0.44;
    const ry = h * 0.44;
    radiusRef.current = { rx: rx || 1, ry: ry || 1 };
    baseRef.current = NODES.map((n) => ({
      x: cx + Math.cos(n.angle) * n.ring * rx,
      y: cy + Math.sin(n.angle) * n.ring * ry,
    }));
  }, []);

  const paint = useCallback(() => {
    const pos = posRef.current;
    const { cx, cy } = centerRef.current;
    // One path for every edge keeps this to a single DOM write per frame.
    let d = "";
    for (let i = 0; i < EDGES.length; i++) {
      const a = pos[INDEX[EDGES[i][0]]];
      const b = pos[INDEX[EDGES[i][1]]];
      const c = control(a, b, i, cx, cy);
      d += `M${a.x.toFixed(1)} ${a.y.toFixed(1)}Q${c.x.toFixed(1)} ${c.y.toFixed(1)} ${b.x.toFixed(1)} ${b.y.toFixed(1)}`;
    }
    pathRef.current?.setAttribute("d", d);

    const heat = heatRef.current;
    const jp = pos[JARVIS];
    if (jarvisRef.current) {
      jarvisRef.current.setAttribute(
        "transform",
        `translate(${jp.x.toFixed(1)} ${jp.y.toFixed(1)}) scale(${(1 + 0.06 * heat[JARVIS]).toFixed(3)})`,
      );
    }
    TOOLS.forEach((n, i) => {
      const el = toolRefs.current[i];
      const idx = INDEX[n.id];
      const p = pos[idx];
      if (el) {
        el.style.transform = `translate3d(${p.x - 21}px, ${p.y - 21}px, 0) scale(${(1 + 0.1 * heat[idx]).toFixed(3)})`;
      }
    });
    CTX.forEach((n, i) => {
      const el = dotRefs.current[i];
      const idx = INDEX[n.id];
      const p = pos[idx];
      if (el) {
        el.setAttribute("cx", p.x.toFixed(1));
        el.setAttribute("cy", p.y.toFixed(1));
        el.setAttribute("r", (DOT_R * (1 + 0.5 * heat[idx])).toFixed(2));
        el.setAttribute("fill-opacity", (0.26 + 0.54 * heat[idx]).toFixed(3));
      }
    });

    // Edges close to the cursor light up in the brand accent.
    let hot = "";
    let peak = 0;
    for (let i = 0; i < EDGES.length; i++) {
      const ia = INDEX[EDGES[i][0]];
      const ib = INDEX[EDGES[i][1]];
      const k = Math.max(heat[ia], heat[ib]);
      if (k < 0.22) continue;
      if (k > peak) peak = k;
      const a = pos[ia];
      const b = pos[ib];
      const c = control(a, b, i, cx, cy);
      hot += `M${a.x.toFixed(1)} ${a.y.toFixed(1)}Q${c.x.toFixed(1)} ${c.y.toFixed(1)} ${b.x.toFixed(1)} ${b.y.toFixed(1)}`;
    }
    if (hotRef.current) {
      hotRef.current.setAttribute("d", hot);
      hotRef.current.setAttribute("opacity", (peak * 0.45).toFixed(3));
    }
  }, []);

  useEffect(() => {
    const field = fieldRef.current;
    if (!field) return;

    measure();
    // Bars centred and fully open: the mark at rest.
    const restBars = () => {
      for (const el of [hubBarLRef.current, hubBarRRef.current]) {
        if (!el) continue;
        el.setAttribute("y", HUB_BARS.y.toFixed(2));
        el.setAttribute("height", HUB_BARS.h.toFixed(2));
      }
      hubBarLRef.current?.setAttribute("x", HUB_BARS.leftX.toFixed(2));
      hubBarRRef.current?.setAttribute("x", HUB_BARS.rightX.toFixed(2));
    };

    const settle = () => {
      posRef.current = baseRef.current.map((b) => ({ ...b }));
      restBars();
      paint();
    };

    const ro = new ResizeObserver(() => {
      measure();
      if (reduce) settle();
    });
    ro.observe(field);

    // Reduced motion: render the finished mesh, no sweep, no drift, no pulses.
    if (reduce) {
      settle();
      pathRef.current?.setAttribute("stroke-dasharray", "none");
      pathRef.current?.setAttribute("stroke-dashoffset", "0");
      pulseRefs.current.forEach((p) => p?.setAttribute("opacity", "0"));
      rippleRefs.current.forEach((p) => p?.setAttribute("opacity", "0"));
      return () => ro.disconnect();
    }

    const onPointerMove = (e: PointerEvent) => {
      const r = field.getBoundingClientRect();
      pointerRef.current = { x: e.clientX - r.left, y: e.clientY - r.top };
      hasPointerRef.current = true;
    };
    const onPointerLeave = () => {
      hasPointerRef.current = false;
    };
    const section = sectionRef.current;
    section?.addEventListener("pointermove", onPointerMove);
    section?.addEventListener("pointerleave", onPointerLeave);

    const start = performance.now();
    let dashCleared = false;
    let last = start;

    const frame = (now: number) => {
      const t = (now - start) / 1000;
      const dt = Math.min(0.05, (now - last) / 1000);
      last = now;
      const base = baseRef.current;
      const pos = posRef.current;

      if (t < ASSEMBLY_S) {
        // Hold the geometry still so the dash sweep stays true to the path.
        for (let i = 0; i < base.length; i++) {
          pos[i].x = base[i].x;
          pos[i].y = base[i].y;
          heatRef.current[i] = 0;
        }
        restBars();
        const p = 1 - Math.pow(1 - t / ASSEMBLY_S, 3);
        pathRef.current?.setAttribute("stroke-dashoffset", String(1 - p));
      } else {
        if (!dashCleared) {
          pathRef.current?.setAttribute("stroke-dasharray", "none");
          pathRef.current?.setAttribute("stroke-dashoffset", "0");
          dashCleared = true;
        }
        const jp = pos[JARVIS];
        const px = pointerRef.current.x;
        const py = pointerRef.current.y;
        const live = hasPointerRef.current;

        for (let i = 0; i < base.length; i++) {
          // Idle drift, unique phase per node.
          const ph = i * 1.37;
          // Jarvis barely moves. It is the fixed point the mesh feeds.
          const amp = i === JARVIS ? 0 : 1;
          let x = base[i].x + Math.sin(t * 0.36 + ph) * 2.6 * amp;
          let y = base[i].y + Math.cos(t * 0.29 + ph) * 2.2 * amp;

          let k = 0;
          if (live) {
            const dx = px - x;
            const dy = py - y;
            const dist = Math.hypot(dx, dy) || 1;
            k = smoothstep(Math.max(0, 1 - dist / WARP_RADIUS));
            if (i !== JARVIS) {
              x += (dx / dist) * WARP_PULL * k;
              y += (dy / dist) * WARP_PULL * k;
            }
          }
          heatRef.current[i] = k;
          pos[i].x = x;
          pos[i].y = y;
        }

        // Jarvis watches the cursor, and blinks about once every ten seconds.
        {
          const ms = t * 1000;
          const { rx, ry } = radiusRef.current;
          const tgx = live ? Math.max(-1, Math.min(1, (px - jp.x) / rx)) : 0;
          const tgy = live ? Math.max(-1, Math.min(1, (py - jp.y) / ry)) : 0;
          // Ease toward the target so the eyes follow rather than snap.
          const ease = Math.min(1, dt * 7);
          glanceRef.current.x += (tgx - glanceRef.current.x) * ease;
          glanceRef.current.y += (tgy - glanceRef.current.y) * ease;

          if (blinkStartRef.current === null && ms > nextBlinkRef.current) {
            blinkStartRef.current = ms;
            nextBlinkRef.current =
              ms + BLINK_MIN_MS + Math.random() * BLINK_JITTER_MS;
          }
          let openness = 1;
          if (blinkStartRef.current !== null) {
            const bt = ms - blinkStartRef.current;
            if (bt >= BLINK_MS) {
              blinkStartRef.current = null;
            } else {
              const half = BLINK_MS / 2;
              const raw = bt < half ? bt / half : 1 - (bt - half) / half;
              openness = 1 - smoothstep(raw) * (1 - BLINK_SLIVER);
            }
          }

          const gx = glanceRef.current.x * GLANCE_X;
          const gy = glanceRef.current.y * GLANCE_Y;
          const bh = HUB_BARS.h * openness;
          const by = -bh / 2 + gy;
          if (hubBarLRef.current) {
            hubBarLRef.current.setAttribute("x", (HUB_BARS.leftX + gx).toFixed(2));
            hubBarLRef.current.setAttribute("y", by.toFixed(2));
            hubBarLRef.current.setAttribute("height", bh.toFixed(2));
          }
          if (hubBarRRef.current) {
            hubBarRRef.current.setAttribute("x", (HUB_BARS.rightX + gx).toFixed(2));
            hubBarRRef.current.setAttribute("y", by.toFixed(2));
            hubBarRRef.current.setAttribute("height", bh.toFixed(2));
          }
        }

        // Context travelling the web into Jarvis, each pulse with a short tail
        // so the direction of travel is legible.
        const { cx: ccx, cy: ccy } = centerRef.current;
        const placeTrail = (f: (typeof flowRef.current)[number], i: number) => {
          for (let j = 0; j < TRAIL; j++) {
            const el = pulseRefs.current[i * TRAIL + j];
            if (!el) continue;
            let seg = f.seg;
            let tt = f.t - j * TRAIL_GAP;
            // Let the tail run back into the previous segment.
            while (tt < 0 && seg > 0) {
              seg -= 1;
              tt += 1;
            }
            if (tt < 0) {
              el.setAttribute("opacity", "0");
              continue;
            }
            const fromId = f.route[seg];
            const toId = f.route[seg + 1];
            const a = pos[INDEX[fromId]];
            const b = pos[INDEX[toId]];
            const ei = EDGE_OF.get(`${fromId}|${toId}`) ?? 0;
            const canon = EDGES[ei];
            const c = control(pos[INDEX[canon[0]]], pos[INDEX[canon[1]]], ei, ccx, ccy);
            const u = 1 - tt;
            el.setAttribute("cx", (u * u * a.x + 2 * u * tt * c.x + tt * tt * b.x).toFixed(1));
            el.setAttribute("cy", (u * u * a.y + 2 * u * tt * c.y + tt * tt * b.y).toFixed(1));
            el.setAttribute("r", (3.4 - j * 0.9).toFixed(2));
            // Brighter the closer it gets to Jarvis.
            const progress = (seg + tt) / Math.max(1, f.route.length - 1);
            el.setAttribute("opacity", ((0.4 + 0.6 * progress) * (1 - j * 0.33)).toFixed(3));
          }
        };
        const hideTrail = (i: number) => {
          for (let j = 0; j < TRAIL; j++) {
            pulseRefs.current[i * TRAIL + j]?.setAttribute("opacity", "0");
          }
        };

        for (let i = 0; i < FLOWS; i++) {
          const f = flowRef.current[i];
          if (t < FLOW_START) {
            hideTrail(i);
            continue;
          }
          if (f.wait > 0) {
            f.wait -= dt;
            hideTrail(i);
            continue;
          }

          f.t += dt * f.speed;
          let arrived = false;
          while (f.t >= 1) {
            f.t -= 1;
            f.seg += 1;
            if (f.seg >= f.route.length - 1) {
              // Arrived. Jarvis absorbs it, then a new thread starts out on the rim.
              const r = rippleState.current[nextRipple.current];
              r.t = 0;
              nextRipple.current = (nextRipple.current + 1) % RIPPLES;
              f.route = ROUTES[Math.floor(Math.random() * ROUTES.length)];
              f.seg = 0;
              f.t = 0;
              f.wait = 0.25 + Math.random() * 1.1;
              arrived = true;
              break;
            }
          }
          if (arrived) {
            hideTrail(i);
            continue;
          }
          placeTrail(f, i);
        }

        // Absorb ripples at Jarvis.
        for (let i = 0; i < RIPPLES; i++) {
          const el = rippleRefs.current[i];
          const r = rippleState.current[i];
          if (!el) continue;
          if (r.t >= 1) {
            el.setAttribute("opacity", "0");
            continue;
          }
          r.t = Math.min(1, r.t + dt * 1.15);
          const p = r.t;
          el.setAttribute("cx", jp.x.toFixed(1));
          el.setAttribute("cy", jp.y.toFixed(1));
          el.setAttribute("r", (JARVIS_R + 4 + p * 30).toFixed(1));
          el.setAttribute("opacity", ((1 - p) * 0.42).toFixed(3));
        }
      }

      paint();
      rafRef.current = requestAnimationFrame(frame);
    };

    rafRef.current = requestAnimationFrame(frame);

    return () => {
      ro.disconnect();
      section?.removeEventListener("pointermove", onPointerMove);
      section?.removeEventListener("pointerleave", onPointerLeave);
      if (rafRef.current) cancelAnimationFrame(rafRef.current);
    };
  }, [measure, paint, reduce]);

  return (
    <section
      id="home"
      ref={sectionRef}
      className="relative min-h-[100dvh] w-full scroll-mt-16 overflow-hidden bg-ledger-white"
    >
      {/* Warm paper wash so the mesh is not floating on flat white. */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0"
        style={{
          background:
            "radial-gradient(115% 78% at 74% 38%, rgba(247,243,235,0.95) 0%, rgba(250,250,250,0) 60%)",
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

        {/* ── The mesh ─────────────────────────────────────────── */}
        <div className="relative z-10 lg:col-span-7">
          <div
            ref={fieldRef}
            className="relative h-[320px] w-full lg:h-[min(62vh,640px)]"
            role="img"
            aria-label={`A graph of your work context flowing into Jarvis, gathered from ${TOOLS.map((t) => t.label).join(", ")}.`}
          >
            <svg className="pointer-events-none absolute inset-0 h-full w-full overflow-visible">
              {/* Every edge, one path, one dash sweep. */}
              <path
                ref={pathRef}
                pathLength={1}
                fill="none"
                stroke="rgba(28,26,23,0.2)"
                strokeWidth="1"
                strokeLinecap="round"
                strokeDasharray="1"
                strokeDashoffset="1"
              />

              {/* Accent overlay for whatever the cursor is near. */}
              <path
                ref={hotRef}
                fill="none"
                stroke="#ff6020"
                strokeWidth="1.3"
                strokeLinecap="round"
                opacity="0"
              />

              {CTX.map((n, i) => (
                <motion.circle
                  key={n.id}
                  ref={(el) => {
                    dotRefs.current[i] = el;
                  }}
                  r={DOT_R}
                  fill="#1c1a17"
                  fillOpacity={0.26}
                  initial={reduce ? false : { opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{
                    duration: 0.5,
                    delay: reduce ? 0 : NODE_DELAY[INDEX[n.id]] * ASSEMBLY_S,
                    ease: EASE,
                  }}
                />
              ))}

              {Array.from({ length: FLOWS * TRAIL }).map((_, i) => (
                <circle
                  key={i}
                  ref={(el) => {
                    pulseRefs.current[i] = el;
                  }}
                  r="3.4"
                  fill="#ff6020"
                  opacity="0"
                />
              ))}

              {/* Jarvis pulls context in, and rings out each time it lands. */}
              {Array.from({ length: RIPPLES }).map((_, i) => (
                <circle
                  key={i}
                  ref={(el) => {
                    rippleRefs.current[i] = el;
                  }}
                  fill="none"
                  stroke={MARK_INK}
                  strokeWidth="1.2"
                  opacity="0"
                />
              ))}

              <motion.g
                ref={jarvisRef}
                initial={reduce ? false : { opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{
                  duration: 0.7,
                  delay: reduce ? 0 : ASSEMBLY_S * 0.92,
                  ease: EASE,
                }}
              >
                <circle r={JARVIS_R + 7} fill={MARK_INK} opacity="0.07" />
                <circle r={JARVIS_R} fill={MARK_INK} />
                <rect
                  ref={hubBarLRef}
                  x={HUB_BARS.leftX}
                  y={HUB_BARS.y}
                  width={HUB_BARS.w}
                  height={HUB_BARS.h}
                  rx={HUB_BARS.corner}
                  fill={MARK_PAPER}
                />
                <rect
                  ref={hubBarRRef}
                  x={HUB_BARS.rightX}
                  y={HUB_BARS.y}
                  width={HUB_BARS.w}
                  height={HUB_BARS.h}
                  rx={HUB_BARS.corner}
                  fill={MARK_PAPER}
                />
              </motion.g>
            </svg>

            {TOOLS.map((n, i) => (
              <motion.div
                key={n.id}
                initial={reduce ? false : { opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{
                  duration: 0.6,
                  delay: reduce ? 0 : NODE_DELAY[INDEX[n.id]] * ASSEMBLY_S,
                  ease: EASE,
                }}
                className="absolute left-0 top-0"
              >
                <div
                  ref={(el) => {
                    toolRefs.current[i] = el;
                  }}
                  className="absolute left-0 top-0 flex h-[42px] w-[42px] items-center justify-center rounded-[12px] border border-ash bg-white will-change-transform"
                  style={{
                    boxShadow:
                      "0 1px 2px rgba(28,26,23,0.05), 0 10px 26px -14px rgba(28,26,23,0.4)",
                  }}
                >
                  {n.Mark ? <n.Mark className="h-[21px] w-[21px]" /> : null}
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
