"use client";

import * as React from "react";
import { motion, useInView } from "framer-motion";
import { LaptopIcon, MessageCircleIcon } from "@/components/icons";
import {
  ClaudeCodeTerminal,
  TypedMention,
  useRevealPhases,
  useTypedQuestion,
} from "@/components/claude-code-terminal";

const EASE = [0.16, 1, 0.3, 1] as const;

/* ── Content ──────────────────────────────────────────────────── */

type TabId = "technical" | "non-technical";

const TABS: {
  id: TabId;
  label: string;
  struggleLead: string;
  struggleRest: string;
  question: string;
  answer: React.ReactNode;
  sources: { icon: string; label: string }[];
}[] = [
  {
    id: "non-technical",
    label: "Non-technical",
    struggleLead: "Your product ships faster than your pitch deck.",
    struggleRest:
      " On the call, a technical buyer asks about the API — and the real answer lives in an engineering Slack channel, written in dev-speak, three releases ahead of your battle card.",
    question: "@jarvis did we ship SSO? and what should I not promise about the API yet?",
    answer: (
      <>
        SSO shipped June 30 — SAML, tested with Okta and Azure AD. And careful
        on the API: in Friday&rsquo;s eng sync the team said the rate-limit
        rework lands next sprint — don&rsquo;t promise custom limits yet.
      </>
    ),
    sources: [
      { icon: "💬", label: "#api-platform" },
      { icon: "🎙", label: "Granola — eng sync, Jul 10" },
    ],
  },
  {
    id: "technical",
    label: "Technical",
    struggleLead: "Day 3.",
    struggleRest:
      " Fourteen Confluence tabs, a deploy process nobody wrote down — and the one person who knows it is in another timezone. Your question waits until their morning. So do you.",
    question: "@jarvis who owns the auth service — and what changed there last month?",
    answer: (
      <>
        Mark and Dasha own auth. On July 2 the team switched token refresh to
        rotating keys — decided in the backend sync, shipped in PR #142. Staging
        deploy steps are pinned in #eng-infra.
      </>
    ),
    sources: [
      { icon: "💬", label: "#backend-sync thread" },
      { icon: "📝", label: "meeting notes, Jul 2" },
      { icon: "⌥", label: "auth-service PR #142" },
    ],
  },
];

/* ── Claude Code window (Technical tab) ───────────────────────── */

function ClaudeCodeWindow({ active }: { active: boolean }) {
  const tab = TABS.find((t) => t.id === "technical")!;
  return (
    <ClaudeCodeTerminal
      question={tab.question}
      answer={tab.answer}
      sources={tab.sources}
      active={active}
      answerDelay={2800}
      sourcesDelay={3450}
    />
  );
}

/* ── Slack window (Non-technical tab) ─────────────────────────── */
/* Styled against Slack's own design system, not Panxo: aubergine chrome,
   Lato typeface, Slack near-black #1D1C1D, Slack-blue #1264A3 mentions. */

const SLACK_AUBERGINE = "#3F0E40";
const SLACK_SEARCH = "#350D36";
const SLACK_INK = "#1D1C1D";
const SLACK_MUTED = "#616061";
const SLACK_BORDER = "#E2E1E0";

function JarvisAvatar({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 36 36" fill="none" aria-hidden className={className}>
      <rect width="36" height="36" rx="8" fill="#0E1A43" />
      <ellipse cx="13.5" cy="16" rx="2.4" ry="5.4" fill="#C5F4FF" />
      <ellipse cx="22.5" cy="16" rx="2.4" ry="5.4" fill="#C5F4FF" />
    </svg>
  );
}

function SlackWindow({ active }: { active: boolean }) {
  const tab = TABS.find((t) => t.id === "non-technical")!;
  const { count, done } = useTypedQuestion(tab.question, active);
  const { answerVisible, sourcesVisible } = useRevealPhases(done, active);

  return (
    <div
      className="overflow-hidden rounded-[12px] bg-white"
      style={{
        fontFamily: "var(--font-lato)",
        boxShadow: "rgba(95,99,106,0.12) 0px 0px 0px 1px, rgba(43,43,48,0.1) 0px 1px 4px 0px",
      }}
    >
      {/* Aubergine top chrome — workspace + search */}
      <div
        className="flex h-11 items-center gap-3 px-3.5"
        style={{ backgroundColor: SLACK_AUBERGINE }}
      >
        <span className="flex items-center gap-1 text-[13px] font-bold text-white">
          Acme HQ
          <svg viewBox="0 0 20 20" fill="currentColor" className="h-3 w-3 opacity-80" aria-hidden>
            <path d="M5.5 8l4.5 4.5L14.5 8z" />
          </svg>
        </span>
        <div
          className="ml-1 flex h-6 flex-1 items-center gap-2 rounded-[8px] px-2.5"
          style={{ backgroundColor: SLACK_SEARCH }}
        >
          <svg viewBox="0 0 20 20" fill="none" stroke="rgba(255,255,255,0.65)" strokeWidth="2" className="h-3.5 w-3.5" aria-hidden>
            <circle cx="8.5" cy="8.5" r="5.5" />
            <path d="m17 17-4-4" strokeLinecap="round" />
          </svg>
          <span className="text-[12px] text-white/60">Search Acme HQ</span>
        </div>
      </div>

      {/* Channel header */}
      <div className="flex h-11 items-center gap-2 border-b px-4" style={{ borderColor: SLACK_BORDER }}>
        <span className="text-[15px] font-black tracking-[-0.1px]" style={{ color: SLACK_INK }}>
          <span className="mr-0.5" style={{ color: SLACK_MUTED }}>#</span>sales
        </span>
        <span className="text-[13px]" style={{ color: SLACK_MUTED }}>14 members</span>
      </div>

      {/* Messages */}
      <div className="min-h-[186px] space-y-4 px-4 py-4" style={{ color: SLACK_INK }}>
        {/* Your message */}
        <div className="flex gap-2.5">
          <span
            aria-hidden
            className="flex h-9 w-9 shrink-0 items-center justify-center rounded-[8px] text-[15px] font-bold"
            style={{ backgroundColor: "#E8D9B5", color: "#6B5B2E" }}
          >
            A
          </span>
          <div className="min-w-0">
            <p className="leading-none">
              <span className="text-[15px] font-black" style={{ color: SLACK_INK }}>Alex</span>
              <span className="ml-2 text-[12px]" style={{ color: SLACK_MUTED }}>2:14 PM</span>
            </p>
            <p className="mt-1 text-[15px] leading-[1.46]" style={{ color: SLACK_INK }}>
              <TypedMention
                text={tab.question}
                count={count}
                mentionClass="rounded-[3px] bg-[#1264A3]/10 px-[3px] py-px font-normal text-[#1264A3]"
              />
              {!done && active && (
                <span aria-hidden className="cursor-blink select-none" style={{ color: SLACK_MUTED }}>▍</span>
              )}
            </p>
          </div>
        </div>

        {/* Jarvis reply */}
        <div
          className="flex gap-2.5"
          style={{
            opacity: answerVisible ? 1 : 0,
            transform: answerVisible ? "translateY(0)" : "translateY(8px)",
            transition: "opacity 420ms cubic-bezier(0.16,1,0.3,1), transform 420ms cubic-bezier(0.16,1,0.3,1)",
          }}
        >
          <JarvisAvatar className="h-9 w-9 shrink-0" />
          <div className="min-w-0">
            <p className="flex items-center leading-none">
              <span className="text-[15px] font-black" style={{ color: SLACK_INK }}>Jarvis</span>
              <span
                className="ml-1.5 rounded-[3px] px-1 py-[2px] text-[10px] font-bold uppercase leading-none tracking-[0.3px]"
                style={{ backgroundColor: "#E8E8E8", color: SLACK_MUTED }}
              >
                App
              </span>
              <span className="ml-2 text-[12px]" style={{ color: SLACK_MUTED }}>2:14 PM</span>
            </p>
            <p className="mt-1 text-[15px] leading-[1.46]" style={{ color: SLACK_INK }}>
              {tab.answer}
            </p>
            <div
              className="mt-2.5 flex flex-wrap gap-2"
              style={{
                opacity: sourcesVisible ? 1 : 0,
                transform: sourcesVisible ? "translateY(0)" : "translateY(6px)",
                transition: "opacity 380ms cubic-bezier(0.16,1,0.3,1), transform 380ms cubic-bezier(0.16,1,0.3,1)",
              }}
            >
              {tab.sources.map((s) => (
                <span
                  key={s.label}
                  className="inline-flex items-center gap-1.5 rounded-[8px] border bg-white px-2.5 py-1 text-[12px]"
                  style={{ borderColor: SLACK_BORDER, color: SLACK_INK }}
                >
                  <span aria-hidden>{s.icon}</span>
                  {s.label}
                </span>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

/* ── Section ──────────────────────────────────────────────────── */

export function StrugglesSection() {
  const [tabId, setTabId] = React.useState<TabId>("non-technical");
  const ref = React.useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true, amount: 0.35 });
  const tab = TABS.find((t) => t.id === tabId)!;

  return (
    <section id="problem" className="scroll-mt-24 bg-ledger-white">
      <div className="mx-auto w-full max-w-6xl px-6 py-24 sm:py-32">
        {/* Heading */}
        <div className="mx-auto max-w-2xl text-center">
          <h2 className="text-balance font-display text-3xl font-semibold leading-[1.15] tracking-[-0.64px] text-foreground sm:text-4xl">
            Same struggle. Every role.
          </h2>
          <p className="mt-4 text-pretty text-lg leading-relaxed text-muted-foreground">
            Whether you write the code or sell it, the answer already exists
            somewhere in your tools — just not where you can find it.
          </p>
        </div>

        {/* Tabs — centered above everything, the section's primary control */}
        <div role="tablist" aria-label="Team struggles" className="mt-10 flex justify-center gap-2">
          {TABS.map((t) => {
            const selected = t.id === tabId;
            const Icon = t.id === "technical" ? LaptopIcon : MessageCircleIcon;
            return (
              <button
                key={t.id}
                role="tab"
                aria-selected={selected}
                aria-controls={`struggle-panel-${t.id}`}
                onClick={() => setTabId(t.id)}
                className={
                  "inline-flex items-center gap-2 rounded-full px-5 py-2.5 text-[14px] font-medium leading-none transition-colors focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-coal-ink " +
                  (selected
                    ? "bg-coal-ink text-white"
                    : "border border-black/10 text-coal-ink/70 hover:text-coal-ink")
                }
              >
                <Icon className="h-4 w-4" />
                {t.label}
              </button>
            );
          })}
        </div>

        <div ref={ref} className="mt-16 grid items-start gap-10 lg:grid-cols-[2fr_3fr] lg:gap-16">
          {/* Left — struggle narrative */}
          <div className="lg:mt-2">
            <span className="text-[12px] font-medium uppercase leading-none tracking-[0.05em] text-graphite">
              The struggle
            </span>
            <motion.p
              key={`copy-${tabId}`}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4, ease: EASE }}
              className="mt-4 text-[17px] leading-[1.65] tracking-[-0.17px] text-slate-mid"
            >
              <span className="font-semibold text-coal-ink">{tab.struggleLead}</span>
              {tab.struggleRest}
            </motion.p>
          </div>

          {/* Right — product demo window */}
          <motion.div
            key={`demo-${tabId}`}
            id={`struggle-panel-${tabId}`}
            role="tabpanel"
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.45, ease: EASE }}
          >
            {tabId === "technical" ? (
              <ClaudeCodeWindow active={inView} />
            ) : (
              <SlackWindow active={inView} />
            )}
          </motion.div>
        </div>
      </div>
    </section>
  );
}
