"use client";

import React, { useEffect, useRef, useState } from "react";
import { motion } from "framer-motion";
import Link from "next/link";
import { cn } from "@/lib/utils";
import { capture } from "@/lib/analytics";

interface NavItem {
  name: string;
  url: string;
}

interface NavBarProps {
  items: NavItem[];
  className?: string;
  cta?: { label: string; url: string };
  brand?: React.ReactNode;
}

// The condensed bar's height, which every section's `scroll-mt-16` (64px) is
// already tuned to. Anchor jumps land just below the bar because these agree —
// change one and you have to change the other.
const NAV_CLEARANCE = 64;

// A plain `scrollIntoView({ behavior: "smooth" })` computes its target once
// and animates toward that fixed pixel value. Sections above the target
// (ConnectAnywhere, JarvisOverlaySection) run entrance animations that can
// still be shifting layout while the scroll is mid-flight, so the browser's
// one-shot target goes stale and we land short or long of the section.
// Recomputing the target every step makes the scroll self-correcting. Each
// step jumps instantly to its computed position — letting the ambient CSS
// `scroll-behavior: smooth` (globals.css) also animate each micro-step would
// fight this loop and stall the scroll.
//
// Driven by requestAnimationFrame rather than setTimeout. The chain used to
// re-arm with `setTimeout(step, 16)` and reliably died after exactly four
// ticks in both dev and production, landing about 55% of the way to every
// target whatever the distance or direction: taps on the nav visibly stopped
// short. Timer ids are a number shared with everything else on the page, and
// a stray clearTimeout is enough to end the chain silently. A frame callback
// is owned by this closure and cannot be cancelled by anything else.
//
// The old comment defended setTimeout on the grounds that rAF stalls in a
// hidden tab. That case is handled explicitly instead: if the document is
// hidden there is nothing to animate for, so jump to the target and settle.
function smoothScrollToId(id: string, onSettle?: () => void) {
  let cancelled = false;
  let frame: number | null = null;
  // Frames that did not move. "The page cannot scroll any further" is a run
  // of them, not a single one: sections below the fold are still animating
  // in as we pass, so one frame can land exactly where it started and the
  // next can have somewhere new to go.
  let stalled = 0;
  const startedAt = performance.now();

  function step() {
    frame = null;
    if (cancelled) return;
    const el = document.getElementById(id);
    if (!el) return onSettle?.();

    const before = window.scrollY;
    const targetY = before + el.getBoundingClientRect().top - NAV_CLEARANCE;
    const diff = targetY - before;

    if (Math.abs(diff) < 1 || document.hidden) {
      window.scrollTo({ top: targetY, behavior: "instant" });
      return onSettle?.();
    }

    // An eased step, but never one that rounds down to a standstill: the
    // last few pixels of the tail are smaller than 18% of a pixel.
    const move = diff * 0.18;
    window.scrollTo({
      top: before + (Math.abs(move) < 1 ? Math.sign(diff) : move),
      behavior: "instant",
    });

    stalled = Math.abs(window.scrollY - before) < 0.5 ? stalled + 1 : 0;
    // Hard safety nets: a target that can never be reached (it sits past the
    // document's bottom, e.g. FAQ on a short page) and a wall-clock budget.
    if (stalled >= 4 || performance.now() - startedAt > 2000) {
      return onSettle?.();
    }

    frame = requestAnimationFrame(step);
  }

  step();
  // Returning a canceller is the whole point: two of these chains running at
  // once both call window.scrollTo every frame toward different targets, and
  // the page judders between them. A new navigation must kill the old one.
  return () => {
    cancelled = true;
    if (frame !== null) cancelAnimationFrame(frame);
  };
}

export function NavBar({ items, className, cta, brand }: NavBarProps) {
  const [activeTab, setActiveTab] = useState(items[0].name);
  // Flush and transparent over the hero; condensed glass once you leave it.
  const [lifted, setLifted] = useState(false);
  // The mobile sections sheet.
  const [menuOpen, setMenuOpen] = useState(false);
  // Cancels the scroll currently in flight, if any.
  const cancelScrollRef = useRef<(() => void) | null>(null);
  // While a click-driven scroll runs, the clicked tab owns the marker. Without
  // this the sections we fly PAST each claim it in turn (Product to Features
  // crosses "Why Jarvis"), so the marker ricochets instead of moving once.
  const navigatingRef = useRef(false);
  const navTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  // Next's Link hash-scroll can misfire while the underline layout animation
  // is running (wrong target, or no scroll at all), so we drive the scroll
  // ourselves and just use the href for the URL/history update.
  const endNavigation = () => {
    navigatingRef.current = false;
    cancelScrollRef.current?.();
    cancelScrollRef.current = null;
    if (navTimeoutRef.current) {
      clearTimeout(navTimeoutRef.current);
      navTimeoutRef.current = null;
    }
  };

  const goToSection = (e: React.MouseEvent, url: string) => {
    if (!url.startsWith("#") || url.length < 2) return;
    const id = url.slice(1);
    if (!document.getElementById(id)) return;
    e.preventDefault();
    endNavigation();
    navigatingRef.current = true;
    cancelScrollRef.current = smoothScrollToId(id, endNavigation);
    // Hard release. If the chain never settles — a target that cannot be
    // reached, a throttled tab — the lock must not strand the scroll-spy
    // permanently pinned to the last clicked tab.
    navTimeoutRef.current = setTimeout(endNavigation, 2500);
    history.pushState(null, "", url);
  };

  // Top-of-page sentinel. Replaces a scroll listener: a listener fires on
  // every scroll frame and cannot be batched, where this wakes twice — once
  // leaving the top, once returning.
  useEffect(() => {
    const sentinel = document.createElement("div");
    sentinel.setAttribute("aria-hidden", "true");
    sentinel.style.cssText =
      "position:absolute;top:0;left:0;width:1px;height:28px;pointer-events:none;";
    document.body.prepend(sentinel);

    const io = new IntersectionObserver(
      (entries) => {
        const atTop = entries[0]?.isIntersecting ?? true;
        setLifted(!atTop);
        // At the very top the first tab owns the bar, whatever the section
        // band below happens to report — unless a click is mid-flight.
        if (atTop && items[0] && !navigatingRef.current) {
          setActiveTab(items[0].name);
        }
      },
      { threshold: 0 },
    );
    io.observe(sentinel);
    return () => {
      io.disconnect();
      sentinel.remove();
    };
  }, [items]);

  // Scroll-spy: light up (and spring the marker to) the section in view.
  useEffect(() => {
    const sectionItems = items.filter(
      (item) => item.url.startsWith("#") && item.url.length > 1,
    );

    const elements = sectionItems
      .map((item) => {
        const el = document.getElementById(item.url.slice(1));
        return el ? { item, el } : null;
      })
      .filter(
        (entry): entry is { item: NavItem; el: HTMLElement } => entry !== null,
      );

    // Decide from geometry, not from which entry happened to be last in the
    // batch. IntersectionObserver does not order `entries`, so "last
    // intersecting wins" flips between two sections that share the band and
    // the marker jitters. The active section is simply the last one in
    // document order whose top has passed the decision line.
    const pickActive = () => {
      if (navigatingRef.current) return;
      const line = window.innerHeight * 0.4;
      let chosen: NavItem | null = null;
      for (const { item, el } of elements) {
        if (el.getBoundingClientRect().top <= line) chosen = item;
      }
      if (chosen) setActiveTab(chosen.name);
    };

    const observer = new IntersectionObserver(pickActive, {
      // A thin band near the top of the viewport wakes the decision.
      rootMargin: "-40% 0px -55% 0px",
      threshold: 0,
    });

    elements.forEach(({ el }) => observer.observe(el));
    return () => observer.disconnect();
  }, [items]);

  // A wheel or touch means the user has taken over. Stop the programmatic
  // scroll rather than fighting it, and give the spy back immediately.
  useEffect(() => {
    const takeOver = () => {
      if (navigatingRef.current) endNavigation();
    };
    window.addEventListener("wheel", takeOver, { passive: true });
    window.addEventListener("touchstart", takeOver, { passive: true });
    return () => {
      window.removeEventListener("wheel", takeOver);
      window.removeEventListener("touchstart", takeOver);
    };
  }, []);

  // Escape closes the sheet, and so does a resize past the breakpoint where
  // the sheet stops rendering: without that the bar keeps the glass it wears
  // while open, and re-narrowing the window reveals a menu nobody asked for.
  useEffect(() => {
    if (!menuOpen) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setMenuOpen(false);
    };
    const mq = window.matchMedia("(min-width: 768px)");
    const onWide = () => {
      if (mq.matches) setMenuOpen(false);
    };
    window.addEventListener("keydown", onKey);
    mq.addEventListener("change", onWide);
    return () => {
      window.removeEventListener("keydown", onKey);
      mq.removeEventListener("change", onWide);
    };
  }, [menuOpen]);

  // Never leave a scroll chain or timer running after the bar goes away.
  useEffect(() => () => endNavigation(), []);

  return (
    <>
      {/* The mobile/desktop switch is `md` (768px), not `sm`. Measured at
          640px, the desktop bar's three columns come to 661px of content in
          a 592px gutter: brand, links and CTA sat flush against each other
          and the CTA ran 21px off the right edge. 768 is the first width
          where the bar has room to breathe, and the pill below is happier
          in that range anyway. */}

      {/* Mobile: one bar, carrying the same three things the desktop bar
          carries — brand, sections, CTA — with the sections behind a menu
          because five labels do not fit on a 390px line.

          What this replaces: a bottom-fixed pill of six bare icons. It
          invented a second navigation language for small screens that the
          desktop never speaks, and the icons were not decodable — a box for
          "Product", a clock for "Why Jarvis", layers for "Features", an
          envelope for "Get early access". The labels are the navigation;
          the sheet just holds them until asked.

          Transparent over the hero, glass once you have left it or once
          the sheet is open, so the panel reads as hanging off the bar
          rather than floating free. */}
      <header
        className={cn(
          // `fixed` is itself a positioned ancestor, so the panel below can
          // hang off it with `absolute top-full` without a `relative` here.
          "fixed top-0 z-50 w-full md:hidden",
          "transition-[background-color,border-color,box-shadow] duration-300 ease-out",
          lifted || menuOpen
            ? "border-b border-ash bg-ledger-white/85 shadow-[0_1px_20px_-8px_rgba(28,26,23,0.18)] backdrop-blur-xl backdrop-saturate-150"
            : "border-b border-transparent bg-transparent",
          className,
        )}
      >
        <div className="flex h-14 items-center justify-between gap-2 px-4">
          <div className="flex min-w-0 items-center">{brand}</div>

          <div className="flex shrink-0 items-center gap-2">
            {cta && (
              /* The desktop CTA, at desktop wording and with the same shine
                 sweep. It stays on the bar rather than moving into the sheet:
                 a CTA you have to open a menu to find is not a CTA. */
              <Link
                href={cta.url}
                onClick={(e) => {
                  /* Named rather than left to autocapture: this button and the
                     desktop one below are the same CTA with different classes,
                     and a funnel wants them counted as one thing that knows
                     which breakpoint it was pressed at. */
                  capture("nav_cta_clicked", {
                    label: cta.label,
                    placement: "mobile_bar",
                  });
                  setMenuOpen(false);
                  goToSection(e, cta.url);
                }}
                className="cta-shine relative shrink-0 cursor-pointer overflow-hidden whitespace-nowrap rounded-full bg-coal-ink px-3.5 py-2 text-[13px] font-semibold tracking-[-0.14px] text-white transition-colors hover:bg-graphite active:scale-[0.98]"
              >
                {cta.label}
              </Link>
            )}

            <button
              type="button"
              aria-label={menuOpen ? "Close menu" : "Open menu"}
              aria-expanded={menuOpen}
              aria-controls="mobile-nav-sheet"
              onClick={() => setMenuOpen((open) => !open)}
              className="flex h-9 w-9 shrink-0 cursor-pointer items-center justify-center rounded-full border border-black/10 text-coal-ink transition-colors hover:border-black/20 active:scale-[0.96]"
            >
              {/* Two bars, not three. The third is the hamburger's decoration,
                  and at 18px it closes the gaps into a smudge. */}
              <span aria-hidden className="relative block h-[10px] w-[16px]">
                <span
                  className={cn(
                    "absolute left-0 block h-[1.5px] w-full rounded-full bg-current transition-transform duration-300 ease-out",
                    menuOpen ? "top-[4px] rotate-45" : "top-0",
                  )}
                />
                <span
                  className={cn(
                    "absolute left-0 block h-[1.5px] w-full rounded-full bg-current transition-transform duration-300 ease-out",
                    menuOpen ? "top-[4px] -rotate-45" : "top-[8px]",
                  )}
                />
              </span>
            </button>
          </div>
        </div>

        {/* The panel hangs off the bar rather than growing it: `absolute`
            under `top-full`, so the bar stays 56px whether or not the sheet
            is open and the page underneath does not reflow.

            Always mounted, shown with a CSS transition on opacity and
            transform, `inert` while closed so its links leave the tab order
            and the screen-reader tree. Two earlier versions used
            AnimatePresence and both left the panel in the DOM forever: the
            exit ran to completion (opacity 0, translated up) but the child
            was never unmounted, which also stranded an invisible
            full-screen backdrop over the page that swallowed every tap.
            Five links are cheap to keep mounted, and a CSS transition
            cannot fail to resolve. */}
        <nav
          id="mobile-nav-sheet"
          aria-label="Sections"
          inert={!menuOpen}
          className={cn(
            "absolute left-0 right-0 top-full origin-top border-b border-ash bg-ledger-white/95 shadow-[0_16px_40px_-24px_rgba(28,26,23,0.35)] backdrop-blur-xl backdrop-saturate-150",
            "transition-[opacity,transform] duration-300 ease-out",
            menuOpen
              ? "translate-y-0 opacity-100"
              : "pointer-events-none -translate-y-2 opacity-0",
          )}
        >
          <div className="flex flex-col px-4 py-2">
            {items.map((item) => {
              const isActive = activeTab === item.name;
              return (
                <Link
                  key={item.name}
                  href={item.url}
                  aria-current={isActive ? "true" : undefined}
                  onClick={(e) => {
                    setActiveTab(item.name);
                    setMenuOpen(false);
                    goToSection(e, item.url);
                  }}
                  className={cn(
                    "cursor-pointer py-3 text-[17px] tracking-[-0.2px] transition-colors",
                    isActive
                      ? "font-semibold text-coal-ink"
                      : "font-medium text-graphite",
                  )}
                >
                  {/* The marker is the desktop's: a 2px smolder rule under
                      the label. `inline-block` so it measures the word, not
                      the full-width row. Static, unlike the desktop's, which
                      carries a `layoutId` so it can slide between tabs on
                      one line — here there is nothing to slide to, because
                      the active item only changes while you scroll and the
                      sheet is shut then. */}
                  <span className="relative inline-block">
                    {item.name}
                    {isActive ? (
                      <span className="absolute -bottom-[3px] left-0 block h-[2px] w-full rounded-full bg-smolder" />
                    ) : null}
                  </span>
                </Link>
              );
            })}
          </div>
        </nav>
      </header>

      {/* Tap-anywhere-else to dismiss. Under the bar, over everything else.
          `aria-hidden` and not focusable: it is a convenience, and the two
          real affordances (the toggle button, Escape) are both keyboard
          reachable. */}
      <div
        aria-hidden
        onClick={() => setMenuOpen(false)}
        className={cn(
          "fixed inset-0 z-40 bg-coal-ink/10 backdrop-blur-[2px] transition-opacity duration-200 md:hidden",
          menuOpen ? "opacity-100" : "pointer-events-none opacity-0",
        )}
      />

      {/* Desktop: fixed bar. Fixed rather than sticky so it reserves no layout
          height, which lets the hero actually occupy a full 100dvh instead of
          starting 64px down. */}
      <header
        className={cn(
          "fixed top-0 z-50 hidden w-full md:block",
          "transition-[height,background-color,border-color,box-shadow] duration-300 ease-out",
          lifted
            ? "h-16 border-b border-ash bg-ledger-white/80 shadow-[0_1px_20px_-8px_rgba(28,26,23,0.18)] backdrop-blur-xl backdrop-saturate-150"
            : "h-[76px] border-b border-transparent bg-transparent",
          className,
        )}
      >
        {/* Three explicit columns so the links sit optically dead-centre
            whatever the brand and CTA happen to measure. justify-between
            centres nothing. */}
        <div className="mx-auto grid h-full max-w-[1400px] grid-cols-[1fr_auto_1fr] items-center px-6">
          <div className="flex items-center">{brand}</div>

          <nav className="flex items-center gap-0.5" aria-label="Sections">
            {items.map((item) => {
              const isActive = activeTab === item.name;

              return (
                <Link
                  key={item.name}
                  href={item.url}
                  aria-current={isActive ? "true" : undefined}
                  onClick={(e) => {
                    setActiveTab(item.name);
                    goToSection(e, item.url);
                  }}
                  className={cn(
                    "group relative shrink-0 cursor-pointer whitespace-nowrap rounded-full px-3.5 py-2 text-[13.5px] tracking-[-0.14px] transition-colors",
                    isActive
                      ? "font-semibold text-coal-ink"
                      : "font-medium text-graphite hover:text-coal-ink",
                  )}
                >
                  {/* Quiet parchment pill on hover, under the label. */}
                  <span
                    aria-hidden
                    className="absolute inset-0 rounded-full bg-parchment opacity-0 transition-opacity duration-200 group-hover:opacity-100"
                  />
                  <span className="relative">{item.name}</span>
                  {isActive && (
                    <motion.span
                      layoutId="nav-active-desktop"
                      className="absolute inset-x-3.5 -bottom-px block h-[2px] rounded-full bg-smolder"
                      initial={false}
                      transition={{ type: "spring", stiffness: 320, damping: 32 }}
                    />
                  )}
                </Link>
              );
            })}
          </nav>

          <div className="flex items-center justify-end">
            {cta && (
              <Link
                href={cta.url}
                onClick={(e) => {
                  capture("nav_cta_clicked", {
                    label: cta.label,
                    placement: "desktop_bar",
                  });
                  goToSection(e, cta.url);
                }}
                className="cta-shine relative shrink-0 cursor-pointer overflow-hidden whitespace-nowrap rounded-full bg-coal-ink px-5 py-2.5 text-[13.5px] font-semibold tracking-[-0.14px] text-white transition-colors hover:bg-graphite active:scale-[0.98]"
              >
                {cta.label}
              </Link>
            )}
          </div>
        </div>
      </header>
    </>
  );
}
