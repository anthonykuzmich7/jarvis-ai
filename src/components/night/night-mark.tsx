import * as React from "react";

/*
  The Jarvis face for the Night homepage: a light disc with the app's two
  capsule eyes (MarkGeometry.bar in the Mac app — 3.6 × 7.2, fully rounded,
  never round dots).

  `gaze` and `blink` are optional so the static nav and footer marks and the
  live one in the app window are the same drawing.
*/

type Props = {
  size: number;
  /** The colour behind the mark; the eyes are cut in it. */
  ground?: string;
  gaze?: { x: number; y: number };
  blink?: boolean;
};

export const NightMark = React.forwardRef<SVGSVGElement, Props>(function NightMark(
  { size, ground = "#09090A", gaze, blink = false },
  ref,
) {
  const live = gaze !== undefined;
  return (
    <svg ref={ref} width={size} height={size} viewBox="0 0 30 30" aria-hidden>
      <circle cx="15" cy="15" r="15" fill="#F4F4F5" />
      <g
        style={
          live
            ? {
                transform: `translate(${gaze.x.toFixed(2)}px, ${gaze.y.toFixed(2)}px) scale(1, ${blink ? 0.12 : 1})`,
                transformBox: "fill-box",
                transformOrigin: "center",
                transition: `transform ${blink ? "70ms" : "260ms"} cubic-bezier(0.23, 1, 0.32, 1)`,
              }
            : undefined
        }
      >
        <rect x="9.6" y="11.4" width="3.6" height="7.2" rx="1.8" fill={ground} />
        <rect x="16.8" y="11.4" width="3.6" height="7.2" rx="1.8" fill={ground} />
      </g>
    </svg>
  );
});
