"use client";

import * as React from "react";
import { useCallback, useEffect, useRef } from "react";
import { useReducedMotion } from "framer-motion";

/*
  "Stop repeating yourself." The headline performs its own sentence.

  "repeating" carries a fan of outlined echoes of itself. They arrive spread
  apart and collapse into the one solid word, and a smolder rule strikes
  through underneath at the moment they land. Bring the cursor near and the
  repetition returns, proportional to how close you are.

  Outlines, not filled duplicates. Overlapping solid copies of the same word at
  display size read as a smear rather than as repetition; a hairline outline
  stays legible however far it overlaps.

  Lives apart from the hero that uses it so the composition can change without
  rebuilding the mechanic. Pointer listeners are on `window`, not on a parent
  section, so this drops into any layout. One rAF writes transform and opacity
  to refs, so nothing re-renders React on pointer move.
*/

const GHOSTS = 5;
const SETTLE_S = 1.15; // echoes converge over this long on load
const REACH = 420; // px of cursor influence around the word
const SPREAD_X = 0.105; // fan offset per echo, in em
const SPREAD_Y = -0.02;
// The fan never fully closes. At rest a faint echo remains, so the mechanic is
// visible to someone who never moves their cursor near the word.
const IDLE_SPREAD = 0.42;
// The cursor drives the fan well past its idle width, so approaching the word
// is a real event rather than a nudge.
const MAX_SPREAD = 1.75;

const easeOutCubic = (v: number) => 1 - Math.pow(1 - v, 3);
const smoothstep = (v: number) => v * v * (3 - 2 * v);

export function KineticHeadline({
  className,
  style,
  strokeColor = "rgba(28,26,23,0.55)",
}: {
  className?: string;
  style?: React.CSSProperties;
  /** Echo outline colour. Explicit rather than `currentColor`, because the
      ghosts set `color: transparent` to hollow themselves out and
      `currentColor` would resolve to that same transparent. Pass a light
      value on a dark ground. */
  strokeColor?: string;
}) {
  const reduce = useReducedMotion();

  const wordRef = useRef<HTMLSpanElement | null>(null);
  const ghostRefs = useRef<(HTMLSpanElement | null)[]>([]);
  const ruleRef = useRef<HTMLSpanElement | null>(null);

  const pointerRef = useRef({ x: 0, y: 0 });
  const hasPointerRef = useRef(false);
  const proximityRef = useRef(0);
  const rafRef = useRef<number | null>(null);
  // Word centre in viewport px, re-measured on resize rather than per frame.
  const wordBoxRef = useRef({ cx: 0, cy: 0, em: 16 });

  const measure = useCallback(() => {
    const el = wordRef.current;
    if (!el) return;
    const r = el.getBoundingClientRect();
    wordBoxRef.current = {
      cx: r.left + r.width / 2,
      cy: r.top + r.height / 2,
      em: parseFloat(getComputedStyle(el).fontSize) || 16,
    };
  }, []);

  const applySpread = useCallback((spread: number) => {
    const { em } = wordBoxRef.current;
    for (let i = 0; i < GHOSTS; i++) {
      const el = ghostRefs.current[i];
      if (!el) continue;
      const step = i + 1;
      const dx = SPREAD_X * em * step * spread;
      const dy = SPREAD_Y * em * step * spread;
      const scale = 1 + step * 0.014 * spread;
      const rot = step * 0.5 * spread;
      el.style.transform = `translate3d(${dx}px, ${dy}px, 0) scale(${scale}) rotate(${rot}deg)`;
      // Fade out along the fan, and away entirely once collapsed.
      el.style.opacity = `${(0.62 - step * 0.085) * Math.min(1, spread)}`;
    }
  }, []);

  useEffect(() => {
    measure();
    const ro = new ResizeObserver(measure);
    if (wordRef.current) ro.observe(wordRef.current);
    window.addEventListener("resize", measure);
    window.addEventListener("scroll", measure, { passive: true });

    // Reduced motion: the resolved state, no fan and no cursor response.
    if (reduce) {
      applySpread(IDLE_SPREAD);
      if (ruleRef.current) ruleRef.current.style.transform = "scaleX(1)";
      return () => {
        ro.disconnect();
        window.removeEventListener("resize", measure);
        window.removeEventListener("scroll", measure);
      };
    }

    const onPointerMove = (e: PointerEvent) => {
      pointerRef.current = { x: e.clientX, y: e.clientY };
      hasPointerRef.current = true;
    };
    const onPointerLeave = () => {
      hasPointerRef.current = false;
    };
    window.addEventListener("pointermove", onPointerMove);
    document.addEventListener("pointerleave", onPointerLeave);

    const start = performance.now();
    let last = start;

    const frame = (now: number) => {
      const t = (now - start) / 1000;
      const dt = Math.min(0.05, (now - last) / 1000);
      last = now;

      // Entrance: the echoes converge into the word.
      const settle = Math.min(1, t / SETTLE_S);
      const arriving = 1 - easeOutCubic(settle);

      // Cursor: the closer you get, the more the repetition returns.
      const { cx, cy } = wordBoxRef.current;
      let target = 0;
      if (hasPointerRef.current && settle >= 1) {
        const d = Math.hypot(pointerRef.current.x - cx, pointerRef.current.y - cy);
        target = smoothstep(Math.max(0, 1 - d / REACH));
      }
      const ease = Math.min(1, dt * 6);
      proximityRef.current += (target - proximityRef.current) * ease;

      const reach = IDLE_SPREAD + proximityRef.current * (MAX_SPREAD - IDLE_SPREAD);
      applySpread(Math.max(arriving, reach));

      // The rule strikes through as the echoes land.
      if (ruleRef.current) {
        const draw = easeOutCubic(Math.min(1, Math.max(0, (t - SETTLE_S * 0.55) / 0.5)));
        ruleRef.current.style.transform = `scaleX(${draw})`;
      }

      rafRef.current = requestAnimationFrame(frame);
    };
    rafRef.current = requestAnimationFrame(frame);

    return () => {
      ro.disconnect();
      window.removeEventListener("resize", measure);
      window.removeEventListener("scroll", measure);
      window.removeEventListener("pointermove", onPointerMove);
      document.removeEventListener("pointerleave", onPointerLeave);
      if (rafRef.current) cancelAnimationFrame(rafRef.current);
    };
  }, [applySpread, measure, reduce]);

  return (
    <h1
      className={
        "font-display font-semibold leading-[0.95] tracking-[-0.045em] " +
        (className ?? "")
      }
      style={style}
    >
      <span className="block">
        Stop{" "}
        <span ref={wordRef} className="relative inline-block align-baseline">
          {Array.from({ length: GHOSTS }).map((_, i) => (
            <span
              key={i}
              ref={(el) => {
                ghostRefs.current[i] = el;
              }}
              aria-hidden
              className="pointer-events-none absolute left-0 top-0 whitespace-nowrap will-change-transform"
              style={{
                opacity: 0,
                color: "transparent",
                WebkitTextStroke: `1.5px ${strokeColor}`,
              }}
            >
              repeating
            </span>
          ))}
          <span className="relative">repeating</span>
          {/* Struck through as the echoes resolve into one. */}
          <span
            ref={ruleRef}
            aria-hidden
            className="absolute bottom-[-0.115em] left-0 block w-full origin-left bg-smolder will-change-transform"
            style={{ height: "0.045em", transform: "scaleX(0)" }}
          />
        </span>
      </span>
      <span className="block">yourself.</span>
    </h1>
  );
}
