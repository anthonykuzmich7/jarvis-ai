import * as React from "react";

/*
  The Jarvis brand mark — the pause-disc.

  Geometry is the canonical construction from jarvis-ai-core:
  `Sources/JarvisGuideCore/MarkGeometry.swift` and
  `docs/superpowers/design/02-brand-identity.md` §2. Every value is a fraction
  of the disc diameter D, so the mark stays resolution independent and matches
  the macOS app pixel for pixel at any size.

    bar width   0.12 · D
    bar height  0.24 · D   (the eye-slit, centred on the disc centre)
    gap         0.12 · D
    corner      0.06 · D   (half the bar width, so the ends are stadiums)
    total span  0.36 · D wide by 0.24 · D tall, centred

  Colour note: the core spec fixes the disc to #FFFFFF with #0A0A0B bars,
  because the app is dark-first and the disc is always the light element. This
  site is light (ledger white), where a white disc would disappear, so the
  default tone here is the faithful inversion: ink disc, paper bars. The
  silhouette, which is what carries the identity, is unchanged. Use
  tone="paper" for the canonical colouring on any dark surface.
*/

/** Fractions of the disc diameter. Mirrors MarkGeometry.bar(inDiameter:). */
export const MARK = {
  barW: 0.12,
  barH: 0.24,
  gap: 0.12,
  corner: 0.06,
  /** Horizontal offset from centre to the inner edge of each bar. */
  inner: 0.06,
  /** Horizontal offset from centre to the outer edge of each bar. */
  outer: 0.18,
} as const;

export const MARK_INK = "#0A0A0B";
export const MARK_PAPER = "#FFFFFF";

type Tone = "ink" | "paper";
type Shape = "circle" | "squircle";

/**
 * Draws the two pause bars centred on (0,0) in the current user space, for a
 * disc of diameter `d`. Used by components that draw their own disc (the hero
 * hub, the orbit node) so every mark on the page shares one geometry.
 */
export function markBars(d: number) {
  return {
    w: MARK.barW * d,
    h: MARK.barH * d,
    corner: MARK.corner * d,
    leftX: -MARK.outer * d,
    rightX: MARK.inner * d,
    y: -(MARK.barH / 2) * d,
  };
}

export function JarvisMark({
  className,
  tone = "ink",
  shape = "circle",
  look,
  blink = false,
}: {
  className?: string;
  tone?: Tone;
  shape?: Shape;
  /** Where the bars are pointing, offset from the disc centre in MARK units
      — hundredths of the diameter, the same space every number above is in,
      so a caller can say `{ x: 12 }` at any rendered size and mean the same
      glance.

      The bars are the only thing that moves. The disc is the head and it
      stays where it is; shifting the whole mark would read as the logo
      sliding rather than as the thing behind it looking at you.

      Omit it and the mark renders exactly as it always has, with no extra
      groups in the SVG — the still version is what most of the site wants,
      and what any renderer without CSS transforms needs. */
  look?: { x: number; y: number };
  /** Shuts the bars for as long as it is true. A blink is scaleY, not
      opacity: the mark closes, it does not vanish. */
  blink?: boolean;
}) {
  const disc = tone === "ink" ? MARK_INK : MARK_PAPER;
  const bars = tone === "ink" ? MARK_PAPER : MARK_INK;
  // Drawn on a 100-unit disc so every number below reads as a percentage of D.
  const b = markBars(100);

  const slits = (
    <>
      <rect
        x={50 + b.leftX}
        y={50 + b.y}
        width={b.w}
        height={b.h}
        rx={b.corner}
        fill={bars}
      />
      <rect
        x={50 + b.rightX}
        y={50 + b.y}
        width={b.w}
        height={b.h}
        rx={b.corner}
        fill={bars}
      />
    </>
  );

  /* Two groups, because the two movements are not the same movement: a
     glance is slow and eased, a blink is fast and mechanical, and one
     transition cannot be both. `fill-box` puts the origin at the centre of
     the bar pair, which is the disc centre, so a blink shuts on the middle
     and a glance leaves from it. */
  const alive = Boolean(look) || blink;

  return (
    <svg viewBox="0 0 100 100" fill="none" aria-hidden className={className}>
      {shape === "circle" ? (
        <circle cx="50" cy="50" r="50" fill={disc} />
      ) : (
        // Squircle-ish tile, matching the macOS app-icon lockup.
        <rect width="100" height="100" rx="22" fill={disc} />
      )}
      {alive ? (
        <g
          style={{
            transformBox: "fill-box",
            transformOrigin: "center",
            transform: `translate(${look?.x ?? 0}px, ${look?.y ?? 0}px)`,
            transition: "transform 320ms cubic-bezier(0.16, 1, 0.3, 1)",
          }}
        >
          <g
            style={{
              transformBox: "fill-box",
              transformOrigin: "center",
              transform: `scaleY(${blink ? 0.1 : 1})`,
              transition: "transform 90ms ease-out",
            }}
          >
            {slits}
          </g>
        </g>
      ) : (
        slits
      )}
    </svg>
  );
}
