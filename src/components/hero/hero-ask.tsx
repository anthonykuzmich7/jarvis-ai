"use client";

import * as React from "react";
import { motion, useReducedMotion } from "framer-motion";
import { ArrowRight } from "lucide-react";
import { KineticHeadline } from "@/components/hero/kinetic-headline";
import { FilmModal } from "@/components/hero/film-modal";
import { MeetingAssistStage } from "@/components/hero/meeting-assist-stage";
import { FocusDayStage } from "@/components/hero/focus-day-stage";
import {
  ClaudeCodeTerminal,
  type ClaudeCodeSource,
  type ClaudeCodeTool,
} from "@/components/claude-code-terminal";

/*
  Variant A — "Ask".

  The hero is the product surface, not a film of it. Jarvis answers questions
  from your team's memory, so the hero lets you ask one and watch it answered,
  cited. Pick a question, the terminal types it and the answer resolves.

  Why this instead of the embedded film: a 16:9 film has to reserve its frame
  whether or not the current act fills it, and two of the five acts do not.
  A terminal card is sized by its content, so there is no reserved emptiness
  anywhere and the whole hero costs about 560px of height instead of 830.

  Full viewport height, deliberately. The hero is content-sized by nature (a
  headline block beside a terminal card comes to about 420px), which left the
  next section's headline peeking above the fold on a 14-inch laptop and made
  the landing read as a strip rather than a screen. `min-h`, not `h`, so a
  short window lets the content grow instead of clipping it.

  The section centres its child, and the child carries 92px of top padding:
  the nav's 76px plus a little air. The nav is `fixed` and reserves no layout
  space, so without that the block centres against the true viewport and hangs
  under the bar.

  Measured at 1600x822: 192px above the headline, 244px below the chips, in a
  746px region under the nav. That leaves the content ~26px above true centre,
  which is where a hero wants to sit. Each 16px of top padding moves it 8px
  down, so exact centring would need pt-[144px]; that is a lot of padding to
  spend correcting a bias that is already in the right direction.

  The film is not thrown away. It moves to a text link that opens it in a
  modal (`FilmModal`), where it plays as the real MP4 with its audio, on a
  white card with the page blurred behind it.
*/

const EASE = [0.16, 1, 0.3, 1] as const;

/* One reserved SLOT, sized to the tallest tab, with each card sitting at
   the top of it at its own natural height. The tab row hangs off the bottom
   of the slot, so it never moves when you switch, which is the thing that
   must not happen: press a tab and the row you are pressing walks out from
   under the cursor.

   The three cards were the same height until Focus arrived. Padding a
   terminal out to a whole day's height is 170px of dead black inside the
   card, which reads as a window that failed to finish loading; 50px of page
   air under a card that is simply shorter does not read as anything. So the
   slack moved outside the cards.

   Focus is what sets these numbers: its plate, then seven hours at a
   readable ~34 each. It measures the slot and fills it, so the day stretches
   or tightens with these rather than needing to be told twice. */
const SLOT = 528;
/* Phone. The focus sentence wraps to five lines in a 350px card instead of
   three, and the terminal's answer picks up a line as well. */
const SLOT_SM = 604;
/* Below 360px the sentence takes a sixth line. */
const SLOT_XS = 630;

/* Terminal and meeting-stage body: their own content plus a little dark
   room, which is what a terminal is supposed to look like and what the
   meeting stage bursts into. Chosen so the air left under them inside the
   slot stays about 50px at every width rather than swinging from 30 to 80,
   which would read as a different gap on every device. */
const CARD_BODY = 448;
const CARD_BODY_SM = 524;
const CARD_BODY_XS = 550;

type Ask = {
  question: string;
  tool: ClaudeCodeTool;
  answer: React.ReactNode;
  sources: ClaudeCodeSource[];
};

/* The tabs switch capability, not example. They used to hold three
   variations of the same trick (three questions, one terminal), which
   sold the hero short: retrieval is one of three things Jarvis does, and
   the other two have no terminal in them at all.

   Every label is verb-first. "Assist on the call" is also the wording of
   the app's own menu item, and that tab stages what the menu item opens.

   Focus leads, because it is the first thing that happens: Jarvis has read
   everything by the time you sit down, and the day is what it hands you.
   Retrieval and the meeting are what you reach for later in that day. */
const TABS = ["Start your day", "Pull context", "Assist on the call"] as const;

/* Demo fixtures, consistent with the ones StrugglesSection and the film
   already use (#eng, PR #142, David Park, the payments bug). Do not invent a
   CLAIM to fill a chip — the answers here are the film's, verbatim.

   `search_context` is the real name of Jarvis's primary MCP retrieval tool,
   not a plausible-looking invention, and Claude Code displays MCP tools as
   `server - tool`. Each tool result's source count matches the number of
   citation chips that follow it, so the two halves of the beat agree.

   Each question opens with the @jarvis mention, matching ConnectAnywhere and
   StrugglesSection. It is what makes `TypedMention` tint the handle violet as
   it types, and it names who is being asked in a window titled Claude Code.

   The answer cites several tools on purpose. One citation reads as a search
   box; four, spanning chat, tickets, code and meetings, is the actual product
   argument: the answer was assembled from places no single tool can see at
   once. That is the whole reason the film opens on five apps overflowing. */
const ASK: Ask = {
  question: "@jarvis what did I miss on the payments bug?",
  tool: {
    name: "jarvis - search_context",
    args: 'query: "payments bug"',
    result: "12 messages across 4 sources",
  },
  answer: (
    <>
      Tom&rsquo;s fix is in review, not shipped. It double-charged 3 customers.
    </>
  ),
  sources: [
    { mark: "slack", label: "#eng · 3d" },
    { mark: "linear", label: "ENG-2481" },
    { mark: "github", label: "PR #142" },
    { mark: "meetings", label: "Eng sync, Aug 19" },
  ],
};

export function HeroAsk() {
  const reduce = useReducedMotion();
  const [tab, setTab] = React.useState(0);
  const [filmOpen, setFilmOpen] = React.useState(false);

  return (
    <section
      id="home"
      /* No ground of its own: the wrapper in page.tsx carries the paper
         and the shared PaperGlow. The light used to live in here, where
         this section's `overflow-hidden` sliced it flat at the bottom
         edge and drew a rule between the hero and the section below. */
      /* `items-start` until the grid goes two-column. In one column the
         stack is taller than the viewport, and centring content that
         overflows its container pushes the top of it up under the nav —
         the headline loses its first line before you have scrolled at
         all. Two columns fit, so there it centres. */
      className="relative flex min-h-[100dvh] w-full items-start overflow-hidden scroll-mt-16 xl:items-center"
    >
      <div className="relative mx-auto grid w-full max-w-[1400px] items-center gap-10 px-5 pb-14 pt-[84px] sm:px-6 sm:gap-14 xl:grid-cols-[0.92fr_1.08fr] xl:gap-16 xl:pb-8 xl:pt-[92px]">
        {/* Left — the claim */}
        <div>
          <motion.div
            initial={reduce ? false : { opacity: 0, y: 22 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.9, ease: EASE }}
          >
            <KineticHeadline
              /* Two clamps rather than one. A single `clamp(44px, 5vw, 84px)`
                 bottoms out at 44px, which is exactly as wide as the word
                 "repeating" can be in a 320px column before it breaks. */
              className="text-[clamp(38px,10.5vw,44px)] text-coal-ink sm:text-[clamp(44px,5vw,84px)]"
            />
          </motion.div>

          <motion.p
            initial={reduce ? false : { opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.9, delay: 0.12, ease: EASE }}
            className="mt-6 max-w-[42ch] text-[16px] leading-[1.55] tracking-[-0.17px] text-slate-mid text-pretty sm:mt-7 sm:text-[17px]"
          >
            To your AI, and to your team. Jarvis holds your context and hands it
            to whoever asks.
          </motion.p>

          <motion.div
            initial={reduce ? false : { opacity: 0, y: 14 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.9, delay: 0.22, ease: EASE }}
            className="mt-8 flex flex-wrap items-center gap-x-6 gap-y-4 sm:mt-9 sm:gap-x-7"
          >
            <a
              href="#waitlist"
              className="cta-shine relative inline-flex cursor-pointer items-center overflow-hidden whitespace-nowrap rounded-full bg-coal-ink px-7 py-3.5 text-sm font-semibold leading-none tracking-[-0.14px] text-white transition-colors hover:bg-graphite active:scale-[0.98] sm:px-8 sm:py-4"
            >
              Get early access
            </a>
            <button
              type="button"
              onClick={() => setFilmOpen(true)}
              className="group inline-flex cursor-pointer items-center gap-2 text-sm font-medium leading-none tracking-[-0.14px] text-graphite transition-colors hover:text-coal-ink"
            >
              Watch how it works
              <ArrowRight
                className="h-4 w-4 transition-transform group-hover:translate-x-0.5"
                strokeWidth={1.75}
              />
            </button>
          </motion.div>
        </div>

        {/* Right — ask it something */}
        <motion.div
          initial={reduce ? false : { opacity: 0, y: 26 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.9, delay: 0.3, ease: EASE }}
        >
          {/* The reserved slot. Every card is top-aligned in it and keeps
              its own height, so the tab row below sits at a fixed distance
              from the headline whichever tab is open.

              Focus resizes ITSELF inside this box: it opens as the plate
              alone and grows into the day, which is the argument the tab is
              making. Because the box was already reserved, nothing below it
              moves while that happens. */}
          {/* Swapped outright, not crossfaded. Every tab is the same dark
              window on the same ground, so a fade between them reads as a
              flicker rather than a transition, and `mode="wait"` would hold
              the new card back until the old one finished leaving: press a
              tab, watch nothing happen. The motion that matters is inside
              each card, and it starts on mount. */}
          {/* Centred, not top-aligned. Focus opens as a sentence and only
              grows into the day a beat later, so at the top of the box it
              spent that beat as a small card marooned above a field of
              empty paper. Centred, the short state reads as a card with air
              around it and the growth opens from the middle. */}
          <div
            className="flex items-center h-[var(--slot-xs)] min-[360px]:h-[var(--slot-sm)] sm:h-[var(--slot)]"
            style={
              {
                "--slot": `${SLOT}px`,
                "--slot-sm": `${SLOT_SM}px`,
                "--slot-xs": `${SLOT_XS}px`,
              } as React.CSSProperties
            }
          >
          {/* `w-full`: a flex item shrinks to its content, and every card
              here is a block that expects the column's whole width. */}
          <div className="w-full">
          {tab === 0 ? (
            <FocusDayStage active />
          ) : tab === 1 ? (
            <ClaudeCodeTerminal
              question={ASK.question}
              answer={ASK.answer}
              sources={ASK.sources}
              tool={ASK.tool}
              active
              toolDelay={700}
              toolResultDelay={1500}
              height={CARD_BODY}
              mobileHeight={CARD_BODY_SM}
              narrowHeight={CARD_BODY_XS}
            />
          ) : (
            <MeetingAssistStage
              active
              height={CARD_BODY + 40}
              mobileHeight={CARD_BODY_SM + 40}
            />
          )}
          </div>
          </div>

          <div
            role="tablist"
            aria-label="What Jarvis does"
            className="mt-4 flex flex-wrap gap-2"
          >
            {TABS.map((label, n) => {
              const selected = n === tab;
              return (
                <button
                  key={label}
                  type="button"
                  role="tab"
                  aria-selected={selected}
                  onClick={() => setTab(n)}
                  className={
                    "cursor-pointer rounded-full px-4 py-2 text-[13px] font-medium leading-none tracking-[-0.13px] transition-colors focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-coal-ink " +
                    (selected
                      ? "bg-coal-ink text-white"
                      : "border border-black/10 text-coal-ink/70 hover:border-black/20 hover:text-coal-ink")
                  }
                >
                  {label}
                </button>
              );
            })}
          </div>
        </motion.div>
      </div>

      <FilmModal open={filmOpen} onClose={() => setFilmOpen(false)} />
    </section>
  );
}
