"use client";

import { motion, useReducedMotion } from "framer-motion";
import { ContextDemo } from "@/components/context-demo";

/*
  Product demo.

  This was a 720p MP4 in a contained dark frame, because the film is dark and
  the page is ledger white — a section that flipped the page to dark mid-scroll
  would have broken the theme lock.

  It is now live DOM (`context-demo.tsx`) sitting on the page's own background,
  which removes the reason the frame existed. Captions are coal ink on ledger
  white and only the terminal is dark, which is already how every other demo
  window on this page reads. Side effects: the type is real text at the device's
  own resolution instead of compressed video, and the section costs ~0 bytes of
  media instead of 508 KB.

  `public/jarvis-demo.mp4` is kept deliberately — it is the social/OG cut, where
  a real video file is what the platform wants.
*/

const EASE = [0.16, 1, 0.3, 1] as const;

export function DemoSection() {
  const reduce = useReducedMotion();

  return (
    <section id="demo" className="scroll-mt-16 bg-ledger-white">
      <div className="mx-auto max-w-[1180px] px-6 py-20 sm:py-28">
        <motion.h2
          initial={reduce ? false : { opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.6 }}
          transition={{ duration: 0.7, ease: EASE }}
          className="max-w-[18ch] font-display text-[32px] font-bold leading-[1.1] tracking-[-0.96px] text-coal-ink sm:text-[44px] sm:tracking-[-1.4px]"
        >
          Watch Jarvis answer from your team&apos;s memory.
        </motion.h2>

        <motion.div
          initial={reduce ? false : { opacity: 0, y: 28 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.2 }}
          transition={{ duration: 0.9, delay: 0.08, ease: EASE }}
          className="mt-10"
        >
          <ContextDemo />
        </motion.div>
      </div>
    </section>
  );
}
