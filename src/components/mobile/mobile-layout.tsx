"use client";

import * as React from "react";
import { useEffect, useRef, useState } from "react";
import { motion, useInView, useReducedMotion } from "framer-motion";
import { WaitlistForm } from "@/components/waitlist-form";
import { CheckIcon } from "@/components/icons";
import { TrustSection } from "@/components/trust-section";

const EASE = [0.16, 1, 0.3, 1] as const;

/* ── Chat animation (Problem section) — shared primitives ──────── */

type AiPhase = "hidden" | "thinking" | "full";

const PAIRS = [
  {
    user: "What was decided about the product direction last month?",
    ai:   "I don't have access to your internal meetings or strategic decisions. I only know what you share in this conversation.",
  },
  {
    user: "Who should I talk to about the new backend architecture?",
    ai:   "I don't know your team's org chart or who owns what internally. I have no access to your systems.",
  },
];

const CHAT_CSS = `
  .thinking-dot { animation: dot-bounce 1.2s ease-in-out infinite; }
  @keyframes dot-bounce {
    0%, 60%, 100% { transform: translateY(0);    opacity: 0.35; }
    30%            { transform: translateY(-4px); opacity: 1;    }
  }
  @media (prefers-reduced-motion: reduce) {
    .thinking-dot { animation: none; opacity: 0.6; }
  }
`;

function DotsIndicator() {
  return (
    <span style={{ display: "flex", gap: 3, alignItems: "center" }}>
      {[0, 1, 2].map(i => (
        <span key={i} className="thinking-dot" style={{
          width: 5, height: 5, borderRadius: "50%",
          background: "#969594", display: "inline-block",
          animationDelay: `${i * 160}ms`,
        }} />
      ))}
    </span>
  );
}

function AiBubble({ phase, children }: { phase: AiPhase; children: React.ReactNode }) {
  const [bubbleH, setBubbleH] = useState<string>("44px");
  const [bubbleR, setBubbleR] = useState<string>("999px");
  const [isExpanding, setIsExpanding] = useState(false);
  const [showContent, setShowContent] = useState(false);
  const bubbleRef = useRef<HTMLDivElement>(null);
  const innerRef  = useRef<HTMLDivElement>(null);
  const timerRef  = useRef<ReturnType<typeof setTimeout> | null>(null);
  const prevPhase = useRef<AiPhase>("hidden");

  useEffect(() => {
    if (timerRef.current) clearTimeout(timerRef.current);
    const prev = prevPhase.current;
    prevPhase.current = phase;

    if (phase === "full") {
      const targetH = (innerRef.current?.scrollHeight ?? 80) + 8;
      setIsExpanding(true);
      setShowContent(false);
      setBubbleH(`${targetH}px`);
      setBubbleR("4px 18px 18px 18px");
      timerRef.current = setTimeout(() => setShowContent(true), 180);
    }
    if (phase === "thinking") {
      setShowContent(false);
      setIsExpanding(false);
      if (prev === "full" && bubbleRef.current) {
        const liveH = bubbleRef.current.offsetHeight;
        setBubbleH(`${liveH}px`);
        requestAnimationFrame(() => requestAnimationFrame(() => {
          setBubbleH("44px");
          setBubbleR("999px");
        }));
      } else {
        setBubbleH("44px");
        setBubbleR("999px");
      }
    }
    if (phase === "hidden") {
      setShowContent(false);
      setBubbleH("44px");
      setBubbleR("999px");
      setIsExpanding(false);
    }
    return () => { if (timerRef.current) clearTimeout(timerRef.current); };
  }, [phase]);

  const visible = phase !== "hidden";
  const morphTransition = isExpanding
    ? "height 440ms cubic-bezier(0.05,0.7,0.1,1), border-radius 440ms cubic-bezier(0.05,0.7,0.1,1)"
    : "height 300ms cubic-bezier(0.3,0,1,1), border-radius 300ms cubic-bezier(0.3,0,1,1)";

  return (
    <div style={{
      opacity: visible ? 1 : 0,
      transform: visible ? "translateY(0) scale(1)" : "translateY(14px) scale(0.96)",
      transition: visible
        ? "opacity 380ms cubic-bezier(0.05,0.7,0.1,1), transform 380ms cubic-bezier(0.05,0.7,0.1,1)"
        : "none",
    }}>
      <div ref={bubbleRef} style={{
        position: "relative", overflow: "hidden",
        height: bubbleH, borderRadius: bubbleR,
        maxWidth: "100%",
        transition: morphTransition,
        background: "rgba(255,255,255,0.93)",
        backdropFilter: "blur(14px)", WebkitBackdropFilter: "blur(14px)",
        border: "1px solid rgba(255,255,255,0.82)",
        boxShadow: "0 2px 14px rgba(0,0,0,0.07)",
      }}>
        <div style={{
          position: "absolute", inset: 0, display: "flex", alignItems: "center",
          padding: "10px 16px", gap: 6,
          opacity: showContent ? 0 : 1,
          transition: "opacity 160ms ease",
          pointerEvents: "none",
        }}>
          <DotsIndicator />
          <span style={{ fontSize: 13, color: "#7e7d7b", fontStyle: "italic" }}>Thinking...</span>
        </div>
        <div ref={innerRef} style={{
          padding: "12px 16px",
          opacity: showContent ? 1 : 0,
          transition: "opacity 260ms cubic-bezier(0.05,0.7,0.1,1)",
          fontSize: 13.5, lineHeight: 1.55, color: "#1c1a17",
        }}>
          {children}
        </div>
      </div>
    </div>
  );
}

function UserBubble({ visible, children }: { visible: boolean; children: React.ReactNode }) {
  return (
    <div style={{
      display: "flex", justifyContent: "flex-end",
      opacity: visible ? 1 : 0,
      transform: visible ? "translateY(0) scale(1)" : "translateY(12px) scale(0.97)",
      transition: visible
        ? "opacity 380ms cubic-bezier(0.05,0.7,0.1,1), transform 380ms cubic-bezier(0.05,0.7,0.1,1)"
        : "none",
    }}>
      <div style={{
        background: "rgba(255,255,255,0.16)",
        border: "1px solid rgba(255,255,255,0.58)",
        backdropFilter: "blur(8px)", WebkitBackdropFilter: "blur(8px)",
        color: "#fff", fontSize: 14, fontWeight: 500, lineHeight: 1.45,
        padding: "10px 18px", borderRadius: "20px 20px 4px 20px",
        maxWidth: "80%", textShadow: "0 1px 3px rgba(0,0,0,0.14)",
      }}>
        {children}
      </div>
    </div>
  );
}

/* ── Shared wordmark/face ──────────────────────────────────────── */

function JarvisFace({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 48 48" fill="none" aria-hidden className={className}>
      <circle cx="24" cy="24" r="24" fill="#0E1A43" />
      <ellipse cx="29.9609" cy="20.895" rx="3" ry="7" fill="#C5F4FF" />
      <ellipse cx="17.9609" cy="20.895" rx="3" ry="7" fill="#C5F4FF" />
    </svg>
  );
}

/* ── Hero ──────────────────────────────────────────────────────── */

function MobileHero() {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;

    const seek = () => {
      // 6.5 s = "looking straight ahead" center pose (mirrors desktop mapping)
      video.currentTime = 6.5;
    };

    const onSeeked = () => setReady(true);

    if (video.readyState >= 1) {
      seek();
    } else {
      video.addEventListener("loadedmetadata", seek, { once: true });
    }
    video.addEventListener("seeked", onSeeked, { once: true });

    return () => {
      video.removeEventListener("loadedmetadata", seek);
      video.removeEventListener("seeked", onSeeked);
    };
  }, []);

  return (
    <section
      className="flex h-[100dvh] w-full flex-col overflow-hidden"
      style={{ backgroundColor: "#FAFDFC" }}
    >
      {/* Copy — natural height, no fixed positioning */}
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
        <p className="mt-3 max-w-[300px] text-center text-[12.5px] leading-[1.5] text-slate-mid">
          Synced locally, scoped to what you can already see — nothing new to approve, nothing sent anywhere else.
        </p>
      </div>

      {/* Robot video — fills remaining space, no gap */}
      <div className="relative flex-1 overflow-hidden">
        <video
          ref={videoRef}
          muted
          playsInline
          preload="auto"
          className="absolute inset-0 h-full w-full transition-opacity duration-[800ms] ease-in-out"
          style={{
            opacity: ready ? 1 : 0,
            objectFit: "cover",
            objectPosition: "48% center",
            transform: "scale(1.45) translateY(-20%)",
            transformOrigin: "center center",
          }}
        >
          <source src="/robot-scrub-keyframes.mp4" type="video/mp4" />
        </video>
      </div>
    </section>
  );
}

/* ── Problem ───────────────────────────────────────────────────── */

function MobileProblem() {
  const [u1, setU1]       = useState(false);
  const [a1, setA1]       = useState<AiPhase>("hidden");
  const [u2Vis, setU2Vis] = useState(false);
  const [a2, setA2]       = useState<AiPhase>("hidden");
  const [pair, setPair]   = useState(0);

  const timers  = useRef<ReturnType<typeof setTimeout>[]>([]);
  const mounted = useRef(true);
  const pairRef = useRef(0);
  const cycleTs = useRef<ReturnType<typeof setTimeout>[]>([]);

  useEffect(() => {
    mounted.current = true;
    const s = (ms: number, fn: () => void) => {
      const id = setTimeout(() => { if (mounted.current) fn(); }, ms);
      timers.current.push(id);
    };

    s(300,  () => setU1(true));
    s(1100, () => setA1("thinking"));
    s(2900, () => setA1("full"));
    s(4200, () => { setPair(0); pairRef.current = 0; setU2Vis(true); });
    s(5100, () => setA2("thinking"));
    s(6900, () => setA2("full"));
    s(10000, startCycle);

    function startCycle() {
      const next = (pairRef.current + 1) % PAIRS.length;
      const t1 = setTimeout(() => { if (!mounted.current) return; setU2Vis(false); setA2("thinking"); }, 0);
      const t2 = setTimeout(() => { if (!mounted.current) return; pairRef.current = next; setPair(next); setU2Vis(true); }, 450);
      const t3 = setTimeout(() => { if (!mounted.current) return; setA2("full"); }, 2350);
      const t4 = setTimeout(() => { if (!mounted.current) return; startCycle(); }, 5800);
      cycleTs.current = [t1, t2, t3, t4];
    }

    return () => {
      mounted.current = false;
      timers.current.forEach(clearTimeout);
      cycleTs.current.forEach(clearTimeout);
    };
  }, []);

  return (
    <>
      <style>{CHAT_CSS}</style>
      <section id="problem-mobile" className="scroll-mt-20 bg-ledger-white px-6 py-16">
        {/* Copy */}
        <p className="text-[11px] font-semibold uppercase tracking-[0.08em] text-graphite">
          The problem
        </p>
        <h2 className="mt-3 font-display text-[32px] font-bold leading-[1.1] tracking-[-0.96px] text-coal-ink text-balance">
          Your AI tools don&apos;t know{" "}
          <em style={{ fontStyle: "normal", color: "#969594" }}>your company.</em>
        </h2>
        <p className="mt-4 text-[15px] leading-[1.6] tracking-[-0.12px] text-slate-mid">
          Every session starts from scratch. Your company&apos;s context — Slack threads, meeting decisions, docs, architecture — lives everywhere your AI can&apos;t reach.
        </p>

        {/* CTA — between copy and chat */}
        <a
          href="#waitlist-mobile"
          className="mt-6 inline-block w-full rounded-full bg-coal-ink py-3.5 text-center text-sm font-medium leading-none text-white"
        >
          Get early access
        </a>

        {/* Chat panel — full-width, height grows with content */}
        <div className="mt-8 rounded-[20px]" style={{
          position: "relative",
          /* contain:paint clips grain/bg to border-radius without overflow:hidden
             so the expanding AI bubbles are never clipped */
          contain: "paint",
          padding: "32px 20px",
          background: [
            "radial-gradient(ellipse 75% 60% at 12% 8%,  #9dc5f5 0%, transparent 62%)",
            "radial-gradient(ellipse 65% 55% at 88% 5%,  #c8b0ec 0%, transparent 58%)",
            "radial-gradient(ellipse 85% 65% at 50% 105%,#f5c9a0 0%, transparent 62%)",
            "radial-gradient(ellipse 55% 45% at 82% 68%, #eab8d4 0%, transparent 52%)",
            "linear-gradient(155deg, #b5d2f8 0%, #d0b8f0 42%, #f0d0b5 100%)",
          ].join(","),
        }}>
          {/* Grain overlay */}
          <div aria-hidden style={{
            position: "absolute", inset: 0, opacity: 0.22, pointerEvents: "none",
            backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='320' height='320'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.72' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='320' height='320' filter='url(%23n)' opacity='1'/%3E%3C/svg%3E")`,
            backgroundSize: "200px 200px",
          }} />

          <div style={{ position: "relative", zIndex: 2, display: "flex", flexDirection: "column", gap: 10 }}>
            <UserBubble visible={u1}>
              Who owns the auth service and what&apos;s the deploy process?
            </UserBubble>
            <AiBubble phase={a1}>
              I don&apos;t have access to your company&apos;s internal systems. I can&apos;t tell you who owns your auth service or how your deploy process works.
            </AiBubble>
            <div style={{
              display: "flex", justifyContent: "flex-end",
              opacity: u2Vis ? 1 : 0,
              transform: u2Vis ? "translateY(0)" : "translateY(8px)",
              transition: "opacity 360ms ease, transform 360ms cubic-bezier(0.05,0.7,0.1,1)",
            }}>
              <div style={{
                background: "rgba(255,255,255,0.16)",
                border: "1px solid rgba(255,255,255,0.58)",
                backdropFilter: "blur(8px)", WebkitBackdropFilter: "blur(8px)",
                color: "#fff", fontSize: 14, fontWeight: 500, lineHeight: 1.45,
                padding: "10px 18px", borderRadius: "20px 20px 4px 20px",
                maxWidth: "80%", textShadow: "0 1px 3px rgba(0,0,0,0.14)",
              }}>{PAIRS[pair].user}</div>
            </div>
            <AiBubble phase={a2}>{PAIRS[pair].ai}</AiBubble>
          </div>
        </div>
      </section>
    </>
  );
}

/* ── Context layer ─────────────────────────────────────────────── */

const sources = [
  { label: "Slack", color: "#E01E5A" },
  { label: "GitHub", color: "#1c1a17" },
  { label: "Confluence", color: "#2684FF" },
  { label: "Meetings", color: "#0066DA" },
  { label: "Docs", color: "#34A853" },
];

function MobileContextLayer() {
  const ref = React.useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true, amount: 0.2 });
  const reduce = useReducedMotion();

  return (
    <section id="product-mobile" className="scroll-mt-20 bg-ledger-white px-6 py-16">
      <motion.div
        ref={ref}
        initial={reduce ? false : { opacity: 0, y: 20 }}
        animate={inView ? { opacity: 1, y: 0 } : {}}
        transition={{ duration: 0.5, ease: EASE }}
      >
        <p className="text-[11px] font-semibold uppercase tracking-[0.08em] text-graphite">
          How it works
        </p>
        <h2 className="mt-3 font-display text-[28px] font-bold leading-[1.13] tracking-[-0.84px] text-coal-ink text-balance">
          Connect once. Tag Jarvis anywhere.
        </h2>
        <p className="mt-4 text-[15px] leading-[1.6] tracking-[-0.12px] text-slate-mid">
          Sign in once — Slack, Gmail, Granola, no IT ticket required. Then tag @jarvis anywhere you work and get the answer with sources.
        </p>

        {/* Sources → Jarvis card */}
        <div className="mt-8 rounded-2xl border border-ash bg-white p-5" style={{ boxShadow: "rgba(95,99,106,0.08) 0px 0px 0px 1px, rgba(43,43,48,0.06) 0px 2px 12px 0px" }}>
          <p className="mb-3 text-[11px] font-semibold uppercase tracking-[0.08em] text-graphite">Synced sources</p>
          <div className="flex flex-col gap-2">
            {sources.map((s, i) => (
              <motion.div
                key={s.label}
                className="flex items-center justify-between rounded-lg border border-ash bg-ledger-white px-4 py-2.5"
                initial={reduce ? false : { opacity: 0, x: -12 }}
                animate={inView ? { opacity: 1, x: 0 } : {}}
                transition={{ duration: 0.4, ease: EASE, delay: i * 0.07 }}
              >
                <div className="flex items-center gap-3">
                  <div className="h-2 w-2 rounded-full" style={{ backgroundColor: s.color }} />
                  <span className="text-[14px] font-medium text-coal-ink">{s.label}</span>
                </div>
                <span className="text-[11px] font-semibold text-mint-pulse">✓ Synced</span>
              </motion.div>
            ))}
          </div>
          <div className="mt-4 rounded-lg bg-[#f0fdf4] px-4 py-3 text-[13px] font-medium text-mint-pulse">
            Context synced — ready in Claude Code before you ask
          </div>
        </div>
      </motion.div>
    </section>
  );
}

/* ── Inline CTA ────────────────────────────────────────────────── */

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

/* ── Features ──────────────────────────────────────────────────── */

const features = [
  {
    eyebrow: "Personal context",
    title: "Carries your context",
    body: "Your Slack, meetings, and contacts travel with you. Connect your AI tools over MCP and they already know what you're working on.",
  },
  {
    eyebrow: "Company knowledge",
    title: "Knows how your company works",
    body: "Wired into Confluence and your stack, he knows the product, the code, and who owns what — so he can point you straight to the person who built it.",
  },
  {
    eyebrow: "Onboarding",
    title: "Productive from day one",
    body: "Jarvis provisions your access, answers your how-do-I questions, and surfaces the right contacts before you even have to ask.",
  },
];

function MobileFeatures() {
  const ref = React.useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true, amount: 0.15 });
  const reduce = useReducedMotion();

  return (
    <section id="features-mobile" className="scroll-mt-20 bg-parchment px-6 py-16">
      <div ref={ref}>
        <p className="text-[11px] font-semibold uppercase tracking-[0.08em] text-graphite">
          Features
        </p>
        <h2 className="mt-3 font-display text-[28px] font-bold leading-[1.13] tracking-[-0.84px] text-coal-ink text-balance">
          One teammate, three jobs
        </h2>
        <p className="mt-4 text-[15px] leading-[1.6] tracking-[-0.12px] text-slate-mid">
          He knows your company, carries your context, and gets you productive from day one.
        </p>

        <div className="mt-8 flex flex-col gap-4">
          {features.map((f, i) => (
            <motion.div
              key={f.eyebrow}
              className="rounded-2xl border border-ash bg-white p-5"
              style={{ boxShadow: "rgba(95,99,106,0.08) 0px 0px 0px 1px, rgba(43,43,48,0.06) 0px 2px 12px 0px" }}
              initial={reduce ? false : { opacity: 0, y: 16 }}
              animate={inView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.45, ease: EASE, delay: i * 0.1 }}
            >
              <p className="text-[11px] font-semibold uppercase tracking-[0.08em] text-graphite">
                {f.eyebrow}
              </p>
              <h3 className="mt-1.5 text-[17px] font-semibold leading-[1.3] tracking-[-0.3px] text-coal-ink">
                {f.title}
              </h3>
              <p className="mt-2 text-[13px] leading-[1.6] text-slate-mid">
                {f.body}
              </p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}

/* ── Outcomes ──────────────────────────────────────────────────── */

const stats = [
  {
    label: "Time to first commit",
    metric: "Day 2",
    win: "Sarah pushed her first PR on Tuesday. Jarvis had her context synced and access ready before she even opened her laptop.",
    check: "Jarvis handled it",
  },
  {
    label: "IT access tickets",
    metric: "0",
    win: "12 systems, 18 minutes. Jarvis provisioned everything the moment Sarah's offer was signed — no IT queue, no waiting.",
    check: "Auto-provisioned",
  },
  {
    label: "Senior dev interrupts",
    metric: "Instant",
    win: "Who owns billing? Who built auth? Sarah got her answers without pinging a single senior dev. They didn't even know she'd asked.",
    check: "Always available",
  },
];

function MobileOutcomes() {
  const ref = React.useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true, amount: 0.15 });
  const reduce = useReducedMotion();

  return (
    <section className="bg-ledger-white px-6 py-16">
      <div ref={ref}>
        <h2 className="font-display text-[28px] font-bold leading-[1.13] tracking-[-0.84px] text-coal-ink text-balance">
          What changes with Jarvis.
        </h2>

        <div className="mt-8 flex flex-col gap-4">
          {stats.map((s, i) => (
            <motion.div
              key={s.label}
              className="rounded-2xl border border-ash bg-white p-5"
              style={{ boxShadow: "rgba(95,99,106,0.08) 0px 0px 0px 1px, rgba(43,43,48,0.06) 0px 2px 12px 0px" }}
              initial={reduce ? false : { opacity: 0, y: 16 }}
              animate={inView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.45, ease: EASE, delay: i * 0.1 }}
            >
              <p className="text-[13px] font-normal text-slate-mid">{s.label}</p>
              <p className="mt-1 font-display text-[40px] font-bold leading-none tracking-[-1.2px] text-coal-ink">
                {s.metric}
              </p>
              <p className="mt-3 text-[13px] leading-[1.6] text-slate-mid">{s.win}</p>
              <div className="mt-4 flex items-center gap-2">
                <span className="flex h-[18px] w-[18px] shrink-0 items-center justify-center rounded-full bg-mint-pulse">
                  <CheckIcon className="h-2.5 w-2.5 text-white" />
                </span>
                <span className="text-[11px] font-semibold text-mint-pulse">{s.check}</span>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}

/* ── Waitlist ──────────────────────────────────────────────────── */

function MobileWaitlist() {
  return (
    <section id="waitlist-mobile" className="scroll-mt-20 bg-ledger-white px-6 py-16">
      <div
        className="relative overflow-hidden rounded-[20px]"
        style={{
          boxShadow: "rgba(95,99,106,0.14) 0px 0px 0px 1px, rgba(43,43,48,0.2) 0px 12px 48px 0px",
        }}
      >
        <video
          autoPlay
          loop
          muted
          playsInline
          aria-hidden
          className="absolute inset-0 h-full w-full object-cover"
          src="https://framerusercontent.com/assets/JSWnPN9pwLkqzwQU31viRhMAJA.mp4"
        />
        <div className="relative z-10 px-6 py-12 text-center">
          <h2 className="font-display text-[30px] font-bold leading-[1.1] tracking-[-0.9px] text-coal-ink text-balance">
            Get Jarvis for your team
          </h2>
          <p className="mx-auto mt-3 max-w-[300px] text-[15px] leading-[1.55] text-graphite text-pretty">
            We&apos;re building this now and onboarding early teams. Leave your email and we&apos;ll be in touch.
          </p>
          <div
            className="mt-8 rounded-2xl bg-white/85 px-5 py-6 backdrop-blur-md"
            style={{ boxShadow: "rgba(255,255,255,0.35) 0px 0px 0px 1px, rgba(43,43,48,0.1) 0px 4px 24px 0px" }}
          >
            <WaitlistForm />
          </div>
        </div>
      </div>
    </section>
  );
}

/* ── FAQ ───────────────────────────────────────────────────────── */

const faqs = [
  {
    q: "How does Jarvis grant access safely?",
    a: "Access is the sensitive part, so it runs on rules you define, with approvals where you want them and a full audit trail.",
  },
  {
    q: "What about data privacy?",
    a: "Jarvis separates your personal work context from shared company knowledge. You control what teammates and admins can see.",
  },
  {
    q: "What does it connect to?",
    a: "Slack and your knowledge base to start, with identity providers, code hosting, meetings, and cloud on the roadmap.",
  },
  {
    q: "Is it available today?",
    a: "We're in early access. Join the waitlist and we'll reach out as we open spots.",
  },
  {
    q: "How long does setup take?",
    a: "Most teams are running in under a day. Connect your integrations, define access rules, and Jarvis is ready.",
  },
];

function MobileFaq() {
  return (
    <section id="faq-mobile" className="scroll-mt-20 bg-ledger-white px-6 py-16">
      <p className="text-[11px] font-semibold uppercase tracking-[0.08em] text-graphite">FAQ</p>
      <h2 className="mt-3 font-display text-[28px] font-bold leading-[1.13] tracking-[-0.84px] text-coal-ink text-balance">
        Questions you&apos;re already asking.
      </h2>
      <div className="mt-8 divide-y divide-ash border-t border-ash">
        {faqs.map((f) => (
          <details key={f.q} className="group py-5">
            <summary className="flex cursor-pointer list-none items-start justify-between gap-4 text-left [&::-webkit-details-marker]:hidden">
              <span className="text-[15px] font-semibold leading-[1.4] tracking-[-0.2px] text-coal-ink">
                {f.q}
              </span>
              <span className="mt-0.5 flex h-6 w-6 shrink-0 items-center justify-center rounded-full border border-ash bg-white text-graphite transition-transform duration-200 group-open:rotate-45"
                style={{ boxShadow: "rgba(95,99,106,0.08) 0px 0px 0px 1px" }}
              >
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" className="h-3.5 w-3.5" aria-hidden>
                  <path d="M12 5v14M5 12h14" />
                </svg>
              </span>
            </summary>
            <p className="mt-3 text-[13px] leading-[1.65] tracking-[-0.1px] text-slate-mid">
              {f.a}
            </p>
          </details>
        ))}
      </div>
    </section>
  );
}

/* ── Footer ────────────────────────────────────────────────────── */

function MobileFooter() {
  return (
    <footer className="border-t border-ash bg-ledger-white px-6 py-8">
      <div className="flex flex-col items-center gap-3 text-center">
        <div className="flex items-center gap-2.5">
          <JarvisFace className="h-[22px] w-[22px]" />
          <span className="wordmark text-sm text-foreground">jarvis</span>
          <span className="text-xs text-stone">working title</span>
        </div>
        <p className="text-xs text-muted-foreground">Built for IT companies. Early access.</p>
      </div>
    </footer>
  );
}

/* ── Root export ───────────────────────────────────────────────── */

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
