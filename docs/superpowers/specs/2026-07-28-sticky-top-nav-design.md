# Sticky Top Nav — Design Spec

## Problem

The desktop nav is a `fixed`, translucent floating pill (`src/components/ui/tubelight-navbar.tsx`). Because `fixed` removes it from document flow, page content isn't aware it exists — the hero heading renders starting at `y=0` and overlaps directly behind the pill at page load / scroll-top, with no clearance. A gradient scrim was previously added to paper over the resulting seam; it was removed (it read as an unwanted blur/wash effect), which re-exposed the underlying overlap.

## Goals

- Give the nav real, permanent clearance from page content — not just a visual patch.
- No blur, no translucency, no scrim hack.
- Match the Panxo top-nav reference (`docs/design/panxo.md:165-170`): solid white bar, `1px` `#f1f1f1` border-bottom, ~60px height, wordmark left / links center / CTA right, active link = semibold + underline.
- Desktop/`sm:`-and-up scope only. Mobile's bottom-fixed floating pill nav is unchanged.

## Approach: sticky, in-flow bar (not fixed + padding)

The bar becomes the first element in the page, in normal document flow, using `position: sticky; top: 0`. Because it occupies real space in flow, everything after it in the DOM starts below it by construction — no manual clearance constant to keep in sync. This directly addresses the root cause: `fixed` positioning is what let the bar float free of layout in the first place.

Rejected alternative: keep `fixed`, add matching `padding-top`/`scroll-mt` to every section. Works, but requires hand-maintaining a clearance number in multiple places — the same class of bug that caused this issue (`NAV_CLEARANCE` drifting out of sync with the bar's actual rendered height).

## Bar anatomy

- Full-bleed width, `bg-white`, `border-b border-ash` (`#f1f1f1`, exact Panxo token), height ~60–64px, `z-50`. Opaque from the very first frame — no `backdrop-blur`, no `bg-white/90` translucency. This is structural, not just an omission: an opaque bar has nothing for content to visually show through, so there's no seam left for a scrim to paper over.
- **Left:** Wordmark — currently a separately positioned `fixed left-6 top-5` element in `src/app/page.tsx` (`Home()`, around line 216) — folds into this bar's left slot. That standalone wrapper div is removed.
- **Center/right:** nav links (Home, Product, Why Jarvis, Features, FAQ), Inter 500 14px `graphite`. Active state unchanged: `coal-ink` semibold text + 2px `coal-ink` underline via the existing `motion.div layoutId="nav-underline"` spring animation — this already matches the Panxo active-state spec, no changes needed to that logic.
- **Right:** "Get early access" CTA — same filled `coal-ink` pill, same `cta-shine` sweep animation, unchanged.
- The bar's outer container drops `rounded-full`, the two-layer `shadow-[...]`, `backdrop-blur-lg`, and `bg-white/90`. Individual nav links and the CTA keep their own pill/underline treatment — only the outer chrome that made it look like a "floating pill" goes away.

## Files affected

- `src/components/ui/tubelight-navbar.tsx` — replace the floating pill markup/positioning with the sticky full-width bar; keep the scroll-spy (`IntersectionObserver`), `smoothScrollToId`, and active-underline logic as-is.
- `src/components/site-nav.tsx` — likely unchanged (still just wires `navItems` + `cta` into the nav component), verify no floating-specific props leak through.
- `src/app/page.tsx` — remove the standalone fixed Wordmark wrapper (~line 216); pass the Wordmark into the nav bar's left slot instead.
- Anchor-scroll clearance: `NAV_CLEARANCE` (currently `96`, `tubelight-navbar.tsx:22`) and each section's `scroll-mt-24` need to be re-checked against the new bar's actual height so anchor-jump navigation still lands just below the bar rather than flush against it. Exact pixel value to be finalized in implementation (measure actual rendered bar height rather than assuming).

## Explicitly out of scope

- Mobile (`<sm`) nav: stays the current bottom-fixed floating pill, untouched.
- Panxo's announcement bar and "Sign In" link / dropdown chevrons — not applicable to this project, not being added.
- Any change to nav link labels, order, or CTA copy.

## Open implementation detail

Exact bar height (60px vs 64px) and horizontal content max-width/padding should match whatever container convention the rest of the page already uses (e.g. footer's container), to be confirmed against actual measurements during implementation rather than guessed here.
