# Landing Hero Rewrite, Trust Section, CTA Placement — Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Ship the new hero headline/subhead (direction B), a new trust-reassurance section, and one CTA-placement fix on both the desktop and mobile landing page layouts.

**Architecture:** Pure presentational changes to an existing Next.js App Router site (no test framework, no backend changes). Two existing files get copy edits (`scrub-hero.tsx`, `mobile-layout.tsx`'s `MobileHero`). One new server component (`trust-section.tsx`) gets built once and reused, unmodified, on both the desktop (`page.tsx`) and mobile (`mobile-layout.tsx`) layouts — it only uses a `sm:` breakpoint (640px), so it collapses to one column automatically inside the mobile layout without needing a separate mobile variant. One new lightweight CTA link is added inline in both layouts, matching the existing local-function-in-page.tsx pattern already used for `WaitlistSection`/`FaqSection`.

**Tech Stack:** Next.js 16 (App Router), React 19, Tailwind v4 (tokens defined in `src/app/globals.css` under `@theme inline`), no test runner — verification is `npm run lint`, `npm run build`, and manual browser checks via `npm run dev`.

## Global Constraints

- Every new color/spacing/radius value must be an existing Panxo token already used elsewhere in this codebase (see `docs/design/panxo.md` and `src/app/globals.css`) — no new hex values.
- No new npm dependencies.
- Hero CTA label stays exactly `"Get early access"` everywhere it appears (spec decision — do not change to any of the alternate CTA copy that was drafted and rejected).
- All copy is exact-match to the spec (`docs/superpowers/specs/2026-07-20-landing-hero-trust-cta-design.md`) — do not paraphrase.
- This plan does **not** touch: `OutcomesSwitch`, `FeatureShowcase`, `WaitlistSection`, `FaqSection`, `JarvisOverlaySection`'s content, or any of the dead component files. Do not "helpfully" edit these.

---

### Task 1: Desktop hero copy rewrite

**Files:**
- Modify: `src/components/scrub-hero.tsx:236-250`

**Interfaces:** None — this is a leaf presentational change inside the existing `ScrubHero` component. No new props, no new exports.

- [ ] **Step 1: Replace the hero copy block**

Find this block (lines 236–250):

```tsx
      <div className="pointer-events-none absolute inset-0 z-10 flex flex-col items-center justify-center pb-[44vh] px-6">
        <h1 className="font-display text-balance text-center text-[44px] font-semibold leading-[1.12] tracking-[-0.88px] text-coal-ink sm:text-[56px] sm:tracking-[-1.12px]">
          Stop repeating yourself.<br />To your AI — and to your team.
        </h1>
        <p className="mt-5 max-w-[600px] text-center text-[17px] leading-[1.5] tracking-[-0.17px] text-muted-foreground text-pretty">
          Jarvis connects to every tool you work in. Syncs your context locally — private, on your device. And when your AI or your teammates need to know something, it gets exactly the right context. Just tag Jarvis.
        </p>
        <a
          href="#waitlist"
          className="pointer-events-auto mt-8 rounded-full bg-coal-ink px-7 py-3.5 text-sm font-medium leading-none text-white transition-all hover:opacity-90 hover:shadow-md hover:-translate-y-px"
          style={{ cursor: "pointer" }}
        >
          Get early access
        </a>
      </div>
```

Replace it with:

```tsx
      <div className="pointer-events-none absolute inset-0 z-10 flex flex-col items-center justify-center pb-[44vh] px-6">
        <h1 className="font-display text-balance text-center text-[44px] font-semibold leading-[1.12] tracking-[-0.88px] text-coal-ink sm:text-[56px] sm:tracking-[-1.12px]">
          Slack threads. Meeting notes. Code reviews.<br />Jarvis turns all of it into three things you should do today.
        </h1>
        <p className="mt-5 max-w-[600px] text-center text-[17px] leading-[1.5] tracking-[-0.17px] text-muted-foreground text-pretty">
          Reads everything you&apos;re already cleared to see, syncs it locally, and hands your AI — and you — the context to act on it now.
        </p>
        <a
          href="#waitlist"
          className="pointer-events-auto mt-8 rounded-full bg-coal-ink px-7 py-3.5 text-sm font-medium leading-none text-white transition-all hover:opacity-90 hover:shadow-md hover:-translate-y-px"
          style={{ cursor: "pointer" }}
        >
          Get early access
        </a>
        <p className="mt-4 max-w-[420px] text-center text-[13px] leading-[1.5] text-slate-mid">
          Synced locally, scoped to what you can already see — nothing new to approve, nothing sent anywhere else.
        </p>
      </div>
```

This is the only change in this task — headline, subhead, and one new trust line added under the existing CTA. The video, floating tool icons, and scrub interaction are untouched.

- [ ] **Step 2: Verify it compiles**

Run: `npm run lint`
Expected: no errors (warnings pre-existing elsewhere in the repo are fine — do not fix unrelated lint issues in this task).

- [ ] **Step 3: Visually spot-check the new line doesn't collide with the video**

Run: `npm run dev`, open `http://localhost:3000`, view the hero at a desktop width (≥1280px).
Check: the new trust line sits fully below the CTA button and above the robot's visible face/torso in the video, with normal spacing — it should not overlap the video subject.
If it overlaps or looks cramped: increase `pb-[44vh]` to `pb-[48vh]` on the wrapping `<div>` from Step 1, save, and recheck. Do not change any other value to fix this.

- [ ] **Step 4: Commit**

```bash
git add src/components/scrub-hero.tsx
git commit -m "feat: rewrite desktop hero headline, subhead, and trust line"
```

---

### Task 2: Mobile hero copy rewrite

**Files:**
- Modify: `src/components/mobile/mobile-layout.tsx:216-229` (the `MobileHero` function)

**Interfaces:** None — leaf change inside `MobileHero`.

**Note:** The approved spec (`docs/superpowers/specs/2026-07-20-landing-hero-trust-cta-design.md`) lists only `scrub-hero.tsx` under "Files touched" for the hero copy, but `MobileHero` in this file currently duplicates the exact same old headline/subhead verbatim. Shipping the new copy on desktop while leaving the old copy live on mobile would recreate the desktop/mobile inconsistency the original audit flagged as a top finding — so this task applies the same approved copy to the second existing occurrence, using the mobile file's own sizing conventions (smaller type scale, no trailing muted-foreground class name, shorter max-width) rather than desktop's.

- [ ] **Step 1: Replace the mobile hero copy block**

Find this block (lines 216–229):

```tsx
      <div className="flex flex-col items-center px-6 pt-20 pb-8 text-center">
        <h1 className="font-display text-balance text-center text-[36px] font-semibold leading-[1.12] tracking-[-0.72px] text-coal-ink">
          Stop repeating yourself.<br />To your AI — and to your team.
        </h1>
        <p className="mt-4 max-w-[320px] text-center text-[16px] leading-[1.5] tracking-[-0.16px] text-muted-foreground text-pretty">
          Jarvis connects to every tool you work in. Syncs your context locally{" "}— private, on your device. And when your AI or your teammates need to know something, it gets exactly the right context. Just tag Jarvis.
        </p>
        <a
          href="#waitlist-mobile"
          className="mt-7 rounded-full bg-coal-ink px-7 py-3.5 text-sm font-medium leading-none text-white"
        >
          Get early access
        </a>
      </div>
```

Replace it with:

```tsx
      <div className="flex flex-col items-center px-6 pt-20 pb-8 text-center">
        <h1 className="font-display text-balance text-center text-[36px] font-semibold leading-[1.12] tracking-[-0.72px] text-coal-ink">
          Slack threads. Meeting notes. Code reviews.<br />Jarvis turns all of it into three things you should do today.
        </h1>
        <p className="mt-4 max-w-[320px] text-center text-[16px] leading-[1.5] tracking-[-0.16px] text-muted-foreground text-pretty">
          Reads everything you&apos;re already cleared to see, syncs it locally, and hands your AI — and you — the context to act on it now.
        </p>
        <a
          href="#waitlist-mobile"
          className="mt-7 rounded-full bg-coal-ink px-7 py-3.5 text-sm font-medium leading-none text-white"
        >
          Get early access
        </a>
        <p className="mt-3 max-w-[300px] text-center text-[12.5px] leading-[1.5] text-slate-mid">
          Synced locally, scoped to what you can already see — nothing new to approve, nothing sent anywhere else.
        </p>
      </div>
```

- [ ] **Step 2: Verify it compiles**

Run: `npm run lint`
Expected: no errors.

- [ ] **Step 3: Visually spot-check on a mobile viewport**

Run: `npm run dev` (if not already running), open `http://localhost:3000` in a browser at a mobile width (390×844, e.g. via devtools device toolbar).
Check: the hero copy block still fits above the robot video without the video getting visually squeezed to an awkward height. The trust line should read as a smaller, clearly secondary line under the button.
If the added line pushes the video into an unreasonably short height on a 844px-tall viewport: reduce `pt-20` to `pt-16` on the wrapping `<div>`. Do not change any other value to fix this.

- [ ] **Step 4: Commit**

```bash
git add src/components/mobile/mobile-layout.tsx
git commit -m "feat: rewrite mobile hero headline, subhead, and trust line"
```

---

### Task 3: Build the trust section component

**Files:**
- Create: `src/components/trust-section.tsx`

**Interfaces:**
- Produces: `export function TrustSection()` — a zero-props React component, default server component (no `"use client"` — it has no state, effects, or event handlers). Consumed by Task 4 (`src/app/page.tsx`) and Task 5 (`src/components/mobile/mobile-layout.tsx`).
- Consumes: `ShieldIcon`, `LaptopIcon`, `CheckIcon` from `@/components/icons` (all already exist — see `src/components/icons.tsx:117-124`, `:137-144`, `:100-106`).

- [ ] **Step 1: Create the component**

Create `src/components/trust-section.tsx`:

```tsx
import { ShieldIcon, LaptopIcon, CheckIcon } from "@/components/icons";

const PILLARS = [
  {
    Icon: ShieldIcon,
    title: "Permission-scoped access",
    body: "Jarvis only sees what you already have access to. No new permissions, no expanded reach.",
  },
  {
    Icon: LaptopIcon,
    title: "Local sync",
    body: "Your context stays synced locally, on your device. Nothing leaves without you knowing.",
  },
  {
    Icon: CheckIcon,
    title: "Human-approved next steps",
    body: "Jarvis proposes what to do next. You decide what happens — nothing executes without your review.",
  },
] as const;

export function TrustSection() {
  return (
    <section id="trust" className="scroll-mt-24 bg-ledger-white">
      <div className="mx-auto max-w-5xl px-6 py-14 sm:py-20">
        <div className="grid gap-8 sm:grid-cols-3">
          {PILLARS.map(({ Icon, title, body }) => (
            <div key={title} className="flex flex-col items-start gap-3">
              <span
                className="flex h-9 w-9 items-center justify-center rounded-full border border-ash bg-white text-graphite"
                style={{ boxShadow: "rgba(95,99,106,0.08) 0px 0px 0px 1px" }}
              >
                <Icon className="h-4 w-4" />
              </span>
              <h3 className="text-[15px] font-semibold leading-[1.3] tracking-[-0.2px] text-coal-ink">
                {title}
              </h3>
              <p className="text-[13.5px] leading-[1.6] text-slate-mid">
                {body}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
```

This matches the spec's three pillars exactly (permission-scoped access, local sync, human-approved next steps), uses only existing Panxo tokens (`bg-ledger-white`, `border-ash`, `text-graphite`, `text-coal-ink`, `text-slate-mid`, and the existing `rgba(95,99,106,0.08) 0px 0px 0px 1px` hairline-shadow value already used identically in `src/app/page.tsx`'s FAQ accordion icon), and only uses a `sm:` breakpoint so it renders as a single stacked column below 640px without any mobile-specific code.

- [ ] **Step 2: Verify it compiles**

Run: `npm run lint`
Expected: no errors. (The component isn't imported anywhere yet, so no visual check is possible until Task 4/5 — that's expected and fine.)

- [ ] **Step 3: Commit**

```bash
git add src/components/trust-section.tsx
git commit -m "feat: add TrustSection component"
```

---

### Task 4: Wire the trust section and inline CTA into the desktop page

**Files:**
- Modify: `src/app/page.tsx`

**Interfaces:**
- Consumes: `TrustSection` from `src/components/trust-section.tsx` (Task 3).

- [ ] **Step 1: Import `TrustSection`**

At the top of `src/app/page.tsx`, find:

```tsx
import { ScrubHero } from "@/components/scrub-hero";
import { StrugglesSection } from "@/components/struggles-section";
import { OrbitSyncJarvis } from "@/components/orbit-sync-jarvis";
```

Replace with:

```tsx
import { ScrubHero } from "@/components/scrub-hero";
import { StrugglesSection } from "@/components/struggles-section";
import { TrustSection } from "@/components/trust-section";
import { OrbitSyncJarvis } from "@/components/orbit-sync-jarvis";
```

- [ ] **Step 2: Add the inline CTA local component**

Find the `WaitlistSection` function definition (currently starts around line 63):

```tsx
function WaitlistSection() {
```

Immediately above it, add a new local component:

```tsx
function InlineCta() {
  return (
    <div className="flex justify-center bg-ledger-white py-10">
      <a
        href="#waitlist"
        className="rounded-full border border-ash bg-white px-6 py-3 text-sm font-medium text-coal-ink transition-all hover:border-fossil hover:-translate-y-px"
        style={{ boxShadow: "rgba(95,99,106,0.08) 0px 0px 0px 1px" }}
      >
        Get early access
      </a>
    </div>
  );
}

function WaitlistSection() {
```

- [ ] **Step 3: Insert `TrustSection` and `InlineCta` into the page**

Find the desktop `<main>` block:

```tsx
      <main className="hidden md:flex flex-1 flex-col">
        <ScrubHero />
        <StrugglesSection />
        <OrbitSyncJarvis />
        <JarvisOverlaySection />
        <FeatureShowcase />
        <OutcomesSwitch />
        <WaitlistSection />
        <FaqSection />
      </main>
```

Replace with:

```tsx
      <main className="hidden md:flex flex-1 flex-col">
        <ScrubHero />
        <StrugglesSection />
        <TrustSection />
        <OrbitSyncJarvis />
        <InlineCta />
        <JarvisOverlaySection />
        <FeatureShowcase />
        <OutcomesSwitch />
        <WaitlistSection />
        <FaqSection />
      </main>
```

This places `TrustSection` right after the problem section and before the mechanism section, and `InlineCta` right after the mechanism section — exactly the two boundaries from the spec.

- [ ] **Step 4: Verify it compiles**

Run: `npm run lint`
Expected: no errors.

Run: `npm run build`
Expected: build succeeds with no type errors.

- [ ] **Step 5: Visually verify on desktop**

Run: `npm run dev`, open `http://localhost:3000` at a desktop width (≥1280px).
Check:
- Scrolling past the problem section (tabbed Technical/Non-technical demo), the new three-pillar trust section appears before the orbit/mechanism section, reads calmly (not competing visually with the sections around it), and uses the same warm-paper background as its neighbors.
- After the orbit section's Claude Code demo card, the new "Get early access" ghost-style link appears, centered, before the ⌘J overlay section begins.
- Click both the trust section area (no interactive elements expected there) and the new inline CTA link — the inline CTA must scroll smoothly to the waitlist form at the bottom (`#waitlist`).

- [ ] **Step 6: Commit**

```bash
git add src/app/page.tsx
git commit -m "feat: add trust section and inline CTA to desktop landing page"
```

---

### Task 5: Wire the trust section and inline CTA into the mobile page

**Files:**
- Modify: `src/components/mobile/mobile-layout.tsx`

**Interfaces:**
- Consumes: `TrustSection` from `src/components/trust-section.tsx` (Task 3).

- [ ] **Step 1: Import `TrustSection`**

At the top of `src/components/mobile/mobile-layout.tsx`, find:

```tsx
import { WaitlistForm } from "@/components/waitlist-form";
import { CheckIcon } from "@/components/icons";
```

Replace with:

```tsx
import { WaitlistForm } from "@/components/waitlist-form";
import { CheckIcon } from "@/components/icons";
import { TrustSection } from "@/components/trust-section";
```

- [ ] **Step 2: Add the inline CTA local component**

Find the `MobileFeatures` function definition (search for `function MobileFeatures()`), and immediately above it, add:

```tsx
function MobileInlineCta() {
  return (
    <div className="flex justify-center bg-ledger-white px-6 py-10">
      <a
        href="#waitlist-mobile"
        className="rounded-full border border-ash bg-white px-6 py-3 text-sm font-medium text-coal-ink transition-all"
        style={{ boxShadow: "rgba(95,99,106,0.08) 0px 0px 0px 1px" }}
      >
        Get early access
      </a>
    </div>
  );
}

function MobileFeatures() {
```

(Same visual treatment as desktop's `InlineCta`, minus the `hover:` classes since they're irrelevant on touch devices — this matches how other mobile components in this file already drop desktop-only hover states, e.g. `MobileHero`'s CTA button has no `hover:` classes while `ScrubHero`'s does.)

- [ ] **Step 3: Insert `TrustSection` and `MobileInlineCta` into the mobile layout**

Find the `MobileLayout` export at the bottom of the file:

```tsx
export function MobileLayout() {
  return (
    <div className="flex flex-col bg-ledger-white">
      <MobileHero />
      <MobileProblem />
      <MobileContextLayer />
      <MobileFeatures />
      <MobileOutcomes />
      <MobileWaitlist />
      <MobileFaq />
      <MobileFooter />
    </div>
  );
}
```

Replace with:

```tsx
export function MobileLayout() {
  return (
    <div className="flex flex-col bg-ledger-white">
      <MobileHero />
      <MobileProblem />
      <TrustSection />
      <MobileContextLayer />
      <MobileInlineCta />
      <MobileFeatures />
      <MobileOutcomes />
      <MobileWaitlist />
      <MobileFaq />
      <MobileFooter />
    </div>
  );
}
```

`MobileContextLayer` is mobile's single merged mechanism section (it covers what desktop splits into `OrbitSyncJarvis` + `JarvisOverlaySection`), so `TrustSection` goes right after the problem section and before it, and `MobileInlineCta` goes right after it — the same two boundaries as desktop, adapted to mobile's collapsed section structure.

- [ ] **Step 4: Verify it compiles**

Run: `npm run lint`
Expected: no errors.

Run: `npm run build`
Expected: build succeeds with no type errors.

- [ ] **Step 5: Visually verify on a mobile viewport**

Run: `npm run dev` (if not already running), open `http://localhost:3000` at a mobile width (390×844).
Check:
- The three trust pillars stack in a single column between the problem section's chat demo and the "Connect once. Tag Jarvis anywhere." section, with normal mobile section padding (matches the `px-6 py-16`-style rhythm of neighboring mobile sections).
- The new "Get early access" link appears centered after the synced-sources card, before "One teammate, three jobs."
- Tap the new inline CTA — it must scroll to the mobile waitlist form (`#waitlist-mobile`).

- [ ] **Step 6: Commit**

```bash
git add src/components/mobile/mobile-layout.tsx
git commit -m "feat: add trust section and inline CTA to mobile landing page"
```

---

### Task 6: Full-page verification pass

**Files:** None modified — this task only verifies Tasks 1–5 together.

- [ ] **Step 1: Full build**

Run: `npm run build`
Expected: succeeds with no errors or type warnings.

- [ ] **Step 2: Full lint**

Run: `npm run lint`
Expected: no errors.

- [ ] **Step 3: Read the full page top to bottom, desktop viewport**

Run: `npm run dev`, open `http://localhost:3000` at ≥1280px width. Scroll from the hero to the footer.
Check specifically:
- Hero → Problem → Trust → Mechanism → inline CTA → Overlay → Features → Outcomes → Waitlist → FAQ, in that order, with no visual gap or double-background seam between `TrustSection` and its neighbors (`StrugglesSection` above, `OrbitSyncJarvis` below — both `bg-ledger-white`, so backgrounds should be seamless).
- No layout shift or overlap in the hero from the added trust line (already checked in Task 1, re-confirm here in context with everything else installed).
- Both the hero CTA and the new inline CTA scroll to the same waitlist form, and the form still submits correctly (submit a test email, confirm the "You're on the list" success state renders — this exercises `WaitlistForm`, which this plan did not modify, so it should still work unchanged).

- [ ] **Step 4: Read the full page top to bottom, mobile viewport (390×844)**

Same check as Step 3, adapted to the mobile section order: Hero → Problem → Trust → Context Layer → inline CTA → Features → Outcomes → Waitlist → FAQ.

- [ ] **Step 5: Confirm no unrelated sections changed**

Run: `git diff main --stat` (or `git log --stat` over the commits from this plan)
Expected: only the files listed in this plan's tasks appear — `scrub-hero.tsx`, `mobile-layout.tsx`, `trust-section.tsx`, `page.tsx`. No other component files should show changes.

- [ ] **Step 6: Final confirmation**

No commit in this task — it's verification-only. If any check in Steps 3–5 fails, go back to the relevant task above, fix it there, and re-run this task from Step 1.
