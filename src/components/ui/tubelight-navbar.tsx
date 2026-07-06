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
}

export function NavBar({ items, className }: NavBarProps) {
  const [activeTab, setActiveTab] = useState(items[0].name);

  // Scroll-spy: light up (and spring the tubelight to) the section in view.
  useEffect(() => {
    const sectionItems = items.filter(
      (item) => item.url.startsWith("#") && item.url.length > 1,
    );
    const homeItem = items.find((item) => item.url === "#");

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
              onClick={() => setActiveTab(item.name)}
              className={cn(
                "relative cursor-pointer text-sm font-medium px-5 py-2 rounded-full transition-colors tracking-[-0.14px]",
                "text-graphite hover:text-foreground",
                isActive && "text-white",
              )}
            >
              <span className="hidden md:inline">{item.name}</span>
              <span className="md:hidden">
                <Icon size={18} strokeWidth={2} />
              </span>
              {isActive && (
                <motion.div
                  layoutId="lamp"
                  className="absolute inset-0 w-full bg-coal-ink rounded-full -z-10"
                  initial={false}
                  transition={{
                    type: "spring",
                    stiffness: 300,
                    damping: 30,
                  }}
                >
                  <div className="absolute -top-2 left-1/2 -translate-x-1/2 w-8 h-1 bg-coal-ink/60 rounded-t-full">
                    <div className="absolute w-12 h-6 bg-coal-ink/12 rounded-full blur-md -top-2 -left-2" />
                    <div className="absolute w-8 h-6 bg-coal-ink/12 rounded-full blur-md -top-1" />
                    <div className="absolute w-4 h-4 bg-coal-ink/8 rounded-full blur-sm top-0 left-2" />
                  </div>
                </motion.div>
              )}
            </Link>
          );
        })}
      </div>
    </div>
  );
}
