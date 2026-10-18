"use client";

import * as React from "react";
import Link from "next/link";
import { FilmModal } from "@/components/hero/film-modal";
import { capture } from "@/lib/analytics";

/*
  The interactive bits of the Night homepage. Everything else on the page is a
  server component; these are the only places that need the browser.
*/

/** Where every "Get started" goes: the download page, now that the app is public. */
export const GET_STARTED_HREF = "/download";

/**
 * A "Get started" (or "Sign in") button. Fires the same `early_access_clicked`
 * event the old "Get early access" buttons fired, so the funnel keeps one
 * continuous series across the redesign; `placement` says which button it was.
 */
export function GetStartedLink({
  label = "Get started",
  placement,
  className,
}: {
  label?: string;
  placement: string;
  className?: string;
}) {
  return (
    <Link
      href={GET_STARTED_HREF}
      className={className}
      onClick={() => capture("early_access_clicked", { label, placement })}
    >
      {label}
    </Link>
  );
}

/** "See how it works": opens the same film modal the old hero used. */
export function FilmButton({ placement, className }: { placement: string; className?: string }) {
  const [open, setOpen] = React.useState(false);
  return (
    <>
      <button
        type="button"
        className={className}
        onClick={() => {
          setOpen(true);
          capture("film_opened", { placement });
        }}
      >
        See how it works
      </button>
      <FilmModal open={open} onClose={() => setOpen(false)} />
    </>
  );
}

/*
  The recording pill from the Mac app: a green ring while it listens, five bars
  that move like speech (bursts of syllables, short pauses between words), and
  a stop button. Slowed to a 240ms beat so it reads as talking, not as noise.
*/
const SHAPE = [0.55, 0.85, 1, 0.8, 0.5];

export function RecordingPill() {
  const [bars, setBars] = React.useState([9, 16, 22, 14, 7]);

  React.useEffect(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    let env = 0;
    let gap = 0;
    let k = 0;
    const id = setInterval(() => {
      if (gap > 0) {
        gap--;
        env *= 0.5;
      } else if (Math.random() < 0.12) {
        gap = 1 + Math.floor(Math.random() * 3);
      } else {
        env = 0.45 + Math.random() * 0.55;
      }
      k++;
      setBars(
        SHAPE.map((s, i) => {
          const jitter = 0.55 + 0.45 * Math.abs(Math.sin(k * (0.55 + i * 0.21) + i));
          return Math.max(5, Math.round(24 * env * s * jitter));
        }),
      );
    }, 240);
    return () => clearInterval(id);
  }, []);

  return (
    <span
      style={{
        position: "relative", display: "inline-flex", alignItems: "center", gap: 14, padding: "8px 8px 8px 16px",
        borderRadius: 999, background: "#000", boxShadow: "0 0 0 2px #34D399, 0 14px 40px -10px rgba(255,96,32,0.55)",
      }}
    >
      <span aria-hidden style={{ display: "flex", alignItems: "center", gap: 3, height: 24 }}>
        {bars.map((h, i) => (
          <span key={i} className="nt-bar" style={{ height: h }} />
        ))}
      </span>
      <span style={{ fontFamily: "var(--font-geist-mono), monospace", fontSize: 13, color: "#D4D4D8" }}>Recording</span>
      <span style={{ width: 28, height: 28, borderRadius: "50%", background: "#27272A", display: "flex", alignItems: "center", justifyContent: "center" }}>
        <span style={{ width: 9, height: 9, borderRadius: 2, background: "#F87171", display: "block" }} />
      </span>
    </span>
  );
}
