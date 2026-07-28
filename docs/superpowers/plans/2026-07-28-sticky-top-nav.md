# Sticky Top Nav Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Replace the desktop `fixed`, translucent floating pill nav with an in-flow `sticky` full-width bar (Panxo top-nav spec), eliminating the hero/nav overlap at page load, with zero blur/scrim anywhere.

**Architecture:** `NavBar` (`src/components/ui/tubelight-navbar.tsx`) forks its rendering by breakpoint: the existing bottom-fixed floating pill stays exactly as-is below `sm`, and a new `sticky top-0` full-width bar (solid white, `border-b border-ash`, ~64px tall) replaces it at `sm` and up. The Wordmark, currently a standalone `fixed` element in `page.tsx`, is passed into the desktop bar's left slot via a new `brand` prop, while the mobile fixed Wordmark placement is preserved unchanged (`sm:hidden`). Because the new bar reserves real layout height instead of floating over content, the previous `NAV_CLEARANCE`/`scroll-mt-24` values (96px, tuned for the old pill) are re-tuned to 64px to match the new bar's actual height.

**Tech Stack:** Next.js (App Router), React, Tailwind CSS v4 (CSS custom-property tokens in `globals.css`), Framer Motion (nav active-tab underline). No test runner in this project (`package.json` has only `lint`/`build`) — verification is `npm run lint`, `npm run build`, and manual browser check.

## Global Constraints

- No `backdrop-blur`, no translucent (`/90`-style) backgrounds anywhere in the new desktop bar — solid `bg-white` only, per spec.
- Desktop bar height ~60–64px, background `#ffffff`, border-bottom `1px solid var(--color-ash)` (`#f1f1f1`), matching `docs/design/panxo.md:165-170`.
- Active nav link state unchanged: `coal-ink` semibold text + 2px `coal-ink` underline via the existing `motion.div layoutId="nav-underline"`.
- CTA pill ("Get early access") unchanged: filled `coal-ink` background, `cta-shine` animation class intact.
- Mobile (`<sm`) nav and mobile Wordmark placement: byte-for-byte unchanged. Do not touch `src/components/mobile/mobile-layout.tsx` or its `scroll-mt-20` values.
- Container alignment: desktop bar's inner content uses `mx-auto max-w-6xl px-6 sm:px-8`, matching the horizontal rhythm already used by the waitlist/FAQ/footer sections in `page.tsx`.

---

### Task 1: Fork `NavBar` into mobile-pill / desktop-sticky-bar markup

**Files:**
- Modify: `src/components/ui/tubelight-navbar.tsx`

**Interfaces:**
- Consumes: existing `NavItem`, `NavBarProps` types, `activeTab` state, `goToSection` handler, `smoothScrollToId`, `cn` util — all unchanged.
- Produces: `NavBarProps` gains an optional `brand?: React.ReactNode` field, rendered only in the desktop bar's left slot. `NavBar` itself remains the default export consumed by `src/components/site-nav.tsx`.

- [ ] **Step 1: Add the `brand` prop to `NavBarProps`**

In `src/components/ui/tubelight-navbar.tsx`, update the interface:

```tsx
interface NavBarProps {
  items: NavItem[];
  className?: string;
  cta?: { label: string; url: string; icon: LucideIcon };
  brand?: React.ReactNode;
}
```

And destructure it in the component signature:

```tsx
export function NavBar({ items, className, cta, brand }: NavBarProps) {
```

- [ ] **Step 2: Update the clearance comment and constant**

Replace:

```tsx
// Matches every section's `scroll-mt-24` — the fixed nav's clearance.
const NAV_CLEARANCE = 96;
```

with:

```tsx
// Matches every section's `scroll-mt-16` and the sticky bar's own height
// (h-16 = 64px) — keeps anchor-jump targets landing just below the bar.
const NAV_CLEARANCE = 64;
```

- [ ] **Step 3: Replace the single floating-pill `return` block with two forked blocks**

Replace the entire `return ( ... )` block (currently the `<div className="fixed bottom-0 sm:bottom-auto ...">...</div>` wrapped in a `<>...</>`) with:

```tsx
  return (
    <>
      {/* Mobile: bottom-fixed floating pill — unchanged, out of scope for the sticky-bar redesign */}
      <div
        className={cn(
          "fixed bottom-0 left-1/2 z-50 mb-6 -translate-x-1/2 sm:hidden",
          className,
        )}
      >
        <div className="flex items-center gap-1 bg-white/90 border border-ash backdrop-blur-lg py-1 px-1 rounded-full shadow-[rgba(95,99,106,0.10)_0px_0px_0px_1px,rgba(43,43,48,0.08)_0px_4px_16px_0px]">
          {items.map((item) => {
            const Icon = item.icon;
            const isActive = activeTab === item.name;

            return (
              <Link
                key={item.name}
                href={item.url}
                onClick={(e) => {
                  setActiveTab(item.name);
                  goToSection(e, item.url);
                }}
                className={cn(
                  "relative shrink-0 cursor-pointer whitespace-nowrap text-sm px-5 py-2 rounded-full transition-colors tracking-[-0.14px]",
                  isActive
                    ? "font-semibold text-coal-ink"
                    : "font-medium text-graphite hover:text-coal-ink",
                )}
              >
                <span className="hidden md:inline">{item.name}</span>
                <span className="md:hidden">
                  <Icon size={18} strokeWidth={2} />
                </span>
                {isActive && (
                  <motion.div
                    layoutId="nav-underline-mobile"
                    className="absolute inset-x-5 bottom-[2px] h-[2px] rounded-full bg-coal-ink"
                    initial={false}
                    transition={{ type: "spring", stiffness: 300, damping: 30 }}
                  />
                )}
              </Link>
            );
          })}

          {cta && cta.icon && (
            <Link
              href={cta.url}
              onClick={(e) => goToSection(e, cta.url)}
              className="cta-shine relative ml-0.5 shrink-0 cursor-pointer overflow-hidden whitespace-nowrap rounded-full bg-coal-ink px-5 py-2 text-sm font-semibold tracking-[-0.14px] text-white transition-colors hover:bg-graphite"
            >
              <span className="hidden md:inline">{cta.label}</span>
              <span className="md:hidden">
                <cta.icon size={18} strokeWidth={2} />
              </span>
            </Link>
          )}
        </div>
      </div>

      {/* Desktop: sticky, opaque, full-width bar — reserves real layout height so content can never start behind it */}
      <div
        className={cn(
          "sticky top-0 z-50 hidden w-full border-b border-ash bg-white sm:block",
          className,
        )}
      >
        <div className="mx-auto flex h-16 max-w-6xl items-center justify-between px-6 sm:px-8">
          <div className="flex items-center">{brand}</div>

          <div className="flex items-center gap-1">
            {items.map((item) => {
              const isActive = activeTab === item.name;

              return (
                <Link
                  key={item.name}
                  href={item.url}
                  onClick={(e) => {
                    setActiveTab(item.name);
                    goToSection(e, item.url);
                  }}
                  className={cn(
                    "relative shrink-0 cursor-pointer whitespace-nowrap text-sm px-4 py-2 tracking-[-0.14px] transition-colors",
                    isActive
                      ? "font-semibold text-coal-ink"
                      : "font-medium text-graphite hover:text-coal-ink",
                  )}
                >
                  {item.name}
                  {isActive && (
                    <motion.div
                      layoutId="nav-underline-desktop"
                      className="absolute inset-x-4 bottom-0 h-[2px] rounded-full bg-coal-ink"
                      initial={false}
                      transition={{ type: "spring", stiffness: 300, damping: 30 }}
                    />
                  )}
                </Link>
              );
            })}
          </div>

          {cta && (
            <Link
              href={cta.url}
              onClick={(e) => goToSection(e, cta.url)}
              className="cta-shine relative shrink-0 cursor-pointer overflow-hidden whitespace-nowrap rounded-full bg-coal-ink px-5 py-2 text-sm font-semibold tracking-[-0.14px] text-white transition-colors hover:bg-graphite"
            >
              {cta.label}
            </Link>
          )}
        </div>
      </div>
    </>
  );
```

Notes on this step:
- The mobile block is a verbatim copy of the previous single-block markup (just re-scoped to `sm:hidden`, dropped the `sm:bottom-auto sm:top-0 sm:pt-5` responsive variants since it's mobile-only now) — mobile behavior must not change.
- The desktop block drops `rounded-full`, the two-layer `shadow-[...]`, `backdrop-blur-lg`, and `bg-white/90` entirely — solid `bg-white` bar, no glass chrome.
- `layoutId` values are now `nav-underline-mobile` / `nav-underline-desktop` (previously a single shared `nav-underline`) — two separate DOM trees render simultaneously (one hidden via CSS, not unmounted), so a shared `layoutId` would cause Framer Motion to animate between them incorrectly.
- Desktop CTA no longer needs the icon fallback (`CtaIcon`/`md:hidden` span) since the desktop bar always shows text — remove the now-unused `CtaIcon` destructure only if no longer referenced elsewhere in the file (it's still used in the mobile block above via `cta.icon`, so keep the import, just don't declare a separate `CtaIcon` local in this block).

- [ ] **Step 4: Remove the now-unused top-level `CtaIcon` destructure if orphaned**

Check the top of the component body:

```tsx
export function NavBar({ items, className, cta, brand }: NavBarProps) {
  const [activeTab, setActiveTab] = useState(items[0].name);
  const CtaIcon = cta?.icon;
```

Since Step 3's mobile block now references `cta.icon` directly (not a hoisted `CtaIcon` local), delete the `const CtaIcon = cta?.icon;` line — it's unused after this refactor.

- [ ] **Step 5: Run lint**

Run: `npm run lint`
Expected: no errors (in particular, no `no-unused-vars` on `CtaIcon`).

- [ ] **Step 6: Commit**

```bash
git add src/components/ui/tubelight-navbar.tsx
git commit -m "$(cat <<'EOF'
feat: replace desktop floating pill nav with sticky full-width bar

Fixes the hero/nav overlap at page load — the old fixed pill sat
outside document flow so content had no clearance from it. The new
sticky bar reserves real layout height instead, per the Panxo
top-nav spec. Mobile's bottom-fixed pill is untouched.

Co-Authored-By: Claude Sonnet 5 <noreply@anthropic.com>
EOF
)"
```

---

### Task 2: Re-tune anchor-scroll clearance from 96px to 64px

**Files:**
- Modify: `src/app/page.tsx:65,142`
- Modify: `src/components/feature-showcase.tsx:214`
- Modify: `src/components/scrub-hero.tsx:219`
- Modify: `src/components/struggles-section.tsx:237`
- Modify: `src/components/orbit-sync-jarvis.tsx:374`

**Interfaces:**
- Consumes: `NAV_CLEARANCE = 64` from Task 1 (the two values must stay in sync — this task makes the section-level Tailwind class match it).
- Produces: nothing consumed by later tasks; this is the last code change before verification.

- [ ] **Step 1: Replace `scroll-mt-24` with `scroll-mt-16` in each of the 5 files above**

In `src/app/page.tsx`, line 65:
```tsx
    <section id="waitlist" className="scroll-mt-24 bg-ledger-white">
```
becomes:
```tsx
    <section id="waitlist" className="scroll-mt-16 bg-ledger-white">
```

Line 142:
```tsx
    <section id="faq" className="scroll-mt-24 bg-ledger-white">
```
becomes:
```tsx
    <section id="faq" className="scroll-mt-16 bg-ledger-white">
```

In `src/components/feature-showcase.tsx`, line 214:
```tsx
    <section id="features" className="scroll-mt-24 bg-background">
```
becomes:
```tsx
    <section id="features" className="scroll-mt-16 bg-background">
```

In `src/components/scrub-hero.tsx`, line 219:
```tsx
      className="relative min-h-[100dvh] w-screen scroll-mt-24 overflow-hidden"
```
becomes:
```tsx
      className="relative min-h-[100dvh] w-screen scroll-mt-16 overflow-hidden"
```

In `src/components/struggles-section.tsx`, line 237:
```tsx
    <section id="problem" className="scroll-mt-24 bg-ledger-white">
```
becomes:
```tsx
    <section id="problem" className="scroll-mt-16 bg-ledger-white">
```

In `src/components/orbit-sync-jarvis.tsx`, line 374:
```tsx
      className="relative flex min-h-dvh scroll-mt-24 flex-col justify-start overflow-hidden"
```
becomes:
```tsx
      className="relative flex min-h-dvh scroll-mt-16 flex-col justify-start overflow-hidden"
```

Do NOT touch `src/components/mobile/mobile-layout.tsx` — its `scroll-mt-20` values belong to the untouched mobile nav and are unrelated to this change.

- [ ] **Step 2: Commit**

```bash
git add src/app/page.tsx src/components/feature-showcase.tsx src/components/scrub-hero.tsx src/components/struggles-section.tsx src/components/orbit-sync-jarvis.tsx
git commit -m "$(cat <<'EOF'
fix: re-tune anchor-scroll clearance to match new 64px sticky nav

scroll-mt-24 (96px) was sized for the old floating pill's visual
footprint. The sticky bar is a fixed 64px, so scroll-mt-16 now
matches NAV_CLEARANCE exactly and anchor jumps land right below it.

Co-Authored-By: Claude Sonnet 5 <noreply@anthropic.com>
EOF
)"
```

---

### Task 3: Move desktop Wordmark into the nav bar, keep mobile Wordmark untouched

**Files:**
- Modify: `src/app/page.tsx:216-218` (the standalone fixed Wordmark wrapper + `<SiteNav />` call)
- Modify: `src/components/site-nav.tsx`

**Interfaces:**
- Consumes: `brand?: React.ReactNode` prop added to `NavBar` in Task 1.
- Produces: `SiteNav` gains an optional `brand?: React.ReactNode` prop that it forwards to `NavBar`. Nothing else consumes `SiteNav`'s props beyond this.

- [ ] **Step 1: Add a `brand` passthrough prop to `SiteNav`**

Replace the full contents of `src/components/site-nav.tsx` with:

```tsx
"use client";

import type { ReactNode } from "react";
import { Home, Clock, Box, Layers, MessageSquare, Mail } from "lucide-react";
import { NavBar } from "@/components/ui/tubelight-navbar";

const navItems = [
  { name: "Home",     url: "#home",     icon: Home },
  { name: "Product",  url: "#product",  icon: Box },
  { name: "Why Jarvis", url: "#problem", icon: Clock },
  { name: "Features", url: "#features", icon: Layers },
  { name: "FAQ",      url: "#faq",      icon: MessageSquare },
];

export function SiteNav({ brand }: { brand?: ReactNode }) {
  return (
    <NavBar
      items={navItems}
      cta={{ label: "Get early access", url: "#waitlist", icon: Mail }}
      brand={brand}
    />
  );
}
```

- [ ] **Step 2: Update `src/app/page.tsx`'s `Home()` to fork the Wordmark placement**

Find (around line 212-219):

```tsx
export default function Home() {
  return (
    <>
      {/* Brand mark fixed top-left; tubelight nav floats top-center / bottom on mobile. */}
      <div className="fixed left-6 top-5 z-50 sm:left-8 sm:top-6">
        <Wordmark />
      </div>
      <SiteNav />
```

Replace with:

```tsx
export default function Home() {
  return (
    <>
      {/* Mobile only: brand mark fixed top-left, independent of the bottom-fixed pill nav. */}
      <div className="fixed left-6 top-5 z-50 sm:hidden">
        <Wordmark />
      </div>
      {/* Desktop: brand mark lives inside the sticky nav bar's left slot. */}
      <SiteNav brand={<Wordmark />} />
```

- [ ] **Step 3: Run the build to type-check the new prop wiring**

Run: `npm run build`
Expected: build succeeds with no TypeScript errors (confirms `brand` prop threads through `SiteNav` → `NavBar` with matching types).

- [ ] **Step 4: Commit**

```bash
git add src/app/page.tsx src/components/site-nav.tsx
git commit -m "$(cat <<'EOF'
feat: fold desktop Wordmark into the sticky nav bar's left slot

Mobile keeps its own fixed top-left Wordmark (unchanged, out of
scope). Desktop no longer has a separately-positioned brand mark —
it's now part of the sticky bar per the Panxo top-nav spec.

Co-Authored-By: Claude Sonnet 5 <noreply@anthropic.com>
EOF
)"
```

---

### Task 4: Manual verification in the browser

**Files:** none (verification only)

**Interfaces:**
- Consumes: the running dev server (`npm run dev`, already running on `localhost:3000` per prior session state — confirm with `lsof -nP -iTCP -sTCP:LISTEN | grep node` before assuming, restart with `npm run dev` if not running).

- [ ] **Step 1: Load `localhost:3000` at desktop width and confirm no overlap at scroll-top**

Use the browser tool to navigate to `http://localhost:3000`, resize/confirm viewport is desktop-width (>640px), and screenshot the top of the page. Confirm: the hero heading text does not overlap or render behind the nav bar; the bar is a solid white full-width strip with a visible 1px bottom border; no blur/translucency is visible anywhere in the bar.

- [ ] **Step 2: Scroll down and confirm the bar stays stuck with no seam or gap**

Scroll the page down several sections. Confirm the bar remains pinned to the top of the viewport (sticky), stays fully opaque, and no content shows through or around it.

- [ ] **Step 3: Click each nav link and confirm anchor-scroll lands just below the bar**

Click "Product", "Why Jarvis", "Features", and "FAQ" in turn. For each, confirm the target section's heading is fully visible just below the bar — not clipped underneath it, and not scrolled too far past it (this validates the `scroll-mt-16` / `NAV_CLEARANCE = 64` change from Task 2).

- [ ] **Step 4: Resize to mobile width and confirm the bottom pill nav is unaffected**

Resize the viewport to below 640px width. Confirm: the nav reverts to the bottom-fixed pill exactly as it looked before this change (icons, rounded pill, blur/translucency all still present — mobile was explicitly out of scope), and the Wordmark still appears fixed top-left.

- [ ] **Step 5: Report back**

Summarize pass/fail for each of the 4 checks above to the user, with the `localhost:3000` link for them to verify directly.
