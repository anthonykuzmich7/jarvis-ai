"use client";

import { useCallback, useEffect, useRef } from "react";
import { motion, useReducedMotion } from "framer-motion";

/*
  Type Hero — the headline performs its own sentence.

  "repeating" carries a fan of outlined echoes of itself. They arrive spread
  apart and collapse into the one solid word, and a smolder rule strikes
  through underneath at the moment they land. Bring the cursor near and the
  repetition returns: the echoes fan back out, proportional to how close you
  are. Move away and they resolve again.

  Outlines, not filled duplicates. Overlapping solid copies of the same word at
  display size read as a smear rather than as repetition; a hairline outline
  stays legible however far it overlaps.

  Deliberately typographic and not a diagram: OrbitSyncJarvis below already owns
  the radial "tools around Jarvis" composition, and this page has no other big
  type moment. Zero image bytes; one rAF writing transform and opacity to refs,
  so nothing re-renders React on pointer move.
*/

const EASE = [0.16, 1, 0.3, 1] as const;
const GHOSTS = 5;
const SETTLE_S = 1.15; // echoes converge over this long on load
const REACH = 420; // px of cursor influence around the word
const SPREAD_X = 0.105; // fan offset per echo, in em
const SPREAD_Y = -0.02;
// The fan never fully closes. At rest a faint echo remains, so the mechanic is
// visible to someone who never moves their cursor near the word.
const IDLE_SPREAD = 0.42;
// The cursor drives the fan well past its idle width, so approaching the word
// is a real event rather than a nudge. Without this the idle floor swallows
// most of the range and the interaction reads as dead.
const MAX_SPREAD = 1.75;

const easeOutCubic = (v: number) => 1 - Math.pow(1 - v, 3);
const smoothstep = (v: number) => v * v * (3 - 2 * v);

export function TypeHero() {
  const reduce = useReducedMotion();

  const sectionRef = useRef<HTMLElement | null>(null);
  const wordRef = useRef<HTMLSpanElement | null>(null);
  const ghostRefs = useRef<(HTMLSpanElement | null)[]>([]);
  const ruleRef = useRef<HTMLSpanElement | null>(null);
  const glowRef = useRef<HTMLDivElement | null>(null);

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

    // Reduced motion: the resolved state, no fan and no cursor response.
    if (reduce) {
      applySpread(IDLE_SPREAD);
      if (ruleRef.current) ruleRef.current.style.transform = "scaleX(1)";
      return () => {
        ro.disconnect();
        window.removeEventListener("resize", measure);
      };
    }

    const onPointerMove = (e: PointerEvent) => {
      pointerRef.current = { x: e.clientX, y: e.clientY };
      hasPointerRef.current = true;
    };
    const onPointerLeave = () => {
      hasPointerRef.current = false;
    };
    const section = sectionRef.current;
    section?.addEventListener("pointermove", onPointerMove);
    section?.addEventListener("pointerleave", onPointerLeave);

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

      // A warm light that follows the cursor, for depth on flat paper.
      if (glowRef.current && hasPointerRef.current) {
        glowRef.current.style.transform = `translate3d(${pointerRef.current.x - 460}px, ${pointerRef.current.y - 460}px, 0)`;
      }

      rafRef.current = requestAnimationFrame(frame);
    };
    rafRef.current = requestAnimationFrame(frame);

    return () => {
      ro.disconnect();
      window.removeEventListener("resize", measure);
      section?.removeEventListener("pointermove", onPointerMove);
      section?.removeEventListener("pointerleave", onPointerLeave);
      if (rafRef.current) cancelAnimationFrame(rafRef.current);
    };
  }, [applySpread, measure, reduce]);

  return (
    <section
      id="home"
      ref={sectionRef}
      className="relative min-h-[100dvh] w-full overflow-hidden scroll-mt-16 bg-ledger-white"
    >
      {/* Paper catching light, tracking the cursor. */}
      <div
        ref={glowRef}
        aria-hidden
        className="pointer-events-none absolute left-0 top-0 h-[920px] w-[920px] will-change-transform"
        style={{
          background:
            "radial-gradient(circle at center, rgba(247,243,235,0.85) 0%, rgba(189,216,255,0.16) 38%, rgba(250,250,250,0) 66%)",
        }}
      />

      <div className="relative mx-auto flex min-h-[100dvh] max-w-[1400px] flex-col justify-center px-6 pt-24 pb-16">
        <motion.h1
          initial={reduce ? false : { opacity: 0, y: 26 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.9, ease: EASE }}
          className="font-display font-semibold leading-[0.92] tracking-[-0.045em] text-coal-ink"
          style={{ fontSize: "clamp(52px, 9.6vw, 164px)" }}
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
                    WebkitTextStroke: "1.5px rgba(28,26,23,0.55)",
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
        </motion.h1>

        <motion.p
          initial={reduce ? false : { opacity: 0, y: 18 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.9, delay: 0.14, ease: EASE }}
          className="mt-10 max-w-[44ch] text-[18px] leading-[1.55] tracking-[-0.17px] text-slate-mid text-pretty"
        >
          To your AI, and to your team. Jarvis holds your context and hands it to
          whoever asks.
        </motion.p>

        <motion.div
          initial={reduce ? false : { opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.9, delay: 0.24, ease: EASE }}
          className="mt-10"
        >
          <a
            href="#waitlist"
            className="cta-shine relative inline-flex cursor-pointer items-center overflow-hidden whitespace-nowrap rounded-full bg-coal-ink px-8 py-4 text-sm font-semibold leading-none tracking-[-0.14px] text-white transition-colors hover:bg-graphite active:scale-[0.98]"
          >
            Get early access
          </a>
        </motion.div>
      </div>
    </section>
  );
}
