"use client";

import * as React from "react";
import { motion, useReducedMotion } from "framer-motion";
import { ArrowRight } from "lucide-react";
import { KineticHeadline } from "@/components/hero/kinetic-headline";
import { FilmModal } from "@/components/hero/film-modal";
import { capture } from "@/lib/analytics";
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
   the top of it at its own natural height. The tab row sits ABOVE the slot
   now (BELOW it on a phone), so it never moves when you switch — which is
   the thing that must not happen: press a tab and the row you are pressing
   walks out from under the cursor.

   ── Desktop ──
   The three cards were the same height until Focus arrived. Padding a
   terminal out to a whole day's height is 170px of dead black inside the
   card, which reads as a window that failed to finish loading; 50px of page
   air under a card that is simply shorter does not read as anything. So the
   slack moved outside the cards, and Focus sets the number: its plate, then
   seven hours. The terminal and meeting bodies then take CARD_BODY, their
   own content plus a little dark room.

   ── Phone (below sm) ──
   Every tab is trimmed to the SAME height, SLOT_MOBILE, so the slot never
   resizes when you switch and the tab row beneath it never jumps. The
   focus card sets it: content-height at ~498 across the 320–414 band with
   its shortened phone sentence. The meeting stage and the terminal are
   told to fill exactly that same box rather than carrying their desktop
   dark-room, which on a phone was just a tall band of empty black. */
const SLOT = 528;
const SLOT_MOBILE = 504;

/* Terminal and meeting-stage body on DESKTOP: their own content plus a
   little dark room. On a phone both are driven by SLOT_MOBILE instead. */
const CARD_BODY = 448;
/* The terminal's own title bar (h-10 + a hairline), added on top of its
   body — so the body has to be SLOT_MOBILE minus this to make the whole
   window match the other two tabs. */
const TERMINAL_CHROME = 41;

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
   The meeting follows it, because the day it just handed you has two of them
   in it and a Join sitting on each — the second tab is the first tab's own
   10:00, opened. Retrieval comes last: it is the only one of the three with
   no hour attached, the thing you reach for at any point in that day.

   "Focus your day" rather than "Start your day". Starting is what a clock
   does; the claim is that Jarvis sorted the day before you got to it. It
   stays a verb because the other two are, and it is not "Today's focus" —
   that is the card's own eyebrow, printed directly above this row. */
const TABS = ["Focus your day", "Assist on the call", "Pull context"] as const;

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
        {/* Left — the claim.

            `min-w-0`: a grid track's floor is its content's min-content
            width, and this column's is wider than a phone. Without it the
            column refuses to shrink below ~450px in a 375px viewport and
            the page's `overflow-x-clip` slices the headline and subheading
            off at the right edge. */}
        <div className="min-w-0">
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
              onClick={() =>
                capture("early_access_clicked", {
                  label: "Get early access",
                  placement: "hero",
                })
              }
              className="cta-shine relative inline-flex cursor-pointer items-center overflow-hidden whitespace-nowrap rounded-full bg-coal-ink px-7 py-3.5 text-sm font-semibold leading-none tracking-[-0.14px] text-white transition-colors hover:bg-graphite active:scale-[0.98] sm:px-8 sm:py-4"
            >
              Get early access
            </a>
            <button
              type="button"
              onClick={() => {
                capture("film_opened");
                setFilmOpen(true);
              }}
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

        {/* Right — ask it something.

            A flex column so the tab row can be reordered under the card on
            a phone (see the `order-*` classes below): the control sits
            above the thing it changes on desktop, but on a narrow screen
            the card is the hero and the tabs ride beneath it. `min-w-0`
            for the same grid-track reason as the left column. */}
        <motion.div
          initial={reduce ? false : { opacity: 0, y: 26 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.9, delay: 0.3, ease: EASE }}
          className="flex min-w-0 flex-col"
        >
          {/* The tabs, ABOVE the card and styled as tabs, not buttons.

              They used to be a row of pills below the card: the selected one
              filled coal-ink — the exact treatment of the "Get early access"
              CTA a column to the left — and the rest were ghost outlines, so
              the hero showed five things shaped like calls to action and
              only two were. This is the nav's own idiom instead: a bare
              label, ink when live and stone when not, with a 2px smolder
              rule that slides to the active one, all riding a single ash
              hairline. Nothing here is filled or bordered, so nothing here
              reads as a button.

              Above the card, not below: a control the reader has not found
              yet belongs before the thing it changes, and up here it never
              moves — Focus grows DOWNWARD inside the slot, so a tab row
              beneath it needed the slot's whole reserved height just to
              hold still. */}
          {/* On a phone this row is ordered under the card and carries its
              gap on top (`order-2 mt-7`); from `sm` up it returns to its
              place above the card with the gap below (`sm:order-1
              sm:mt-0 sm:mb-6`). */}
          <div
            role="tablist"
            aria-label="What Jarvis does"
            className="relative order-2 mt-7 flex flex-wrap gap-x-6 gap-y-1 border-b border-ash sm:order-1 sm:mt-0 sm:mb-6"
          >
            {TABS.map((label, n) => {
              const selected = n === tab;
              return (
                <button
                  key={label}
                  type="button"
                  role="tab"
                  aria-selected={selected}
                  /* Which pitch a visitor reaches for is the one signal the
                     hero gives that a click map cannot: the three tabs are
                     the same control in the same place. */
                  onClick={() => {
                    capture("hero_tab_selected", { tab: label, index: n });
                    setTab(n);
                  }}
                  className={
                    "relative cursor-pointer pb-2.5 text-[13px] font-medium leading-none tracking-[-0.13px] transition-colors focus-visible:rounded-sm focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-coal-ink " +
                    (selected
                      ? "text-coal-ink"
                      : "text-stone hover:text-coal-ink")
                  }
                >
                  {label}
                  {selected ? (
                    <motion.span
                      aria-hidden
                      layoutId="hero-tab-rule"
                      className="absolute -bottom-px left-0 right-0 block h-[2px] rounded-full bg-smolder"
                      transition={
                        reduce
                          ? { duration: 0 }
                          : { type: "spring", stiffness: 400, damping: 32 }
                      }
                    />
                  ) : null}
                </button>
              );
            })}
          </div>

          {/* The reserved slot. Every card is top-aligned in it and keeps
              its own height; with the tabs now above it, the slot only has
              to keep whatever sits BELOW the card from jumping as Focus
              grows.

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
            className="order-1 flex items-center h-[var(--slot-mobile)] sm:order-2 sm:h-[var(--slot)]"
            style={
              {
                "--slot": `${SLOT}px`,
                "--slot-mobile": `${SLOT_MOBILE}px`,
              } as React.CSSProperties
            }
          >
          {/* `w-full`: a flex item shrinks to its content, and every card
              here is a block that expects the column's whole width. */}
          <div className="w-full">
          {tab === 0 ? (
            <FocusDayStage active />
          ) : tab === 1 ? (
            <MeetingAssistStage
              active
              height={CARD_BODY + 40}
              mobileHeight={SLOT_MOBILE}
            />
          ) : (
            <ClaudeCodeTerminal
              question={ASK.question}
              answer={ASK.answer}
              sources={ASK.sources}
              tool={ASK.tool}
              active
              toolDelay={700}
              toolResultDelay={1500}
              height={CARD_BODY}
              mobileHeight={SLOT_MOBILE - TERMINAL_CHROME}
              narrowHeight={SLOT_MOBILE - TERMINAL_CHROME}
            />
          )}
          </div>
          </div>
        </motion.div>
      </div>

      <FilmModal open={filmOpen} onClose={() => setFilmOpen(false)} />
    </section>
  );
}
