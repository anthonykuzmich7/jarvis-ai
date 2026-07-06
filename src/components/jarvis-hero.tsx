"use client";

import * as React from "react";
import { motion, AnimatePresence, useReducedMotion } from "framer-motion";

const EASE = [0.16, 1, 0.3, 1] as const;
const CYCLE_MS = 2800;

/* ---- Subject cycling ---------------------------------------------------- */

type IconId = "boy" | "girl" | "calendar" | "laptop" | "todolist";

const ICON_SRC: Record<IconId, string> = {
  boy:      "/boy_icon.svg",
  girl:     "/girl_icon.svg",
  calendar: "/calendar_icon.svg",
  laptop:   "/laptop_icon.svg",
  todolist: "/todolist_icon.svg",
};

const SUBJECTS: { word: string; icons: IconId[] }[] = [
  { word: "New hires",  icons: ["calendar", "boy", "girl"] },
  { word: "IT teams",   icons: ["boy", "girl", "laptop"] },
  { word: "Engineers",  icons: ["laptop", "todolist"] },
  { word: "HR teams",   icons: ["girl", "boy", "todolist"] },
];

const ICON_SIZE = 76;
const ICON_OVERLAP = 18;
const SLOT_STEP = ICON_SIZE - ICON_OVERLAP; // 58px — distance each side icon travels to center

const ICON_BG: Record<IconId, string> = {
  boy:      "#cce7ff",
  girl:     "#f1e6ff",
  calendar: "#B6F6CD",
  laptop:   "#fff9e0",
  todolist: "#f1e6ff",
};

// 3 fixed slots: [left, center, right]. null = hidden (no icon).
function getSlots(icons: IconId[]): [IconId | null, IconId, IconId | null] {
  if (icons.length >= 3) return [icons[0], icons[1], icons[2]];
  return [icons[0], icons[1], null]; // 2-icon: right slot empty
}

/* ---- Icon cluster: fixed circles, only items inside animate ---- */

function IconCluster({
  icons,
  transitionKey,
  reduce,
}: {
  icons: IconId[];
  transitionKey: number;
  reduce: boolean | null;
}) {
  const init = getSlots(icons);
  const [phase, setPhase] = React.useState<"idle" | "collapsing" | "expanding">("idle");
  const [slots, setSlots] = React.useState(init);
  const [centerContent, setCenterContent] = React.useState<IconId>(init[1]);
  const [centerBg,  setCenterBg]  = React.useState(ICON_BG[init[1]]);
  const [leftBg,    setLeftBg]    = React.useState(init[0] ? ICON_BG[init[0]] : ICON_BG.boy);
  const [rightBg,   setRightBg]   = React.useState(init[2] ? ICON_BG[init[2]] : ICON_BG.boy);
  const prevKeyRef  = React.useRef(transitionKey);
  const prevIconsRef = React.useRef(icons);

  React.useEffect(() => {
    if (prevKeyRef.current === transitionKey) return;
    prevKeyRef.current = transitionKey;
    const newIcons = icons;
    const oldIcons = prevIconsRef.current;
    prevIconsRef.current = newIcons;

    if (reduce) {
      const s = getSlots(newIcons);
      setSlots(s);
      setCenterContent(s[1]);
      setCenterBg(ICON_BG[s[1]]);
      setLeftBg(s[0] ? ICON_BG[s[0]] : ICON_BG.boy);
      setRightBg(s[2] ? ICON_BG[s[2]] : ICON_BG.boy);
      return;
    }

    // Phase 1 — items exit (slide down out of their circles)
    setSlots(getSlots(oldIcons));
    setPhase("collapsing");

    // Phase 2 — swap content, items enter (slide up into their circles)
    const t1 = setTimeout(() => {
      const s = getSlots(newIcons);
      setSlots(s);
      setCenterContent(s[1]);
      setCenterBg(ICON_BG[s[1]]);
      setLeftBg(s[0] ? ICON_BG[s[0]] : ICON_BG.boy);
      setRightBg(s[2] ? ICON_BG[s[2]] : ICON_BG.boy);
      setPhase("expanding");
    }, 370);

    const t2 = setTimeout(() => setPhase("idle"), 900);

    return () => { clearTimeout(t1); clearTimeout(t2); };
  }, [transitionKey]); // eslint-disable-line react-hooks/exhaustive-deps

  const isCollapsing = phase === "collapsing";

  // Shared style for every circle bubble
  const bubble = (bg: string, zIdx: number): React.CSSProperties => ({
    width: ICON_SIZE,
    height: ICON_SIZE,
    borderRadius: "50%",
    overflow: "hidden",      // clips SVG content to circle — no bleed
    position: "relative",
    flexShrink: 0,
    background: bg,
    zIndex: zIdx,
  });

  // Shared item motion props — slide up to enter, slide down to exit
  const itemMotion = (key: string, src: string) => ({
    key,
    src,
    alt: "" as const,
    "aria-hidden": true as const,
    style: {
      width: ICON_SIZE,
      height: ICON_SIZE,
      objectFit: "contain" as const,
      position: "absolute" as const,
      top: 0,
      left: 0,
    },
    initial: reduce ? false as const : { y: "100%" as const },
    animate: { y: "0%" as const },
    exit:    reduce ? undefined : { y: "100%" as const },
    transition: { duration: 0.32, ease: EASE },
  });

  return (
    <span className="inline-flex items-center">

      {/* LEFT circle — fixed position, item slides in/out */}
      <motion.span
        style={{ display: "inline-block", flexShrink: 0 }}
        animate={reduce ? {} : { opacity: slots[0] ? 1 : 0 }}
        transition={{ duration: 0.35, ease: EASE }}
      >
        <div style={bubble(leftBg, 1)}>
          <AnimatePresence mode="wait">
            {slots[0] && !isCollapsing && (
              <motion.img {...itemMotion(slots[0], ICON_SRC[slots[0]])} />
            )}
          </AnimatePresence>
        </div>
      </motion.span>

      {/* CENTER circle — always visible, always on top, item swaps via key */}
      <span style={{ display: "inline-block", flexShrink: 0, marginLeft: -ICON_OVERLAP, position: "relative", zIndex: 3 }}>
        <div style={bubble(centerBg, 3)}>
          <AnimatePresence mode="wait">
            <motion.img {...itemMotion(centerContent, ICON_SRC[centerContent])} />
          </AnimatePresence>
        </div>
      </span>

      {/* RIGHT circle — hidden slot contracts cluster width via marginLeft */}
      <motion.span
        style={{ display: "inline-block", flexShrink: 0, position: "relative" }}
        animate={reduce ? {} : {
          marginLeft: slots[2] ? -ICON_OVERLAP : -ICON_SIZE,
          opacity:    slots[2] ? 1 : 0,
        }}
        transition={{ duration: 0.45, ease: EASE }}
      >
        <div style={bubble(rightBg, 2)}>
          <AnimatePresence mode="wait">
            {slots[2] && !isCollapsing && (
              <motion.img {...itemMotion(slots[2], ICON_SRC[slots[2]])} />
            )}
          </AnimatePresence>
        </div>
      </motion.span>

    </span>
  );
}

/* ---- Animated headline -------------------------------------------------- */

function AnimatedHeadline({ reduce }: { reduce: boolean | null }) {
  const [idx, setIdx] = React.useState(0);

  React.useEffect(() => {
    if (reduce) return;
    const t = setInterval(() => setIdx((i) => (i + 1) % SUBJECTS.length), CYCLE_MS);
    return () => clearInterval(t);
  }, [reduce]);

  const subject = SUBJECTS[idx];

  return (
    <h1
      className="font-display font-medium text-foreground"
      style={{ fontSize: "clamp(2.3rem, 5.5vw, 4rem)", lineHeight: 1.1, letterSpacing: "-0.04em" }}
    >
      {/* Line 1: [Word] [icons] don't have */}
      <span className="flex flex-wrap items-center justify-center gap-x-3 gap-y-2">
        {/* Cycling word */}
        <span className="relative inline-block" style={{ minWidth: "5ch" }}>
          <AnimatePresence mode="wait">
            <motion.span
              key={subject.word}
              className="inline-block"
              initial={reduce ? false : { opacity: 0, y: "60%" }}
              animate={{ opacity: 1, y: "0%" }}
              exit={reduce ? undefined : { opacity: 0, y: "-60%" }}
              transition={{ duration: 0.35, ease: EASE }}
            >
              {subject.word}
            </motion.span>
          </AnimatePresence>
        </span>

        {/* Icon cluster with collapse/expand */}
        <IconCluster icons={subject.icons} transitionKey={idx} reduce={reduce} />

        <span>don&apos;t have</span>
      </span>

      {/* Line 2: fixed */}
      <span className="block text-center">to wait weeks to ship</span>
    </h1>
  );
}

/* ---- Jarvis mascot ------------------------------------------------ */

function JarvisMascot({ reduce }: { reduce: boolean | null }) {
  return (
    <motion.div
      className="mx-auto w-[300px]"
      animate={reduce ? {} : { y: [0, -12, 0] }}
      transition={{ duration: 2.6, repeat: Infinity, ease: "easeInOut" }}
    >
      <img
        src="/jarvis-waving.png"
        alt="Jarvis waving"
        width={300}
        height={300}
        style={{ objectFit: "contain", display: "block" }}
      />
    </motion.div>
  );
}

/* ---- Floating decorative elements --------------------------------------- */

function Floater({
  x, y, delay = 0, dur = 3.8, amp = 10, rot = 0, children,
}: {
  x: string; y: string; delay?: number; dur?: number; amp?: number; rot?: number;
  children: React.ReactNode;
}) {
  const reduce = useReducedMotion();
  return (
    <motion.div
      className="absolute pointer-events-none select-none"
      style={{ left: x, top: y, rotate: rot }}
      animate={reduce ? {} : { y: [0, -amp, 0] }}
      transition={{ duration: dur, repeat: Infinity, ease: "easeInOut", delay }}
    >
      {children}
    </motion.div>
  );
}

/* SVG decorative shapes */
const Star = ({ size = 20, color = "#4fbeff" }: { size?: number; color?: string }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none">
    <path d="M12 2 L13.5 10 L22 12 L13.5 14 L12 22 L10.5 14 L2 12 L10.5 10Z" fill={color} />
  </svg>
);

const Plus = ({ color = "#4fbeff" }: { color?: string }) => (
  <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
    <rect x="6" y="0" width="4" height="16" rx="2" fill={color} opacity="0.5" />
    <rect x="0" y="6" width="16" height="4" rx="2" fill={color} opacity="0.5" />
  </svg>
);

function LogoBubble({ Icon, size = 28 }: { Icon: React.FC<React.SVGProps<SVGSVGElement>>; size?: number }) {
  return (
    <div
      style={{
        width: 52, height: 52,
        borderRadius: 16,
        background: "#ffffff",
        border: "1px solid rgba(79,190,255,0.18)",
        boxShadow: "0 2px 12px rgba(79,190,255,0.10), 0 1px 3px rgba(0,0,0,0.04)",
        display: "flex", alignItems: "center", justifyContent: "center",
      }}
    >
      <Icon width={size} height={size} />
    </div>
  );
}

/* ---- Integration logos (kept from previous hero) ----------------------- */

const SlackIcon = (p: React.SVGProps<SVGSVGElement>) => (
  <svg viewBox="0 0 2447.6 2452.5" xmlns="http://www.w3.org/2000/svg" {...p}>
    <g clipRule="evenodd" fillRule="evenodd">
      <path d="m897.4 0c-135.3.1-244.8 109.9-244.7 245.2-.1 135.3 109.5 245.1 244.8 245.2h244.8v-245.1c.1-135.3-109.5-245.1-244.9-245.3.1 0 .1 0 0 0m0 654h-652.6c-135.3.1-244.9 109.9-244.8 245.2-.2 135.3 109.4 245.1 244.7 245.3h652.7c135.3-.1 244.9-109.9 244.8-245.2.1-135.4-109.5-245.2-244.8-245.3z" fill="#36c5f0"/>
      <path d="m2447.6 899.2c.1-135.3-109.5-245.1-244.8-245.2-135.3.1-244.9 109.9-244.8 245.2v245.3h244.8c135.3-.1 244.9-109.9 244.8-245.3zm-652.7 0v-654c.1-135.2-109.4-245-244.7-245.2-135.3.1-244.9 109.9-244.8 245.2v654c-.2 135.3 109.4 245.1 244.7 245.3 135.3-.1 244.9-109.9 244.8-245.3z" fill="#2eb67d"/>
      <path d="m1550.1 2452.5c135.3-.1 244.9-109.9 244.8-245.2.1-135.3-109.5-245.1-244.8-245.2h-244.8v245.2c-.1 135.2 109.5 245 244.8 245.2zm0-654.1h652.7c135.3-.1 244.9-109.9 244.8-245.2.2-135.3-109.4-245.1-244.7-245.3h-652.7c-135.3.1-244.9 109.9-244.8 245.2-.1 135.4 109.4 245.2 244.7 245.3z" fill="#ecb22e"/>
      <path d="m0 1553.2c-.1 135.3 109.5 245.1 244.8 245.2 135.3-.1 244.9-109.9 244.8-245.2v-245.2h-244.8c-135.3.1-244.9 109.9-244.8 245.2zm652.7 0v654c-.2 135.3 109.4 245.1 244.7 245.3 135.3-.1 244.9-109.9 244.8-245.2v-653.9c.2-135.3-109.4-245.1-244.7-245.3-135.4 0-244.9 109.8-244.8 245.1 0 0 0 .1 0 0" fill="#e01e5a"/>
    </g>
  </svg>
);

const GitHubIcon = (p: React.SVGProps<SVGSVGElement>) => (
  <svg viewBox="0 0 24 24" fill="#181717" xmlns="http://www.w3.org/2000/svg" {...p}>
    <path d="M12 .297c-6.63 0-12 5.373-12 12 0 5.303 3.438 9.8 8.205 11.385.6.113.82-.258.82-.577 0-.285-.01-1.04-.015-2.04-3.338.724-4.042-1.61-4.042-1.61C4.422 18.07 3.633 17.7 3.633 17.7c-1.087-.744.084-.729.084-.729 1.205.084 1.838 1.236 1.838 1.236 1.07 1.835 2.809 1.305 3.495.998.108-.776.417-1.305.76-1.605-2.665-.3-5.466-1.332-5.466-5.93 0-1.31.465-2.38 1.235-3.22-.135-.303-.54-1.523.105-3.176 0 0 1.005-.322 3.3 1.23.96-.267 1.98-.399 3-.405 1.02.006 2.04.138 3 .405 2.28-1.552 3.285-1.23 3.285-1.23.645 1.653.24 2.873.12 3.176.765.84 1.23 1.91 1.23 3.22 0 4.61-2.805 5.625-5.475 5.92.42.36.81 1.096.81 2.22 0 1.606-.015 2.896-.015 3.286 0 .315.21.69.825.57C20.565 22.092 24 17.592 24 12.297c0-6.627-5.373-12-12-12"/>
  </svg>
);

const ConfluenceIcon = (p: React.SVGProps<SVGSVGElement>) => (
  <svg viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg" {...p}>
    <defs>
      <linearGradient id="cA" x1="27.4" y1="25.5" x2="14.9" y2="18.3" gradientUnits="userSpaceOnUse">
        <stop offset=".18" stopColor="#0052CC"/><stop offset="1" stopColor="#2684FF"/>
      </linearGradient>
      <linearGradient id="cB" x1="4.6" y1="6.5" x2="17.1" y2="13.7" gradientUnits="userSpaceOnUse">
        <stop offset=".18" stopColor="#0052CC"/><stop offset="1" stopColor="#2684FF"/>
      </linearGradient>
    </defs>
    <path fill="url(#cA)" d="M4.7 23.6c-.3.5-.6 1-.9 1.4-.2.4-.1.9.3 1.2l5.9 3.6c.4.3 1 .1 1.2-.3.2-.4.5-.9.8-1.4 2.4-3.9 4.8-3.4 9.2-1.3l5.8 2.8c.4.2 1 0 1.2-.4l2.8-6.4c.2-.4 0-1-.4-1.2-1.2-.6-3.7-1.7-5.9-2.8-7.9-3.8-14.6-3.6-19 4z"/>
    <path fill="url(#cB)" d="M27.3 8.4c.3-.5.6-1 .9-1.4.2-.4.1-.9-.3-1.2L22 2.2c-.4-.3-1-.2-1.2.3-.2.4-.5.9-.8 1.4-2.4 3.9-4.8 3.4-9.2 1.3L5 2.3c-.4-.2-1 0-1.2.4L1 9.2c-.2.4 0 1 .4 1.2 1.2.6 3.7 1.7 5.9 2.8 8 3.8 14.7 3.5 19-4z"/>
  </svg>
);

const AwsIcon = (p: React.SVGProps<SVGSVGElement>) => (
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 304 182" {...p}>
    <path fill="#252f3e" d="m86 66 2 9c0 3 1 5 3 8v2l-1 3-7 4-2 1-3-1-4-5-3-6c-8 9-18 14-29 14-9 0-16-3-20-8-5-4-8-11-8-19s3-15 9-20c6-6 14-8 25-8a79 79 0 0 1 22 3v-7c0-8-2-13-5-16-3-4-8-5-16-5l-11 1a80 80 0 0 0-14 5h-2c-1 0-2-1-2-3v-5l1-3c0-1 1-2 3-2l12-5 16-2c12 0 20 3 26 8 5 6 8 14 8 25v32zM46 82l10-2c4-1 7-4 10-7l3-6 1-9v-4a84 84 0 0 0-19-2c-6 0-11 1-15 4-3 2-4 6-4 11s1 8 3 11c3 2 6 4 11 4zm80 10-4-1-2-3-23-78-1-4 2-2h10l4 1 2 4 17 66 15-66 2-4 4-1h8l4 1 2 4 16 67 17-67 2-4 4-1h9c2 0 3 1 3 2v2l-1 2-24 78-2 4-4 1h-9l-4-1-1-4-16-65-15 64-2 4-4 1h-9zm129 3a66 66 0 0 1-27-6l-3-3-1-2v-5c0-2 1-3 2-3h2l3 1a54 54 0 0 0 23 5c6 0 11-2 14-4 4-2 5-5 5-9l-2-7-10-5-15-5c-7-2-13-6-16-10a24 24 0 0 1 5-34l10-5a44 44 0 0 1 20-2 110 110 0 0 1 12 3l4 2 3 2 1 4v4c0 3-1 4-2 4l-4-2c-6-2-12-3-19-3-6 0-11 0-14 2s-4 5-4 9c0 3 1 5 3 7s5 4 11 6l14 4c7 3 12 6 15 10s5 9 5 14l-3 12-7 8c-3 3-7 5-11 6l-14 2z"/>
    <path d="M274 144A220 220 0 0 1 4 124c-4-3-1-6 2-4a300 300 0 0 0 263 16c5-2 10 4 5 8z" fill="#f90"/>
    <path d="M287 128c-4-5-28-3-38-1-4 0-4-3-1-5 19-13 50-9 53-5 4 5-1 36-18 51-3 2-6 1-5-2 5-10 13-33 9-38z" fill="#f90"/>
  </svg>
);

const OktaIcon = (p: React.SVGProps<SVGSVGElement>) => (
  <svg viewBox="0 0 24 24" fill="none" {...p}>
    <circle cx="12" cy="12" r="9" fill="#007DC1"/>
    <circle cx="12" cy="12" r="3.4" fill="#fff"/>
  </svg>
);

const JiraIcon = (p: React.SVGProps<SVGSVGElement>) => (
  <svg viewBox="0 0 24 24" fill="none" {...p}>
    <path d="M11.6 2 4 9.6l3 3L11.6 8l4.6 4.6 3-3z" fill="#2684FF"/>
    <path d="M11.6 22 19.2 14.4l-3-3L11.6 16 7 11.4l-3 3z" fill="#0052CC"/>
  </svg>
);

const MicrosoftIcon = (p: React.SVGProps<SVGSVGElement>) => (
  <svg viewBox="0 0 24 24" fill="none" {...p}>
    <path d="M11.4 2H2v9.4h9.4V2Z"       fill="#F25022"/>
    <path d="M22 2h-9.4v9.4H22V2Z"       fill="#7FBA00"/>
    <path d="M11.4 12.6H2V22h9.4V12.6Z"  fill="#00A4EF"/>
    <path d="M22 12.6h-9.4V22H22V12.6Z"  fill="#FFB900"/>
  </svg>
);

const GoogleCloudIcon = (p: React.SVGProps<SVGSVGElement>) => (
  <svg viewBox="0 0 24 24" fill="none" {...p}>
    <defs>
      <linearGradient id="gcA" x1="2" y1="12" x2="22" y2="12" gradientUnits="userSpaceOnUse">
        <stop offset="0"   stopColor="#4285F4"/>
        <stop offset=".34" stopColor="#EA4335"/>
        <stop offset=".67" stopColor="#FBBC05"/>
        <stop offset="1"   stopColor="#34A853"/>
      </linearGradient>
    </defs>
    <path fill="url(#gcA)" d="M16.5 9.5a5 5 0 0 0-9.55-1.6A4.2 4.2 0 0 0 6.2 16.3h10.1a3.4 3.4 0 0 0 .2-6.8z"/>
  </svg>
);

const integrations = [
  { name: "Slack",        Icon: SlackIcon },
  { name: "GitHub",       Icon: GitHubIcon },
  { name: "AWS",          Icon: AwsIcon },
  { name: "Google Cloud", Icon: GoogleCloudIcon },
  { name: "Jira",         Icon: JiraIcon },
  { name: "Confluence",   Icon: ConfluenceIcon },
  { name: "Okta",         Icon: OktaIcon },
  { name: "Microsoft",    Icon: MicrosoftIcon },
];

/* ---- Main export -------------------------------------------------------- */

export function JarvisHero() {
  const reduce = useReducedMotion();
  const bgRef = React.useRef<HTMLDivElement>(null);
  const current = React.useRef(0);
  const target = React.useRef(0);
  const rafRef = React.useRef<number | null>(null);

  React.useEffect(() => {
    if (reduce) return;

    const onMouseMove = (e: MouseEvent) => {
      // -1 = far left, +1 = far right
      target.current = (e.clientX / window.innerWidth) * 2 - 1;
    };

    const tick = () => {
      current.current += (target.current - current.current) * 0.07;
      const el = bgRef.current;
      if (el) {
        const x = current.current;
        el.style.transform = `perspective(1400px) rotateY(${x * 10}deg) scale(1.08)`;
      }
      rafRef.current = requestAnimationFrame(tick);
    };

    rafRef.current = requestAnimationFrame(tick);
    window.addEventListener("mousemove", onMouseMove);
    return () => {
      if (rafRef.current) cancelAnimationFrame(rafRef.current);
      window.removeEventListener("mousemove", onMouseMove);
    };
  }, [reduce]);

  return (
    <section className="relative min-h-screen overflow-hidden bg-white">

      {/* Floating integration logos */}
      <div aria-hidden className="pointer-events-none absolute inset-0 z-10 overflow-hidden">
        <Floater x="3%"  y="12%" delay={0}   dur={3.8} amp={12}><LogoBubble Icon={SlackIcon} /></Floater>
        <Floater x="8%"  y="48%" delay={0.6} dur={4.2} amp={9}><LogoBubble Icon={GitHubIcon} size={24} /></Floater>
        <Floater x="14%" y="72%" delay={0.9} dur={3.5} amp={8}><LogoBubble Icon={AwsIcon} size={32} /></Floater>
        <Floater x="22%" y="28%" delay={0.3} dur={4.0} amp={7}><LogoBubble Icon={JiraIcon} /></Floater>
        <Floater x="76%" y="10%" delay={0.2} dur={3.9} amp={11}><LogoBubble Icon={MicrosoftIcon} /></Floater>
        <Floater x="84%" y="38%" delay={0.8} dur={3.6} amp={10}><LogoBubble Icon={OktaIcon} /></Floater>
        <Floater x="88%" y="64%" delay={0.4} dur={4.1} amp={9}><LogoBubble Icon={ConfluenceIcon} /></Floater>
        <Floater x="70%" y="74%" delay={1.1} dur={3.7} amp={8}><LogoBubble Icon={GoogleCloudIcon} /></Floater>
        <Floater x="28%" y="8%"  delay={0.5} dur={4.0} amp={5}><Star size={14} color="#93c5fd" /></Floater>
        <Floater x="64%" y="8%"  delay={1.2} dur={3.6} amp={5}><Star size={12} color="#c4b5fd" /></Floater>
        <Floater x="5%"  y="30%" delay={1.0} dur={3.8} amp={4}><Plus color="#93c5fd" /></Floater>
        <Floater x="92%" y="28%" delay={0.3} dur={4.2} amp={4}><Plus color="#93c5fd" /></Floater>
        <Floater x="48%" y="5%"  delay={0.7} dur={3.5} amp={5}>
          <div className="h-2.5 w-2.5 rounded-full bg-signal-violet/40" />
        </Floater>
      </div>

      {/* Content */}
      <div className="relative z-20 flex min-h-screen flex-col items-center px-6 pt-36 pb-16">

        {/* Text + CTA */}
        <div className="mx-auto max-w-4xl text-center">
          <motion.h1
            className="font-display font-medium text-foreground"
            style={{ fontSize: "clamp(2.3rem, 5.5vw, 4rem)", lineHeight: 1.1, letterSpacing: "-0.04em" }}
            initial={reduce ? false : { opacity: 0, y: 22 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.65, ease: EASE }}
          >
            New hires don&apos;t have
            <span className="block">to wait weeks to ship</span>
          </motion.h1>

          <motion.p
            className="mx-auto mt-6 max-w-lg text-lg leading-[1.4] tracking-[-0.18px] text-muted-foreground text-pretty"
            initial={reduce ? false : { opacity: 0, y: 14 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, ease: EASE, delay: 0.15 }}
          >
            Jarvis grants access, answers the how-do-I questions, and keeps context —
            so people ship on day one, not week two.
          </motion.p>

          <motion.div
            className="mt-10"
            initial={reduce ? false : { opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, ease: EASE, delay: 0.26 }}
          >
            <a
              href="#waitlist"
              className="inline-flex items-center justify-center rounded-full bg-coal-ink px-8 py-3.5 text-base font-medium tracking-[-0.16px] text-white shadow-[rgba(28,26,23,0.8)_0px_1px_2px_0px,rgb(28,26,23)_0px_0px_0px_1px] transition-opacity hover:opacity-90 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-coal-ink"
            >
              Join the waitlist
            </a>
          </motion.div>
        </div>

        {/* Robot — natural size, white bg blends with page, 3D cursor tracking */}
        <motion.div
          className="mt-6 w-full max-w-3xl"
          initial={reduce ? false : { opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, ease: EASE, delay: 0.3 }}
        >
          <div ref={bgRef} style={{ willChange: "transform", transformOrigin: "center center" }}>
            <img
              src="/jarvis-robot-still.jpg"
              alt="Jarvis AI mascot"
              className="w-full select-none"
              draggable={false}
            />
          </div>
        </motion.div>
      </div>
    </section>
  );
}
