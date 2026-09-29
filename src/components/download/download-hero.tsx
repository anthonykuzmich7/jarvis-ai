"use client";

import {
  useActionState,
  useEffect,
  useRef,
  useState,
  useSyncExternalStore,
} from "react";
import { useFormStatus } from "react-dom";
import { motion, useReducedMotion } from "framer-motion";
import { JarvisMark } from "@/components/jarvis-mark";
import { capture } from "@/lib/analytics";
import { attributionFields } from "@/lib/attribution";
import { requestDownloadLink, type WaitlistState } from "@/app/actions";
import type { Release } from "@/lib/release";

const EASE = [0.23, 1, 0.32, 1] as const;

/* "your" is the soft word: the headline is about the Mac being yours, and
   greying it lets the eye land on "Jarvis" and "Mac" first. */
const WORDS = [
  { text: "Jarvis", soft: false },
  { text: "for", soft: false },
  { text: "your", soft: true },
  { text: "Mac.", soft: false },
];

/**
 * True for a Mac, false for anything else, null until the browser has been
 * asked. iPadOS reports a Mac user agent, so a touch screen rules it out.
 * The server renders the Mac state, since that is who this page is for.
 */
function useIsMac(): boolean | null {
  return useSyncExternalStore(noSubscribe, detectMac, () => null);
}

const noSubscribe = () => () => {};

function detectMac(): boolean {
  const nav = navigator as Navigator & {
    userAgentData?: { platform?: string };
  };
  const platform = nav.userAgentData?.platform ?? nav.platform ?? "";
  const mac = /mac/i.test(platform) || /Macintosh/.test(nav.userAgent);
  return mac && nav.maxTouchPoints < 2;
}

/** The mark on its app-icon plate. It glances and blinks, like it does in the app. */
function MarkPlate() {
  const reduce = useReducedMotion();
  const [look, setLook] = useState({ x: 0, y: 0 });
  const [blink, setBlink] = useState(false);

  useEffect(() => {
    if (reduce) return;
    const beats: Array<[number, () => void]> = [
      [1600, () => setBlink(true)],
      [1720, () => setBlink(false)],
      [3200, () => setLook({ x: 8, y: -3 })],
      [4300, () => setLook({ x: -6, y: 2 })],
      [5400, () => setLook({ x: 0, y: 0 })],
    ];
    let timers: ReturnType<typeof setTimeout>[] = [];
    const run = () => {
      timers = beats.map(([ms, fn]) => setTimeout(fn, ms));
    };
    run();
    const loop = setInterval(run, 7000);
    return () => {
      clearInterval(loop);
      timers.forEach(clearTimeout);
    };
  }, [reduce]);

  return (
    <motion.div
      initial={reduce ? false : { opacity: 0, scale: 0.9, y: 8 }}
      animate={{ opacity: 1, scale: 1, y: 0 }}
      transition={{ duration: 0.7, ease: EASE }}
      aria-hidden
      className="relative h-[92px] w-[92px] rounded-[24px] bg-gradient-to-b from-white to-[#f2efe8] sm:h-[104px] sm:w-[104px] sm:rounded-[26px]"
      style={{
        boxShadow:
          "rgba(43,43,48,0.1) 0px 0px 0px 1px, rgba(43,43,48,0.16) 0px 18px 40px 0px",
      }}
    >
      <JarvisMark
        className="absolute inset-[16%] h-[68%] w-[68%]"
        look={look}
        blink={blink}
      />
    </motion.div>
  );
}

function DownloadButton({ release }: { release: Release }) {
  const [phase, setPhase] = useState<"idle" | "starting" | "started">("idle");
  const timer = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => () => {
    if (timer.current) clearTimeout(timer.current);
  }, []);

  const label =
    phase === "starting"
      ? "Starting download…"
      : phase === "started"
        ? "Downloading"
        : "Download for Mac";

  return (
    <a
      href={release.url}
      onClick={() => {
        capture("download_clicked", { version: release.version });
        if (timer.current) clearTimeout(timer.current);
        setPhase("starting");
        timer.current = setTimeout(() => setPhase("started"), 1600);
      }}
      data-phase={phase}
      aria-live="polite"
      className="cta-shine group relative inline-flex h-14 min-w-[252px] items-center justify-center gap-2.5 overflow-hidden rounded-[48px] bg-coal-ink px-7 text-[16px] font-semibold tracking-[-0.01em] text-white transition-[transform,box-shadow,background-color] duration-200 hover:-translate-y-px active:scale-[0.98] data-[phase=started]:bg-mint-pulse data-[phase=started]:before:hidden"
      style={{
        boxShadow:
          "inset 0 1px 0 rgba(255,255,255,0.12), 0 8px 24px rgba(28,26,23,0.22)",
      }}
    >
      {/* The fill that sweeps across while the browser picks the file up. */}
      <span
        aria-hidden
        className="absolute inset-0 origin-left scale-x-0 bg-gradient-to-r from-[#2d2a25] to-[#3a362f] group-data-[phase=starting]:animate-[download-fill_1.6s_cubic-bezier(0.23,1,0.32,1)_forwards] group-data-[phase=started]:hidden"
      />
      <span className="relative inline-flex items-center gap-2.5">
        <AppleIcon className="h-[17px] w-[17px]" />
        {label}
      </span>
    </a>
  );
}

function SendButton() {
  const { pending } = useFormStatus();
  return (
    <button
      type="submit"
      disabled={pending}
      className="shrink-0 cursor-pointer rounded-[48px] bg-coal-ink px-5 py-3 text-[14px] font-semibold text-white transition-colors hover:bg-graphite disabled:opacity-60"
    >
      {pending ? "Sending…" : "Email me the link"}
    </button>
  );
}

const initialState: WaitlistState = { status: "idle", message: "" };

function NotOnAMac() {
  const [state, formAction] = useActionState(requestDownloadLink, initialState);

  useEffect(() => {
    if (state.status === "success") capture("download_link_requested");
  }, [state.status]);

  if (state.status === "success") {
    return (
      <p className="text-[15px] text-slate-mid">
        We&apos;ll send the link to{" "}
        <span className="font-medium text-coal-ink">{state.email}</span>. Open
        it on your Mac.
      </p>
    );
  }

  return (
    <div className="flex w-full max-w-[440px] flex-col items-center gap-3">
      <p className="font-display text-[18px] font-bold tracking-[-0.02em] text-coal-ink">
        Jarvis is a Mac app.
      </p>
      <p className="text-[14px] text-slate-mid">
        It needs a Mac with Apple silicon. We&apos;ll email you the link to open
        there.
      </p>
      <form
        action={formAction}
        className="mt-1 flex w-full gap-2 rounded-[48px] bg-white p-1.5"
        style={{
          boxShadow:
            "rgba(95,99,106,0.08) 0px 0px 0px 1px, rgba(43,43,48,0.1) 0px 1px 4px 0px",
        }}
      >
        <label htmlFor="download-email" className="sr-only">
          Email
        </label>
        <input
          id="download-email"
          name="email"
          type="email"
          required
          autoComplete="email"
          placeholder="you@company.com"
          className="min-w-0 flex-1 bg-transparent px-4 text-[15px] text-coal-ink outline-none placeholder:text-stone"
        />
        {/* Honeypot, same as the waitlist form. */}
        <input
          type="text"
          name="company_website"
          tabIndex={-1}
          autoComplete="off"
          aria-hidden
          className="hidden"
        />
        {Object.entries(attributionFields()).map(([name, value]) => (
          <input key={name} type="hidden" name={name} value={value} />
        ))}
        <SendButton />
      </form>
      {state.status === "error" && (
        <p role="alert" className="text-[13px] text-destructive">
          {state.message}
        </p>
      )}
    </div>
  );
}

export function DownloadHero({ release }: { release: Release }) {
  const reduce = useReducedMotion();
  const isMac = useIsMac();

  return (
    <section className="relative isolate overflow-hidden">
      {/* The page's one light: the homepage's paper glow, drifting slowly. */}
      <div
        aria-hidden
        className="download-glow pointer-events-none absolute left-[10%] right-[10%] top-[-40px] -z-10 h-[560px]"
      />

      <div className="mx-auto flex max-w-5xl flex-col items-center gap-6 px-5 pb-28 pt-12 text-center sm:px-6 sm:pb-32 sm:pt-16">
        <MarkPlate />

        <h1 className="font-display text-[44px] font-bold leading-[0.98] tracking-[-0.045em] text-coal-ink text-balance sm:text-[64px] lg:text-[84px]">
          {WORDS.map((word, i) => (
            <span key={word.text}>
              <motion.span
                className={
                  "inline-block " + (word.soft ? "text-[#b9b7b3]" : "")
                }
                initial={
                  reduce ? false : { opacity: 0, y: "0.35em", filter: "blur(6px)" }
                }
                animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
                transition={{ duration: 0.7, delay: 0.08 + i * 0.09, ease: EASE }}
              >
                {word.text}
              </motion.span>
              {i < WORDS.length - 1 && " "}
            </span>
          ))}
        </h1>

        <motion.p
          initial={reduce ? false : { opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.4, ease: EASE }}
          className="max-w-[48ch] text-[17px] leading-[1.6] text-slate-mid text-pretty"
        >
          One download. Jarvis reads Slack, Gmail and your calendar and opens on
          one sentence about your day.
        </motion.p>

        <motion.div
          initial={reduce ? false : { opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.52, ease: EASE }}
          className="mt-2 flex w-full flex-col items-center"
        >
          {isMac === false ? <NotOnAMac /> : <DownloadButton release={release} />}
        </motion.div>
      </div>
    </section>
  );
}

function AppleIcon({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" aria-hidden className={className}>
      <path
        fill="currentColor"
        d="M16.37 12.6c-.02-2.2 1.8-3.26 1.88-3.31-1.03-1.5-2.62-1.7-3.19-1.72-1.36-.14-2.65.8-3.34.8-.69 0-1.75-.78-2.88-.76-1.48.02-2.85.86-3.61 2.19-1.54 2.67-.39 6.62 1.11 8.79.73 1.06 1.61 2.25 2.75 2.2 1.1-.04 1.52-.71 2.86-.71 1.33 0 1.71.71 2.88.69 1.19-.02 1.94-1.08 2.67-2.14.84-1.23 1.19-2.42 1.21-2.48-.03-.01-2.32-.89-2.34-3.55zM14.18 6.13c.61-.74 1.02-1.76.91-2.78-.88.04-1.94.59-2.57 1.32-.56.65-1.06 1.69-.93 2.69.98.08 1.98-.5 2.59-1.23z"
      />
    </svg>
  );
}
