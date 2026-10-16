"use client";

import * as React from "react";
import { NightMark } from "@/components/night/night-mark";

/*
  The hero's product shot: Jarvis's Focus window, drawn in HTML.

  It mirrors the real app's split view — the day's sentence on top, the tasks
  that need you on the left, the real calendar on the right — with American
  demo names the whole page shares (Tom, Emily, Jake, Alex).

  Two things move, and both answer the visitor rather than loop on their own:
  the owl's eyes follow the pointer (and blink now and then, the way the app's
  title-bar face does), and a task row can be ticked off and back.
*/

type Tone = "urgent" | "high" | "normal" | "low";
type Source = "slack" | "gmail" | "github" | "jira";

const TONES: Record<Tone, { ring: string; chipText: string; chipBg: string }> = {
  urgent: { ring: "#F87171", chipText: "#FCA5A5", chipBg: "rgba(248,113,113,0.14)" },
  high: { ring: "#F59E0B", chipText: "#FCD34D", chipBg: "rgba(245,158,11,0.14)" },
  normal: { ring: "#71717A", chipText: "#A1A1AA", chipBg: "rgba(255,255,255,0.06)" },
  low: { ring: "#3F3F46", chipText: "#8B8B94", chipBg: "rgba(255,255,255,0.04)" },
};

const SOURCE_COLOR: Record<Source, string> = {
  slack: "#E879F9",
  gmail: "#F87171",
  github: "#A1A1AA",
  jira: "#60A5FA",
};

const TASKS: { id: string; title: string; who: string; s: Source; due: string; tone: Tone }[] = [
  { id: "a", title: "Refund the 3 double-charged customers", who: "Tom Becker · #eng · Slack", s: "slack", due: "Today", tone: "urgent" },
  { id: "b", title: "Review the payments fix in PR #142", who: "Tom Becker · GitHub", s: "github", due: "Today", tone: "urgent" },
  { id: "c", title: "Send Emily the Q4 hiring plan", who: "Emily Carter · Gmail", s: "gmail", due: "Tomorrow", tone: "high" },
  { id: "d", title: "Answer Jake about the product dashboard", who: "Jake Miller · DM · Slack", s: "slack", due: "Fri", tone: "high" },
  { id: "e", title: "Check the designer handoff on ENG-2481", who: "Jira · because of your rule", s: "jira", due: "Fri", tone: "normal" },
  { id: "f", title: "Book flights for the Berlin offsite", who: "Travel desk · Gmail", s: "gmail", due: "Next wk", tone: "low" },
];

const SLOT = 52;
const at = (h: number) => Math.round((h - 9) * SLOT);
const HOURS = Array.from({ length: 9 }, (_, i) => 9 + i);
const MEETINGS = [
  { title: "Eng standup · 10:00", facts: "", top: at(10) + 1, height: SLOT / 2 - 2, join: false },
  { title: "1:1 with Alex Wang", facts: "11:00–12:00 · Google Meet", top: at(11) + 1, height: SLOT - 2, join: true },
  { title: "Product sync", facts: "14:00–15:00 · Emily, Jake +3", top: at(14) + 1, height: SLOT - 2, join: true },
  { title: "Design review · 16:00", facts: "", top: at(16) + 1, height: SLOT / 2 - 2, join: false },
];

const DONE = "#34D399";
const DONE_HALO = "rgba(52,211,153,0.18)";

export function useGaze(target: React.RefObject<SVGSVGElement | null>) {
  const [gaze, setGaze] = React.useState({ x: 0, y: 0 });
  const [blink, setBlink] = React.useState(false);

  React.useEffect(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    let raf = 0;
    let rest: ReturnType<typeof setTimeout> | undefined;
    let px = 0;
    let py = 0;

    const aim = () => {
      raf = 0;
      const el = target.current;
      if (!el) return;
      const r = el.getBoundingClientRect();
      const dx = px - (r.left + r.width / 2);
      const dy = py - (r.top + r.height / 2);
      const d = Math.hypot(dx, dy);
      if (d < 14) return setGaze({ x: 0, y: 0 });
      // Dead zone, then tanh saturation: a far cursor reads as a glance, not a stare.
      const k = Math.tanh(d / 240);
      setGaze({ x: (dx / d) * k * 3.4, y: (dy / d) * k * 2.8 });
    };

    const onMove = (e: PointerEvent) => {
      px = e.clientX;
      py = e.clientY;
      if (!raf) raf = requestAnimationFrame(aim);
      clearTimeout(rest);
      rest = setTimeout(() => setGaze({ x: 0, y: 0 }), 2500);
    };

    let blinkT: ReturnType<typeof setTimeout> | undefined;
    let blinkEnd: ReturnType<typeof setTimeout> | undefined;
    const schedule = () => {
      blinkT = setTimeout(() => {
        setBlink(true);
        blinkEnd = setTimeout(() => {
          setBlink(false);
          schedule();
        }, 120);
      }, 3800 + Math.random() * 3400);
    };

    window.addEventListener("pointermove", onMove);
    schedule();
    return () => {
      window.removeEventListener("pointermove", onMove);
      if (raf) cancelAnimationFrame(raf);
      clearTimeout(rest);
      clearTimeout(blinkT);
      clearTimeout(blinkEnd);
    };
  }, [target]);

  return { gaze, blink };
}

export function JarvisWindow() {
  const logo = React.useRef<SVGSVGElement | null>(null);
  const { gaze, blink } = useGaze(logo);
  const [done, setDone] = React.useState<Record<string, boolean>>({});
  const openCount = TASKS.filter((t) => !done[t.id]).length;

  return (
    <div className="nt-win">
      {/* Title bar */}
      <div style={{ position: "relative", height: 60, display: "flex", alignItems: "flex-start", padding: "14px 16px 0" }}>
        <div style={{ display: "flex", gap: 8 }} aria-hidden>
          {["#FF5F57", "#FEBC2E", "#28C840"].map((c) => (
            <span key={c} style={{ width: 12, height: 12, borderRadius: "50%", background: c, display: "block" }} />
          ))}
        </div>
        <div style={{ position: "absolute", left: "50%", top: 34, transform: "translate(-50%, -50%)", display: "flex", alignItems: "center", gap: 10, whiteSpace: "nowrap" }}>
          <NightMark ref={logo} size={30} ground="#0A0A0B" gaze={gaze} blink={blink} />
          <span style={{ fontSize: 17, fontWeight: 700, letterSpacing: "-0.03em" }}>Jarvis</span>
        </div>
      </div>

      {/* The day, in one sentence */}
      <div style={{ padding: "18px 32px 24px" }}>
        <p className="nt-win-sentence" style={{ margin: 0, fontSize: 23, lineHeight: 1.42, fontWeight: 500, letterSpacing: "-0.015em", maxWidth: "34em" }}>
          Start with <span className="nt-win-link">the refunds Tom flagged</span>, three customers were charged twice.{" "}
          <span className="nt-win-link">Send Emily the hiring plan</span> after your 1:1 with Alex.
        </p>
      </div>

      {/* Split view */}
      <div style={{ display: "flex", flexWrap: "wrap", gap: 10, padding: "4px 20px 22px" }}>
        <div className="nt-win-pane" style={{ flexBasis: 420, padding: "14px 8px 10px" }}>
          <div style={{ padding: "0 10px 10px", fontSize: 11, fontWeight: 600, letterSpacing: "0.08em", color: "#8B8B94" }}>
            NEEDS YOU · {openCount}
          </div>
          <div style={{ display: "flex", flexDirection: "column", gap: 2 }}>
            {TASKS.map((t) => {
              const isDone = !!done[t.id];
              const tone = TONES[t.tone];
              return (
                <button
                  key={t.id}
                  type="button"
                  className="nt-win-row"
                  aria-pressed={isDone}
                  onClick={() => setDone((d) => ({ ...d, [t.id]: !isDone }))}
                >
                  <span
                    style={{
                      flex: "none", width: 16, height: 16, borderRadius: "50%", boxSizing: "border-box",
                      border: `2px solid ${isDone ? DONE : tone.ring}`, background: isDone ? DONE : "transparent",
                      display: "flex", alignItems: "center", justifyContent: "center",
                    }}
                  >
                    {isDone ? (
                      <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="#FFFFFF" strokeWidth="4" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
                        <path d="M5 12l5 5 9-10" />
                      </svg>
                    ) : null}
                  </span>
                  <span style={{ flex: 1, minWidth: 0, display: "flex", flexDirection: "column", gap: 3 }}>
                    <span className="nt-ellipsis" style={{ fontSize: 14, fontWeight: 500, letterSpacing: "-0.005em", color: isDone ? "#8B8B94" : "#F4F4F5", textDecoration: isDone ? "line-through" : "none" }}>
                      {t.title}
                    </span>
                    <span className="nt-ellipsis" style={{ fontSize: 12, color: "#A1A1AA" }}>
                      <span style={{ color: SOURCE_COLOR[t.s] }}>●</span> {t.who}
                    </span>
                  </span>
                  <span style={{ flex: "none", fontSize: 11, fontWeight: 500, padding: "3px 8px", borderRadius: 6, color: isDone ? DONE : tone.chipText, background: isDone ? DONE_HALO : tone.chipBg }}>
                    {isDone ? "Done" : t.due}
                  </span>
                </button>
              );
            })}
          </div>
        </div>

        <div className="nt-win-pane" style={{ padding: "14px 16px 16px" }}>
          <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", paddingBottom: 12, fontSize: 11, color: "#8B8B94" }}>
            <span style={{ fontWeight: 600, letterSpacing: "0.08em" }}>WED, OCT 15</span>
            <span>4 meetings</span>
          </div>
          <div style={{ position: "relative", height: 416 }}>
            {HOURS.map((h) => (
              <div key={h} style={{ position: "absolute", left: 0, right: 0, top: (h - 9) * SLOT, height: 0, borderTop: "1px solid rgba(255,255,255,0.05)" }}>
                <span style={{ position: "absolute", left: 0, top: -7, fontFamily: "var(--font-geist-mono), ui-monospace, monospace", fontSize: 10, color: "#8B8B94", background: "#111113", paddingRight: 6 }}>
                  {String(h).padStart(2, "0")}
                </span>
              </div>
            ))}
            <div style={{ position: "absolute", left: 44, top: 0, bottom: 0, width: 2, background: "rgba(255,255,255,0.12)" }} />
            {MEETINGS.map((m) => (
              <div
                key={m.title}
                className="nt-win-band"
                style={{
                  position: "absolute", left: 44, right: 0, top: m.top, height: m.height, boxSizing: "border-box",
                  borderLeft: "2px solid #F4F4F5", background: "rgba(255,255,255,0.075)", borderRadius: "0 9px 9px 0",
                  padding: "0 10px 0 12px", display: "flex", alignItems: "center", gap: 10,
                }}
              >
                <span style={{ flex: 1, minWidth: 0, display: "flex", flexDirection: "column", gap: 1 }}>
                  <span className="nt-ellipsis" style={{ fontSize: 13, fontWeight: 600, color: "#FFFFFF" }}>{m.title}</span>
                  {m.facts ? <span className="nt-ellipsis" style={{ fontSize: 11, color: "#A1A1AA" }}>{m.facts}</span> : null}
                </span>
                {m.join ? (
                  <span style={{ flex: "none", fontSize: 12, fontWeight: 600, color: "#FFFFFF", background: "#EE5A1E", padding: "5px 12px", borderRadius: 7 }}>Join</span>
                ) : null}
              </div>
            ))}
            <div style={{ position: "absolute", left: 0, right: 0, top: 35, height: 0 }} aria-label="Now, 9:40">
              <span style={{ position: "absolute", left: 0, top: -8, fontFamily: "var(--font-geist-mono), ui-monospace, monospace", fontSize: 10, fontWeight: 500, color: "#F87171", background: "#111113", paddingRight: 2 }}>9:40</span>
              <span style={{ position: "absolute", left: 40, top: -5, width: 10, height: 10, borderRadius: "50%", background: "#F87171", boxShadow: "0 0 0 3px #111113" }} />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
