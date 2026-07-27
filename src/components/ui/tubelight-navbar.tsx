"use client";

import React, { useEffect, useState } from "react";
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
}

export function NavBar({ items, className, cta }: NavBarProps) {
  const [activeTab, setActiveTab] = useState(items[0].name);
  const CtaIcon = cta?.icon;

  // Next's Link hash-scroll can misfire while the tubelight/underline layout
  // animation is running (wrong target, or no scroll at all), so we drive
  // the scroll ourselves and just use the href for the URL/history update.
  const goToSection = (e: React.MouseEvent, url: string) => {
    if (!url.startsWith("#") || url.length < 2) return;
    const el = document.getElementById(url.slice(1));
    if (!el) return;
    e.preventDefault();
    el.scrollIntoView({ behavior: "smooth", block: "start" });
    history.pushState(null, "", url);
  };

  // Scroll-spy: light up (and spring the tubelight to) the section in view.
  useEffect(() => {
    const sectionItems = items.filter(
      (item) => item.url.startsWith("#") && item.url.length > 1,
    );
    const homeItem = items[0];

    const elements = sectionItems
      .map((item) => {
        const el = document.getElementById(item.url.slice(1));
        return el ? { item, el } : null;
      })
      .filter(
        (entry): entry is { item: NavItem; el: HTMLElement } => entry !== null,
      );

    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting) {
            const match = elements.find((e) => e.el === entry.target);
            if (match) setActiveTab(match.item.name);
          }
        }
      },
      // A thin band near the top of the viewport decides the active section.
      { rootMargin: "-40% 0px -55% 0px", threshold: 0 },
    );

    elements.forEach(({ el }) => observer.observe(el));

    // Near the very top, fall back to the first (Home) tab.
    const handleScroll = () => {
      if (window.scrollY < 240 && homeItem) setActiveTab(homeItem.name);
    };
    window.addEventListener("scroll", handleScroll, { passive: true });
    handleScroll();

    return () => {
      observer.disconnect();
      window.removeEventListener("scroll", handleScroll);
    };
  }, [items]);

  return (
    <div
      className={cn(
        "fixed bottom-0 sm:bottom-auto sm:top-0 left-1/2 -translate-x-1/2 z-50 mb-6 sm:pt-5",
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
                "relative cursor-pointer text-sm px-5 py-2 rounded-full transition-colors tracking-[-0.14px]",
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
                  layoutId="nav-underline"
                  className="absolute inset-x-5 bottom-[2px] h-[2px] rounded-full bg-coal-ink"
                  initial={false}
                  transition={{
                    type: "spring",
                    stiffness: 300,
                    damping: 30,
                  }}
                />
              )}
            </Link>
          );
        })}

        {/* Panxo-style filled CTA pill — always visible, no tubelight */}
        {cta && CtaIcon && (
          <Link
            href={cta.url}
            onClick={(e) => goToSection(e, cta.url)}
            className="cta-shine relative ml-0.5 cursor-pointer overflow-hidden rounded-full bg-coal-ink px-5 py-2 text-sm font-semibold tracking-[-0.14px] text-white transition-colors hover:bg-graphite"
          >
            <span className="hidden md:inline">{cta.label}</span>
            <span className="md:hidden">
              <CtaIcon size={18} strokeWidth={2} />
            </span>
          </Link>
        )}
      </div>
    </div>
  );
}
