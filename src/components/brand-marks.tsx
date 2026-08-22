"use client";

import { AudioLines } from "lucide-react";

/*
  Monochrome source marks for citation chips.

  Every mark renders in `currentColor` so a chip's icon and its label are the
  same ink. That is not only tidier at 11px than four full-colour logos; it is
  necessary, because GitHub's brand colour is #181717 and would vanish against
  the terminal's coal-ink ground.

  Two mechanisms, one result:

  - SVG paths for GitHub, Linear, Claude and Cursor, copied verbatim from the
    Simple Icons package (CC0-1.0, https://simpleicons.org). Copied rather than
    depended on, because pulling a 3000-icon package in for four glyphs is not
    a trade worth making, and hand-drawing brand marks is not an option.
  - PNG alpha masks for Slack and Gmail. Slack's mark Simple Icons does not
    carry (it was withdrawn from the set on the owner's request); Gmail's
    artwork was already in `/logos`. The image supplies the shape,
    `currentColor` supplies the ink. `ClaudeSpark` in
    claude-code-terminal.tsx already uses this technique, so it is house
    vocabulary rather than a one-off. This only works on artwork that is a
    glyph floating in transparency: `/logos/meetings.png` is a full-bleed app
    tile, so masking it produced a solid rounded square, which is why Meetings
    is a drawn glyph below instead. Both masks here were checked for a
    transparent corner before being added.
  - A lucide glyph for Meetings. "Meetings" is a category here, not a product,
    so a waveform is more honest than any one vendor's mark: the film labels
    this source "Meetings" and shows Granola, but the capability is not
    Granola-specific.

  Slack, Gmail, GitHub, Linear, Claude and Cursor are trademarks of their
  respective owners, used here to depict integration. marketing/how-jarvis-works/README.md carries
  the same note for the film's title-bar icons; check each owner's brand
  guidelines before publishing publicly.
*/

const PATHS: Record<string, string> = {
  github:
    "M12 .297c-6.63 0-12 5.373-12 12 0 5.303 3.438 9.8 8.205 11.385.6.113.82-.258.82-.577 0-.285-.01-1.04-.015-2.04-3.338.724-4.042-1.61-4.042-1.61C4.422 18.07 3.633 17.7 3.633 17.7c-1.087-.744.084-.729.084-.729 1.205.084 1.838 1.236 1.838 1.236 1.07 1.835 2.809 1.305 3.495.998.108-.776.417-1.305.76-1.605-2.665-.3-5.466-1.332-5.466-5.93 0-1.31.465-2.38 1.235-3.22-.135-.303-.54-1.523.105-3.176 0 0 1.005-.322 3.3 1.23.96-.267 1.98-.399 3-.405 1.02.006 2.04.138 3 .405 2.28-1.552 3.285-1.23 3.285-1.23.645 1.653.24 2.873.12 3.176.765.84 1.23 1.91 1.23 3.22 0 4.61-2.805 5.625-5.475 5.92.42.36.81 1.096.81 2.22 0 1.606-.015 2.896-.015 3.286 0 .315.21.69.825.57C20.565 22.092 24 17.592 24 12.297c0-6.627-5.373-12-12-12",
  claude:
    "m4.7144 15.9555 4.7174-2.6471.079-.2307-.079-.1275h-.2307l-.7893-.0486-2.6956-.0729-2.3375-.0971-2.2646-.1214-.5707-.1215-.5343-.7042.0546-.3522.4797-.3218.686.0608 1.5179.1032 2.2767.1578 1.6514.0972 2.4468.255h.3886l.0546-.1579-.1336-.0971-.1032-.0972L6.973 9.8356l-2.55-1.6879-1.3356-.9714-.7225-.4918-.3643-.4614-.1578-1.0078.6557-.7225.8803.0607.2246.0607.8925.686 1.9064 1.4754 2.4893 1.8336.3643.3035.1457-.1032.0182-.0728-.164-.2733-1.3539-2.4467-1.445-2.4893-.6435-1.032-.17-.6194c-.0607-.255-.1032-.4674-.1032-.7285L6.287.1335 6.6997 0l.9957.1336.419.3642.6192 1.4147 1.0018 2.2282 1.5543 3.0296.4553.8985.2429.8318.091.255h.1579v-.1457l.1275-1.706.2368-2.0947.2307-2.6957.0789-.7589.3764-.9107.7468-.4918.5828.2793.4797.686-.0668.4433-.2853 1.8517-.5586 2.9021-.3643 1.9429h.2125l.2429-.2429.9835-1.3053 1.6514-2.0643.7286-.8196.85-.9046.5464-.4311h1.0321l.759 1.1293-.34 1.1657-1.0625 1.3478-.8804 1.1414-1.2628 1.7-.7893 1.36.0729.1093.1882-.0183 2.8535-.607 1.5421-.2794 1.8396-.3157.8318.3886.091.3946-.3278.8075-1.967.4857-2.3072.4614-3.4364.8136-.0425.0304.0486.0607 1.5482.1457.6618.0364h1.621l3.0175.2247.7892.522.4736.6376-.079.4857-1.2142.6193-1.6393-.3886-3.825-.9107-1.3113-.3279h-.1822v.1093l1.0929 1.0686 2.0035 1.8092 2.5075 2.3314.1275.5768-.3218.4554-.34-.0486-2.2039-1.6575-.85-.7468-1.9246-1.621h-.1275v.17l.4432.6496 2.3436 3.5214.1214 1.0807-.17.3521-.6071.2125-.6679-.1214-1.3721-1.9246L14.38 17.959l-1.1414-1.9428-.1397.079-.674 7.2552-.3156.3703-.7286.2793-.6071-.4614-.3218-.7468.3218-1.4753.3886-1.9246.3157-1.53.2853-1.9004.17-.6314-.0121-.0425-.1397.0182-1.4328 1.9672-2.1796 2.9446-1.7243 1.8456-.4128.164-.7164-.3704.0667-.6618.4008-.5889 2.386-3.0357 1.4389-1.882.929-1.0868-.0062-.1579h-.0546l-6.3385 4.1164-1.1293.1457-.4857-.4554.0608-.7467.2307-.2429 1.9064-1.3114Z",
  cursor:
    "M11.503.131 1.891 5.678a.84.84 0 0 0-.42.726v11.188c0 .3.162.575.42.724l9.609 5.55a1 1 0 0 0 .998 0l9.61-5.55a.84.84 0 0 0 .42-.724V6.404a.84.84 0 0 0-.42-.726L12.497.131a1.01 1.01 0 0 0-.996 0M2.657 6.338h18.55c.263 0 .43.287.297.515L12.23 22.918c-.062.107-.229.064-.229-.06V12.335a.59.59 0 0 0-.295-.51l-9.11-5.257c-.109-.063-.064-.23.061-.23",
  linear:
    "M2.886 4.18A11.982 11.982 0 0 1 11.99 0C18.624 0 24 5.376 24 12.009c0 3.64-1.62 6.903-4.18 9.105L2.887 4.18ZM1.817 5.626l16.556 16.556c-.524.33-1.075.62-1.65.866L.951 7.277c.247-.575.537-1.126.866-1.65ZM.322 9.163l14.515 14.515c-.71.172-1.443.282-2.195.322L0 11.358a12 12 0 0 1 .322-2.195Zm-.17 4.862 9.823 9.824a12.02 12.02 0 0 1-9.824-9.824Z",
};

/* Only artwork that is a glyph in transparency belongs here. Full-bleed app
   tiles mask to a solid block. Anything added must be checked at 12px. */
const MASKS: Record<string, string> = {
  slack: "/logos/slack.png",
  gmail: "/logos/gmail.png",
};

/* ── Full-colour variants ────────────────────────────────────────
   Reserved for the surface pills, where a mark is naming a place you
   work rather than citing a source, and colour is what makes it read
   as that place at a glance.

   Only brands whose colour survives BOTH grounds this site puts a pill
   on qualify: the white resting pill and the coal-ink active one.
   Slack's four-colour mark and Claude's #D97757 spark both do. Cursor,
   GitHub and Linear do not — Simple Icons lists Cursor's brand colour
   as #000000, so a coloured Cursor mark would disappear the moment its
   pill went dark. Those stay on `currentColor` above and invert with
   their pill, which is the correct treatment for a near-black mark,
   not a compromise.

   The Slack artwork below is the same official SVG that
   jarvis-overlay-section.tsx and feature-showcase.tsx each carry a
   local copy of; new callers should use this one. */
export type ColorBrandName = "slack" | "claude";

export function ColorBrandMark({
  name,
  className,
}: {
  name: ColorBrandName;
  className?: string;
}) {
  if (name === "claude") {
    return (
      <svg
        viewBox="0 0 24 24"
        fill="#D97757"
        aria-hidden
        className={"shrink-0 " + (className ?? "")}
      >
        <path d={PATHS.claude} />
      </svg>
    );
  }

  return (
    <svg
      viewBox="0 0 2447.6 2452.5"
      aria-hidden
      className={"shrink-0 " + (className ?? "")}
    >
      <g clipRule="evenodd" fillRule="evenodd">
        <path d="m897.4 0c-135.3.1-244.8 109.9-244.7 245.2-.1 135.3 109.5 245.1 244.8 245.2h244.8v-245.1c.1-135.3-109.5-245.1-244.9-245.3.1 0 .1 0 0 0m0 654h-652.6c-135.3.1-244.9 109.9-244.8 245.2-.2 135.3 109.4 245.1 244.7 245.3h652.7c135.3-.1 244.9-109.9 244.8-245.2.1-135.4-109.5-245.2-244.8-245.3z" fill="#36c5f0"/>
        <path d="m2447.6 899.2c.1-135.3-109.5-245.1-244.8-245.2-135.3.1-244.9 109.9-244.8 245.2v245.3h244.8c135.3-.1 244.9-109.9 244.8-245.3zm-652.7 0v-654c.1-135.2-109.4-245-244.7-245.2-135.3.1-244.9 109.9-244.8 245.2v654c-.2 135.3 109.4 245.1 244.7 245.3 135.3-.1 244.9-109.9 244.8-245.3z" fill="#2eb67d"/>
        <path d="m1550.1 2452.5c135.3-.1 244.9-109.9 244.8-245.2.1-135.3-109.5-245.1-244.8-245.2h-244.8v245.2c-.1 135.2 109.5 245 244.8 245.2zm0-654.1h652.7c135.3-.1 244.9-109.9 244.8-245.2.2-135.3-109.4-245.1-244.7-245.3h-652.7c-135.3.1-244.9 109.9-244.8 245.2-.1 135.4 109.4 245.2 244.7 245.3z" fill="#ecb22e"/>
        <path d="m0 1553.2c-.1 135.3 109.5 245.1 244.8 245.2 135.3-.1 244.9-109.9 244.8-245.2v-245.2h-244.8c-135.3.1-244.9 109.9-244.8 245.2zm652.7 0v654c-.2 135.3 109.4 245.1 244.7 245.3 135.3-.1 244.9-109.9 244.8-245.2v-653.9c.2-135.3-109.4-245.1-244.7-245.3-135.4 0-244.9 109.8-244.8 245.1 0 0 0 .1 0 0" fill="#e01e5a"/>
      </g>
    </svg>
  );
}

export type BrandName =
  | "github"
  | "linear"
  | "slack"
  | "gmail"
  | "meetings"
  | "claude"
  | "cursor";

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
