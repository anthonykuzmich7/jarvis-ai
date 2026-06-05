"use client";

import * as React from "react";
import {
  motion,
  useInView,
  useReducedMotion,
  type Variants,
} from "framer-motion";
import { cn } from "@/lib/utils";

export interface DisplayCardProps {
  icon?: React.ReactNode;
  title?: string;
  description?: string;
  date?: string;
  titleClassName?: string;
}

interface DisplayCardsProps {
  cards: DisplayCardProps[];
}

// Each card gets a collapsed (stacked deck) and an expanded (fanned out) pose,
// derived from its position relative to the center of the stack.
function cardVariants(index: number, count: number): Variants {
  const offset = index - (count - 1) / 2; // -1, 0, 1 for three cards

  return {
    collapsed: {
      x: offset * 16,
      y: offset * 10,
      rotate: offset * 4,
      scale: 1 - Math.abs(offset) * 0.05,
      zIndex: index,
    },
    expanded: {
      x: offset * 215,
      y: Math.abs(offset) * 16 - 8,
      rotate: offset * 9,
      scale: 1,
      zIndex: index,
    },
  };
}

export default function DisplayCards({ cards }: DisplayCardsProps) {
  const reduceMotion = useReducedMotion();
  const ref = React.useRef<HTMLDivElement>(null);
  // Fan the cards open once the stack scrolls into view.
  const inView = useInView(ref, { amount: 0.45 });

  const state = reduceMotion || inView ? "expanded" : "collapsed";

  return (
    <motion.div
      ref={ref}
      className="relative flex h-64 w-[44rem] items-center justify-center"
      initial="collapsed"
      animate={state}
      whileHover={reduceMotion ? undefined : "expanded"}
      variants={{ collapsed: {}, expanded: {} }}
    >
      {cards.map((card, index) => (
        <motion.div
          key={index}
          variants={cardVariants(index, cards.length)}
          whileHover={reduceMotion ? undefined : { scale: 1.05, zIndex: 40 }}
          transition={{
            type: "spring",
            stiffness: 240,
            damping: 22,
            delay: reduceMotion ? 0 : index * 0.04,
          }}
          style={{ transformOrigin: "center bottom" }}
          className={cn(
            "absolute flex h-36 w-[16rem] cursor-default select-none flex-col justify-between",
            "rounded-xl border border-border bg-card px-4 py-3 shadow-xl shadow-foreground/5",
            "transition-[border-color,box-shadow] hover:border-foreground/40 hover:shadow-2xl",
          )}
        >
          <div className="flex items-center gap-2">
            <span className="inline-flex items-center justify-center rounded-full bg-foreground p-1.5">
              {card.icon}
            </span>
            <p
              className={cn(
                "text-lg font-semibold",
                card.titleClassName ?? "text-foreground",
              )}
            >
              {card.title}
            </p>
          </div>
          <p className="truncate text-base text-foreground">
            {card.description}
          </p>
          <p className="text-sm text-muted-foreground">{card.date}</p>
        </motion.div>
      ))}
    </motion.div>
  );
}
