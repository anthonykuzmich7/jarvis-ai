"use client";

import React, { useEffect, useRef, useState } from "react";
import { motion } from "framer-motion";
import Link from "next/link";
import { LucideIcon } from "lucide-react";
import { cn } from "@/lib/utils";

interface NavItem {
  name: string;
  url: string;
  icon: LucideIcon;
}

interface NavBarProps {
  items: NavItem[];
  className?: string;
  cta?: { label: string; url: string; icon: LucideIcon };
  brand?: React.ReactNode;
}

// The condensed bar's height, which every section's `scroll-mt-16` (64px) is
// already tuned to. Anchor jumps land just below the bar because these agree —
// change one and you have to change the other.
const NAV_CLEARANCE = 64;

// A plain `scrollIntoView({ behavior: "smooth" })` computes its target once
// and animates toward that fixed pixel value. Sections above the target
// (OrbitSyncJarvis, JarvisOverlaySection) run entrance animations that can
// still be shifting layout while the scroll is mid-flight, so the browser's
// one-shot target goes stale and we land short or long of the section.
// Recomputing the target every step makes the scroll self-correcting.
// setTimeout (not requestAnimationFrame) so the scroll can't stall if the
// tab loses visibility mid-click. Each step jumps instantly to its computed
// position — letting the ambient CSS `scroll-behavior: smooth` (globals.css)
// also animate each micro-step would fight this loop and stall the scroll.
function smoothScrollToId(id: string, onSettle?: () => void) {
  let steps = 0;
  let cancelled = false;
  let timer: ReturnType<typeof setTimeout> | null = null;

  function step() {
    if (cancelled) return;
    const el = document.getElementById(id);
    if (!el) return onSettle?.();
    const before = window.scrollY;
    const targetY = before + el.getBoundingClientRect().top - NAV_CLEARANCE;
    const diff = targetY - before;
    if (Math.abs(diff) < 1) {
      window.scrollTo({ top: targetY, behavior: "instant" });
      return onSettle?.();
    }
    window.scrollTo({ top: before + diff * 0.18, behavior: "instant" });
    steps += 1;
    // Stop once the page can't scroll any further (target sits past the
    // document's bottom, e.g. FAQ) — otherwise diff never reaches <1 and
    // this would loop forever. The step cap is just a hard safety net.
    if (window.scrollY === before || steps > 120) return onSettle?.();
    timer = setTimeout(step, 16);
  }

  step();
  // Returning a canceller is the whole point: two of these chains running at
  // once both call window.scrollTo every 16ms toward different targets, and
  // the page judders between them. A new navigation must kill the old one.
  return () => {
    cancelled = true;
    if (timer) clearTimeout(timer);
  };
}

export function NavBar({ items, className, cta, brand }: NavBarProps) {
  const [activeTab, setActiveTab] = useState(items[0].name);
  // Flush and transparent over the hero; condensed glass once you leave it.
  const [lifted, setLifted] = useState(false);
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

  // Never leave a scroll chain or timer running after the bar goes away.
  useEffect(() => () => endNavigation(), []);

  return (
    <>
      {/* Mobile: bottom-fixed floating pill */}
      <div
        className={cn(
          "fixed bottom-0 left-1/2 z-50 mb-6 -translate-x-1/2 sm:hidden",
          className,
        )}
      >
        <div className="flex items-center gap-1 rounded-full border border-ash bg-white/90 px-1 py-1 shadow-[rgba(95,99,106,0.10)_0px_0px_0px_1px,rgba(43,43,48,0.08)_0px_4px_16px_0px] backdrop-blur-lg">
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
                  "relative shrink-0 cursor-pointer whitespace-nowrap rounded-full px-5 py-2 text-sm tracking-[-0.14px] transition-colors",
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
                    className="absolute inset-x-5 bottom-[2px] h-[2px] rounded-full bg-smolder"
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

      {/* Desktop: fixed bar. Fixed rather than sticky so it reserves no layout
          height, which lets the hero actually occupy a full 100dvh instead of
          starting 64px down. */}
      <header
        className={cn(
          "fixed top-0 z-50 hidden w-full sm:block",
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
                onClick={(e) => goToSection(e, cta.url)}
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
