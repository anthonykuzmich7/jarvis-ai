import { ImageResponse } from "next/og";

/*
  The social card, shared by `opengraph-image` and `twitter-image`.

  The site shipped with no image of any kind, so every share — Slack, LinkedIn,
  X, iMessage — rendered a bare text stub. That matters more than usual here:
  early-stage distribution is people pasting the link, and a blank card halves
  the click-through on exactly the traffic we have.

  Drawn rather than photographed so it stays a ~30KB PNG generated at build
  time, and so the headline can change with the copy instead of needing a
  designer. Satori (what next/og renders through) supports a flexbox subset —
  hence the explicit `display: flex` on every container, which it requires on
  any element with children.

  Deliberately no custom font. Loading Geist here would mean a build-time fetch
  to Google Fonts, and a network blip during a Vercel build would fail the whole
  deploy to make a social card marginally more on-brand.
*/

export const OG_SIZE = { width: 1200, height: 630 };
export const OG_CONTENT_TYPE = "image/png";
export const OG_ALT =
  "Jarvis — AI context and memory across Slack, Gmail, and meetings.";

const INK = "#1c1a17";
const PAPER = "#fafafa";
const SMOLDER = "#ff6020";
const GRAPHITE = "#5a5957";
const STONE = "#969594";

/** The pause-disc mark, at the canonical proportions from `icon.svg`:
    bars 0.12 of the disc wide, 0.24 tall, 0.12 apart. */
function Mark({ size = 58 }: { size?: number }) {
  return (
    <div
      style={{
        width: size,
        height: size,
        borderRadius: size / 2,
        background: "#0A0A0B",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        gap: size * 0.12,
      }}
    >
      <div
        style={{
          width: size * 0.12,
          height: size * 0.24,
          borderRadius: size * 0.06,
          background: "#FFFFFF",
        }}
      />
      <div
        style={{
          width: size * 0.12,
          height: size * 0.24,
          borderRadius: size * 0.06,
          background: "#FFFFFF",
        }}
      />
    </div>
  );
}

export function ogCard() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
          background: PAPER,
          padding: 72,
        }}
      >
        {/* Brand row */}
        <div style={{ display: "flex", alignItems: "center", gap: 16 }}>
          <Mark />
          <div
            style={{
              display: "flex",
              fontSize: 36,
              fontWeight: 600,
              color: INK,
              letterSpacing: "-0.02em",
            }}
          >
            jarvis
          </div>
        </div>

        {/* Headline, with the smolder rule the hero strikes under "repeating" */}
        <div style={{ display: "flex", flexDirection: "column" }}>
          <div
            style={{
              display: "flex",
              fontSize: 88,
              fontWeight: 700,
              color: INK,
              letterSpacing: "-0.045em",
              lineHeight: 1.02,
              maxWidth: 900,
            }}
          >
            Stop repeating yourself.
          </div>
          <div
            style={{
              display: "flex",
              width: 220,
              height: 7,
              borderRadius: 4,
              background: SMOLDER,
              marginTop: 26,
            }}
          />
        </div>

        {/* Subline + domain */}
        <div
          style={{
            display: "flex",
            alignItems: "flex-end",
            justifyContent: "space-between",
          }}
        >
          <div
            style={{
              display: "flex",
              fontSize: 28,
              color: GRAPHITE,
              letterSpacing: "-0.01em",
              lineHeight: 1.35,
              maxWidth: 760,
            }}
          >
            AI context and memory across Slack, Gmail, and meetings — carried
            into Claude and every tool you work in.
          </div>
          <div style={{ display: "flex", fontSize: 22, color: STONE }}>
            jarviscontext.com
          </div>
        </div>
      </div>
    ),
    OG_SIZE,
  );
}
