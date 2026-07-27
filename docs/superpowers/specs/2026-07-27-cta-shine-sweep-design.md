# Nav CTA shine sweep — soft glow redesign

## Problem

The nav CTA button's shine effect (`.cta-shine` in `src/app/globals.css:121-145`, used only by the "Get early access" button in `src/components/ui/tubelight-navbar.tsx:123`) uses a skewed rectangle with a `linear-gradient` band sweeping across. The hard diagonal silhouette of the skewed rectangle reads as a distinct geometric "shard" moving through the button, which looks janky/cheap.

## Reference

Inspected `glean.com`'s "Get a demo" nav button. Its inner sweep is not a gradient bar — it's an oversized gradient-filled shape panned via `transform: translateX`, cropped by the button's own rounded/clipped bounds, idling ~80% of a 4s cycle then gliding across in the remaining ~20%. The softness comes from the shape having no hard edges of its own (gradient fades to transparent at its own boundary) plus natural cropping — not from blur.

Glean's button also has a second, separate effect — a slow rotating rainbow-gradient ring glowing behind the button's outline (via a wrapper `::before`/`::after` pair). **Out of scope** — user confirmed inner-sweep-only for this pass.

## Design

Replace the skewed-rectangle `linear-gradient` shape with a soft radial (elliptical) gradient blob:

- Shape: `radial-gradient`, elliptical, no hard edge — fades to transparent on all sides. No `skewX`, no linear band.
- Colors: keep existing brand accents (cyan `rgba(197, 244, 255, ...)` / violet `rgba(119, 126, 255, ...)`), just reshaped from a band into a soft glow.
- Motion: idle for the majority of the cycle, then glide across (translateX) rather than a quick dart — closer to Glean's ~80/20 idle/glide split than our current ~75/25 quick-flash pacing. Exact easing/duration tuned by feel during implementation, not user-specified.
- Scope: only `.cta-shine` / `.cta-shine::before` / `@keyframes cta-shine-sweep` in `src/app/globals.css`. No changes to `tubelight-navbar.tsx` or any other CTA usage (this class is only applied to the nav CTA).

## Testing

Visual only — no unit tests apply. Verify in-browser (dev server) that:
- The glow has no visible hard edge/silhouette at any point in the animation.
- It still reads as our cyan/violet brand accent, not Glean's colors.
- Idle/glide pacing feels natural, not a "flash."
