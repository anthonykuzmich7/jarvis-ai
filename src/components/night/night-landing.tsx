import { JarvisWindow } from "@/components/night/jarvis-window";
import { FilmButton, GetStartedLink, RecordingPill } from "@/components/night/night-actions";
import { colourLogos, monoLogos, type ColourLogo, type MonoLogo } from "@/components/night/brand-svgs";
import { faqs } from "@/lib/faqs";
import { NightFooter, NightNav } from "@/components/night/night-shell";
import { HowItWorks } from "@/components/night/night-how";
import { CONTACT_EMAIL } from "@/lib/site";

/*
  The homepage, "Night" style (designed on the Jarvis website canvas,
  2026-10-15): nav, hero with the glowing app window, the sources row, three
  feature cards, the privacy "0", the FAQ and a closing call to action.

  A server component; the four interactive pieces (CTAs, film, recording pill,
  app window) are client islands imported from night-actions / jarvis-window.
*/

function Logo({ name, kind }: { name: string; kind: "mono" | "colour" }) {
  const svg = kind === "mono" ? monoLogos[name as MonoLogo] : colourLogos[name as ColourLogo];
  return <span style={{ display: "flex" }} dangerouslySetInnerHTML={{ __html: svg }} />;
}

function Hero() {
  return (
    <>
      <section className="nt-wrap nt-hero">
        <h1>
          <span style={{ display: "block" }}>
            Stop <span className="nt-mark">repeating</span>
          </span>
          <span style={{ display: "block" }}>yourself.</span>
        </h1>
        <p>Jarvis turns your chats, email and meetings into a clear plan for today.</p>
        <div className="nt-ctas">
          <GetStartedLink placement="hero" className="nt-btn nt-btn-primary" />
          <FilmButton placement="hero" className="nt-btn nt-btn-ghost" />
        </div>
      </section>

      <section aria-label="Jarvis on your Mac" className="nt-wrap nt-stage">
        {/* The sunrise behind the window: four stacked radial lights. */}
        <div aria-hidden className="nt-glow" style={{ top: -60, width: 1700, maxWidth: "160vw", height: 640, background: "radial-gradient(ellipse 50% 60% at 50% 72%, rgba(255,110,40,0.55) 0%, rgba(220,80,20,0.32) 40%, rgba(120,40,10,0.14) 65%, transparent 85%)", filter: "blur(30px)" }} />
        <div aria-hidden className="nt-glow" style={{ top: -20, width: 1250, maxWidth: "130vw", height: 400, background: "radial-gradient(ellipse 50% 100% at 50% 100%, rgba(255,170,90,1) 0%, rgba(255,100,32,0.85) 24%, rgba(210,65,15,0.40) 52%, transparent 76%)" }} />
        <div aria-hidden className="nt-glow" style={{ top: 250, width: 820, maxWidth: "95%", height: 200, background: "radial-gradient(ellipse 50% 50% at 50% 30%, rgba(255,210,150,1), transparent 70%)", filter: "blur(28px)" }} />
        <div aria-hidden className="nt-glow" style={{ top: 380, left: "-10%", right: "-10%", transform: "none", height: 520, background: "radial-gradient(ellipse 60% 50% at 50% 40%, rgba(255,96,32,0.26), transparent 75%)", filter: "blur(40px)" }} />
        <div style={{ position: "relative" }}>
          <div aria-hidden style={{ position: "absolute", left: "12%", right: "12%", top: 0, height: 1, zIndex: 2, background: "linear-gradient(to right, transparent, rgba(255,210,170,1) 50%, transparent)" }} />
          <JarvisWindow />
        </div>
      </section>
    </>
  );
}

function Film() {
  return (
    <section id="film" aria-labelledby="film-title" className="nt-wrap nt-film">
      <div style={{ maxWidth: 900, margin: "0 auto", textAlign: "center" }}>
        <h2 id="film-title" className="nt-h2">
          See it in <span className="nt-mark">a minute.</span>
        </h2>
      </div>
      {/* Nothing downloads until play is pressed: preload="none" plus a poster. */}
      <video className="nt-film-video" src="/jarvis-film.mp4" poster="/jarvis-film.jpg" controls playsInline preload="none" />
    </section>
  );
}

const SOURCES = ["Slack", "Gmail", "Jira", "Telegram", "Rocket.Chat", "Mail", "Google Calendar"];

function Sources() {
  return (
    <section aria-label="Sources" className="nt-wrap" style={{ paddingTop: 72, textAlign: "center" }}>
      <p style={{ margin: 0, fontSize: 15, color: "#8B8B94" }}>Reads the places your work already happens</p>
      <ul className="nt-sources">
        {SOURCES.map((s) => (
          <li key={s}>
            <Logo name={s} kind="mono" />
            {s}
          </li>
        ))}
      </ul>
    </section>
  );
}

const ROW_A: ColourLogo[] = ["Slack", "Gmail", "Jira", "Telegram"];
const ROW_B: ColourLogo[] = ["Rocket.Chat", "Google Calendar", "Apple Mail", "Slack"];

function Marquee() {
  /* Each row is its logos twice over, so translating by -50% loops seamlessly. */
  const row = (logos: ColourLogo[], rev: boolean) => (
    <div className={rev ? "nt-track nt-track-rev" : "nt-track"}>
      {[...logos, ...logos].map((l, i) => (
        <span key={i} className="nt-tile" title={l}>
          <Logo name={l} kind="colour" />
        </span>
      ))}
    </div>
  );
  return (
    <div className="nt-marquee" aria-hidden>
      {row(ROW_A, false)}
      {row(ROW_B, true)}
    </div>
  );
}

function MiniCalendar() {
  return (
    <div aria-hidden style={{ position: "relative", width: 300, height: 210 }}>
      {[
        [10, "10"],
        [100, "11"],
        [190, "12"],
      ].map(([top, label]) => (
        <div key={label} style={{ position: "absolute", left: 0, right: 0, top: Number(top), borderTop: "1px solid rgba(255,255,255,0.06)" }}>
          <span className="nt-hr">{label}</span>
        </div>
      ))}
      <div style={{ position: "absolute", left: 28, top: 0, bottom: 0, width: 2, background: "rgba(255,255,255,0.12)" }} />
      <div style={{ position: "absolute", left: 28, right: 0, top: 11, height: 40, borderLeft: "2px solid #F4F4F5", background: "rgba(255,255,255,0.075)", borderRadius: "0 9px 9px 0", padding: "0 12px", display: "flex", alignItems: "center", boxSizing: "border-box", fontSize: 13, fontWeight: 600 }}>
        Eng standup · 10:00
      </div>
      <div style={{ position: "absolute", left: 28, right: 0, top: 101, height: 88, borderLeft: "2px solid #F4F4F5", background: "rgba(255,255,255,0.075)", borderRadius: "0 9px 9px 0", padding: "0 12px", display: "flex", alignItems: "center", gap: 10, boxSizing: "border-box" }}>
        <span style={{ flex: 1 }}>
          <span style={{ display: "block", fontSize: 13, fontWeight: 600 }}>1:1 with Alex Wang</span>
          <span style={{ display: "block", fontSize: 11, color: "#A1A1AA" }}>11:00–12:00 · Google Meet</span>
        </span>
        <span className="nt-join">Join</span>
      </div>
      <div className="nt-now">
        <span style={{ width: 9, height: 9, borderRadius: "50%", background: "#F87171", display: "block", marginLeft: 24, boxShadow: "0 0 0 3px #111113" }} />
        <span style={{ flex: 1, height: 1, background: "rgba(248,113,113,0.5)" }} />
      </div>
    </div>
  );
}

function Features() {
  return (
    <section id="product" className="nt-wrap" style={{ paddingTop: 160, scrollMarginTop: 24 }}>
      <div style={{ maxWidth: 760, margin: "0 auto", textAlign: "center" }}>
        <h2 className="nt-h2">Everything you need to stay on top of your work.</h2>
        <p className="nt-lede">
          One app reads your chats and mail, records your calls and plans your day around them. No separate
          note-taker, no second to-do list.
        </p>
      </div>
      <div className="nt-feats">
        <div className="nt-feat">
          <div className="nt-feat-stage" style={{ padding: 0 }}>
            <Marquee />
          </div>
          <h3>Every task, from every app</h3>
          <p>Jarvis reads Slack, mail, Telegram, Rocket.Chat and Jira, keeps the context, and hands you one ranked list.</p>
        </div>

        <div className="nt-feat" id="meetings" style={{ scrollMarginTop: 24 }}>
          <div className="nt-feat-stage">
            <div aria-hidden className="nt-rec-glow" />
            <RecordingPill />
          </div>
          <h3>Record your meetings</h3>
          <p>Replaces your note-taker. No bot joins the call. Jarvis transcribes it on your Mac and your action points land in your list.</p>
        </div>

        <div className="nt-feat">
          <div className="nt-feat-stage">
            <MiniCalendar />
          </div>
          <h3>Plan your day</h3>
          <p>Your tasks beside your real calendar, with a Join button on every call that has a link.</p>
        </div>
      </div>
    </section>
  );
}

function Privacy() {
  return (
    <section id="privacy" className="nt-wrap" style={{ paddingTop: 160, textAlign: "center" }}>
      <div className="nt-zero" aria-hidden>
        0
      </div>
      <h2 className="nt-h2" style={{ margin: "10px auto 0", maxWidth: "32ch", fontSize: "clamp(28px, 3.4vw, 44px)" }}>
        <span className="sr-only">Zero </span>messages, tasks or meetings live on our servers.
      </h2>
      <div className="nt-facts">
        <div className="nt-fact">
          <svg width="42" height="42" viewBox="0 0 30 30" fill="none" aria-hidden>
            <rect x="3" y="8" width="24" height="14" rx="3" stroke="#D4D4D8" strokeWidth="1.5" />
            <path d="M7 15h9" stroke="#71717A" strokeWidth="1.5" strokeLinecap="round" />
            <circle cx="22" cy="15" r="1.6" fill="#FF8A4C" />
          </svg>
          <b>Stored on your device</b>
          <span>Tasks, email and meeting notes are saved on your device.</span>
        </div>
        <div className="nt-fact">
          <svg width="42" height="42" viewBox="0 0 30 30" fill="none" aria-hidden>
            <rect x="3" y="9" width="24" height="12" rx="6" stroke="#D4D4D8" strokeWidth="1.5" />
            <circle cx="9" cy="15" r="3.5" fill="#71717A" />
          </svg>
          <b>Deleted when you disconnect</b>
          <span>Turn an app off and what came from it is removed.</span>
        </div>
      </div>
    </section>
  );
}

function Faq() {
  return (
    <section id="faq" className="nt-wrap nt-faq" style={{ paddingTop: 160, scrollMarginTop: 24 }}>
      <div style={{ flex: "1 1 300px", minWidth: 0 }}>
        <p className="nt-eyebrow">FAQ</p>
        <h2 className="nt-h2" style={{ fontSize: "clamp(32px, 4vw, 48px)" }}>
          Questions you&apos;re already asking.
        </h2>
        <p style={{ margin: "18px 0 0", fontSize: 15, color: "#8B8B94" }}>
          Something else? <a href={`mailto:${CONTACT_EMAIL}`}>{CONTACT_EMAIL}</a>
        </p>
      </div>
      <div style={{ flex: "2 1 560px", minWidth: 0, borderTop: "1px solid rgba(255,255,255,0.08)" }}>
        {faqs.map((f, i) => (
          <details key={f.q} open={i === 0}>
            <summary>
              {f.q}
              <span className="nt-chev" aria-hidden>
                +
              </span>
            </summary>
            <p>{f.a}</p>
          </details>
        ))}
      </div>
    </section>
  );
}

function Closing() {
  return (
    <section aria-label="Get Jarvis" className="nt-wrap" style={{ padding: "200px 24px 180px", textAlign: "center" }}>
      <div aria-hidden className="nt-glow" style={{ bottom: 0, width: 1500, maxWidth: "160vw", height: 520, background: "radial-gradient(ellipse 50% 70% at 50% 100%, rgba(255,150,70,0.65) 0%, rgba(255,96,32,0.35) 30%, rgba(150,50,15,0.12) 60%, transparent 82%)", filter: "blur(20px)" }} />
      <div style={{ position: "relative" }}>
        <h2 className="nt-h2" style={{ fontSize: "clamp(44px, 6.4vw, 84px)", maxWidth: "14ch", marginLeft: "auto", marginRight: "auto" }}>
          Tomorrow, wake up to a <span className="nt-mark">sorted</span> day.
        </h2>
        <div className="nt-ctas" style={{ marginTop: 40 }}>
          <GetStartedLink placement="closing" className="nt-btn nt-btn-primary" />
          <FilmButton placement="closing" className="nt-btn nt-btn-ghost" />
        </div>
        <p style={{ margin: "18px 0 0", fontSize: 14, color: "#D4D4D8" }}>7 days free · no card</p>
      </div>
    </section>
  );
}

export function NightLanding() {
  return (
    <div className="nt">
      <div className="nt-tiles" aria-hidden />
      <NightNav home />
      <main>
        <Hero />
        <Sources />
        <Film />
        <Features />
        <HowItWorks />
        <Privacy />
        <Faq />
        <Closing />
      </main>
      <NightFooter home />
    </div>
  );
}
