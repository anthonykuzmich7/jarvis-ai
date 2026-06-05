"use client";

import * as React from "react";
import {
  motion,
  useMotionValue,
  useSpring,
  useReducedMotion,
} from "framer-motion";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";

// Interface for the props of each individual icon.
interface IconProps {
  id: number;
  icon: React.FC<React.SVGProps<SVGSVGElement>>;
  className: string; // Used for custom positioning of the icon.
}

// Interface for the main hero component's props.
export interface FloatingIconsHeroProps {
  title: string;
  subtitle: string;
  ctaText: string;
  ctaHref: string;
  icons: IconProps[];
  eyebrow?: string;
}

// A single icon component with its own motion logic.
const Icon = ({
  mouseX,
  mouseY,
  iconData,
  index,
}: {
  mouseX: React.MutableRefObject<number>;
  mouseY: React.MutableRefObject<number>;
  iconData: IconProps;
  index: number;
}) => {
  const ref = React.useRef<HTMLDivElement>(null);
  const prefersReduced = useReducedMotion();

  // Motion values for the icon's position, with spring physics.
  const x = useMotionValue(0);
  const y = useMotionValue(0);
  const springX = useSpring(x, { stiffness: 300, damping: 20 });
  const springY = useSpring(y, { stiffness: 300, damping: 20 });

  React.useEffect(() => {
    if (prefersReduced) return; // No cursor repulsion when motion is reduced.

    const handleMouseMove = () => {
      if (ref.current) {
        const rect = ref.current.getBoundingClientRect();
        const distance = Math.sqrt(
          Math.pow(mouseX.current - (rect.left + rect.width / 2), 2) +
            Math.pow(mouseY.current - (rect.top + rect.height / 2), 2),
        );

        // If the cursor is close enough, repel the icon.
        if (distance < 150) {
          const angle = Math.atan2(
            mouseY.current - (rect.top + rect.height / 2),
            mouseX.current - (rect.left + rect.width / 2),
          );
          const force = (1 - distance / 150) * 50;
          x.set(-Math.cos(angle) * force);
          y.set(-Math.sin(angle) * force);
        } else {
          x.set(0);
          y.set(0);
        }
      }
    };

    window.addEventListener("mousemove", handleMouseMove);
    return () => window.removeEventListener("mousemove", handleMouseMove);
  }, [x, y, mouseX, mouseY, prefersReduced]);

  // Deterministic per-icon timing (avoids hydration drift from Math.random).
  const floatDuration = 6 + (index % 5);

  return (
    <motion.div
      ref={ref}
      style={{ x: springX, y: springY }}
      initial={prefersReduced ? false : { opacity: 0, scale: 0.5 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{
        delay: prefersReduced ? 0 : index * 0.08,
        duration: prefersReduced ? 0 : 0.6,
        ease: [0.22, 1, 0.36, 1],
      }}
      className={cn("absolute", iconData.className)}
    >
      {/* Inner wrapper for the continuous floating animation. */}
      <motion.div
        className="flex items-center justify-center w-14 h-14 md:w-20 md:h-20 p-3 rounded-2xl shadow-sm bg-card/80 backdrop-blur-md border border-border grayscale"
        animate={
          prefersReduced
            ? undefined
            : {
                y: [0, -8, 0, 8, 0],
                x: [0, 6, 0, -6, 0],
                rotate: [0, 5, 0, -5, 0],
              }
        }
        transition={{
          duration: floatDuration,
          repeat: Infinity,
          repeatType: "mirror",
          ease: "easeInOut",
        }}
      >
        <iconData.icon className="w-7 h-7 md:w-10 md:h-10 text-foreground" />
      </motion.div>
    </motion.div>
  );
};

const FloatingIconsHero = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement> & FloatingIconsHeroProps
>(
  (
    { className, title, subtitle, ctaText, ctaHref, icons, eyebrow, ...props },
    ref,
  ) => {
    const mouseX = React.useRef(0);
    const mouseY = React.useRef(0);

    const handleMouseMove = (event: React.MouseEvent<HTMLDivElement>) => {
      mouseX.current = event.clientX;
      mouseY.current = event.clientY;
    };

    return (
      <section
        ref={ref}
        onMouseMove={handleMouseMove}
        className={cn(
          "relative w-full min-h-[680px] h-[100svh] flex items-center justify-center overflow-hidden bg-background",
          className,
        )}
        {...props}
      >
        {/* Background floating icons. */}
        <div className="absolute inset-0 w-full h-full">
          {icons.map((iconData, index) => (
            <Icon
              key={iconData.id}
              mouseX={mouseX}
              mouseY={mouseY}
              iconData={iconData}
              index={index}
            />
          ))}
        </div>

        {/* Soft backdrop so the headline stays legible over the icons. */}
        <div
          aria-hidden
          className="pointer-events-none absolute left-1/2 top-1/2 z-0 h-[420px] w-[720px] max-w-[92vw] -translate-x-1/2 -translate-y-1/2 rounded-full bg-background/70 blur-2xl"
        />

        {/* Foreground content. */}
        <div className="relative z-10 text-center px-4">
          {eyebrow ? (
            <span className="inline-flex items-center rounded-full border border-border bg-card/70 px-3 py-1 text-xs font-semibold uppercase tracking-wider text-muted-foreground backdrop-blur">
              {eyebrow}
            </span>
          ) : null}
          <h1 className="mt-5 text-4xl md:text-6xl font-extrabold tracking-tight text-foreground text-balance max-w-3xl mx-auto">
            {title}
          </h1>
          <p className="mt-6 max-w-xl mx-auto text-lg text-muted-foreground text-pretty">
            {subtitle}
          </p>
          <div className="mt-10">
            <Button
              asChild
              size="lg"
              className="px-8 py-6 text-base font-semibold"
            >
              <a href={ctaHref}>{ctaText}</a>
            </Button>
          </div>
        </div>
      </section>
    );
  },
);

FloatingIconsHero.displayName = "FloatingIconsHero";

export { FloatingIconsHero };
