"use client";

import { useEffect, useRef, useState } from "react";

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

/* ── Main component ─────────────────────────────────────────── */
export function ProblemSection() {
  const [u1, setU1]         = useState(false);
  const [a1, setA1]         = useState<AiPhase>("hidden");
  const [u2Vis, setU2Vis]   = useState(false);
  const [a2, setA2]         = useState<AiPhase>("hidden");
  const [pair, setPair]     = useState(0);

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

    // One-shot sequential reveal
    s(300,  () => setU1(true));
    s(1100, () => setA1("thinking"));
    s(2900, () => setA1("full"));
    s(4200, () => { setPair(0); pairRef.current = 0; setU2Vis(true); });
    s(5100, () => setA2("thinking"));
    s(6900, () => setA2("full"));

    // Cycling starts 3 s after reveal finishes
    s(10000, startCycle);

    function startCycle() {
      const next = (pairRef.current + 1) % PAIRS.length;

      const t1 = setTimeout(() => {
        if (!mounted.current) return;
        setU2Vis(false);
        setA2("thinking");
      }, 0);

      const t2 = setTimeout(() => {
        if (!mounted.current) return;
        pairRef.current = next;
        setPair(next);
        setU2Vis(true);
      }, 450);

      const t3 = setTimeout(() => {
        if (!mounted.current) return;
        setA2("full");
      }, 2350);

      const t4 = setTimeout(() => {
        if (!mounted.current) return;
        startCycle();
      }, 5800);

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
      <style>{CSS}</style>
      <section id="problem" className="scroll-mt-24" style={sectionStyle}>
        <div style={layoutStyle}>

          {/* ── LEFT COPY ── */}
          <div style={{ display: "flex", flexDirection: "column" }}>
            <p style={eyebrowStyle}>The problem</p>
            <h2 style={headlineStyle}>
              Your AI tools don&apos;t know{" "}
              <em style={{ fontStyle: "normal", color: "#969594" }}>your company.</em>
            </h2>
            <p style={bodyStyle}>
              Every session starts from scratch. Your company&apos;s context —
              Slack threads, meeting decisions, docs, architecture — lives
              everywhere your AI can&apos;t reach.
            </p>
            <CtaButton href="#waitlist">Get early access</CtaButton>
          </div>

          {/* ── RIGHT PANEL ── */}
          <div style={{ marginRight: -24 }}>
            <div style={panelStyle}>
              <div aria-hidden style={gradientBgStyle} />
              <div aria-hidden style={grainStyle} />

              <div style={{
                position: "relative", zIndex: 2,
                display: "flex", flexDirection: "column", gap: 12,
              }}>
                {/* Pair 1 — permanent */}
                <UserBubble visible={u1}>
                  Who owns the auth service and what&apos;s the deploy process?
                </UserBubble>

                <AiBubble phase={a1}>
                  I don&apos;t have access to your company&apos;s internal
                  systems. I can&apos;t tell you who owns your auth service
                  or how your deploy process works.
                </AiBubble>

                {/* Pair 2 — cycles */}
                <div style={{
                  display: "flex", justifyContent: "flex-end",
                  opacity: u2Vis ? 1 : 0,
                  transform: u2Vis ? "translateY(0)" : "translateY(8px)",
                  transition: "opacity 360ms ease, transform 360ms cubic-bezier(0.05,0.7,0.1,1)",
                }}>
                  <div style={userBubbleStyle}>{PAIRS[pair].user}</div>
                </div>

                <AiBubble phase={a2}>
                  {PAIRS[pair].ai}
                </AiBubble>
              </div>
            </div>
          </div>

        </div>
      </section>
    </>
  );
}

/* ── AI Bubble ────────────────────────────────────────────────
   Motion design (Premium archetype):
   - Expand:   440ms cubic-bezier(0.05,0.7,0.1,1)  — MD3 Emphasized, snappy settle
   - Collapse: 300ms cubic-bezier(0.3,0,1,1)        — MD3 Accelerate, quick exit
   - Uses measured pixel heights (NOT max-height) so easing applies to actual distance
────────────────────────────────────────────────────────────── */
function AiBubble({ phase, children }: { phase: AiPhase; children: React.ReactNode }) {
  // Primary motion state — drives height/radius morph
  const [bubbleH, setBubbleH] = useState<string>("44px");
  const [bubbleR, setBubbleR] = useState<string>("999px");
  const [isExpanding, setIsExpanding] = useState(false);

  // Secondary motion layer — content opacity
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
      // Measure exact content height for pixel-accurate easing
      const targetH = innerRef.current?.scrollHeight ?? 80;

      setIsExpanding(true);
      setShowContent(false);
      setBubbleH(`${targetH}px`);
      setBubbleR("4px 18px 18px 18px");

      // Secondary layer: text fades in at ~40% of expand duration (176ms)
      timerRef.current = setTimeout(() => setShowContent(true), 180);
    }

    if (phase === "thinking") {
      setShowContent(false);
      setIsExpanding(false);

      if (prev === "full" && bubbleRef.current) {
        // Capture live rendered height so collapse starts from the right place
        const liveH = bubbleRef.current.offsetHeight;
        // Set explicit px first (no transition change since same value)
        setBubbleH(`${liveH}px`);
        // After one paint: animate down with accelerate easing
        requestAnimationFrame(() => {
          requestAnimationFrame(() => {
            setBubbleH("44px");
            setBubbleR("999px");
          });
        });
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

  // Direction-aware easing: enter=MD3 Emphasized, exit=MD3 Accelerate
  const morphTransition = isExpanding
    ? "height 440ms cubic-bezier(0.05,0.7,0.1,1), border-radius 440ms cubic-bezier(0.05,0.7,0.1,1)"
    : "height 300ms cubic-bezier(0.3,0,1,1),   border-radius 300ms cubic-bezier(0.3,0,1,1)";

  return (
    <div style={{
      opacity: visible ? 1 : 0,
      transform: visible ? "translateY(0) scale(1)" : "translateY(14px) scale(0.96)",
      transition: visible
        ? "opacity 380ms cubic-bezier(0.05,0.7,0.1,1), transform 380ms cubic-bezier(0.05,0.7,0.1,1)"
        : "none",
    }}>
      {/* Primary layer: the morphing bubble */}
      <div
        ref={bubbleRef}
        style={{
          position: "relative",
          overflow: "hidden",
          height: bubbleH,
          borderRadius: bubbleR,
          maxWidth: 340,
          transition: morphTransition,
          background: "rgba(255,255,255,0.93)",
          backdropFilter: "blur(14px)",
          WebkitBackdropFilter: "blur(14px)",
          border: "1px solid rgba(255,255,255,0.82)",
          boxShadow: "0 2px 14px rgba(0,0,0,0.07)",
        }}
      >
        {/* Ambient layer: bouncing dots (absolute, fades when full) */}
        <div style={{
          position: "absolute", inset: 0,
          display: "flex", alignItems: "center",
          padding: "10px 16px", gap: 6,
          opacity: showContent ? 0 : 1,
          transition: "opacity 160ms ease",
          pointerEvents: "none",
          whiteSpace: "nowrap",
        }}>
          <DotsIndicator />
          <span style={{ fontSize: 13, color: "#7e7d7b", fontStyle: "italic" }}>
            Thinking...
          </span>
        </div>

        {/* Secondary layer: response text (drives measured height) */}
        <div
          ref={innerRef}
          style={{
            padding: "12px 16px",
            opacity: showContent ? 1 : 0,
            transition: "opacity 260ms cubic-bezier(0.05,0.7,0.1,1)",
            fontSize: 13.5,
            lineHeight: 1.55,
            color: "#1c1a17",
          }}
        >
          {children}
        </div>
      </div>
    </div>
  );
}

/* ── User Bubble ─────────────────────────────────────────────── */
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
      <div style={userBubbleStyle}>{children}</div>
    </div>
  );
}

/* ── Animated dots (ambient layer) ─────────────────────────── */
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

/* ── CTA ─────────────────────────────────────────────────────── */
function CtaButton({ href, children }: { href: string; children: React.ReactNode }) {
  return (
    <a href={href} style={{
      display: "inline-flex", alignItems: "center",
      background: "#1c1a17", color: "#fff",
      fontSize: 14, fontWeight: 600,
      padding: "13px 26px", borderRadius: 48,
      textDecoration: "none", width: "fit-content",
      transition: "background 150ms ease, transform 160ms cubic-bezier(0.05,0.7,0.1,1)",
    }}
      onMouseEnter={e => { (e.currentTarget as HTMLElement).style.background = "#2d2a26"; }}
      onMouseLeave={e => { (e.currentTarget as HTMLElement).style.background = "#1c1a17"; }}
      onMouseDown={e  => { (e.currentTarget as HTMLElement).style.transform = "scale(0.97)"; }}
      onMouseUp={e    => { (e.currentTarget as HTMLElement).style.transform = "scale(1)"; }}
    >
      {children}
    </a>
  );
}

/* ── Styles ─────────────────────────────────────────────────── */
const sectionStyle: React.CSSProperties = {
  minHeight: "100dvh",
  display: "flex", alignItems: "center",
  background: "#fafafa",
  padding: "80px 40px",
  fontFamily: "'Inter','Geist',system-ui,sans-serif",
  overflow: "hidden",
};

const layoutStyle: React.CSSProperties = {
  maxWidth: 1200, width: "100%", margin: "0 auto",
  display: "grid", gridTemplateColumns: "1fr 1.25fr",
  gap: 64, alignItems: "center",
};

const eyebrowStyle: React.CSSProperties = {
  fontSize: 11, fontWeight: 600, letterSpacing: "0.08em",
  textTransform: "uppercase", color: "#5a5957", marginBottom: 20,
};

const headlineStyle: React.CSSProperties = {
  fontFamily: "var(--font-display), ui-sans-serif, system-ui, sans-serif",
  fontSize: 48, fontWeight: 700, lineHeight: 1.06,
  letterSpacing: "-1.44px", color: "#1c1a17", marginBottom: 18,
};

const bodyStyle: React.CSSProperties = {
  fontSize: 16, lineHeight: 1.6, color: "#7e7d7b",
  marginBottom: 32, maxWidth: 360,
};

const panelStyle: React.CSSProperties = {
  position: "relative", borderRadius: 20, overflow: "hidden",
  minHeight: 460,
  display: "flex", flexDirection: "column", justifyContent: "center",
  padding: "48px 32px",
};

const gradientBgStyle: React.CSSProperties = {
  position: "absolute", inset: 0,
  background: [
    "radial-gradient(ellipse 75% 60% at 12% 8%,  #9dc5f5 0%, transparent 62%)",
    "radial-gradient(ellipse 65% 55% at 88% 5%,  #c8b0ec 0%, transparent 58%)",
    "radial-gradient(ellipse 85% 65% at 50% 105%,#f5c9a0 0%, transparent 62%)",
    "radial-gradient(ellipse 55% 45% at 82% 68%, #eab8d4 0%, transparent 52%)",
    "linear-gradient(155deg, #b5d2f8 0%, #d0b8f0 42%, #f0d0b5 100%)",
  ].join(","),
};

const grainStyle: React.CSSProperties = {
  position: "absolute", inset: 0, opacity: 0.22, pointerEvents: "none",
  backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='320' height='320'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.72' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='320' height='320' filter='url(%23n)' opacity='1'/%3E%3C/svg%3E")`,
  backgroundSize: "200px 200px",
};

const userBubbleStyle: React.CSSProperties = {
  background: "rgba(255,255,255,0.16)",
  border: "1px solid rgba(255,255,255,0.58)",
  backdropFilter: "blur(8px)", WebkitBackdropFilter: "blur(8px)",
  color: "#fff", fontSize: 14, fontWeight: 500, lineHeight: 1.45,
  padding: "10px 18px", borderRadius: "20px 20px 4px 20px",
  maxWidth: "80%", textShadow: "0 1px 3px rgba(0,0,0,0.14)",
};

/* Ambient dots keyframe */
const CSS = `
  .thinking-dot { animation: dot-bounce 1.2s ease-in-out infinite; }
  @keyframes dot-bounce {
    0%, 60%, 100% { transform: translateY(0);    opacity: 0.35; }
    30%            { transform: translateY(-4px); opacity: 1;    }
  }
  @media (prefers-reduced-motion: reduce) {
    .thinking-dot { animation: none; opacity: 0.6; }
  }
`;
