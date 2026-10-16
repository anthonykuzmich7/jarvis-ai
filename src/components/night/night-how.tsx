import { colourLogos, type ColourLogo } from "@/components/night/brand-svgs";

/*
  "How it works" on the Night homepage (canvas board A, "The flow"): five
  things that came in on the left, wires carrying them into Jarvis in the
  middle, today's plan coming out on the right.

  Pure CSS, so it stays a server component. Everything that has to happen in
  order runs off ONE clock, the --p custom property (0 → 100 over 10s) animated
  on the stage: separate keyframe animations drift apart (the plan appeared
  before its line was drawn), one shared value cannot. The stage is one coordinate box
  (1152 × 520) laid out in percentages, and the wires are an SVG with the same
  viewBox, so cards, wires and the orb stay lined up at any desktop width.
  Below 980px it stacks: messages, Jarvis, plan.
*/

const STAGE_W = 1152;
const STAGE_H = 520;
const CARD_W = 340;
const CARD_H = 68;
const CARD_GAP = 24;
const CARDS_TOP = (STAGE_H - (5 * CARD_H + 4 * CARD_GAP)) / 2;
const MID_Y = STAGE_H / 2;
const ORB_X = STAGE_W / 2;
const PLAN_W = 390;

const MESSAGES: { app: ColourLogo; who: string; where: string; text: string }[] = [
  { app: "Slack", who: "Emily Carter", where: "#design", text: "Can you send the pricing deck before Friday's call?" },
  { app: "Gmail", who: "Alex Kim", where: "Acme", text: "Contract redlines attached. Need your sign-off by Thursday." },
  { app: "Jira", who: "JAR-212", where: "Checkout", text: "Double charge bug moved to In review. Assigned to you." },
  { app: "Telegram", who: "Jake Moore", where: "DM", text: "Can we move our 1:1 to tomorrow morning?" },
  { app: "Google Calendar", who: "Product sync", where: "2:00 PM", text: "Emily, Jake +3 · Google Meet" },
];

const TONE = {
  urgent: { ring: "#F87171", text: "#FCA5A5", bg: "rgba(248,113,113,0.14)" },
  high: { ring: "#F59E0B", text: "#FCD34D", bg: "rgba(245,158,11,0.14)" },
  normal: { ring: "#71717A", text: "#A1A1AA", bg: "rgba(255,255,255,0.06)" },
};

const TASKS: { title: string; who: string; due: string; tone: keyof typeof TONE }[] = [
  { title: "Send Emily the pricing deck", who: "Emily Carter · Slack", due: "Fri", tone: "urgent" },
  { title: "Sign off the Acme contract", who: "Alex Kim · Gmail", due: "Thu", tone: "high" },
  { title: "Review the checkout fix JAR-212", who: "Jira", due: "Today", tone: "high" },
  { title: "Reply to Jake about the 1:1", who: "Jake Moore · Telegram", due: "Today", tone: "normal" },
];

const pct = (v: number, of: number) => `${((v / of) * 100).toFixed(3)}%`;

/** The wire from card i into the orb, in stage coordinates. Wires run to the
    orb's centre and the face is drawn over them, so they always touch its edge
    however the stage scales. */
function wire(i: number) {
  const y = CARDS_TOP + i * (CARD_H + CARD_GAP) + CARD_H / 2;
  return `M${CARD_W} ${y} C ${CARD_W + 120} ${y}, ${ORB_X - 104} ${MID_Y}, ${ORB_X} ${MID_Y}`;
}
const OUT_WIRE = `M${ORB_X} ${MID_Y} L ${STAGE_W - PLAN_W} ${MID_Y}`;

function Face({ size }: { size: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 30 30" aria-hidden>
      <circle cx="15" cy="15" r="15" fill="#F4F4F5" />
      <g className="nt-how-eyes">
        <rect x="9.6" y="11.4" width="3.6" height="7.2" rx="1.8" fill="#09090A" />
        <rect x="16.8" y="11.4" width="3.6" height="7.2" rx="1.8" fill="#09090A" />
      </g>
    </svg>
  );
}

function Orb() {
  return (
    <div className="nt-how-orb">
      <div aria-hidden className="nt-how-halo" />
      <div aria-hidden className="nt-how-spin" />
      <div style={{ position: "relative", display: "flex" }}>
        <Face size={88} />
      </div>
    </div>
  );
}

export function HowItWorks() {
  return (
    <section id="how" aria-labelledby="how-title" className="nt-wrap nt-how">
      <div aria-hidden className="nt-glow" style={{ top: -120, width: 1200, maxWidth: "130vw", height: 720, background: "radial-gradient(ellipse 34% 40% at 50% 50%, rgba(255,96,32,0.16), rgba(255,96,32,0.05) 55%, transparent 100%)" }} />
      <div style={{ position: "relative", maxWidth: 900, margin: "0 auto", textAlign: "center" }}>
        <h2 id="how-title" className="nt-h2">
          Connect your apps. <span className="nt-mark">Get a plan.</span>
        </h2>
        <p className="nt-lede" style={{ maxWidth: 640, marginLeft: "auto", marginRight: "auto" }}>
          Jarvis reads your chats, email and calendar, then tells you what to do first.
        </p>
      </div>

      <div className="nt-how-stage" style={{ aspectRatio: `${STAGE_W} / ${STAGE_H}` }}>
        <svg className="nt-how-wires" viewBox={`0 0 ${STAGE_W} ${STAGE_H}`} preserveAspectRatio="none" aria-hidden>
          {MESSAGES.map((_, i) => (
            <path key={`w${i}`} d={wire(i)} className="nt-how-wire" vectorEffect="non-scaling-stroke" />
          ))}
          {/* Drawn out of Jarvis only when the plan is about to appear. */}
          <path d={OUT_WIRE} pathLength={100} className="nt-how-wire nt-how-wire-out" vectorEffect="non-scaling-stroke" />
          {MESSAGES.map((_, i) => (
            <path key={`d${i}`} d={wire(i)} pathLength={100} className="nt-how-dash" style={{ ["--s" as string]: i * 5.5 }} vectorEffect="non-scaling-stroke" />
          ))}
          {[0, 1, 2].map((k) => (
            <path key={`o${k}`} d={OUT_WIRE} pathLength={100} className="nt-how-dash nt-how-dash-out" style={{ ["--s" as string]: 51 + k * 1.2 }} vectorEffect="non-scaling-stroke" />
          ))}
        </svg>

        <div className="nt-how-in">
          <ul>
            {MESSAGES.map((m, i) => (
              <li
                key={m.who}
                className="nt-how-msg"
                style={{ ["--top" as string]: pct(CARDS_TOP + i * (CARD_H + CARD_GAP), STAGE_H), ["--s" as string]: i * 5.5 }}
              >
                <span className="nt-how-tile" dangerouslySetInnerHTML={{ __html: colourLogos[m.app] }} />
                <span style={{ minWidth: 0 }}>
                  <span className="nt-how-who">
                    {m.who} <span>· {m.where}</span>
                  </span>
                  <span className="nt-how-snip">{m.text}</span>
                </span>
              </li>
            ))}
          </ul>
        </div>

        <div aria-hidden className="nt-how-vwire" />
        <Orb />
        <div aria-hidden className="nt-how-vwire nt-how-vwire-out" />

        <div className="nt-how-plan">
          <p className="nt-how-label" style={{ margin: 0 }}>Today</p>
          <p className="nt-how-sentence">
            Start with <span className="nt-how-link">Emily&apos;s pricing deck</span>. Sign off{" "}
            <span className="nt-how-link">the Acme contract</span> before the 2pm sync.
          </p>
          <ul>
            {TASKS.map((t, i) => {
              const tone = TONE[t.tone];
              return (
                <li key={t.title} className="nt-how-row" style={{ ["--s" as string]: 58.2 + i * 1.2 }}>
                  <span className="nt-how-ring" style={{ borderColor: tone.ring }} />
                  <span style={{ flex: 1, minWidth: 0 }}>
                    <span className="nt-how-task">{t.title}</span>
                    <span className="nt-how-from">{t.who}</span>
                  </span>
                  <span className="nt-how-due" style={{ color: tone.text, background: tone.bg }}>
                    {t.due}
                  </span>
                </li>
              );
            })}
          </ul>
        </div>
      </div>
    </section>
  );
}
