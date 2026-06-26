"use client";

import { useEffect, useRef, useState } from "react";

export function ScrubHero() {
  const videoRef = useRef<HTMLVideoElement>(null);
  const targetTimeRef = useRef(0);
  const rafRef = useRef<number | null>(null);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;

    const startLoop = () => {
      const tick = () => {
        const v = videoRef.current;
        if (v && v.duration && !v.seeking) {
          const target = targetTimeRef.current;
          if (Math.abs(target - v.currentTime) > 0.001) {
            try {
              v.currentTime = target;
            } catch (_) {}
          }
        }
        rafRef.current = requestAnimationFrame(tick);
      };
      if (rafRef.current) cancelAnimationFrame(rafRef.current);
      rafRef.current = requestAnimationFrame(tick);
    };

    const handleLoaded = () => {
      setReady(true);
      startLoop();
    };

    if (video.readyState >= 1) {
      handleLoaded();
    } else {
      video.addEventListener("loadedmetadata", handleLoaded);
    }

    return () => {
      video.removeEventListener("loadedmetadata", handleLoaded);
      if (rafRef.current) cancelAnimationFrame(rafRef.current);
    };
  }, []);

  const setTargetFromX = (clientX: number) => {
    const video = videoRef.current;
    if (!video || !video.duration) return;
    const ratio = Math.min(Math.max(clientX / window.innerWidth, 0), 1);

    // The video is not symmetric: t=0–1.5s is an idle center pose, the left
    // animation runs t=1.5–5.5s, the center pose sits at ~t=6.5s, and the
    // right animation runs t=7.5–10s. A straight linear map sends cursor-far-
    // left to t=0 (idle/center) instead of the left animation, which is the
    // "snaps back to center" bug. Piecewise mapping fixes it:
    //   left half  (ratio 0→0.5) → t: LEFT_START → CENTER_TIME
    //   right half (ratio 0.5→1) → t: CENTER_TIME → end
    const LEFT_START = 1.5;
    const CENTER_TIME = 6.5;
    const end = video.duration - 1 / 48;

    let t: number;
    if (ratio <= 0.5) {
      t = LEFT_START + (ratio / 0.5) * (CENTER_TIME - LEFT_START);
    } else {
      t = CENTER_TIME + ((ratio - 0.5) / 0.5) * (end - CENTER_TIME);
    }
    targetTimeRef.current = t;
  };

  return (
    <section
      onMouseMove={(e) => setTargetFromX(e.clientX)}
      onTouchMove={(e) => e.touches.length && setTargetFromX(e.touches[0].clientX)}
      style={{ cursor: "ew-resize" }}
      className="relative min-h-[100dvh] w-screen overflow-hidden bg-black"
    >
      <video
        ref={videoRef}
        muted
        playsInline
        preload="auto"
        className="absolute inset-0 h-full w-full object-cover transition-opacity duration-[800ms] ease-in-out"
        style={{ opacity: ready ? 1 : 0 }}
      >
        <source src="/robot-scrub-keyframes.mp4" type="video/mp4" />
      </video>

      {!ready && (
        <div
          aria-label="Loading"
          className="absolute inset-0 flex items-center justify-center font-mono text-xs uppercase tracking-[0.3em] text-white/50"
        >
          Loading
        </div>
      )}
    </section>
  );
}
