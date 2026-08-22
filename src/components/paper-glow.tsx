"use client";

import * as React from "react";
import { useAnimationFrame, useReducedMotion } from "framer-motion";

/*
  One light, shared by every section it is wrapped around.

  Why this exists. The hero and the Connect section each used to carry
  their own copy of this glow, absolutely positioned inside a section
  that sets `overflow-hidden` — the hero for its own composition, the
  Connect section because its intake rail runs thousands of pixels wide
  and would otherwise put a scrollbar on the document. So whenever the
  light drifted toward a section's edge it was sliced flat by that clip,
  and the cut drew a hard horizontal rule exactly where the two sections
  meet. Fading each copy out near its own boundary hid one side of it,
  but two lights that both die at the seam still leave a seam.

  The fix is structural rather than cosmetic: lift the light out of both
  sections and hang it on a wrapper that spans them. It is no longer
  inside anything that clips, so it crosses the boundary the way light
  on a single sheet of paper would, and there is nothing left to draw a
  line. The sections themselves go transparent and the wrapper carries
  the ledger-white ground, so the glow sits between the paper and the
  content rather than on top of either.

  The wrapper needs `overflow-x: clip` (not `hidden`) — `clip` is the
  one that stops horizontal bleed without turning the element into a
  scroll container, which would reintroduce vertical clipping and put
  us back where we started.

  Resting position is the centre of the viewport, not the centre of the
  wrapper. A wrapper two viewports tall centred on its own box would
  pool all the light at the seam and leave the top of the hero and the
  bottom of Connect flat, and a visitor who scrolls with a trackpad
  never emits a pointermove, so "wait for the cursor" is not a resting
  state we can rely on. Tracking the viewport means whatever you are
  looking at is lit.

  Under reduced motion the pointer is not followed at all; the light
  just holds the viewport centre, which is the same thing a fixed
  background would do.
*/

const W = 1400;
const H = 1100;

/** The hero's original recipe: warm paper core, a cool ring, then out. */
const GRADIENT =
  "radial-gradient(closest-side, rgba(247,243,235,0.9) 0%, rgba(189,216,255,0.18) 42%, rgba(250,250,250,0) 72%)";

export function PaperGlow() {
  const reduce = useReducedMotion();
  const boxRef = React.useRef<HTMLDivElement>(null);
  const glowRef = React.useRef<HTMLDivElement>(null);
  /** Latest pointer, in viewport coordinates. Null until one is seen. */
  const pointer = React.useRef<{ x: number; y: number } | null>(null);
  /** Eased light position, in box coordinates. */
  const at = React.useRef<{ x: number; y: number } | null>(null);

  React.useEffect(() => {
    if (reduce) return;
    const onMove = (e: PointerEvent) => {
      pointer.current = { x: e.clientX, y: e.clientY };
    };
    const onLeave = () => {
      pointer.current = null;
    };
    window.addEventListener("pointermove", onMove, { passive: true });
    document.addEventListener("pointerleave", onLeave);
    return () => {
      window.removeEventListener("pointermove", onMove);
      document.removeEventListener("pointerleave", onLeave);
    };
  }, [reduce]);

  useAnimationFrame(() => {
    const box = boxRef.current;
    const glow = glowRef.current;
    if (!box || !glow) return;

    /* One rect read per frame, on one element. Nothing in this loop
       writes a layout-affecting property, so it does not thrash. */
    const r = box.getBoundingClientRect();
    const vh = window.innerHeight;
    if (r.bottom < -400 || r.top > vh + 400) return;

    const p = pointer.current;
    const targetX = p ? p.x - r.left : r.width / 2;
    const targetY = p ? p.y - r.top : vh / 2 - r.top;

    if (!at.current) at.current = { x: targetX, y: targetY };
    at.current.x += (targetX - at.current.x) * 0.09;
    at.current.y += (targetY - at.current.y) * 0.09;

    /* Written as an offset from the CSS rest position, so the layout
       stays in the stylesheet and only the delta is scripted. */
    glow.style.transform =
      `translate3d(${(at.current.x - r.width / 2).toFixed(1)}px, ` +
      `${(at.current.y - r.height / 2).toFixed(1)}px, 0)`;
  });

  return (
    <div
      ref={boxRef}
      aria-hidden
      className="pointer-events-none absolute inset-0"
    >
      <div
        ref={glowRef}
        className="absolute left-1/2 top-1/2"
        style={{
          width: W,
          height: H,
          marginLeft: -W / 2,
          marginTop: -H / 2,
          willChange: "transform",
          background: GRADIENT,
        }}
      />
    </div>
  );
}
