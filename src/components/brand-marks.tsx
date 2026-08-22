"use client";

import { AudioLines } from "lucide-react";

/*
  Monochrome source marks for citation chips.

  Every mark renders in `currentColor` so a chip's icon and its label are the
  same ink. That is not only tidier at 11px than four full-colour logos; it is
  necessary, because GitHub's brand colour is #181717 and would vanish against
  the terminal's coal-ink ground.

  Two mechanisms, one result:

  - SVG paths for GitHub and Linear, copied verbatim from the Simple Icons
    package (CC0-1.0, https://simpleicons.org). Copied rather than depended on,
    because pulling a 3000-icon package in for two glyphs is not a trade worth
    making, and hand-drawing brand marks is not an option.
  - A PNG alpha mask for Slack, whose mark Simple Icons does not carry (it was
    withdrawn from the set on the owner's request). The image supplies the
    shape, `currentColor` supplies the ink. `ClaudeSpark` in
    claude-code-terminal.tsx already uses this technique, so it is house
    vocabulary rather than a one-off. This only works on artwork that is a
    glyph floating in transparency: `/logos/meetings.png` is a full-bleed app
    tile, so masking it produced a solid rounded square, which is why Meetings
    is a drawn glyph below instead.
  - A lucide glyph for Meetings. "Meetings" is a category here, not a product,
    so a waveform is more honest than any one vendor's mark: the film labels
    this source "Meetings" and shows Granola, but the capability is not
    Granola-specific.

  Slack, Gmail, GitHub and Linear are trademarks of their respective owners,
  used here to depict integration. marketing/how-jarvis-works/README.md carries
  the same note for the film's title-bar icons; check each owner's brand
  guidelines before publishing publicly.
*/

const PATHS: Record<string, string> = {
  github:
    "M12 .297c-6.63 0-12 5.373-12 12 0 5.303 3.438 9.8 8.205 11.385.6.113.82-.258.82-.577 0-.285-.01-1.04-.015-2.04-3.338.724-4.042-1.61-4.042-1.61C4.422 18.07 3.633 17.7 3.633 17.7c-1.087-.744.084-.729.084-.729 1.205.084 1.838 1.236 1.838 1.236 1.07 1.835 2.809 1.305 3.495.998.108-.776.417-1.305.76-1.605-2.665-.3-5.466-1.332-5.466-5.93 0-1.31.465-2.38 1.235-3.22-.135-.303-.54-1.523.105-3.176 0 0 1.005-.322 3.3 1.23.96-.267 1.98-.399 3-.405 1.02.006 2.04.138 3 .405 2.28-1.552 3.285-1.23 3.285-1.23.645 1.653.24 2.873.12 3.176.765.84 1.23 1.91 1.23 3.22 0 4.61-2.805 5.625-5.475 5.92.42.36.81 1.096.81 2.22 0 1.606-.015 2.896-.015 3.286 0 .315.21.69.825.57C20.565 22.092 24 17.592 24 12.297c0-6.627-5.373-12-12-12",
  linear:
    "M2.886 4.18A11.982 11.982 0 0 1 11.99 0C18.624 0 24 5.376 24 12.009c0 3.64-1.62 6.903-4.18 9.105L2.887 4.18ZM1.817 5.626l16.556 16.556c-.524.33-1.075.62-1.65.866L.951 7.277c.247-.575.537-1.126.866-1.65ZM.322 9.163l14.515 14.515c-.71.172-1.443.282-2.195.322L0 11.358a12 12 0 0 1 .322-2.195Zm-.17 4.862 9.823 9.824a12.02 12.02 0 0 1-9.824-9.824Z",
};

/* Only artwork that is a glyph in transparency belongs here. Full-bleed app
   tiles mask to a solid block. Anything added must be checked at 12px. */
const MASKS: Record<string, string> = {
  slack: "/logos/slack.png",
};

export type BrandName = "github" | "linear" | "slack" | "meetings";

export function BrandMark({
  name,
  size = 12,
  className,
}: {
  name: BrandName;
  size?: number;
  className?: string;
}) {
  if (name === "meetings") {
    return (
      <AudioLines
        width={size}
        height={size}
        strokeWidth={2}
        aria-hidden
        className={"shrink-0 " + (className ?? "")}
      />
    );
  }

  const path = PATHS[name];

  if (path) {
    return (
      <svg
        viewBox="0 0 24 24"
        width={size}
        height={size}
        fill="currentColor"
        aria-hidden
        className={"shrink-0 " + (className ?? "")}
      >
        <path d={path} />
      </svg>
    );
  }

  const mask = MASKS[name];
  if (!mask) return null;

  return (
    <span
      aria-hidden
      className={"inline-block shrink-0 " + (className ?? "")}
      style={{
        width: size,
        height: size,
        background: "currentColor",
        maskImage: `url("${mask}")`,
        WebkitMaskImage: `url("${mask}")`,
        maskSize: "100% 100%",
        WebkitMaskSize: "100% 100%",
      }}
    />
  );
}
